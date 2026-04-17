import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { AuditService } from '../audit/audit.service';
import type { AuthUser } from '../../infrastructure/common/interfaces/auth-user.interface';
import {
  Attachment,
  ProjectUser,
  Task,
  TaskAssignment,
  TaskAssignmentResponse,
  TaskComment,
  TaskCompletion,
  TaskHistory,
  TaskFilterRow,
  TaskPriority,
  TaskStatus,
} from '../../infrastructure/persistence/typeorm/entities';
import { MESSAGES } from '../../infrastructure/common/constants/messages';
import { sanitizeRichHtml } from '../../infrastructure/common/utils/rich-text';
import { AddAttachmentDto } from './dto/add-attachment.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { BulkTasksDto } from './dto/bulk-tasks.dto';
import { CommentTaskDto } from './dto/comment-task.dto';
import { CompleteTaskDto } from './dto/complete-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskAttachmentsService } from './task-attachments.service';
import {
  enforceTaskCompleteScope,
  enforceTaskDeleteScope,
  enforceTaskWriteScope,
} from './utils/task-access';
import { ALLOWED_TASK_PRIORITY_CODES } from './constants/task.constants';
import { TasksQueriesRepository } from './tasks-queries.repository';
import { ProjectFiltersService } from '../project-filters/project-filters.service';

