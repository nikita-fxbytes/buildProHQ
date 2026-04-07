import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsUUID('4')
  userTypeId!: string;

  @ApiProperty()
  @IsUUID('4')
  userStatusId!: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  fullName!: string;

  @ApiProperty()
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty({ required: false, minLength: 8 })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  @MinLength(8)
  password?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('4')
  roleId?: string;

  @ApiProperty({ required: false, description: 'Profile photo URL (uploaded via /files/upload)' })
  @IsOptional()
  @IsString()
  @IsUrl({ require_protocol: true }, { message: 'avatarUrl must be a valid URL' })
  @MaxLength(1024)
  avatarUrl?: string;
}
