import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGuestAndPlayerEntity1693853308501 implements MigrationInterface {
  name = "AddGuestAndPlayerEntity1693853308501";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "player" ("id" SERIAL NOT NULL, "token" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "rating" integer NOT NULL DEFAULT '1000', "type" text NOT NULL, CONSTRAINT "UQ_6b6843d7c636cdae511eca06b86" UNIQUE ("token"), CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_c96b1991956f32b45b384a2091" ON "player" ("type") `);
    await queryRunner.query(
      `CREATE TABLE "guest" ("id" SERIAL NOT NULL, "token" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "rating" integer NOT NULL DEFAULT '1000', "ipAddress" character varying(39) NOT NULL, "expiresAt" TIMESTAMP NOT NULL, CONSTRAINT "UQ_dbbb9f7596fe1db48b14c8bf70a" UNIQUE ("token"), CONSTRAINT "PK_57689d19445de01737dbc458857" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "guest"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c96b1991956f32b45b384a2091"`);
    await queryRunner.query(`DROP TABLE "player"`);
  }
}
