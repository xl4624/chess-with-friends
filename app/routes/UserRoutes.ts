import { Router } from "express";

import * as UserController from "../controllers/UserController.ts";

const router = Router();

router
  .route("/")
  .get(UserController.getAllUsers)
  .post(UserController.createUser)
  // TODO: Deprecate deleteAllUsers with deleteByToken
  .delete(UserController.deleteAllUsers);

// router
//   .route("/:userToken")
//   .get(UserController.getUserByToken)
//   .put(UserController.updateUserByToken)
//   .delete(UserController.deleteByToken);

export default router;
