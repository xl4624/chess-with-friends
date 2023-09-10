import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToInstance } from "class-transformer";
import { DeleteResult, ObjectLiteral, UpdateResult } from "typeorm";

import { AppDataSource } from "../../db/DataSource.ts";
import { User } from "../../db/entities/User.ts";
import { UserModel, UserParams } from "../types/UserTypes.ts";

export const getAllUsers = (_req: Request, res: Response, next: NextFunction): void => {
  AppDataSource.getRepository("User")
    .find()
    .then((result: ObjectLiteral[]) => res.send(result))
    .catch((err: Error) => next(err));
};

export const createUser = (req: Request<unknown, unknown, UserModel>, res: Response, next: NextFunction): void => {
  const user: User = plainToInstance(User, req.body);

  validate(user)
    .then((errors: ValidationError[]) => {
      if (errors.length <= 0) {
        AppDataSource.getRepository("User")
          .save(user)
          .then((result: User & ObjectLiteral) => res.send(result))
          .catch((err) => next(err));
      } else {
        res.status(400).json({ errors });
      }
    })
    .catch((err: Error) => next(err));
};

export const deleteAllUsers = (_req: Request, res: Response, next: NextFunction): void => {
  AppDataSource.getRepository("User")
    .clear()
    .then(() => res.send("All users deleted"))
    .catch((err: Error) => next(err));
};

export const getUserByToken = (req: Request<UserParams>, res: Response, next: NextFunction): void => {
  const userToken: string = req.params.token;

  AppDataSource.getRepository("User")
    .findOne({ where: { token: userToken } })
    .then((result: ObjectLiteral | null) => res.send(result))
    .catch((err: Error) => next(err));
};

export const updateUserByToken = (req: Request<UserParams>, res: Response, next: NextFunction): void => {
  const userToken: string = req.params.token;
  const user: User = plainToInstance(User, req.body);

  AppDataSource.getRepository("User")
    .update({ token: userToken }, user)
    .then((result: UpdateResult) => res.send(result))
    .catch((err: Error) => next(err));
};

export const deleteByToken = (req: Request<UserParams>, res: Response, next: NextFunction): void => {
  const userToken: string = req.params.token;

  AppDataSource.getRepository("User")
    .delete({
      token: userToken,
    })
    .then((result: DeleteResult) => res.send(result))
    .catch((err: Error) => next(err));
};
