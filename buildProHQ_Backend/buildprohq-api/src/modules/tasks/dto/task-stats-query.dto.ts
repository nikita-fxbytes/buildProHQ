import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

function csvToArray(value: unknown): string[] | undefined {
  if (value == null || value === '') return undefined;
  if (Array.isArray(value))
    return value
      .map(String)
      .map((s) => s.trim())
      .filter(Boolean);
  const s = String(value).trim();
  if (!s) return undefined;
  return s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

export class TaskStatsFiltersDto {
  @ApiPropertyOptional({ description: 'Project IDs (comma-separated)' })
  @IsOptional()
  @Transform(({ value }) => csvToArray(value))
  projectIds?: string[];

  @ApiPropertyOptional({ description: 'Created-by user IDs (comma-separated)' })
  @IsOptional()
  @Transform(({ value }) => csvToArray(value))
  createdByUserIds?: string[];

  @ApiPropertyOptional({ description: 'Status IDs (comma-separated)' })
  @IsOptional()
  @Transform(({ value }) => csvToArray(value))
  statusIds?: string[];

  @ApiPropertyOptional({ description: 'Priority IDs (comma-separated)' })
  @IsOptional()
  @Transform(({ value }) => csvToArray(value))
  priorityIds?: string[];
}

export class TaskStatsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ type: TaskStatsFiltersDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TaskStatsFiltersDto)
  filters?: TaskStatsFiltersDto;

  // Optional future-proofing: constrain allowed status codes, if needed.
  @ApiPropertyOptional({
    enum: ['open', 'all'],
    description: 'Stats scope (reserved)',
  })
  @IsOptional()
  @IsIn(['open', 'all'])
  scope?: 'open' | 'all';

  @ApiPropertyOptional({ description: 'Page (reserved)', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Limit (reserved)', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
