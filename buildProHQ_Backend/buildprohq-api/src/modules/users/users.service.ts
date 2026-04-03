import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuditService } from '../audit/audit.service';
import {
  User,
  UserRole,
  UserStatus,
  UserType,
} from '../../infrastructure/persistence/typeorm/entities';
import { MESSAGES } from '../../infrastructure/common/constants/messages';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly auditService: AuditService,
  ) {}

  async list() {
    return this.userRepository
      .createQueryBuilder('u')
      .innerJoin(UserType, 'ut', 'ut.id = u.user_type_id')
      .innerJoin(UserStatus, 'us', 'us.id = u.user_status_id')
      .select([
        'u.id AS id',
        'u.full_name AS full_name',
        'u.email AS email',
        'u.initials AS initials',
        'u.last_login_at AS last_login_at',
        'u.created_at AS created_at',
        'ut.code AS user_type_code',
        'ut.name AS user_type_name',
        'us.code AS user_status_code',
        'us.name AS user_status_name',
      ])
      .where('u.deleted_at IS NULL')
      .orderBy('u.created_at', 'DESC')
      .getRawMany();
  }

  async getById(id: string) {
    const row = await this.userRepository
      .createQueryBuilder('u')
      .innerJoin(UserType, 'ut', 'ut.id = u.user_type_id')
      .innerJoin(UserStatus, 'us', 'us.id = u.user_status_id')
      .select([
        'u.id AS id',
        'u.full_name AS full_name',
        'u.email AS email',
        'u.initials AS initials',
        'u.last_login_at AS last_login_at',
        'u.created_at AS created_at',
        'ut.code AS user_type_code',
        'ut.name AS user_type_name',
        'us.code AS user_status_code',
        'us.name AS user_status_name',
      ])
      .where('u.id = :id', { id })
      .andWhere('u.deleted_at IS NULL')
      .getRawOne();

    if (!row) {
      throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);
    }
    return row;
  }

  async create(dto: CreateUserDto, actorId: string) {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase(), deletedAt: IsNull() },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const initials = dto.fullName
      .split(' ')
      .filter(Boolean)
      .map((s) => s[0])
      .join('')
      .slice(0, 4)
      .toUpperCase();

    const passwordHash = dto.password
      ? await bcrypt.hash(dto.password, 10)
      : null;
    const user = this.userRepository.create({
      userTypeId: dto.userTypeId,
      userStatusId: dto.userStatusId,
      fullName: dto.fullName,
      initials,
      email: dto.email.toLowerCase(),
      passwordHash,
      createdBy: actorId,
      updatedBy: actorId,
    });
    const inserted = await this.userRepository.save(user);
    const userId = inserted.id;

    if (dto.roleId) {
      const userRole = this.userRoleRepository.create({
        userId,
        roleId: dto.roleId,
        createdBy: actorId,
        updatedBy: actorId,
      });
      await this.userRoleRepository.save(userRole);
    }

    await this.auditService.log({
      tableName: 'users',
      recordId: userId,
      actionType: 'CREATE',
      newValue: { email: dto.email, fullName: dto.fullName },
      performedBy: actorId,
    });

    return this.getById(userId);
  }

  async update(id: string, dto: UpdateUserDto, actorId: string) {
    await this.getById(id);
    const updatePayload: Partial<User> = {
      updatedBy: actorId,
    };

    if (dto.fullName !== undefined) {
      updatePayload.fullName = dto.fullName;
    }
    if (dto.userTypeId !== undefined) {
      updatePayload.userTypeId = dto.userTypeId;
    }
    if (dto.userStatusId !== undefined) {
      updatePayload.userStatusId = dto.userStatusId;
    }
    if (dto.email !== undefined) {
      updatePayload.email = dto.email.toLowerCase();
    }
    if (dto.password !== undefined) {
      updatePayload.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    await this.userRepository.update(id, updatePayload);

    if (dto.roleId) {
      await this.userRoleRepository.softDelete({ userId: id, deletedAt: IsNull() });
      const userRole = this.userRoleRepository.create({
        userId: id,
        roleId: dto.roleId,
        createdBy: actorId,
        updatedBy: actorId,
      });
      await this.userRoleRepository.save(userRole);
    }

    await this.auditService.log({
      tableName: 'users',
      recordId: id,
      actionType: 'UPDATE',
      newValue: dto,
      performedBy: actorId,
    });

    return this.getById(id);
  }
}
