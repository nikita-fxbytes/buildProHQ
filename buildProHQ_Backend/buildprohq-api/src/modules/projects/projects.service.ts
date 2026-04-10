import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Repository } from 'typeorm';
import {
  Project,
  ProjectUser,
  Role,
  User,
  UserRole,
} from '../../infrastructure/persistence/typeorm/entities';
import type { AuthUser } from '../../infrastructure/common/interfaces/auth-user.interface';
import { CreateProjectDto } from './dto/create-project.dto';
import { SearchProjectsDto } from './dto/search-projects.dto';
import {
  AssignProjectMemberDto,
  SearchProjectMembersDto,
} from './dto/search-project-members.dto';
import { MESSAGES } from '../../infrastructure/common/constants/messages';

function slugCode(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 50);
}

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectUser)
    private readonly projectUserRepo: Repository<ProjectUser>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async listMyProjects(actor: AuthUser) {
    if (actor.role === 'super_admin') {
      const rows = await this.projectRepo.find({
        where: { deletedAt: IsNull() },
        order: { createdAt: 'DESC' },
        select: { id: true, code: true, name: true, createdAt: true },
      });
      return { message: 'Projects fetched successfully', data: rows };
    }

    const qb = this.projectRepo
      .createQueryBuilder('p')
      .innerJoin(
        ProjectUser,
        'pu',
        'pu.project_id = p.id AND pu.deleted_at IS NULL AND pu.user_id = :userId',
        { userId: actor.id },
      )
      .where('p.deleted_at IS NULL')
      .select([
        'p.id AS id',
        'p.code AS code',
        'p.name AS name',
        'p.created_at AS "createdAt"',
      ])
      .orderBy('p.created_at', 'DESC');

    const rows = await qb.getRawMany();
    const data = rows.map((r: any) => ({
      id: String(r.id),
      code: String(r.code ?? ''),
      name: String(r.name ?? ''),
      createdAt: r.createdAt,
    }));
    return { message: 'Projects fetched successfully', data };
  }

  async searchProjects(actor: AuthUser, dto: SearchProjectsDto) {
    const whereBase = { deletedAt: IsNull() as any };
    const term = dto.search?.trim();
    const sortBy = dto.sortBy ?? 'createdAt';
    const sortOrder =
      dto.sortOrder ??
      (sortBy === 'createdAt' ? ('desc' as const) : ('asc' as const));

    // For now: super_admin can see all projects; manager can see all projects (existing app behavior).
    // Next step (project-wise): restrict non-super to memberships.
    if (actor.role !== 'super_admin' && actor.role !== 'manager') {
      return { message: 'Projects fetched successfully', data: [], meta: { page: dto.page, limit: dto.limit, total: 0, totalPages: 1 } };
    }

    // Project list needs assignment counts (HTML spec): managers / trades / field / total.
    // We compute counts via project_users + user_roles + roles.code.
    //
    // Note: manager role code in seed is `manager_admin` so we use ILIKE '%manager%'.
    const qb = this.projectRepo
      .createQueryBuilder('p')
      .leftJoin(ProjectUser, 'pu', 'pu.project_id = p.id AND pu.deleted_at IS NULL')
      .leftJoin(UserRole, 'ur', 'ur.user_id = pu.user_id AND ur.deleted_at IS NULL')
      .leftJoin(Role, 'r', 'r.id = ur.role_id AND r.deleted_at IS NULL')
      .where('p.deleted_at IS NULL');

    if (term) {
      qb.andWhere('(p.name ILIKE :term OR p.code ILIKE :term)', {
        term: `%${term}%`,
      });
    }

    qb.select([
      'p.id AS id',
      'p.code AS code',
      'p.name AS name',
      'p.created_at AS "createdAt"',
      `COALESCE(COUNT(DISTINCT pu.user_id), 0) AS "membersTotal"`,
      `COALESCE(SUM(CASE WHEN r.code ILIKE '%manager%' THEN 1 ELSE 0 END), 0) AS "membersManagers"`,
      `COALESCE(SUM(CASE WHEN r.code = 'trade_user' THEN 1 ELSE 0 END), 0) AS "membersTrades"`,
      `COALESCE(SUM(CASE WHEN r.code = 'field_user' THEN 1 ELSE 0 END), 0) AS "membersField"`,
    ]);
    qb.groupBy('p.id');

    if (sortBy === 'name') {
      qb.orderBy('p.name', sortOrder.toUpperCase() as any).addOrderBy('p.created_at', 'DESC');
    } else if (sortBy === 'code') {
      qb.orderBy('p.code', sortOrder.toUpperCase() as any).addOrderBy('p.created_at', 'DESC');
    } else if (sortBy === 'members') {
      qb.orderBy('"membersTotal"', sortOrder.toUpperCase() as any).addOrderBy('p.created_at', 'DESC');
    } else {
      qb.orderBy('p.created_at', sortOrder.toUpperCase() as any);
    }

    qb.take(dto.limit).skip((dto.page - 1) * dto.limit);

    const [rawItems, total] = await Promise.all([
      qb.getRawMany(),
      // count projects (ignore joins for accurate totals)
      this.projectRepo.count({
        where: term
          ? [
              { ...whereBase, name: ILike(`%${term}%`) },
              { ...whereBase, code: ILike(`%${term}%`) },
            ]
          : (whereBase as any),
      }),
    ]);

    const items = rawItems.map((x: any) => ({
      id: String(x.id),
      code: String(x.code ?? ''),
      name: String(x.name ?? ''),
      createdAt: x.createdAt,
      membersTotal: Number(x.membersTotal ?? 0),
      membersManagers: Number(x.membersManagers ?? 0),
      membersTrades: Number(x.membersTrades ?? 0),
      membersField: Number(x.membersField ?? 0),
    }));

    return {
      message: 'Projects fetched successfully',
      data: items,
      meta: {
        page: dto.page,
        limit: dto.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / dto.limit)),
      },
    };
  }

  async createProject(actor: AuthUser, dto: CreateProjectDto) {
    if (actor.role !== 'super_admin') {
      throw new ConflictException(MESSAGES.COMMON.FORBIDDEN);
    }
    const code = dto.code?.trim() || slugCode(dto.name) || 'project';
    const existing = await this.projectRepo.findOne({
      where: { code, deletedAt: IsNull() },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('Project code already exists');
    }
    const row = this.projectRepo.create({
      code,
      name: dto.name.trim(),
      createdBy: actor.id,
      updatedBy: actor.id,
    });
    const saved = await this.projectRepo.save(row);
    return { message: 'Project created', data: saved };
  }

  async listMembers(actor: AuthUser, projectId: string, dto: SearchProjectMembersDto) {
    if (actor.role !== 'super_admin' && actor.role !== 'manager') {
      return { message: 'Members fetched successfully', data: [], meta: { page: dto.page, limit: dto.limit, total: 0, totalPages: 1 } };
    }

    const project = await this.projectRepo.findOne({
      where: { id: projectId, deletedAt: IsNull() },
      select: { id: true },
    });
    if (!project) throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);

    const term = dto.search?.trim();

    // Load memberships (paged) then hydrate user + role in one pass.
    const [memberships, total] = await this.projectUserRepo.findAndCount({
      where: {
        projectId,
        deletedAt: IsNull(),
      },
      order: { createdAt: 'DESC' },
      take: dto.limit,
      skip: (dto.page - 1) * dto.limit,
      select: {
        id: true,
        userId: true,
        projectRole: true,
        createdAt: true,
      },
    });

    const userIds = memberships.map((m) => m.userId);
    const users = userIds.length
      ? await this.userRepo.find({
          where: term
            ? [
                { id: userIds as any, fullName: ILike(`%${term}%`), deletedAt: IsNull() },
                { id: userIds as any, email: ILike(`%${term}%`), deletedAt: IsNull() },
              ]
            : { id: userIds as any, deletedAt: IsNull() },
          select: { id: true, fullName: true, email: true, initials: true, avatarUrl: true },
        })
      : [];
    const usersById = new Map(users.map((u) => [u.id, u]));

    // Map user->role code via user_roles join (take first)
    const userRoles = userIds.length
      ? await this.userRoleRepo.find({
          where: { userId: userIds as any, deletedAt: IsNull() },
          select: { userId: true, roleId: true },
        })
      : [];
    const roleIds = [...new Set(userRoles.map((ur) => ur.roleId))];
    const roles = roleIds.length
      ? await this.roleRepo.find({
          where: { id: roleIds as any, deletedAt: IsNull() },
          select: { id: true, code: true, name: true },
        })
      : [];
    const rolesById = new Map(roles.map((r) => [r.id, r]));
    const roleCodeByUserId = new Map<string, string>();
    userRoles.forEach((ur) => {
      if (!roleCodeByUserId.has(ur.userId)) {
        const r = rolesById.get(ur.roleId);
        if (r?.code) roleCodeByUserId.set(ur.userId, r.code);
      }
    });

    const items = memberships
      .map((m) => {
        const u = usersById.get(m.userId);
        if (!u) return null;
        const code = roleCodeByUserId.get(m.userId) ?? '';
        return {
          membershipId: m.id,
          projectId,
          userId: u.id,
          fullName: u.fullName,
          email: u.email,
          initials: u.initials,
          avatarUrl: u.avatarUrl,
          roleCode: code,
          projectRole: m.projectRole,
          assignedAt: m.createdAt,
        };
      })
      .filter(Boolean);

    const filtered = dto.role
      ? items.filter((i: any) => (i.roleCode || '').includes(dto.role!))
      : items;

    return {
      message: 'Members fetched successfully',
      data: filtered,
      meta: {
        page: dto.page,
        limit: dto.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / dto.limit)),
      },
    };
  }

  async assignMember(actor: AuthUser, projectId: string, dto: AssignProjectMemberDto) {
    if (actor.role !== 'super_admin') {
      throw new ConflictException(MESSAGES.COMMON.FORBIDDEN);
    }
    const project = await this.projectRepo.findOne({
      where: { id: projectId, deletedAt: IsNull() },
      select: { id: true },
    });
    if (!project) throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);

    const user = await this.userRepo.findOne({
      where: { id: dto.userId, deletedAt: IsNull() },
      select: { id: true },
    });
    if (!user) throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);

    const existing = await this.projectUserRepo.findOne({
      where: { projectId, userId: dto.userId, deletedAt: IsNull() },
      select: { id: true },
    });
    if (existing) {
      return { message: 'User already assigned' };
    }

    await this.projectUserRepo.save(
      this.projectUserRepo.create({
        projectId,
        userId: dto.userId,
        projectRole: dto.projectRole ?? null,
      }),
    );
    return { message: 'User assigned' };
  }

  async unassignMember(actor: AuthUser, projectId: string, userId: string) {
    if (actor.role !== 'super_admin') {
      throw new ConflictException(MESSAGES.COMMON.FORBIDDEN);
    }
    const existing = await this.projectUserRepo.findOne({
      where: { projectId, userId, deletedAt: IsNull() },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);
    await this.projectUserRepo.softDelete(existing.id);
    return { message: 'User unassigned' };
  }
}

