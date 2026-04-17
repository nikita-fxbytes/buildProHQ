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
    enum: [
      'createdAt',
      'daysOpen',
      'priority',
      'description',
    ],
  })
  @IsOptional()
  @IsIn(['createdAt', 'daysOpen', 'priority', 'description'])
  sortBy?:
    | 'createdAt'
    | 'daysOpen'
    | 'priority'
    | 'description';

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
