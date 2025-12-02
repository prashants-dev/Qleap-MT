import { PermissionName } from "./permission.model";

export const permissionToRoute: Record<PermissionName, string[]> = {
  MANAGE_ADS: ['/ads'],
  USER_CREATE: ['/users/create'],
  USER_DELETE: ['/users/delete'],
  USER_UPDATE: ['/users/update'],
  getAllUsers: ['/users'],
  VIEW_DASHBOARD: ['/dashboard'],
  "MEDIA-OWNER Dashboard": ['/media-owner'],
};
