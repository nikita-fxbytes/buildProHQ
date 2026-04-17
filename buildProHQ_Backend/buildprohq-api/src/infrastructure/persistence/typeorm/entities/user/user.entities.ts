import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SoftDeleteTimestamps } from '../shared';

import {
  InvitationStatus,
  Permission,
  Role,
  Task,
  UserStatus,
  UserType,
} from '..';

@Entity('users')
export class User extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'user_type_id' })
  userTypeId!: string;

  @ManyToOne(() => UserType, (ut) => ut.users)
  @JoinColumn({ name: 'user_type_id' })
  userType!: UserType;

  @Column({ type: 'uuid', name: 'user_status_id' })
  userStatusId!: string;

  @ManyToOne(() => UserStatus, (us) => us.users)
  @JoinColumn({ name: 'user_status_id' })
  userStatus!: UserStatus;

  @Column({ type: 'varchar', name: 'full_name', length: 150 })
  fullName!: string;

  @Column({ type: 'varchar', length: 8, nullable: true })
  initials?: string | null;

  @Column({ type: 'varchar', name: 'avatar_url', length: 1024, nullable: true })
  avatarUrl?: string | null;

  @Index('uq_users_email', { unique: true })
  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({
    type: 'varchar',
    name: 'password_hash',
    length: 255,
    nullable: true,
  })
  passwordHash?: string | null;

  @Column({ type: 'timestamp', name: 'last_login_at', nullable: true })
  lastLoginAt?: Date | null;

  @Column({
    type: 'uuid',
    name: 'created_by',
    nullable: true,
  })
  createdBy?: string | null;

  @Column({
    type: 'uuid',
    name: 'updated_by',
    nullable: true,
  })
  updatedBy?: string | null;

  @Column({ type: 'varchar', name: 'ip_address', length: 45, nullable: true })
  ipAddress?: string | null;

  @OneToMany(() => Task, (t) => t.assignedToUser)
  assignedTasks!: Task[];
}


@Entity('role_permissions')
export class RolePermission extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'role_id' })
  roleId!: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @Column({ type: 'uuid', name: 'permission_id' })
  permissionId!: string;

  @ManyToOne(() => Permission)
  @JoinColumn({ name: 'permission_id' })
  permission!: Permission;
}

@Entity('user_roles')
export class UserRole extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'uuid', name: 'role_id' })
  roleId!: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @Column({
    type: 'uuid',
    name: 'created_by',
    nullable: true,
  })
  createdBy?: string | null;

  @Column({
    type: 'uuid',
    name: 'updated_by',
    nullable: true,
  })
  updatedBy?: string | null;

  @Column({ type: 'varchar', name: 'ip_address', length: 45, nullable: true })
  ipAddress?: string | null;
}

@Entity('user_invitations')
export class UserInvitation extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'uuid',
    name: 'invited_user_id',
    nullable: true,
  })
  invitedUserId?: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'invited_user_id' })
  invitedUser?: User | null;

  @Column({ type: 'varchar', name: 'invited_email', length: 255 })
  invitedEmail!: string;

  @Column({ type: 'uuid', name: 'invitation_status_id' })
  invitationStatusId!: string;

  @ManyToOne(() => InvitationStatus)
  @JoinColumn({ name: 'invitation_status_id' })
  invitationStatus!: InvitationStatus;

  @Column({ type: 'varchar', name: 'token_hash', length: 255 })
  tokenHash!: string;

  @Column({ type: 'timestamp', name: 'expires_at' })
  expiresAt!: Date;

  @Column({ type: 'timestamp', name: 'accepted_at', nullable: true })
  acceptedAt?: Date | null;

  @Column({
    type: 'uuid',
    name: 'invited_by_user_id',
    nullable: true,
  })
  invitedByUserId?: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'invited_by_user_id' })
  invitedByUser?: User | null;

  @Column({
    type: 'uuid',
    name: 'created_by',
    nullable: true,
  })
  createdBy?: string | null;

  @Column({
    type: 'uuid',
    name: 'updated_by',
    nullable: true,
  })
  updatedBy?: string | null;

  @Column({ type: 'varchar', name: 'ip_address', length: 45, nullable: true })
  ipAddress?: string | null;
}

export const USER_TYPEORM_ENTITIES = [
  User,
  RolePermission,
  UserRole,
  UserInvitation,
];
