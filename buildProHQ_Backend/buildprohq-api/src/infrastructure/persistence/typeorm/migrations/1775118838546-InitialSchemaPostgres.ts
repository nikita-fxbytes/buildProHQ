import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchemaPostgres1775118838546 implements MigrationInterface {
  name = 'InitialSchemaPostgres1775118838546';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_types" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "code" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_3f05efd7b52a7eca1f6b6f75e45" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_user_types_code" ON "user_types" ("code") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_user_types_name" ON "user_types" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_statuses" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "code" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_50cc8fb0f4810b2f3bfcef7a788" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_user_statuses_code" ON "user_statuses" ("code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "task_statuses" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "code" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "is_terminal" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_28fe920c04b1baa795d82773739" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_task_statuses_code" ON "task_statuses" ("code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "task_priorities" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "code" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "sort_order" integer NOT NULL DEFAULT 0, CONSTRAINT "PK_aa148974939142ee75716ee34e3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_task_priorities_code" ON "task_priorities" ("code") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_task_priorities_name" ON "task_priorities" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "invitation_statuses" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "code" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_8d24ae7deedcc8e08a6c4ef9bcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_invitation_statuses_code" ON "invitation_statuses" ("code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "trades" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "code" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "sort_order" integer NOT NULL DEFAULT 0, CONSTRAINT "PK_c6d7c36a837411ba5194dc58595" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_trades_code" ON "trades" ("code") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_trades_name" ON "trades" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "levels" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "code" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "sort_order" integer NOT NULL DEFAULT 0, CONSTRAINT "PK_05f8dd8f715793c64d49e3f1901" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_levels_code" ON "levels" ("code") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_levels_name" ON "levels" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "code" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "is_system_role" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_roles_code" ON "roles" ("code") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_roles_name" ON "roles" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "permissions" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "code" character varying(100) NOT NULL, "name" character varying(150) NOT NULL, "module_key" character varying(100) NOT NULL, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_permissions_code" ON "permissions" ("code") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_permissions_name" ON "permissions" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "filter_categories" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "code" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "is_system_category" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_0d1dd9dbac2f7dce061bd587194" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "filter_options" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "filter_category_id" bigint NOT NULL, "code" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "sort_order" integer NOT NULL DEFAULT 0, CONSTRAINT "PK_52011249a500b5325bf0af717a6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "settings" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "scope_type" character varying(30) NOT NULL DEFAULT 'global', "scope_id" bigint, "setting_key" character varying(120) NOT NULL, "setting_value_json" json NOT NULL, "is_sensitive" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "assignment_statuses" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "code" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "is_terminal" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_ef1e5bc74326b923d9902599aeb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "user_type_id" bigint NOT NULL, "user_status_id" bigint NOT NULL, "full_name" character varying(150) NOT NULL, "initials" character varying(8), "email" character varying(255) NOT NULL, "password_hash" character varying(255), "last_login_at" TIMESTAMP, "created_by" bigint, "updated_by" bigint, "ip_address" character varying(45), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_users_email" ON "users" ("email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_trade_profiles" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "user_id" bigint NOT NULL, "trade_id" bigint NOT NULL, CONSTRAINT "REL_cf2856e57eca114bf74b407a52" UNIQUE ("user_id"), CONSTRAINT "PK_faf2f822f60dc26f6731d374239" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_user_trade_profiles_user_id" ON "user_trade_profiles" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "role_permissions" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "role_id" bigint NOT NULL, "permission_id" bigint NOT NULL, CONSTRAINT "PK_84059017c90bfcb701b8fa42297" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "user_id" bigint NOT NULL, "role_id" bigint NOT NULL, "created_by" bigint, "updated_by" bigint, "ip_address" character varying(45), CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_invitations" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "invited_user_id" bigint, "invited_email" character varying(255) NOT NULL, "invitation_status_id" bigint NOT NULL, "token_hash" character varying(255) NOT NULL, "expires_at" TIMESTAMP NOT NULL, "accepted_at" TIMESTAMP, "invited_by_user_id" bigint, "created_by" bigint, "updated_by" bigint, "ip_address" character varying(45), CONSTRAINT "PK_c8005acb91c3ce9a7ae581eca8f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "projects" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "code" character varying(50) NOT NULL, "name" character varying(150) NOT NULL, "description" text, "project_status" character varying(30) NOT NULL DEFAULT 'active', "start_date" date, "end_date" date, "created_by" bigint, "updated_by" bigint, "ip_address" character varying(45), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sites" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "project_id" bigint NOT NULL, "code" character varying(50) NOT NULL, "name" character varying(150) NOT NULL, "address_line_1" character varying(255), "address_line_2" character varying(255), "suburb" character varying(120), "state" character varying(120), "postal_code" character varying(30), "country_code" character(2), "timezone" character varying(80) NOT NULL DEFAULT 'UTC', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_4f5eccb1dfde10c9170502595a7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "site_users" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "site_id" bigint NOT NULL, "user_id" bigint NOT NULL, "site_role" character varying(50), "assigned_at" TIMESTAMP NOT NULL DEFAULT now(), "removed_at" TIMESTAMP, CONSTRAINT "PK_99142b6b031a091da1ad5cb1ac0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "site_locations" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "site_id" bigint NOT NULL, "location_name" character varying(120) NOT NULL DEFAULT 'default', "latitude" numeric(10,7) NOT NULL, "longitude" numeric(10,7) NOT NULL, "allowed_radius_meters" integer NOT NULL DEFAULT 150, "is_primary" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_51a9b6efc00dc1cf4419ecee2b3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tasks" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "status_id" bigint NOT NULL, "priority_id" bigint, "level_id" bigint, "trade_id" bigint, "project_id" bigint, "site_id" bigint, "created_by_user_id" bigint, "assigned_to_user_id" bigint, "description" text NOT NULL, "notes" text, "metadata" json, "opened_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "due_at" TIMESTAMP(6), "closed_at" TIMESTAMP(6), "days_open" integer NOT NULL DEFAULT 0, "created_by" bigint, "updated_by" bigint, "ip_address" character varying(45), CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "task_assignments" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "task_id" bigint NOT NULL, "assignee_user_id" bigint, "assigned_by_user_id" bigint, "assignment_status_id" bigint, "notes" text, "metadata" json, "assigned_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "responded_at" TIMESTAMP(6), "unassigned_at" TIMESTAMP(6), "created_by" bigint, "updated_by" bigint, "ip_address" character varying(45), CONSTRAINT "PK_b68f42cf36d807d8a19a96066d7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "task_assignment_responses" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "assignment_id" bigint NOT NULL, "response_status_id" bigint NOT NULL, "responded_by_user_id" bigint, "response_note" text, "responded_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "metadata" json, "created_by" bigint, "updated_by" bigint, "ip_address" character varying(45), CONSTRAINT "PK_0c2e53f87233b35e363a66d8c86" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "task_completions" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "task_id" bigint NOT NULL, "completed_by_user_id" bigint, "notes" text, "metadata" json, "completed_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "duration_days" integer NOT NULL, "gps_location" character varying(100), "created_by" bigint, "updated_by" bigint, "ip_address" character varying(45), CONSTRAINT "REL_3967800678c1fa2c32358f7658" UNIQUE ("task_id"), CONSTRAINT "PK_c9c25215a82514668ab1d72a04d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "task_filter_values" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "task_id" bigint NOT NULL, "filter_option_id" bigint NOT NULL, "created_by" bigint, "updated_by" bigint, "ip_address" character varying(45), CONSTRAINT "PK_2f857f78904f1bb7411f9f68975" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "task_comments" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "task_id" bigint NOT NULL, "comment" text NOT NULL, "metadata" json, "created_by" bigint, "updated_by" bigint, "ip_address" character varying(45), CONSTRAINT "PK_83b99b0b03db29d4cafcb579b77" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "task_history" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "task_id" bigint NOT NULL, "old_status_id" bigint, "new_status_id" bigint, "old_assignee_user_id" bigint, "new_assignee_user_id" bigint, "change_reason" text, "notes" text, "metadata" json, "changed_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "changed_by" bigint, "created_by" bigint, "updated_by" bigint, "ip_address" character varying(45), CONSTRAINT "PK_716670443aea4a2f4a599bb7c53" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "task_metrics" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "metric_date" date NOT NULL, "project_id" bigint, "site_id" bigint, "trade_id" bigint, "level_id" bigint, "open_count" integer NOT NULL DEFAULT 0, "completed_count" integer NOT NULL DEFAULT 0, "overdue_count" integer NOT NULL DEFAULT 0, "avg_completion_days" numeric(8,2), CONSTRAINT "PK_de4c7c796c8f094b394e67381b8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "attachments" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "entity_type" character varying(50) NOT NULL, "entity_id" bigint, "task_id" bigint, "file_url" character varying(1024) NOT NULL, "file_name" character varying(255) NOT NULL, "file_type" character varying(50) NOT NULL, "mime_type" character varying(100), "storage_provider" character varying(50), "storage_key" character varying(512), "checksum_sha256" character(64), "file_size" bigint NOT NULL, "uploaded_by" bigint, "is_before" boolean NOT NULL DEFAULT false, "is_after" boolean NOT NULL DEFAULT false, "captured_at" TIMESTAMP, "captured_lat" numeric(10,7), "captured_lng" numeric(10,7), "annotation_json" json, "metadata" json, "created_by" bigint, "updated_by" bigint, "ip_address" character varying(45), CONSTRAINT "PK_5e1f050bcff31e3084a1d662412" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification_channels" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "code" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_3bc0cb5b60e8659f5fc859b2af0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification_templates" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "template_key" character varying(120) NOT NULL, "channel_id" bigint NOT NULL, "title_template" character varying(255) NOT NULL, "body_template" text NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "metadata" json, CONSTRAINT "PK_76f0fc48b8d057d2ae7f3a2848a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" BIGSERIAL NOT NULL, "user_id" bigint NOT NULL, "channel_id" bigint, "template_id" bigint, "title" character varying(255) NOT NULL, "message" text NOT NULL, "type" character varying(50) NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "entity_type" character varying(50), "entity_id" bigint, "source_event_key" character varying(120), "scheduled_for" TIMESTAMP, "read_at" TIMESTAMP, "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification_settings" ("id" BIGSERIAL NOT NULL, "user_id" bigint NOT NULL, "notify_task_assigned" boolean NOT NULL DEFAULT true, "notify_status_changed" boolean NOT NULL DEFAULT true, "notify_general" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now(), CONSTRAINT "REL_91a7ffebe8b406c4470845d478" UNIQUE ("user_id"), CONSTRAINT "PK_d131abd7996c475ef768d4559ba" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification_setting_channels" ("id" BIGSERIAL NOT NULL, "user_id" bigint NOT NULL, "channel_id" bigint NOT NULL, "is_enabled" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now(), CONSTRAINT "PK_cf0a27a072a1697caf5b39636ef" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_device_tokens" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "user_id" bigint NOT NULL, "channel_id" bigint, "device_token" character varying(512) NOT NULL, "device_type" character varying(20) NOT NULL, "platform" character varying(30), "app_version" character varying(40), "last_seen_at" TIMESTAMP, "revoked_at" TIMESTAMP, "metadata" json, CONSTRAINT "PK_089ca63b045947b89c77b06a79d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "scheduled_notifications" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "user_id" bigint NOT NULL, "channel_id" bigint, "template_id" bigint, "type" character varying(50) NOT NULL, "title" character varying(255) NOT NULL, "message" text NOT NULL, "entity_type" character varying(50), "entity_id" bigint, "scheduled_for" TIMESTAMP NOT NULL, "processed_at" TIMESTAMP, "process_status" character varying(30) NOT NULL DEFAULT 'pending', "metadata" json, CONSTRAINT "PK_9eb8b287229934bbd076a5d64f7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification_logs" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "notification_id" bigint, "scheduled_notification_id" bigint, "user_id" bigint NOT NULL, "channel_id" bigint, "device_token_id" bigint, "provider_message_id" character varying(255), "delivery_status" character varying(30) NOT NULL, "delivery_error" text, "attempted_at" TIMESTAMP NOT NULL DEFAULT now(), "delivered_at" TIMESTAMP, "metadata" json, CONSTRAINT "PK_19c524e644cdeaebfcffc284871" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "device_sync_states" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "user_id" bigint NOT NULL, "device_token_id" bigint, "last_pull_at" TIMESTAMP(6), "last_push_at" TIMESTAMP(6), "last_server_change_id" bigint, "sync_state" character varying(30) NOT NULL DEFAULT 'idle', "last_error" text, "metadata" json, CONSTRAINT "PK_eb2fb890b31a242246630c5cf37" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sync_logs" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "user_id" bigint NOT NULL, "device_token_id" bigint, "direction" character varying(20) NOT NULL, "sync_started_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "sync_finished_at" TIMESTAMP(6), "sync_status" character varying(30) NOT NULL DEFAULT 'started', "records_processed" integer NOT NULL DEFAULT 0, "error_message" text, "metadata" json, CONSTRAINT "PK_f441fe15484e077c80ddec89336" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "change_queue" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "entity_type" character varying(60) NOT NULL, "entity_id" bigint, "operation_type" character varying(20) NOT NULL, "changed_by" bigint, "changed_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "payload" json, "processed_at" TIMESTAMP(6), "process_status" character varying(30) NOT NULL DEFAULT 'pending', "retry_count" integer NOT NULL DEFAULT 0, "last_error" text, CONSTRAINT "PK_97b00b678a914a6d5897f66b1af" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "export_jobs" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "requested_by" bigint, "export_type" character varying(50) NOT NULL, "filter_json" json, "output_format" character varying(20) NOT NULL DEFAULT 'csv', "file_url" character varying(1024), "status" character varying(30) NOT NULL DEFAULT 'queued', "started_at" TIMESTAMP(6), "completed_at" TIMESTAMP(6), "error_message" text, CONSTRAINT "PK_3044ce6f1c6af24058ee609e063" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "audit_logs" ("created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP(6), "id" BIGSERIAL NOT NULL, "table_name" character varying(100) NOT NULL, "record_id" bigint, "action_type" character varying(20) NOT NULL, "old_value" json, "new_value" json, "performed_by" bigint, "ip_address" character varying(45), "request_id" character varying(100), "user_agent" character varying(500), CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "filter_options" ADD CONSTRAINT "FK_2404be1d79aed393c030f0e9f1d" FOREIGN KEY ("filter_category_id") REFERENCES "filter_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_cd9740f36970d326b3f65bd5e99" FOREIGN KEY ("user_type_id") REFERENCES "user_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_a39ec5232a0d1688c2a3e6f5384" FOREIGN KEY ("user_status_id") REFERENCES "user_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" ADD CONSTRAINT "FK_cf2856e57eca114bf74b407a52b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" ADD CONSTRAINT "FK_255620ece826fc09b39f43b8e64" FOREIGN KEY ("trade_id") REFERENCES "trades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" ADD CONSTRAINT "FK_33330eaddc2a93fe74aa67b4bf6" FOREIGN KEY ("invited_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" ADD CONSTRAINT "FK_e31b15802cc31a49fef85a70892" FOREIGN KEY ("invitation_status_id") REFERENCES "invitation_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" ADD CONSTRAINT "FK_a8b96bc9423ba7ea8980f80db12" FOREIGN KEY ("invited_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sites" ADD CONSTRAINT "FK_cdf645acc906b2b656e0d0e9cd4" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_users" ADD CONSTRAINT "FK_45e5425896560ee2a6215d6b792" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_users" ADD CONSTRAINT "FK_154abed78cef3e3de4d2c810806" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_locations" ADD CONSTRAINT "FK_22cad8a9faad22cf93c6273a480" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_e28288969fa7827bd12680cfe10" FOREIGN KEY ("status_id") REFERENCES "task_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_5d1c8f7898b5b84ad5ce08fcff8" FOREIGN KEY ("priority_id") REFERENCES "task_priorities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_8c7bf11e91f04626bf2480740af" FOREIGN KEY ("level_id") REFERENCES "levels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_5d63435bac76965b4c494297818" FOREIGN KEY ("trade_id") REFERENCES "trades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_e19820760cd36e8fa8ae3d0abc4" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_932b7ae90148e482bc27b0a6d65" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_27821ee30aa99daef697f21322c" FOREIGN KEY ("assigned_to_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD CONSTRAINT "FK_b389f4488d0a8241c3c98273966" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD CONSTRAINT "FK_39a15aff15e1769550086a88833" FOREIGN KEY ("assignee_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD CONSTRAINT "FK_5187c441a70fe34f1b99c1d062d" FOREIGN KEY ("assigned_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD CONSTRAINT "FK_8c702d673e60fd12524378914c9" FOREIGN KEY ("assignment_status_id") REFERENCES "assignment_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" ADD CONSTRAINT "FK_62e5ddfe585b224f0b6a9050381" FOREIGN KEY ("assignment_id") REFERENCES "task_assignments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" ADD CONSTRAINT "FK_f6a966267aa901f8a801bec2cc2" FOREIGN KEY ("response_status_id") REFERENCES "assignment_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" ADD CONSTRAINT "FK_f907c466f1ca746d84e0ed6d00e" FOREIGN KEY ("responded_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" ADD CONSTRAINT "FK_3967800678c1fa2c32358f76580" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" ADD CONSTRAINT "FK_dfd1ac6c5426bc3b2821f559d5e" FOREIGN KEY ("completed_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" ADD CONSTRAINT "FK_635ffa466cde34205e6c06cb0c1" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" ADD CONSTRAINT "FK_e8fd502859c9178489f01b94d38" FOREIGN KEY ("filter_option_id") REFERENCES "filter_options"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_comments" ADD CONSTRAINT "FK_ba9e465cfc707006e60aae59946" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" ADD CONSTRAINT "FK_e733285140c013322a9ae1be644" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" ADD CONSTRAINT "FK_e62fd181b97caa6b150b09220b1" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" ADD CONSTRAINT "FK_e25812e3fd9b3f3edf11b2c5d58" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_templates" ADD CONSTRAINT "FK_efed5f502d6e263cffb79e4ad04" FOREIGN KEY ("channel_id") REFERENCES "notification_channels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_d9b273840b515b44729879b44fd" FOREIGN KEY ("channel_id") REFERENCES "notification_channels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_e37d0438b1fffd0f210df30b271" FOREIGN KEY ("template_id") REFERENCES "notification_templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" ADD CONSTRAINT "FK_91a7ffebe8b406c4470845d4781" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_setting_channels" ADD CONSTRAINT "FK_b9a96e655b664cd3d8569debf89" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_setting_channels" ADD CONSTRAINT "FK_7417c717507c84dfb3b589d39fd" FOREIGN KEY ("channel_id") REFERENCES "notification_channels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_tokens" ADD CONSTRAINT "FK_0fdbbe2123d6d62dfa270ea8947" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_tokens" ADD CONSTRAINT "FK_acf97e5589ff1ed40a193c88245" FOREIGN KEY ("channel_id") REFERENCES "notification_channels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ADD CONSTRAINT "FK_5e8f0ad52cb1b3333272b5dbf2e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ADD CONSTRAINT "FK_ab6827111bc911f54289967dcf0" FOREIGN KEY ("channel_id") REFERENCES "notification_channels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ADD CONSTRAINT "FK_696a818dce7d62e7ca6d975118f" FOREIGN KEY ("template_id") REFERENCES "notification_templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" ADD CONSTRAINT "FK_c2ebd7cc75091c58fc810a2e31b" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" ADD CONSTRAINT "FK_984d28b1c119b3c8701e5de043c" FOREIGN KEY ("scheduled_notification_id") REFERENCES "scheduled_notifications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" ADD CONSTRAINT "FK_f803d5e1bd85942b24ee4248701" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" ADD CONSTRAINT "FK_e155b1cac7e70c60b8b1f081c33" FOREIGN KEY ("device_token_id") REFERENCES "user_device_tokens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" ADD CONSTRAINT "FK_6df9056928ccd41698e402ac719" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" ADD CONSTRAINT "FK_e8e98eac2d517d7512c7d66a6e4" FOREIGN KEY ("device_token_id") REFERENCES "user_device_tokens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sync_logs" ADD CONSTRAINT "FK_99a21b310e8c2bb9f95c6991022" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_ae97aac6d6d471b9d88cea1c971" FOREIGN KEY ("performed_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_ae97aac6d6d471b9d88cea1c971"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sync_logs" DROP CONSTRAINT "FK_99a21b310e8c2bb9f95c6991022"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" DROP CONSTRAINT "FK_e8e98eac2d517d7512c7d66a6e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" DROP CONSTRAINT "FK_6df9056928ccd41698e402ac719"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" DROP CONSTRAINT "FK_e155b1cac7e70c60b8b1f081c33"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" DROP CONSTRAINT "FK_f803d5e1bd85942b24ee4248701"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" DROP CONSTRAINT "FK_984d28b1c119b3c8701e5de043c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" DROP CONSTRAINT "FK_c2ebd7cc75091c58fc810a2e31b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" DROP CONSTRAINT "FK_696a818dce7d62e7ca6d975118f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" DROP CONSTRAINT "FK_ab6827111bc911f54289967dcf0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" DROP CONSTRAINT "FK_5e8f0ad52cb1b3333272b5dbf2e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_tokens" DROP CONSTRAINT "FK_acf97e5589ff1ed40a193c88245"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_tokens" DROP CONSTRAINT "FK_0fdbbe2123d6d62dfa270ea8947"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_setting_channels" DROP CONSTRAINT "FK_7417c717507c84dfb3b589d39fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_setting_channels" DROP CONSTRAINT "FK_b9a96e655b664cd3d8569debf89"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" DROP CONSTRAINT "FK_91a7ffebe8b406c4470845d4781"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_e37d0438b1fffd0f210df30b271"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_d9b273840b515b44729879b44fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_templates" DROP CONSTRAINT "FK_efed5f502d6e263cffb79e4ad04"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" DROP CONSTRAINT "FK_e25812e3fd9b3f3edf11b2c5d58"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" DROP CONSTRAINT "FK_e62fd181b97caa6b150b09220b1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" DROP CONSTRAINT "FK_e733285140c013322a9ae1be644"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_comments" DROP CONSTRAINT "FK_ba9e465cfc707006e60aae59946"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" DROP CONSTRAINT "FK_e8fd502859c9178489f01b94d38"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" DROP CONSTRAINT "FK_635ffa466cde34205e6c06cb0c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" DROP CONSTRAINT "FK_dfd1ac6c5426bc3b2821f559d5e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" DROP CONSTRAINT "FK_3967800678c1fa2c32358f76580"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" DROP CONSTRAINT "FK_f907c466f1ca746d84e0ed6d00e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" DROP CONSTRAINT "FK_f6a966267aa901f8a801bec2cc2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" DROP CONSTRAINT "FK_62e5ddfe585b224f0b6a9050381"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP CONSTRAINT "FK_8c702d673e60fd12524378914c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP CONSTRAINT "FK_5187c441a70fe34f1b99c1d062d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP CONSTRAINT "FK_39a15aff15e1769550086a88833"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP CONSTRAINT "FK_b389f4488d0a8241c3c98273966"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_27821ee30aa99daef697f21322c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_932b7ae90148e482bc27b0a6d65"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_e19820760cd36e8fa8ae3d0abc4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_5d63435bac76965b4c494297818"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_8c7bf11e91f04626bf2480740af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_5d1c8f7898b5b84ad5ce08fcff8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_e28288969fa7827bd12680cfe10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_locations" DROP CONSTRAINT "FK_22cad8a9faad22cf93c6273a480"`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_users" DROP CONSTRAINT "FK_154abed78cef3e3de4d2c810806"`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_users" DROP CONSTRAINT "FK_45e5425896560ee2a6215d6b792"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sites" DROP CONSTRAINT "FK_cdf645acc906b2b656e0d0e9cd4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" DROP CONSTRAINT "FK_a8b96bc9423ba7ea8980f80db12"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" DROP CONSTRAINT "FK_e31b15802cc31a49fef85a70892"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" DROP CONSTRAINT "FK_33330eaddc2a93fe74aa67b4bf6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" DROP CONSTRAINT "FK_255620ece826fc09b39f43b8e64"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" DROP CONSTRAINT "FK_cf2856e57eca114bf74b407a52b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_a39ec5232a0d1688c2a3e6f5384"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_cd9740f36970d326b3f65bd5e99"`,
    );
    await queryRunner.query(
      `ALTER TABLE "filter_options" DROP CONSTRAINT "FK_2404be1d79aed393c030f0e9f1d"`,
    );
    await queryRunner.query(`DROP TABLE "audit_logs"`);
    await queryRunner.query(`DROP TABLE "export_jobs"`);
    await queryRunner.query(`DROP TABLE "change_queue"`);
    await queryRunner.query(`DROP TABLE "sync_logs"`);
    await queryRunner.query(`DROP TABLE "device_sync_states"`);
    await queryRunner.query(`DROP TABLE "notification_logs"`);
    await queryRunner.query(`DROP TABLE "scheduled_notifications"`);
    await queryRunner.query(`DROP TABLE "user_device_tokens"`);
    await queryRunner.query(`DROP TABLE "notification_setting_channels"`);
    await queryRunner.query(`DROP TABLE "notification_settings"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TABLE "notification_templates"`);
    await queryRunner.query(`DROP TABLE "notification_channels"`);
    await queryRunner.query(`DROP TABLE "attachments"`);
    await queryRunner.query(`DROP TABLE "task_metrics"`);
    await queryRunner.query(`DROP TABLE "task_history"`);
    await queryRunner.query(`DROP TABLE "task_comments"`);
    await queryRunner.query(`DROP TABLE "task_filter_values"`);
    await queryRunner.query(`DROP TABLE "task_completions"`);
    await queryRunner.query(`DROP TABLE "task_assignment_responses"`);
    await queryRunner.query(`DROP TABLE "task_assignments"`);
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TABLE "site_locations"`);
    await queryRunner.query(`DROP TABLE "site_users"`);
    await queryRunner.query(`DROP TABLE "sites"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TABLE "user_invitations"`);
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(`DROP TABLE "role_permissions"`);
    await queryRunner.query(
      `DROP INDEX "public"."uq_user_trade_profiles_user_id"`,
    );
    await queryRunner.query(`DROP TABLE "user_trade_profiles"`);
    await queryRunner.query(`DROP INDEX "public"."uq_users_email"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "assignment_statuses"`);
    await queryRunner.query(`DROP TABLE "settings"`);
    await queryRunner.query(`DROP TABLE "filter_options"`);
    await queryRunner.query(`DROP TABLE "filter_categories"`);
    await queryRunner.query(`DROP INDEX "public"."uq_permissions_name"`);
    await queryRunner.query(`DROP INDEX "public"."uq_permissions_code"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
    await queryRunner.query(`DROP INDEX "public"."uq_roles_name"`);
    await queryRunner.query(`DROP INDEX "public"."uq_roles_code"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP INDEX "public"."uq_levels_name"`);
    await queryRunner.query(`DROP INDEX "public"."uq_levels_code"`);
    await queryRunner.query(`DROP TABLE "levels"`);
    await queryRunner.query(`DROP INDEX "public"."uq_trades_name"`);
    await queryRunner.query(`DROP INDEX "public"."uq_trades_code"`);
    await queryRunner.query(`DROP TABLE "trades"`);
    await queryRunner.query(
      `DROP INDEX "public"."uq_invitation_statuses_code"`,
    );
    await queryRunner.query(`DROP TABLE "invitation_statuses"`);
    await queryRunner.query(`DROP INDEX "public"."uq_task_priorities_name"`);
    await queryRunner.query(`DROP INDEX "public"."uq_task_priorities_code"`);
    await queryRunner.query(`DROP TABLE "task_priorities"`);
    await queryRunner.query(`DROP INDEX "public"."uq_task_statuses_code"`);
    await queryRunner.query(`DROP TABLE "task_statuses"`);
    await queryRunner.query(`DROP INDEX "public"."uq_user_statuses_code"`);
    await queryRunner.query(`DROP TABLE "user_statuses"`);
    await queryRunner.query(`DROP INDEX "public"."uq_user_types_name"`);
    await queryRunner.query(`DROP INDEX "public"."uq_user_types_code"`);
    await queryRunner.query(`DROP TABLE "user_types"`);
  }
}
