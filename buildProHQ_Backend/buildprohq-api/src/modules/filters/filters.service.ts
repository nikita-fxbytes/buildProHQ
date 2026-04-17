import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import {
  FilterCategory,
  FilterOption,
} from '../../infrastructure/persistence/typeorm/entities';
import { MESSAGES } from '../../infrastructure/common/constants/messages';

function slugCode(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 50);
}

/** Trim, drop empties, dedupe within the request (case-insensitive), max 100. */
function normalizeAndDedupeSubFilterNames(
  names: string[] | undefined,
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of names ?? []) {
    const t = raw.trim();
    if (!t) continue;
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out.slice(0, 100);
}

@Injectable()
export class FiltersService {
  constructor(
    @InjectRepository(FilterCategory)
    private readonly filterCategoryRepo: Repository<FilterCategory>,
    @InjectRepository(FilterOption)
    private readonly filterOptionRepo: Repository<FilterOption>,
  ) {}

  async list(params?: {
    projectId?: string;
    projectIds?: string[] | string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(params?.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(params?.limit ?? 20)));
    const offset = (page - 1) * limit;
    const term = (params?.search ?? '').trim();

    const idsFromArray = Array.isArray(params?.projectIds)
      ? params.projectIds
      : typeof params?.projectIds === 'string'
        ? [params.projectIds]
        : [];
    const mergedIds = Array.from(
      new Set(
        [params?.projectId, ...idsFromArray]
          .map((x) => (x ?? '').trim())
          .filter(Boolean),
      ),
    );

    try {
      const catsQb = this.filterCategoryRepo
        .createQueryBuilder('fc')
        .select([
          'fc.id AS id',
          'fc.project_id AS projectId',
          'fc.name AS name',
          'fc.code AS code',
          'fc.created_at AS createdAt',
        ])
        .where('fc.deleted_at IS NULL');

      if (mergedIds.length) {
        catsQb.andWhere('fc.project_id IN (:...projectIds)', {
          projectIds: mergedIds,
        });
      }
      if (term) {
        catsQb.andWhere('fc.name ILIKE :q', { q: `%${term}%` });
      }

      catsQb.orderBy('fc.created_at', 'DESC').addOrderBy('fc.name', 'ASC');

      const [cats, total] = await Promise.all([
        catsQb.clone().offset(offset).limit(limit).getRawMany<any>(),
        catsQb
          .clone()
          .select('COUNT(DISTINCT fc.id)', 'cnt')
          .orderBy()
          .getRawOne()
          .then((r) => Number(r?.cnt ?? 0)),
      ]);

      const categoryIds = (Array.isArray(cats) ? cats : [])
        .map((c) => c.id)
        .filter(Boolean);
      const options = categoryIds.length
        ? await this.filterOptionRepo
            .createQueryBuilder('fo')
            .select([
              'fo.id AS id',
              'fo.filter_category_id AS filterCategoryId',
              'fo.name AS name',
              'fo.code AS code',
              'fo.sort_order AS sortOrder',
              'fo.created_at AS createdAt',
            ])
            .where('fo.deleted_at IS NULL')
            .andWhere('fo.filter_category_id IN (:...categoryIds)', {
              categoryIds,
            })
            .orderBy('fo.sort_order', 'ASC')
            .addOrderBy('fo.name', 'ASC')
            .getRawMany<any>()
        : [];

      return {
        message: MESSAGES.COMMON.SUCCESS,
        data: {
          categories: Array.isArray(cats) ? cats : [],
          options: Array.isArray(options) ? options : [],
        },
        meta: {
          total,
          page,
          limit,
          totalPages: Math.max(1, Math.ceil(total / limit)),
        },
      };
    } catch (error) {
      console.error('FILTERS LIST ERROR:', error);
      return {
        message: MESSAGES.COMMON.SUCCESS,
        data: { categories: [], options: [] },
        meta: { total: 0, page, limit, totalPages: 1 },
      };
    }
  }

