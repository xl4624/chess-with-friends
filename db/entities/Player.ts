import { Column, Entity, TableInheritance } from "typeorm";

import { Base } from "./Base.ts";

@Entity()
@TableInheritance({ column: { type: "text", name: "type" } })
export abstract class Player extends Base {
  @Column({
    type: "int",
    nullable: false,
    default: 1000,
  })
  rating!: number;
}
