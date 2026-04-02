import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MESSAGES } from '../../../infrastructure/common/constants/messages';
import type { AuthUser } from '../../../infrastructure/common/interfaces/auth-user.interface';

const PORTAL_ROLES: readonly AuthUser['role'][] = [
  'manager',
  'field_user',
  'trade_user',
] as const;

export class LoginDto {
  @ApiProperty({ example: 'manager@buildpro.com' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsNotEmpty({ message: MESSAGES.AUTH_VALIDATION.EMAIL_REQUIRED })
  @IsEmail({}, { message: MESSAGES.AUTH_VALIDATION.EMAIL_INVALID })
  @MaxLength(255, { message: MESSAGES.AUTH_VALIDATION.EMAIL_MAX_LENGTH })
  email!: string;

  @ApiProperty({ example: 'StrongPass123!' })
  @IsString({ message: MESSAGES.AUTH_VALIDATION.PASSWORD_MUST_BE_STRING })
  @IsNotEmpty({ message: MESSAGES.AUTH_VALIDATION.PASSWORD_REQUIRED })
  @MaxLength(128, { message: MESSAGES.AUTH_VALIDATION.PASSWORD_MAX_LENGTH })
  @Matches(/\S/, { message: MESSAGES.AUTH_VALIDATION.PASSWORD_WHITESPACE_ONLY })
  @MinLength(8, { message: MESSAGES.AUTH_VALIDATION.PASSWORD_MIN_LENGTH })
  password!: string;

  @ApiProperty({
    enum: PORTAL_ROLES,
    example: 'manager',
    description:
      'Login portal the client is using; must match the user’s resolved role',
  })
  @IsNotEmpty({ message: MESSAGES.AUTH_VALIDATION.PORTAL_ROLE_REQUIRED })
  @IsIn([...PORTAL_ROLES], {
    message: MESSAGES.AUTH_VALIDATION.PORTAL_ROLE_INVALID,
  })
  portalRole!: AuthUser['role'];
}
