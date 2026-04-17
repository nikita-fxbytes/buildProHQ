import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsUrl,
  ValidateIf,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  fullName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @ValidateIf(
    (o) => typeof o.avatarUrl === 'string' && o.avatarUrl.trim().length > 0,
  )
  @IsUrl(
    { require_protocol: true, require_tld: false },
    { message: 'avatarUrl must be a valid URL' },
  )
  @MaxLength(1024)
  avatarUrl?: string;
}
