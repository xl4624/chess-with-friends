import { Entity, Column } from "typeorm";
import { Length, IsNotEmpty, IsEmail } from "class-validator";

import { Player } from "./Player.ts";

@Entity()
export class User extends Player {
  @Column({
    type: "text",
    nullable: false,
    unique: true,
  })
  @IsNotEmpty({ message: "Username cannot be empty" })
  @Length(5, 20, { message: "Username must be between 5 and 20 characters" })
  username!: string;

  // TODO: Use SHA-256 hash
  @Column({
    type: "varchar",
    length: 64,
    nullable: false,
  })
  @IsNotEmpty({ message: "Password cannot be empty" })
  password!: string;

  @Column({
    type: "text",
    nullable: false,
    unique: true,
  })
  @IsEmail({}, { message: "Email must be a valid email" })
  email!: string;

  static override getTokenPrefix(): string {
    return "usr";
  }
}
