import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PermissionService } from '../../services/permission.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-access-permission',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './userAccessPermission.html',
  styleUrls: ['./userAccessPermission.css'],
})
export class UserAccessPermissionComponent implements OnInit {
  roles: any[] = [];
  permissions: any[] = [];

  constructor(
    private permissionService: PermissionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadPermissions();
  }

  loadPermissions() {
    this.permissionService.getAllPermissions().subscribe({
      next: (res) => {
        if (res?.data) {
          this.roles = res.data;
  
          // Collect unique permissions for table headers
          const allPerms = res.data.flatMap((r: any) => r.permissions);
          const uniqueMap = new Map();
          
          allPerms.forEach((p: any) => {
            // Filter out null/undefined permissions
            if (p && p.description && p.id) {
              uniqueMap.set(p.description, p);
            }
          });
          
          this.permissions = Array.from(uniqueMap.values());
        }
      },
      error: (err) => console.error('Error loading permissions:', err),
    });
  }

  hasPermission(role: any, permission: any): boolean {
    if (!role.permissions || !permission) return false;
    
    const match = role.permissions.find(
      (p: any) => p && p.description === permission.description
    );
    
    // Return true only if permission exists AND is_deleted is 0
    return match ? Number(match.is_deleted) === 0 : false;
  }

  togglePermission(role: any, permission: any, event: any) {
    const checked = event.target.checked;

    const payload = {
      role_id: role.role_id,
      permission_id: permission.id,
      is_deleted: checked ? 0 : 1,
    };

    this.permissionService.updatePermission(payload).subscribe({
      next: () => {
        console.log(
          `${role.role_name} ${checked ? 'granted' : 'revoked'} ${
            permission.name
          }`
        );

        // Update LOCAL user ONLY if this is the logged-in user's role
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

        // Check if this permission belongs to current logged-in user
        if (currentUser.roles?.includes(role.role_name)) {
          const updatedPermissions = currentUser.permissions.map((p: any) => {
            if (p.name === permission.name) {
              return { ...p, is_deleted: checked ? 0 : 1 };
            }
            return p;
          });

          // Update user object
          const updatedUser = {
            ...currentUser,
            permissions: updatedPermissions,
          };

          // This updates everywhere instantly (sidebar, UI, etc.)
          this.authService.updateUserState(updatedUser);
        }
      },
      error: (err) => console.error('Error updating permission:', err),
    });
  }
}