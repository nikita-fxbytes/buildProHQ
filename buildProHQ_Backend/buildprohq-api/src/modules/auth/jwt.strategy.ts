import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { AuthUser } from '../../infrastructure/common/interfaces/auth-user.interface';
import { User } from '../../infrastructure/persistence/typeorm/entities';
import { AUTH_COOKIE_NAME } from './constants/auth.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is required');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return (
            (request?.cookies?.[AUTH_COOKIE_NAME] as string | undefined) ?? null
          );
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: {
    sub: string;
    role: AuthUser['role'];
  }): Promise<AuthUser> {
    const user = await this.userRepository.findOne({
      where: {
        id: payload.sub,
        deletedAt: IsNull(),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token subject');
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: payload.role,
    };
  }
}
