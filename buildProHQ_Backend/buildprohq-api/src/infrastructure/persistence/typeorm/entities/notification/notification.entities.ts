import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { SoftDeleteTimestamps } from '../shared';

import { User } from '..';

@Entity('notification_channels')
export class NotificationChannel extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'varchar', length: 50 })
  code!: string;
  @Column({ type: 'varchar', length: 100 })
  name!: string;
  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive!: boolean;
}

@Entity('notification_templates')
export class NotificationTemplate extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'varchar', name: 'template_key', length: 120 })
  templateKey!: string;
  @Column({ type: 'uuid', name: 'channel_id' })
  channelId!: string;
  @ManyToOne(() => NotificationChannel)
  @JoinColumn({ name: 'channel_id' })
  channel!: NotificationChannel;
  @Column({ type: 'varchar', name: 'title_template', length: 255 })
  titleTemplate!: string;
  @Column({ type: 'text', name: 'body_template' })
  bodyTemplate!: string;
  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive!: boolean;
  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any> | null;
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
  @Column({
    type: 'uuid',
    name: 'channel_id',
    nullable: true,
  })
  channelId?: string | null;
  @ManyToOne(() => NotificationChannel)
  @JoinColumn({ name: 'channel_id' })
  channel?: NotificationChannel | null;
  @Column({
    type: 'uuid',
    name: 'template_id',
    nullable: true,
  })
  templateId?: string | null;
  @ManyToOne(() => NotificationTemplate)
  @JoinColumn({ name: 'template_id' })
  template?: NotificationTemplate | null;
  @Column({ type: 'varchar', length: 255 })
  title!: string;
  @Column({ type: 'text' })
  message!: string;
  @Column({ type: 'varchar', length: 50 })
  type!: string;
  @Column({ type: 'boolean', name: 'is_read', default: false })
  isRead!: boolean;
  @Column({ type: 'varchar', name: 'entity_type', length: 50, nullable: true })
  entityType?: string | null;
  @Column({ type: 'uuid', name: 'entity_id', nullable: true })
  entityId?: string | null;
  @Column({
    type: 'varchar',
    name: 'source_event_key',
    length: 120,
    nullable: true,
  })
  sourceEventKey?: string | null;
  @Column({ type: 'timestamp', name: 'scheduled_for', nullable: true })
  scheduledFor?: Date | null;
  @Column({ type: 'timestamp', name: 'read_at', nullable: true })
  readAt?: Date | null;
  @CreateDateColumn({ type: 'timestamp', precision: 6, name: 'created_at' })
  createdAt!: Date;
}

@Entity('notification_settings')
export class NotificationSetting {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
  @Column({
    type: 'boolean',
    name: 'notify_task_assigned',
    default: true,
  })
  notifyTaskAssigned!: boolean;
  @Column({
    type: 'boolean',
    name: 'notify_status_changed',
    default: true,
  })
  notifyStatusChanged!: boolean;
  @Column({
    type: 'boolean',
    name: 'notify_general',
    default: true,
  })
  notifyGeneral!: boolean;
  @CreateDateColumn({ type: 'timestamp', precision: 6, name: 'created_at' })
  createdAt!: Date;
  @UpdateDateColumn({ type: 'timestamp', precision: 6, name: 'updated_at' })
  updatedAt!: Date;
}

@Entity('notification_setting_channels')
export class NotificationSettingChannel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
  @Column({ type: 'uuid', name: 'channel_id' })
  channelId!: string;
  @ManyToOne(() => NotificationChannel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'channel_id' })
  channel!: NotificationChannel;
  @Column({ type: 'boolean', name: 'is_enabled', default: true })
  isEnabled!: boolean;
  @CreateDateColumn({ type: 'timestamp', precision: 6, name: 'created_at' })
  createdAt!: Date;
  @UpdateDateColumn({ type: 'timestamp', precision: 6, name: 'updated_at' })
  updatedAt!: Date;
}

