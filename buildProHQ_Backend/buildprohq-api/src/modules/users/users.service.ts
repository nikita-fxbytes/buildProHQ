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
import { InvitationsService } from '../auth/invitations.service';
import {
  User,
  UserRole,
  UserStatus,
  UserType,
} from '../../infrastructure/persistence/typeorm/entities';
import { MESSAGES } from '../../infrastructure/common/constants/messages';
import { Task, TaskStatus } from '../../infrastructure/persistence/typeorm/entities';
import { SearchUsersDto } from './dto/search-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly auditService: AuditService,
    private readonly invitationsService: InvitationsService,
  ) {}

  async list(actorId: string) {
    // Lightweight list endpoint used by lookups/filters/badges.
    // Keep it safe (no parameterized subquery in JOIN) and include open task count.
    return this.userRepository
      .createQueryBuilder('u')
      .innerJoin(UserType, 'ut', 'ut.id = u.user_type_id')
      .innerJoin(UserStatus, 'us', 'us.id = u.user_status_id')
      .leftJoin(Task, 't', 't.created_by_user_id = u.id AND t.deleted_at IS NULL')
      .leftJoin(
        TaskStatus,
        'ts',
        'ts.id = t.status_id AND ts.is_terminal = :isTerminal',
        { isTerminal: false },
      )
      .select([
        'u.id AS id',
        'u.full_name AS full_name',
        'u.email AS email',
        'u.initials AS initials',
        'u.avatar_url AS avatar_url',
        'u.last_login_at AS last_login_at',
        'u.created_at AS created_at',
        'ut.code AS user_type_code',
        'ut.name AS user_type_name',
        'us.code AS user_status_code',
        'us.name AS user_status_name',
      ])
      .where('u.deleted_at IS NULL')
      .andWhere('u.created_by = :actorId', { actorId })
      .addSelect('COUNT(ts.id)::int', 'open_tasks_count')
      .groupBy('u.id')
      .addGroupBy('ut.code')
      .addGroupBy('ut.name')
      .addGroupBy('us.code')
      .addGroupBy('us.name')
      .orderBy('u.created_at', 'DESC')
      .getRawMany();
  }

  async search(actorId: string, dto: SearchUsersDto) {
    const qb = this.userRepository
      .createQueryBuilder('u')
      .innerJoin(UserType, 'ut', 'ut.id = u.user_type_id')
      .innerJoin(UserStatus, 'us', 'us.id = u.user_status_id')
      .leftJoin(Task, 't', 't.created_by_user_id = u.id AND t.deleted_at IS NULL')
      .leftJoin(
        TaskStatus,
        'ts',
        'ts.id = t.status_id AND ts.is_terminal = :isTerminal',
        { isTerminal: false },
      )
      .where('u.deleted_at IS NULL')
      .andWhere('u.created_by = :actorId', { actorId });

    const term = dto.search?.trim();
    if (term) {
      qb.andWhere(
        '(u.full_name ILIKE :search OR u.email ILIKE :search OR ut.name ILIKE :search OR ut.code ILIKE :search OR u.initials ILIKE :search)',
        { search: `%${term}%` },
      );
    }

    if (dto.role) {
      const typeCode =
        dto.role === 'Trade'
          ? 'trade_user'
          : dto.role === 'Management'
            ? 'management'
            : 'field_user';
      qb.andWhere('ut.code = :typeCode', { typeCode });
    }

    qb.select([
      'u.id AS id',
      'u.full_name AS full_name',
      'u.email AS email',
      'u.initials AS initials',
      'u.avatar_url AS avatar_url',
      'u.last_login_at AS last_login_at',
      'u.created_at AS created_at',
      'ut.code AS user_type_code',
      'ut.name AS user_type_name',
      'us.code AS user_status_code',
      'us.name AS user_status_name',
    ]);
    qb.addSelect('COUNT(ts.id)::int', 'open_tasks_count');
    qb.groupBy('u.id')
      .addGroupBy('ut.code')
      .addGroupBy('ut.name')
      .addGroupBy('us.code')
      .addGroupBy('us.name');

    const sortMap: Record<
      NonNullable<SearchUsersDto['sortBy']>,
      { column: string }
    > = {
      createdAt: { column: 'u.created_at' },
      name: { column: 'u.full_name' },
      email: { column: 'u.email' },
      role: { column: 'ut.name' },
      tasks: { column: 'COUNT(ts.id)' },
      lastLoginAt: { column: 'u.last_login_at' },
    };
    const effectiveSortBy =
      dto.sortBy && sortMap[dto.sortBy] ? dto.sortBy : 'createdAt';
    const defaultOrder =
      effectiveSortBy === 'createdAt' || effectiveSortBy === 'lastLoginAt'
        ? 'desc'
        : 'asc';
    const effectiveSortOrder = dto.sortOrder ?? defaultOrder;
    const dir = effectiveSortOrder.toUpperCase() as 'ASC' | 'DESC';

    qb.orderBy(sortMap[effectiveSortBy].column, dir as any);
    // Stable secondary sort to avoid jitter between pages.
    qb.addOrderBy('u.created_at', 'DESC');

    const offset = (dto.page - 1) * dto.limit;
    const qbCount = this.userRepository
      .createQueryBuilder('u')
      .innerJoin(UserType, 'ut', 'ut.id = u.user_type_id')
      .where('u.deleted_at IS NULL')
      .andWhere('u.created_by = :actorId', { actorId });
    if (term) {
      qbCount.andWhere(
        '(u.full_name ILIKE :search OR u.email ILIKE :search OR ut.name ILIKE :search OR ut.code ILIKE :search OR u.initials ILIKE :search)',
        { search: `%${term}%` },
      );
    }
    if (dto.role) {
      const typeCode =
        dto.role === 'Trade'
          ? 'trade_user'
          : dto.role === 'Management'
            ? 'management'
            : 'field_user';
      qbCount.andWhere('ut.code = :typeCode', { typeCode });
    }

    const [items, total] = await Promise.all([
      qb.clone().offset(offset).limit(dto.limit).getRawMany(),
      qbCount.getCount(),
    ]);

    return {
      message: 'Users fetched successfully',
      data: items,
      meta: {
        page: dto.page,
        limit: dto.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / dto.limit)),
      },
    };
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
        'u.avatar_url AS avatar_url',
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

  async getMyProfile(userId: string) {
    const row = await this.userRepository
      .createQueryBuilder('u')
      .select([
        'u.id AS id',
        'u.full_name AS full_name',
        'u.email AS email',
        'u.initials AS initials',
        'u.avatar_url AS avatar_url',
        'u.last_login_at AS last_login_at',
        'u.created_at AS created_at',
      ])
      .where('u.id = :userId', { userId })
      .andWhere('u.deleted_at IS NULL')
      .getRawOne();

    if (!row) {
      throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);
    }
    return row;
  }

  async updateMyProfile(
    userId: string,
    dto: { fullName?: string; avatarUrl?: string },
  ) {
    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: IsNull() },
      select: { id: true, fullName: true, avatarUrl: true, updatedBy: true },
    });
    if (!user) {
      throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);
    }

    if (typeof dto.fullName === 'string') user.fullName = dto.fullName;
    if (typeof dto.avatarUrl === 'string') user.avatarUrl = dto.avatarUrl;

    user.updatedBy = userId;
    await this.userRepository.save(user);
    return this.getMyProfile(userId);
  }

  async create(dto: CreateUserDto, actorId: string) {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase(), deletedAt: IsNull() },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException(MESSAGES.USERS.EMAIL_EXISTS);
    }

    const initials = dto.fullName
      .split(' ')
      .filter(Boolean)
      .map((s) => s[0])
      .join('')
      .slice(0, 4)
      .toUpperCase();

    const passwordHash = dto.password ? await bcrypt.hash(dto.password, 10) : null;
    const user = this.userRepository.create({
      userTypeId: dto.userTypeId,
      userStatusId: dto.userStatusId,
      fullName: dto.fullName,
      initials,
      email: dto.email.toLowerCase(),
      avatarUrl: dto.avatarUrl ?? null,
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

    // If no password is set, send an invite email with a set-password link.
    if (!dto.password) {
      await this.invitationsService.createAndSendInvite({
        invitedUserId: userId,
        invitedEmail: dto.email,
        invitedByUserId: actorId,
        fullName: dto.fullName,
      });
    }

    return this.getById(userId);
  }

  async update(id: string, dto: UpdateUserDto, actorId: string) {
    const current = await this.userRepository.findOne({
      where: { id, deletedAt: IsNull() },
      select: { id: true, email: true },
    });
    if (!current) {
      throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);
    }

    if (dto.email !== undefined) {
      const nextEmail = dto.email.toLowerCase();
      if (nextEmail !== current.email) {
        const existing = await this.userRepository.findOne({
          where: { email: nextEmail, deletedAt: IsNull() },
          select: { id: true },
        });
        if (existing && existing.id !== id) {
          throw new ConflictException(MESSAGES.USERS.EMAIL_EXISTS);
        }
      }
    }

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
    if (dto.avatarUrl !== undefined) {
      const v = dto.avatarUrl.trim();
      updatePayload.avatarUrl = v.length ? v : null;
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

  async remove(id: string, actorId: string) {
    await this.getById(id);

    // Soft-delete user + user roles to keep referential integrity.
    await this.userRepository.update(id, {
      deletedAt: new Date(),
      updatedBy: actorId,
    });
    await this.userRoleRepository.update(
      { userId: id, deletedAt: IsNull() },
      { deletedAt: new Date(), updatedBy: actorId },
    );

    await this.auditService.log({
      tableName: 'users',
      recordId: id,
      actionType: 'DELETE',
      newValue: null,
      performedBy: actorId,
    });

    return { id, deleted: true, message: MESSAGES.USERS.DELETED };
  }
}
