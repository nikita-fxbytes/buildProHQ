import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import type { AuthUser } from '../../infrastructure/common/interfaces/auth-user.interface';
import { MESSAGES } from '../../infrastructure/common/constants/messages';
import {
  Attachment,
  Task,
  TaskAssignment,
  TaskComment,
  TaskHistory,
} from '../../infrastructure/persistence/typeorm/entities';
import { ProjectFiltersService } from '../project-filters/project-filters.service';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { SearchCompletedTasksDto } from './dto/search-completed-tasks.dto';
import { SearchOpenTasksDto } from './dto/search-open-tasks.dto';
import { enforceTaskReadScope } from './utils/task-access';

/** Correlated subquery: human-readable dynamic filter summary per task row (alias t). */
const FILTER_SUMMARY_SQL = `(
  SELECT COALESCE(string_agg(fq.line, ', ' ORDER BY fq.n), '')
  FROM (
    SELECT
      COALESCE(pf.name, 'Unknown filter') AS n,
      (
        CASE WHEN COALESCE(pf.has_sub_filters, false)
          THEN COALESCE(
            NULLIF(string_agg(DISTINCT (sf.name || CASE WHEN sf.deleted_at IS NULL THEN '' ELSE ' (deleted)' END), ', '), ''),
            '—'
          )
          ELSE COALESCE(NULLIF(MAX(tf.text_value), ''), '—')
        END
      ) AS v,
      (
        COALESCE(pf.name, 'Unknown filter')
        || CASE WHEN pf.deleted_at IS NULL THEN '' ELSE ' (deleted)' END
        || ': '
        || (
          CASE WHEN COALESCE(pf.has_sub_filters, false)
            THEN COALESCE(
              NULLIF(string_agg(DISTINCT (sf.name || CASE WHEN sf.deleted_at IS NULL THEN '' ELSE ' (deleted)' END), ', '), ''),
              '—'
            )
            ELSE COALESCE(NULLIF(MAX(tf.text_value), ''), '—')
          END
        )
      ) AS line
    FROM task_filters tf
    LEFT JOIN filters pf ON pf.id = tf.filter_id
    LEFT JOIN sub_filters sf ON sf.id = tf.sub_filter_id
    WHERE tf.task_id = t.id AND tf.deleted_at IS NULL
    GROUP BY pf.id, pf.name, pf.has_sub_filters, pf.deleted_at
  ) fq
)`;

