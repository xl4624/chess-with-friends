import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUserToUsername1693770697776 implements MigrationInterface {
  name = "ChangeUserToUsername1693770697776";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "token" text NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_a854e557b1b14814750c7c7b0c9" UNIQUE ("token")`);
    await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "user" ADD "username" text NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_a854e557b1b14814750c7c7b0c9"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "token"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying NOT NULL`);
  }
}
