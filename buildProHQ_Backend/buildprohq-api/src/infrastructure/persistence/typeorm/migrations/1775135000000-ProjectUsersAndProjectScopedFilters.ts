import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjectUsersAndProjectScopedFilters1775135000000 implements MigrationInterface {
  name = 'ProjectUsersAndProjectScopedFilters1775135000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Project membership (project-wise access control)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "project_users" (
        "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP(6),
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "project_role" character varying(50),
        CONSTRAINT "PK_project_users_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_project_users_project" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_project_users_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "uq_project_users_project_user"
      ON "project_users" ("project_id", "user_id")
      WHERE "deleted_at" IS NULL;
    `);

    // Project-scoped filter categories
    await queryRunner.query(
      `ALTER TABLE "filter_categories" ADD COLUMN IF NOT EXISTS "project_id" uuid`,
    );
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'FK_filter_categories_project'
        ) THEN
          ALTER TABLE "filter_categories"
          ADD CONSTRAINT "FK_filter_categories_project"
          FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE;
        END IF;
      END $$;
    `);

    // Case-insensitive uniqueness within same project (ignores soft-deleted rows)
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "uq_filter_categories_project_name_ci"
      ON "filter_categories" ("project_id", lower("name"))
      WHERE "deleted_at" IS NULL;
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "uq_filter_options_category_name_ci"
      ON "filter_options" ("filter_category_id", lower("name"))
      WHERE "deleted_at" IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "uq_filter_options_category_name_ci"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "uq_filter_categories_project_name_ci"`,
    );
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'FK_filter_categories_project'
        ) THEN
          ALTER TABLE "filter_categories" DROP CONSTRAINT "FK_filter_categories_project";
        END IF;
      END $$;
    `);
    await queryRunner.query(
      `ALTER TABLE "filter_categories" DROP COLUMN IF EXISTS "project_id"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "uq_project_users_project_user"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "project_users"`);
  }
}
