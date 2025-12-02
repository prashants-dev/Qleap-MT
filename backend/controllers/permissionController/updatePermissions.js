import { query } from "../../config/db.js";

export const updateRolePermission = async (req, res) => {
  try {
    const decodedUser = req.user;
    const roleName = decodedUser.roles?.[0];

    if (!roleName) {
      return res.status(400).json({ message: "Role name missing in token" });
    }

    // Fetch role_id for granted_by
    const [role] = await query(`SELECT id FROM roles WHERE name = ?`, [roleName]);
    if (!role) {
      return res.status(400).json({ message: "Invalid role name in token" });
    }

    const granted_by = role.id;
    const { role_id, permission_id, is_deleted } = req.body;

    if (!role_id || !permission_id) {
      return res.status(400).json({ message: "Missing role_id or permission_id" });
    }

    // Check if the permission already exists in role_permissions table
    const existingPermission = await query(
      `SELECT id FROM role_permissions 
       WHERE role_id = ? AND permission_id = ?`,
      [role_id, permission_id]
    );

    if (existingPermission.length > 0) {
      // Permission exists, update it
      await query(
        `UPDATE role_permissions 
         SET is_deleted = ?, granted_by = ?, updated_at = NOW() 
         WHERE role_id = ? AND permission_id = ?`,
        [is_deleted, granted_by, role_id, permission_id]
      );
    } else {
      // Permission doesn't exist, insert it
      await query(
        `INSERT INTO role_permissions (role_id, permission_id, granted_by, is_deleted, created_at, updated_at) 
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [role_id, permission_id, granted_by, is_deleted]
      );
    }

    res.json({ message: "Permission updated successfully" });
  } catch (error) {
    console.error("Error updating permission:", error);
    res.status(500).json({ error: error.message });
  }
};