import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PASSWORD_POLICY_MESSAGE, PASSWORD_POLICY_REGEX } from '../../../infrastructure/common/validators/password-policy';

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
  @Matches(PASSWORD_POLICY_REGEX.NO_SPACES, { message: PASSWORD_POLICY_MESSAGE })
  @Matches(PASSWORD_POLICY_REGEX.LOWER, { message: PASSWORD_POLICY_MESSAGE })
  @Matches(PASSWORD_POLICY_REGEX.UPPER, { message: PASSWORD_POLICY_MESSAGE })
  @Matches(PASSWORD_POLICY_REGEX.NUMBER, { message: PASSWORD_POLICY_MESSAGE })
  @Matches(PASSWORD_POLICY_REGEX.SPECIAL, { message: PASSWORD_POLICY_MESSAGE })
  password?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('4')
  roleId?: string;

  @ApiProperty({ required: false, description: 'Profile photo URL (uploaded via /files/upload)' })
  @IsOptional()
  @IsString()
  @IsUrl(
    { require_protocol: true, require_tld: false },
    { message: 'avatarUrl must be a valid URL' },
  )
  @MaxLength(1024)
  avatarUrl?: string;
}
