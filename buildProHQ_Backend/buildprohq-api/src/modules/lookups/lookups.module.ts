import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LookupsController } from './lookups.controller';
import { LookupsService } from './lookups.service';
import {
  FilterCategory,
  FilterOption,
  Role,
  TaskPriority,
  TaskStatus,
  UserStatus,
  UserType,
} from '../../infrastructure/persistence/typeorm/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskStatus,
      TaskPriority,
      FilterCategory,
      FilterOption,
      UserType,
      UserStatus,
      Role,
    ]),
  ],
  controllers: [LookupsController],
  providers: [LookupsService],
})
export class LookupsModule {}
