import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds optional task title for list/detail display; legacy rows backfilled from plain-text description preview.
 */
export class AddTaskTitle1775210000000 implements MigrationInterface {
  name = 'AddTaskTitle1775210000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tasks" ADD "title" character varying(500)`);
    await queryRunner.query(`
      UPDATE "tasks"
      SET "title" = TRIM(SUBSTRING(REGEXP_REPLACE(COALESCE("description", ''), '<[^>]+>', ' ', 'g') FROM 1 FOR 500))
      WHERE "title" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "title"`);
  }
}
