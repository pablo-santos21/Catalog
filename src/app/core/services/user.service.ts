import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userUrl = 'http://localhost:5062/v1/auth';
  private clientUrl = 'http://localhost:4200';
  private tokenKey = 'Bearer';

  private refreshUrl = 'http://localhost:5062/v1/auth';
  private refreshTokenKey = 'refreshToken';

  constructor(private client: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<User> {
    return this.client
      .post<User>(`${this.userUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          if (response.token) {
            this.setToken(response.token);
            this.setRefreshToken(response.refreshToken);
            this.autoRefreshToken();
          }
        })
      );
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, `${token}`);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  refreshToken(): Observable<User> {
    const refreshToken = this.getRefreshToken();
    const accessToken = this.getToken();

    return this.client
      .post<User>(`${this.refreshUrl}/refresh-token`, {
        accessToken,
        refreshToken,
      })
      .pipe(
        tap({
          next: (response) => {
            if (response.token && response.refreshToken) {
              this.setToken(response.token);
              this.setRefreshToken(response.refreshToken);
              this.autoRefreshToken();
            }
          },
          error: (err) => {
            console.error('Error refreshing token:', err);
            this.logout();
          },
        })
      );
  }

  autoRefreshToken(): void {
    const token = this.getToken();
    if (!token) {
      return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiration = payload.exp * 1000;

    const timeout = expiration - Date.now() - 60 * 1000;

    setTimeout(() => {
      this.refreshToken().subscribe();
    }, timeout);
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.refreshTokenKey);
    } else {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiration = payload.exp * 1000;
    return Date.now() < expiration;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.router.navigate(['/login']);
  }

  register(
    userName: string,
    email: string,
    password: string,
    clienturi: string = `${this.userUrl}/ConfirmEmail`
  ): Observable<User> {
    return this.client
      .post<User>(`${this.userUrl}/register`, {
        userName,
        email,
        password,
        clienturi,
      })
      .pipe(
        tap((response) => {
          if (response.token) {
            this.setToken(response.token);
            this.setRefreshToken(response.refreshToken);
            this.autoRefreshToken();
          }
        })
      );
  }

  forgotPassword(email: string): Observable<void> {
    const clientUri = `${this.clientUrl}/resetpassword`; // URL de callback
    return this.client.post<void>(`${this.userUrl}/forgotpassword`, {
      email,
      clientUri,
    });
  }

  resetPassword(data: {
    email: string | null;
    token: string | null;
    password: string;
    confirmPassword: string;
  }): Observable<any> {
    return this.client.post(`${this.userUrl}/resetpassword`, data);
  }
}
