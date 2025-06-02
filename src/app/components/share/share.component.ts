import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { ShareService } from '../../services/share.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    FormsModule
  ],
  template: `
    <div class="share-container">
      <mat-card class="share-card">
        <mat-card-header>
          <mat-card-title>Partager le Modèle 3D</mat-card-title>
          <mat-card-subtitle>Collaborez avec votre équipe en temps réel</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="share-link-section">
            <h3>Lien de partage</h3>
            <div class="link-container">
              <input type="text" [value]="shareLink" readonly #linkInput>
              <button mat-icon-button (click)="copyLink(linkInput)">
                <img src="assets/icons/copy.svg" alt="Copier" class="action-icon">
              </button>
            </div>
          </div>

          <div class="collaborators-section">
            <h3>Inviter des collaborateurs</h3>
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Adresse email</mat-label>
              <input matInput type="email" [(ngModel)]="newCollaborator">
              <button mat-icon-button matSuffix (click)="addCollaborator()">
                <img src="assets/icons/add-user.svg" alt="Ajouter" class="action-icon">
              </button>
            </mat-form-field>

            <div class="collaborators-list">
              <mat-chip-set>
                <mat-chip *ngFor="let collaborator of collaborators" (removed)="removeCollaborator(collaborator)">
                  {{collaborator}}
                  <button matChipRemove>
                    <img src="assets/icons/remove.svg" alt="Supprimer" class="chip-icon">
                  </button>
                </mat-chip>
              </mat-chip-set>
            </div>
          </div>

          <div class="permissions-section">
            <div class="permissions-options">
              <button mat-button [class.active]="permission === 'view'" (click)="setPermission('view')">
                Visualiser 
              </button>
              <button mat-button [class.active]="permission === 'comment'" (click)="setPermission('comment')">
                Commenter 
              </button>
              <button mat-button [class.active]="permission === 'edit'" (click)="setPermission('edit')">
                Éditer
              </button>
            </div>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button (click)="shareModel()">
            Partager
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .share-container {
      min-height: calc(50vh - 50px);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
    }

    .share-card {
      width: 100%;
      max-width: 600px;
      padding: 22px;
    }

    .share-link-section,
    .collaborators-section,
    .permissions-section {
      margin-bottom: 15px;
    }

    h3 {
      color: var(--primary-color);
      margin-bottom: 16px;
      font-size: 1.1rem;
    }

    .link-container {
      display: flex;
      gap: 8px;
      background-color: var(--surface-color);
      border-radius: 8px;
      padding: 8px;
    }

    .link-container input {
      flex: 1;
      background: none;
      border: none;
      color: var(--text-primary);
      padding: 8px;
      font-family: monospace;
    }

    .full-width {
      width: 100%;
    }

    .collaborators-list {
      margin-top: 16px;
    }

    .permissions-options {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .permissions-options button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 15px 10px;
    }

    .permissions-options button.active {
      background-color: var(--accent-color);
      color: var(--light-color);
    }

    .action-icon,
    .permission-icon,
    .chip-icon,
    .button-icon {
      width: 25px;
      height: 24px;
    }

    mat-card-actions {
      display: flex;
      justify-content: flex-end;
      padding: 16px 0 0;
    }

    @media (max-width: 600px) {
      .permissions-options {
        flex-direction: column;
      }

      .permissions-options button {
        width: 100%;
      }
    }
  `]
})
export class ShareComponent implements OnInit {
  modelId: string = '';
  shareLink: string = '';
  newCollaborator: string = '';
  collaborators: string[] = [];
  permission: 'view' | 'comment' | 'edit' = 'view';

  constructor(
    private shareService: ShareService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.modelId = params['id'];
      this.shareLink = `${window.location.origin}/viewer/${this.modelId}`;
      this.loadSharedUsers();
    });
  }

  async loadSharedUsers() {
    try {
      const response = await this.shareService.getSharedUsers(this.modelId).toPromise();
      this.collaborators = response.data.map((user: any) => user.email);
    } catch (error) {
      this.showError('Erreur lors du chargement des utilisateurs partagés');
    }
  }

  copyLink(input: HTMLInputElement) {
    input.select();
    document.execCommand('copy');
    this.showSuccess('Lien copié dans le presse-papier');
  }

  async addCollaborator() {
    if (this.newCollaborator && this.validateEmail(this.newCollaborator)) {
      try {
        await this.shareService.shareModel(
          this.modelId,
          this.newCollaborator,
          this.permission
        ).toPromise();

        this.collaborators.push(this.newCollaborator);
        this.newCollaborator = '';
        this.showSuccess('Invitation envoyée avec succès');
      } catch (error) {
        this.showError('Erreur lors de l\'envoi de l\'invitation');
      }
    } else {
      this.showError('Adresse email invalide');
    }
  }

  async removeCollaborator(email: string) {
    try {
      const response = await this.shareService.getSharedUsers(this.modelId).toPromise();
      const share = response.data.find((user: any) => user.email === email);
      
      if (share) {
        await this.shareService.removeShare(share.id).toPromise();
        this.collaborators = this.collaborators.filter(c => c !== email);
        this.showSuccess('Accès révoqué avec succès');
      }
    } catch (error) {
      this.showError('Erreur lors de la révocation de l\'accès');
    }
  }

  setPermission(permission: 'view' | 'comment' | 'edit') {
    this.permission = permission;
  }

  validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async shareModel() {
    if (this.newCollaborator && this.validateEmail(this.newCollaborator)) {
      try {
        await this.shareService.shareModel(
          this.modelId,
          this.newCollaborator,
          this.permission
        ).toPromise();
        
        this.collaborators.push(this.newCollaborator);
        this.newCollaborator = '';
        this.showSuccess('Modèle partagé avec succès');
      } catch (error) {
        this.showError('Erreur lors du partage du modèle');
      }
    } else {
      this.showError('Veuillez entrer une adresse email valide');
    }
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}
