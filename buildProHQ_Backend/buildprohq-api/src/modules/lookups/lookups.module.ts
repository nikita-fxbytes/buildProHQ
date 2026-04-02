import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LookupsController } from './lookups.controller';
import { LookupsService } from './lookups.service';
import {
  FilterCategory,
  FilterOption,
  Level,
  TaskPriority,
  TaskStatus,
  Trade,
} from '../../infrastructure/persistence/typeorm/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Trade,
      Level,
      TaskStatus,
      TaskPriority,
      FilterCategory,
      FilterOption,
    ]),
  ],
  controllers: [LookupsController],
  providers: [LookupsService],
})
export class LookupsModule {}
