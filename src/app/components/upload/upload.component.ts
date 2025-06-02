import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
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
    MatDialogModule,
    MatTooltipModule,
    MatRippleModule
  ],
  template: `
    <div class="upload-page">
      <div class="hero-section">
        <div class="content-wrapper">
          <div class="text-content">
            <h1 class="main-title">Transformez vos Designs 2D en Modèles 3D</h1>
            <p class="description">
              Notre plateforme utilise une technologie d'IA avancée pour convertir instantanément 
              vos créations 2D en modèles 3D époustouflants. Idéal pour les designers, 
              architectes et créatifs qui souhaitent donner vie à leurs projets.
            </p>
            <button class="learn-more-btn" (click)="scrollToFeatures()">
              <span class="circle" aria-hidden="true">
                <span class="icon arrow"></span>
              </span>
              <span class="button-text">En savoir plus</span>
            </button>
          </div>
          <div class="logo-container">
                <img src="assets/icons/3d.png" alt="Logo 3D" class="logo-3d">
          </div>
        </div>
      </div>
      <div class="upload-container">
        <mat-card class="upload-card" 
                  matRipple 
                  [matRippleCentered]="true"
                  (click)="openUploadDialog()"
                  (dragover)="onDragOver($event)"
                  (dragleave)="onDragLeave($event)"
                  (drop)="onDrop($event)"
                  [class.drag-over]="isDragging">
          <mat-card-header>
            <mat-card-subtitle>
              Transformez vos créations 2D en modèles 3D
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="file-upload-container"
                [class.error]="hasError"
                [class.has-preview]="previewUrl">
              <ng-container *ngIf="!previewUrl; else filePreview">
                <img [src]="hasError ? 'assets/icons/error.svg' : 'assets/icons/upload.svg'"
                    [alt]="hasError ? 'Erreur' : 'Télécharger'"
                    class="upload-icon">
                <p class="upload-text">{{ hasError ? errorMessage : 'Glissez-déposez votre fichier ici ou cliquez pour parcourir' }}</p>
                <p class="supported-formats">Formats supportés: PNG, JPG, SVG (Max: 10MB)</p>
              </ng-container>
              <ng-template #filePreview>
                <div class="preview-container">
                  <img [src]="previewUrl" alt="Aperçu" class="file-preview">
                  <button mat-icon-button class="remove-preview" 
                          (click)="removePreview($event)"
                          matTooltip="Supprimer">
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
              </ng-template>
            </div>
            <div class="progress-section" *ngIf="uploading">
              <div class="progress-header">
                <span class="progress-status">
                  <mat-icon class="spin">sync</mat-icon>
                  {{ getProgressStatus() }}
                </span>
                <span class="progress-percentage">En cours...</span>
              </div>
              <mat-progress-bar
                mode="indeterminate">
              </mat-progress-bar>
              <div class="progress-message">
                <p>La durée de conversion peut varier selon la complexité du modèle</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        <div class="features-grid" #featuresSection>
          <div class="feature-card" matRipple>
            <img src="assets/icons/speed.svg" alt="Rapide" class="feature-icon">
            <h3>Conversion Rapide</h3>
            <p>Transformez vos designs en quelques secondes grâce à notre IA optimisée</p>
          </div>
          <div class="feature-card" matRipple>
            <img src="assets/icons/quality.svg" alt="Qualité" class="feature-icon">
            <h3>Haute Qualité</h3>
            <p>Résultats professionnels avec préservation des détails</p>
          </div>
          <div class="feature-card" matRipple>
            <img src="assets/icons/edit.svg" alt="Éditable" class="feature-icon">
            <h3>Entièrement Éditable</h3>
            <p>Personnalisez vos modèles 3D avec nos outils avancés</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
.upload-page {
    min-height: 100vh;
    background-color: var(--background-color);
    padding: 110px 20px;

  }
  .content-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 80px;
    margin: 0 auto;
    max-width: 1400px;
  }
  .hero-section {
    max-width: 1400px;
    margin: 0 auto 80px;
    padding: 20px 20px;
  }
  .text-content {
    flex: 1.2;
    max-width: 800px;
  }
  .main-title {
    font-family: 'Playfair Display', serif;
    font-size: 3.5rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 30px;
    line-height: 1.2;
    background: linear-gradient(45deg, #FF9800, #381A0D);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  }

  .description {
    font-size: 1.3rem;
    line-height: 1.8;
    color: var(--text-secondary);
    margin-bottom: 40px;
    font-family: 'Roboto', sans-serif;
    opacity: 0.9;
  }

  .logo-container {
    flex: 0.8;
    display: flex;
    justify-content: center;
    align-items: center;
    perspective: 1000px;
  }

  .logo-3d {
    width: 280px;
    height: 280px;
    animation: float 5s ease-in-out infinite;
    filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.2));
    transform-style: preserve-3d;
  }

  /* Improved Button Styles */
  .learn-more-btn {
    display: inline-flex;
    align-items: center;
    padding: 15px 20px;
    background: #E4995B;
    border: none;
    border-radius: 200px;
    color: white;
    font-size: 1.1rem;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.9s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    letter-spacing: 1px;
    font-family: 'Playfair Display', serif;

  }

  .learn-more-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  .learn-more-btn:active {
    transform: translateY(1px);
  }

  .learn-more-btn mat-icon {
    margin-left: 8px;
    transition: transform 0.3s ease;
  }

  .learn-more-btn:hover mat-icon {
    transform: translateX(5px);
  }

  /* Rest of your existing styles... */

  @media (max-width: 992px) {
    .content-wrapper {
      flex-direction: column-reverse;
      text-align: center;
      gap: 40px;
    }

    .text-content {
      max-width: 100%;
    }

    .main-title {
      font-size: 2.8rem;
    }

    .description {
      font-size: 1.1rem;
      padding: 0 20px;
    }

    .logo-3d {
      width: 220px;
      height: 220px;
    }

    .learn-more-btn {
      margin: 0 auto;
    }
  }

  @media (max-width: 576px) {
    .main-title {
      font-size: 2.2rem;
    }

    .hero-section {
      padding: 40px 15px;
    }

    .logo-3d {
      width: 180px;
      height: 180px;
    }
  }
    .upload-container {
      max-width: 1100px;
      margin: 0 auto;
    }
    .upload-card {
      width: 80%;
      max-width: 700px;
      padding: 22px;
      margin: 0 auto 20px;
      background-color: var(--surface-color);
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    .upload-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .upload-card.drag-over {
      border: 2px dashed var(--primary-color);
      background-color: rgba(var(--primary-rgb), 0.05);
    }

    .file-upload-container {
      background-color: var(--surface-color);
      border: 2px dashed var(--border-color);
      border-radius: 12px;
      padding: 40px 24px;
      text-align: center;
      transition: all 0.3s ease;
      margin: 24px 0;
      position: relative;
    }

    .file-upload-container.error {
      border-color: var(--warn-color);
      background-color: rgba(var(--warn-rgb), 0.1);
    }

    .file-upload-container.has-preview {
      padding: 0;
      border-style: solid;
    }

    .preview-container {
      position: relative;
      width: 100%;
      height: 300px;
      overflow: hidden;
      border-radius: 10px;
    }

    .file-preview {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .remove-preview {
      position: absolute;
      top: 8px;
      right: 8px;
      background-color: rgba(0, 0, 0, 0.5) !important;
      color: white;
    }

    .upload-icon {
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      animation: bounce 2s infinite;
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

    .progress-section {
      margin-top: 24px;
      padding: 24px;
      background-color: var(--background-color);
      border-radius: 12px;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .progress-status {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--primary-color);
      font-weight: 500;
    }

    .progress-percentage {
      font-weight: 600;
      color: var(--primary-color);
    }

    .progress-message {
      margin-top: 16px;
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-style: italic;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-top: 60px;
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInUp 0.6s ease forwards;
    }

    .feature-card {
      background-color: var(--surface-color);
      padding: 32px 24px;
      border-radius: 12px;
      text-align: center;
      transition: all 0.3s ease;
      border: 2px solid var(--border-color);
      cursor: pointer;
    }

    .feature-card:hover {
      transform: translateY(-8px);
      border-color: var(--primary-color);
    }

    .feature-icon {
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      transition: transform 0.3s ease;
    }

    .feature-card:hover .feature-icon {
      transform: scale(1.1);
    }
    .feature-card h3 {
      color: var(--primary-color);
      margin-bottom: 12px;
      font-size: 1.3rem;
    }
    .feature-card p {
      color: var(--text-secondary);
      font-size: 1rem;
      line-height: 1.5;
    }
    .spin {
      animation: spin 1.5s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes float {
      0% {
        transform: translateY(0px) rotateY(0deg);
      }
      50% {
        transform: translateY(-20px) rotateY(180deg);
      }
      100% {
        transform: translateY(0px) rotateY(360deg);
      }
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
      60% {
        transform: translateY(-5px);
      }
    }

    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
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
        width: 95%;
        padding: 16px;
      }

      .file-upload-container {
        padding: 24px 16px;
      }

      .logo-3d {
        width: 140px;
        height: 140px;
      }
    }
  `]
})
export class UploadComponent {
  @ViewChild('featuresSection') featuresSection!: ElementRef;
  uploading = false;
  uploadProgress = 0;
  hasError = false;
  errorMessage = '';
  isDragging = false;
  previewUrl: string | null = null;
  
