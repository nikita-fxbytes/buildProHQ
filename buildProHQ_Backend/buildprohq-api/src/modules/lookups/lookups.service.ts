import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import {
  FilterCategory,
  FilterOption,
  Level,
  TaskPriority,
  TaskStatus,
  Trade,
} from '../../infrastructure/persistence/typeorm/entities';

@Injectable()
export class LookupsService {
  constructor(
    @InjectRepository(Trade)
    private readonly tradeRepository: Repository<Trade>,
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
    @InjectRepository(TaskStatus)
    private readonly taskStatusRepository: Repository<TaskStatus>,
    @InjectRepository(TaskPriority)
    private readonly taskPriorityRepository: Repository<TaskPriority>,
    @InjectRepository(FilterCategory)
    private readonly filterCategoryRepository: Repository<FilterCategory>,
    @InjectRepository(FilterOption)
    private readonly filterOptionRepository: Repository<FilterOption>,
  ) {}

  getTrades() {
    return this.tradeRepository.find({
      where: { deletedAt: IsNull() },
      order: { sortOrder: 'ASC', name: 'ASC' },
      select: { id: true, code: true, name: true, sortOrder: true },
    });
  }

  getLevels() {
    return this.levelRepository.find({
      where: { deletedAt: IsNull() },
      order: { sortOrder: 'ASC', name: 'ASC' },
      select: { id: true, code: true, name: true, sortOrder: true },
    });
  }

  getTaskStatuses() {
    return this.taskStatusRepository.find({
      where: { deletedAt: IsNull() },
      order: { name: 'ASC' },
      select: { id: true, code: true, name: true, isTerminal: true },
    });
  }

  getTaskPriorities() {
    return this.taskPriorityRepository.find({
      where: { deletedAt: IsNull() },
      order: { sortOrder: 'ASC', name: 'ASC' },
      select: { id: true, code: true, name: true, sortOrder: true },
    });
  }

  getFilterCategories() {
    return this.filterCategoryRepository.find({
      where: { deletedAt: IsNull() },
      order: { name: 'ASC' },
      select: { id: true, code: true, name: true, isSystemCategory: true },
    });
  }

  getFilterOptions(categoryId?: string) {
    if (categoryId) {
      return this.filterOptionRepository.find({
        where: {
          deletedAt: IsNull(),
          filterCategoryId: categoryId,
        },
        order: { sortOrder: 'ASC', name: 'ASC' },
        select: {
          id: true,
          filterCategoryId: true,
          code: true,
          name: true,
          sortOrder: true,
        },
      });
    }
    return this.filterOptionRepository.find({
      where: { deletedAt: IsNull() },
      order: { filterCategoryId: 'ASC', sortOrder: 'ASC', name: 'ASC' },
      select: {
        id: true,
        filterCategoryId: true,
        code: true,
        name: true,
        sortOrder: true,
      },
    });
  }
}
