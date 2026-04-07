import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class SaveFilterDto {
  @ApiProperty({
    required: false,
    description: 'Existing filter category id. If provided, new options are added to this category.',
  })
  @IsOptional()
  @IsUUID('4')
  categoryId?: string;

  @ApiProperty({
    required: false,
    description: 'New filter category name. Used when creating a new category.',
    example: 'Zone',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  categoryName?: string;

  @ApiProperty({
    description: 'Comma separated list of option names',
    example: 'North, South, East, West',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  optionsCsv!: string;
}