@Injectable()
export class TasksCommandsService {
  private readonly logger = new Logger(TasksCommandsService.name);

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(TaskStatus)
    private readonly taskStatusRepository: Repository<TaskStatus>,
    @InjectRepository(TaskAssignment)
    private readonly taskAssignmentRepository: Repository<TaskAssignment>,
    @InjectRepository(TaskCompletion)
    private readonly taskCompletionRepository: Repository<TaskCompletion>,
    @InjectRepository(TaskComment)
    private readonly taskCommentRepository: Repository<TaskComment>,
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
    @InjectRepository(ProjectUser)
    private readonly projectUserRepository: Repository<ProjectUser>,
    @InjectRepository(TaskPriority)
    private readonly taskPriorityRepository: Repository<TaskPriority>,
    private readonly taskAttachments: TaskAttachmentsService,
    private readonly audit: AuditService,
    private readonly queries: TasksQueriesRepository,
    private readonly projectFilters: ProjectFiltersService,
  ) {}

  async create(dto: CreateTaskDto, user: AuthUser) {
    await this.assertProjectMembership(user, dto.projectId);
    if (dto.priorityId) {
      await this.assertAllowedPriorityId(dto.priorityId);
    }
    const assignedIds = Array.from(
      new Set(
        (dto.assignedToUserIds?.length
          ? dto.assignedToUserIds
          : dto.assignedToUserId
            ? [dto.assignedToUserId]
            : []
        ).filter((x): x is string => Boolean(x)),
      ),
    );

    const task = this.taskRepository.create({
      title: dto.title.trim(),
      projectId: dto.projectId,
      statusId: dto.statusId,
      priorityId: dto.priorityId ?? null,
      createdByUserId: user.id,
      assignedToUserId: assignedIds[0] ?? null,
      description: sanitizeRichHtml(dto.description),
      notes: dto.notes ?? null,
      dueAt: dto.dueAt ? new Date(dto.dueAt) : null,
      createdBy: user.id,
      updatedBy: user.id,
    });
    const saved = await this.taskRepository.save(task);

    await this.projectFilters.replaceTaskFilters(
      saved.id,
      dto.projectId,
      dto.taskFilterValues,
    );

    const taskHistory = this.taskHistoryRepository.create({
      taskId: saved.id,
      oldStatusId: null,
      newStatusId: dto.statusId,
      oldAssigneeUserId: null,
      newAssigneeUserId: assignedIds[0] ?? null,
      changeReason: 'task_created',
      changedBy: user.id,
      createdBy: user.id,
      updatedBy: user.id,
    });
    await this.taskHistoryRepository.save(taskHistory);

    if (assignedIds.length) {
      const rows = assignedIds.map((assigneeUserId) =>
        this.taskAssignmentRepository.create({
          taskId: saved.id,
          assigneeUserId,
          assignedByUserId: user.id,
          notes: dto.notes ?? null,
          createdBy: user.id,
          updatedBy: user.id,
        }),
      );
      await this.taskAssignmentRepository.save(rows);
    }

    await this.audit.log({
      tableName: 'tasks',
      recordId: saved.id,
      actionType: 'CREATE',
      oldValue: null,
      newValue: task,
      performedBy: user.id,
    });

    return this.queries.getById(saved.id, user);
  }

  async update(id: string, dto: UpdateTaskDto, user: AuthUser) {
    const existing = await this.queries.getById(id, user);
    enforceTaskWriteScope(user, existing);

    if (dto.projectId) {
      await this.assertProjectMembership(user, dto.projectId);
    }
    if (dto.priorityId) {
      await this.assertAllowedPriorityId(dto.priorityId);
    }
    const nextAssignedIds = Array.from(
      new Set(
        (dto.assignedToUserIds?.length
          ? dto.assignedToUserIds
          : dto.assignedToUserId
            ? [dto.assignedToUserId]
            : []
        ).filter((x): x is string => Boolean(x)),
      ),
    );

    await this.taskRepository.update(id, {
      title: dto.title?.trim() ?? undefined,
      projectId: dto.projectId ?? undefined,
      statusId: dto.statusId ?? undefined,
      priorityId: dto.priorityId ?? undefined,
      // level/trade removed (dynamic filters only)
      assignedToUserId: nextAssignedIds[0] ?? null,
      description: dto.description
        ? sanitizeRichHtml(dto.description)
        : undefined,
      notes: dto.notes ?? undefined,
      dueAt: dto.dueAt
        ? new Date(dto.dueAt)
        : dto.dueAt === null
          ? null
          : undefined,
      updatedBy: user.id,
    } as any);

    if (dto.taskFilterValues !== undefined) {
      const nextProjectId = dto.projectId ?? existing.project_id;
      await this.projectFilters.replaceTaskFilters(
        id,
        nextProjectId,
        dto.taskFilterValues,
      );
    }

    // Replace assignments if provided.
    if (dto.assignedToUserIds || dto.assignedToUserId) {
      await this.taskAssignmentRepository
        .createQueryBuilder()
        .softDelete()
        .where('"task_id" = :taskId', { taskId: id })
        .execute();
      if (nextAssignedIds.length) {
        const rows = nextAssignedIds.map((assigneeUserId) =>
          this.taskAssignmentRepository.create({
            taskId: id,
            assigneeUserId,
            assignedByUserId: user.id,
            notes: dto.notes ?? null,
            createdBy: user.id,
            updatedBy: user.id,
          }),
        );
        await this.taskAssignmentRepository.save(rows);
      }
    }

    await this.taskHistoryRepository.save(
      this.taskHistoryRepository.create({
        taskId: id,
        oldStatusId: existing.status_id,
        newStatusId: dto.statusId ?? existing.status_id,
        oldAssigneeUserId: existing.assigned_to_user_id ?? null,
        newAssigneeUserId:
          nextAssignedIds[0] ?? existing.assigned_to_user_id ?? null,
        changeReason: 'task_updated',
        changedBy: user.id,
        createdBy: user.id,
        updatedBy: user.id,
        metadata: {
          assignedToUserIds: nextAssignedIds.length
            ? nextAssignedIds
            : undefined,
        },
      } as any),
    );

    await this.audit.log({
      tableName: 'tasks',
      recordId: id,
      actionType: 'UPDATE',
      oldValue: existing,
      newValue: dto,
      performedBy: user.id,
    });

    return this.queries.getById(id, user);
  }

  async delete(
    id: string,
    user: AuthUser,
    meta?: {
      ipAddress?: string | null;
      requestId?: string | null;
      userAgent?: string | null;
    },
  ) {
    const existing = await this.queries.getById(id, user);
    enforceTaskDeleteScope(user, existing);

    const deletedStatus = await this.taskStatusRepository.findOne({
      where: { code: 'deleted', deletedAt: IsNull() },
      select: { id: true },
    });
    if (!deletedStatus) {
      throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);
    }

    await this.taskRepository.manager.transaction(async (em) => {
      const taskRepo = em.getRepository(Task);
      const assignmentRepo = em.getRepository(TaskAssignment);
      const assignmentResponseRepo = em.getRepository(TaskAssignmentResponse);
      const completionRepo = em.getRepository(TaskCompletion);
      const commentRepo = em.getRepository(TaskComment);
      const historyRepo = em.getRepository(TaskHistory);
      const filterValueRepo = em.getRepository(TaskFilterRow);
      const attachmentRepo = em.getRepository(Attachment);

      await taskRepo.softDelete(id);
      await taskRepo.update(id, {
        updatedBy: user.id,
        statusId: deletedStatus.id,
      });

      const assignments = await assignmentRepo.find({
        where: { taskId: id, deletedAt: IsNull() },
        select: { id: true },
      });
      const assignmentIds = assignments.map((a) => a.id);
      if (assignmentIds.length) {
        await assignmentResponseRepo
          .createQueryBuilder()
          .softDelete()
          .where('"assignment_id" IN (:...assignmentIds)', { assignmentIds })
          .execute();
      }

      await assignmentRepo
        .createQueryBuilder()
        .softDelete()
        .where('"task_id" = :taskId', { taskId: id })
        .execute();

      await completionRepo
        .createQueryBuilder()
        .softDelete()
        .where('"task_id" = :taskId', { taskId: id })
        .execute();

      await commentRepo
        .createQueryBuilder()
        .softDelete()
        .where('"task_id" = :taskId', { taskId: id })
        .execute();

      await historyRepo
        .createQueryBuilder()
        .softDelete()
        .where('"task_id" = :taskId', { taskId: id })
        .execute();

      await filterValueRepo
        .createQueryBuilder()
        .softDelete()
        .where('"task_id" = :taskId', { taskId: id })
        .execute();

      await attachmentRepo
        .createQueryBuilder()
        .softDelete()
        .where('"task_id" = :taskId', { taskId: id })
        .execute();
    });

    await this.audit.log({
      tableName: 'tasks',
      recordId: id,
      actionType: 'DELETE',
      oldValue: existing,
      newValue: null,
      performedBy: user.id,
      ipAddress: meta?.ipAddress ?? null,
      requestId: meta?.requestId ?? null,
      userAgent: meta?.userAgent ?? null,
    });

    return { deleted: true, message: MESSAGES.TASKS.DELETED };
  }

  async assign(
    id: string,
    dto: AssignTaskDto,
    user: AuthUser,
    meta?: {
      ipAddress?: string | null;
      requestId?: string | null;
      userAgent?: string | null;
    },
  ) {
    const existing = await this.queries.getById(id, user);
    enforceTaskWriteScope(user, existing);

    const anyDto = dto as any;
    const assignedIds: string[] = Array.from(
      new Set(
        (Array.isArray(anyDto.assignedToUserIds)
          ? anyDto.assignedToUserIds
          : [dto.assigneeUserId]
        ).filter(
          (x): x is string => typeof x === 'string' && x.trim().length > 0,
        ),
      ),
    );

    await this.taskRepository.update(id, {
      assignedToUserId: (assignedIds[0] ?? null) as any,
      updatedBy: user.id,
    } as any);

    await this.taskAssignmentRepository
      .createQueryBuilder()
      .softDelete()
      .where('"task_id" = :taskId', { taskId: id })
      .execute();

    if (assignedIds.length) {
      const rows = assignedIds.map((assigneeUserId: string) => ({
        taskId: id,
        assigneeUserId,
        assignedByUserId: user.id,
        notes: dto.notes ?? null,
        createdBy: user.id,
        updatedBy: user.id,
      }));
      await this.taskAssignmentRepository.save(rows as any);
    }

    await this.taskHistoryRepository.save(
      this.taskHistoryRepository.create({
        taskId: id,
        oldStatusId: existing.status_id,
        newStatusId: existing.status_id,
        oldAssigneeUserId: existing.assigned_to_user_id ?? null,
        newAssigneeUserId: assignedIds[0] ?? null,
        changeReason: 'task_assigned',
        changedBy: user.id,
        createdBy: user.id,
        updatedBy: user.id,
        metadata: { assignedToUserIds: assignedIds },
      } as any),
    );

    await this.audit.log({
      tableName: 'tasks',
      recordId: id,
      actionType: 'UPDATE',
      oldValue: existing,
      newValue: dto,
      performedBy: user.id,
      ipAddress: meta?.ipAddress ?? null,
      requestId: meta?.requestId ?? null,
      userAgent: meta?.userAgent ?? null,
    });

    return this.queries.getById(id, user);
  }

  async complete(id: string, dto: CompleteTaskDto, user: AuthUser) {
    const existing = await this.queries.getById(id, user);
    enforceTaskCompleteScope(user, existing);

    const completedStatus = await this.taskStatusRepository.findOne({
      where: { code: 'completed', deletedAt: IsNull() },
      select: { id: true },
    });
    if (!completedStatus) {
      throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);
    }

    await this.taskRepository.manager.transaction(async (em) => {
      const taskRepo = em.getRepository(Task);
      const completionRepo = em.getRepository(TaskCompletion);

      await taskRepo.update(id, {
        statusId: completedStatus.id,
        closedAt: new Date(),
        updatedBy: user.id,
      });

      await completionRepo.save(
        completionRepo.create({
          taskId: id,
          completedByUserId: user.id,
          notes: dto.notes ?? null,
          durationDays: existing.days_open ?? 0,
          createdBy: user.id,
          updatedBy: user.id,
        }),
      );
    });

    await this.taskHistoryRepository.save(
      this.taskHistoryRepository.create({
        taskId: id,
        oldStatusId: existing.status_id,
        newStatusId: completedStatus.id,
        oldAssigneeUserId: existing.assigned_to_user_id ?? null,
        newAssigneeUserId: existing.assigned_to_user_id ?? null,
        changeReason: 'task_completed',
        changedBy: user.id,
        createdBy: user.id,
        updatedBy: user.id,
      } as any),
    );

    await this.audit.log({
      tableName: 'tasks',
      recordId: id,
      actionType: 'UPDATE',
      oldValue: existing,
      newValue: { completed: true },
      performedBy: user.id,
    });

    return this.queries.getById(id, user);
  }

  async addComment(
    taskId: string,
    dto: CommentTaskDto,
    user: AuthUser,
    files?: Array<Express.Multer.File>,
  ) {
    await this.queries.getById(taskId, user);
    const comment = this.taskCommentRepository.create({
      taskId,
      comment: sanitizeRichHtml(dto.comment),
      createdBy: user.id,
      updatedBy: user.id,
    });
    const saved = await this.taskCommentRepository.save(comment);

    const uploads = Array.isArray(files) ? files : [];
    if (uploads.length) {
      for (const f of uploads) {
        const fileUrl = `/v1/files/${f.filename}`;
        const fileType = /^image\//i.test(f.mimetype) ? 'image' : 'file';
        await this.taskAttachments.addOneFromDto(
          taskId,
          {
            fileUrl,
            fileName: f.originalname,
            fileType,
            mimeType: f.mimetype,
            fileSize: f.size,
            isBefore: false,
            isAfter: false,
          },
          user.id,
        );
      }
    }
    return {
      id: saved.id,
      commentAdded: true,
      message: MESSAGES.TASKS.UPDATED,
    };
  }

  async updateStatus(
    id: string,
    dto: UpdateTaskStatusDto,
    user: AuthUser,
    meta?: {
      ipAddress?: string | null;
      requestId?: string | null;
      userAgent?: string | null;
    },
  ) {
    const existing = await this.queries.getById(id, user);
    enforceTaskWriteScope(user, existing);

    const statusName = String(dto.status ?? '').trim();
    const status = await this.taskStatusRepository.findOne({
      where: { name: statusName, deletedAt: IsNull() },
      select: { id: true, code: true, name: true },
    });
    if (!status) {
      throw new BadRequestException(
        MESSAGES.TASK_VALIDATION.STATUS_NAME_INVALID,
      );
    }

    const oldStatusId = existing.status_id;
    await this.taskRepository.update(id, {
      statusId: status.id,
      updatedBy: user.id,
    });

    await this.taskHistoryRepository.save(
      this.taskHistoryRepository.create({
        taskId: id,
        oldStatusId,
        newStatusId: status.id,
        oldAssigneeUserId: existing.assigned_to_user_id ?? null,
        newAssigneeUserId: existing.assigned_to_user_id ?? null,
        changeReason: 'task_status_changed',
        changedBy: user.id,
        createdBy: user.id,
        updatedBy: user.id,
      } as any),
    );

    await this.audit.log({
      tableName: 'tasks',
      recordId: id,
      actionType: 'UPDATE',
      oldValue: {
        statusId: oldStatusId,
        statusName: existing.status_name,
        statusCode: existing.status_code,
      },
      newValue: {
        statusId: status.id,
        statusName: status.name,
        statusCode: status.code,
      },
      performedBy: user.id,
      ipAddress: meta?.ipAddress ?? null,
      requestId: meta?.requestId ?? null,
      userAgent: meta?.userAgent ?? null,
    });

    return this.queries.getById(id, user);
  }

  async getAttachments(taskId: string, user: AuthUser) {
    return this.queries.getAttachments(taskId, user);
  }

  async addAttachment(taskId: string, dto: AddAttachmentDto, user: AuthUser) {
    await this.queries.getById(taskId, user);
    await this.taskAttachments.addOneFromDto(taskId, dto, user.id);
    return { taskId, attachmentAdded: true, message: MESSAGES.TASKS.UPDATED };
  }

  async bulkComplete(dto: BulkTasksDto, user: AuthUser) {
    const results: Array<{
      id: string;
      status: 'success' | 'error';
      message?: string;
    }> = [];
    for (const id of dto.ids) {
      try {
        await this.complete(id, { notes: 'Bulk completion' }, user);
        results.push({ id, status: 'success' });
      } catch (error) {
        this.logger.error(
          `Bulk complete failed for task ${id}`,
          error as Error,
        );
        results.push({
          id,
          status: 'error',
          message: MESSAGES.TASKS.BULK_ITEM_FAILED,
        });
      }
    }
    return results;
  }

  async bulkDelete(dto: BulkTasksDto, user: AuthUser) {
    const results: Array<{
      id: string;
      status: 'success' | 'error';
      message?: string;
    }> = [];
    for (const id of dto.ids) {
      try {
        await this.delete(id, user);
        results.push({ id, status: 'success' });
      } catch (error) {
        this.logger.error(`Bulk delete failed for task ${id}`, error as Error);
        results.push({
          id,
          status: 'error',
          message: MESSAGES.TASKS.BULK_ITEM_FAILED,
        });
      }
    }
    return results;
  }

  private async assertProjectMembership(
    user: AuthUser,
    projectId: string,
  ): Promise<void> {
    if (user.role === 'super_admin') return;
    const membership = await this.projectUserRepository.findOne({
      where: { projectId, userId: user.id, deletedAt: IsNull() },
      select: { id: true },
    });
    if (!membership) {
      throw new ForbiddenException(MESSAGES.COMMON.FORBIDDEN);
    }
  }

  private async assertAllowedPriorityId(priorityId: string): Promise<void> {
    const row = await this.taskPriorityRepository.findOne({
      where: { id: priorityId, deletedAt: IsNull() },
      select: { id: true, code: true },
    });
    if (!row) {
      throw new BadRequestException(
        MESSAGES.TASK_VALIDATION.PRIORITY_ID_INVALID,
      );
    }
    if (!ALLOWED_TASK_PRIORITY_CODES.has(String(row.code).toLowerCase())) {
      throw new BadRequestException(
        MESSAGES.TASK_VALIDATION.PRIORITY_NOT_ALLOWED,
      );
    }
  }
}
