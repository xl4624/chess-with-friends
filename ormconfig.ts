import dotenv from "dotenv";

dotenv.config();

export default {
  type: "postgres",
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  database: process.env.DB_NAME!,
  username: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  synchronize: true,
  logging: false,
  entities: ["dist/entity/**/*.js"],
  migrations: ["dist/migration/**/*.js"],
  subscribers: ["dist/subscriber/**/*.js"],
  cli: {
    entitiesDir: "db/entity",
    migrationsDir: "db/migration",
    subscribersDir: "db/subscriber",
  },
};
