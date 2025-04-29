import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Component} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { routes } from './app/app.routes';
import { ThemeService } from './app/services/theme.service';
import { FirebaseService } from './app/services/firebase.service';
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
    
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Construc3D</span>
      <span class="toolbar-spacer"></span>
      
      <button mat-icon-button [matMenuTriggerFor]="themeMenu">
      <img src="assets/icons/edit.svg" alt="Qualité" class="feature-icon">

</button>
      
      <mat-menu #themeMenu="matMenu">
        <button mat-menu-item 
          *ngFor="let theme of themeService.availableThemes" 
          (click)="themeService.setTheme(theme)">
          {{ theme }}
        </button>
      </mat-menu>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .toolbar-spacer {
      flex: 1 1 auto;
    }
    
    mat-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    mat-icon {
      color: white; 
    }

    .theme-toggle {
      margin-left: 8px;
    }
  `]
})
export class App {
  constructor(
    public themeService: ThemeService,
  ) {}

}
bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    ThemeService,
    provideHttpClient(),// Activer HttpClient

  ]
}).catch(err => console.error(err));