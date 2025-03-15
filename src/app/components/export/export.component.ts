import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-export',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  template: `
    <div class="export-container">
      <mat-card class="export-card">
        <mat-card-header>
          <mat-card-title>Exporter le Modèle 3D</mat-card-title>
          <mat-card-subtitle>Choisissez le format d'exportation souhaité</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <mat-form-field appearance="fill" class="format-select">
            <mat-label>Format d'exportation</mat-label>
            <mat-select [(ngModel)]="selectedFormat">
              <mat-option *ngFor="let format of exportFormats" [value]="format.value">
                {{ format.label }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <div class="format-info">
            <h3>Informations sur le format {{ getSelectedFormatLabel() }}</h3>
            <p>{{ getFormatDescription() }}</p>
          </div>

          <div class="export-options">
            <h3>Options d'exportation</h3>
            <div class="options-grid">
              <mat-form-field>
                <mat-label>Qualité</mat-label>
                <mat-select [(ngModel)]="quality">
                  <mat-option value="low">Basse</mat-option>
                  <mat-option value="medium">Moyenne</mat-option>
                  <mat-option value="high">Haute</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field>
                <mat-label>Échelle</mat-label>
                <mat-select [(ngModel)]="scale">
                  <mat-option value="1">1:1</mat-option>
                  <mat-option value="2">1:2</mat-option>
                  <mat-option value="4">1:4</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button mat-button color="primary" (click)="onCancel()">
            <mat-icon>arrow_back</mat-icon>
            Retour
          </button>
          <button mat-raised-button color="primary" (click)="onExport()">
            <mat-icon>file_download</mat-icon>
            Exporter
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .export-container {
      min-height: calc(100vh - 64px);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }

    .export-card {
      width: 100%;
      max-width: 600px;
      padding: 32px;
    }

    .format-select {
      width: 100%;
      margin-bottom: 24px;
    }

    .format-info {
      background-color: var(--surface-color);
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
    }

    .format-info h3 {
      color: var(--primary-color);
      margin-bottom: 8px;
    }

    .format-info p {
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .export-options {
      margin-top: 24px;
    }

    .export-options h3 {
      color: var(--primary-color);
      margin-bottom: 16px;
    }

    .options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    mat-card-actions {
      display: flex;
      justify-content: space-between;
      padding: 16px 0 0;
    }

    @media (max-width: 600px) {
      .options-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ExportComponent {
  selectedFormat: string = 'obj';
  quality: string = 'high';
  scale: string = '1';

  exportFormats = [
    { value: 'obj', label: 'Wavefront OBJ', description: 'Format standard pour l\'échange de modèles 3D, compatible avec la plupart des logiciels.' },
    { value: 'fbx', label: 'Autodesk FBX', description: 'Idéal pour l\'animation et les moteurs de jeu, conserve les hiérarchies et les animations.' },
    { value: 'stl', label: 'STL', description: 'Parfait pour l\'impression 3D et la fabrication assistée par ordinateur.' },
    { value: 'glb', label: 'GL Binary', description: 'Format optimisé pour le web et la réalité augmentée, compact et efficace.' }
  ];

  getSelectedFormatLabel(): string {
    return this.exportFormats.find(f => f.value === this.selectedFormat)?.label || '';
  }

  getFormatDescription(): string {
    return this.exportFormats.find(f => f.value === this.selectedFormat)?.description || '';
  }

  onExport() {
    console.log('Exporting model...', {
      format: this.selectedFormat,
      quality: this.quality,
      scale: this.scale
    });
  }

  onCancel() {
    console.log('Export cancelled');
  }
}