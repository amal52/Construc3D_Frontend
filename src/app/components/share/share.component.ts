import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatTooltipModule,
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
                <img src="assets/icons/copy.svg" alt="Copier" class="icon">
              </button>
            </div>
          </div>
          <div class="collaborators-section">
            <h3>Inviter des collaborateurs</h3>
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Adresse email</mat-label>
              <input matInput type="email" [(ngModel)]="newCollaborator">
              <button mat-icon-button matSuffix (click)="addCollaborator()">
                <img src="assets/icons/add-user.svg" alt="Ajouter" class="icon">
              </button>
            </mat-form-field>
            <div class="collaborators-list">
              <mat-chip-listbox [(ngModel)]="permission">
                <mat-chip *ngFor="let collaborator of collaborators" (removed)="removeCollaborator(collaborator)">
                  {{ collaborator }}
                  <button matChipRemove>
                    <img src="assets/icons/remove.svg" alt="Supprimer" class="icon">
                  </button>
                </mat-chip>
              </mat-chip-listbox>
            </div>
          </div>

          <div class="permissions-section">
            <h3>Permissions</h3>
            <mat-chip-listbox [(ngModel)]="permission">
              <mat-chip-option *ngFor="let perm of permissions" [value]="perm.value" matTooltip="{{ perm.description }}">
                {{ perm.label }}
              </mat-chip-option>
            </mat-chip-listbox>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .share-container {
      min-height: calc(50vh - 64px);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
    }

    .share-card {
      width: 100%;
      max-width: 600px;
      justify-content: space-between;
      padding: 32px;
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

    .icon {
      width: 24px;
      height: 24px;
    }

    .full-width {
      width: 100%;
    }

    .collaborators-list {
      margin-top: 16px;
    }

    mat-chip-option {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 5px 5px;
      cursor: pointer;
      transition: background 0.3s;
    }

    mat-chip-option:hover {
      background-color: #E4995B;
    }

    mat-chip-option.mat-mdc-chip-selected {
      background-color: var(--primary-color);
      color: white;
    }

    @media (max-width: 600px) {
      mat-chip-listbox {
        width: 50%;
      }
    }
  `]
})
export class ShareComponent {
    shareLink: string = 'https://example.com/share/model123';
    newCollaborator: string = '';
    collaborators: string[] = [];
    permission: string = 'view';

    permissions = [
        { value: 'view', label: 'Visualisation', description: 'Permet uniquement de voir le modèle' },
        { value: 'comment', label: 'Commentaires', description: 'Peut ajouter des commentaires' },
        { value: 'edit', label: 'Édition', description: 'Peut modifier le modèle' }
    ];

copyLink(input: HTMLInputElement) {
    input.select();
    navigator.clipboard.writeText(input.value);
}

addCollaborator() {
    if (this.newCollaborator && this.validateEmail(this.newCollaborator)) {
        this.collaborators.push(this.newCollaborator);
        this.newCollaborator = '';
    }
}

removeCollaborator(email: string) {
    this.collaborators = this.collaborators.filter(c => c !== email);
}

validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
}
