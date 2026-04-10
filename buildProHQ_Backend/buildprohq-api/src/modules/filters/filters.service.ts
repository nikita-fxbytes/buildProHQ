import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import {
  FilterCategory,
  FilterOption,
  Level,
  Trade,
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
function normalizeAndDedupeSubFilterNames(names: string[] | undefined): string[] {
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
    @InjectRepository(Level)
    private readonly levelRepo: Repository<Level>,
    @InjectRepository(Trade)
    private readonly tradeRepo: Repository<Trade>,
  ) {}

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
    const projectIds = (params.projectIds ?? []).map((p) => (p ?? '').trim()).filter(Boolean);

    if (!hasId && !hasName && !options.length) {
      throw new BadRequestException(MESSAGES.FILTERS.CATEGORY_OR_SUBS);
    }
    if (!hasId && !hasName && options.length) {
      throw new BadRequestException(MESSAGES.FILTERS.CATEGORY_NAME_OR_ID_FOR_OPTIONS);
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
      throw new BadRequestException('projectIds is required for project-scoped filters');
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
    const existingLower = new Set(existingOpts.map((o) => o.name.toLowerCase()));

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

  async quickAddLevel(nameRaw: string) {
    const name = nameRaw.trim();
    if (!name) throw new BadRequestException(MESSAGES.COMMON.BAD_REQUEST);
    const existing = await this.levelRepo.findOne({ where: { name, deletedAt: IsNull() }, select: { id: true } });
    if (existing) return { message: MESSAGES.FILTERS.LEVEL_EXISTS };
    const max = await this.levelRepo.find({ where: { deletedAt: IsNull() }, order: { sortOrder: 'DESC' }, take: 1, select: { sortOrder: true } });
    const sortOrder = (max[0]?.sortOrder ?? 0) + 1;
    await this.levelRepo.save(this.levelRepo.create({ name, code: slugCode(name) || `level_${sortOrder}`, sortOrder }));
    return { message: MESSAGES.FILTERS.LEVEL_ADDED };
  }

  async quickAddTrade(nameRaw: string) {
    const name = nameRaw.trim();
    if (!name) throw new BadRequestException(MESSAGES.COMMON.BAD_REQUEST);
    const existing = await this.tradeRepo.findOne({ where: { name, deletedAt: IsNull() }, select: { id: true } });
    if (existing) return { message: MESSAGES.FILTERS.TRADE_EXISTS };
    const max = await this.tradeRepo.find({ where: { deletedAt: IsNull() }, order: { sortOrder: 'DESC' }, take: 1, select: { sortOrder: true } });
    const sortOrder = (max[0]?.sortOrder ?? 0) + 1;
    await this.tradeRepo.save(this.tradeRepo.create({ name, code: slugCode(name) || `trade_${sortOrder}`, sortOrder }));
    return { message: MESSAGES.FILTERS.TRADE_ADDED };
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
    await this.filterCategoryRepo.update({ id, deletedAt: IsNull() }, { deletedAt: new Date() });
    return { message: MESSAGES.FILTERS.DELETED };
  }

  async deleteOption(id: string) {
    const opt = await this.filterOptionRepo.findOne({
      where: { id, deletedAt: IsNull() },
      select: { id: true },
    });
    if (!opt) throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);
    await this.filterOptionRepo.update({ id, deletedAt: IsNull() }, { deletedAt: new Date() });
    return { message: MESSAGES.FILTERS.OPTION_DELETED };
  }
}

