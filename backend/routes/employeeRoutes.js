import express from "express";
import {
  registerEmployee,
  loginEmployee,
  getEmployees,
} from "../controllers/employeeController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerEmployee);
router.post("/login", loginEmployee);
router.get("/", auth, getEmployees); // only logged-in users

export default router;
