import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { query } from "../config/db.js";
import { getUserRolesAndPermissions } from "../services/userRolePermissionAccess.js";
dotenv.config();

// Register Controller
const register = async (req, res) => {
  try {
    const { username, email, role, password } = req.body;

    if (!username || !email || !role || !password)
      return res.status(400).json({ error: "Missing required fields" });

    const hashed = await bcrypt.hash(password, 10);

    let userId;

    try {
      // Insert user
      const insertUser = `
        INSERT INTO users (username, email, password_hash, status, created_at)
        VALUES (?, ?, ?, 'active', NOW())
      `;
      const result = await query(insertUser, [username, email, hashed]);
      userId = result.insertId;
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "Email already registered!" });
      }
      throw err;
    }

    // Find role
    const roleRows = await query("SELECT id FROM roles WHERE name = ?", [role]);
    if (!roleRows.length)
      return res.status(400).json({ error: "Role not found" });

    const roleId = roleRows[0].id;

    // Assign role
    await query(
      "INSERT INTO user_roles (user_id, role_id, assigned_by, created_at) VALUES (?, ?, ?, NOW())",
      [userId, roleId, null]
    );

    res.json({
      success: true,
      message: "User registered successfully",
      userId,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

//  Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [user] = await query("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Initial role fetch (only for token)
    const roles = await query(
      `SELECT r.name 
       FROM roles r
       JOIN user_roles ur ON ur.role_id = r.id
       WHERE ur.user_id = ?`,
      [user.id]
    );
    const initialRoles = roles.map((r) => r.name);

    // Multi-secret JWT logic
    const JWT_SECRETS = [
      process.env.JWT_SECRET_1,
      process.env.JWT_SECRET_2,
      process.env.JWT_SECRET_3,
    ];

    function getRandomSecret() {
      return JWT_SECRETS[Math.floor(Math.random() * JWT_SECRETS.length)];
    }

    const secretKey = getRandomSecret();

    // Keep token clean (ONLY userId + roles)
    const token = jwt.sign(
      {
        userId: user.id,
        roles: initialRoles,
        secretIndex: JWT_SECRETS.indexOf(secretKey),
      },
      secretKey,
      { expiresIn: "2h" }
    );

    // Fresh roles & permissions from function
    const { roleNames, permissions } = await getUserRolesAndPermissions(
      user.id
    );

    // Response
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: roleNames,
        permissions: permissions,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { register, login };
