import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { routes } from './app/app.routes';
import { ThemeService } from './app/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Construc3D</span>
      <span class="toolbar-spacer"></span>
      <button mat-icon-button (click)="toggleTheme()" class="theme-toggle">
        <img 
          [src]="(themeService.isDarkTheme$ | async) ? 'assets/icons/sun.svg' : 'assets/icons/moon.svg'"
          [class.dark]="themeService.isDarkTheme$ | async"
          alt="Theme toggle"
          class="theme-icon"
        >
      </button>
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

    .theme-icon {
      width: 24px;
      height: 24px;
      filter: invert(1);
    }

    .theme-icon.dark {
      filter: invert(0);
    }

    .theme-toggle {
      margin-left: 8px;
    }
  `]
})
export class App {
  constructor(public themeService: ThemeService) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    ThemeService
  ]
}).catch(err => console.error(err));