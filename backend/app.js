import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./config/db.js";
import employeeRoutes from "./routes/employeeRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// TEST DB CONNECTION
pool
  .getConnection()
  .then(() => console.log("MySQL Connected"))
  .catch((err) => console.error("DB Error:", err));

// Routes
app.use("/employees", employeeRoutes);

// app.use((req, res, next) => {
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

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
export default app;
