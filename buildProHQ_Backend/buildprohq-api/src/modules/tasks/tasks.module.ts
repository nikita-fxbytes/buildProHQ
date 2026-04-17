import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksQueriesRepository } from './tasks-queries.repository';
import { TasksCommandsService } from './tasks-commands.service';
import { TasksAnalyticsService } from './tasks-analytics.service';
import {
  Attachment,
  ProjectUser,
  Task,
  TaskAssignment,
  TaskComment,
  TaskCompletion,
  TaskHistory,
  TaskPriority,
  TaskStatus,
} from '../../infrastructure/persistence/typeorm/entities';
import { TaskAttachmentsService } from './task-attachments.service';
import { ProjectFiltersModule } from '../project-filters/project-filters.module';

@Module({
  imports: [
    ProjectFiltersModule,
    TypeOrmModule.forFeature([
      Task,
      TaskStatus,
      TaskAssignment,
      TaskCompletion,
      TaskComment,
      TaskHistory,
      TaskPriority,
      Attachment,
      ProjectUser,
    ]),
  ],
  controllers: [TasksController],
  providers: [
    TasksQueriesRepository,
    TasksCommandsService,
    TasksAnalyticsService,
    TasksService,
    TaskAttachmentsService,
  ],
})
export class TasksModule {}
