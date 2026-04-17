import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import {
  FilterProject,
  ProjectDynamicFilter,
  SubFilterEntity,
  Task,
  TaskFilterRow,
} from '../../infrastructure/persistence/typeorm/entities';
import type { TasksAnalyticsDto } from './dto/tasks-analytics.dto';

type GlobalCards = {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
};

type FilterValueCount = { name: string; count: number };
type FilterBreakdown = {
  filterId: string;
  filterName: string;
  values: FilterValueCount[];
};

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    @InjectRepository(TaskFilterRow)
    private readonly taskFilterRepo: Repository<TaskFilterRow>,
    @InjectRepository(ProjectDynamicFilter)
    private readonly filterRepo: Repository<ProjectDynamicFilter>,
    @InjectRepository(FilterProject)
    private readonly filterProjectRepo: Repository<FilterProject>,
    @InjectRepository(SubFilterEntity)
    private readonly subFilterRepo: Repository<SubFilterEntity>,
  ) {}

  async tasks(dto: TasksAnalyticsDto) {
    const cards = await this.getProjectCards(dto.projectId, dto);
    const filters = await this.getProjectFilterBreakdown(dto.projectId, dto);
    return {
      message: 'Project task analytics fetched successfully',
      data: {
        total: cards.totalTasks,
        completed: cards.completedTasks,
        inProgress: cards.inProgressTasks,
        overdue: cards.overdueTasks,
        filters,
      },
      meta: {},
    };
  }

  private async getProjectCards(
    projectId: string,
    dto: TasksAnalyticsDto,
  ): Promise<GlobalCards> {
    const pid = String(projectId ?? '').trim();
    if (!pid) {
      return {
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        overdueTasks: 0,
      };
    }
    const from = dto.dateRange?.from ? new Date(dto.dateRange.from) : null;
    const to = dto.dateRange?.to ? new Date(dto.dateRange.to) : null;

    const qb = this.taskRepo
      .createQueryBuilder('t')
      .innerJoin(
        'task_statuses',
        'ts',
        'ts.id = t.status_id AND ts.deleted_at IS NULL',
      )
      .where('t.deleted_at IS NULL');
    qb.andWhere('t.project_id = :projectId', { projectId: pid });

    if (from) qb.andWhere('t.created_at >= :from', { from });
    if (to) qb.andWhere('t.created_at <= :to', { to });

    // Note: "In Progress" uses status code 'in_progress' if present.
    const row = await qb
      .select([
        `COUNT(DISTINCT t.id) AS total`,
        `COUNT(DISTINCT t.id) FILTER (WHERE ts.is_terminal = true) AS completed`,
        `COUNT(DISTINCT t.id) FILTER (WHERE ts.code = 'in_progress') AS in_progress`,
        `COUNT(DISTINCT t.id) FILTER (WHERE t.due_at IS NOT NULL AND DATE(t.due_at) < CURRENT_DATE AND ts.is_terminal = false) AS overdue`,
      ])
      .getRawOne<{
        total: string;
        completed: string;
        in_progress: string;
        overdue: string;
      }>();

    return {
      totalTasks: Number(row?.total ?? 0),
      completedTasks: Number(row?.completed ?? 0),
      inProgressTasks: Number(row?.in_progress ?? 0),
      overdueTasks: Number(row?.overdue ?? 0),
    };
  }

  private async getProjectFilterBreakdown(
    projectId: string,
    dto: TasksAnalyticsDto,
  ): Promise<FilterBreakdown[]> {
    const pid = String(projectId ?? '').trim();
    if (!pid) return [];
    const from = dto.dateRange?.from ? new Date(dto.dateRange.from) : null;
    const to = dto.dateRange?.to ? new Date(dto.dateRange.to) : null;

    // Filter definitions assigned to this project (hide deleted).
    const filterIdsRaw = await this.filterProjectRepo
      .createQueryBuilder('fp')
      .select(['fp.filter_id AS id'])
      .innerJoin('filters', 'f', 'f.id = fp.filter_id AND f.deleted_at IS NULL')
      .where('fp.project_id = :projectId', { projectId: pid })
      .getRawMany<{ id: string }>();
    const filterIds = filterIdsRaw.map((r) => r.id).filter(Boolean);
    if (!filterIds.length) return [];

    const defs = await this.filterRepo.find({
      where: { id: In(filterIds), deletedAt: IsNull() } as any,
      relations: ['subFilters'],
      order: { name: 'ASC' },
    });
    const byId = new Map<string, FilterBreakdown>();
    for (const f of defs) {
      if ((f as any).deletedAt) continue;
      byId.set(f.id, { filterId: f.id, filterName: f.name, values: [] });
    }

    // Count sub-filter selections (distinct tasks).
    const subRows = await this.taskFilterRepo
      .createQueryBuilder('tf')
      .innerJoin(
        'tasks',
        't',
        't.id = tf.task_id AND t.deleted_at IS NULL AND t.project_id = :projectId',
        {
          projectId: pid,
        },
      )
      .innerJoin('filters', 'f', 'f.id = tf.filter_id AND f.deleted_at IS NULL')
      .leftJoin(
        'sub_filters',
        'sf',
        'sf.id = tf.sub_filter_id AND sf.deleted_at IS NULL',
      )
      .select([
        'tf.filter_id AS filter_id',
        'sf.name AS value_name',
        'COUNT(DISTINCT tf.task_id) AS cnt',
      ])
      .where('tf.deleted_at IS NULL')
      .andWhere('tf.sub_filter_id IS NOT NULL')
      .andWhere('tf.filter_id IN (:...filterIds)', { filterIds })
      .andWhere(from ? 't.created_at >= :from' : '1=1', from ? { from } : {})
      .andWhere(to ? 't.created_at <= :to' : '1=1', to ? { to } : {})
      .groupBy('tf.filter_id')
      .addGroupBy('sf.name')
      .orderBy('tf.filter_id', 'ASC')
      .addOrderBy('sf.name', 'ASC')
      .getRawMany<{
        filter_id: string;
        value_name: string | null;
        cnt: string;
      }>();

    // Count text-value selections (distinct tasks).
    const textRows = await this.taskFilterRepo
      .createQueryBuilder('tf')
      .innerJoin(
        'tasks',
        't',
        't.id = tf.task_id AND t.deleted_at IS NULL AND t.project_id = :projectId',
        {
          projectId: pid,
        },
      )
      .innerJoin('filters', 'f', 'f.id = tf.filter_id AND f.deleted_at IS NULL')
      .select([
        'tf.filter_id AS filter_id',
        `MIN(TRIM(tf.text_value)) AS value_name`,
        'COUNT(DISTINCT tf.task_id) AS cnt',
      ])
      .where('tf.deleted_at IS NULL')
      .andWhere('tf.sub_filter_id IS NULL')
      .andWhere('tf.text_value IS NOT NULL')
      .andWhere("TRIM(tf.text_value) <> ''")
      .andWhere('tf.filter_id IN (:...filterIds)', { filterIds })
      .andWhere(from ? 't.created_at >= :from' : '1=1', from ? { from } : {})
      .andWhere(to ? 't.created_at <= :to' : '1=1', to ? { to } : {})
      .groupBy('tf.filter_id')
      .addGroupBy('LOWER(TRIM(tf.text_value))')
      .orderBy('tf.filter_id', 'ASC')
      .addOrderBy('LOWER(TRIM(tf.text_value))', 'ASC')
      .getRawMany<{
        filter_id: string;
        value_name: string | null;
        cnt: string;
      }>();

    const push = (filterId: string, name: string, count: number) => {
      const bucket = byId.get(filterId);
      if (!bucket) return;
      bucket.values.push({ name, count });
    };

    for (const r of subRows) {
      const fname = String(r.value_name ?? '').trim() || '—';
      push(String(r.filter_id), fname, Number(r.cnt ?? 0));
    }
    for (const r of textRows) {
      const v = String(r.value_name ?? '').trim() || '—';
      push(String(r.filter_id), v, Number(r.cnt ?? 0));
    }

    // Only return filters assigned to project (even if no values -> empty array).
    return Array.from(byId.values()).map((f) => ({
      ...f,
      values: (f.values ?? []).filter((x) => x.count > 0),
    }));
  }
}
