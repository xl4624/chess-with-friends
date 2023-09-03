import { Base } from "./Base.ts";
import { Entity, Column } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

@Entity()
export class User extends Base {
  @Column({
    type: "text",
    nullable: false,
    unique: true,
  })
  @IsNotEmpty({ message: "Username cannot be empty" })
  @Length(5, 20, { message: "Username must be between 5 and 20 characters" })
  username!: string;

  static override getTokenPrefix(): string {
    return "usr";
  }
}
