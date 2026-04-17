import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { AuthUser } from '../../infrastructure/common/interfaces/auth-user.interface';
import { MESSAGES } from '../../infrastructure/common/constants/messages';
import { AUTH_COOKIE_NAME } from './constants/auth.constants';
import {
  Role,
  User,
  UserRole,
  UserType,
} from '../../infrastructure/persistence/typeorm/entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    try {
      const row = await this.userRepository
        .createQueryBuilder('u')
        .innerJoin(UserType, 'ut', 'ut.id = u.user_type_id')
        .leftJoin(UserRole, 'ur', 'ur.user_id = u.id AND ur.deleted_at IS NULL')
        .leftJoin(Role, 'r', 'r.id = ur.role_id AND r.deleted_at IS NULL')
        .select([
          'u.id AS id',
          'u.email AS email',
          'u.full_name AS full_name',
          'u.password_hash AS password_hash',
          'ut.code AS user_type_code',
          'r.code AS role_code',
        ])
        .where('u.email = :email', { email: dto.email.toLowerCase() })
        .andWhere('u.deleted_at IS NULL')
        .limit(1)
        .getRawOne<{
          id: string;
          email: string;
          full_name: string;
          password_hash: string | null;
          user_type_code: string | null;
          role_code: string | null;
        }>();

      if (!row || !row.password_hash) {
        throw new UnauthorizedException(MESSAGES.AUTH.LOGIN_FAILED);
      }

      const isMatch = await bcrypt.compare(dto.password, row.password_hash);
      if (!isMatch) {
        throw new UnauthorizedException(MESSAGES.AUTH.LOGIN_FAILED);
      }

      const role = this.resolveRole(row.role_code, row.user_type_code);
      if (role !== dto.portalRole) {
        throw new ForbiddenException(MESSAGES.AUTH.PORTAL_MISMATCH);
      }

      const user: AuthUser = {
        id: row.id,
        email: row.email,
        fullName: row.full_name,
        role,
        userTypeCode: row.user_type_code ?? undefined,
      };

      const accessToken = await this.jwtService.signAsync({
        sub: user.id,
        role: user.role,
      });

      await this.userRepository.update(user.id, { lastLoginAt: new Date() });

      return {
        accessToken,
        user,
        message: MESSAGES.AUTH.LOGIN_SUCCESS,
      };
    } catch (error) {
      console.error('LOGIN ERROR:', error);
      // Preserve 401/403 as-is; otherwise return safe 500 (handled by global filter).
      if (error instanceof UnauthorizedException) throw error;
      if (error instanceof ForbiddenException) throw error;
      throw new InternalServerErrorException(
        MESSAGES.COMMON.INTERNAL_SERVER_ERROR,
      );
    }
  }

  setAuthCookie(res: Response, token: string) {
    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 86400000, // 1 day
    });
  }

  clearAuthCookie(res: Response) {
    res.clearCookie(AUTH_COOKIE_NAME);
  }

  private resolveRole(
    roleCode: string | null,
    userTypeCode: string | null,
  ): AuthUser['role'] {
    const source = (roleCode ?? userTypeCode ?? '').toLowerCase();
    if (source.includes('super')) {
      return 'super_admin';
    }
    if (
      source.includes('manager') ||
      source.includes('admin') ||
      source.includes('management')
    ) {
      return 'manager';
    }
    if (source.includes('trade')) {
      return 'trade_user';
    }
    return 'field_user';
  }
}
