import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private apiUrl = `${environment.apiUrl}/managePermissions`; 

  constructor(private http: HttpClient) {}

  getAllPermissions(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(this.apiUrl, { headers });
  }
getToken() {
  return localStorage.getItem('token'); // or sessionStorage
}

updatePermission(payload: any) {
  const headers = {
    Authorization: `Bearer ${this.getToken()}`
  };
  return this.http.put(`${environment.apiUrl}/permissions/update`, payload, { headers });
}
}