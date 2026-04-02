import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class AddAttachmentDto {
  @ApiProperty()
  @IsUrl()
  fileUrl!: string;

  @ApiProperty()
  @IsString()
  fileName!: string;

  @ApiProperty()
  @IsString()
  fileType!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  fileSize!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isBefore?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isAfter?: boolean;
}
