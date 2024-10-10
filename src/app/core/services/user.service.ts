import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User } from '../../models/user';
import { UpdateUserDTO } from '../../DTOs/update-user-dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private mainUrl = 'http://localhost:5062/v1';
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
            // this.autoRefreshToken();
          }
        })
      );
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, `${token}`);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.refreshTokenKey);
    } else {
      return null;
    }
  }

  refreshToken(): Observable<User> {
    const refreshToken = this.getRefreshToken();
    const accessToken = this.getToken();

    if (!accessToken || !refreshToken) {
      this.logout();
    }

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

    const timeout = expiration - Date.now() - 2 * 60 * 1000;

    setTimeout(() => {
      this.refreshToken().subscribe();
    }, timeout);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiration = payload.exp * 1000;
    const isExpiringSoon = expiration - Date.now() < 2 * 60 * 1000; // Considerar renovação se faltam 2 min
    if (isExpiringSoon) {
      this.refreshToken().subscribe();
    }
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
    clienturi: string = `${this.userUrl}/ConfirmEmail`,
    role: string = 'Customer'
  ): Observable<User> {
    return this.client
      .post<User>(`${this.userUrl}/register`, {
        userName,
        email,
        password,
        clienturi,
        role,
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

  changePassword(
    id: string,
    currentPassword: string,
    newPassword: string
  ): Observable<any> {
    const token = localStorage.getItem('Bearer'); // Obtendo o token do localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', // Adicionando o cabeçalho de tipo de conteúdo
    });

    return this.client.post<any>(
      `${this.userUrl}/changepassword`, // Ajuste o endpoint conforme necessário
      { currentPassword, newPassword }, // Dados que você quer enviar
      { headers } // Cabeçalhos da requisição
    );
  }

  getUserDetailsFromToken(): { name: string; role: string } | null {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const name = payload.id || '';
      const role = payload.role || '';
      return { name, role };
    }
    return null;
  }

  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const id = payload.nameid || '';
      return id; // Retorna o ID ou null se estiver vazio
    }
    return null;
  }

  getUserInfoFromToken(): { id: string; name: string; email: string } | null {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const id = payload.nameid || '';
      const name = payload.unique_name || '';
      const email = payload.email || '';
      return { id, name, email }; // Retorna o ID ou null se estiver vazio
    }
    return null;
  }

  getUser(): Observable<User> {
    const userId = this.getUserIdFromToken();
    if (!userId) {
      throw new Error('Usuário não autenticado'); // Lança erro se o usuário não estiver autenticado
    }
    return this.client.get<User>(`${this.mainUrl}/user/${userId}`); // Faz a requisição com o ID
  }

  updateUser(id: string, updateUserDTO: UpdateUserDTO): Observable<any> {
    const url = `${this.mainUrl}/user/${id}`;

    return this.client.put(url, updateUserDTO, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  updateSocial(id: string, social: UpdateUserDTO): Observable<UpdateUserDTO> {
    const token = localStorage.getItem('Bearer');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.client.put<UpdateUserDTO>(
      `${this.mainUrl}/user/${id}`,
      social,
      {
        headers,
      }
    );
  }

  addUserToRole(email: string, roleName: string): Observable<any> {
    const url = `${this.userUrl}/addusertorole?email=${encodeURIComponent(
      email
    )}&roleName=${encodeURIComponent(roleName)}`;

    const token = localStorage.getItem('Bearer'); // Recupera o token JWT do localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: '*/*', // Define o cabeçalho Accept
    });

    return this.client.post(url, {}, { headers }); // Envia a requisição POST com os parâmetros e cabeçalhos
  }
}
