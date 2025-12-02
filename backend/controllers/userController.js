import { query } from "../config/db.js";
import bcrypt from "bcrypt";

// GET all users
const getAllUsers = async function getAllUsers(req, res) {
  try {
    const users = await query(`
      SELECT 
        u.id AS user_id,
        u.username,
        u.email,
        u.status,
        r.id AS role_id,
        r.name AS role_name
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      ORDER BY u.id;
    `);

    if (!users.length) {
      return res.json({ data: [] });
    }

    const result = [];
    const userMap = new Map();

    users.forEach((u) => {
      if (!userMap.has(u.user_id)) {
        userMap.set(u.user_id, {
          id: u.user_id,
          username: u.username,
          email: u.email,
          status: u.status,
          roles: [],
        });
      }

      const userObj = userMap.get(u.user_id);

      if (u.role_id && u.role_name) {
        userObj.roles.push(u.role_name);
      }
    });

    for (let user of userMap.values()) {
      result.push(user);
    }

    res.status(200).json({
      message: "Fetched all users with roles successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error fetching users with roles:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// CREATE new user
const createUser = async (req, res) => {
  try {
    const { username, email, password, status, role_ids } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: "Username, email, and password are required" 
      });
    }

    if (!role_ids || !Array.isArray(role_ids) || role_ids.length === 0) {
      return res.status(400).json({ 
        message: "At least one role must be selected" 
      });
    }

    // Check if username already exists
    const existingUsername = await query(
      `SELECT id FROM users WHERE username = ?`,
      [username]
    );

    if (existingUsername.length > 0) {
      return res.status(400).json({ 
        message: "Username already exists" 
      });
    }

    // Check if email already exists
    const existingEmail = await query(
      `SELECT id FROM users WHERE email = ?`,
      [email]
    );

    if (existingEmail.length > 0) {
      return res.status(400).json({ 
        message: "Email already exists" 
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Set default status if not provided
    const userStatus = status || 'active';

    // Insert new user
    const insertUser = await query(
      `INSERT INTO users (username, email, password_hash, status) 
       VALUES (?, ?, ?, ?)`,
      [username, email, passwordHash, userStatus]
    );

    const userId = insertUser.insertId;

    // Get the ID of the user creating this user (from auth middleware)
    const assignedBy = req.user?.id || null;

    // Assign roles to the new user
    for (const roleId of role_ids) {
      // Verify role exists
      const roleExists = await query(
        `SELECT id FROM roles WHERE id = ?`,
        [roleId]
      );

      if (roleExists.length === 0) {
        // Rollback: delete the user if role assignment fails
        await query(`DELETE FROM users WHERE id = ?`, [userId]);
        return res.status(400).json({ 
          message: `Role with ID ${roleId} does not exist` 
        });
      }

      // Insert user role
      await query(
        `INSERT INTO user_roles (user_id, role_id, assigned_by) 
         VALUES (?, ?, ?)`,
        [userId, roleId, assignedBy]
      );
    }

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user_id: userId,
    });

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ 
      message: "Internal Server Error",
      error: error.message 
    });
  }
};

// UPDATE user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, status, role_ids } = req.body;

    const userExists = await query(
      `SELECT id FROM users WHERE id = ?`,
      [id]
    );

    if (userExists.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    await query(
      `UPDATE users SET username = ?, email = ?, status = ? WHERE id = ?`,
      [username, email, status, id]
    );

    if (role_ids && Array.isArray(role_ids)) {
      await query(`DELETE FROM user_roles WHERE user_id = ?`, [id]);

      if (role_ids.length > 0) {
        const assignedBy = req.user?.id || 1;
        
        for (const roleId of role_ids) {
          await query(
            `INSERT INTO user_roles (user_id, role_id, assigned_by) VALUES (?, ?, ?)`,
            [id, roleId, assignedBy]
          );
        }
      }
    }

    res.json({
      success: true,
      message: "User details and roles updated successfully",
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ 
      error: "Server error while updating user",
      message: err.message 
    });
  }
};

// DELETE user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userExists = await query(
      `SELECT id FROM users WHERE id = ?`,
      [id]
    );

    if (userExists.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user && req.user.id === parseInt(id)) {
      return res.status(400).json({ 
        message: "You cannot delete your own account" 
      });
    }

    await query(`DELETE FROM user_roles WHERE user_id = ?`, [id]);
    await query(`DELETE FROM user_staff WHERE user_id = ? OR staff_id = ?`, [id, id]);
    await query(`DELETE FROM users WHERE id = ?`, [id]);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ 
      error: "Server error while deleting user",
      message: err.message 
    });
  }
};

export { getAllUsers, createUser, updateUser, deleteUser };