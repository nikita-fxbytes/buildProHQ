import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import {
  ProjectDynamicFilter,
  ProjectUser,
  SubFilterEntity,
  TaskFilterRow,
  FilterProject,
} from '../../infrastructure/persistence/typeorm/entities';
import { MESSAGES } from '../../infrastructure/common/constants/messages';
import type { AuthUser } from '../../infrastructure/common/interfaces/auth-user.interface';
import { CreateProjectFilterDto } from './dto/create-project-filter.dto';
import { UpdateProjectFilterDto } from './dto/update-project-filter.dto';
import { ListProjectFiltersQueryDto } from './dto/list-project-filters-query.dto';
import type { TaskFilterValueInputDto } from './dto/task-filter-value-input.dto';
import { SearchProjectFiltersDto } from './dto/search-project-filters.dto';

function dedupeNames(names: string[] | undefined): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of names ?? []) {
    const t = raw.trim();
    if (!t) continue;
    const k = t.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(t);
  }
  return out.slice(0, 200);
}

function normalizeFilterName(name: string | undefined | null) {
  return String(name ?? '').trim();
}

@Injectable()
export class ProjectFiltersService {
  private readonly logger = new Logger(ProjectFiltersService.name);

  constructor(
    @InjectRepository(ProjectDynamicFilter)
    private readonly filterRepo: Repository<ProjectDynamicFilter>,
    @InjectRepository(FilterProject)
    private readonly filterProjectRepo: Repository<FilterProject>,
    @InjectRepository(SubFilterEntity)
    private readonly subFilterRepo: Repository<SubFilterEntity>,
    @InjectRepository(TaskFilterRow)
    private readonly taskFilterRepo: Repository<TaskFilterRow>,
    @InjectRepository(ProjectUser)
    private readonly projectUserRepo: Repository<ProjectUser>,
  ) {}

  /** GET /projects/:projectId/filters — task create/edit form */
  async listForTaskForm(projectId: string) {
    const pid = String(projectId ?? '').trim();
    if (!pid) {
      return {
        message: MESSAGES.COMMON.SUCCESS,
        data: { filters: [] as unknown[] },
        meta: {},
      };
    }
    const filterIds = await this.filterProjectRepo
      .createQueryBuilder('fp')
      .select(['fp.filter_id AS id'])
      .where('fp.project_id = :projectId', { projectId: pid })
      .getRawMany<{ id: string }>();
    const ids = filterIds.map((r) => r.id).filter(Boolean);
    if (!ids.length) {
      return {
        message: MESSAGES.COMMON.SUCCESS,
        data: { filters: [] as unknown[] },
        meta: {},
      };
    }
    const filters = await this.filterRepo.find({
      where: { id: In(ids), deletedAt: IsNull() } as any,
      order: { name: 'ASC' },
      relations: ['subFilters'],
    });
    const data = filters.map((f) => ({
      id: f.id,
      name: f.name,
      hasSubFilters: f.hasSubFilters,
      isMultiSelect: f.isMultiSelect,
      subFilters: (f.subFilters ?? [])
        .filter((s) => !s.deletedAt)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((s) => ({ id: s.id, name: s.name })),
    }));
    return {
      message: MESSAGES.COMMON.SUCCESS,
      data: { filters: data },
      meta: {},
    };
  }

