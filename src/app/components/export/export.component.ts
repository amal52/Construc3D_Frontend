import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
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
        </mat-card-content>

        <mat-card-actions>
          <button mat-button color="primary" (click)="onCancel()">
            <img src="assets/icons/back.svg" alt="Retour" class="icon"> Retour
          </button>
          <button mat-raised-button color="primary" (click)="onExport()">
            <img src="assets/icons/download.svg" alt="Exporter" class="icon"> Exporter
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
    .icon {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
    mat-card-actions {
      display: flex;
      justify-content: space-between;
      padding: 16px 0 0;
    }
  `]
})
export class ExportComponent {
  selectedFormat: string = 'obj';
  exportFormats = [
    { value: 'obj', label: 'Wavefront OBJ', description: 'Format standard pour l\'échange de modèles 3D.' },
    { value: 'fbx', label: 'Autodesk FBX', description: 'Idéal pour l\'animation et les moteurs de jeu.' },
    { value: 'stl', label: 'STL', description: 'Parfait pour l\'impression 3D.' },
    { value: 'glb', label: 'GL Binary', description: 'Optimisé pour le web et la réalité augmentée.' }
  ];

  getSelectedFormatLabel(): string {
    return this.exportFormats.find(f => f.value === this.selectedFormat)?.label || '';
  }

  getFormatDescription(): string {
    return this.exportFormats.find(f => f.value === this.selectedFormat)?.description || '';
  }

  onExport() {
    console.log('Exporting model...', { format: this.selectedFormat });
  }

  onCancel() {
    console.log('Export cancelled');
  }
}
