import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToInstance } from "class-transformer";
import { DeleteResult, ObjectLiteral, UpdateResult } from "typeorm";

import { AppDataSource } from "../../db/DataSource.ts";
import { Game } from "../../db/entities/Game.ts";
import { GameModel, GameParams } from "../types/GameTypes.ts";

export const getAllGames = (_req: Request, res: Response, next: NextFunction): void => {
  AppDataSource.getRepository("Game")
    .find()
    .then((result: ObjectLiteral[]) => res.send(result))
    .catch((err: Error) => next(err));
};

export const createGame = (req: Request<unknown, unknown, GameModel>, res: Response, next: NextFunction): void => {
  const game: Game = plainToInstance(Game, req.body);

  validate(game)
    .then((errors: ValidationError[]) => {
      if (errors.length <= 0) {
        AppDataSource.getRepository("Game")
          .save(game)
          .then((result: Game & ObjectLiteral) => res.send(result))
          .catch((err: Error) => next(err));
      } else {
        res.status(400).json({ errors });
      }
    })
    .catch((err: Error) => next(err));
};

export const deleteAllGames = (_req: Request, res: Response, next: NextFunction): void => {
  AppDataSource.getRepository("Game")
    .clear()
    .then(() => res.send("All games deleted"))
    .catch((err: Error) => next(err));
};

export const getGameByToken = (req: Request<GameParams>, res: Response, next: NextFunction): void => {
  AppDataSource.getRepository("Game")
    .findOne({ where: { token: req.params.token } })
    .then((result: ObjectLiteral | null) => res.send(result))
    .catch((err: Error) => next(err));
};

export const updateGameByToken = (
  req: Request<GameParams, unknown, GameModel>,
  res: Response,
  next: NextFunction,
): void => {
  const game: Game = plainToInstance(Game, req.body);
  AppDataSource.getRepository("Game")
    .update({ token: req.params.token }, game)
    .then((result: UpdateResult) => res.send(result))
    .catch((err: Error) => next(err));
};

export const deleteGameByToken = (req: Request<GameParams>, res: Response, next: NextFunction): void => {
  AppDataSource.getRepository("Game")
    .delete({ token: req.params.token })
    .then((result: DeleteResult) => res.send(result))
    .catch((err: Error) => next(err));
};
