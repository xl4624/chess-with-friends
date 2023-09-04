import { AppDataSource } from "../DataSource.ts";
import { Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm";
import crypto from "crypto";

export abstract class Base {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "text",
    nullable: false,
    unique: true,
    update: false,
  })
  token!: string;

  @CreateDateColumn({ update: false })
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  static getTokenPrefix(): string {
    return "";
  }

  @BeforeInsert()
  async generateToken() {
    const repository = AppDataSource.getRepository(this.constructor.name);

    for (let i = 0; i < 5; i++) {
      const tokenCandidate = `${(this.constructor as typeof Base).getTokenPrefix()}_${crypto
        .randomBytes(8)
        .toString("hex")}`;
      const exists = await repository.count({
        where: { token: tokenCandidate },
      });

      if (exists === 0) {
        this.token = tokenCandidate;
        break;
      }
    }

    if (!this.token) {
      throw new Error(`Could not generate a unique token for ${this.constructor.name}`);
    }
  }
}
