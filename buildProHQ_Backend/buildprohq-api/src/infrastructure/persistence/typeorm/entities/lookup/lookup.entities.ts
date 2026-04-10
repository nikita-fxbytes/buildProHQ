import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SoftDeleteTimestamps } from '../shared';

import { Project, Task, User } from '..';

@Entity('user_types')
export class UserType extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('uq_user_types_code', { unique: true })
  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Index('uq_user_types_name', { unique: true })
  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @OneToMany(() => User, (u) => u.userType)
  users!: User[];
}

@Entity('user_statuses')
export class UserStatus extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('uq_user_statuses_code', { unique: true })
  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive!: boolean;

  @OneToMany(() => User, (u) => u.userStatus)
  users!: User[];
}

@Entity('task_statuses')
export class TaskStatus extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('uq_task_statuses_code', { unique: true })
  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({
    type: 'boolean',
    name: 'is_terminal',
    default: false,
  })
  isTerminal!: boolean;

  @OneToMany(() => Task, (t) => t.status)
  tasks!: Task[];
}

@Entity('task_priorities')
export class TaskPriority extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('uq_task_priorities_code', { unique: true })
  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Index('uq_task_priorities_name', { unique: true })
  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({
    type: 'int',
    unsigned: true,
    name: 'sort_order',
    default: () => '0',
  })
  sortOrder!: number;

  @OneToMany(() => Task, (t) => t.priority)
  tasks!: Task[];
}

@Entity('invitation_statuses')
export class InvitationStatus extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('uq_invitation_statuses_code', { unique: true })
  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;
}

@Entity('trades')
export class Trade extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('uq_trades_code', { unique: true })
  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Index('uq_trades_name', { unique: true })
  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({
    type: 'int',
    unsigned: true,
    name: 'sort_order',
    default: () => '0',
  })
  sortOrder!: number;
}

@Entity('levels')
export class Level extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('uq_levels_code', { unique: true })
  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Index('uq_levels_name', { unique: true })
  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({
    type: 'int',
    unsigned: true,
    name: 'sort_order',
    default: () => '0',
  })
  sortOrder!: number;
}

@Entity('roles')
export class Role extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('uq_roles_code', { unique: true })
  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Index('uq_roles_name', { unique: true })
  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({
    type: 'boolean',
    name: 'is_system_role',
    default: false,
  })
  isSystemRole!: boolean;
}

@Entity('permissions')
export class Permission extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('uq_permissions_code', { unique: true })
  @Column({ type: 'varchar', length: 100 })
  code!: string;

  @Index('uq_permissions_name', { unique: true })
  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ type: 'varchar', name: 'module_key', length: 100 })
  moduleKey!: string;
}

@Entity('filter_categories')
export class FilterCategory extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'project_id', nullable: true })
  projectId?: string | null;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project?: Project | null;

  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({
    type: 'boolean',
    name: 'is_system_category',
    default: false,
  })
  isSystemCategory!: boolean;

  @OneToMany(() => FilterOption, (fo) => fo.filterCategory)
  options!: FilterOption[];
}

@Entity('filter_options')
export class FilterOption extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'filter_category_id' })
  filterCategoryId!: string;

  @ManyToOne(() => FilterCategory, (fc) => fc.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'filter_category_id' })
  filterCategory!: FilterCategory;

  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({
    type: 'int',
    unsigned: true,
    name: 'sort_order',
    default: () => '0',
  })
  sortOrder!: number;
}

@Entity('settings')
export class Setting extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    name: 'scope_type',
    length: 30,
    default: () => "'global'",
  })
  scopeType!: string;

  @Column({ type: 'uuid', name: 'scope_id', nullable: true })
  scopeId?: string | null;

  @Column({ type: 'varchar', name: 'setting_key', length: 120 })
  settingKey!: string;

  @Column({ type: 'json', name: 'setting_value_json' })
  settingValueJson!: Record<string, any>;

  @Column({
    type: 'boolean',
    name: 'is_sensitive',
    default: false,
  })
  isSensitive!: boolean;
}

@Entity('assignment_statuses')
export class AssignmentStatus extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'varchar', length: 50 })
  code!: string;
  @Column({ type: 'varchar', length: 100 })
  name!: string;
  @Column({
    type: 'boolean',
    name: 'is_terminal',
    default: false,
  })
  isTerminal!: boolean;
}

export const LOOKUP_TYPEORM_ENTITIES = [
  UserType,
  UserStatus,
  TaskStatus,
  TaskPriority,
  InvitationStatus,
  Trade,
  Level,
  Role,
  Permission,
  FilterCategory,
  FilterOption,
  Setting,
  AssignmentStatus,
];
