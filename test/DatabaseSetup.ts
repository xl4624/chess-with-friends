import dotenv from "dotenv";
import { DataSource } from "typeorm";

dotenv.config();

export const TestDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  database: process.env.DB_NAME_TEST!,
  username: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  synchronize: true,
  logging: true,
  entities: ["db/entities/*.ts"],
  migrations: ["db/migrations/*.ts"],
  subscribers: ["db/subscribers/*.ts"],
});

export const setup = async (entityName: string): Promise<void> => {
  await TestDataSource.initialize();
  await TestDataSource.getRepository(entityName).delete({});
};

export const teardown = async (entityName: string): Promise<void> => {
  await TestDataSource.getRepository(entityName).delete({});
  await TestDataSource.destroy();
};
