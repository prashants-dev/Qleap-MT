import { query } from "../config/db.js";

const getRoles = async (req, res) => {
  try {
    const { type } = req.query;
    // from auth middleware
    const userRoles = req.user?.roles || [];

    const ROLE_FILTER_MAP = {
      register: [2],
      ADVERTISER: [6, 3],
      MEDIA_OWNER: [5, 3],
      ADMIN: [2,3,4,5,6],
    };

    let sql;
    let params = [];

    let finalType = type;

    //If no type passed → fall back to logged-in user role
    if (!finalType && userRoles.length > 0) {
      finalType = userRoles[0];
    }

    if (!finalType) {
      sql = `
        SELECT id, name, description, created_at 
        FROM roles
      `;
    } else {
      const filterValues = ROLE_FILTER_MAP[finalType];

      // If no mapping → return empty array
      if (!filterValues) {
        return res.json({ success: true, data: [] });
      }

      const placeholders = filterValues.map(() => "?").join(",");

      sql = `
        SELECT id, name, description, created_at 
        FROM roles 
        WHERE is_system IN (${placeholders})
      `;
      params = filterValues;
    }

    const roles = await query(sql, params);

    return res.json({
      success: true,
      message: "Roles fetched successfully",
      data: roles,
    });
  } catch (error) {
    console.error("Get Roles Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching roles",
    });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Name and description are required",
      });
    }

    const sql = `
      UPDATE roles 
      SET name = ?, description = ?
      WHERE id = ? AND is_system = 0
    `;

    const result = await query(sql, [name, description, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Role not found or cannot update system role",
      });
    }

    return res.json({
      success: true,
      message: "Role updated successfully",
    });
  } catch (error) {
    console.error("Update Role Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the role",
    });
  }
};

const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Name and description are required",
      });
    }

    // Insert new role (is_system = 0 always for custom roles)
    const sql = `
      INSERT INTO roles (name, description, is_system)
      VALUES (?, ?, 0)
    `;

    const result = await query(sql, [name, description]);

    return res.json({
      success: true,
      message: "Role created successfully",
      role_id: result.insertId,
    });
  } catch (error) {
    console.error("Create Role Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the role",
    });
  }
};

const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
        DELETE FROM roles 
        WHERE id = ? AND is_system = 0
      `;

    const result = await query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Role not found or cannot delete system role",
      });
    }

    return res.json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    console.error("Delete Role Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the role",
    });
  }
};

export { getRoles, updateRole, createRole, deleteRole };
