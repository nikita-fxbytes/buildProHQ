import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  FilterProject,
  ProjectDynamicFilter,
  SubFilterEntity,
  Task,
  TaskFilterRow,
} from '../../infrastructure/persistence/typeorm/entities';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Task,
      TaskFilterRow,
      ProjectDynamicFilter,
      FilterProject,
      SubFilterEntity,
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
