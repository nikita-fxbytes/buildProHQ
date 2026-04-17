import { Injectable } from '@nestjs/common';
import type { AuthUser } from '../../infrastructure/common/interfaces/auth-user.interface';
import { AddAttachmentDto } from './dto/add-attachment.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { BulkTasksDto } from './dto/bulk-tasks.dto';
import { CommentTaskDto } from './dto/comment-task.dto';
import { CompleteTaskDto } from './dto/complete-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { PagedQueryDto } from './dto/paged-query.dto';
import { SearchOpenTasksDto } from './dto/search-open-tasks.dto';
import { TaskStatsQueryDto } from './dto/task-stats-query.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksAnalyticsService } from './tasks-analytics.service';
import { TasksCommandsService } from './tasks-commands.service';
import { TasksQueriesRepository } from './tasks-queries.repository';

/**
 * Thin facade to preserve backward-compatible API and keep controllers clean.
 * Delegates to:
 * - TasksQueriesRepository (read/query)
 * - TasksCommandsService (writes)
 * - TasksAnalyticsService (stats/analytics)
 */
@Injectable()
export class TasksService {
  constructor(
    private readonly queries: TasksQueriesRepository,
    private readonly commands: TasksCommandsService,
    private readonly analytics: TasksAnalyticsService,
  ) {}

  searchOpen(user: AuthUser, dto: SearchOpenTasksDto) {
    return this.queries.searchOpen(user, dto);
  }

  searchAll(user: AuthUser, dto: SearchOpenTasksDto) {
    return this.queries.searchAll(user, dto);
  }

  getById(id: string, user: AuthUser) {
    return this.queries.getById(id, user);
  }

  create(dto: CreateTaskDto, user: AuthUser) {
    return this.commands.create(dto, user);
  }

  update(id: string, dto: UpdateTaskDto, user: AuthUser) {
    return this.commands.update(id, dto, user);
  }

  delete(
    id: string,
    user: AuthUser,
    meta?: {
      ipAddress?: string | null;
      requestId?: string | null;
      userAgent?: string | null;
    },
  ) {
    return this.commands.delete(id, user, meta);
  }

  assign(
    id: string,
    dto: AssignTaskDto,
    user: AuthUser,
    meta?: {
      ipAddress?: string | null;
      requestId?: string | null;
      userAgent?: string | null;
    },
  ) {
    return this.commands.assign(id, dto, user, meta);
  }

  complete(id: string, dto: CompleteTaskDto, user: AuthUser) {
    return this.commands.complete(id, dto, user);
  }

  addComment(
    taskId: string,
    dto: CommentTaskDto,
    user: AuthUser,
    files?: Array<Express.Multer.File>,
    _req?: unknown,
  ) {
    return this.commands.addComment(taskId, dto, user, files ?? []);
  }

  getComments(taskId: string, user: AuthUser) {
    return this.queries.getComments(taskId, user);
  }

  getCommentsPaged(taskId: string, user: AuthUser, dto: PagedQueryDto) {
    return this.queries.getCommentsPaged(taskId, user, dto);
  }

  getHistory(taskId: string, user: AuthUser) {
    return this.queries.getHistory(taskId, user);
  }

  getHistoryPaged(taskId: string, user: AuthUser, dto: PagedQueryDto) {
    return this.queries.getHistoryPaged(taskId, user, dto);
  }

  updateStatus(
    id: string,
    dto: UpdateTaskStatusDto,
    user: AuthUser,
    meta?: {
      ipAddress?: string | null;
      requestId?: string | null;
      userAgent?: string | null;
    },
  ) {
    return this.commands.updateStatus(id, dto, user, meta);
  }

  getAttachments(taskId: string, user: AuthUser) {
    return this.queries.getAttachments(taskId, user);
  }

  addAttachment(taskId: string, dto: AddAttachmentDto, user: AuthUser) {
    return this.commands.addAttachment(taskId, dto, user);
  }

  getStats(user: AuthUser, query: TaskStatsQueryDto) {
    return this.analytics.getStats(user, query as any);
  }

  getAnalytics(user: AuthUser) {
    return this.analytics.getAnalytics(user);
  }

  getRecentTasks(user: AuthUser, limit = 6) {
    return this.analytics.getRecentTasks(user, limit);
  }

  bulkComplete(dto: BulkTasksDto, user: AuthUser) {
    return this.commands.bulkComplete(dto, user);
  }

  bulkDelete(dto: BulkTasksDto, user: AuthUser) {
    return this.commands.bulkDelete(dto, user);
  }

  addAttachmentFromUpload(
    taskId: string,
    dto: AddAttachmentDto,
    user: AuthUser,
  ) {
    return this.commands.addAttachment(taskId, dto, user);
  }
}
