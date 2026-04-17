import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateIf,
  Matches,
} from 'class-validator';
import {
  PASSWORD_POLICY_MESSAGE,
  PASSWORD_POLICY_REGEX,
} from '../../../infrastructure/common/validators/password-policy';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @MinLength(8)
  @Matches(PASSWORD_POLICY_REGEX.NO_SPACES, {
    message: PASSWORD_POLICY_MESSAGE,
  })
  @Matches(PASSWORD_POLICY_REGEX.LOWER, { message: PASSWORD_POLICY_MESSAGE })
  @Matches(PASSWORD_POLICY_REGEX.UPPER, { message: PASSWORD_POLICY_MESSAGE })
  @Matches(PASSWORD_POLICY_REGEX.NUMBER, { message: PASSWORD_POLICY_MESSAGE })
  @Matches(PASSWORD_POLICY_REGEX.SPECIAL, { message: PASSWORD_POLICY_MESSAGE })
  password?: string;

  /**
   * Allow clearing the avatar by sending an empty string.
   * If a non-empty value is provided, it must be a valid URL.
   */
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
