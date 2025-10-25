import express from "express";
import type { Request, Response } from "express";
import routerV1 from "./routes/v1/index-routes.js";
import { errorHandler } from "./middlewares/error-handler-middleware.js";

const app = express();

app.use(express.json());
app.use("/api/v1", routerV1);
app.use(errorHandler);

app.get("/health", (req: Request, res: Response) => {
  res.json({ healthCheck: "Success" });
});

export default app;
