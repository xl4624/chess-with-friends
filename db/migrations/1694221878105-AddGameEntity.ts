import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGameEntity1694221878105 implements MigrationInterface {
  name = "AddGameEntity1694221878105";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "game" ("id" SERIAL NOT NULL, "token" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "whitePlayerToken" text NOT NULL, "blackPlayerToken" text NOT NULL, "fen" text NOT NULL DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', "moveHistory" json NOT NULL DEFAULT '[]', CONSTRAINT "UQ_b6d45bdfb020ba6b427755bbfb1" UNIQUE ("token"), CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "game"`);
  }
}
