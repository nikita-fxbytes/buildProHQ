import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class DateRangeDto {
  @ApiPropertyOptional({
    description: 'ISO date/time (inclusive) for opened_at lower bound',
    example: '2026-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsString()
  openedFrom?: string;

  @ApiPropertyOptional({
    description: 'ISO date/time (inclusive) for opened_at upper bound',
    example: '2026-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsString()
  openedTo?: string;
}

export class OpenTasksFiltersDto {
  @ApiPropertyOptional({ type: [String], description: 'Trade UUIDs' })
  @IsOptional()
  @IsUUID('4', { each: true })
  tradeIds?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Level UUIDs' })
  @IsOptional()
  @IsUUID('4', { each: true })
  levelIds?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Created-by user UUIDs (manager filter)' })
  @IsOptional()
  @IsUUID('4', { each: true })
  createdByUserIds?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Task status UUIDs' })
  @IsOptional()
  @IsUUID('4', { each: true })
  statusIds?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Task priority UUIDs' })
  @IsOptional()
  @IsUUID('4', { each: true })
  priorityIds?: string[];

  @ApiPropertyOptional({ type: DateRangeDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  dateRange?: DateRangeDto;
}

export class SearchOpenTasksDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ default: 20, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Sort column',
    enum: ['createdAt', 'daysOpen', 'level', 'trade', 'priority', 'description', 'user'],
  })
  @IsOptional()
  @IsIn(['createdAt', 'daysOpen', 'level', 'trade', 'priority', 'description', 'user'])
  sortBy?: 'createdAt' | 'daysOpen' | 'level' | 'trade' | 'priority' | 'description' | 'user';

  @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({ type: OpenTasksFiltersDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OpenTasksFiltersDto)
  filters?: OpenTasksFiltersDto;
}

