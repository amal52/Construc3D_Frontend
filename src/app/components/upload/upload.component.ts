import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UploadDialogComponent } from './upload-dialog.component';
import { UploadService } from '../../services/upload.service';
import { lastValueFrom } from 'rxjs';

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
        <div class="hero-content">
          <h1 class="main-title">Transformez vos Designs 2D en Modèles 3D</h1>
          <p class="description">
            Notre plateforme utilise une technologie d'IA avancée pour convertir instantanément 
            vos créations 2D en modèles 3D époustouflants. Idéal pour les designers, 
            architectes et créatifs qui souhaitent donner vie à leurs projets.
          </p>
        </div>
      </div>

      <div class="upload-container">
        <mat-card class="upload-card" (click)="openUploadDialog()">
          <mat-card-header>
            <mat-card-subtitle>Transformez vos créations 2D en modèles 3D</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div 
              class="file-upload-container"
              [class.error]="hasError">
              <img 
                [src]="hasError ? 'assets/icons/error.svg' : 'assets/icons/upload.svg'"
                [alt]="hasError ? 'Erreur' : 'Télécharger'"
                class="upload-icon"
              >
              <p class="upload-text">{{ hasError ? errorMessage : 'Cliquez pour commencer le téléchargement' }}</p>
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
      min-height: 100vh;
      background-color: var(--background-color);
      padding: 40px 20px;
    }

    .hero-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      max-width: 1200px;
      margin: 0 auto 60px;
      padding: 0 20px;
      text-align: center;
    }

    .logo-container {
      margin-bottom: 30px;
    }
    
    .logo-3d {
      width: 180px;
      height: 180px;
      animation: float 3s ease-in-out infinite;
      filter: drop-shadow(0 10px 20px rgba(228, 153, 91, 0.2));
    }

    .hero-content {
      max-width: 800px;
    }

    .main-title {
      font-size: 2.5rem;
      color: var(--primary-color);
      margin-bottom: 22px;
      font-weight: 700;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      line-height: 1.2;
    }

    .description {
      font-size: 1.1rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 40px;
    }

    .upload-container {
      max-width: 1100px;
      margin: 0 auto;
    }

    .upload-card {
      width: 80%;
      max-width: 700px;
      max-height: 500px;
      padding: 25px;
      margin: 0 auto 30px;
      background-color: var(--surface-color);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .upload-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .file-upload-container {
      background-color: var(--surface-color);
      border: 2px dashed var(--border-color);
      border-radius: 12px;
      padding: 40px 24px;
      text-align: center;
      transition: all 0.3s ease;
      margin: 24px 0;
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
      border-radius: 12px;
      text-align: center;
      transition: transform 0.3s ease;
      border: 2px dashed var(--border-color);
    }

    .feature-card:hover {
      transform: translateY(-9px);
    }

    .feature-icon {
      width: 38px;
      height: 38px;
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
        transform: translateY(0px) rotate(0deg);
      }
      50% {
        transform: translateY(-20px) rotate(5deg);
      }
      100% {
        transform: translateY(0px) rotate(0deg);
      }
    }

    @media (max-width: 768px) {
      .hero-section {
        padding: 0;
      }

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
        width: 90%;
        padding: 24px;
      }

      .file-upload-container {
        padding: 32px 16px;
      }

      .logo-3d {
        width: 200px;
        height: 200px;
      }
    }
  `]
})
export class UploadComponent {
  uploading = false;
  uploadProgress = 0;
  hasError = false;
  errorMessage = '';
  private readonly ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml'];
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  constructor(
    private uploadService: UploadService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.uploadService.uploadProgress$.subscribe(progress => {
      this.uploadProgress = progress;
    });
  }

  openFileInput() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.png,.jpg,.jpeg,.svg';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        this.validateAndHandleFile(file);
      }
    };
    input.click();
  }
  openUploadDialog() {
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      width: '500px',
      panelClass: 'upload-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'local') {
        this.openFileInput();
      }
    });
  }

  private async validateAndHandleFile(file: File): Promise<void> {
    try {
      if (!file) {
        throw new Error('AUCUN_FICHIER');
      }
      this.hasError = false;
      this.errorMessage = '';

      if (!this.ALLOWED_TYPES.includes(file.type)) {
        throw new Error('FORMAT_NON_SUPPORTE');
      }
      if (file.size > this.MAX_FILE_SIZE) {
        throw new Error('TAILLE_MAX_DEPASSEE');
      }

      await this.handleFile(file);
    } catch (error) {
      this.handleValidationError(error);
    }
  }
  private handleValidationError(error: unknown): void {
    const errorMapping: { [key: string]: string } = {
      'AUCUN_FICHIER': 'Aucun fichier sélectionné.',
      'FORMAT_NON_SUPPORTE': 'Format de fichier non supporté. Utilisez PNG, JPG ou SVG.',
      'TAILLE_MAX_DEPASSEE': 'Fichier trop volumineux. Taille maximale : 10MB',
      'default': 'Erreur lors du traitement du fichier'
    };

    const message = error instanceof Error && error.message in errorMapping
      ? errorMapping[error.message]
      : errorMapping['default'];

    this.showError(message);
  }

  private async handleFile(file: File): Promise<void> {
    this.uploading = true;
    this.uploadProgress = 0;
  
    try {
      const validation = this.uploadService.validateFile(file);
      if (!validation.isValid) {
        this.showError(validation.error || 'Validation du fichier échouée.');
        return;
      }
  
      const uploadStream = this.uploadService.uploadLocalFile(file);
  
      const response = await lastValueFrom(uploadStream);
      console.log('Réponse du service de téléchargement:', response);
  
      if (response?.success) {
        this.snackBar.open('Fichier téléchargé avec succès!', 'Fermer', { duration: 5000 });
        this.router.navigate(['/customize']);
      } else {
        throw new Error('La réponse du serveur indique un échec.');
      }
    } catch (error: any) { // Notez le changement ici pour 'any'
      console.error('Erreur complète:', {
        message: error.message,
        name: error.name,
        stack: error.stack})
    } finally {
      this.uploading = false;
    }
  }

  private showError(message: string): void {
    this.hasError = true;
    this.errorMessage = message;
    this.snackBar.open(message, 'Fermer', { duration: 5000 });
  }
}