  async listDefinitions(actor: AuthUser, query: ListProjectFiltersQueryDto) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 20));
    const offset = (page - 1) * limit;
    const term = (query.search ?? '').trim();

    const qb = this.filterRepo
      .createQueryBuilder('f')
      .leftJoin('filter_projects', 'fp', 'fp.filter_id = f.id')
      .leftJoin('projects', 'p', 'p.id = fp.project_id')
      .select([
        'f.id AS "id"',
        'f.name AS "name"',
        'p.name AS "projectName"',
        'f.has_sub_filters AS "hasSubFilters"',
        'f.is_multi_select AS "isMultiSelect"',
        'f.created_at AS "createdAt"',
      ])
      .where('f.deleted_at IS NULL');

    const projectIds = (query.projectIds ?? []).length
      ? query.projectIds
      : query.projectId
        ? [query.projectId]
        : [];
    const projectIdsSafe = (projectIds ?? []).filter(Boolean);
    if (projectIdsSafe.length) {
      qb.andWhere('fp.project_id IN (:...projectIds)', {
        projectIds: projectIdsSafe,
      });
    }
    if (actor.role === 'manager') {
      qb.innerJoin(
        'project_users',
        'pu',
        'pu.project_id = fp.project_id AND pu.user_id = :uid AND pu.deleted_at IS NULL',
        { uid: actor.id },
      );
    }
    if (term) {
      qb.andWhere('(f.name ILIKE :q OR p.name ILIKE :q)', { q: `%${term}%` });
    }

    qb.orderBy('f.created_at', 'DESC').addOrderBy('f.name', 'ASC');
    qb.groupBy('f.id').addGroupBy('p.name');

    const [rows, total] = await Promise.all([
      qb.clone().offset(offset).limit(limit).getRawMany(),
      qb
        .clone()
        .select('COUNT(DISTINCT f.id)', 'cnt')
        .orderBy()
        .getRawOne()
        .then((r) => Number((r as { cnt?: string })?.cnt ?? 0)),
    ]);

    const mapped = rows.map((r: Record<string, unknown>) => ({
      id: r.id,
      name: r.name,
      projectId: null,
      projectName: r.projectName,
      type: r.hasSubFilters ? 'sub_filter' : 'simple',
      isMultiSelect: Boolean(r.isMultiSelect),
      hasSubFilters: Boolean(r.hasSubFilters),
      createdAt: r.createdAt,
    }));

    return {
      message: MESSAGES.COMMON.SUCCESS,
      data: mapped,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  /**
   * POST /project-filters/search
   * Strictly project-scoped: if projectIds is empty/missing => safe empty response.
   */
  async searchDefinitions(actor: AuthUser, dto: SearchProjectFiltersDto) {
    const page = Math.max(1, Number(dto.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(dto.limit ?? 20)));
    const offset = (page - 1) * limit;
    const term = (dto.search ?? '').trim();
    const projectIds = Array.isArray(dto.projectIds)
      ? dto.projectIds.filter(Boolean)
      : [];
    if (!projectIds.length) {
      return {
        message: MESSAGES.COMMON.SUCCESS,
        data: [],
        meta: { total: 0, page, limit, totalPages: 1 },
      };
    }

    const sortBy = dto.sortBy ?? 'createdAt';
    const sortOrder =
      String(dto.sortOrder ?? 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const sortCol = sortBy === 'name' ? 'f.name' : 'f.created_at';

    // Manager: enforce membership for requested projects (avoid leaking other projects)
    if (actor.role === 'manager') {
      const allowed = await this.projectUserRepo.find({
        where: {
          userId: actor.id,
          projectId: In(projectIds),
          deletedAt: IsNull(),
        },
        select: { projectId: true },
      });
      const ok = new Set(allowed.map((r) => r.projectId));
      if (projectIds.some((id) => !ok.has(id))) {
        return {
          message: MESSAGES.COMMON.SUCCESS,
          data: [],
          meta: { total: 0, page, limit, totalPages: 1 },
        };
      }
    }

    const qb = this.filterRepo
      .createQueryBuilder('f')
      .leftJoin('filter_projects', 'fp', 'fp.filter_id = f.id')
      .leftJoin('projects', 'p', 'p.id = fp.project_id')
      .leftJoin(
        'sub_filters',
        'sf',
        'sf.filter_id = f.id AND sf.deleted_at IS NULL',
      )
      .select([
        'f.id AS "id"',
        'f.name AS "name"',
        'p.name AS "projectName"',
        'f.has_sub_filters AS "hasSubFilters"',
        'f.is_multi_select AS "isMultiSelect"',
        'f.created_at AS "createdAt"',
        'COUNT(DISTINCT sf.id) AS "subFiltersCount"',
      ])
      .where('f.deleted_at IS NULL')
      .andWhere('fp.project_id IN (:...projectIds)', { projectIds })
      .groupBy('f.id')
      .addGroupBy('p.name');

    if (term) {
      qb.andWhere('(f.name ILIKE :q OR p.name ILIKE :q)', { q: `%${term}%` });
    }

    qb.orderBy(sortCol, sortOrder as any).addOrderBy('f.name', 'ASC');

    const [rows, total] = await Promise.all([
      qb.clone().offset(offset).limit(limit).getRawMany(),
      (() => {
        const qbCount = this.filterRepo
          .createQueryBuilder('f')
          .leftJoin('filter_projects', 'fp', 'fp.filter_id = f.id')
          .where('f.deleted_at IS NULL')
          .andWhere('fp.project_id IN (:...projectIds)', { projectIds });
        if (term) qbCount.andWhere('f.name ILIKE :q', { q: `%${term}%` });
        return qbCount
          .select('COUNT(DISTINCT f.id)', 'cnt')
          .getRawOne()
          .then((r) => Number(r?.cnt ?? 0));
      })(),
    ]);

    const mapped = rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      projectId: null,
      projectName: r.projectName,
      type: r.hasSubFilters ? 'sub_filter' : 'simple',
      isMultiSelect: Boolean(r.isMultiSelect),
      hasSubFilters: Boolean(r.hasSubFilters),
      createdAt: r.createdAt,
      subFiltersCount: Number(r.subFiltersCount ?? 0),
    }));

    return {
      message: MESSAGES.COMMON.SUCCESS,
      data: mapped,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async createDefinition(actor: AuthUser, dto: CreateProjectFilterDto) {
    const projectIds = Array.from(
      new Set(
        (dto.projectIds ?? []).map((x) => (x ?? '').trim()).filter(Boolean),
      ),
    );
    await this.assertCanManageProjects(actor, projectIds);

    const hasSub = Boolean(dto.hasSubFilters);
    const subs = dedupeNames(dto.subFilterNames);
    if (hasSub && !subs.length) {
      throw new BadRequestException(
        'Add at least one sub-filter name when sub-filters are enabled.',
      );
    }
    if (!hasSub && subs.length) {
      throw new BadRequestException(
        'Sub-filter names are only allowed when hasSubFilters is true.',
      );
    }
    const isMulti = hasSub ? Boolean(dto.isMultiSelect) : false;
    if (!hasSub && dto.isMultiSelect) {
      throw new BadRequestException(
        'Multi-select is only valid when sub-filters are enabled.',
      );
    }

    if (!projectIds.length) {
      throw new BadRequestException('projectIds is required');
    }

    const nameTrim = normalizeFilterName(dto.name);
    if (!nameTrim) throw new BadRequestException('name is required');

    // Enforce uniqueness per-project (MANDATORY raw SQL)
    try {
      const dupRows = await this.filterRepo.query(
        `
        SELECT f.id
        FROM filters f
        JOIN filter_projects fp ON fp.filter_id = f.id
        WHERE LOWER(TRIM(f.name)) = LOWER(TRIM($1))
          AND fp.project_id = ANY($2::uuid[])
          AND f.deleted_at IS NULL
        LIMIT 1
        `,
        [nameTrim, projectIds],
      );

      if (Array.isArray(dupRows) && dupRows.length > 0) {
        throw new BadRequestException(
          'This filter already exists in the selected project',
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      console.error('FILTER DUP CHECK ERROR (create):', error);
      // Fail-safe: do not allow potential duplicates if DB check fails unexpectedly.
      throw new BadRequestException(
        'This filter already exists in the selected project',
      );
    }

    const saved = await this.filterRepo.save(
      this.filterRepo.create({
        name: nameTrim,
        hasSubFilters: hasSub,
        isMultiSelect: isMulti,
      }),
    );

    await this.filterProjectRepo.save(
      projectIds.map(
        (projectId) =>
          this.filterProjectRepo.create({
            filterId: saved.id,
            projectId,
          }) as any,
      ),
    );

    if (hasSub && subs.length) {
      await this.subFilterRepo.save(
        subs.map((name) =>
          this.subFilterRepo.create({
            filterId: saved.id,
            name,
          }),
        ),
      );
    }

    return this.getDefinitionById(actor, saved.id);
  }

  async updateDefinition(
    actor: AuthUser,
    id: string,
    dto: UpdateProjectFilterDto,
  ) {
    const row = await this.filterRepo.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['subFilters'],
    });
    if (!row) throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);
    // Must be allowed to manage at least one mapped project; enforced by mapping table.
    await this.assertCanManageFilter(actor, row.id);

    const nextHas =
      dto.hasSubFilters !== undefined
        ? Boolean(dto.hasSubFilters)
        : row.hasSubFilters;
    const nextMulti =
      dto.isMultiSelect !== undefined
        ? Boolean(dto.isMultiSelect)
        : row.isMultiSelect;
    const nextName =
      dto.name !== undefined ? normalizeFilterName(dto.name) : row.name;
    const prevNameNorm = normalizeFilterName(row.name).toLowerCase();
    const nextNameNorm = normalizeFilterName(nextName).toLowerCase();

    if (!nextHas && nextMulti) {
      throw new BadRequestException(
        'Multi-select is only valid when sub-filters are enabled.',
      );
    }

    if (dto.subFilterNames !== undefined) {
      const subs = dedupeNames(dto.subFilterNames);
      if (nextHas && !subs.length) {
        throw new BadRequestException(
          'Add at least one sub-filter name when sub-filters are enabled.',
        );
      }
      if (!nextHas && subs.length) {
        throw new BadRequestException(
          'Sub-filter names are only allowed when hasSubFilters is true.',
        );
      }
    }

    // Name uniqueness per project (case-insensitive, trim).
    // If only the name changes (no mapping changes), validate against current mappings.
    if (dto.name !== undefined && nextNameNorm !== prevNameNorm) {
      const mapped = await this.filterProjectRepo.find({
        where: { filterId: id } as any,
        select: { projectId: true },
      });
      const projectIds = mapped.map((m) => m.projectId).filter(Boolean);
      if (projectIds.length) {
        try {
          const dupRows = await this.filterRepo.query(
            `
            SELECT f.id
            FROM filters f
            JOIN filter_projects fp ON fp.filter_id = f.id
            WHERE LOWER(TRIM(f.name)) = LOWER(TRIM($1))
              AND fp.project_id = ANY($2::uuid[])
              AND f.deleted_at IS NULL
              AND f.id <> $3
            LIMIT 1
            `,
            [nextName, projectIds, id],
          );

          if (Array.isArray(dupRows) && dupRows.length > 0) {
            throw new BadRequestException(
              'This filter already exists in the selected project',
            );
          }
        } catch (error) {
          if (error instanceof BadRequestException) throw error;

          console.error('FILTER DUP CHECK ERROR (update-name):', error);
          throw new BadRequestException(
            'This filter already exists in the selected project',
          );
        }
      }
    }

    row.name = nextName;
    row.hasSubFilters = nextHas;
    row.isMultiSelect = nextHas ? nextMulti : false;
    await this.filterRepo.save(row);

    // If projectIds provided, replace mappings (delete old -> insert new)
    const anyDto = dto as any;
    if (Array.isArray(anyDto.projectIds)) {
      const nextProjectIds: string[] = Array.from(
        new Set(
          anyDto.projectIds
            .map((x: any) => String(x ?? '').trim())
            .filter(Boolean),
        ),
      );
      await this.assertCanManageProjects(actor, nextProjectIds);
      // name uniqueness per project
      if (nextProjectIds.length) {
        try {
          const dupRows = await this.filterRepo.query(
            `
            SELECT f.id
            FROM filters f
            JOIN filter_projects fp ON fp.filter_id = f.id
            WHERE LOWER(TRIM(f.name)) = LOWER(TRIM($1))
              AND fp.project_id = ANY($2::uuid[])
              AND f.deleted_at IS NULL
              AND f.id <> $3
            LIMIT 1
            `,
            [nextName, nextProjectIds, id],
          );

          if (Array.isArray(dupRows) && dupRows.length > 0) {
            throw new BadRequestException(
              'This filter already exists in the selected project',
            );
          }
        } catch (error) {
          if (error instanceof BadRequestException) throw error;

          console.error('FILTER DUP CHECK ERROR (update-projectIds):', error);
          throw new BadRequestException(
            'This filter already exists in the selected project',
          );
        }
      }
      await this.filterProjectRepo.delete({ filterId: id } as any);
      if (nextProjectIds.length) {
        await this.filterProjectRepo.save(
          nextProjectIds.map((projectId) => ({ filterId: id, projectId })),
        );
      }
    }

    if (dto.subFilterNames !== undefined && nextHas) {
      const subs = dedupeNames(dto.subFilterNames);
      const existing = (row.subFilters ?? []).filter((s) => !s.deletedAt);
      const byLower = new Map(existing.map((s) => [s.name.toLowerCase(), s]));
      const incoming = new Set(subs.map((n) => n.toLowerCase()));

      for (const s of existing) {
        if (!incoming.has(s.name.toLowerCase())) {
          await this.subFilterRepo.softDelete({ id: s.id });
        }
      }
      for (const name of subs) {
        const hit = byLower.get(name.toLowerCase());
        if (!hit) {
          await this.subFilterRepo.save(
            this.subFilterRepo.create({ filterId: row.id, name }),
          );
        }
      }
    }

    if (dto.subFilterNames !== undefined && !nextHas) {
      const existing = await this.subFilterRepo.find({
        where: { filterId: row.id, deletedAt: IsNull() },
        select: { id: true },
      });
      for (const s of existing) {
        await this.subFilterRepo.softDelete({ id: s.id });
      }
    }

    return this.getDefinitionById(actor, id);
  }

  async getDefinition(actor: AuthUser, id: string) {
    return this.getDefinitionById(actor, id);
  }

  async deleteDefinition(actor: AuthUser, id: string) {
    const row = await this.filterRepo.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!row) throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);
    await this.assertCanManageFilter(actor, id);
    const usedCount = await this.taskFilterRepo.count({
      where: { filterId: id, deletedAt: IsNull() } as any,
    });
    if (usedCount > 0) {
      throw new BadRequestException('Filter is in use and cannot be deleted');
    }
    await this.filterRepo.softDelete({ id });
    return { message: MESSAGES.COMMON.SUCCESS, data: { id } };
  }

  private async getDefinitionById(actor: AuthUser, id: string) {
    const row = await this.filterRepo.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['subFilters'],
    });
    if (!row) throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);
    await this.assertCanManageFilter(actor, id);
    const mapped = await this.filterProjectRepo.find({
      where: { filterId: id } as any,
      select: { projectId: true },
    });
    const projectIds = mapped.map((m) => m.projectId).filter(Boolean);
    const subs = (row.subFilters ?? [])
      .filter((s) => !s.deletedAt)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((s) => ({ id: s.id, name: s.name }));
    return {
      message: MESSAGES.COMMON.SUCCESS,
      data: {
        id: row.id,
        name: row.name,
        projectId: projectIds[0] ?? null,
        projectIds,
        hasSubFilters: row.hasSubFilters,
        isMultiSelect: row.isMultiSelect,
        subFilters: subs,
      },
    };
  }

  private async assertCanManageProjects(actor: AuthUser, projectIds: string[]) {
    if (actor.role === 'super_admin') return;
    if (actor.role !== 'manager') {
      throw new BadRequestException(MESSAGES.COMMON.FORBIDDEN);
    }
    if (!projectIds.length)
      throw new BadRequestException(MESSAGES.COMMON.FORBIDDEN);
    const rows = await this.projectUserRepo.find({
      where: {
        userId: actor.id,
        projectId: In(projectIds),
        deletedAt: IsNull(),
      },
      select: { projectId: true },
    });
    const ok = new Set(rows.map((r) => r.projectId));
    if (projectIds.some((id) => !ok.has(id)))
      throw new BadRequestException(MESSAGES.COMMON.FORBIDDEN);
  }

  private async assertCanManageFilter(actor: AuthUser, filterId: string) {
    if (actor.role === 'super_admin') return;
    if (actor.role !== 'manager')
      throw new BadRequestException(MESSAGES.COMMON.FORBIDDEN);
    const mapped = await this.filterProjectRepo.find({
      where: { filterId } as any,
      select: { projectId: true },
    });
    const projectIds = mapped.map((m) => m.projectId).filter(Boolean);
    await this.assertCanManageProjects(actor, projectIds);
  }

  /** Replace all task_filters rows for a task (soft-delete old, insert new). */
  async replaceTaskFilters(
    taskId: string,
    projectId: string,
    values: TaskFilterValueInputDto[] | undefined,
  ) {
    const inputs = Array.isArray(values) ? values : [];
    const rows = await this.validateAndBuildRows(projectId, inputs);

    await this.taskFilterRepo
      .createQueryBuilder()
      .softDelete()
      .where('"task_id" = :taskId', { taskId })
      .execute();

    if (rows.length) {
      await this.taskFilterRepo.save(
        rows.map((r) =>
          this.taskFilterRepo.create({
            taskId,
            filterId: r.filterId,
            subFilterId: r.subFilterId,
            textValue: r.textValue,
          }),
        ),
      );
    }
  }

  private async validateAndBuildRows(
    projectId: string,
    inputs: TaskFilterValueInputDto[],
  ) {
    const uniqByFilter = new Map<string, TaskFilterValueInputDto>();
    for (const i of inputs) {
      if (i?.filterId) uniqByFilter.set(i.filterId, i);
    }
    const deduped = [...uniqByFilter.values()];
    const filterIds = deduped.map((i) => i.filterId);
    if (!filterIds.length) return [];

    // Validate filterIds are mapped to project via filter_projects
    const mapped = await this.filterProjectRepo
      .createQueryBuilder('fp')
      .select(['fp.filter_id AS id'])
      .where('fp.project_id = :projectId', { projectId })
      .andWhere('fp.filter_id IN (:...filterIds)', { filterIds })
      .getRawMany<{ id: string }>();
    const allowed = new Set(mapped.map((r) => r.id));
    if (filterIds.some((id) => !allowed.has(id))) {
      throw new BadRequestException(
        'One or more filters are invalid for the selected project.',
      );
    }

    const defs = await this.filterRepo.find({
      where: { id: In(filterIds), deletedAt: IsNull() } as any,
      relations: ['subFilters'],
    });

    const defById = new Map(defs.map((d) => [d.id, d]));
    if (defs.length !== filterIds.length) {
      throw new BadRequestException(
        'One or more filters are invalid for the selected project.',
      );
    }
    const out: {
      filterId: string;
      subFilterId: string | null;
      textValue: string | null;
    }[] = [];

    for (const input of deduped) {
      const def = defById.get(input.filterId);
      if (!def) {
        throw new BadRequestException(
          'One or more filters are invalid for the selected project.',
        );
      }
      const subIds = Array.from(
        new Set((input.subFilterIds ?? []).filter(Boolean)),
      );
      const text = (input.textValue ?? '').trim();

      if (def.hasSubFilters) {
        if (text) {
          throw new BadRequestException(
            `Filter "${def.name}" expects sub-filter selection, not text.`,
          );
        }
        if (!subIds.length) {
          continue;
        }
        const allowed = new Set(
          (def.subFilters ?? []).filter((s) => !s.deletedAt).map((s) => s.id),
        );
        if (subIds.some((id) => !allowed.has(id))) {
          throw new BadRequestException(
            `Invalid sub-filter selection for "${def.name}".`,
          );
        }
        if (!def.isMultiSelect && subIds.length !== 1) {
          throw new BadRequestException(
            `Filter "${def.name}" allows only one sub-filter.`,
          );
        }
        for (const sid of subIds) {
          out.push({ filterId: def.id, subFilterId: sid, textValue: null });
        }
      } else {
        if (subIds.length) {
          throw new BadRequestException(
            `Filter "${def.name}" does not use sub-filters.`,
          );
        }
        if (!text) {
          continue;
        }
        out.push({ filterId: def.id, subFilterId: null, textValue: text });
      }
    }

    return out;
  }

  /** Grouped values for task detail / edit form */
  async getTaskFilterSelectionsForTask(taskId: string): Promise<
    Array<{
      filterId: string;
      subFilterIds: string[];
      textValue: string | null;
    }>
  > {
    const rows = await this.taskFilterRepo.find({
      where: { taskId, deletedAt: IsNull() },
      order: { filterId: 'ASC', id: 'ASC' },
    });
    const byFilter = new Map<
      string,
      { subFilterIds: string[]; textValue: string | null }
    >();
    for (const r of rows) {
      const cur = byFilter.get(r.filterId) ?? {
        subFilterIds: [],
        textValue: null,
      };
      if (r.subFilterId) cur.subFilterIds.push(r.subFilterId);
      if (r.textValue) cur.textValue = r.textValue;
      byFilter.set(r.filterId, cur);
    }
    return Array.from(byFilter.entries()).map(([filterId, v]) => ({
      filterId,
      subFilterIds: v.subFilterIds,
      textValue: v.textValue,
    }));
  }

  /**
   * Resolved, display-ready filter labels for task detail views.
   * Includes soft-deleted filters/sub-filters so old tasks still render.
   */
  async getTaskFiltersForView(taskId: string): Promise<
    Array<{
      filterId: string;
      name: string;
      value: string;
      subFilterNames: string[];
      textValue: string | null;
    }>
  > {
    const tid = String(taskId ?? '').trim();
    if (!tid) return [];
    const rows = await this.taskFilterRepo
      .createQueryBuilder('tf')
      .leftJoin('filters', 'f', 'f.id = tf.filter_id')
      .leftJoin('sub_filters', 'sf', 'sf.id = tf.sub_filter_id')
      .select([
        'tf.filter_id AS filter_id',
        'tf.text_value AS text_value',
        'f.name AS filter_name',
        'f.deleted_at AS filter_deleted_at',
        'sf.name AS sub_filter_name',
        'sf.deleted_at AS sub_filter_deleted_at',
      ])
      .where('tf.task_id = :taskId', { taskId: tid })
      .andWhere('tf.deleted_at IS NULL')
      .orderBy('tf.filter_id', 'ASC')
      .addOrderBy('tf.id', 'ASC')
      .getRawMany<{
        filter_id: string;
        text_value: string | null;
        filter_name: string | null;
        filter_deleted_at: string | null;
        sub_filter_name: string | null;
        sub_filter_deleted_at: string | null;
      }>();

    const byFilter = new Map<
      string,
      {
        name: string;
        filterDeleted: boolean;
        subFilterNames: string[];
        textValue: string | null;
      }
    >();
    for (const r of rows) {
      const fid = String(r.filter_id ?? '').trim();
      if (!fid) continue;
      const cur = byFilter.get(fid) ?? {
        name:
          String(r.filter_name ?? '').trim() || `Unknown (${fid.slice(0, 8)})`,
        filterDeleted: Boolean(r.filter_deleted_at),
        subFilterNames: [] as string[],
        textValue: null as string | null,
      };
      const sfName = String(r.sub_filter_name ?? '').trim();
      if (sfName) {
        cur.subFilterNames.push(
          r.sub_filter_deleted_at ? `${sfName} (deleted)` : sfName,
        );
      }
      const text = String(r.text_value ?? '').trim();
      if (text) cur.textValue = text;
      byFilter.set(fid, cur);
    }

    return Array.from(byFilter.entries()).map(([filterId, v]) => {
      const name = v.filterDeleted ? `${v.name} (deleted)` : v.name;
      const subList = (v.subFilterNames ?? []).filter(Boolean);
      const value = subList.length ? subList.join(', ') : (v.textValue ?? '');
      return {
        filterId,
        name,
        value: value || '—',
        subFilterNames: subList,
        textValue: v.textValue,
      };
    });
  }
}
