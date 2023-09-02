import dotenv from "dotenv";
import { DataSource } from "typeorm";
import "reflect-metadata";
import { User } from "./entity/User.ts";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  database: process.env.DB_NAME!,
  username: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  entities: [User],
});
