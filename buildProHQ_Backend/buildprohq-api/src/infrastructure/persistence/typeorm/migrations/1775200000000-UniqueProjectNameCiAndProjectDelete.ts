import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueProjectNameCiAndProjectDelete1775200000000
  implements MigrationInterface
{
  name = 'UniqueProjectNameCiAndProjectDelete1775200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Case-insensitive unique project name (ignore soft-deleted projects)
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "uq_projects_name_ci"
      ON "projects" (lower("name"))
      WHERE "deleted_at" IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "uq_projects_name_ci"`);
  }
}

