import express from "express";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import "reflect-metadata";
import { User } from "../../db/entity/User.ts";

const app = express();
const PORT = 3001;

app.get("/api", (_req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

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

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err: unknown) => {
    console.error("Error during Data Source initialization", err);
  });
