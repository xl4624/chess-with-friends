import { Router } from "express";

import * as UserController from "../controllers/UserController.ts";

const router = Router();

router.route("/").get(UserController.getAllUsers).post(UserController.createUser);

router
  .route("/:token")
  .get(UserController.getUserByToken)
  .put(UserController.updateUserByToken)
  .delete(UserController.deleteByToken);

export default router;
