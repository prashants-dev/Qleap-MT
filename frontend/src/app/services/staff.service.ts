import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface CreateStaffRequest {
  username: string;
  email: string;
  role: string;
  password: string;
}

interface CreateStaffResponse {
  message: string;
  staff_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  private apiUrl = `${environment.apiUrl}/staff`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createStaff(data: CreateStaffRequest): Observable<CreateStaffResponse> {
    return this.http.post<CreateStaffResponse>(
      `${this.apiUrl}/create`,
      data,
      { headers: this.getHeaders() }
    );
  }

  getAllStaff(): Observable<any> {
    return this.http.get(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  getStaffById(userId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/${userId}`,
      { headers: this.getHeaders() }
    );
  }

  deleteStaff(userId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${userId}`,
      { headers: this.getHeaders() }
    );
  }

  updateStaff(data: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${data.user_id}`,
      data,
      { headers: this.getHeaders() }
    );
  }
}