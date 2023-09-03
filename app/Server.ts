import express, { Request, Response, NextFunction } from "express";
import "reflect-metadata";

import userRoutes from "./routes/UserRoutes.ts"; // make sure to update this import to the actual location of UserRoutes.ts

// Error-handling middleware
const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction): void => {
  console.error(err);
  res.status(500).json({ error: err.message });
  next();
};

const app = express();
app.use(express.json());
app.use(errorHandler);

app.get("/api", (_req: Request, res: Response): void => {
  res.send("Server is running");
});

app.use("/api/users", userRoutes);

const PORT = 3001;
app.listen(PORT, (): void => {
  console.log(`Server is running on port ${PORT}`);
});
