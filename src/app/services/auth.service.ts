import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  AUTH_TOKEN_STRING = 'auth-token';

  constructor() {}

  // Get token
  public getToken(): string {
    return localStorage.getItem(this.AUTH_TOKEN_STRING);
  }

  // Set token
  public setToken(token: string) {
    localStorage.setItem(this.AUTH_TOKEN_STRING, token);
  }

  // Get token data
  public getTokendata() {
    const token = this.getToken();
    if (token) {
      const data = jwt_decode(token);
      return data;
    }
    return {};
  }

  // Remove the token
  public removeToken() {
    localStorage.removeItem(this.AUTH_TOKEN_STRING);
  }
}
