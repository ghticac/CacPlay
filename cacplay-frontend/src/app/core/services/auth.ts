import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

// Expandimos la interfaz para capturar los datos que enviará el SSO
interface LoginResponse {
  access: string;
  refresh: string;
  email?: string; // Nuevo: El email validado por WP
  rol?: string;   // Nuevo: El rol asignado por WP/Django
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private readonly ACCESS_KEY = 'access_token';
  private readonly REFRESH_KEY = 'refresh_token';
  private readonly USER_ROLE = 'user_role'; // Para persistir el rol sin llamar a perfil

  constructor(private http: HttpClient) {}

  // --- LOGIN TRADICIONAL (Se mantiene para administración interna) ---
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/token/`, {
      username: email,
      password
    }).pipe(
      tap((res) => this.saveTokens(res))
    );
  }

  // --- NUEVO: LOGIN SSO (WordPress) ---
  // Ahora el sso-callback recibirá el rol y email directamente en la respuesta
  loginWithSso(code: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/wordpress-sso/`, {
      code: code
    }).pipe(
      tap((res) => {
        this.saveTokens(res);
        if (res.rol) {
          localStorage.setItem(this.USER_ROLE, res.rol);
        }
      })
    );
  }

  private saveTokens(res: LoginResponse): void {
    if (res?.access && res?.refresh) {
      localStorage.setItem(this.ACCESS_KEY, res.access);
      localStorage.setItem(this.REFRESH_KEY, res.refresh);
    }
  }

  getPerfil(): Observable<any> {
    return this.http.get(`${this.API_URL}/perfil/`);
  }

  getToken(): string | null {
    return localStorage.getItem(this.ACCESS_KEY);
  }

  getRole(): string | null {
    return localStorage.getItem(this.USER_ROLE);
  }

  // 🌟 NUEVO MÉTODO: Validación para la sección privada del Layout
  isVip(): boolean {
    const rol = this.getRole();
    return rol === 'vip' || rol === 'superadmin';
  }

  logout(): void {
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem(this.USER_ROLE);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    // Blindaje extra: si el token accidentalmente contiene código PHP por error de WP, no estamos logueados
    if (token && token.includes('<?php')) {
      this.logout();
      return false;
    }
    return !!token;
  }
}
