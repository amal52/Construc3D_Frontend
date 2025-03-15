import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ShareComponent } from '../share/share.component';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <div class="upload-container">
      <mat-card class="upload-card">
        <mat-card-header>
          <mat-card-title>Soumettre un Design 2D</mat-card-title>
          <mat-card-subtitle>Transformez vos créations 2D en modèles 3D</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div 
            class="file-upload-container"
            [class.error]="hasError"
            (dragover)="onDragOver($event)"
            (drop)="onDrop($event)"
            (click)="fileInput.click()">
            <input
              #fileInput
              type="file"
              style="display: none"
              (change)="onFileSelected($event)"
              accept=".png,.jpg,.jpeg,.svg">
            <mat-icon [class.error-icon]="hasError" class="upload-icon">
              {{ hasError ? 'error' : 'cloud_upload' }}
            </mat-icon>
            <p class="upload-text">{{ hasError ? errorMessage : 'Glissez-déposez votre fichier ici ou cliquez pour sélectionner' }}</p>
            <p class="supported-formats">Formats supportés: PNG, JPG, SVG</p>
          </div>
          
          <div class="progress-container" *ngIf="uploading">
            <p class="upload-status">Téléchargement en cours... {{uploadProgress}}%</p>
            <mat-progress-bar
              mode="determinate"
              [value]="uploadProgress">
            </mat-progress-bar>
          </div>

          <div class="share-section" *ngIf="!uploading">
            <button mat-raised-button color="primary" (click)="openShareDialog()">
              <mat-icon>share</mat-icon>
              Partager avec l'équipe
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .upload-container {
      min-height: calc(90vh - 64px);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      background-color: var(--background-color);
    }

    .upload-card {
      width: 100%;
      max-width: 600px;
      padding: 32px;
      margin: auto;
    }

    .file-upload-container {
      background-color: var(--surface-color);
      border: 2px dashed var(--border-color);
      border-radius: 12px;
      padding: 40px 24px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      margin: 24px 0;
    }

    .file-upload-container:hover {
      border-color: var(--primary-color);
      transform: translateY(-2px);
    }

    .file-upload-container.error {
      border-color: var(--warn-color);
      background-color: rgba(146, 65, 24, 0.1);
    }

    .upload-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--primary-color);
      margin-bottom: 16px;
    }

    .upload-icon.error-icon {
      color: var(--warn-color);
    }

    .upload-text {
      font-size: 1.1rem;
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    .supported-formats {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .progress-container {
      margin-top: 24px;
      padding: 16px;
      background-color: var(--surface-color);
      border-radius: 8px;
    }

    .upload-status {
      margin-bottom: 12px;
      color: var(--primary-color);
      font-weight: 500;
    }

    .share-section {
      margin-top: 24px;
      text-align: center;
    }

    mat-card-title {
      color: var(--primary-color) !important;
      font-size: 1.5rem !important;
      margin-bottom: 8px !important;
    }

    @media (max-width: 768px) {
      .upload-card {
        padding: 24px;
      }

      .file-upload-container {
        padding: 32px 16px;
      }
    }
  `]
})
export class UploadComponent {
  uploading = false;
  uploadProgress = 0;
  hasError = false;
  errorMessage = '';
  readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  readonly ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml'];

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.validateAndHandleFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.validateAndHandleFile(file);
    }
  }

  validateAndHandleFile(file: File) {
    this.hasError = false;
    this.errorMessage = '';

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      this.showError('Format de fichier non supporté. Utilisez PNG, JPG ou SVG.');
      return;
    }

    if (file.size > this.MAX_FILE_SIZE) {
      this.showError('Fichier trop volumineux. Taille maximale : 10MB');
      return;
    }

    this.handleFile(file);
  }

  showError(message: string) {
    this.hasError = true;
    this.errorMessage = message;
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  handleFile(file: File) {
    this.uploading = true;
    this.uploadProgress = 0;
    
    const interval = setInterval(() => {
      if (this.uploadProgress < 100) {
        this.uploadProgress += 10;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          this.router.navigate(['/customize']);
        }, 500);
      }
    }, 500);
  }

  openShareDialog() {
    this.dialog.open(ShareComponent, {
      width: '500px',
      panelClass: 'share-dialog'
    });
  }
}