  readonly apiUrl = 'http://localhost:5000';
  private readonly ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024;

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

  scrollToFeatures(): void {
    this.featuresSection.nativeElement.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.validateAndHandleFile(files[0]);
    }
  }

  openFileInput(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.png,.jpg,.jpeg,.webp';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        this.validateAndHandleFile(file);
      }
    };
    input.click();
  }

  openUploadDialog(): void {
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

  removePreview(event: Event): void {
    event.stopPropagation();
    this.previewUrl = null;
  }

  getProgressStatus(): string {
    return 'Conversion en cours...';
  }

  private async validateAndHandleFile(file: File): Promise<void> {
    try {
      if (!file) throw new Error('AUCUN_FICHIER');

      this.hasError = false;
      this.errorMessage = '';

      if (!this.ALLOWED_TYPES.includes(file.type)) {
        throw new Error('FORMAT_NON_SUPPORTE');
      }

      if (file.size > this.MAX_FILE_SIZE) {
        throw new Error('TAILLE_MAX_DEPASSEE');
      }

      this.previewUrl = URL.createObjectURL(file);

      await this.handleFile(file);
    } catch (error) {
      this.handleValidationError(error);
    }
  }

  private handleValidationError(error: unknown): void {
    const errorMapping: { [key: string]: string } = {
      'AUCUN_FICHIER': 'Aucun fichier sélectionné.',
      'FORMAT_NON_SUPPORTE':
        'Format de fichier non supporté. Utilisez PNG, JPG ou WebP.',
      'TAILLE_MAX_DEPASSEE': 'Fichier trop volumineux. Taille maximale : 10 MB',
      default: 'Erreur lors du traitement du fichier'
    };

    const message =
      error instanceof Error && error.message in errorMapping
        ? errorMapping[error.message]
        : errorMapping['default'];

    this.showError(message);
  }

  private async handleFile(file: File): Promise<void> {
    this.uploading = true;

    try {
      const uploadResponse = await lastValueFrom(this.uploadService.uploadFile(file));

      if (!uploadResponse?.task_id) {
        throw new Error('La conversion a échoué : Aucun task_id reçu.');
      }

      const result = await this.pollForCompletion(uploadResponse.task_id);

      if (result.status === 'complete') {
        this.snackBar.open('Conversion terminée avec succès!', 'Fermer', {
          duration: 5000
        });
        
        const glbUrl = `${this.uploadService.apiUrl}${result.glb_file}`;
        const objUrl = `${this.uploadService.apiUrl}${result.obj_file}`;

        if (this.previewUrl) {
          URL.revokeObjectURL(this.previewUrl);
        }

        this.router.navigate(['/customize'], {
          state: { objUrl, glbUrl }
        });
      } else {
        throw new Error('La conversion a échoué ou na jamais démarré.');
      }
    } catch (error) {
      console.error('Erreur pendant la conversion:', error);
      this.showError('Une erreur est survenue lors de la conversion. Veuillez réessayer.');
    }
  }

  private async pollForCompletion(taskId: string): Promise<{
    status: string;
    obj_file?: string;
    glb_file?: string;
  }> {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const status = await lastValueFrom(this.uploadService.checkStatus(taskId));

          if (status.status === 'complete') {
            clearInterval(interval);
            resolve(status);
          }
        } catch (error) {
          clearInterval(interval);
          reject(error);
        }
      }, 3000);
    });
  }

  private showError(message: string): void {
    this.hasError = true;
    this.errorMessage = message;
    this.snackBar.open(message, 'Fermer', { duration: 5000 });
    
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
  }
}
