import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class TaskFilterValueInputDto {
  @ApiPropertyOptional({
    description: 'Dynamic filter definition id (project filter).',
  })
  @IsUUID('4')
  filterId!: string;

  @ApiPropertyOptional({
    description: 'Selected sub-filter ids when hasSubFilters is true.',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  subFilterIds?: string[];

  @ApiPropertyOptional({
    description: 'Free text when hasSubFilters is false.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  textValue?: string | null;
}
