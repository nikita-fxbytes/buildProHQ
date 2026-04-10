import {
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
  TaskComment,
  TaskCompletion,
  TaskHistory,
  TaskStatus,
} from '../../infrastructure/persistence/typeorm/entities';
import { AddAttachmentDto } from './dto/add-attachment.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { CommentTaskDto } from './dto/comment-task.dto';
import { CompleteTaskDto } from './dto/complete-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { BulkTasksDto } from './dto/bulk-tasks.dto';
import { MESSAGES } from '../../infrastructure/common/constants/messages';
import { SearchOpenTasksDto } from './dto/search-open-tasks.dto';
import { SearchCompletedTasksDto } from './dto/search-completed-tasks.dto';
import { TaskAttachmentsService } from './task-attachments.service';
import { sanitizeRichHtml } from '../../infrastructure/common/utils/rich-text';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

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
    private readonly taskAttachments: TaskAttachmentsService,
    private readonly audit: AuditService,
  ) {}

  async searchOpen(user: AuthUser, dto: SearchOpenTasksDto) {
    return this.searchTerminalTasksPaged(
      user,
      dto,
      false,
      {
        sortMap: {
          createdAt: { column: 't.created_at' },
          daysOpen: { column: 't.days_open' },
          level: { column: 'lv.name' },
          trade: { column: 'tr.name' },
          priority: { column: 'tp.name' },
          description: { column: 't.description' },
          user: { column: 'uc.full_name' },
        },
        defaultSortBy: 'createdAt',
        defaultSortOrder: (key: string) =>
          key === 'createdAt' ? 'desc' : 'asc',
      },
      MESSAGES.TASKS.OPEN_LIST_FETCHED,
    );
  }

  async listCompleted(user: AuthUser, query: QueryTasksDto) {
    return this.listByTerminalState(user, query, true);
  }

  async searchCompleted(user: AuthUser, dto: SearchCompletedTasksDto) {
    return this.searchCompletedByTerminalState(user, dto);
  }

  async getById(id: string, user: AuthUser) {
    const row = await this.taskRepository
      .createQueryBuilder('t')
      .innerJoin('task_statuses', 'ts', 'ts.id = t.status_id')
      .leftJoin('task_priorities', 'tp', 'tp.id = t.priority_id')
      .leftJoin('trades', 'tr', 'tr.id = t.trade_id')
      .leftJoin('levels', 'lv', 'lv.id = t.level_id')
      .select([
        't.id AS id',
        't.status_id AS status_id',
        't.priority_id AS priority_id',
        't.level_id AS level_id',
        't.trade_id AS trade_id',
        't.created_by_user_id AS created_by_user_id',
        't.assigned_to_user_id AS assigned_to_user_id',
        't.description AS description',
        't.notes AS notes',
        't.opened_at AS opened_at',
        't.closed_at AS closed_at',
        't.days_open AS days_open',
        't.created_at AS created_at',
        't.updated_at AS updated_at',
        'ts.code AS status_code',
        'ts.name AS status_name',
        'tp.name AS priority_name',
        'tr.name AS trade_name',
        'lv.name AS level_name',
      ])
      .where('t.id = :id', { id })
      .andWhere('t.deleted_at IS NULL')
      .getRawOne<any>();

    if (!row) {
      throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);
    }
    this.enforceTaskReadScope(user, row);
    return row;
  }

  async create(dto: CreateTaskDto, user: AuthUser) {
    if (user.role !== 'super_admin') {
      const membership = await this.projectUserRepository.findOne({
        where: {
          projectId: dto.projectId,
          userId: user.id,
          deletedAt: IsNull(),
        },
        select: { id: true },
      });
      if (!membership) {
        throw new ForbiddenException(MESSAGES.COMMON.FORBIDDEN);
      }
    }

    const task = this.taskRepository.create({
      projectId: dto.projectId,
      statusId: dto.statusId,
      priorityId: dto.priorityId ?? null,
      levelId: dto.levelId,
      tradeId: dto.tradeId,
      createdByUserId: user.id,
      assignedToUserId: dto.assignedToUserId ?? null,
      description: sanitizeRichHtml(dto.description),
      notes: dto.notes ?? null,
      createdBy: user.id,
      updatedBy: user.id,
    });
    const saved = await this.taskRepository.save(task);

    const taskHistory = this.taskHistoryRepository.create({
      taskId: saved.id,
      oldStatusId: null,
      newStatusId: dto.statusId,
      oldAssigneeUserId: null,
      newAssigneeUserId: dto.assignedToUserId ?? null,
      changeReason: 'task_created',
      changedBy: user.id,
      createdBy: user.id,
      updatedBy: user.id,
    });
    await this.taskHistoryRepository.save(taskHistory);

    if (dto.assignedToUserId) {
      const assignment = this.taskAssignmentRepository.create({
        taskId: saved.id,
        assigneeUserId: dto.assignedToUserId,
        assignedByUserId: user.id,
        notes: dto.notes ?? null,
        createdBy: user.id,
        updatedBy: user.id,
      });
      await this.taskAssignmentRepository.save(assignment);
    }

    await this.audit.log({
      tableName: 'tasks',
      recordId: saved.id,
      actionType: 'CREATE',
      newValue: dto,
      performedBy: user.id,
    });

    return this.getById(saved.id, user);
  }

  async update(id: string, dto: UpdateTaskDto, user: AuthUser) {
    const existing = await this.getById(id, user);
    this.enforceTaskWriteScope(user, existing);

    const oldStatusId = existing.status_id as string | null;
    const oldAssigneeId = existing.assigned_to_user_id as string | null;

    const updatePayload: Partial<Task> = {
      updatedBy: user.id,
    };
    if (dto.statusId !== undefined) updatePayload.statusId = dto.statusId;
    if (dto.priorityId !== undefined) updatePayload.priorityId = dto.priorityId;
    if (dto.levelId !== undefined) updatePayload.levelId = dto.levelId;
    if (dto.tradeId !== undefined) updatePayload.tradeId = dto.tradeId;
    if (dto.assignedToUserId !== undefined)
      updatePayload.assignedToUserId = dto.assignedToUserId;
    if (dto.description !== undefined)
      updatePayload.description = sanitizeRichHtml(dto.description);
    if (dto.notes !== undefined) updatePayload.notes = dto.notes;

    await this.taskRepository.update(id, updatePayload);

    if (dto.statusId !== undefined || dto.assignedToUserId !== undefined) {
      const history = this.taskHistoryRepository.create({
        taskId: id,
        oldStatusId,
        newStatusId: dto.statusId ?? oldStatusId,
        oldAssigneeUserId: oldAssigneeId,
        newAssigneeUserId: dto.assignedToUserId ?? oldAssigneeId,
        changeReason: 'task_updated',
        changedBy: user.id,
        createdBy: user.id,
        updatedBy: user.id,
      });
      await this.taskHistoryRepository.save(history);
    }

    await this.audit.log({
      tableName: 'tasks',
      recordId: id,
      actionType: 'UPDATE',
      oldValue: existing,
      newValue: dto,
      performedBy: user.id,
    });

    return this.getById(id, user);
  }

  async delete(id: string, user: AuthUser) {
    const existing = await this.getById(id, user);
    this.enforceTaskDeleteScope(user, existing);

    const deletedStatus = await this.taskStatusRepository.findOne({
      where: { code: 'deleted', deletedAt: IsNull() },
      select: { id: true },
    });
    if (!deletedStatus) {
      throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);
    }

    await this.taskRepository.softDelete(id);
    await this.taskRepository.update(id, {
      updatedBy: user.id,
      statusId: deletedStatus.id,
    });

    await this.audit.log({
      tableName: 'tasks',
      recordId: id,
      actionType: 'DELETE',
      oldValue: existing,
      performedBy: user.id,
    });

    return { id, deleted: true };
  }

  async assign(id: string, dto: AssignTaskDto, user: AuthUser) {
    const existing = await this.getById(id, user);
    this.enforceTaskWriteScope(user, existing);

    await this.taskRepository.update(id, {
      assignedToUserId: dto.assigneeUserId,
      updatedBy: user.id,
    });

    const assignment = this.taskAssignmentRepository.create({
      taskId: id,
      assigneeUserId: dto.assigneeUserId,
      assignedByUserId: user.id,
      notes: dto.notes ?? null,
      createdBy: user.id,
      updatedBy: user.id,
    });
    await this.taskAssignmentRepository.save(assignment);

    const history = this.taskHistoryRepository.create({
      taskId: id,
      oldAssigneeUserId: existing.assigned_to_user_id ?? null,
      newAssigneeUserId: dto.assigneeUserId,
      changeReason: 'task_assigned',
      changedBy: user.id,
      createdBy: user.id,
      updatedBy: user.id,
    });
    await this.taskHistoryRepository.save(history);

    await this.audit.log({
      tableName: 'task_assignments',
      recordId: assignment.id,
      actionType: 'CREATE',
      newValue: dto,
      performedBy: user.id,
    });

    return this.getById(id, user);
  }

  async complete(id: string, dto: CompleteTaskDto, user: AuthUser) {
    const existing = await this.getById(id, user);
    this.enforceTaskCompleteScope(user, existing);

    const completedStatus = await this.taskStatusRepository.findOne({
      where: { code: 'completed', deletedAt: IsNull() },
      select: { id: true },
    });
    if (!completedStatus) {
      throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);
    }
    const durationDays = this.daysBetween(
      existing.opened_at as string,
      new Date().toISOString(),
    );

    await this.taskRepository.update(id, {
      statusId: completedStatus.id,
      closedAt: new Date(),
      daysOpen: durationDays,
      updatedBy: user.id,
    });

    const completion = this.taskCompletionRepository.create({
      taskId: id,
      completedByUserId: user.id,
      notes: dto.notes ?? null,
      durationDays,
      gpsLocation: dto.gps ?? null,
      createdBy: user.id,
      updatedBy: user.id,
    });
    await this.taskCompletionRepository.save(completion);

    if (dto.photos && dto.photos.length > 0) {
      await this.taskAttachments.addAfterPhotosFromUrls(
        id,
        dto.photos,
        user.id,
      );
    }

    const history = this.taskHistoryRepository.create({
      taskId: id,
      oldStatusId: existing.status_id,
      newStatusId: completedStatus.id,
      changeReason: 'task_completed',
      changedBy: user.id,
      createdBy: user.id,
      updatedBy: user.id,
    });
    await this.taskHistoryRepository.save(history);

    await this.audit.log({
      tableName: 'task_completions',
      recordId: completion.id,
      actionType: 'CREATE',
      newValue: { taskId: id, completedBy: user.id },
      performedBy: user.id,
    });

    return this.getById(id, user);
  }

  async addComment(taskId: string, dto: CommentTaskDto, user: AuthUser) {
    await this.getById(taskId, user);
    const row = this.taskCommentRepository.create({
      taskId,
      comment: dto.comment,
      createdBy: user.id,
      updatedBy: user.id,
    });
    await this.taskCommentRepository.save(row);
    return { taskId, commentAdded: true, message: MESSAGES.TASKS.UPDATED };
  }

  async getHistory(taskId: string, user: AuthUser) {
    await this.getById(taskId, user);
    return this.taskHistoryRepository.find({
      where: { taskId, deletedAt: IsNull() },
      order: { changedAt: 'DESC', id: 'DESC' },
    });
  }

  async getAttachments(taskId: string, user: AuthUser) {
    await this.getById(taskId, user);
    return this.attachmentRepository.find({
      where: { taskId, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async addAttachment(taskId: string, dto: AddAttachmentDto, user: AuthUser) {
    await this.getById(taskId, user);
    await this.taskAttachments.addOneFromDto(taskId, dto, user.id);
    return { taskId, attachmentAdded: true, message: MESSAGES.TASKS.UPDATED };
  }

  async getStats(user: AuthUser) {
    const qb = this.taskRepository
      .createQueryBuilder('t')
      .innerJoin('task_statuses', 'ts', 'ts.id = t.status_id')
      .leftJoin('task_priorities', 'tp', 'tp.id = t.priority_id')
      .where('t.deleted_at IS NULL');

    if (user.role === 'trade_user') {
      qb.andWhere('t.assigned_to_user_id = :userId', { userId: user.id });
    } else if (user.role === 'field_user') {
      qb.andWhere(
        '(t.created_by_user_id = :userId OR t.assigned_to_user_id = :userId)',
        { userId: user.id },
      );
    }

    const [
      totalOpen,
      totalCompleted,
      urgent,
      overdue,
      overdue10,
      midRange7to10,
      fresh0to6,
      tradesActiveRaw,
    ] = await Promise.all([
      qb.clone().andWhere('ts.is_terminal = :isTerminal', { isTerminal: false }).getCount(),
      qb.clone().andWhere('ts.is_terminal = :isTerminal', { isTerminal: true }).getCount(),
      qb
        .clone()
        .andWhere('ts.is_terminal = :isTerminal', { isTerminal: false })
        .andWhere('tp.code = :priority', { priority: 'critical' })
        .getCount(),
      qb
        .clone()
        .andWhere('ts.is_terminal = :isTerminal', { isTerminal: false })
        .andWhere('t.days_open > 7')
        .getCount(),
      qb
        .clone()
        .andWhere('ts.is_terminal = :isTerminal', { isTerminal: false })
        .andWhere('t.days_open > 10')
        .getCount(),
      qb
        .clone()
        .andWhere('ts.is_terminal = :isTerminal', { isTerminal: false })
        .andWhere('t.days_open > 6')
        .andWhere('t.days_open <= 10')
        .getCount(),
      qb
        .clone()
        .andWhere('ts.is_terminal = :isTerminal', { isTerminal: false })
        .andWhere('t.days_open <= 6')
        .getCount(),
      qb
        .clone()
        .andWhere('ts.is_terminal = :isTerminal', { isTerminal: false })
        .andWhere('t.trade_id IS NOT NULL')
        .select('COUNT(DISTINCT t.trade_id)', 'count')
        .getRawOne<{ count: string }>(),
    ]);

    return {
      totalOpen,
      totalCompleted,
      urgent,
      overdue,
      overdue10,
      midRange7to10,
      fresh0to6,
      tradesActive: Number(tradesActiveRaw?.count ?? 0),
    };
  }

  async getAnalytics(user: AuthUser) {
    if (user.role !== 'manager' && user.role !== 'super_admin') {
      throw new ForbiddenException(MESSAGES.TASKS.ANALYTICS_MANAGER_ONLY);
    }

    const [openTasks, completedTotalRaw, avgCompletionRaw] = await Promise.all([
      this.taskRepository
        .createQueryBuilder('t')
        .innerJoin('task_statuses', 'ts', 'ts.id = t.status_id')
        .where('t.deleted_at IS NULL')
        .andWhere('ts.is_terminal = :isTerminal', { isTerminal: false })
        .getCount(),
      this.taskRepository
        .createQueryBuilder('t')
        .innerJoin('task_statuses', 'ts', 'ts.id = t.status_id')
        .where('t.deleted_at IS NULL')
        .andWhere('ts.is_terminal = :isTerminal', { isTerminal: true })
        .getCount(),
      this.taskCompletionRepository
        .createQueryBuilder('tc')
        .select('AVG(tc.duration_days)', 'avg')
        .where('tc.deleted_at IS NULL')
        .getRawOne<{ avg: string | null }>(),
    ]);
    const avgCompletionDays = Math.round(Number(avgCompletionRaw?.avg ?? 0));

    const byTrade = await this.taskRepository
      .createQueryBuilder('t')
      .innerJoin('trades', 'tr', 'tr.id = t.trade_id')
      .innerJoin('task_statuses', 'ts', 'ts.id = t.status_id')
      .select('tr.name', 'trade')
      .addSelect('COUNT(t.id)', 'count')
      .where('t.deleted_at IS NULL')
      .andWhere('ts.is_terminal = :isTerminal', { isTerminal: false })
      .groupBy('tr.name')
      .getRawMany();

    const byLevel = await this.taskRepository
      .createQueryBuilder('t')
      .innerJoin('levels', 'lv', 'lv.id = t.level_id')
      .innerJoin('task_statuses', 'ts', 'ts.id = t.status_id')
      .select('lv.name', 'level')
      .addSelect('COUNT(t.id)', 'count')
      .where('t.deleted_at IS NULL')
      .andWhere('ts.is_terminal = :isTerminal', { isTerminal: false })
      .groupBy('lv.name')
      .getRawMany();

    const completionRate = await this.taskRepository
      .createQueryBuilder('t')
      .innerJoin('task_statuses', 'ts', 'ts.id = t.status_id')
      .select("to_char(t.created_at, 'YYYY-MM')", 'month')
      .addSelect('COUNT(t.id)', 'total')
      .addSelect(
        'SUM(CASE WHEN ts.is_terminal = true THEN 1 ELSE 0 END)',
        'completed',
      )
      .where('t.deleted_at IS NULL')
      .groupBy('month')
      .orderBy('month', 'DESC')
      .limit(6)
      .getRawMany();

    const overdueTop = await this.taskRepository
      .createQueryBuilder('t')
      .innerJoin('task_statuses', 'ts', 'ts.id = t.status_id')
      .leftJoin('levels', 'lv', 'lv.id = t.level_id')
      .leftJoin('users', 'uc', 'uc.id = t.created_by_user_id')
      .select([
        't.days_open AS days_open',
        't.description AS description',
        'lv.name AS level_name',
        'uc.initials AS user_initials',
      ])
      .where('t.deleted_at IS NULL')
      .andWhere('ts.is_terminal = :isTerminal', { isTerminal: false })
      .andWhere('t.days_open > 10')
      .orderBy('t.days_open', 'DESC')
      .limit(6)
      .getRawMany<{ days_open: number; description: string; level_name: string | null; user_initials: string | null }>();

    const byUser = await this.taskCompletionRepository
      .createQueryBuilder('tc')
      .leftJoin('users', 'u', 'u.id = tc.completed_by_user_id')
      .select('COALESCE(u.initials, \'–\')', 'user')
      .addSelect('COUNT(tc.id)', 'completed')
      .where('tc.deleted_at IS NULL')
      .groupBy('u.initials')
      .orderBy('completed', 'DESC')
      .getRawMany<{ user: string; completed: string }>();

    return {
      openTasks,
      completedTotal: completedTotalRaw,
      avgCompletionDays,
      byTrade: byTrade.map((r) => ({ trade: r.trade, count: Number(r.count) })),
      byLevel: byLevel.map((r) => ({ level: r.level, count: Number(r.count) })),
      overdueTop: overdueTop.map((r) => ({
        daysOpen: Number(r.days_open),
        level: r.level_name,
        description: r.description,
        user: r.user_initials,
      })),
      byUser: byUser.map((r) => ({ user: r.user, completed: Number(r.completed) })),
      completionRate,
    };
  }

  async bulkComplete(dto: BulkTasksDto, user: AuthUser) {
    const results: Array<{ id: string; status: 'success' | 'error'; message?: string }> = [];
    for (const id of dto.ids) {
      try {
        await this.complete(id, { notes: 'Bulk completion' }, user);
        results.push({ id, status: 'success' });
      } catch (error) {
        this.logger.error(`Bulk complete failed for task ${id}`, error as Error);
        results.push({ id, status: 'error', message: MESSAGES.TASKS.BULK_ITEM_FAILED });
      }
    }
    return results;
  }

  async bulkDelete(dto: BulkTasksDto, user: AuthUser) {
    const results: Array<{ id: string; status: 'success' | 'error'; message?: string }> = [];
    for (const id of dto.ids) {
      try {
        await this.delete(id, user);
        results.push({ id, status: 'success' });
      } catch (error) {
        this.logger.error(`Bulk delete failed for task ${id}`, error as Error);
        results.push({ id, status: 'error', message: MESSAGES.TASKS.BULK_ITEM_FAILED });
      }
    }
    return results;
  }

  private async listByTerminalState(
    user: AuthUser,
    query: QueryTasksDto,
    isTerminal: boolean,
  ) {
    const qb = this.taskRepository
      .createQueryBuilder('t')
      .innerJoin('task_statuses', 'ts', 'ts.id = t.status_id')
      .leftJoin('task_priorities', 'tp', 'tp.id = t.priority_id')
      .leftJoin('trades', 'tr', 'tr.id = t.trade_id')
      .leftJoin('levels', 'lv', 'lv.id = t.level_id')
      .select([
        't.id AS id',
        't.description AS description',
        't.days_open AS days_open',
        't.created_at AS created_at',
        't.opened_at AS opened_at',
        't.closed_at AS closed_at',
        't.assigned_to_user_id AS assigned_to_user_id',
        't.created_by_user_id AS created_by_user_id',
        't.status_id AS status_id',
        't.priority_id AS priority_id',
        'ts.code AS status_code',
        'ts.name AS status_name',
        'tp.code AS priority_code',
        'tp.name AS priority_name',
        'tr.name AS trade_name',
        'lv.name AS level_name',
      ])
      .where('t.deleted_at IS NULL')
      .andWhere('ts.is_terminal = :isTerminal', { isTerminal });

    if (query.tradeIds?.length) {
      qb.andWhere('t.trade_id IN (:...tradeIds)', { tradeIds: query.tradeIds });
    } else if (query.tradeId) {
      qb.andWhere('t.trade_id = :tradeId', { tradeId: query.tradeId });
    }

    if (query.levelIds?.length) {
      qb.andWhere('t.level_id IN (:...levelIds)', { levelIds: query.levelIds });
    } else if (query.levelId) {
      qb.andWhere('t.level_id = :levelId', { levelId: query.levelId });
    }
    if (query.assignedToUserId)
      qb.andWhere('t.assigned_to_user_id = :assignedToUserId', {
        assignedToUserId: query.assignedToUserId,
      });
    if (query.search)
      qb.andWhere(
        '(t.description ILIKE :search OR tr.name ILIKE :search OR lv.name ILIKE :search)',
        {
          search: `%${query.search}%`,
        },
      );

    if (user.role === 'trade_user') {
      qb.andWhere('t.assigned_to_user_id = :authUserId', {
        authUserId: user.id,
      });
    } else if (user.role === 'field_user') {
      qb.andWhere(
        '(t.created_by_user_id = :authUserId OR t.assigned_to_user_id = :authUserId)',
        {
          authUserId: user.id,
        },
      );
    }

    const legacyDaysSort = query.daysSort ? query.daysSort : undefined;
    const effectiveSortBy = query.sortBy ?? (legacyDaysSort ? 'daysOpen' : 'createdAt');
    const effectiveSortOrder =
      query.sortOrder ?? legacyDaysSort ?? (effectiveSortBy === 'createdAt' ? 'desc' : 'asc');

    const dir = effectiveSortOrder.toUpperCase() as 'ASC' | 'DESC';
    const sortMap: Record<
      NonNullable<QueryTasksDto['sortBy']>,
      { column: string; nulls?: 'NULLS LAST' | 'NULLS FIRST' }
    > = {
      createdAt: { column: 't.created_at' },
      daysOpen: { column: 't.days_open' },
      level: { column: 'lv.name', nulls: 'NULLS LAST' },
      trade: { column: 'tr.name', nulls: 'NULLS LAST' },
      priority: { column: 'tp.name', nulls: 'NULLS LAST' },
      description: { column: 't.description' },
    };

    const cfg = sortMap[effectiveSortBy];
    qb.orderBy(cfg.column, dir);
    if (cfg.nulls) {
      qb.addOrderBy(cfg.column, dir, cfg.nulls);
    }
    // Stable secondary sort to avoid jitter between pages.
    qb.addOrderBy('t.created_at', 'DESC');

    const offset = (query.page - 1) * query.limit;
    const [items, total] = await Promise.all([
      qb.clone().offset(offset).limit(query.limit).getRawMany(),
      qb.clone().getCount(),
    ]);

    return {
      message: isTerminal
        ? MESSAGES.TASKS.COMPLETED_LIST_FETCHED
        : MESSAGES.TASKS.OPEN_LIST_FETCHED,
      data: items,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit)),
      },
    };
  }

  /**
   * Shared POST listing for open vs completed (terminal) tasks — same filters
   * and role scoping as GET list endpoints, with configurable sort columns.
   */
  private async searchTerminalTasksPaged(
    user: AuthUser,
    dto: {
      page: number;
      limit: number;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      filters?: SearchOpenTasksDto['filters'];
    },
    isTerminal: boolean,
    sorting: {
      sortMap: Record<string, { column: string }>;
      defaultSortBy: string;
      defaultSortOrder: (sortKey: string) => 'asc' | 'desc';
    },
    successMessage: string,
  ) {
    const qb = this.taskRepository
      .createQueryBuilder('t')
      .innerJoin('task_statuses', 'ts', 'ts.id = t.status_id')
      .leftJoin('task_priorities', 'tp', 'tp.id = t.priority_id')
      .leftJoin('trades', 'tr', 'tr.id = t.trade_id')
      .leftJoin('levels', 'lv', 'lv.id = t.level_id')
      .leftJoin('projects', 'p', 'p.id = t.project_id')
      .leftJoin('users', 'uc', 'uc.id = t.created_by_user_id')
      .select([
        't.id AS id',
        't.project_id AS project_id',
        'p.name AS project_name',
        't.description AS description',
        't.days_open AS days_open',
        't.created_at AS created_at',
        't.opened_at AS opened_at',
        't.closed_at AS closed_at',
        't.assigned_to_user_id AS assigned_to_user_id',
        't.created_by_user_id AS created_by_user_id',
        'uc.initials AS created_by_initials',
        'uc.full_name AS created_by_full_name',
        't.status_id AS status_id',
        't.priority_id AS priority_id',
        'ts.code AS status_code',
        'ts.name AS status_name',
        'tp.code AS priority_code',
        'tp.name AS priority_name',
        'tr.name AS trade_name',
        'lv.name AS level_name',
      ])
      .where('t.deleted_at IS NULL')
      .andWhere('ts.is_terminal = :isTerminal', { isTerminal });

    const filters = dto.filters;
    if (filters?.projectIds?.length) {
      qb.andWhere('t.project_id IN (:...projectIds)', { projectIds: filters.projectIds });
    }
    if (filters?.tradeIds?.length) {
      qb.andWhere('t.trade_id IN (:...tradeIds)', { tradeIds: filters.tradeIds });
    }
    if (filters?.levelIds?.length) {
      qb.andWhere('t.level_id IN (:...levelIds)', { levelIds: filters.levelIds });
    }
    if (filters?.createdByUserIds?.length) {
      qb.andWhere('t.created_by_user_id IN (:...createdByUserIds)', {
        createdByUserIds: filters.createdByUserIds,
      });
    }
    if (filters?.statusIds?.length) {
      qb.andWhere('t.status_id IN (:...statusIds)', { statusIds: filters.statusIds });
    }
    if (filters?.priorityIds?.length) {
      qb.andWhere('t.priority_id IN (:...priorityIds)', {
        priorityIds: filters.priorityIds,
      });
    }
    if (filters?.dateRange?.openedFrom) {
      qb.andWhere('t.opened_at >= :openedFrom', { openedFrom: filters.dateRange.openedFrom });
    }
    if (filters?.dateRange?.openedTo) {
      qb.andWhere('t.opened_at <= :openedTo', { openedTo: filters.dateRange.openedTo });
    }

    const term = dto.search?.trim();
    if (term) {
      qb.andWhere(
        '(t.description ILIKE :search OR tr.name ILIKE :search OR lv.name ILIKE :search OR uc.full_name ILIKE :search OR uc.initials ILIKE :search)',
        { search: `%${term}%` },
      );
    }

    if (user.role === 'trade_user') {
      qb.andWhere('t.assigned_to_user_id = :authUserId', { authUserId: user.id });
    } else if (user.role === 'field_user') {
      qb.andWhere(
        '(t.created_by_user_id = :authUserId OR t.assigned_to_user_id = :authUserId)',
        { authUserId: user.id },
      );
    }

    const effectiveSortBy =
      dto.sortBy && sorting.sortMap[dto.sortBy]
        ? dto.sortBy
        : sorting.defaultSortBy;
    const effectiveSortOrder =
      dto.sortOrder ?? sorting.defaultSortOrder(effectiveSortBy);
    const dir = effectiveSortOrder.toUpperCase() as 'ASC' | 'DESC';

    const sortCol = sorting.sortMap[effectiveSortBy].column;
    qb.orderBy(sortCol, dir).addOrderBy('t.created_at', 'DESC');

    const offset = (dto.page - 1) * dto.limit;
    const [items, total] = await Promise.all([
      qb.clone().offset(offset).limit(dto.limit).getRawMany(),
      qb.clone().getCount(),
    ]);

    return {
      message: successMessage,
      data: items,
      meta: {
        page: dto.page,
        limit: dto.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / dto.limit)),
      },
    };
  }

  private async searchCompletedByTerminalState(
    user: AuthUser,
    dto: SearchCompletedTasksDto,
  ) {
    const qb = this.taskRepository
      .createQueryBuilder('t')
      .innerJoin('task_statuses', 'ts', 'ts.id = t.status_id')
      .leftJoin('trades', 'tr', 'tr.id = t.trade_id')
      .leftJoin('levels', 'lv', 'lv.id = t.level_id')
      .leftJoin(
        'task_completions',
        'tc',
        'tc.task_id = t.id AND tc.deleted_at IS NULL',
      )
      .leftJoin('users', 'ucomp', 'ucomp.id = tc.completed_by_user_id')
      .select([
        't.id AS id',
        't.description AS description',
        't.closed_at AS closed_at',
        't.days_open AS days_open',
        'tr.name AS trade_name',
        'lv.name AS level_name',
        'tc.completed_by_user_id AS completed_by_user_id',
        'ucomp.initials AS completed_by_initials',
        'ucomp.full_name AS completed_by_full_name',
      ])
      .where('t.deleted_at IS NULL')
      .andWhere('ts.is_terminal = :isTerminal', { isTerminal: true });

    const filters = dto.filters;
    if (filters?.tradeIds?.length) {
      qb.andWhere('t.trade_id IN (:...tradeIds)', { tradeIds: filters.tradeIds });
    }
    if (filters?.levelIds?.length) {
      qb.andWhere('t.level_id IN (:...levelIds)', { levelIds: filters.levelIds });
    }
    if (filters?.completedByUserIds?.length) {
      qb.andWhere('tc.completed_by_user_id IN (:...completedByUserIds)', {
        completedByUserIds: filters.completedByUserIds,
      });
    }

    const term = dto.search?.trim();
    if (term) {
      qb.andWhere(
        '(t.description ILIKE :search OR tr.name ILIKE :search OR lv.name ILIKE :search OR ucomp.full_name ILIKE :search OR ucomp.initials ILIKE :search)',
        { search: `%${term}%` },
      );
    }

    if (user.role === 'trade_user') {
      qb.andWhere('t.assigned_to_user_id = :authUserId', { authUserId: user.id });
    } else if (user.role === 'field_user') {
      qb.andWhere(
        '(t.created_by_user_id = :authUserId OR t.assigned_to_user_id = :authUserId)',
        { authUserId: user.id },
      );
    }

    const effectiveSortBy = dto.sortBy ?? 'date';
    const effectiveSortOrder =
      dto.sortOrder ?? (effectiveSortBy === 'date' ? 'desc' : 'asc');
    const dir = effectiveSortOrder.toUpperCase() as 'ASC' | 'DESC';

    const sortMap: Record<
      NonNullable<SearchCompletedTasksDto['sortBy']>,
      { column: string; nulls?: 'NULLS LAST' | 'NULLS FIRST' }
    > = {
      level: { column: 'lv.name', nulls: 'NULLS LAST' },
      trade: { column: 'tr.name', nulls: 'NULLS LAST' },
      user: { column: 'ucomp.full_name', nulls: 'NULLS LAST' },
      description: { column: 't.description' },
      date: { column: 't.closed_at', nulls: 'NULLS LAST' },
      duration: { column: 't.days_open' },
    };

    const cfg = sortMap[effectiveSortBy];
    qb.orderBy(cfg.column, dir);
    if (cfg.nulls) {
      qb.addOrderBy(cfg.column, dir, cfg.nulls);
    }
    qb.addOrderBy('t.closed_at', 'DESC');

    const offset = (dto.page - 1) * dto.limit;
    const [items, total] = await Promise.all([
      qb.clone().offset(offset).limit(dto.limit).getRawMany(),
      qb.clone().getCount(),
    ]);

    return {
      message: 'Completed tasks fetched successfully',
      data: items,
      meta: {
        page: dto.page,
        limit: dto.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / dto.limit)),
      },
    };
  }

  private enforceTaskReadScope(user: AuthUser, task: any): void {
    if (user.role === 'manager') return;
    if (user.role === 'trade_user' && task.assigned_to_user_id !== user.id) {
      throw new ForbiddenException(MESSAGES.TASKS.READ_SCOPE_DENIED);
    }
    if (
      user.role === 'field_user' &&
      task.created_by_user_id !== user.id &&
      task.assigned_to_user_id !== user.id
    ) {
      throw new ForbiddenException(MESSAGES.TASKS.READ_SCOPE_DENIED);
    }
  }

  private enforceTaskWriteScope(user: AuthUser, task: any): void {
    if (user.role === 'manager') return;
    if (user.role === 'field_user' && task.created_by_user_id === user.id)
      return;
    throw new ForbiddenException(MESSAGES.TASKS.UPDATE_SCOPE_DENIED);
  }

  private enforceTaskDeleteScope(user: AuthUser, task: any): void {
    if (user.role === 'manager') return;
    if (user.role === 'field_user' && task.created_by_user_id === user.id)
      return;
    throw new ForbiddenException(MESSAGES.TASKS.DELETE_SCOPE_DENIED);
  }

  private enforceTaskCompleteScope(user: AuthUser, task: any): void {
    if (user.role === 'manager') return;
    if (user.role === 'trade_user' && task.assigned_to_user_id === user.id)
      return;
    if (user.role === 'field_user' && task.created_by_user_id === user.id)
      return;
    throw new ForbiddenException(MESSAGES.TASKS.COMPLETE_SCOPE_DENIED);
  }

  private daysBetween(from: string, to: string): number {
    const fromDate = new Date(from).getTime();
    const toDate = new Date(to).getTime();
    return Math.max(0, Math.floor((toDate - fromDate) / (1000 * 60 * 60 * 24)));
  }
}
