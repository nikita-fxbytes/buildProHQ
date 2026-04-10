import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

const SORT_BY = ['createdAt', 'name', 'code', 'members'] as const;
type SortBy = (typeof SORT_BY)[number];

const SORT_ORDER = ['asc', 'desc'] as const;
type SortOrder = (typeof SORT_ORDER)[number];

export class SearchProjectsDto {
  @ApiProperty({ example: 1 })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page!: number;

  @ApiProperty({ example: 20 })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit!: number;

  @ApiProperty({ required: false, example: 'Alpha' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;

  @ApiProperty({ required: false, enum: SORT_BY, example: 'createdAt' })
  @IsOptional()
  @IsIn(SORT_BY)
  sortBy?: SortBy;

  @ApiProperty({ required: false, enum: SORT_ORDER, example: 'desc' })
  @IsOptional()
  @IsIn(SORT_ORDER)
  sortOrder?: SortOrder;
}

