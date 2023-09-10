import { Router } from "express";

import * as GameController from "../controllers/GameController.ts";

const router = Router();

router.route("/").get(GameController.getAllGames).post(GameController.createGame).delete(GameController.deleteAllGames);

router.route("/:token").get(GameController.getGame).put(GameController.updateGame).delete(GameController.deleteGame);

export default router;
