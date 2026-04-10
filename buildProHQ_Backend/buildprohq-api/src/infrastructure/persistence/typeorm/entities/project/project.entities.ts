import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

import { SoftDeleteTimestamps } from '../shared';

import { User } from '..';

@Entity('projects')
export class Project extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'varchar', length: 50 })
  code!: string;
  @Column({ type: 'varchar', length: 150 })
  name!: string;
  @Column({ type: 'text', nullable: true })
  description?: string | null;
  @Column({
    type: 'varchar',
    name: 'project_status',
    length: 30,
    default: () => "'active'",
  })
  projectStatus!: string;
  @Column({ type: 'date', name: 'start_date', nullable: true })
  startDate?: string | null;
  @Column({ type: 'date', name: 'end_date', nullable: true })
  endDate?: string | null;
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

  @OneToMany(() => Site, (s) => s.project)
  sites!: Site[];
}

@Entity('sites')
export class Site extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'uuid', name: 'project_id' })
  projectId!: string;
  @ManyToOne(() => Project, (p) => p.sites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project!: Project;
  @Column({ type: 'varchar', length: 50 })
  code!: string;
  @Column({ type: 'varchar', length: 150 })
  name!: string;
  @Column({
    type: 'varchar',
    name: 'address_line_1',
    length: 255,
    nullable: true,
  })
  addressLine1?: string | null;
  @Column({
    type: 'varchar',
    name: 'address_line_2',
    length: 255,
    nullable: true,
  })
  addressLine2?: string | null;
  @Column({ type: 'varchar', length: 120, nullable: true })
  suburb?: string | null;
  @Column({ type: 'varchar', length: 120, nullable: true })
  state?: string | null;
  @Column({ type: 'varchar', name: 'postal_code', length: 30, nullable: true })
  postalCode?: string | null;
  @Column({ type: 'char', name: 'country_code', length: 2, nullable: true })
  countryCode?: string | null;
  @Column({ type: 'varchar', length: 80, default: () => "'UTC'" })
  timezone!: string;
  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive!: boolean;
}

@Entity('site_users')
export class SiteUser extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'uuid', name: 'site_id' })
  siteId!: string;
  @ManyToOne(() => Site, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site!: Site;
  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
  @Column({ type: 'varchar', name: 'site_role', length: 50, nullable: true })
  siteRole?: string | null;
  @Column({
    type: 'timestamp',
    name: 'assigned_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  assignedAt!: Date;
  @Column({ type: 'timestamp', name: 'removed_at', nullable: true })
  removedAt?: Date | null;
}

@Entity('site_locations')
export class SiteLocation extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'uuid', name: 'site_id' })
  siteId!: string;
  @ManyToOne(() => Site, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site!: Site;
  @Column({
    type: 'varchar',
    name: 'location_name',
    length: 120,
    default: () => "'default'",
  })
  locationName!: string;
  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude!: string;
  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude!: string;
  @Column({
    type: 'int',
    unsigned: true,
    name: 'allowed_radius_meters',
    default: () => '150',
  })
  allowedRadiusMeters!: number;
  @Column({ type: 'boolean', name: 'is_primary', default: true })
  isPrimary!: boolean;
}

@Entity('project_users')
@Index('uq_project_users_project_user', ['projectId', 'userId'], { unique: true })
export class ProjectUser extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'project_id' })
  projectId!: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'varchar', name: 'project_role', length: 50, nullable: true })
  projectRole?: string | null;
}

export const PROJECT_TYPEORM_ENTITIES = [
  Project,
  Site,
  SiteUser,
  SiteLocation,
  ProjectUser,
];
