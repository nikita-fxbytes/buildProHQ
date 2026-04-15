import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds `in_progress` task status lookup entry for workflow tracking.
 */
export class AddInProgressTaskStatus1775220000000 implements MigrationInterface {
  name = 'AddInProgressTaskStatus1775220000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "task_statuses" ("code", "name", "is_terminal")
      SELECT 'in_progress', 'In Progress', false
      WHERE NOT EXISTS (
        SELECT 1 FROM "task_statuses"
        WHERE "code" = 'in_progress' AND "deleted_at" IS NULL
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "task_statuses"
      WHERE "code" = 'in_progress'
    `);
  }
}

