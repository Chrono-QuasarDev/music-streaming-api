import express from "express";
import helmet from "helmet";
import { errorHandler } from "./shared/middleware/errorHandler.js";
import healthRouter from "./shared/health/health.route.js";
import v1Routes from "./modules/v1.routes.js";

const app = express();

app.use('/health', healthRouter);

app.use(express.json());
app.use(helmet());

app.use('/api/v1', v1Routes);
app.use(errorHandler);

export default app;