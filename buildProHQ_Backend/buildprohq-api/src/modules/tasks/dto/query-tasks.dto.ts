import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class QueryTasksDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  tradeId?: string;

  @ApiPropertyOptional({
    description: 'Comma-separated list of trade UUIDs (alternative to tradeId)',
    example:
      '0b2f6a2d-4c79-4b52-9b5a-0b873ad58a52,9b7fdb4c-2c3a-4518-8e64-16412cb27f0c',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string') return undefined;
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  })
  @IsUUID('4', { each: true })
  tradeIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  levelId?: string;

  @ApiPropertyOptional({
    description: 'Comma-separated list of level UUIDs (alternative to levelId)',
    example:
      '1b6a0fb1-2d3f-4f05-8c7f-5c9fdb1e3d42,2c3e4d5f-6a7b-8c9d-0e1f-23456789abcd',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string') return undefined;
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  })
  @IsUUID('4', { each: true })
  levelIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  assignedToUserId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  daysSort?: 'asc' | 'desc';

  @ApiPropertyOptional({
    description: 'Sort column',
    enum: ['createdAt', 'daysOpen', 'level', 'trade', 'priority', 'description'],
  })
  @IsOptional()
  @IsIn(['createdAt', 'daysOpen', 'level', 'trade', 'priority', 'description'])
  sortBy?: 'createdAt' | 'daysOpen' | 'level' | 'trade' | 'priority' | 'description';

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

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
}
