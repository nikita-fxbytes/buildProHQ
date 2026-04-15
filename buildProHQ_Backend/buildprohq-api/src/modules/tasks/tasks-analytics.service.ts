import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { AuthUser } from '../../infrastructure/common/interfaces/auth-user.interface';
import { MESSAGES } from '../../infrastructure/common/constants/messages';
import { Task, TaskCompletion } from '../../infrastructure/persistence/typeorm/entities';

/**
 * Analytics-only service (stats, dashboards, recent tasks).
 * All count/list logic here is read-only and must exclude soft-deleted tasks.
 */
@Injectable()
export class TasksAnalyticsService {
  private readonly logger = new Logger(TasksAnalyticsService.name);

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(TaskCompletion)
    private readonly taskCompletionRepository: Repository<TaskCompletion>,
  ) {}

  async getStats(
    user: AuthUser,
    query?: { search?: string; filters?: any; scope?: 'open' | 'all' },
  ) {
    const scope = (query as any)?.scope as 'open' | 'all' | undefined;

    // Management dashboard wants global counts from one base query.
    if (scope === 'all' && (user.role === 'manager' || user.role === 'super_admin')) {
      const row = await this.taskRepository
        .createQueryBuilder('t')
        .innerJoin('task_statuses', 'ts', 'ts.id = t.status_id')
        .leftJoin('task_priorities', 'tp', 'tp.id = t.priority_id')
        .select([
          `COUNT(DISTINCT t.id) AS total`,
          `COUNT(DISTINCT t.id) FILTER (WHERE ts.code = 'open') AS open`,
          `COUNT(DISTINCT t.id) FILTER (WHERE ts.code = 'completed') AS completed`,
          `COUNT(DISTINCT t.id) FILTER (WHERE DATE(t.created_at) = CURRENT_DATE) AS today`,
          `COUNT(DISTINCT t.id) FILTER (WHERE t.due_at IS NOT NULL AND DATE(t.due_at) < CURRENT_DATE AND ts.code != 'completed') AS overdue`,
          `COUNT(DISTINCT t.id) FILTER (WHERE ts.code != 'completed' AND tp.code = 'critical') AS urgent`,
          `COUNT(DISTINCT t.id) FILTER (WHERE ts.code != 'completed' AND t.days_open > 7) AS overdue7`,
          `COUNT(DISTINCT t.id) FILTER (WHERE ts.code != 'completed' AND t.days_open > 10) AS overdue10`,
          `COUNT(DISTINCT t.id) FILTER (WHERE ts.code != 'completed' AND t.days_open > 6 AND t.days_open <= 10) AS midRange7to10`,
          `COUNT(DISTINCT t.id) FILTER (WHERE ts.code != 'completed' AND t.days_open <= 6) AS fresh0to6`,
          `COUNT(DISTINCT t.trade_id) FILTER (WHERE ts.code != 'completed' AND t.trade_id IS NOT NULL) AS tradesActive`,
        ])
        .where('t.deleted_at IS NULL')
        .andWhere('ts.deleted_at IS NULL')
        .getRawOne<{
          total: string;
          open: string;
          completed: string;
          today: string;
          overdue: string;
          urgent: string;
          overdue7: string;
          overdue10: string;
          midRange7to10: string;
          fresh0to6: string;
          tradesActive: string;
        }>();

      return {
        // legacy keys used across dashboards
        totalOpen: Number(row?.open ?? 0),
        totalCompleted: Number(row?.completed ?? 0),
        total: Number(row?.total ?? 0),
        urgent: Number(row?.urgent ?? 0),
        overdue: Number(row?.overdue7 ?? 0),
        overdue10: Number(row?.overdue10 ?? 0),
        midRange7to10: Number(row?.midRange7to10 ?? 0),
        fresh0to6: Number(row?.fresh0to6 ?? 0),
        tradesActive: Number(row?.tradesActive ?? 0),
        // simple keys
        open: Number(row?.open ?? 0),
        completed: Number(row?.completed ?? 0),
        today: Number(row?.today ?? 0),
        overdueDue: Number(row?.overdue ?? 0),
      };
    }

    const qbAll = this.taskRepository
      .createQueryBuilder('t')
      .innerJoin('task_statuses', 'ts', 'ts.id = t.status_id')
      .leftJoin('task_priorities', 'tp', 'tp.id = t.priority_id')
      .leftJoin('trades', 'tr', 'tr.id = t.trade_id')
      .leftJoin('levels', 'lv', 'lv.id = t.level_id')
      .leftJoin('projects', 'p', 'p.id = t.project_id')
      .leftJoin('users', 'uc', 'uc.id = t.created_by_user_id')
      .where('t.deleted_at IS NULL');

    if (user.role === 'trade_user') {
      qbAll.andWhere('t.assigned_to_user_id = :userId', { userId: user.id });
    } else if (user.role === 'field_user') {
      qbAll.andWhere('(t.created_by_user_id = :userId OR t.assigned_to_user_id = :userId)', {
        userId: user.id,
      });
    }

    const filters = query?.filters;
    if (filters?.projectIds?.length) {
      qbAll.andWhere('t.project_id IN (:...projectIds)', { projectIds: filters.projectIds });
    }
    if (filters?.tradeIds?.length) {
      qbAll.andWhere('t.trade_id IN (:...tradeIds)', { tradeIds: filters.tradeIds });
    }
    if (filters?.levelIds?.length) {
      qbAll.andWhere('t.level_id IN (:...levelIds)', { levelIds: filters.levelIds });
    }
    if (filters?.createdByUserIds?.length) {
      qbAll.andWhere('t.created_by_user_id IN (:...createdByUserIds)', {
        createdByUserIds: filters.createdByUserIds,
      });
    }
    if (filters?.statusIds?.length) {
      qbAll.andWhere('t.status_id IN (:...statusIds)', { statusIds: filters.statusIds });
    }
    if (filters?.priorityIds?.length) {
      qbAll.andWhere('t.priority_id IN (:...priorityIds)', { priorityIds: filters.priorityIds });
    }
    if (filters?.dateRange?.openedFrom) {
      qbAll.andWhere('t.opened_at >= :openedFrom', { openedFrom: filters.dateRange.openedFrom });
    }
    if (filters?.dateRange?.openedTo) {
      qbAll.andWhere('t.opened_at <= :openedTo', { openedTo: filters.dateRange.openedTo });
    }

    const term = query?.search?.trim();
    if (term) {
      qbAll.andWhere(
        '(t.title ILIKE :search OR t.description ILIKE :search OR tr.name ILIKE :search OR lv.name ILIKE :search OR uc.full_name ILIKE :search OR uc.initials ILIKE :search OR p.name ILIKE :search)',
        { search: `%${term}%` },
      );
    }

    // Stats cards on the Task List page must match the open list source of truth:
    // same base scoping + filters + search + non-terminal constraint.
    const qbList = qbAll.clone().andWhere('ts.is_terminal = :isTerminal', { isTerminal: false });

    this.logger.debug(
      `taskStats filters=${JSON.stringify(filters ?? {})} search=${term ?? ''} role=${user.role}`,
    );

    const [
      totalOpenRaw,
      totalRaw,
      totalCompleted,
      urgent,
      overdue,
      overdue10,
      midRange7to10,
      fresh0to6,
      tradesActiveRaw,
      todayOpenRaw,
    ] = await Promise.all([
      qbList
        .clone()
        .andWhere('ts.code = :statusCode', { statusCode: 'open' })
        .select('COUNT(DISTINCT t.id)', 'count')
        .getRawOne<{ count: string }>(),
      qbList.clone().select('COUNT(DISTINCT t.id)', 'count').getRawOne<{ count: string }>(),
      qbAll
        .clone()
        .andWhere('ts.code = :completed', { completed: 'completed' })
        .select('COUNT(DISTINCT t.id)', 'count')
        .getRawOne<{ count: string }>()
        .then((r) => Number(r?.count ?? 0)),
      qbAll
        .clone()
        .andWhere('ts.is_terminal = :isTerminal', { isTerminal: false })
        .andWhere('tp.code = :priority', { priority: 'critical' })
        .getCount(),
      qbAll
        .clone()
        .andWhere('ts.is_terminal = :isTerminal', { isTerminal: false })
        .andWhere('t.days_open > 7')
        .getCount(),
      qbAll
        .clone()
        .andWhere('ts.is_terminal = :isTerminal', { isTerminal: false })
        .andWhere('t.days_open > 10')
        .getCount(),
      qbAll
        .clone()
        .andWhere('ts.is_terminal = :isTerminal', { isTerminal: false })
        .andWhere('t.days_open > 6')
        .andWhere('t.days_open <= 10')
        .getCount(),
      qbAll
        .clone()
        .andWhere('ts.is_terminal = :isTerminal', { isTerminal: false })
        .andWhere('t.days_open <= 6')
        .getCount(),
      qbAll
        .clone()
        .andWhere('ts.is_terminal = :isTerminal', { isTerminal: false })
        .andWhere('t.trade_id IS NOT NULL')
        .select('COUNT(DISTINCT t.trade_id)', 'count')
        .getRawOne<{ count: string }>(),
      qbList
        .clone()
        .andWhere('ts.code = :statusCode', { statusCode: 'open' })
        .andWhere('DATE(t.created_at) = CURRENT_DATE')
        .select('COUNT(DISTINCT t.id)', 'count')
        .getRawOne<{ count: string }>(),
    ]);

    const totalOpen = Number(totalOpenRaw?.count ?? 0);
    const total = Number(totalRaw?.count ?? 0);
    const todayOpen = Number(todayOpenRaw?.count ?? 0);

    this.logger.debug(
      `taskStats computed open=${totalOpen} today=${todayOpen} total=${total} completed=${totalCompleted}`,
    );

    return {
      totalOpen,
      total,
      totalCompleted,
      urgent,
      overdue,
      overdue10,
      midRange7to10,
      fresh0to6,
      tradesActive: Number(tradesActiveRaw?.count ?? 0),
      open: totalOpen,
      today: todayOpen,
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

    const [overdueDueCountRaw, overdueDueTop] = await Promise.all([
      this.taskRepository
        .createQueryBuilder('t')
        .innerJoin('task_statuses', 'ts', 'ts.id = t.status_id')
        .where('t.deleted_at IS NULL')
        .andWhere('t.due_at IS NOT NULL')
        .andWhere('DATE(t.due_at) < CURRENT_DATE')
        .andWhere('ts.code != :completed', { completed: 'completed' })
        .select('COUNT(DISTINCT t.id)', 'count')
        .getRawOne<{ count: string }>(),
      this.taskRepository
        .createQueryBuilder('t')
        .innerJoin('task_statuses', 'ts', 'ts.id = t.status_id')
        .leftJoin('levels', 'lv', 'lv.id = t.level_id')
        .leftJoin('projects', 'p', 'p.id = t.project_id')
        .select([
          't.id AS id',
          't.title AS title',
          't.description AS description',
          't.due_at AS due_at',
          'lv.name AS level_name',
          'p.name AS project_name',
          'ts.name AS status_name',
        ])
        .where('t.deleted_at IS NULL')
        .andWhere('t.due_at IS NOT NULL')
        .andWhere('DATE(t.due_at) < CURRENT_DATE')
        .andWhere('ts.code != :completed', { completed: 'completed' })
        .orderBy('t.due_at', 'ASC')
        .limit(10)
        .getRawMany<{
          id: string;
          title: string | null;
          description: string;
          due_at: string;
          level_name: string | null;
          project_name: string | null;
          status_name: string | null;
        }>(),
    ]);

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
      .addSelect('SUM(CASE WHEN ts.is_terminal = true THEN 1 ELSE 0 END)', 'completed')
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
      .getRawMany<{
        days_open: number;
        description: string;
        level_name: string | null;
        user_initials: string | null;
      }>();

    const byUser = await this.taskCompletionRepository
      .createQueryBuilder('tc')
      .leftJoin('users', 'u', 'u.id = tc.completed_by_user_id')
      .select("COALESCE(u.initials, '–')", 'user')
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
      overdueDueCount: Number(overdueDueCountRaw?.count ?? 0),
      overdueDueTop: overdueDueTop.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        dueAt: r.due_at,
        level: r.level_name,
        project: r.project_name,
        status: r.status_name,
      })),
      byUser: byUser.map((r) => ({ user: r.user, completed: Number(r.completed) })),
      completionRate,
    };
  }

  async getRecentTasks(user: AuthUser, limit = 6) {
    if (user.role !== 'manager' && user.role !== 'super_admin') {
      throw new ForbiddenException(MESSAGES.TASKS.ANALYTICS_MANAGER_ONLY);
    }
    return this.taskRepository
      .createQueryBuilder('t')
      .innerJoin('task_statuses', 'ts', 'ts.id = t.status_id')
      .leftJoin('projects', 'p', 'p.id = t.project_id')
      .leftJoin('levels', 'lv', 'lv.id = t.level_id')
      .leftJoin('trades', 'tr', 'tr.id = t.trade_id')
      .select([
        't.id AS id',
        't.title AS title',
        't.description AS description',
        't.created_at AS created_at',
        'p.name AS project_name',
        'lv.name AS level_name',
        'tr.name AS trade_name',
        'ts.name AS status_name',
      ])
      .where('t.deleted_at IS NULL')
      .andWhere('ts.is_terminal = :isTerminal', { isTerminal: false })
      .groupBy('t.id')
      .addGroupBy('t.title')
      .addGroupBy('t.description')
      .addGroupBy('t.created_at')
      .addGroupBy('p.name')
      .addGroupBy('lv.name')
      .addGroupBy('tr.name')
      .addGroupBy('ts.name')
      .orderBy('t.created_at', 'DESC')
      .limit(Math.min(10, Math.max(1, limit)))
      .getRawMany();
  }
}

