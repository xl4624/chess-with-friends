import express from "express";
import "reflect-metadata";

import { AppDataSource } from "../../db/data-source.ts";

const app = express();
const PORT = 3001;

app.get("/api", (_req, res) => {
  res.send("Server is running");
});

app.get("/api/users", (_req, res) => {
  try {
    const users = AppDataSource.manager.find("User");
    res.json(users);
  } catch (err: unknown) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
