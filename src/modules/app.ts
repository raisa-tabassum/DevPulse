import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { logger } from "../middleware/logger";
import authRoutes from "./auth/routes/auth.route";
import { issuesRoute } from "./issues/routes/issue.route";
import { globalErrorHandler } from "../middleware/globalErrorHandler";
import cors from "cors";

const app: Application = express();

app.use(logger);
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.send("DevPulse Express Server Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/issues", issuesRoute);

app.use(globalErrorHandler);

export default app;
