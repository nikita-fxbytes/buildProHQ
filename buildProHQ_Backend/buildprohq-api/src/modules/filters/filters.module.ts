import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FiltersController } from './filters.controller';
import { FiltersService } from './filters.service';
import {
  FilterCategory,
  FilterOption,
} from '../../infrastructure/persistence/typeorm/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([FilterCategory, FilterOption]),
  ],
  controllers: [FiltersController],
  providers: [FiltersService],
})
export class FiltersModule {}
