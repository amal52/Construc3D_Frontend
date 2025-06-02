import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { routes } from './app/app.routes';
//import { UserService, UserProfile } from './app/services/user.service';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  template: `
    <mat-toolbar>
      <!-- <button mat-button (click)="goToProfile()" class="user-profile-btn">
        <div class="user-avatar">
          <img src="assets/icons/user.svg" [alt]="userProfile?.email">
        </div>
        <span class="user-name">{{ userProfile?.email }}</span>
      </button>

      <button mat-icon-button [matMenuTriggerFor]="userMenu" class="settings-btn">
        <mat-icon>settings</mat-icon>
      </button> -->

      <!-- <mat-menu #userMenu="matMenu" class="user-menu">
        <div class="user-menu-header">
          <div class="user-avatar large">
            <img src="assets/icons/user.svg" [alt]="userProfile?.email">
          </div>
          <div class="user-info">
            <h3>{{ userProfile?.email }}</h3>
            <p>Dernière connexion: {{ userProfile?.last_login | date }}</p>
          </div>
        </div>
        <mat-divider></mat-divider>
        <div class="user-menu-content">
          <button mat-menu-item routerLink="/settings">
            <mat-icon>settings</mat-icon>
            <span>Paramètres</span>
          </button>
          <button mat-menu-item>
            <mat-icon>help</mat-icon>
            <span>Aide</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()" class="logout-item">
            <mat-icon color="warn">exit_to_app</mat-icon>
            <span>Déconnexion</span>
          </button>
        </div>
      </mat-menu> -->
    </mat-toolbar>

    <router-outlet></router-outlet>
  `,
  styles: [`
    mat-toolbar {
      display: flex;
      align-items: center;
      padding: 0 16px;
      background: var(--surface-color);
      border-bottom: 1px solid var(--border-color);
      height: 64px;
    }

    .user-profile-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      border-radius: 24px;
      transition: all 0.3s ease;
      margin-right: 8px;
    }

    .user-profile-btn:hover {
      background: rgba(var(--primary-rgb), 0.1);
    }

    .settings-btn {
      margin-left: auto;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--primary-color);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .user-avatar.large {
      width: 84px;
      height: 84px;
    }

    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-name {
      font-weight: 500;
      margin: 0 4px;
    }

    ::ng-deep .user-menu {
      max-width: 520px;
      padding: 10px;
    }

    .user-menu-header {
      padding: 24px;
      background: rgba(var(--primary-rgb), 0.1);
      text-align: center;
    }

    .user-info {
      margin-top: 16px;
    }

    .user-info h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 500;
    }

    .user-info p {
      margin: 4px 0;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .user-menu-content {
      padding: 8px 0;
    }

    .logout-item {
      color: var(--warn-color);
    }

    @media (max-width: 600px) {
      .user-name {
        display: none;
      }
    }
  `]
})
export class App {
  private router = inject(Router);
  // private userService = inject(UserService);
  
  // userProfile: UserProfile | null = null;

  // constructor() {
  //   //this.userService.userProfile$.subscribe(profile => {
  //    // this.userProfile = profile;
  //   });
  // }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    //this.userService.clearProfile();
    this.router.navigate(['/login']);
  }
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
  ]
}).catch(err => console.error(err));
