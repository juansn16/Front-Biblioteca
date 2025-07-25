import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, tap, catchError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  data: {
    userId: string;
    name: string;
    email: string;
    role: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: string;
    refreshTokenExpiresIn: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_URL = environment.API_URL + '/api';
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user';

  public currentUser = signal<User | null>(null);
  public isAuthenticated = signal<boolean>(false);
  public isLoading = signal<boolean>(false);

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const user = localStorage.getItem(this.USER_KEY);
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (user && token && user !== "undefined") {
      try {
        this.currentUser.set(JSON.parse(user));
        this.isAuthenticated.set(true);
      } catch (e) {
        localStorage.removeItem(this.USER_KEY);
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.isLoading.set(true);
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.setAuthData(response);
          this.router.navigate(['/dashboard']);
        }),
        catchError(this.handleError.bind(this)),
        tap(() => this.isLoading.set(false))
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    this.isLoading.set(true);
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, userData)
      .pipe(
        tap(response => {
          this.setAuthData(response);
          this.router.navigate(['/dashboard']);
        }),
        catchError(this.handleError.bind(this)),
        tap(() => this.isLoading.set(false))
      );
  }

  refreshToken(): Observable<{ access_token: string }> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    return this.http.post<{ access_token: string }>(`${this.API_URL}/auth/refresh`, {
      refresh_token: refreshToken
    }).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.access_token);
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.id || null;
    } catch (e) {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  private setAuthData(authResponse: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResponse.tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, authResponse.tokens.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify({
      id: authResponse.data.userId,
      name: authResponse.data.name,
      email: authResponse.data.email,
      role: authResponse.data.role
    }));
    this.currentUser.set({
      id: authResponse.data.userId,
      name: authResponse.data.name,
      email: authResponse.data.email,
      role: authResponse.data.role
    });
    this.isAuthenticated.set(true);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.isLoading.set(false);
    let errorMsg = 'Ocurrió un error inesperado.';
    if (error.error && error.error.message) {
      errorMsg = error.error.message;
    }
    return throwError(() => new Error(errorMsg));
  }
}