@Injectable()
export class TasksQueriesRepository {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(TaskAssignment)
    private readonly taskAssignmentRepository: Repository<TaskAssignment>,
    @InjectRepository(TaskComment)
    private readonly taskCommentRepository: Repository<TaskComment>,
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
    private readonly projectFilters: ProjectFiltersService,
  ) {}

  async searchOpen(user: AuthUser, dto: SearchOpenTasksDto) {
    return this.searchTerminalTasksPaged(
      user,
      dto,
      false,
      {
        sortMap: {
          createdAt: { column: 't.created_at' },
          title: { column: 't.title' },
          projectName: { column: 'p.name' },
          daysOpen: { column: 't.days_open' },
          priority: { column: 'tp.name' },
          description: { column: 't.description' },
          user: { column: 'uc.full_name' },
          assignedUser: { column: 'assignee_sort' },
          assignedUserName: { column: 'assignee_sort' },
        },
        defaultSortBy: 'createdAt',
        defaultSortOrder: (key: string) =>
          key === 'createdAt' ? 'desc' : 'asc',
      },
      MESSAGES.TASKS.OPEN_LIST_FETCHED,
    );
  }

  async searchAll(user: AuthUser, dto: SearchOpenTasksDto) {
    return this.searchTerminalTasksPaged(
      user,
      dto,
      null,
      {
        sortMap: {
          createdAt: { column: 't.created_at' },
          title: { column: 't.title' },
          projectName: { column: 'p.name' },
          daysOpen: { column: 't.days_open' },
          priority: { column: 'tp.name' },
          description: { column: 't.description' },
          user: { column: 'uc.full_name' },
          assignedUser: { column: 'assignee_sort' },
          assignedUserName: { column: 'assignee_sort' },
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
      .leftJoin('task_statuses', 'ts', 'ts.id = t.status_id')
      .leftJoin('task_priorities', 'tp', 'tp.id = t.priority_id')
      .leftJoin('projects', 'pr', 'pr.id = t.project_id')
      .select([
        't.id AS id',
        't.project_id AS project_id',
        'pr.name AS project_name',
        't.status_id AS status_id',
        't.priority_id AS priority_id',
        't.created_by_user_id AS created_by_user_id',
        't.assigned_to_user_id AS assigned_to_user_id',
        't.title AS title',
        't.description AS description',
        't.notes AS notes',
        't.due_at AS due_at',
        't.opened_at AS opened_at',
        't.closed_at AS closed_at',
        't.days_open AS days_open',
        't.created_at AS created_at',
        't.updated_at AS updated_at',
        'ts.code AS status_code',
        'ts.name AS status_name',
        'tp.name AS priority_name',
      ])
      .where('t.id = :id', { id })
      .andWhere('t.deleted_at IS NULL')
      .getRawOne<any>();

    if (!row) {
      throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);
    }
    enforceTaskReadScope(user, row);
    const assignees = await this.taskAssignmentRepository.find({
      where: { taskId: id, deletedAt: IsNull() },
      order: { assignedAt: 'DESC', id: 'DESC' },
      select: { assigneeUserId: true },
    });
    const task_filter_selections =
      await this.projectFilters.getTaskFilterSelectionsForTask(id);
    const filters = await this.projectFilters.getTaskFiltersForView(id);
    const comments = await this.taskCommentRepository
      .createQueryBuilder('c')
      .leftJoin('users', 'u', 'u.id = c.created_by')
      .select([
        'c.id AS id',
        'c.task_id AS task_id',
        'c.comment AS comment',
        'c.created_at AS created_at',
        'c.created_by AS created_by_user_id',
        'u.initials AS created_by_initials',
        'u.full_name AS created_by_full_name',
      ])
      .where('c.task_id = :taskId', { taskId: id })
      .andWhere('c.deleted_at IS NULL')
      .orderBy('c.created_at', 'DESC')
      .addOrderBy('c.id', 'DESC')
      .limit(50)
      .getRawMany();
    return {
      ...row,
      assigned_to_user_ids: assignees
        .map((a) => a.assigneeUserId)
        .filter((x): x is string => Boolean(x)),
      task_filter_selections,
      filters,
      comments,
    };
  }

  async getComments(taskId: string, user: AuthUser) {
    await this.getById(taskId, user);
    return this.taskCommentRepository.find({
      where: { taskId, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async getCommentsPaged(taskId: string, user: AuthUser, dto: any) {
    // Delegate to existing service pagination behavior for now by replicating the querybuilder.
    // Kept here so the controller can call through a single repo.
    const page = Math.max(1, Number(dto?.page ?? 1));
    const limit = Math.min(50, Math.max(1, Number(dto?.limit ?? 10)));
    const offset = (page - 1) * limit;
    if (!taskId) {
      throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);
    }
    await this.getById(taskId, user);

    const qb = this.taskCommentRepository
      .createQueryBuilder('c')
      .leftJoin('users', 'u', 'u.id = c.created_by')
      .select([
        'c.id AS id',
        'c.task_id AS task_id',
        'c.comment AS comment',
        'c.created_at AS created_at',
        'c.created_by AS created_by_user_id',
        'u.initials AS created_by_initials',
        'u.full_name AS created_by_full_name',
      ])
      .where('c.task_id = :taskId', { taskId })
      .andWhere('c.deleted_at IS NULL')
      .orderBy('c.created_at', 'DESC')
      .addOrderBy('c.id', 'DESC');

    const [items, total] = await Promise.all([
      qb.clone().offset(offset).limit(limit).getRawMany(),
      qb
        .clone()
        .select('COUNT(DISTINCT c.id)', 'cnt')
        .orderBy()
        .getRawOne()
        .then((r) => Number(r?.cnt ?? 0)),
    ]);

    return {
      message: MESSAGES.COMMON.SUCCESS,
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getHistory(taskId: string, user: AuthUser) {
    await this.getById(taskId, user);
    return this.taskHistoryRepository.find({
      where: { taskId, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async getHistoryPaged(taskId: string, user: AuthUser, dto: any) {
    await this.getById(taskId, user);
    const page = Math.max(1, Number(dto?.page ?? 1));
    const limit = Math.min(50, Math.max(1, Number(dto?.limit ?? 10)));
    const offset = (page - 1) * limit;

    const qb = this.taskHistoryRepository
      .createQueryBuilder('th')
      .leftJoin('users', 'u', 'u.id = th.changed_by')
      .leftJoin('task_statuses', 'tsOld', 'tsOld.id = th.old_status_id')
      .leftJoin('task_statuses', 'tsNew', 'tsNew.id = th.new_status_id')
      .select([
        'th.id AS id',
        'th.task_id AS task_id',
        'th.change_reason AS change_reason',
        'th.old_status_id AS old_status_id',
        'th.new_status_id AS new_status_id',
        'th.old_assignee_user_id AS old_assignee_user_id',
        'th.new_assignee_user_id AS new_assignee_user_id',
        'th.created_at AS created_at',
        'th.changed_by AS changed_by_user_id',
        'u.initials AS changed_by_initials',
        'u.full_name AS changed_by_full_name',
        'tsOld.code AS old_status_code',
        'tsOld.name AS old_status_name',
        'tsNew.code AS new_status_code',
        'tsNew.name AS new_status_name',
      ])
      .where('th.task_id = :taskId', { taskId })
      .andWhere('th.deleted_at IS NULL')
      .orderBy('th.created_at', 'DESC')
      .addOrderBy('th.id', 'DESC');

    const [items, total] = await Promise.all([
      qb.clone().offset(offset).limit(limit).getRawMany(),
      qb
        .clone()
        .select('COUNT(DISTINCT th.id)', 'cnt')
        .orderBy()
        .getRawOne()
        .then((r) => Number(r?.cnt ?? 0)),
    ]);

    return {
      message: MESSAGES.COMMON.SUCCESS,
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getAttachments(taskId: string, user: AuthUser) {
    await this.getById(taskId, user);
    return this.attachmentRepository.find({
      where: { taskId, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  // --- Private implementations moved from TasksService (verbatim-ish) ---

  private async listByTerminalState(
    user: AuthUser,
    query: QueryTasksDto,
    isTerminal: boolean,
  ) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(50, Math.max(1, query.limit ?? 10));
    const offset = (page - 1) * limit;

    const build = (withFilterSummary: boolean) => {
      const qb = this.taskRepository
        .createQueryBuilder('t')
        .innerJoin('task_statuses', 'ts', 'ts.id = t.status_id')
        .leftJoin('task_priorities', 'tp', 'tp.id = t.priority_id')
        .leftJoin('projects', 'p', 'p.id = t.project_id')
        .select([
          't.id AS id',
          't.project_id AS project_id',
          'p.name AS project_name',
          't.title AS title',
          't.description AS description',
          't.due_at AS due_at',
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
        ])
        .where('t.deleted_at IS NULL')
        .andWhere('ts.is_terminal = :isTerminal', { isTerminal });
      if (withFilterSummary) {
        qb.addSelect(FILTER_SUMMARY_SQL, 'filter_summary');
      }
      return qb;
    };

    const qb = build(true);

    if (user.role === 'trade_user') {
      qb.andWhere('t.assigned_to_user_id = :userId', { userId: user.id });
    } else if (user.role === 'field_user') {
      qb.andWhere(
        '(t.created_by_user_id = :userId OR t.assigned_to_user_id = :userId)',
        { userId: user.id },
      );
    }

    const [items, total] = await Promise.all([
      qb.clone().offset(offset).limit(limit).getRawMany(),
      qb
        .clone()
        .select('COUNT(DISTINCT t.id)', 'cnt')
        .orderBy()
        .getRawOne()
        .then((r) => Number(r?.cnt ?? 0)),
    ]);
    return {
      message: MESSAGES.TASKS.COMPLETED_LIST_FETCHED,
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

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
    isTerminal: boolean | null,
    sorting: {
      sortMap: Record<string, { column: string }>;
      defaultSortBy: string;
      defaultSortOrder: (sortKey: string) => 'asc' | 'desc';
    },
    successMessage: string,
  ) {
    const qbBase = this.taskRepository
      .createQueryBuilder('t')
      .leftJoin('task_statuses', 'ts', 'ts.id = t.status_id')
      .leftJoin('task_priorities', 'tp', 'tp.id = t.priority_id')
      .leftJoin('projects', 'p', 'p.id = t.project_id')
      .leftJoin('users', 'uc', 'uc.id = t.created_by_user_id')
      .leftJoin(
        'task_assignments',
        'ta',
        'ta.task_id = t.id AND ta.deleted_at IS NULL',
      )
      .leftJoin('users', 'ua', 'ua.id = ta.assignee_user_id')
      .leftJoin('user_types', 'uat', 'uat.id = ua.user_type_id')
      .where('t.deleted_at IS NULL');

    if (isTerminal !== null) {
      qbBase.andWhere('ts.is_terminal = :isTerminal', { isTerminal });
    }

    const filters = dto.filters;
    if (filters?.projectIds?.length) {
      qbBase.andWhere('t.project_id IN (:...projectIds)', {
        projectIds: filters.projectIds,
      });
    }
    if (filters?.createdByUserIds?.length) {
      qbBase.andWhere('t.created_by_user_id IN (:...createdByUserIds)', {
        createdByUserIds: filters.createdByUserIds,
      });
    }
    if (filters?.statusIds?.length) {
      qbBase.andWhere('t.status_id IN (:...statusIds)', {
        statusIds: filters.statusIds,
      });
    }
    if (filters?.priorityIds?.length) {
      qbBase.andWhere('t.priority_id IN (:...priorityIds)', {
        priorityIds: filters.priorityIds,
      });
    }
    if (filters?.dateRange?.openedFrom) {
      qbBase.andWhere('t.opened_at >= :openedFrom', {
        openedFrom: filters.dateRange.openedFrom,
      });
    }
    if (filters?.dateRange?.openedTo) {
      qbBase.andWhere('t.opened_at <= :openedTo', {
        openedTo: filters.dateRange.openedTo,
      });
    }

    const term = dto.search?.trim();
    if (term) {
      qbBase.andWhere(
        '(t.description ILIKE :search OR uc.full_name ILIKE :search OR uc.initials ILIKE :search)',
        { search: `%${term}%` },
      );
    }

    if (user.role === 'trade_user') {
      qbBase.andWhere('t.assigned_to_user_id = :authUserId', {
        authUserId: user.id,
      });
    } else if (user.role === 'field_user') {
      qbBase.andWhere(
        '(t.created_by_user_id = :authUserId OR t.assigned_to_user_id = :authUserId)',
        { authUserId: user.id },
      );
    }

    const qbList = qbBase
      .clone()
      .select([
        't.id AS id',
        't.project_id AS project_id',
        'p.name AS project_name',
        't.title AS title',
        't.description AS description',
        't.due_at AS due_at',
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
      ]);

    qbList.addSelect(FILTER_SUMMARY_SQL, 'filter_summary');
    qbList.addSelect(
      `COALESCE(array_agg(DISTINCT ta.assignee_user_id), '{}'::uuid[])`,
      'assigned_to_user_ids',
    );
    qbList.addSelect(`MIN(ua.full_name)`, 'assignee_sort');
    qbList.addSelect(
      `COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ua.id, 'fullName', ua.full_name, 'role', uat.name)) FILTER (WHERE ua.id IS NOT NULL), '[]'::jsonb)`,
      'assigned_users',
    );

    qbList
      .groupBy('t.id')
      .addGroupBy('p.name')
      .addGroupBy('uc.initials')
      .addGroupBy('uc.full_name')
      .addGroupBy('ts.code')
      .addGroupBy('ts.name')
      .addGroupBy('tp.code')
      .addGroupBy('tp.name');

    const effectiveSortBy =
      dto.sortBy && sorting.sortMap[dto.sortBy]
        ? dto.sortBy
        : sorting.defaultSortBy;
    const effectiveSortOrder =
      dto.sortOrder ?? sorting.defaultSortOrder(effectiveSortBy);
    const dir = effectiveSortOrder.toUpperCase() as 'ASC' | 'DESC';

    const sortCol = sorting.sortMap[effectiveSortBy].column;
    const nulls =
      effectiveSortBy === 'assignedUser' ||
      effectiveSortBy === 'assignedUserName'
        ? 'NULLS LAST'
        : undefined;
    qbList
      .orderBy(sortCol, dir, nulls as any)
      .addOrderBy('t.created_at', 'DESC');

    const offset = (dto.page - 1) * dto.limit;
    const [items, total] = await Promise.all([
      qbList.clone().offset(offset).limit(dto.limit).getRawMany(),
      qbBase
        .clone()
        .select('COUNT(DISTINCT t.id)', 'cnt')
        .getRawOne()
        .then((r) => Number(r?.cnt ?? 0)),
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
        'tc.completed_by_user_id AS completed_by_user_id',
        'ucomp.initials AS completed_by_initials',
        'ucomp.full_name AS completed_by_full_name',
      ])
      .where('t.deleted_at IS NULL')
      .andWhere('ts.is_terminal = :isTerminal', { isTerminal: true });

    const filters = dto.filters;
    if (filters?.completedByUserIds?.length) {
      qb.andWhere('tc.completed_by_user_id IN (:...completedByUserIds)', {
        completedByUserIds: filters.completedByUserIds,
      });
    }

    const term = dto.search?.trim();
    if (term) {
      qb.andWhere(
        '(t.description ILIKE :search OR ucomp.full_name ILIKE :search OR ucomp.initials ILIKE :search)',
        { search: `%${term}%` },
      );
    }

    if (user.role === 'trade_user') {
      qb.andWhere('t.assigned_to_user_id = :authUserId', {
        authUserId: user.id,
      });
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
}
