import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import walletRoutes from "./routes/wallet.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "VaultPay API is running"
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/wallet", walletRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`VaultPay backend running on port ${PORT}`);
});

export default app;