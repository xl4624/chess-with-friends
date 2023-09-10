import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToClass, plainToInstance } from "class-transformer";

import { AppDataSource } from "../../db/DataSource.ts";
import { User } from "../../db/entities/User.ts";
import { UserModel, UserParams } from "../types/UserTypes.ts";

export const getAllUsers = (_req: Request, res: Response, next: NextFunction): void => {
  AppDataSource.getRepository("User")
    .find()
    .then((result) => res.send(result))
    .catch((err: Error) => next(err));
};

export const createUser = (req: Request<unknown, unknown, UserModel>, res: Response, next: NextFunction): void => {
  const user = plainToClass(User, req.body);

  validate(user)
    .then((errors) => {
      if (errors.length <= 0) {
        AppDataSource.getRepository("User")
          .save(user)
          .then((result) => res.send(result))
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
  const userToken = req.params.userToken;
  AppDataSource.getRepository("User")
    .find({
      where: {
        token: userToken,
      },
    })
    .then((result) => res.send(result))
    .catch((err: Error) => next(err));
};

export const updateUserByToken = (req: Request<UserParams>, res: Response, next: NextFunction): void => {
  const userToken = req.params.userToken;
  const user = plainToInstance(User, req.body);
  AppDataSource.getRepository("User")
    .update({ token: userToken }, user)
    .then((result) => res.send(result))
    .catch((err: Error) => next(err));
};

export const deleteByToken = (req: Request<UserParams>, res: Response, next: NextFunction): void => {
  const userToken = req.params.userToken;
  AppDataSource.getRepository("User")
    .delete({
      token: userToken,
    })
    .then((result) => res.send(result))
    .catch((err: Error) => next(err));
};
