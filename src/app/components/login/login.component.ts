import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatSnackBarModule
  ],
  template: `
    <div class="login-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Connexion</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="onLogin()">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" [(ngModel)]="email" name="email" required>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Mot de passe</mat-label>
              <input matInput type="password" [(ngModel)]="password" name="password" required>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" [disabled]="isLoading">
              {{ isLoading ? 'Connexion...' : 'Se connecter' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f5f5f5;
    }
    mat-card {
      max-width: 400px;
      width: 90%;
      padding: 20px;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    mat-card-title {
      margin-bottom: 20px;
    }
    mat-form-field {
      width: 100%;
    }
    button {
      width: 100%;
      padding: 8px;
    }
  `]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onLogin() {
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
}