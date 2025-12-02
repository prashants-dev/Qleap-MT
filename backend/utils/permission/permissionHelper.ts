import { Permission, PermissionName } from "./permission.model";
import { permissionToRoute } from "./permissionRouteMap";

export function generateAllowedRoutes(permissions: Permission[]) {
  const active = permissions.filter(p => p.is_deleted === 0);

  const allowed = active.map(p => {
    const key = p.name as PermissionName;
    return permissionToRoute[key] || [];
  });

  return [...new Set(allowed.flat())];
}
