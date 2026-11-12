import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'current_user';

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    let user: User | null = null;
    if (raw) {
      try {
        user = JSON.parse(raw) as User;
      } catch {
        user = null;
      }
    }

    // Se tiver token, enriquecer com dados do payload do JWT caso falte nome
    const token = this.getToken();
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          user = {
            id: user?.id || user?.user_id || payload.id,
            user_id: user?.user_id || user?.id || payload.id,
            email: user?.email || payload.email || '',
            first_name: user?.first_name || payload.first_name || '',
            last_name: user?.last_name || payload.last_name || '',
            role: user?.role || payload.role || '',
            space_id: user?.space_id || payload.space_id || '',
            space_name: user?.space_name || '',
            space_address: user?.space_address || '',
            utility_unit_number: user?.utility_unit_number || '',
          };
        }
      } catch {}
    }

    return user;
  }

  getSpaceId(): string {
    return this.getCurrentUser()?.space_id ?? '';
  }

  storeUser(user: Partial<User>): void {
    const current = this.getCurrentUser() || {};
    const updated: User = {
      ...current,
      ...user,
      id: user.id || user.user_id || current.id || current.user_id,
      user_id: user.user_id || user.id || current.user_id || current.id,
    };
    localStorage.setItem(this.USER_KEY, JSON.stringify(updated));
    this.currentUserSubject.next(updated);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const payload: LoginRequest = { email, password };
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((res: any) => {
        if (res.access_token) {
          localStorage.setItem(this.TOKEN_KEY, res.access_token);
        }
        const user: Partial<User> = {
          id: res.uid,
          user_id: res.uid,
          email: res.email || email,
          first_name: res.first_name || '',
          last_name: res.last_name || '',
          role: res.role,
          space_id: res.space_id || '',
        };
        this.storeUser(user);
        this.isLoggedInSubject.next(true);
        this.fetchProfile().subscribe();
      })
    );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      tap((res: any) => {
        const user: Partial<User> = {
          id: res?.user_id,
          user_id: res?.user_id,
          email: res?.email || data.email,
          first_name: res?.first_name || data.first_name,
          last_name: res?.last_name || data.last_name,
          space_id: res?.space_id,
          space_name: data.space_name,
          space_address: data.space_address,
          utility_unit_number: data.utility_unit_number,
        };
        this.storeUser(user);
      })
    );
  }

  fetchProfile(): Observable<User | null> {
    const token = this.getToken();
    if (!token) return of(null);
    return this.http.get<User>(`${this.apiUrl}/me`, { headers: this.getAuthHeaders() }).pipe(
      tap((profile) => {
        if (profile) {
          this.storeUser(profile);
        }
      }),
      catchError(() => of(null))
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, new_password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, new_password });
  }

  changePassword(current_password: string, new_password: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/change-password`,
      { current_password, new_password },
      { headers: this.getAuthHeaders() }
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }
}
