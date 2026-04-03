import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { MESSAGES } from '../../../infrastructure/common/constants/messages';

export class AddAttachmentDto {
  @ApiProperty({
    example: 'http://localhost:3000/api/v1/files/uuid.jpg',
    description: 'Public URL of the uploaded file',
  })
  @IsUrl(
    { require_tld: false, require_protocol: true },
    { message: MESSAGES.TASK_VALIDATION.FILE_URL_INVALID },
  )
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
