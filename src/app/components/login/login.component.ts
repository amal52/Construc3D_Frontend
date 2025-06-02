import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatCheckboxModule,
    FormsModule,
    MatSnackBarModule,
    RouterModule
  ],
  template: `
    <div class="login-container">
    <div class="background"></div>
      <mat-card class="login-card" [class.loading]="isLoading">
        <mat-card-header>
          <div class="logo-container">
            <img src="assets/icons/user.svg" alt="Logo" class="logo">
          </div>
        </mat-card-header>

        <mat-card-content>
          <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="login-form">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input 
                matInput 
                type="email" 
                [(ngModel)]="email" 
                name="email" 
                required 
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                #emailInput="ngModel"
                [disabled]="isLoading">
              <mat-icon matPrefix>email</mat-icon>
              <mat-error *ngIf="emailInput.invalid && emailInput.touched">
                {{ getEmailErrorMessage(emailInput) }}
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Mot de passe</mat-label>
              <input 
                matInput 
                [type]="showPassword ? 'text' : 'password'" 
                [(ngModel)]="password" 
                name="password" 
                required
                minlength="6"
                #passwordInput="ngModel"
                [disabled]="isLoading">
              <mat-icon matPrefix>lock</mat-icon>
              <button 
                mat-icon-button 
                matSuffix 
                type="button"
                (click)="togglePasswordVisibility()">
                <mat-icon>{{ showPassword ? 'visibility' : 'visibility_off' }}</mat-icon>
              </button>
              <mat-error *ngIf="passwordInput.invalid && passwordInput.touched">
                Le mot de passe doit contenir au moins 6 caractères
              </mat-error>
            </mat-form-field>

            <div class="form-actions">
              <mat-checkbox 
                [(ngModel)]="rememberMe" 
                name="rememberMe"
                [disabled]="isLoading">
                Se souvenir de moi
              </mat-checkbox>
              <br>
              <a (click)="forgotPassword()" class="forgot-password">Mot de passe oublié ?</a>
            </div>

            <button 
              mat-raised-button 
              type="submit" 
              [disabled]="loginForm.invalid || isLoading"
              class="login-button">
            
              <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
              <span *ngIf="!isLoading">Se connecter</span>
            </button>
          </form>
        </mat-card-content>

        <mat-card-footer>
          <p class="signup-text">
            Pas encore de compte ? 
            <a routerLink="/signup">Créer un compte</a>
          </p>

        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: [`
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.login-card {
  max-width: 400px;
  width: 100%;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.5) !important;
}

    .login-card.loading {
      opacity: 0.7;
      pointer-events: none;
      
    }

    .logo-container {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }

    .logo {
      width: 84px;
      height: 64px;
    }

    mat-card-title {
      font-size: 24px;
      text-align: center;
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    mat-card-subtitle {
      text-align: center;
      color: var(--text-secondary);
      margin-bottom: 24px;
    }
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      
    }

    mat-form-field {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
    }

    .forgot-password {
      color:#381A0D;
      text-decoration: none;
      font-size: 14px;
      transition: color 0.3s ease;
      cursor: pointer;
    }

    .forgot-password:hover {
      color:  #381A0D !important;
      text-decoration: underline;
    }

    .login-button {
      width: 100%;
      height: 48px;
      font-size: 16px;
      border-radius: 24px;
      transition: all 0.3s ease;
      background-color:  #D2753A;

    }

    .login-button:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px var(--shadow-color);
      background-color: #381A0D !important; 
    }

    .signup-text {
      text-align: center;
      margin-top: 24px;
      color: var(--text-secondary);
      font-size: 14px;
    }

    .signup-text a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .signup-text a:hover {
      color: var(--accent-color);
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private themeService: ThemeService
  ) {}

  getEmailErrorMessage(input: any): string {
    if (input.errors?.required) {
      return 'Email est requis';
    }
    if (input.errors?.pattern) {
      return 'Email invalide';
    }
    return '';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    if (!this.email || !this.password) {
      this.snackBar.open('Veuillez remplir tous les champs', 'Fermer', {
        duration: 3000
      });
      return;
    }

    this.isLoading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.data?.token) {
          this.authService.setToken(response.data.token);
          if (this.rememberMe) {
            this.authService.setRememberMe(true);
          }
          this.router.navigate(['/upload']);
          this.snackBar.open('Connexion réussie', 'Fermer', {
            duration: 3000
          });
        } else {
          throw new Error('Token non reçu');
        }
      },
      error: (error) => {
        console.error('Erreur de connexion:', error);
        let message = 'Erreur de connexion';
        
        if (error.status === 401) {
          message = 'Email ou mot de passe incorrect';
        } else if (error.status === 0) {
          message = 'Impossible de contacter le serveur';
        }
        
        this.snackBar.open(message, 'Fermer', {
          duration: 5000
        });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  

  forgotPassword(): void {
    if (!this.email) {
      this.snackBar.open('Veuillez entrer votre email', 'Fermer', {
        duration: 3000
      });
      return;
    }

    this.isLoading = true;
    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.snackBar.open('Un email de réinitialisation a été envoyé', 'Fermer', {
          duration: 5000
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.snackBar.open('Erreur lors de l\'envoi de l\'email', 'Fermer', {
          duration: 5000
        });
        this.isLoading = false;
      }
    });
  }
}