@Entity('user_device_tokens')
export class UserDeviceToken extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
  @Column({
    type: 'uuid',
    name: 'channel_id',
    nullable: true,
  })
  channelId?: string | null;
  @ManyToOne(() => NotificationChannel)
  @JoinColumn({ name: 'channel_id' })
  channel?: NotificationChannel | null;
  @Column({ type: 'varchar', name: 'device_token', length: 512 })
  deviceToken!: string;
  @Column({ type: 'varchar', name: 'device_type', length: 20 })
  deviceType!: string;
  @Column({ type: 'varchar', length: 30, nullable: true })
  platform?: string | null;
  @Column({ type: 'varchar', name: 'app_version', length: 40, nullable: true })
  appVersion?: string | null;
  @Column({ type: 'timestamp', name: 'last_seen_at', nullable: true })
  lastSeenAt?: Date | null;
  @Column({ type: 'timestamp', name: 'revoked_at', nullable: true })
  revokedAt?: Date | null;
  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any> | null;
}

@Entity('scheduled_notifications')
export class ScheduledNotification extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
  @Column({
    type: 'uuid',
    name: 'channel_id',
    nullable: true,
  })
  channelId?: string | null;
  @ManyToOne(() => NotificationChannel)
  @JoinColumn({ name: 'channel_id' })
  channel?: NotificationChannel | null;
  @Column({
    type: 'uuid',
    name: 'template_id',
    nullable: true,
  })
  templateId?: string | null;
  @ManyToOne(() => NotificationTemplate)
  @JoinColumn({ name: 'template_id' })
  template?: NotificationTemplate | null;
  @Column({ type: 'varchar', length: 50 })
  type!: string;
  @Column({ type: 'varchar', length: 255 })
  title!: string;
  @Column({ type: 'text' })
  message!: string;
  @Column({ type: 'varchar', name: 'entity_type', length: 50, nullable: true })
  entityType?: string | null;
  @Column({ type: 'uuid', name: 'entity_id', nullable: true })
  entityId?: string | null;
  @Column({ type: 'timestamp', name: 'scheduled_for' })
  scheduledFor!: Date;
  @Column({ type: 'timestamp', name: 'processed_at', nullable: true })
  processedAt?: Date | null;
  @Column({
    type: 'varchar',
    name: 'process_status',
    length: 30,
    default: () => "'pending'",
  })
  processStatus!: string;
  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any> | null;
}

@Entity('notification_logs')
export class NotificationLog extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({
    type: 'uuid',
    name: 'notification_id',
    nullable: true,
  })
  notificationId?: string | null;
  @ManyToOne(() => Notification)
  @JoinColumn({ name: 'notification_id' })
  notification?: Notification | null;
  @Column({
    type: 'uuid',
    name: 'scheduled_notification_id',
    nullable: true,
  })
  scheduledNotificationId?: string | null;
  @ManyToOne(() => ScheduledNotification)
  @JoinColumn({ name: 'scheduled_notification_id' })
  scheduledNotification?: ScheduledNotification | null;
  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
  @Column({
    type: 'uuid',
    name: 'channel_id',
    nullable: true,
  })
  channelId?: string | null;
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
    type: 'varchar',
    name: 'provider_message_id',
    length: 255,
    nullable: true,
  })
  providerMessageId?: string | null;
  @Column({ type: 'varchar', name: 'delivery_status', length: 30 })
  deliveryStatus!: string;
  @Column({ type: 'text', name: 'delivery_error', nullable: true })
  deliveryError?: string | null;
  @Column({
    type: 'timestamp',
    name: 'attempted_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  attemptedAt!: Date;
  @Column({ type: 'timestamp', name: 'delivered_at', nullable: true })
  deliveredAt?: Date | null;
  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any> | null;
}

export const NOTIFICATION_TYPEORM_ENTITIES = [
  NotificationChannel,
  NotificationTemplate,
  Notification,
  NotificationSetting,
  NotificationSettingChannel,
  UserDeviceToken,
  ScheduledNotification,
  NotificationLog,
];
