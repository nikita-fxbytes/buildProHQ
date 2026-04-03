import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import {
  Attachment,
  Task,
  TaskAssignment,
  TaskComment,
  TaskCompletion,
  TaskHistory,
  TaskStatus,
} from '../../infrastructure/persistence/typeorm/entities';
import { TaskAttachmentsService } from './task-attachments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Task,
      TaskStatus,
      TaskAssignment,
      TaskCompletion,
      TaskComment,
      TaskHistory,
      Attachment,
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService, TaskAttachmentsService],
})
export class TasksModule {}
