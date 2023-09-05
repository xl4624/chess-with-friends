import { PlayerModel } from "./PlayerTypes.ts";

export interface UserModel extends PlayerModel {
  username: string;
  password: string;
  email: string;
}

export interface UserParams {
  userToken: string;
}
