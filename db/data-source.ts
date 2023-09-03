import dotenv from "dotenv";
import { DataSource } from "typeorm";

dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  database: process.env.DB_NAME!,
  username: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  synchronize: false,
  logging: false,
  entities: ["db/entities/*.ts"],
  migrations: ["db/migrations/*.ts"],
  subscribers: ["db/subscribers/*.ts"],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err: unknown) => {
    console.error("Error during Data Source initialization", err);
  });

export { AppDataSource };
