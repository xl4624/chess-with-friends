import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { ObjectLiteral, Repository } from "typeorm";

import { AppDataSource } from "../../DataSource.ts";
import { Game } from "../Game.ts";

@ValidatorConstraint({ async: true })
export class PlayerConstraint implements ValidatorConstraintInterface {
  async validate(token: string): Promise<boolean> {
    if (token.startsWith("usr")) {
      const userRepository: Repository<ObjectLiteral> = AppDataSource.getRepository("User");
      return !!(await userRepository.findOne({ where: { token: token } }));
    } else if (token.startsWith("gst")) {
      const guestRepository: Repository<ObjectLiteral> = AppDataSource.getRepository("Guest");
      return !!(await guestRepository.findOne({ where: { token: token } }));
    }
    return false;
  }

  defaultMessage(args: ValidationArguments): string {
    const token: string = args.value as string;
    return `Player with token ${token} cannot be found.`;
  }
}

@ValidatorConstraint({ async: false })
export class TokenConstraint implements ValidatorConstraintInterface {
  validate(token: string, args: ValidationArguments): boolean {
    const [relatedPropertyName]: [string] = args.constraints as [string];
    const relatedValue: string | undefined = (args.object as Record<string, string | undefined>)[relatedPropertyName];
    return token !== relatedValue;
  }

  defaultMessage(args: ValidationArguments): string {
    const token: string = args.value as string;
    return `The token ${token} must differ from ${args.constraints[0]}.`;
  }
}

export function IsDifferent(property: string, validationOptions?: ValidationOptions) {
  return function (object: Game, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      constraints: [property],
      validator: TokenConstraint,
    });
  };
}
