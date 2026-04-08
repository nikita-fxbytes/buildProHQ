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

function parseCsv(csv: string): string[] {
  return csv
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 100);
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
    categoryId?: string;
    categoryName?: string;
    optionsCsv: string;
  }) {
    const options = parseCsv(params.optionsCsv);
    if (!options.length) {
      throw new BadRequestException(MESSAGES.FILTERS.OPTIONS_REQUIRED);
    }

    let category: FilterCategory | null = null;

    if (params.categoryId) {
      category = await this.filterCategoryRepo.findOne({
        where: { id: params.categoryId, deletedAt: IsNull() },
      });
      if (!category) throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);
    } else {
      const name = (params.categoryName ?? '').trim();
      if (!name) {
        throw new BadRequestException(MESSAGES.FILTERS.CATEGORY_NAME_REQUIRED);
      }
      // Reuse by name if exists.
      category =
        (await this.filterCategoryRepo.findOne({
          where: { name, deletedAt: IsNull() },
        })) ?? null;

      if (!category) {
        const codeBase = slugCode(name) || 'category';
        category = await this.filterCategoryRepo.save(
          this.filterCategoryRepo.create({
            name,
            code: codeBase,
            isSystemCategory: false,
          }),
        );
      }
    }

    // Determine sort order start for category.
    const existing = await this.filterOptionRepo.find({
      where: { filterCategoryId: category.id, deletedAt: IsNull() },
      order: { sortOrder: 'DESC' },
      take: 1,
      select: { sortOrder: true },
    });
    let nextSort = (existing[0]?.sortOrder ?? 0) + 1;

    for (const optName of options) {
      const already = await this.filterOptionRepo.findOne({
        where: { filterCategoryId: category.id, name: optName, deletedAt: IsNull() },
        select: { id: true },
      });
      if (already) continue;
      await this.filterOptionRepo.save(
        this.filterOptionRepo.create({
          filterCategoryId: category.id,
          name: optName,
          code: slugCode(optName) || `opt_${nextSort}`,
          sortOrder: nextSort++,
        }),
      );
    }

    return { message: MESSAGES.FILTERS.SAVED };
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

