import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { OpenTasksFiltersDto } from './search-open-tasks.dto';

/**
 * Body for POST /v1/tasks/completed — same shape as open-task search, with
 * sort columns appropriate for terminal (completed) tasks.
 */
export class SearchCompletedTasksDto {
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
    enum: ['closedAt', 'daysOpen', 'level', 'trade', 'description'],
  })
  @IsOptional()
  @IsIn(['closedAt', 'daysOpen', 'level', 'trade', 'description'])
  sortBy?: 'closedAt' | 'daysOpen' | 'level' | 'trade' | 'description';

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
