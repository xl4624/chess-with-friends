import { BeforeUpdate, Column, Entity } from "typeorm";

import { Player } from "./Player.ts";

@Entity()
export class Guest extends Player {
  @Column({
    type: "varchar",
    length: 39,
    nullable: false,
    update: false,
  })
  ipAddress!: string;

  @Column({
    type: "timestamp",
    nullable: false,
  })
  expiresAt!: Date;

  static override getTokenPrefix(): string {
    return "gst";
  }

  @BeforeUpdate()
  updateExpiresAt(): void {
    this.expiresAt = new Date(new Date().getTime() + 3 * 60 * 60 * 1000);
  }
}
