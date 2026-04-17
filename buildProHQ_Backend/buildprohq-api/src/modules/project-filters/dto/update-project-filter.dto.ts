import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateProjectFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasSubFilters?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isMultiSelect?: boolean;

  @ApiPropertyOptional({
    type: [String],
    description: 'Replace project mappings for this filter.',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  projectIds?: string[];

  @ApiPropertyOptional({
    type: [String],
    description:
      'Replace sub-filter names when hasSubFilters is true (existing sub-filters not listed may be soft-deleted).',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(200, { each: true })
  subFilterNames?: string[];
}
