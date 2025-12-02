import { query } from "../config/db.js";

async function getUserRolesAndPermissions(userId) {
  const roles = await query(
    `SELECT r.name 
     FROM roles r
     JOIN user_roles ur ON ur.role_id = r.id
     WHERE ur.user_id = ?`,
    [userId]
  );

  

  // Ensure roles is always an array
  const roleList = Array.isArray(roles) ? roles : [];

  const roleNames = roleList.map((r) => r.name);

  if (roleNames.length === 0) {
    return { roleNames: [], permissions: [] };
  }

  const placeholders = roleNames.map(() => "?").join(",");

  const permissions = await query(
    `SELECT p.name, rp.is_deleted
     FROM permissions p
     JOIN role_permissions rp ON rp.permission_id = p.id
     JOIN roles r ON rp.role_id = r.id
     WHERE r.name IN (${placeholders})`,
    roleNames
  );

  const permissionList = Array.isArray(permissions) ? permissions : [];

  return {
    roleNames,
    permissions: permissionList.map((p) => ({
      name: p.name,
      is_deleted: p.is_deleted,
    })),
  };
}

export { getUserRolesAndPermissions };
