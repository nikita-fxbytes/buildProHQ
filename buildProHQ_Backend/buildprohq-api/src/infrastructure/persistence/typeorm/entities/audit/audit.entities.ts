import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SoftDeleteTimestamps } from '../shared';

import { User } from '..';

@Entity('audit_logs')
export class AuditLog extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'varchar', name: 'table_name', length: 100 })
  tableName!: string;
  @Column({ type: 'uuid', name: 'record_id', nullable: true })
  recordId?: string | null;
  @Column({ type: 'varchar', name: 'action_type', length: 20 })
  actionType!: string;
  @Column({ type: 'json', name: 'old_value', nullable: true })
  oldValue?: Record<string, any> | null;
  @Column({ type: 'json', name: 'new_value', nullable: true })
  newValue?: Record<string, any> | null;
  @Column({
    type: 'uuid',
    name: 'performed_by',
    nullable: true,
  })
  performedBy?: string | null;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'performed_by' })
  performer?: User | null;
  @Column({ type: 'varchar', name: 'ip_address', length: 45, nullable: true })
  ipAddress?: string | null;
  @Column({ type: 'varchar', name: 'request_id', length: 100, nullable: true })
  requestId?: string | null;
  @Column({ type: 'varchar', name: 'user_agent', length: 500, nullable: true })
  userAgent?: string | null;
}

export const AUDIT_TYPEORM_ENTITIES = [AuditLog];
