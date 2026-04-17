import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class SearchProjectFiltersDto {
  @ApiPropertyOptional({
    type: [String],
    description: 'Projects to scope to. Empty = return empty.',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  projectIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ enum: ['createdAt', 'name'], default: 'createdAt' })
  @IsOptional()
  @IsIn(['createdAt', 'name'])
  sortBy?: 'createdAt' | 'name';

  @ApiPropertyOptional({
    enum: ['ASC', 'DESC', 'asc', 'desc'],
    default: 'DESC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC', 'asc', 'desc'])
  sortOrder?: 'ASC' | 'DESC' | 'asc' | 'desc';
}
