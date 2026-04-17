import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SoftDeleteTimestamps } from '../shared';

import {
  AssignmentStatus,
  FilterOption,
  Project,
  Site,
  TaskPriority,
  TaskStatus,
  User,
} from '..';

@Entity('tasks')
export class Task extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'uuid', name: 'status_id' })
  statusId!: string;
  @ManyToOne(() => TaskStatus)
  @JoinColumn({ name: 'status_id' })
  status!: TaskStatus;
  @Column({
    type: 'uuid',
    name: 'priority_id',
    nullable: true,
  })
  priorityId?: string | null;
  @ManyToOne(() => TaskPriority)
  @JoinColumn({ name: 'priority_id' })
  priority?: TaskPriority | null;
  @Column({
    type: 'uuid',
    name: 'project_id',
    nullable: true,
  })
  projectId?: string | null;
  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project?: Project | null;
  @Column({ type: 'uuid', name: 'site_id', nullable: true })
  siteId?: string | null;
  @ManyToOne(() => Site)
  @JoinColumn({ name: 'site_id' })
  site?: Site | null;
  @Column({
    type: 'uuid',
    name: 'created_by_user_id',
    nullable: true,
  })
  createdByUserId?: string | null;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser?: User | null;
  @Column({
    type: 'uuid',
    name: 'assigned_to_user_id',
    nullable: true,
  })
  assignedToUserId?: string | null;
  @ManyToOne(() => User, (u) => u.assignedTasks)
  @JoinColumn({ name: 'assigned_to_user_id' })
  assignedToUser?: User | null;
  @Column({ type: 'varchar', length: 500, nullable: true, name: 'title' })
  title?: string | null;

  @Column({ type: 'text' })
  description!: string;
  @Column({ type: 'text', nullable: true })
  notes?: string | null;
  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any> | null;
  @Column({
    type: 'timestamp',
    precision: 6,
    name: 'opened_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  openedAt!: Date;
  @Column({ type: 'timestamp', precision: 6, name: 'due_at', nullable: true })
  dueAt?: Date | null;
  @Column({
    type: 'timestamp',
    precision: 6,
    name: 'closed_at',
    nullable: true,
  })
  closedAt?: Date | null;
  @Column({
    type: 'int',
    unsigned: true,
    name: 'days_open',
    default: () => '0',
  })
  daysOpen!: number;
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

@Entity('task_assignments')
export class TaskAssignment extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'uuid', name: 'task_id' })
  taskId!: string;
  @ManyToOne(() => Task, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task!: Task;
  @Column({
    type: 'uuid',
    name: 'assignee_user_id',
    nullable: true,
  })
  assigneeUserId?: string | null;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'assignee_user_id' })
  assigneeUser?: User | null;
  @Column({
    type: 'uuid',
    name: 'assigned_by_user_id',
    nullable: true,
  })
  assignedByUserId?: string | null;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigned_by_user_id' })
  assignedByUser?: User | null;
  @Column({
    type: 'uuid',
    name: 'assignment_status_id',
    nullable: true,
  })
  assignmentStatusId?: string | null;
  @ManyToOne(() => AssignmentStatus)
  @JoinColumn({ name: 'assignment_status_id' })
  assignmentStatus?: AssignmentStatus | null;
  @Column({ type: 'text', nullable: true })
  notes?: string | null;
  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any> | null;
  @Column({
    type: 'timestamp',
    precision: 6,
    name: 'assigned_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  assignedAt!: Date;
  @Column({
    type: 'timestamp',
    precision: 6,
    name: 'responded_at',
    nullable: true,
  })
  respondedAt?: Date | null;
  @Column({
    type: 'timestamp',
    precision: 6,
    name: 'unassigned_at',
    nullable: true,
  })
  unassignedAt?: Date | null;

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

@Entity('task_assignment_responses')
export class TaskAssignmentResponse extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'uuid', name: 'assignment_id' })
  assignmentId!: string;
  @ManyToOne(() => TaskAssignment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assignment_id' })
  assignment!: TaskAssignment;
  @Column({ type: 'uuid', name: 'response_status_id' })
  responseStatusId!: string;
  @ManyToOne(() => AssignmentStatus)
  @JoinColumn({ name: 'response_status_id' })
  responseStatus!: AssignmentStatus;
  @Column({
    type: 'uuid',
    name: 'responded_by_user_id',
    nullable: true,
  })
  respondedByUserId?: string | null;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'responded_by_user_id' })
  respondedByUser?: User | null;
  @Column({ type: 'text', name: 'response_note', nullable: true })
  responseNote?: string | null;
  @Column({
    type: 'timestamp',
    precision: 6,
    name: 'responded_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  respondedAt!: Date;
  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any> | null;
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

@Entity('task_completions')
export class TaskCompletion extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'uuid', name: 'task_id' })
  taskId!: string;
  @OneToOne(() => Task, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task!: Task;
  @Column({
    type: 'uuid',
    name: 'completed_by_user_id',
    nullable: true,
  })
  completedByUserId?: string | null;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'completed_by_user_id' })
  completedByUser?: User | null;
  @Column({ type: 'text', nullable: true })
  notes?: string | null;
  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any> | null;
  @Column({
    type: 'timestamp',
    precision: 6,
    name: 'completed_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  completedAt!: Date;
  @Column({ type: 'int', unsigned: true, name: 'duration_days' })
  durationDays!: number;
  @Column({
    type: 'varchar',
    name: 'gps_location',
    length: 100,
    nullable: true,
  })
  gpsLocation?: string | null;

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

@Entity('task_filter_values')
export class TaskFilterValue extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'uuid', name: 'task_id' })
  taskId!: string;
  @ManyToOne(() => Task, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task!: Task;
  @Column({ type: 'uuid', name: 'filter_option_id' })
  filterOptionId!: string;
  @ManyToOne(() => FilterOption)
  @JoinColumn({ name: 'filter_option_id' })
  filterOption!: FilterOption;
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

@Entity('task_comments')
export class TaskComment extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'uuid', name: 'task_id' })
  taskId!: string;
  @ManyToOne(() => Task, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task!: Task;
  @Column({ type: 'text' })
  comment!: string;
  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any> | null;
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

@Entity('task_history')
export class TaskHistory extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'uuid', name: 'task_id' })
  taskId!: string;
  @ManyToOne(() => Task, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task!: Task;
  @Column({
    type: 'uuid',
    name: 'old_status_id',
    nullable: true,
  })
  oldStatusId?: string | null;
  @Column({
    type: 'uuid',
    name: 'new_status_id',
    nullable: true,
  })
  newStatusId?: string | null;
  @Column({
    type: 'uuid',
    name: 'old_assignee_user_id',
    nullable: true,
  })
  oldAssigneeUserId?: string | null;
  @Column({
    type: 'uuid',
    name: 'new_assignee_user_id',
    nullable: true,
  })
  newAssigneeUserId?: string | null;
  @Column({ type: 'text', name: 'change_reason', nullable: true })
  changeReason?: string | null;
  @Column({ type: 'text', nullable: true })
  notes?: string | null;
  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any> | null;
  @Column({
    type: 'timestamp',
    precision: 6,
    name: 'changed_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  changedAt!: Date;
  @Column({
    type: 'uuid',
    name: 'changed_by',
    nullable: true,
  })
  changedBy?: string | null;
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

@Entity('task_metrics')
export class TaskMetric extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'date', name: 'metric_date' })
  metricDate!: string;
  @Column({
    type: 'uuid',
    name: 'project_id',
    nullable: true,
  })
  projectId?: string | null;
  @Column({ type: 'uuid', name: 'site_id', nullable: true })
  siteId?: string | null;
  @Column({
    type: 'int',
    unsigned: true,
    name: 'open_count',
    default: () => '0',
  })
  openCount!: number;
  @Column({
    type: 'int',
    unsigned: true,
    name: 'completed_count',
    default: () => '0',
  })
  completedCount!: number;
  @Column({
    type: 'int',
    unsigned: true,
    name: 'overdue_count',
    default: () => '0',
  })
  overdueCount!: number;
  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    name: 'avg_completion_days',
    nullable: true,
  })
  avgCompletionDays?: string | null;
}

