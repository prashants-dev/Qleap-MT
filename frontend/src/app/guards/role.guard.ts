import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: any): boolean {
    try {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!userData || !token) {
        alert('Please login first!');
        this.router.navigate(['/login']);
        return false;
      }

      const user = JSON.parse(userData);

      const userRoles = user.roles || [];
      const userPermissions = user.permissions || [];

      // Step 1: Check role match
      const allowedRoles = route.data?.['roles'] || [];
      const hasRole = allowedRoles.some((r: string) => userRoles.includes(r));

      if (!hasRole) {
        alert("You don't have the required role.");
        this.router.navigate(['/dashboard']);
        return false;
      }

      // Step 2: Check if ANY permission for this role is active
      const hasActivePermission = userPermissions.some(
        (p: any) => p.is_deleted === 0
      );

      if (!hasActivePermission) {
        alert('Your permission for this module is revoked.');
        this.router.navigate(['/dashboard']);
        return false;
      }

      return true;
    } catch (e) {
      console.error('Guard error:', e);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
