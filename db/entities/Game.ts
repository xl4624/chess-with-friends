import { Column, Entity } from "typeorm";
import { IsNotEmpty, Validate } from "class-validator";

import { Base } from "./Base.ts";
import { IsDifferent, PlayerConstraint } from "./constraints/GameConstraints.ts";

@Entity()
export class Game extends Base {
  @Column({
    type: "text",
    nullable: false,
    update: false,
  })
  @IsNotEmpty()
  @Validate(PlayerConstraint)
  @IsDifferent("blackPlayerToken")
  whitePlayerToken!: string;

  @Column({
    type: "text",
    nullable: false,
    update: false,
  })
  @IsNotEmpty()
  @Validate(PlayerConstraint)
  @IsDifferent("whitePlayerToken")
  blackPlayerToken!: string;

  @Column({
    type: "text",
    nullable: false,
    default: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  })
  fen!: string;

  @Column({
    type: "json",
    nullable: false,
    default: [],
  })
  moveHistory!: string[];

  static override getTokenPrefix(): string {
    return "gme";
  }
}
