import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SoftDeleteTimestamps } from '../shared';

import { User, UserDeviceToken } from '..';

@Entity('device_sync_states')
export class DeviceSyncState extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
  @Column({
    type: 'uuid',
    name: 'device_token_id',
    nullable: true,
  })
  deviceTokenId?: string | null;
  @ManyToOne(() => UserDeviceToken)
  @JoinColumn({ name: 'device_token_id' })
  deviceToken?: UserDeviceToken | null;
  @Column({
    type: 'timestamp',
    precision: 6,
    name: 'last_pull_at',
    nullable: true,
  })
  lastPullAt?: Date | null;
  @Column({
    type: 'timestamp',
    precision: 6,
    name: 'last_push_at',
    nullable: true,
  })
  lastPushAt?: Date | null;
  @Column({
    type: 'uuid',
    name: 'last_server_change_id',
    nullable: true,
  })
  lastServerChangeId?: string | null;
  @Column({
    type: 'varchar',
    name: 'sync_state',
    length: 30,
    default: () => "'idle'",
  })
  syncState!: string;
  @Column({ type: 'text', name: 'last_error', nullable: true })
  lastError?: string | null;
  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any> | null;
}

@Entity('sync_logs')
export class SyncLog extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
  @Column({
    type: 'uuid',
    name: 'device_token_id',
    nullable: true,
  })
  deviceTokenId?: string | null;
  @Column({ type: 'varchar', length: 20 })
  direction!: string;
  @Column({
    type: 'timestamp',
    precision: 6,
    name: 'sync_started_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  syncStartedAt!: Date;
  @Column({
    type: 'timestamp',
    precision: 6,
    name: 'sync_finished_at',
    nullable: true,
  })
  syncFinishedAt?: Date | null;
  @Column({
    type: 'varchar',
    name: 'sync_status',
    length: 30,
    default: () => "'started'",
  })
  syncStatus!: string;
  @Column({
    type: 'int',
    unsigned: true,
    name: 'records_processed',
    default: () => '0',
  })
  recordsProcessed!: number;
  @Column({ type: 'text', name: 'error_message', nullable: true })
  errorMessage?: string | null;
  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any> | null;
}

@Entity('change_queue')
export class ChangeQueue extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'varchar', name: 'entity_type', length: 60 })
  entityType!: string;
  @Column({ type: 'uuid', name: 'entity_id', nullable: true })
  entityId?: string | null;
  @Column({ type: 'varchar', name: 'operation_type', length: 20 })
  operationType!: string;
  @Column({
    type: 'uuid',
    name: 'changed_by',
    nullable: true,
  })
  changedBy?: string | null;
  @Column({
    type: 'timestamp',
    precision: 6,
    name: 'changed_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  changedAt!: Date;
  @Column({ type: 'json', nullable: true })
  payload?: Record<string, any> | null;
  @Column({
    type: 'timestamp',
    precision: 6,
    name: 'processed_at',
    nullable: true,
  })
  processedAt?: Date | null;
  @Column({
    type: 'varchar',
    name: 'process_status',
    length: 30,
    default: () => "'pending'",
  })
  processStatus!: string;
  @Column({
    type: 'int',
    unsigned: true,
    name: 'retry_count',
    default: () => '0',
  })
  retryCount!: number;
  @Column({ type: 'text', name: 'last_error', nullable: true })
  lastError?: string | null;
}

@Entity('export_jobs')
export class ExportJob extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({
    type: 'uuid',
    name: 'requested_by',
    nullable: true,
  })
  requestedBy?: string | null;
  @Column({ type: 'varchar', name: 'export_type', length: 50 })
  exportType!: string;
  @Column({ type: 'json', name: 'filter_json', nullable: true })
  filterJson?: Record<string, any> | null;
  @Column({
    type: 'varchar',
    name: 'output_format',
    length: 20,
    default: () => "'csv'",
  })
  outputFormat!: string;
  @Column({ type: 'varchar', name: 'file_url', length: 1024, nullable: true })
  fileUrl?: string | null;
  @Column({ type: 'varchar', length: 30, default: () => "'queued'" })
  status!: string;
  @Column({
    type: 'timestamp',
    precision: 6,
    name: 'started_at',
    nullable: true,
  })
  startedAt?: Date | null;
  @Column({
    type: 'timestamp',
    precision: 6,
    name: 'completed_at',
    nullable: true,
  })
  completedAt?: Date | null;
  @Column({ type: 'text', name: 'error_message', nullable: true })
  errorMessage?: string | null;
}

export const SYNC_TYPEORM_ENTITIES = [
  DeviceSyncState,
  SyncLog,
  ChangeQueue,
  ExportJob,
];
