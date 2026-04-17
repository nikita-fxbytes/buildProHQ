import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  FilterProject,
  ProjectDynamicFilter,
  ProjectUser,
  SubFilterEntity,
  TaskFilterRow,
} from '../../infrastructure/persistence/typeorm/entities';
import { ProjectFiltersController } from './project-filters.controller';
import { ProjectFiltersService } from './project-filters.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectDynamicFilter,
      FilterProject,
      SubFilterEntity,
      TaskFilterRow,
      ProjectUser,
    ]),
  ],
  controllers: [ProjectFiltersController],
  providers: [ProjectFiltersService],
  exports: [ProjectFiltersService],
})
export class ProjectFiltersModule {}
