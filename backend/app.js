import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./config/db.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// TEST DB CONNECTION
pool
  .getConnection()
  .then((connection) => {
    console.log("✅ MySQL Connected successfully!");
    connection.release(); // Release the connection back to the pool
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err.message);
    // Do NOT crash the app here, but log the severe error
  });

// Routes
app.use("/employees", employeeRoutes);


//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "OPTIONS, GET, POST, PUT, PATCH, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });
app.get("/", (req, res) => {
  res.send("Garage App Backend Running...");
});

// Global Error Handler (Good practice for catching unhandled exceptions)
app.use((err, req, res, next) => {
    console.error("🔥 Unhandled Server Error:", err.stack);
    res.status(500).json({ 
        message: "Internal Server Error",
        errorDetail: process.env.NODE_ENV === 'development' ? err.message : undefined // Send detail only in dev
    });
});


// Server Startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`Backend endpoint: http://13.60.25.59:${PORT}`);
});
// // Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, "0.0.0.0", () =>
//   console.log(`Server running at http://13.60.25.59
// :${PORT}`)
// );
export default app;
