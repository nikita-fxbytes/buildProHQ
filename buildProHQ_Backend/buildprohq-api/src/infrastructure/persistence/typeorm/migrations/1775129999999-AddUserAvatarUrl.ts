import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserAvatarUrl1775129999999 implements MigrationInterface {
  name = 'AddUserAvatarUrl1775129999999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "avatar_url" character varying(1024)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "avatar_url"`,
    );
  }
}
