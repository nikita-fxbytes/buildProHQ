import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Convert user-defined filters from single-project (filters.project_id)
 * to many-to-many via filter_projects.
 */
export class FiltersMultiProject1775250000000 implements MigrationInterface {
  name = 'FiltersMultiProject1775250000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "filter_projects" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "filter_id" uuid NOT NULL,
        "project_id" uuid NOT NULL,
        CONSTRAINT "PK_filter_projects_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_filter_projects_filter" FOREIGN KEY ("filter_id") REFERENCES "filters"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_filter_projects_project" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "uq_filter_projects_filter_project"
      ON "filter_projects" ("filter_id", "project_id");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_filter_projects_project"
      ON "filter_projects" ("project_id");
    `);

    // Migrate existing single-project mappings.
    await queryRunner.query(`
      INSERT INTO "filter_projects" ("filter_id", "project_id")
      SELECT f.id, f.project_id
      FROM "filters" f
      WHERE f.project_id IS NOT NULL
      ON CONFLICT DO NOTHING;
    `);

    // Drop old unique index if present.
    await queryRunner.query(
      `DROP INDEX IF EXISTS "uq_filters_project_name_ci";`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_filters_project_id";`);

    // Drop old foreign key constraint if present, then drop column.
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'FK_filters_project'
        ) THEN
          ALTER TABLE "filters" DROP CONSTRAINT "FK_filters_project";
        END IF;
      END $$;
    `);
    await queryRunner.query(
      `ALTER TABLE "filters" DROP COLUMN IF EXISTS "project_id";`,
    );

    // Note: uniqueness (project_id + lower(filter.name)) is enforced in service (portable, no fancy SQL).
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "filters" ADD COLUMN IF NOT EXISTS "project_id" uuid;`,
    );
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'FK_filters_project'
        ) THEN
          ALTER TABLE "filters"
          ADD CONSTRAINT "FK_filters_project" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE;
        END IF;
      END $$;
    `);

    // Best-effort restore: pick first mapping per filter.
    await queryRunner.query(`
      UPDATE "filters" f
      SET "project_id" = x.project_id
      FROM (
        SELECT fp.filter_id, MIN(fp.project_id) AS project_id
        FROM "filter_projects" fp
        GROUP BY fp.filter_id
      ) x
      WHERE x.filter_id = f.id;
    `);

    await queryRunner.query(`DROP TABLE IF EXISTS "filter_projects";`);
  }
}
