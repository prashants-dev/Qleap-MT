export interface Permission {
  name: string;
  is_deleted: number;  // 0 = active, 1 = deleted
}

export type PermissionName =
  | "MANAGE_ADS"
  | "USER_CREATE"
  | "USER_DELETE"
  | "USER_UPDATE"
  | "getAllUsers"
  | "VIEW_DASHBOARD"
  | "MEDIA-OWNER Dashboard";
