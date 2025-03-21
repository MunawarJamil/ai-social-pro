/**
 * Express Application Setup
 */
import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/error.middleware.js";
import getRawBody from "raw-body";
import typeIs from "type-is";
// Import routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.routes.js";

// Initialize app
const app = express();
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// Define allowed origins
const allowedOrigins = [
  "http://localhost:5000", // Backend
  "https://ai-social-pro.onrender.com", // Backend
  "http://localhost:5174", // Frontend (Vite)
  "http://localhost:5173", // Frontend (Vite)
  "https://ai-social-pro-frontend.onrender.com",
  "https://oneyearsocial.com",
  ,
  "*",
  // Deployed frontend
];
app.use(async (req, res, next) => {
  if (typeIs(req, ["json"])) {
    try {
      const raw = await getRawBody(req, {
        length: req.headers["content-length"],
        limit: "50mb",
        encoding: true,
      });
      req.rawBody = raw;
      req.body = JSON.parse(raw);
    } catch (err) {
      console.error("❌ JSON Parse Error:", err.message);
      console.error("📝 Raw Body:", req.rawBody || "<no body>");
      return res.status(400).json({ error: "Invalid JSON body" });
    }
  }
  next();
});
/*app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"], // Explicitly allow these methods
    credentials: true, // Allow cookies/authentication headers
  })
);*/

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // If using cookies or authentication tokens
  })
);

// Middleware
app.use(cors({ origin: true }));
//app.use(express.json({ limit: "50mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
