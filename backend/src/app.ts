import cors from "cors";
import express from "express";
import adminRoutes from "./routes/admin";
import authRoutes from "./routes/auth";
import contactRoutes from "./routes/contact";
import orderRoutes from "./routes/orders";
import paymentRoutes from "./routes/payments";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { uploadDir } from "./middleware/upload";

export function createApp() {
  const app = express();

  const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const corsOptions: cors.CorsOptions = {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };

  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));

  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Serve uploaded customer photos (dev/local storage mode).
  app.use("/uploads", express.static(uploadDir));

  app.get("/health", (_req, res) => res.json({ ok: true, service: "namoza-india-backend" }));

  app.use("/api/orders", orderRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/contact", contactRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
