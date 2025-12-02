import { query } from "../../config/db.js";
import bcrypt from "bcrypt";

const createStaff = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // logged-in user (creator)
    const creatorId = req.user.id;
    
    // Validate required fields
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate role ID exists in roles table
    const roleExists = await query(
      `SELECT id, name FROM roles WHERE id = ? LIMIT 1`,
      [role]
    );

    if (roleExists.length === 0) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const selectedRoleId = roleExists[0].id;
    const selectedRoleName = roleExists[0].name;

    // Check if email already exists
    const existingUser = await query(
      `SELECT id FROM users WHERE email = ? LIMIT 1`,
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if username already exists
    const existingUsername = await query(
      `SELECT id FROM users WHERE username = ? LIMIT 1`,
      [username]
    );

    if (existingUsername.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert into users table
    const insertUser = await query(
      `INSERT INTO users (username, email, password_hash, status) 
       VALUES (?, ?, ?, 'active')`,
      [username, email, passwordHash]
    );

    const staffId = insertUser.insertId;

    // Assign selected role from dropdown
    await query(
      `INSERT INTO user_roles (user_id, role_id, assigned_by) 
       VALUES (?, ?, ?)`,
      [staffId, selectedRoleId, creatorId]
    );

    // Insert into user_staff (to track who created who)
    await query(
      `INSERT INTO user_staff (user_id, staff_id) 
       VALUES (?, ?)`,
      [creatorId, staffId]
    );

    // Return success
    res.status(201).json({
      message: `${selectedRoleName} user created successfully`,
      staff_id: staffId,
      role: selectedRoleName
    });
  } catch (error) {
    console.error("Error creating staff:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;

    // Check staff exists
    const staffExists = await query(
      `SELECT * FROM users WHERE id = ? AND status != 'deleted'`,
      [id]
    );

    if (staffExists.length === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }

    let updateFields = [];
    let values = [];

    if (username) {
      updateFields.push("username = ?");
      values.push(username);
    }
    if (email) {
      updateFields.push("email = ?");
      values.push(email);
    }
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      updateFields.push("password_hash = ?");
      values.push(hash);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    values.push(id);

    await query(
      `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`,
      values
    );

    res.json({ message: "Staff updated successfully" });
  } catch (error) {
    console.error("Update staff error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if staff exists
    const staff = await query(
      `SELECT * FROM users WHERE id = ?`,
      [id]
    );

    if (staff.length === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }
    
    // Remove from user_roles
    await query(`DELETE FROM user_roles WHERE user_id = ?`, [id]);

    // Remove from user_staff mapping
    await query(`DELETE FROM user_staff WHERE staff_id = ?`, [id]);

    // Delete the user
    await query(`DELETE FROM users WHERE id = ?`, [id]);

    res.json({ message: "Staff deleted successfully" });
  } catch (error) {
    console.error("Delete staff error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { createStaff, updateStaff, deleteStaff };
