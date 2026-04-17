import { MigrationInterface, QueryRunner } from 'typeorm';

export class UuidPrimaryKeys1775120684340 implements MigrationInterface {
  name = 'UuidPrimaryKeys1775120684340';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_cd9740f36970d326b3f65bd5e99"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_types" DROP CONSTRAINT "PK_3f05efd7b52a7eca1f6b6f75e45"`,
    );
    await queryRunner.query(`ALTER TABLE "user_types" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "user_types" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_types" ADD CONSTRAINT "PK_3f05efd7b52a7eca1f6b6f75e45" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_a39ec5232a0d1688c2a3e6f5384"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_statuses" DROP CONSTRAINT "PK_50cc8fb0f4810b2f3bfcef7a788"`,
    );
    await queryRunner.query(`ALTER TABLE "user_statuses" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "user_statuses" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_statuses" ADD CONSTRAINT "PK_50cc8fb0f4810b2f3bfcef7a788" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_e28288969fa7827bd12680cfe10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_statuses" DROP CONSTRAINT "PK_28fe920c04b1baa795d82773739"`,
    );
    await queryRunner.query(`ALTER TABLE "task_statuses" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "task_statuses" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_statuses" ADD CONSTRAINT "PK_28fe920c04b1baa795d82773739" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_5d1c8f7898b5b84ad5ce08fcff8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_priorities" DROP CONSTRAINT "PK_aa148974939142ee75716ee34e3"`,
    );
    await queryRunner.query(`ALTER TABLE "task_priorities" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "task_priorities" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_priorities" ADD CONSTRAINT "PK_aa148974939142ee75716ee34e3" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_priorities" ALTER COLUMN "sort_order" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" DROP CONSTRAINT "FK_e31b15802cc31a49fef85a70892"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation_statuses" DROP CONSTRAINT "PK_8d24ae7deedcc8e08a6c4ef9bcb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation_statuses" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation_statuses" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation_statuses" ADD CONSTRAINT "PK_8d24ae7deedcc8e08a6c4ef9bcb" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" DROP CONSTRAINT "FK_255620ece826fc09b39f43b8e64"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_5d63435bac76965b4c494297818"`,
    );
    await queryRunner.query(
      `ALTER TABLE "trades" DROP CONSTRAINT "PK_c6d7c36a837411ba5194dc58595"`,
    );
    await queryRunner.query(`ALTER TABLE "trades" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "trades" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "trades" ADD CONSTRAINT "PK_c6d7c36a837411ba5194dc58595" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "trades" ALTER COLUMN "sort_order" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_8c7bf11e91f04626bf2480740af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "levels" DROP CONSTRAINT "PK_05f8dd8f715793c64d49e3f1901"`,
    );
    await queryRunner.query(`ALTER TABLE "levels" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "levels" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "levels" ADD CONSTRAINT "PK_05f8dd8f715793c64d49e3f1901" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "levels" ALTER COLUMN "sort_order" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "PK_c1433d71a4838793a49dcad46ab"`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP CONSTRAINT "PK_920331560282b8bd21bb02290df"`,
    );
    await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "filter_options" DROP CONSTRAINT "FK_2404be1d79aed393c030f0e9f1d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "filter_categories" DROP CONSTRAINT "PK_0d1dd9dbac2f7dce061bd587194"`,
    );
    await queryRunner.query(`ALTER TABLE "filter_categories" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "filter_categories" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "filter_categories" ADD CONSTRAINT "PK_0d1dd9dbac2f7dce061bd587194" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" DROP CONSTRAINT "FK_e8fd502859c9178489f01b94d38"`,
    );
    await queryRunner.query(
      `ALTER TABLE "filter_options" DROP CONSTRAINT "PK_52011249a500b5325bf0af717a6"`,
    );
    await queryRunner.query(`ALTER TABLE "filter_options" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "filter_options" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "filter_options" ADD CONSTRAINT "PK_52011249a500b5325bf0af717a6" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "filter_options" DROP COLUMN "filter_category_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "filter_options" ADD "filter_category_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "filter_options" ALTER COLUMN "sort_order" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP CONSTRAINT "PK_0669fe20e252eb692bf4d344975"`,
    );
    await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "scope_id"`);
    await queryRunner.query(`ALTER TABLE "settings" ADD "scope_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP CONSTRAINT "FK_8c702d673e60fd12524378914c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" DROP CONSTRAINT "FK_f6a966267aa901f8a801bec2cc2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_statuses" DROP CONSTRAINT "PK_ef1e5bc74326b923d9902599aeb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_statuses" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_statuses" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_statuses" ADD CONSTRAINT "PK_ef1e5bc74326b923d9902599aeb" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" DROP CONSTRAINT "FK_cf2856e57eca114bf74b407a52b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" DROP CONSTRAINT "FK_a8b96bc9423ba7ea8980f80db12"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" DROP CONSTRAINT "FK_33330eaddc2a93fe74aa67b4bf6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_users" DROP CONSTRAINT "FK_154abed78cef3e3de4d2c810806"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_27821ee30aa99daef697f21322c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_932b7ae90148e482bc27b0a6d65"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP CONSTRAINT "FK_5187c441a70fe34f1b99c1d062d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP CONSTRAINT "FK_39a15aff15e1769550086a88833"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" DROP CONSTRAINT "FK_f907c466f1ca746d84e0ed6d00e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" DROP CONSTRAINT "FK_dfd1ac6c5426bc3b2821f559d5e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" DROP CONSTRAINT "FK_e25812e3fd9b3f3edf11b2c5d58"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" DROP CONSTRAINT "FK_91a7ffebe8b406c4470845d4781"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_setting_channels" DROP CONSTRAINT "FK_b9a96e655b664cd3d8569debf89"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_tokens" DROP CONSTRAINT "FK_0fdbbe2123d6d62dfa270ea8947"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" DROP CONSTRAINT "FK_5e8f0ad52cb1b3333272b5dbf2e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" DROP CONSTRAINT "FK_f803d5e1bd85942b24ee4248701"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" DROP CONSTRAINT "FK_6df9056928ccd41698e402ac719"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sync_logs" DROP CONSTRAINT "FK_99a21b310e8c2bb9f95c6991022"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_ae97aac6d6d471b9d88cea1c971"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "user_type_id"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "user_type_id" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "user_status_id"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "user_status_id" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_by"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "created_by" uuid`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_by"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "updated_by" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" DROP CONSTRAINT "PK_faf2f822f60dc26f6731d374239"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" ADD CONSTRAINT "PK_faf2f822f60dc26f6731d374239" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."uq_user_trade_profiles_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" DROP CONSTRAINT "REL_cf2856e57eca114bf74b407a52"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" ADD "user_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" ADD CONSTRAINT "UQ_cf2856e57eca114bf74b407a52b" UNIQUE ("user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" DROP COLUMN "trade_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" ADD "trade_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "PK_84059017c90bfcb701b8fa42297"`,
    );
    await queryRunner.query(`ALTER TABLE "role_permissions" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "PK_84059017c90bfcb701b8fa42297" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP COLUMN "role_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD "role_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP COLUMN "permission_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD "permission_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "PK_8acd5cf26ebd158416f477de799"`,
    );
    await queryRunner.query(`ALTER TABLE "user_roles" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "user_roles" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD "user_id" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user_roles" DROP COLUMN "role_id"`);
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD "role_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(`ALTER TABLE "user_roles" ADD "created_by" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(`ALTER TABLE "user_roles" ADD "updated_by" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user_invitations" DROP CONSTRAINT "PK_c8005acb91c3ce9a7ae581eca8f"`,
    );
    await queryRunner.query(`ALTER TABLE "user_invitations" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "user_invitations" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" ADD CONSTRAINT "PK_c8005acb91c3ce9a7ae581eca8f" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" DROP COLUMN "invited_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" ADD "invited_user_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" DROP COLUMN "invitation_status_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" ADD "invitation_status_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" DROP COLUMN "invited_by_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" ADD "invited_by_user_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" ADD "created_by" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" ADD "updated_by" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "sites" DROP CONSTRAINT "FK_cdf645acc906b2b656e0d0e9cd4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" DROP CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50"`,
    );
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "projects" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "created_by"`);
    await queryRunner.query(`ALTER TABLE "projects" ADD "created_by" uuid`);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "updated_by"`);
    await queryRunner.query(`ALTER TABLE "projects" ADD "updated_by" uuid`);
    await queryRunner.query(
      `ALTER TABLE "site_users" DROP CONSTRAINT "FK_45e5425896560ee2a6215d6b792"`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_locations" DROP CONSTRAINT "FK_22cad8a9faad22cf93c6273a480"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_e19820760cd36e8fa8ae3d0abc4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sites" DROP CONSTRAINT "PK_4f5eccb1dfde10c9170502595a7"`,
    );
    await queryRunner.query(`ALTER TABLE "sites" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "sites" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "sites" ADD CONSTRAINT "PK_4f5eccb1dfde10c9170502595a7" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "sites" DROP COLUMN "project_id"`);
    await queryRunner.query(
      `ALTER TABLE "sites" ADD "project_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_users" DROP CONSTRAINT "PK_99142b6b031a091da1ad5cb1ac0"`,
    );
    await queryRunner.query(`ALTER TABLE "site_users" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "site_users" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_users" ADD CONSTRAINT "PK_99142b6b031a091da1ad5cb1ac0" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "site_users" DROP COLUMN "site_id"`);
    await queryRunner.query(
      `ALTER TABLE "site_users" ADD "site_id" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "site_users" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "site_users" ADD "user_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_locations" DROP CONSTRAINT "PK_51a9b6efc00dc1cf4419ecee2b3"`,
    );
    await queryRunner.query(`ALTER TABLE "site_locations" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "site_locations" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_locations" ADD CONSTRAINT "PK_51a9b6efc00dc1cf4419ecee2b3" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_locations" DROP COLUMN "site_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_locations" ADD "site_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_locations" ALTER COLUMN "allowed_radius_meters" SET DEFAULT 150`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP CONSTRAINT "FK_b389f4488d0a8241c3c98273966"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" DROP CONSTRAINT "FK_3967800678c1fa2c32358f76580"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" DROP CONSTRAINT "FK_635ffa466cde34205e6c06cb0c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_comments" DROP CONSTRAINT "FK_ba9e465cfc707006e60aae59946"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" DROP CONSTRAINT "FK_e733285140c013322a9ae1be644"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" DROP CONSTRAINT "FK_e62fd181b97caa6b150b09220b1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772"`,
    );
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "status_id"`);
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "status_id" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "priority_id"`);
    await queryRunner.query(`ALTER TABLE "tasks" ADD "priority_id" uuid`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "level_id"`);
    await queryRunner.query(`ALTER TABLE "tasks" ADD "level_id" uuid`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "trade_id"`);
    await queryRunner.query(`ALTER TABLE "tasks" ADD "trade_id" uuid`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "project_id"`);
    await queryRunner.query(`ALTER TABLE "tasks" ADD "project_id" uuid`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "site_id"`);
    await queryRunner.query(`ALTER TABLE "tasks" ADD "site_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP COLUMN "created_by_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "created_by_user_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP COLUMN "assigned_to_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "assigned_to_user_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ALTER COLUMN "days_open" SET DEFAULT 0`,
    );
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "created_by"`);
    await queryRunner.query(`ALTER TABLE "tasks" ADD "created_by" uuid`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "updated_by"`);
    await queryRunner.query(`ALTER TABLE "tasks" ADD "updated_by" uuid`);
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" DROP CONSTRAINT "FK_62e5ddfe585b224f0b6a9050381"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP CONSTRAINT "PK_b68f42cf36d807d8a19a96066d7"`,
    );
    await queryRunner.query(`ALTER TABLE "task_assignments" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD CONSTRAINT "PK_b68f42cf36d807d8a19a96066d7" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP COLUMN "task_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD "task_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP COLUMN "assignee_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD "assignee_user_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP COLUMN "assigned_by_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD "assigned_by_user_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP COLUMN "assignment_status_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD "assignment_status_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD "created_by" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD "updated_by" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" DROP CONSTRAINT "PK_0c2e53f87233b35e363a66d8c86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" ADD CONSTRAINT "PK_0c2e53f87233b35e363a66d8c86" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" DROP COLUMN "assignment_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" ADD "assignment_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" DROP COLUMN "response_status_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" ADD "response_status_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" DROP COLUMN "responded_by_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" ADD "responded_by_user_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" ADD "created_by" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" ADD "updated_by" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" DROP CONSTRAINT "PK_c9c25215a82514668ab1d72a04d"`,
    );
    await queryRunner.query(`ALTER TABLE "task_completions" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "task_completions" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" ADD CONSTRAINT "PK_c9c25215a82514668ab1d72a04d" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" DROP CONSTRAINT "REL_3967800678c1fa2c32358f7658"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" DROP COLUMN "task_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" ADD "task_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" ADD CONSTRAINT "UQ_3967800678c1fa2c32358f76580" UNIQUE ("task_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" DROP COLUMN "completed_by_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" ADD "completed_by_user_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" ADD "created_by" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" ADD "updated_by" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" DROP CONSTRAINT "PK_2f857f78904f1bb7411f9f68975"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" ADD CONSTRAINT "PK_2f857f78904f1bb7411f9f68975" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" DROP COLUMN "task_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" ADD "task_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" DROP COLUMN "filter_option_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" ADD "filter_option_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" ADD "created_by" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" ADD "updated_by" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_comments" DROP CONSTRAINT "PK_83b99b0b03db29d4cafcb579b77"`,
    );
    await queryRunner.query(`ALTER TABLE "task_comments" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "task_comments" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_comments" ADD CONSTRAINT "PK_83b99b0b03db29d4cafcb579b77" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_comments" DROP COLUMN "task_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_comments" ADD "task_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_comments" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_comments" ADD "created_by" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_comments" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_comments" ADD "updated_by" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" DROP CONSTRAINT "PK_716670443aea4a2f4a599bb7c53"`,
    );
    await queryRunner.query(`ALTER TABLE "task_history" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "task_history" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" ADD CONSTRAINT "PK_716670443aea4a2f4a599bb7c53" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "task_history" DROP COLUMN "task_id"`);
    await queryRunner.query(
      `ALTER TABLE "task_history" ADD "task_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" DROP COLUMN "old_status_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" ADD "old_status_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" DROP COLUMN "new_status_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" ADD "new_status_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" DROP COLUMN "old_assignee_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" ADD "old_assignee_user_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" DROP COLUMN "new_assignee_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" ADD "new_assignee_user_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" DROP COLUMN "changed_by"`,
    );
    await queryRunner.query(`ALTER TABLE "task_history" ADD "changed_by" uuid`);
    await queryRunner.query(
      `ALTER TABLE "task_history" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(`ALTER TABLE "task_history" ADD "created_by" uuid`);
    await queryRunner.query(
      `ALTER TABLE "task_history" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(`ALTER TABLE "task_history" ADD "updated_by" uuid`);
    await queryRunner.query(
      `ALTER TABLE "task_metrics" DROP CONSTRAINT "PK_de4c7c796c8f094b394e67381b8"`,
    );
    await queryRunner.query(`ALTER TABLE "task_metrics" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "task_metrics" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_metrics" ADD CONSTRAINT "PK_de4c7c796c8f094b394e67381b8" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_metrics" DROP COLUMN "project_id"`,
    );
    await queryRunner.query(`ALTER TABLE "task_metrics" ADD "project_id" uuid`);
    await queryRunner.query(`ALTER TABLE "task_metrics" DROP COLUMN "site_id"`);
    await queryRunner.query(`ALTER TABLE "task_metrics" ADD "site_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "task_metrics" DROP COLUMN "trade_id"`,
    );
    await queryRunner.query(`ALTER TABLE "task_metrics" ADD "trade_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "task_metrics" DROP COLUMN "level_id"`,
    );
    await queryRunner.query(`ALTER TABLE "task_metrics" ADD "level_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "task_metrics" ALTER COLUMN "open_count" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_metrics" ALTER COLUMN "completed_count" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_metrics" ALTER COLUMN "overdue_count" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" DROP CONSTRAINT "PK_5e1f050bcff31e3084a1d662412"`,
    );
    await queryRunner.query(`ALTER TABLE "attachments" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "attachments" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" ADD CONSTRAINT "PK_5e1f050bcff31e3084a1d662412" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" DROP COLUMN "entity_id"`,
    );
    await queryRunner.query(`ALTER TABLE "attachments" ADD "entity_id" uuid`);
    await queryRunner.query(`ALTER TABLE "attachments" DROP COLUMN "task_id"`);
    await queryRunner.query(`ALTER TABLE "attachments" ADD "task_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "attachments" DROP COLUMN "uploaded_by"`,
    );
    await queryRunner.query(`ALTER TABLE "attachments" ADD "uploaded_by" uuid`);
    await queryRunner.query(
      `ALTER TABLE "attachments" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(`ALTER TABLE "attachments" ADD "created_by" uuid`);
    await queryRunner.query(
      `ALTER TABLE "attachments" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(`ALTER TABLE "attachments" ADD "updated_by" uuid`);
    await queryRunner.query(
      `ALTER TABLE "notification_templates" DROP CONSTRAINT "FK_efed5f502d6e263cffb79e4ad04"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_d9b273840b515b44729879b44fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_setting_channels" DROP CONSTRAINT "FK_7417c717507c84dfb3b589d39fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_tokens" DROP CONSTRAINT "FK_acf97e5589ff1ed40a193c88245"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" DROP CONSTRAINT "FK_ab6827111bc911f54289967dcf0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_channels" DROP CONSTRAINT "PK_3bc0cb5b60e8659f5fc859b2af0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_channels" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_channels" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_channels" ADD CONSTRAINT "PK_3bc0cb5b60e8659f5fc859b2af0" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_e37d0438b1fffd0f210df30b271"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" DROP CONSTRAINT "FK_696a818dce7d62e7ca6d975118f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_templates" DROP CONSTRAINT "PK_76f0fc48b8d057d2ae7f3a2848a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_templates" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_templates" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_templates" ADD CONSTRAINT "PK_76f0fc48b8d057d2ae7f3a2848a" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_templates" DROP COLUMN "channel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_templates" ADD "channel_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" DROP CONSTRAINT "FK_c2ebd7cc75091c58fc810a2e31b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a"`,
    );
    await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "user_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "channel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "channel_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "template_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "template_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "entity_id"`,
    );
    await queryRunner.query(`ALTER TABLE "notifications" ADD "entity_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "notification_settings" DROP CONSTRAINT "PK_d131abd7996c475ef768d4559ba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" ADD CONSTRAINT "PK_d131abd7996c475ef768d4559ba" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" DROP CONSTRAINT "REL_91a7ffebe8b406c4470845d478"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" ADD "user_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" ADD CONSTRAINT "UQ_91a7ffebe8b406c4470845d4781" UNIQUE ("user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_setting_channels" DROP CONSTRAINT "PK_cf0a27a072a1697caf5b39636ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_setting_channels" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_setting_channels" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_setting_channels" ADD CONSTRAINT "PK_cf0a27a072a1697caf5b39636ef" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_setting_channels" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_setting_channels" ADD "user_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_setting_channels" DROP COLUMN "channel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_setting_channels" ADD "channel_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" DROP CONSTRAINT "FK_e155b1cac7e70c60b8b1f081c33"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" DROP CONSTRAINT "FK_e8e98eac2d517d7512c7d66a6e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_tokens" DROP CONSTRAINT "PK_089ca63b045947b89c77b06a79d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_tokens" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_tokens" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_tokens" ADD CONSTRAINT "PK_089ca63b045947b89c77b06a79d" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_tokens" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_tokens" ADD "user_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_tokens" DROP COLUMN "channel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_tokens" ADD "channel_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" DROP CONSTRAINT "FK_984d28b1c119b3c8701e5de043c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" DROP CONSTRAINT "PK_9eb8b287229934bbd076a5d64f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ADD CONSTRAINT "PK_9eb8b287229934bbd076a5d64f7" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ADD "user_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" DROP COLUMN "channel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ADD "channel_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" DROP COLUMN "template_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ADD "template_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" DROP COLUMN "entity_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ADD "entity_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" DROP CONSTRAINT "PK_19c524e644cdeaebfcffc284871"`,
    );
    await queryRunner.query(`ALTER TABLE "notification_logs" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "notification_logs" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" ADD CONSTRAINT "PK_19c524e644cdeaebfcffc284871" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" DROP COLUMN "notification_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" ADD "notification_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" DROP COLUMN "scheduled_notification_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" ADD "scheduled_notification_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" ADD "user_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" DROP COLUMN "channel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" ADD "channel_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" DROP COLUMN "device_token_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" ADD "device_token_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" DROP CONSTRAINT "PK_eb2fb890b31a242246630c5cf37"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" ADD CONSTRAINT "PK_eb2fb890b31a242246630c5cf37" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" ADD "user_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" DROP COLUMN "device_token_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" ADD "device_token_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" DROP COLUMN "last_server_change_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" ADD "last_server_change_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "sync_logs" DROP CONSTRAINT "PK_f441fe15484e077c80ddec89336"`,
    );
    await queryRunner.query(`ALTER TABLE "sync_logs" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "sync_logs" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "sync_logs" ADD CONSTRAINT "PK_f441fe15484e077c80ddec89336" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "sync_logs" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "sync_logs" ADD "user_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sync_logs" DROP COLUMN "device_token_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sync_logs" ADD "device_token_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "sync_logs" ALTER COLUMN "records_processed" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_queue" DROP CONSTRAINT "PK_97b00b678a914a6d5897f66b1af"`,
    );
    await queryRunner.query(`ALTER TABLE "change_queue" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "change_queue" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_queue" ADD CONSTRAINT "PK_97b00b678a914a6d5897f66b1af" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_queue" DROP COLUMN "entity_id"`,
    );
    await queryRunner.query(`ALTER TABLE "change_queue" ADD "entity_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "change_queue" DROP COLUMN "changed_by"`,
    );
    await queryRunner.query(`ALTER TABLE "change_queue" ADD "changed_by" uuid`);
    await queryRunner.query(
      `ALTER TABLE "change_queue" ALTER COLUMN "retry_count" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "export_jobs" DROP CONSTRAINT "PK_3044ce6f1c6af24058ee609e063"`,
    );
    await queryRunner.query(`ALTER TABLE "export_jobs" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "export_jobs" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "export_jobs" ADD CONSTRAINT "PK_3044ce6f1c6af24058ee609e063" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "export_jobs" DROP COLUMN "requested_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "export_jobs" ADD "requested_by" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" DROP CONSTRAINT "PK_1bb179d048bbc581caa3b013439"`,
    );
    await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "audit_logs" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" ADD CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "record_id"`);
    await queryRunner.query(`ALTER TABLE "audit_logs" ADD "record_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "audit_logs" DROP COLUMN "performed_by"`,
    );
    await queryRunner.query(`ALTER TABLE "audit_logs" ADD "performed_by" uuid`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_user_trade_profiles_user_id" ON "user_trade_profiles" ("user_id") `,
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
    await queryRunner.query(
      `DROP INDEX "public"."uq_user_trade_profiles_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" DROP COLUMN "performed_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" ADD "performed_by" bigint`,
    );
    await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "record_id"`);
    await queryRunner.query(`ALTER TABLE "audit_logs" ADD "record_id" bigint`);
    await queryRunner.query(
      `ALTER TABLE "audit_logs" DROP CONSTRAINT "PK_1bb179d048bbc581caa3b013439"`,
    );
    await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "audit_logs" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" ADD CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "export_jobs" DROP COLUMN "requested_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "export_jobs" ADD "requested_by" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "export_jobs" DROP CONSTRAINT "PK_3044ce6f1c6af24058ee609e063"`,
    );
    await queryRunner.query(`ALTER TABLE "export_jobs" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "export_jobs" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "export_jobs" ADD CONSTRAINT "PK_3044ce6f1c6af24058ee609e063" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_queue" ALTER COLUMN "retry_count" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_queue" DROP COLUMN "changed_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_queue" ADD "changed_by" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_queue" DROP COLUMN "entity_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_queue" ADD "entity_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_queue" DROP CONSTRAINT "PK_97b00b678a914a6d5897f66b1af"`,
    );
    await queryRunner.query(`ALTER TABLE "change_queue" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "change_queue" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "change_queue" ADD CONSTRAINT "PK_97b00b678a914a6d5897f66b1af" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "sync_logs" ALTER COLUMN "records_processed" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "sync_logs" DROP COLUMN "device_token_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sync_logs" ADD "device_token_id" bigint`,
    );
    await queryRunner.query(`ALTER TABLE "sync_logs" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "sync_logs" ADD "user_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sync_logs" DROP CONSTRAINT "PK_f441fe15484e077c80ddec89336"`,
    );
    await queryRunner.query(`ALTER TABLE "sync_logs" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "sync_logs" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sync_logs" ADD CONSTRAINT "PK_f441fe15484e077c80ddec89336" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" DROP COLUMN "last_server_change_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" ADD "last_server_change_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" DROP COLUMN "device_token_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" ADD "device_token_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" ADD "user_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" DROP CONSTRAINT "PK_eb2fb890b31a242246630c5cf37"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" ADD CONSTRAINT "PK_eb2fb890b31a242246630c5cf37" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" DROP COLUMN "device_token_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" ADD "device_token_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" DROP COLUMN "channel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" ADD "channel_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" ADD "user_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" DROP COLUMN "scheduled_notification_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" ADD "scheduled_notification_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" DROP COLUMN "notification_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" ADD "notification_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" DROP CONSTRAINT "PK_19c524e644cdeaebfcffc284871"`,
    );
    await queryRunner.query(`ALTER TABLE "notification_logs" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "notification_logs" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" ADD CONSTRAINT "PK_19c524e644cdeaebfcffc284871" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" DROP COLUMN "entity_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ADD "entity_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" DROP COLUMN "template_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ADD "template_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" DROP COLUMN "channel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ADD "channel_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ADD "user_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" DROP CONSTRAINT "PK_9eb8b287229934bbd076a5d64f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ADD CONSTRAINT "PK_9eb8b287229934bbd076a5d64f7" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" ADD CONSTRAINT "FK_984d28b1c119b3c8701e5de043c" FOREIGN KEY ("scheduled_notification_id") REFERENCES "scheduled_notifications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_tokens" DROP COLUMN "channel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_tokens" ADD "channel_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_tokens" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_tokens" ADD "user_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_tokens" DROP CONSTRAINT "PK_089ca63b045947b89c77b06a79d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_tokens" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_tokens" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_tokens" ADD CONSTRAINT "PK_089ca63b045947b89c77b06a79d" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" ADD CONSTRAINT "FK_e8e98eac2d517d7512c7d66a6e4" FOREIGN KEY ("device_token_id") REFERENCES "user_device_tokens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" ADD CONSTRAINT "FK_e155b1cac7e70c60b8b1f081c33" FOREIGN KEY ("device_token_id") REFERENCES "user_device_tokens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_setting_channels" DROP COLUMN "channel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_setting_channels" ADD "channel_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_setting_channels" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_setting_channels" ADD "user_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_setting_channels" DROP CONSTRAINT "PK_cf0a27a072a1697caf5b39636ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_setting_channels" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_setting_channels" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_setting_channels" ADD CONSTRAINT "PK_cf0a27a072a1697caf5b39636ef" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" DROP CONSTRAINT "UQ_91a7ffebe8b406c4470845d4781"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" ADD "user_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" ADD CONSTRAINT "REL_91a7ffebe8b406c4470845d478" UNIQUE ("user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" DROP CONSTRAINT "PK_d131abd7996c475ef768d4559ba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" ADD CONSTRAINT "PK_d131abd7996c475ef768d4559ba" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "entity_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "entity_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "template_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "template_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "channel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "channel_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "user_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a"`,
    );
    await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" ADD CONSTRAINT "FK_c2ebd7cc75091c58fc810a2e31b" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_templates" DROP COLUMN "channel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_templates" ADD "channel_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_templates" DROP CONSTRAINT "PK_76f0fc48b8d057d2ae7f3a2848a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_templates" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_templates" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_templates" ADD CONSTRAINT "PK_76f0fc48b8d057d2ae7f3a2848a" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ADD CONSTRAINT "FK_696a818dce7d62e7ca6d975118f" FOREIGN KEY ("template_id") REFERENCES "notification_templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_e37d0438b1fffd0f210df30b271" FOREIGN KEY ("template_id") REFERENCES "notification_templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_channels" DROP CONSTRAINT "PK_3bc0cb5b60e8659f5fc859b2af0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_channels" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_channels" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_channels" ADD CONSTRAINT "PK_3bc0cb5b60e8659f5fc859b2af0" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ADD CONSTRAINT "FK_ab6827111bc911f54289967dcf0" FOREIGN KEY ("channel_id") REFERENCES "notification_channels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_tokens" ADD CONSTRAINT "FK_acf97e5589ff1ed40a193c88245" FOREIGN KEY ("channel_id") REFERENCES "notification_channels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_setting_channels" ADD CONSTRAINT "FK_7417c717507c84dfb3b589d39fd" FOREIGN KEY ("channel_id") REFERENCES "notification_channels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_d9b273840b515b44729879b44fd" FOREIGN KEY ("channel_id") REFERENCES "notification_channels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_templates" ADD CONSTRAINT "FK_efed5f502d6e263cffb79e4ad04" FOREIGN KEY ("channel_id") REFERENCES "notification_channels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" ADD "updated_by" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" ADD "created_by" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" DROP COLUMN "uploaded_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" ADD "uploaded_by" bigint`,
    );
    await queryRunner.query(`ALTER TABLE "attachments" DROP COLUMN "task_id"`);
    await queryRunner.query(`ALTER TABLE "attachments" ADD "task_id" bigint`);
    await queryRunner.query(
      `ALTER TABLE "attachments" DROP COLUMN "entity_id"`,
    );
    await queryRunner.query(`ALTER TABLE "attachments" ADD "entity_id" bigint`);
    await queryRunner.query(
      `ALTER TABLE "attachments" DROP CONSTRAINT "PK_5e1f050bcff31e3084a1d662412"`,
    );
    await queryRunner.query(`ALTER TABLE "attachments" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "attachments" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" ADD CONSTRAINT "PK_5e1f050bcff31e3084a1d662412" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_metrics" ALTER COLUMN "overdue_count" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_metrics" ALTER COLUMN "completed_count" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_metrics" ALTER COLUMN "open_count" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_metrics" DROP COLUMN "level_id"`,
    );
    await queryRunner.query(`ALTER TABLE "task_metrics" ADD "level_id" bigint`);
    await queryRunner.query(
      `ALTER TABLE "task_metrics" DROP COLUMN "trade_id"`,
    );
    await queryRunner.query(`ALTER TABLE "task_metrics" ADD "trade_id" bigint`);
    await queryRunner.query(`ALTER TABLE "task_metrics" DROP COLUMN "site_id"`);
    await queryRunner.query(`ALTER TABLE "task_metrics" ADD "site_id" bigint`);
    await queryRunner.query(
      `ALTER TABLE "task_metrics" DROP COLUMN "project_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_metrics" ADD "project_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_metrics" DROP CONSTRAINT "PK_de4c7c796c8f094b394e67381b8"`,
    );
    await queryRunner.query(`ALTER TABLE "task_metrics" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "task_metrics" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_metrics" ADD CONSTRAINT "PK_de4c7c796c8f094b394e67381b8" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" ADD "updated_by" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" ADD "created_by" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" DROP COLUMN "changed_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" ADD "changed_by" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" DROP COLUMN "new_assignee_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" ADD "new_assignee_user_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" DROP COLUMN "old_assignee_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" ADD "old_assignee_user_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" DROP COLUMN "new_status_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" ADD "new_status_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" DROP COLUMN "old_status_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" ADD "old_status_id" bigint`,
    );
    await queryRunner.query(`ALTER TABLE "task_history" DROP COLUMN "task_id"`);
    await queryRunner.query(
      `ALTER TABLE "task_history" ADD "task_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" DROP CONSTRAINT "PK_716670443aea4a2f4a599bb7c53"`,
    );
    await queryRunner.query(`ALTER TABLE "task_history" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "task_history" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" ADD CONSTRAINT "PK_716670443aea4a2f4a599bb7c53" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_comments" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_comments" ADD "updated_by" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_comments" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_comments" ADD "created_by" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_comments" DROP COLUMN "task_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_comments" ADD "task_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_comments" DROP CONSTRAINT "PK_83b99b0b03db29d4cafcb579b77"`,
    );
    await queryRunner.query(`ALTER TABLE "task_comments" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "task_comments" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_comments" ADD CONSTRAINT "PK_83b99b0b03db29d4cafcb579b77" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" ADD "updated_by" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" ADD "created_by" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" DROP COLUMN "filter_option_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" ADD "filter_option_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" DROP COLUMN "task_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" ADD "task_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" DROP CONSTRAINT "PK_2f857f78904f1bb7411f9f68975"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" ADD CONSTRAINT "PK_2f857f78904f1bb7411f9f68975" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" ADD "updated_by" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" ADD "created_by" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" DROP COLUMN "completed_by_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" ADD "completed_by_user_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" DROP CONSTRAINT "UQ_3967800678c1fa2c32358f76580"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" DROP COLUMN "task_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" ADD "task_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" ADD CONSTRAINT "REL_3967800678c1fa2c32358f7658" UNIQUE ("task_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" DROP CONSTRAINT "PK_c9c25215a82514668ab1d72a04d"`,
    );
    await queryRunner.query(`ALTER TABLE "task_completions" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "task_completions" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" ADD CONSTRAINT "PK_c9c25215a82514668ab1d72a04d" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" ADD "updated_by" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" ADD "created_by" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" DROP COLUMN "responded_by_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" ADD "responded_by_user_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" DROP COLUMN "response_status_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" ADD "response_status_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" DROP COLUMN "assignment_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" ADD "assignment_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" DROP CONSTRAINT "PK_0c2e53f87233b35e363a66d8c86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" ADD CONSTRAINT "PK_0c2e53f87233b35e363a66d8c86" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD "updated_by" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD "created_by" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP COLUMN "assignment_status_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD "assignment_status_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP COLUMN "assigned_by_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD "assigned_by_user_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP COLUMN "assignee_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD "assignee_user_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP COLUMN "task_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD "task_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP CONSTRAINT "PK_b68f42cf36d807d8a19a96066d7"`,
    );
    await queryRunner.query(`ALTER TABLE "task_assignments" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD CONSTRAINT "PK_b68f42cf36d807d8a19a96066d7" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" ADD CONSTRAINT "FK_62e5ddfe585b224f0b6a9050381" FOREIGN KEY ("assignment_id") REFERENCES "task_assignments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "updated_by"`);
    await queryRunner.query(`ALTER TABLE "tasks" ADD "updated_by" bigint`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "created_by"`);
    await queryRunner.query(`ALTER TABLE "tasks" ADD "created_by" bigint`);
    await queryRunner.query(
      `ALTER TABLE "tasks" ALTER COLUMN "days_open" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP COLUMN "assigned_to_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "assigned_to_user_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP COLUMN "created_by_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "created_by_user_id" bigint`,
    );
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "site_id"`);
    await queryRunner.query(`ALTER TABLE "tasks" ADD "site_id" bigint`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "project_id"`);
    await queryRunner.query(`ALTER TABLE "tasks" ADD "project_id" bigint`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "trade_id"`);
    await queryRunner.query(`ALTER TABLE "tasks" ADD "trade_id" bigint`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "level_id"`);
    await queryRunner.query(`ALTER TABLE "tasks" ADD "level_id" bigint`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "priority_id"`);
    await queryRunner.query(`ALTER TABLE "tasks" ADD "priority_id" bigint`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "status_id"`);
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "status_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772"`,
    );
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "tasks" ADD "id" BIGSERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" ADD CONSTRAINT "FK_e62fd181b97caa6b150b09220b1" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_history" ADD CONSTRAINT "FK_e733285140c013322a9ae1be644" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_comments" ADD CONSTRAINT "FK_ba9e465cfc707006e60aae59946" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" ADD CONSTRAINT "FK_635ffa466cde34205e6c06cb0c1" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" ADD CONSTRAINT "FK_3967800678c1fa2c32358f76580" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD CONSTRAINT "FK_b389f4488d0a8241c3c98273966" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_locations" ALTER COLUMN "allowed_radius_meters" SET DEFAULT '150'`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_locations" DROP COLUMN "site_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_locations" ADD "site_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_locations" DROP CONSTRAINT "PK_51a9b6efc00dc1cf4419ecee2b3"`,
    );
    await queryRunner.query(`ALTER TABLE "site_locations" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "site_locations" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_locations" ADD CONSTRAINT "PK_51a9b6efc00dc1cf4419ecee2b3" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "site_users" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "site_users" ADD "user_id" bigint NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "site_users" DROP COLUMN "site_id"`);
    await queryRunner.query(
      `ALTER TABLE "site_users" ADD "site_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_users" DROP CONSTRAINT "PK_99142b6b031a091da1ad5cb1ac0"`,
    );
    await queryRunner.query(`ALTER TABLE "site_users" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "site_users" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_users" ADD CONSTRAINT "PK_99142b6b031a091da1ad5cb1ac0" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "sites" DROP COLUMN "project_id"`);
    await queryRunner.query(
      `ALTER TABLE "sites" ADD "project_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sites" DROP CONSTRAINT "PK_4f5eccb1dfde10c9170502595a7"`,
    );
    await queryRunner.query(`ALTER TABLE "sites" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "sites" ADD "id" BIGSERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "sites" ADD CONSTRAINT "PK_4f5eccb1dfde10c9170502595a7" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_e19820760cd36e8fa8ae3d0abc4" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_locations" ADD CONSTRAINT "FK_22cad8a9faad22cf93c6273a480" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_users" ADD CONSTRAINT "FK_45e5425896560ee2a6215d6b792" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "updated_by"`);
    await queryRunner.query(`ALTER TABLE "projects" ADD "updated_by" bigint`);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "created_by"`);
    await queryRunner.query(`ALTER TABLE "projects" ADD "created_by" bigint`);
    await queryRunner.query(
      `ALTER TABLE "projects" DROP CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50"`,
    );
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "projects" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sites" ADD CONSTRAINT "FK_cdf645acc906b2b656e0d0e9cd4" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" ADD "updated_by" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" ADD "created_by" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" DROP COLUMN "invited_by_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" ADD "invited_by_user_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" DROP COLUMN "invitation_status_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" ADD "invitation_status_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" DROP COLUMN "invited_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" ADD "invited_user_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" DROP CONSTRAINT "PK_c8005acb91c3ce9a7ae581eca8f"`,
    );
    await queryRunner.query(`ALTER TABLE "user_invitations" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "user_invitations" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" ADD CONSTRAINT "PK_c8005acb91c3ce9a7ae581eca8f" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(`ALTER TABLE "user_roles" ADD "updated_by" bigint`);
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(`ALTER TABLE "user_roles" ADD "created_by" bigint`);
    await queryRunner.query(`ALTER TABLE "user_roles" DROP COLUMN "role_id"`);
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD "role_id" bigint NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user_roles" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD "user_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "PK_8acd5cf26ebd158416f477de799"`,
    );
    await queryRunner.query(`ALTER TABLE "user_roles" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP COLUMN "permission_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD "permission_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP COLUMN "role_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD "role_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "PK_84059017c90bfcb701b8fa42297"`,
    );
    await queryRunner.query(`ALTER TABLE "role_permissions" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "PK_84059017c90bfcb701b8fa42297" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" DROP COLUMN "trade_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" ADD "trade_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" DROP CONSTRAINT "UQ_cf2856e57eca114bf74b407a52b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" ADD "user_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" ADD CONSTRAINT "REL_cf2856e57eca114bf74b407a52" UNIQUE ("user_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_user_trade_profiles_user_id" ON "user_trade_profiles" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" DROP CONSTRAINT "PK_faf2f822f60dc26f6731d374239"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" ADD CONSTRAINT "PK_faf2f822f60dc26f6731d374239" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_by"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "updated_by" bigint`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_by"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "created_by" bigint`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "user_status_id"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "user_status_id" bigint NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "user_type_id"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "user_type_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "id" BIGSERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_ae97aac6d6d471b9d88cea1c971" FOREIGN KEY ("performed_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sync_logs" ADD CONSTRAINT "FK_99a21b310e8c2bb9f95c6991022" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_sync_states" ADD CONSTRAINT "FK_6df9056928ccd41698e402ac719" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_logs" ADD CONSTRAINT "FK_f803d5e1bd85942b24ee4248701" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ADD CONSTRAINT "FK_5e8f0ad52cb1b3333272b5dbf2e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_tokens" ADD CONSTRAINT "FK_0fdbbe2123d6d62dfa270ea8947" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_setting_channels" ADD CONSTRAINT "FK_b9a96e655b664cd3d8569debf89" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" ADD CONSTRAINT "FK_91a7ffebe8b406c4470845d4781" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachments" ADD CONSTRAINT "FK_e25812e3fd9b3f3edf11b2c5d58" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_completions" ADD CONSTRAINT "FK_dfd1ac6c5426bc3b2821f559d5e" FOREIGN KEY ("completed_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" ADD CONSTRAINT "FK_f907c466f1ca746d84e0ed6d00e" FOREIGN KEY ("responded_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD CONSTRAINT "FK_39a15aff15e1769550086a88833" FOREIGN KEY ("assignee_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD CONSTRAINT "FK_5187c441a70fe34f1b99c1d062d" FOREIGN KEY ("assigned_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_932b7ae90148e482bc27b0a6d65" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_27821ee30aa99daef697f21322c" FOREIGN KEY ("assigned_to_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_users" ADD CONSTRAINT "FK_154abed78cef3e3de4d2c810806" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" ADD CONSTRAINT "FK_33330eaddc2a93fe74aa67b4bf6" FOREIGN KEY ("invited_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" ADD CONSTRAINT "FK_a8b96bc9423ba7ea8980f80db12" FOREIGN KEY ("invited_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" ADD CONSTRAINT "FK_cf2856e57eca114bf74b407a52b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_statuses" DROP CONSTRAINT "PK_ef1e5bc74326b923d9902599aeb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_statuses" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_statuses" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_statuses" ADD CONSTRAINT "PK_ef1e5bc74326b923d9902599aeb" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignment_responses" ADD CONSTRAINT "FK_f6a966267aa901f8a801bec2cc2" FOREIGN KEY ("response_status_id") REFERENCES "assignment_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD CONSTRAINT "FK_8c702d673e60fd12524378914c9" FOREIGN KEY ("assignment_status_id") REFERENCES "assignment_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "scope_id"`);
    await queryRunner.query(`ALTER TABLE "settings" ADD "scope_id" bigint`);
    await queryRunner.query(
      `ALTER TABLE "settings" DROP CONSTRAINT "PK_0669fe20e252eb692bf4d344975"`,
    );
    await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "filter_options" ALTER COLUMN "sort_order" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "filter_options" DROP COLUMN "filter_category_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "filter_options" ADD "filter_category_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "filter_options" DROP CONSTRAINT "PK_52011249a500b5325bf0af717a6"`,
    );
    await queryRunner.query(`ALTER TABLE "filter_options" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "filter_options" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "filter_options" ADD CONSTRAINT "PK_52011249a500b5325bf0af717a6" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_filter_values" ADD CONSTRAINT "FK_e8fd502859c9178489f01b94d38" FOREIGN KEY ("filter_option_id") REFERENCES "filter_options"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "filter_categories" DROP CONSTRAINT "PK_0d1dd9dbac2f7dce061bd587194"`,
    );
    await queryRunner.query(`ALTER TABLE "filter_categories" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "filter_categories" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "filter_categories" ADD CONSTRAINT "PK_0d1dd9dbac2f7dce061bd587194" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "filter_options" ADD CONSTRAINT "FK_2404be1d79aed393c030f0e9f1d" FOREIGN KEY ("filter_category_id") REFERENCES "filter_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP CONSTRAINT "PK_920331560282b8bd21bb02290df"`,
    );
    await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "PK_c1433d71a4838793a49dcad46ab"`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "roles" ADD "id" BIGSERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "levels" ALTER COLUMN "sort_order" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "levels" DROP CONSTRAINT "PK_05f8dd8f715793c64d49e3f1901"`,
    );
    await queryRunner.query(`ALTER TABLE "levels" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "levels" ADD "id" BIGSERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "levels" ADD CONSTRAINT "PK_05f8dd8f715793c64d49e3f1901" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_8c7bf11e91f04626bf2480740af" FOREIGN KEY ("level_id") REFERENCES "levels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "trades" ALTER COLUMN "sort_order" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "trades" DROP CONSTRAINT "PK_c6d7c36a837411ba5194dc58595"`,
    );
    await queryRunner.query(`ALTER TABLE "trades" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "trades" ADD "id" BIGSERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "trades" ADD CONSTRAINT "PK_c6d7c36a837411ba5194dc58595" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_5d63435bac76965b4c494297818" FOREIGN KEY ("trade_id") REFERENCES "trades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_trade_profiles" ADD CONSTRAINT "FK_255620ece826fc09b39f43b8e64" FOREIGN KEY ("trade_id") REFERENCES "trades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation_statuses" DROP CONSTRAINT "PK_8d24ae7deedcc8e08a6c4ef9bcb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation_statuses" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation_statuses" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation_statuses" ADD CONSTRAINT "PK_8d24ae7deedcc8e08a6c4ef9bcb" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invitations" ADD CONSTRAINT "FK_e31b15802cc31a49fef85a70892" FOREIGN KEY ("invitation_status_id") REFERENCES "invitation_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_priorities" ALTER COLUMN "sort_order" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_priorities" DROP CONSTRAINT "PK_aa148974939142ee75716ee34e3"`,
    );
    await queryRunner.query(`ALTER TABLE "task_priorities" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "task_priorities" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_priorities" ADD CONSTRAINT "PK_aa148974939142ee75716ee34e3" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_5d1c8f7898b5b84ad5ce08fcff8" FOREIGN KEY ("priority_id") REFERENCES "task_priorities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_statuses" DROP CONSTRAINT "PK_28fe920c04b1baa795d82773739"`,
    );
    await queryRunner.query(`ALTER TABLE "task_statuses" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "task_statuses" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_statuses" ADD CONSTRAINT "PK_28fe920c04b1baa795d82773739" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_e28288969fa7827bd12680cfe10" FOREIGN KEY ("status_id") REFERENCES "task_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_statuses" DROP CONSTRAINT "PK_50cc8fb0f4810b2f3bfcef7a788"`,
    );
    await queryRunner.query(`ALTER TABLE "user_statuses" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "user_statuses" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_statuses" ADD CONSTRAINT "PK_50cc8fb0f4810b2f3bfcef7a788" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_a39ec5232a0d1688c2a3e6f5384" FOREIGN KEY ("user_status_id") REFERENCES "user_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_types" DROP CONSTRAINT "PK_3f05efd7b52a7eca1f6b6f75e45"`,
    );
    await queryRunner.query(`ALTER TABLE "user_types" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "user_types" ADD "id" BIGSERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_types" ADD CONSTRAINT "PK_3f05efd7b52a7eca1f6b6f75e45" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_cd9740f36970d326b3f65bd5e99" FOREIGN KEY ("user_type_id") REFERENCES "user_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
