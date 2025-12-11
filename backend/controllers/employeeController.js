import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Middleware to protect routes (assuming you have one, typically in middleware/auth.js)
// If you don't have it, create it:
/*
export const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.employee = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};
*/

export const registerEmployee = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    //1. Check if email exists
    const [existing] = await pool.execute(
      "SELECT email FROM employee_test WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    //2. Hash
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //3. Insert user
    const [result] = await pool.execute(
      `INSERT INTO employee_test (first_name, last_name, email, password)
       VALUES (?, ?, ?, ?)`,
      [first_name, last_name, email, hashedPassword]
    );

    res.status(201).json({
      message: "Employee registered successfully",
      first_name,
      last_name,
      employeeId: result.insertId,
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginEmployee = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const [rows] = await pool.execute(
      "SELECT id, password, first_name FROM employee_test WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const employee = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
   const token = jwt.sign(
     { id: employee.id, email: email, first_name: employee.first_name },
     process.env.JWT_SECRET,
     { expiresIn: "1d" }
   );

   res.json({
     message: "Login successful",
     token,
     employee: { id: employee.id, first_name: employee.first_name, email },
   });
   
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, first_name, last_name, email FROM employee_test"
    );
    res.json(rows);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
