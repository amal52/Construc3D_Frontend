import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, transition, style, animate } from '@angular/animations';
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
      
      <div class="upload-options" [@staggerAnimation]="upload_options.length">
        <div *ngFor="let option of upload_options; let i = index" 
             class="option-card" 
             matRipple 
             (click)="option.action()"
             [@cardAnimation]="{value: '', params: {delay: i * 100}}">
          <div class="option-icon">
            <img [src]="option.icon" [alt]="option.title">
          </div>
          <div class="option-content">
            <h3>{{ option.title }}</h3>
            <p>{{ option.description }}</p>
          </div>
        </div>
      </div>

      <div class="dialog-footer">
        <button mat-button class="cancel-button" (click)="onClose()">Annuler</button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      border-radius: 90px;

    }

    .upload-dialog {
      padding: 40px;
      max-width: 600px;
      width: 100%;
      border-radius: 40px;
      background: white;
      position: relative;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.1);
    }

    .dialog-header {
      text-align: center;
      margin-bottom: 40px;
      position: relative;
    }

    .dialog-header h2 {
      color: #ff7a00;
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 12px;
      letter-spacing: -0.5px;
    }

    .subtitle {
      color: #666;
      font-size: 16px;
      font-weight: 400;
      line-height: 1.5;
    }

    .upload-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
      position: relative;
    }

    .option-card {
      background: white;
      border: 2px solid #ff7a00;
      border-radius: 64px;
      padding: 32px 24px;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .option-card:hover {
      transform: translateY(-8px) scale(1.02);
      border-color: #ff9500;
      box-shadow: 0 20px 40px rgba(255, 122, 0, 0.1);
    }

    .option-icon {
      width: 80px;
      height: 80px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: rgba(255, 122, 0, 0.1);
      padding: 20px;
      transition: all 0.4s ease;
    }

    .option-card:hover .option-icon {
      transform: scale(1.1) rotate(5deg);
      background: rgba(255, 122, 0, 0.2);
    }

    .option-icon img {
      width: 40px;
      height: 40px;
      transition: all 0.4s ease;
    }

    .option-content {
      position: relative;
      z-index: 1;
    }

    .option-content h3 {
      color: #ff7a00;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 8px;
      transition: all 0.3s ease;
    }

    .option-content p {
      color: #666;
      font-size: 14px;
      line-height: 1.6;
      margin: 0;
      transition: all 0.3s ease;
    }

    .dialog-footer {
      display: flex;
      justify-content: center;
      margin-top: 32px;
    }

    .cancel-button {
      color: #ff7a00;
      font-weight: 500;
      font-size: 16px;
      padding: 12px 32px;
      border: 2px solid #ff7a00;
      border-radius: 16px;
      background: white;
      transition: all 0.3s ease;
    }

    .cancel-button:hover {
      background: rgba(255, 122, 0, 0.1);
      transform: translateY(-2px);
    }

    @media (max-width: 600px) {
      .upload-dialog {
        padding: 32px;
        border-radius: 30px;
      }

      .upload-options {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .option-card {
        padding: 24px;
      }

      .dialog-header h2 {
        font-size: 28px;
      }

      .option-icon {
        width: 64px;
        height: 64px;
      }
    }
  `],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms {{delay}}ms cubic-bezier(0.25, 0.8, 0.25, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerAnimation', [
      transition('* => *', [])
    ])
  ]
})
export class UploadDialogComponent {
  upload_options = [
    {
      title: 'Depuis l\'ordinateur',
      description: 'Sélectionnez un fichier local',
      icon: 'assets/icons/upload.svg',
      action: () => this.onLocalUpload()
    },
    {
      title: 'Depuis Google Drive',
      description: 'Importez depuis votre Drive',
      icon: 'assets/icons/google-drive.svg',
      action: () => this.onGoogleDriveUpload()
    }
  ];

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
          this.showErrorSnackbar('Échec de la connexion à Google Drive');
          return;
        }
      }

      const file = await this.googleDriveService.openPicker();
      if (file) {
        this.dialogRef.close({ source: 'drive', file });
      }
    } catch (error) {
      console.error('Erreur lors de l\'importation depuis Google Drive:', error);
      this.showErrorSnackbar('Erreur lors de l\'importation du fichier');
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  private showErrorSnackbar(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}