import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import {
  FilterCategory,
  FilterOption,
  Level,
  Role,
  TaskPriority,
  TaskStatus,
  Trade,
  UserStatus,
  UserType,
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
    @InjectRepository(UserType)
    private readonly userTypeRepository: Repository<UserType>,
    @InjectRepository(UserStatus)
    private readonly userStatusRepository: Repository<UserStatus>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
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

  getUserTypes() {
    return this.userTypeRepository.find({
      where: { deletedAt: IsNull() },
      order: { name: 'ASC' },
      select: { id: true, code: true, name: true },
    });
  }

  getUserStatuses() {
    return this.userStatusRepository.find({
      where: { deletedAt: IsNull() },
      order: { name: 'ASC' },
      select: { id: true, code: true, name: true, isActive: true },
    });
  }

  getRoles() {
    return this.roleRepository.find({
      where: { deletedAt: IsNull() },
      order: { name: 'ASC' },
      select: { id: true, code: true, name: true, isSystemRole: true },
    });
  }

  getFilterOptions(filterCategoryId?: string) {
    if (filterCategoryId) {
      return this.filterOptionRepository.find({
        where: {
          deletedAt: IsNull(),
          filterCategoryId,
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
