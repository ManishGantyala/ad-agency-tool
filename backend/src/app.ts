import express from "express";
import indexRoutes from "./routes";
import campaignRoutes from "./routes/campaigns";
import clientRoutes from "./routes/clients";

const app = express();

app.use(express.json());

app.use("/", indexRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/clients", clientRoutes);

export default app;