@Entity('attachments')
export class Attachment extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'varchar', name: 'entity_type', length: 50 })
  entityType!: string;
  @Column({ type: 'uuid', name: 'entity_id', nullable: true })
  entityId?: string | null;
  @Column({ type: 'uuid', name: 'task_id', nullable: true })
  taskId?: string | null;
  @ManyToOne(() => Task, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task?: Task | null;
  @Column({ type: 'varchar', name: 'file_url', length: 1024 })
  fileUrl!: string;
  @Column({ type: 'varchar', name: 'file_name', length: 255 })
  fileName!: string;
  @Column({ type: 'varchar', name: 'file_type', length: 50 })
  fileType!: string;
  @Column({ type: 'varchar', name: 'mime_type', length: 100, nullable: true })
  mimeType?: string | null;
  @Column({
    type: 'varchar',
    name: 'storage_provider',
    length: 50,
    nullable: true,
  })
  storageProvider?: string | null;
  @Column({ type: 'varchar', name: 'storage_key', length: 512, nullable: true })
  storageKey?: string | null;
  @Column({ type: 'char', name: 'checksum_sha256', length: 64, nullable: true })
  checksumSha256?: string | null;
  @Column({ type: 'bigint', unsigned: true, name: 'file_size' })
  fileSize!: string;
  @Column({
    type: 'uuid',
    name: 'uploaded_by',
    nullable: true,
  })
  uploadedBy?: string | null;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by' })
  uploader?: User | null;
  @Column({ type: 'boolean', name: 'is_before', default: false })
  isBefore!: boolean;
  @Column({ type: 'boolean', name: 'is_after', default: false })
  isAfter!: boolean;
  @Column({ type: 'timestamp', name: 'captured_at', nullable: true })
  capturedAt?: Date | null;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 7,
    name: 'captured_lat',
    nullable: true,
  })
  capturedLat?: string | null;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 7,
    name: 'captured_lng',
    nullable: true,
  })
  capturedLng?: string | null;
  @Column({ type: 'json', name: 'annotation_json', nullable: true })
  annotationJson?: Record<string, any> | null;
  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any> | null;
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

export const TASK_TYPEORM_ENTITIES = [
  Task,
  TaskAssignment,
  TaskAssignmentResponse,
  TaskCompletion,
  TaskFilterValue,
  TaskComment,
  TaskHistory,
  TaskMetric,
  Attachment,
];
