import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { User } from "./entity/User.ts";

dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  database: process.env.DB_NAME!,
  username: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: ["db/migration/*.ts"],
  subscribers: ["db/subscriber/*.ts"],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err: unknown) => {
    console.error("Error during Data Source initialization", err);
  });

export { AppDataSource };
