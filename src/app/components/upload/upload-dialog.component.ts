import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GoogleDriveService } from '../../services/google-drive.service';

@Component({
  selector: 'app-upload-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatDialogModule, 
    MatIconModule,
    MatRippleModule
  ],
  template: `
    <div class="upload-dialog">
      <div class="dialog-header">
        <h2>Choisir une méthode de téléchargement</h2>
        <p class="subtitle">Sélectionnez la source de votre image 2D</p>
      </div>
      
      <div class="upload-options">
        <div class="option-card" matRipple (click)="onLocalUpload()">
          <div class="option-icon">
            <mat-icon>upload_file</mat-icon>
          </div>
          <div class="option-content">
            <h3>Depuis l'ordinateur</h3>
            <p>Sélectionnez un fichier local</p>
          </div>
        </div>

        <div class="option-card" matRipple (click)="onGoogleDriveUpload()">
          <div class="option-icon">
            <img src="assets/icons/google-drive.svg" alt="Google Drive">
          </div>
          <div class="option-content">
            <h3>Depuis Google Drive</h3>
            <p>Importez depuis votre Drive</p>
          </div>
        </div>
      </div>

      <div class="dialog-footer">
        <button mat-button (click)="onClose()">Annuler</button>
      </div>
    </div>
  `,
  styles: [`
    .upload-dialog {
      padding: 24px;
      max-width: 500px;
      width: 100%;
    }

    .dialog-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .dialog-header h2 {
      color: var(--primary-color);
      font-size: 24px;
      margin-bottom: 8px;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 16px;
    }

    .upload-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }

    .option-card {
      background-color: var(--surface-color);
      border: 2px solid var(--border-color);
      border-radius: 12px;
      padding: 24px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .option-card:hover {
      border-color: var(--primary-color);
      transform: translateY(-4px);
      box-shadow: 0 4px 12px var(--shadow-color);
    }

    .option-icon {
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .option-icon mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: var(--primary-color);
    }

    .option-icon img {
      width: 36px;
      height: 36px;
    }

    .option-content h3 {
      color: var(--text-primary);
      font-size: 18px;
      margin-bottom: 8px;
    }

    .option-content p {
      color: var(--text-secondary);
      font-size: 14px;
      margin: 0;
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }

    @media (max-width: 480px) {
      .upload-options {
        grid-template-columns: 1fr;
      }

      .option-card {
        padding: 16px;
      }
    }
  `]
})
export class UploadDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<UploadDialogComponent>,
    private googleDriveService: GoogleDriveService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onLocalUpload() {
    this.dialogRef.close('local');
  }

  async onGoogleDriveUpload() {
    try {
      if (!this.googleDriveService.isSignedIn()) {
        const signedIn = await this.googleDriveService.signIn();
        if (!signedIn) {
          this.snackBar.open('Échec de la connexion à Google Drive', 'Fermer', {
            duration: 3000
          });
          return;
        }
      }

      const file = await this.googleDriveService.openPicker();
      if (file) {
        this.dialogRef.close({ source: 'drive', file });
      }
    } catch (error) {
      console.error('Erreur lors de l\'importation depuis Google Drive:', error);
      this.snackBar.open('Erreur lors de l\'importation du fichier', 'Fermer', {
        duration: 3000
      });
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}