  async saveFilter(params: {
    projectIds?: string[];
    filterCategoryId?: string;
    filterCategoryName?: string;
    subFilterNames?: string[];
  }) {
    const options = normalizeAndDedupeSubFilterNames(params.subFilterNames);
    const hasId = Boolean((params.filterCategoryId ?? '').trim());
    const nameTrim = (params.filterCategoryName ?? '').trim();
    const hasName = Boolean(nameTrim);
    const projectIds = (params.projectIds ?? [])
      .map((p) => (p ?? '').trim())
      .filter(Boolean);

    if (!hasId && !hasName && !options.length) {
      throw new BadRequestException(MESSAGES.FILTERS.CATEGORY_OR_SUBS);
    }
    if (!hasId && !hasName && options.length) {
      throw new BadRequestException(
        MESSAGES.FILTERS.CATEGORY_NAME_OR_ID_FOR_OPTIONS,
      );
    }

    if (hasId) {
      const id = (params.filterCategoryId ?? '').trim();
      const category = await this.filterCategoryRepo.findOne({
        where: { id, deletedAt: IsNull() },
        select: { id: true },
      });
      if (!category) throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);

      await this.appendOptions(category.id, options);
      return { message: MESSAGES.FILTERS.SAVED };
    }

    if (!nameTrim) {
      throw new BadRequestException(MESSAGES.FILTERS.CATEGORY_NAME_REQUIRED);
    }
    if (!projectIds.length) {
      throw new BadRequestException(
        'projectIds is required for project-scoped filters',
      );
    }

    for (const projectId of projectIds) {
      // Find by (projectId, name) case-insensitive
      const existing = await this.filterCategoryRepo
        .createQueryBuilder('fc')
        .select(['fc.id'])
        .where('fc.deleted_at IS NULL')
        .andWhere('fc.project_id = :projectId', { projectId })
        .andWhere('lower(fc.name) = lower(:name)', { name: nameTrim })
        .limit(1)
        .getOne();

      const category =
        existing ??
        (await this.filterCategoryRepo.save(
          this.filterCategoryRepo.create({
            projectId,
            name: nameTrim,
            code: slugCode(nameTrim) || 'category',
            isSystemCategory: false,
          }),
        ));

      await this.appendOptions(category.id, options);
    }

    return { message: MESSAGES.FILTERS.SAVED };
  }

  private async appendOptions(filterCategoryId: string, options: string[]) {
    if (!options.length) return;
    const existingOpts = await this.filterOptionRepo.find({
      where: { filterCategoryId, deletedAt: IsNull() },
      select: { name: true, sortOrder: true },
    });
    let nextSort =
      existingOpts.reduce((m, o) => Math.max(m, o.sortOrder ?? 0), 0) + 1;
    const existingLower = new Set(
      existingOpts.map((o) => o.name.toLowerCase()),
    );

    for (const optName of options) {
      const key = optName.toLowerCase();
      if (existingLower.has(key)) continue;
      existingLower.add(key);
      await this.filterOptionRepo.save(
        this.filterOptionRepo.create({
          filterCategoryId,
          name: optName,
          code: slugCode(optName) || `opt_${nextSort}`,
          sortOrder: nextSort++,
        }),
      );
    }
  }

  async deleteCategory(id: string) {
    const category = await this.filterCategoryRepo.findOne({
      where: { id, deletedAt: IsNull() },
      select: { id: true, name: true },
    });
    if (!category) throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);

    // Soft delete options first, then category.
    await this.filterOptionRepo.update(
      { filterCategoryId: id, deletedAt: IsNull() },
      { deletedAt: new Date() },
    );
    await this.filterCategoryRepo.update(
      { id, deletedAt: IsNull() },
      { deletedAt: new Date() },
    );
    return { message: MESSAGES.FILTERS.DELETED };
  }

  async deleteOption(id: string) {
    const opt = await this.filterOptionRepo.findOne({
      where: { id, deletedAt: IsNull() },
      select: { id: true },
    });
    if (!opt) throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);
    await this.filterOptionRepo.update(
      { id, deletedAt: IsNull() },
      { deletedAt: new Date() },
    );
    return { message: MESSAGES.FILTERS.OPTION_DELETED };
  }
}
