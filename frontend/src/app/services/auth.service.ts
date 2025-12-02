import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';  

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}


export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    phone: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;  
  private tokenKey = 'auth_token';

  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const token = this.getToken();
    const user = this.getUserFromStorage();
    if (token && user) {
      this.userSubject.next(user);
    }
  }

  // live update of user state
  updateUserState(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);  
  }

  register(data: { username: string; email: string; role: string; password: string }) {
    return this.http.post<{ message: string }>(
      `${environment.apiUrl}/register`,
      data
    );
  }

  login(data: { email: string; password: string }) {
    return this.http.post<{
      token: string;
      user: any;
    }>(`${environment.apiUrl}/login`, data);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getAllRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/roles`);
  }

  getUsersWithRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/users/with-roles`);
  }

  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, userData);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  private saveAuthData(response: AuthResponse) {
    this.saveToken(response.token);
    this.updateUserState(response.user); 
  }

  private saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  private getUserFromStorage() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }
}

