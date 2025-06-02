import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
//import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenSubject = new BehaviorSubject<string | null>(this.getStoredToken());
  private rememberMeSubject = new BehaviorSubject<boolean>(this.getStoredRememberMe());

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    //private userService: UserService
  ) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response.data?.token) {
          this.setToken(response.data.token);
         // this.userService.loadUserProfile().subscribe();
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    //this.userService.clearProfile();
    this.router.navigate(['/login']);
    this.snackBar.open('Déconnexion réussie', 'Fermer', { duration: 3000 });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }).pipe(
      tap(() => {
        this.snackBar.open('Email de réinitialisation envoyé', 'Fermer', { duration: 3000 });
      }),
      catchError(error => this.handleError(error))
    );
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword }).pipe(
      tap(() => {
        this.snackBar.open('Mot de passe réinitialisé avec succès', 'Fermer', { duration: 3000 });
      }),
      catchError(error => this.handleError(error))
    );
  }

  handleGoogleSignIn(credential: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/google-auth`, { credential }).pipe(
      tap((response: any) => {
        if (response.token) {
          this.setToken(response.token);
          //this.userService.loadUserProfile().subscribe();
          this.router.navigate(['/dashboard']);
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  setRememberMe(remember: boolean): void {
    localStorage.setItem('rememberMe', remember.toString());
    this.rememberMeSubject.next(remember);
  }

  getRememberMe(): Observable<boolean> {
    return this.rememberMeSubject.asObservable();
  }

  private getStoredRememberMe(): boolean {
    return localStorage.getItem('rememberMe') === 'true';
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.status === 401) {
      errorMessage = 'Email ou mot de passe incorrect';
    } else if (error.status === 0) {
      errorMessage = 'Impossible de contacter le serveur';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }

    this.snackBar.open(errorMessage, 'Fermer', { duration: 5000 });
    return throwError(() => error);
  }
}