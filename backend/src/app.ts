import express from "express";
import indexRoutes from "./routes";
import campaignRoutes from "./routes/campaigns";

const app = express();

app.use(express.json());

app.use("/", indexRoutes);
app.use("/api/campaigns", campaignRoutes);

export default app;