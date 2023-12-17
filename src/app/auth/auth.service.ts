import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthErrors, LoginUser, RegisterUser, Token, User } from './auth.types';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { LocalStorageService } from '../local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user?: User;
  errors?: AuthErrors;

  constructor(
    private http: HttpClient,
    private readonly localStorageService: LocalStorageService
  ) {}

  async register(user: RegisterUser) {
    try {
      const registerResult = await firstValueFrom(
        this.http.post<User>(`${environment.apiUrl}/register`, user)
      );

      this.user = registerResult;

      return true;
    } catch (error: unknown) {
      this.errors = (error as HttpErrorResponse).error;

      return false;
    }
  }

  async login(user: LoginUser) {
    try {
      const loginResult = await firstValueFrom(
        this.http.post<User>(`${environment.apiUrl}/login`, user)
      );

      this.user = loginResult;

      this.saveUser();

      return this.user;
    } catch (error) {
      this.errors = {
        errors: [
          {
            rule: 'invalid',
            field: 'username/password',
            message: (error as HttpErrorResponse).error,
          },
        ],
      };

      return null;
    }
  }

  logout() {
    this.user = undefined;
    this.localStorageService.remove('token');
  }

  saveUser() {
    if (!this.user?.token) return;

    this.localStorageService.set('token', this.user.token);
  }

  getSavedToken(): Token | null {
    return this.localStorageService.get('token');
  }

  isUserConnected() {
    if (this.user) {
      this.saveUser();
      return true;
    }

    return !!this.user;
  }

  getHeaders(token = this.getSavedToken()?.token) {
    if (!token) return {};

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  async getUser() {
    const savedToken = this.getSavedToken();

    if (savedToken) {
      this.user = await firstValueFrom(
        this.http.get<User>(
          `${environment.apiUrl}/user`,
          this.getHeaders(savedToken.token)
        )
      );
    }

    return this.user;
  }
}
