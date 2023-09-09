import { Entity, Column } from "typeorm";
import {
  ValidateIf,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from "class-validator";

import { AppDataSource } from "../DataSource.ts";
import { Base } from "./Base.ts";

@ValidatorConstraint({ async: true })
export class PlayerConstraint implements ValidatorConstraintInterface {
  async validate(value: string) {
    if (value.startsWith("usr")) {
      const userRepository = AppDataSource.getRepository("User");
      return !!(await userRepository.findOne({ where: { token: value } }));
    } else if (value.startsWith("gst")) {
      const guestRepository = AppDataSource.getRepository("Guest");
      return !!(await guestRepository.findOne({ where: { token: value } }));
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    const value = args.value as string;
    return `Player with token ${value} cannot be found.`;
  }
}

@Entity()
export class Game extends Base {
  @Column({
    type: "text",
    nullable: false,
    update: false,
  })
  @ValidateIf((o: Game) => o.whitePlayerToken !== o.blackPlayerToken)
  @Validate(PlayerConstraint)
  whitePlayerToken!: string;

  @Column({
    type: "text",
    nullable: false,
    update: false,
  })
  @Validate(PlayerConstraint)
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
