import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Project,
  ProjectUser,
  Role,
  Task,
  TaskAssignment,
  User,
  UserRole,
} from '../../infrastructure/persistence/typeorm/entities';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectFiltersModule } from '../project-filters/project-filters.module';

@Module({
  imports: [
    ProjectFiltersModule,
    TypeOrmModule.forFeature([
      Project,
      ProjectUser,
      User,
      UserRole,
      Role,
      Task,
      TaskAssignment,
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
