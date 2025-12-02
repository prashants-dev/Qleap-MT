import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { DashboardComponent } from './dashboard/dashboard';
import { AdminComponent } from './admin/admin';
import { AdvertisersDashboardComponent } from './advertisers/advertisers';
import { MediaOwnersDashboardComponent } from './mediaOwners/mediaOwners';
import { RoleGuard } from './guards/role.guard';
import { StaffManagementComponent } from './dashboard/staffManagement/staffManagement';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'SUPER_ADMIN'] },
  },
  {
    path: 'mediaOwners',
    component: MediaOwnersDashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'MEDIA_OWNER'] },
  },
  {
    path: 'advertisers',
    component: AdvertisersDashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'ADVERTISER'] },
  },
  {
    path: 'staffManagement',
    component: StaffManagementComponent,
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
