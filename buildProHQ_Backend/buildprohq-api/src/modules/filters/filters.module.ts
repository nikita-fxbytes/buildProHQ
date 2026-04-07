import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FiltersController } from './filters.controller';
import { FiltersService } from './filters.service';
import {
  FilterCategory,
  FilterOption,
  Level,
  Trade,
} from '../../infrastructure/persistence/typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([FilterCategory, FilterOption, Level, Trade])],
  controllers: [FiltersController],
  providers: [FiltersService],
})
export class FiltersModule {}

