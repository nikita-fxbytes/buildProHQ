import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, Matches } from 'class-validator';
import { PASSWORD_POLICY_MESSAGE, PASSWORD_POLICY_REGEX } from '../../../infrastructure/common/validators/password-policy';

export class AcceptInviteDto {
  @ApiProperty({ description: 'Invite token from email link' })
  @IsString()
  token!: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @Matches(PASSWORD_POLICY_REGEX.NO_SPACES, { message: PASSWORD_POLICY_MESSAGE })
  @Matches(PASSWORD_POLICY_REGEX.LOWER, { message: PASSWORD_POLICY_MESSAGE })
  @Matches(PASSWORD_POLICY_REGEX.UPPER, { message: PASSWORD_POLICY_MESSAGE })
  @Matches(PASSWORD_POLICY_REGEX.NUMBER, { message: PASSWORD_POLICY_MESSAGE })
  @Matches(PASSWORD_POLICY_REGEX.SPECIAL, { message: PASSWORD_POLICY_MESSAGE })
  password!: string;
}

