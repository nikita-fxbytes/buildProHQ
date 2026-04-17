import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProjectFilterDto {
  @ApiProperty({ example: 'Zone' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name!: string;

  @ApiProperty({
    type: [String],
    description: 'Projects this filter belongs to.',
  })
  @IsArray()
  @IsUUID('4', { each: true })
  projectIds!: string[];

  @ApiProperty({
    description: 'If true, sub-filters are managed as autocomplete options.',
  })
  @IsBoolean()
  hasSubFilters!: boolean;

  @ApiPropertyOptional({
    description:
      'Only when hasSubFilters is true: allow selecting multiple sub-filters.',
  })
  @IsOptional()
  @IsBoolean()
  isMultiSelect?: boolean;

  @ApiPropertyOptional({
    type: [String],
    description: 'Names for sub-filters (only when hasSubFilters is true).',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(200, { each: true })
  subFilterNames?: string[];
}
