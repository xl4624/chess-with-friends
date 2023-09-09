import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from "class-validator";

import { AppDataSource } from "../../DataSource.ts";
import { Game } from "../Game.ts";

@ValidatorConstraint({ async: true })
export class PlayerConstraint implements ValidatorConstraintInterface {
  async validate(token: string) {
    if (token.startsWith("usr")) {
      const userRepository = AppDataSource.getRepository("User");
      return !!(await userRepository.findOne({ where: { token: token } }));
    } else if (token.startsWith("gst")) {
      const guestRepository = AppDataSource.getRepository("Guest");
      return !!(await guestRepository.findOne({ where: { token: token } }));
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    const token = args.value as string;
    return `Player with token ${token} cannot be found.`;
  }
}

@ValidatorConstraint({ async: false })
export class TokenConstraint implements ValidatorConstraintInterface {
  validate(token: string, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints as [string];
    const relatedValue = (args.object as Record<string, string | undefined>)[relatedPropertyName];
    return token !== relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    const token = args.value as string;
    return `The token ${token} must differ from ${args.constraints[0]}.`;
  }
}

export function IsDifferent(property: string, validationOptions?: ValidationOptions) {
  return function (object: Game, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      constraints: [property],
      validator: TokenConstraint,
    });
  };
}
