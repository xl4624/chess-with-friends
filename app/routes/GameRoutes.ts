import { Router } from "express";

import * as GameController from "../controllers/GameController.ts";

const router = Router();

router.route("/").get(GameController.getAllGames).post(GameController.createGame);

router
  .route("/:token")
  .get(GameController.getGameByToken)
  .put(GameController.updateGameByToken)
  .delete(GameController.deleteGameByToken);

export default router;
