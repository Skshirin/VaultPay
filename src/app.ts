import express from "express";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "VaultPay API is running"
  });
});

app.use("/api/v1/auth", authRoutes);

export default app;