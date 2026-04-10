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
import { MESSAGES } from '../../../infrastructure/common/constants/messages';

export class SaveFilterDto {
  @ApiProperty({
    required: false,
    type: [String],
    description:
      'Target project ids. For creation-by-name, the category/options will be created/updated in each project.',
    example: ['<projectId1>', '<projectId2>'],
  })
  @IsOptional()
  @IsArray({ message: MESSAGES.FILTER_VALIDATION.SUB_FILTER_NAMES_ARRAY })
  @ArrayMaxSize(50, { message: MESSAGES.FILTER_VALIDATION.SUB_FILTER_NAMES_MAX_COUNT })
  @IsUUID('4', { each: true, message: MESSAGES.FILTER_VALIDATION.CATEGORY_ID_INVALID })
  projectIds?: string[];

  @ApiProperty({
    required: false,
    description: 'Existing filter category id. Sub-filters are appended under this category.',
  })
  @IsOptional()
  @IsUUID('4', { message: MESSAGES.FILTER_VALIDATION.CATEGORY_ID_INVALID })
  filterCategoryId?: string;

  @ApiProperty({
    required: false,
    description: 'Display name for a new category, or to resolve an existing one by name.',
    example: 'Zone',
  })
  @IsOptional()
  @IsString({ message: MESSAGES.FILTER_VALIDATION.CATEGORY_NAME_STRING })
  @MinLength(2, { message: MESSAGES.FILTER_VALIDATION.CATEGORY_NAME_MIN_LENGTH })
  @MaxLength(100, { message: MESSAGES.FILTER_VALIDATION.CATEGORY_NAME_MAX_LENGTH })
  filterCategoryName?: string;

  @ApiProperty({
    required: false,
    type: [String],
    description:
      'Labels for sub-filters to create under the category. Omit or [] to save the category only.',
    example: ['North', 'South', 'East', 'West'],
  })
  @IsOptional()
  @IsArray({ message: MESSAGES.FILTER_VALIDATION.SUB_FILTER_NAMES_ARRAY })
  @ArrayMaxSize(100, { message: MESSAGES.FILTER_VALIDATION.SUB_FILTER_NAMES_MAX_COUNT })
  @IsString({ each: true, message: MESSAGES.FILTER_VALIDATION.SUB_FILTER_NAME_STRING })
  @MinLength(1, { each: true, message: MESSAGES.FILTER_VALIDATION.SUB_FILTER_NAME_MIN_LENGTH })
  @MaxLength(100, { each: true, message: MESSAGES.FILTER_VALIDATION.SUB_FILTER_NAME_MAX_LENGTH })
  subFilterNames?: string[];
}
