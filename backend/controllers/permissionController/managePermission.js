import { query } from "../../config/db.js";

const managePermissions = async (req, res) => {
  try {
    // Fetch all roles
    const roles = await query(`SELECT id, name FROM roles ORDER BY name`);
    
    // Fetch all permissions
    const allPermissions = await query(`
      SELECT id, name, description, resource 
      FROM permissions 
      ORDER BY id
    `);

    // Fetch existing role_permissions
    const rolePermissions = await query(`
      SELECT 
        rp.role_id,
        rp.permission_id,
        rp.is_deleted,
        rp.granted_by,
        rg.name AS granted_by_role
      FROM role_permissions rp
      LEFT JOIN roles rg ON rp.granted_by = rg.id
    `);

    // Create a map for quick lookup
    const permMap = new Map();
    rolePermissions.forEach(rp => {
      const key = `${rp.role_id}_${rp.permission_id}`;
      permMap.set(key, rp);
    });

    // Build response with all roles and all permissions
    const data = roles.map(role => {
      const permissions = allPermissions.map(perm => {
        const key = `${role.id}_${perm.id}`;
        const existingPerm = permMap.get(key);

        return {
          id: perm.id,
          name: perm.name,
          description: perm.description,
          resource: perm.resource,
          // If permission doesn't exist in role_permissions, default is_deleted = 1 (unchecked)
          is_deleted: existingPerm ? existingPerm.is_deleted : 1,
          granted_by: existingPerm ? existingPerm.granted_by_role : null,
        };
      });

      return {
        role_id: role.id,
        role_name: role.name,
        permissions: permissions,
      };
    });

    res.status(200).json({
      message: "Fetched all roles with permissions successfully",
      data: data,
    });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { managePermissions };