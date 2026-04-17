import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * User-defined project filters (filters + sub_filters + task_filters).
 * Distinct from legacy filter_categories / filter_options / task_filter_values.
 */
export class DynamicProjectFilters1775240000000 implements MigrationInterface {
  name = 'DynamicProjectFilters1775240000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "filters" (
        "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP(6),
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "name" character varying(200) NOT NULL,
        "has_sub_filters" boolean NOT NULL DEFAULT false,
        "is_multi_select" boolean NOT NULL DEFAULT false,
        CONSTRAINT "PK_filters_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_filters_project" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_filters_project_id"
      ON "filters" ("project_id")
      WHERE "deleted_at" IS NULL;
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "uq_filters_project_name_ci"
      ON "filters" ("project_id", lower("name"))
      WHERE "deleted_at" IS NULL;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "sub_filters" (
        "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP(6),
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "filter_id" uuid NOT NULL,
        "name" character varying(200) NOT NULL,
        CONSTRAINT "PK_sub_filters_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_sub_filters_filter" FOREIGN KEY ("filter_id") REFERENCES "filters"("id") ON DELETE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "uq_sub_filters_filter_name_ci"
      ON "sub_filters" ("filter_id", lower("name"))
      WHERE "deleted_at" IS NULL;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "task_filters" (
        "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP(6),
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "task_id" uuid NOT NULL,
        "filter_id" uuid NOT NULL,
        "sub_filter_id" uuid,
        "text_value" character varying(4000),
        CONSTRAINT "PK_task_filters_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_task_filters_task" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_task_filters_filter" FOREIGN KEY ("filter_id") REFERENCES "filters"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_task_filters_sub_filter" FOREIGN KEY ("sub_filter_id") REFERENCES "sub_filters"("id") ON DELETE RESTRICT
      );
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_task_filters_task_id"
      ON "task_filters" ("task_id")
      WHERE "deleted_at" IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "task_filters"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sub_filters"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "filters"`);
  }
}
