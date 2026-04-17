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
} from 'class-validator';

export class CompletedTasksFiltersDto {
  @ApiPropertyOptional({
    type: [String],
    description: 'Completed-by user UUIDs (manager filter)',
  })
  @IsOptional()
  @IsUUID('4', { each: true })
  completedByUserIds?: string[];
}

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

  @ApiPropertyOptional({
    description: 'Search term (description/trade/level/completed user)',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Sort column',
    enum: ['user', 'description', 'date', 'duration'],
  })
  @IsOptional()
  @IsIn(['user', 'description', 'date', 'duration'])
  sortBy?: 'user' | 'description' | 'date' | 'duration';

  @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({ type: CompletedTasksFiltersDto })
  @IsOptional()
  filters?: CompletedTasksFiltersDto;
}
