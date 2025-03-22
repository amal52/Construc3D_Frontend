import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

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
    <div class="upload-page">
      <div class="hero-section">
        <div class="logo-container">
          <img src="assets/icons/3d.png" alt="Logo 3D" class="logo-3d">
        </div>
        <h1 class="main-title">Transformez vos Designs 2D en Modèles 3D</h1>
        <p class="description">
          Notre plateforme utilise une technologie d'IA avancée pour convertir instantanément 
          vos créations 2D en modèles 3D époustouflants. Idéal pour les designers, 
          architectes et créatifs qui souhaitent donner vie à leurs projets.
        </p>
      </div>

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
              <img 
                [src]="hasError ? 'assets/icons/error.svg' : 'assets/icons/upload.svg'"
                [alt]="hasError ? 'Erreur' : 'Télécharger'"
                class="upload-icon"
              >
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
          </mat-card-content>
        </mat-card>

        <div class="features-grid">
          <div class="feature-card">
            <img src="assets/icons/speed.svg" alt="Rapide" class="feature-icon">
            <h3>Conversion Rapide</h3>
            <p>Transformez vos designs en quelques secondes</p>
          </div>
          <div class="feature-card">
            <img src="assets/icons/quality.svg" alt="Qualité" class="feature-icon">
            <h3>Haute Qualité</h3>
            <p>Résultats professionnels garantis</p>
          </div>
          <div class="feature-card">
            <img src="assets/icons/edit.svg" alt="Éditable" class="feature-icon">
            <h3>Entièrement Éditable</h3>
            <p>Personnalisez vos modèles 3D</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .upload-page {
      min-height: 80vh;
      background-color: var(--background-color);
      padding: 80px 5px;
    }

    .hero-section {
      text-align: center;
      max-width: 800px;
      margin: 0 auto 60px;
    }

    .logo-container {
      margin-bottom: 24px;
    }

    .logo-3d {
      width: 130px;
      height: 130px;
      animation: float 3s ease-in-out infinite;
    }

    .main-title {
      font-size: 2.5rem;
      color: var(--primary-color);
      margin-bottom: 24px;
      font-weight: 700;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .description {
      font-size: 1.2rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 40px;
    }

    .upload-container {
      max-width: 1500px;
      margin: 0 auto;
    }

    .upload-card {
      width: 100%;
      max-width: 700px;
      padding: 15px;
      margin: 0 auto 1px;
      background-color: var(--surface-color);
    }

    .file-upload-container {
      background-color: var(--surface-color);
      border: 2px dashed var(--border-color);
      border-radius: 12px;
      padding: 30px 24px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      margin: 44px 0;
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
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
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

    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-top: 60px;
    }

    .feature-card {
      background-color: var(--surface-color);
      padding: 24px;
      border: 2px dashed var(--border-color);
      border-radius: 30px;
      text-align: center;
      transition: transform 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
    }

    .feature-icon {
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    .feature-card h3 {
      color: var(--primary-color);
      margin-bottom: 8px;
      font-size: 1.2rem;
      
    }

    .feature-card p {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    @keyframes float {
      0% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
      100% {
        transform: translateY(0px);
      }
    }

    @media (max-width: 768px) {
      .main-title {
        font-size: 2rem;
      }

      .description {
        font-size: 1rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

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
}