import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SaveFilterDto {
  @ApiProperty({
    required: false,
    description: 'Existing filter category id. Sub-filters are appended under this category.',
  })
  @IsOptional()
  @IsUUID('4')
  filterCategoryId?: string;

  @ApiProperty({
    required: false,
    description: 'Display name for a new category, or to resolve an existing one by name.',
    example: 'Zone',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  filterCategoryName?: string;

  @ApiProperty({
    required: false,
    type: [String],
    description:
      'Labels for sub-filters to create under the category. Omit or [] to save the category only.',
    example: ['North', 'South', 'East', 'West'],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(100, { each: true })
  subFilterNames?: string[];
}
