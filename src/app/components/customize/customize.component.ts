import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customize',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  template: `
    <div class="customize-container">
      <mat-card class="controls-panel">
        <mat-card-header>
          <mat-card-title>Personnalisation du Modèle 3D</mat-card-title>
          <mat-card-subtitle>Ajustez les paramètres pour personnaliser votre modèle</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <mat-tab-group dynamicHeight>
            <!-- Onglet Apparence -->
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon class="tab-icon"></mat-icon>
                Apparence
              </ng-template>
              
              <div class="tab-content">
                <div class="control-group">
                  <label>Couleur Principale</label>
                  <div class="color-picker">
                    <input type="color" [(ngModel)]="mainColor" (change)="updateModel()">
                    <span class="color-value">{{mainColor}}</span>
                  </div>
                </div>

                <div class="control-group">
                  <label>Texture</label>
                  <mat-form-field appearance="fill" class="full-width">
                    <mat-select [(ngModel)]="selectedTexture" (selectionChange)="updateModel()">
                      <mat-option value="smooth">Lisse</mat-option>
                      <mat-option value="rough">Rugueux</mat-option>
                      <mat-option value="metallic">Métallique</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>

                <div class="control-group">
                  <label>Brillance</label>
                  <mat-slider min="0" max="100" step="1" class="full-width">
                    <input matSliderThumb [(ngModel)]="shininess" (change)="updateModel()">
                  </mat-slider>
                </div>
              </div>
            </mat-tab>

            <!-- Onglet Éclairage -->
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon class="tab-icon"></mat-icon>
                Éclairage
              </ng-template>
              
              <div class="tab-content">
                <div class="control-group">
                  <label>Intensité de la Lumière</label>
                  <mat-slider min="0" max="100" step="1" class="full-width">
                    <input matSliderThumb [(ngModel)]="lightIntensity" (change)="updateModel()">
                  </mat-slider>
                </div>

                <div class="control-group">
                  <label>Ombres</label>
                  <mat-slider min="0" max="100" step="1" class="full-width">
                    <input matSliderThumb [(ngModel)]="shadowIntensity" (change)="updateModel()">
                  </mat-slider>
                </div>
                <div class="control-group">
                  <label>Ambiance</label>
                  <mat-slider min="0" max="100" step="1" class="full-width">
                    <input matSliderThumb [(ngModel)]="ambientLight" (change)="updateModel()">
                  </mat-slider>
                </div>
              </div>
            </mat-tab>

            <!-- Onglet Animation -->
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon class="tab-icon">animation</mat-icon>
                Animation
              </ng-template>
              
              <div class="tab-content">
                <div class="control-group">
                  <label>Vitesse de Rotation</label>
                  <mat-slider min="0" max="100" step="1" class="full-width">
                    <input matSliderThumb [(ngModel)]="rotationSpeed" (change)="updateModel()">
                  </mat-slider>
                </div>

                <div class="control-group">
                  <label>Type d'Animation</label>
                  <mat-form-field appearance="fill" class="full-width">
                    <mat-select [(ngModel)]="animationType" (selectionChange)="updateModel()">
                      <mat-option value="rotate">Rotation</mat-option>
                      <mat-option value="bounce">Rebond</mat-option>
                      <mat-option value="wave">Ondulation</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button color="" (click)="resetChanges()">
            <mat-icon>restart_alt</mat-icon>
            Réinitialiser
          </button>
          <button mat-raised-button color="" (click)="saveChanges()">
            <mat-icon>save</mat-icon>
            Sauvegarder
          </button>
          <button mat-raised-button color="" (click)="onFinish()">
            <mat-icon>check</mat-icon>
            Terminer
          </button>
        </mat-card-actions>
      </mat-card>

      <div class="preview-panel">
        <div class="preview-container">
          <div class="preview-header">
            <h2>Votre modèle est désormais prêt </h2>
            <div class="view-controls">
              <button mat-icon-button (click)="toggleRotation()">
                <mat-icon>1</mat-icon>
              </button>
              <button mat-icon-button (click)="resetView()">
                <mat-icon>2</mat-icon>
              </button>
            </div>
          </div>
          <div class="preview-content">
            <!-- Le contenu Three.js sera rendu ici -->
            <div class="preview-placeholder">
              <mat-icon>3d_rotation</mat-icon>
              <p>Chargement du modèle 3D...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .customize-container {
      display: grid;
      grid-template-columns: 400px 1fr;
      gap: 24px;
      padding: 24px;
      height: calc(100vh - 100px);
      background-color: var(--background-color);
    }

    .controls-panel {
      height: fit-content;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .preview-panel {
      background: var(--card-background);
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    .preview-header h2 {
      margin: 0;
      font-size: 1.5rem;
      color: var(--text-color);
    }
    .preview-content {
      height: calc(100vh - 240px);
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(45deg, #f5f5f5 25%, transparent 25%),
                  linear-gradient(-45deg, #f5f5f5 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #f5f5f5 75%),
                  linear-gradient(-45deg, transparent 75%, #f5f5f5 75%);
      background-size: 20px 20px;
      background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
    }

    .tab-content {
      padding: 24px 16px;
    }

    .control-group {
      margin-bottom: 24px;
    }

    .control-group label {
      display: block;
      margin-bottom: 8px;
      color: var(--text-color);
      font-weight: 500;
    }

    .full-width {
      width: 100%;
    }

    .color-picker {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .color-picker input[type="color"] {
      width: 50px;
      height: 50px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    .color-value {
      font-family: monospace;
      color: var(--text-color);
    }

    .tab-icon {
      margin-right: 8px;
    }

    mat-card-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px !important;
    }

    .preview-placeholder {
      text-align: center;
      color: var(--text-color);
    }
    .preview-placeholder mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    .view-controls {
      display: flex;
      gap: 8px;
    }

    :host ::ng-deep .mat-mdc-tab {
      min-width: 120px;
    }

    :host ::ng-deep .mat-mdc-tab-body-content {
      padding: 16px 0;
    }
  `]
})
export class CustomizeComponent {
  // Propriétés pour l'apparence
  mainColor: string = '#FFA000';
  selectedTexture: string = 'smooth';
  shininess: number = 50;

  // Propriétés pour l'éclairage
  lightIntensity: number = 75;
  shadowIntensity: number = 50;
  ambientLight: number = 30;

  // Propriétés pour l'animation
  rotationSpeed: number = 50;
  animationType: string = 'rotate';

  constructor(private router: Router) {}

  updateModel() {
    // Implémenter la mise à jour du modèle 3D
    console.log('Mise à jour du modèle avec les nouveaux paramètres');
  }

  resetChanges() {
    // Réinitialiser tous les paramètres
    this.mainColor = '#FFA000';
    this.selectedTexture = 'smooth';
    this.shininess = 50;
    this.lightIntensity = 75;
    this.shadowIntensity = 50;
    this.ambientLight = 30;
    this.rotationSpeed = 50;
    this.animationType = 'rotate';
    this.updateModel();
  }

  saveChanges() {
    // Sauvegarder les modifications
    console.log('Sauvegarde des modifications');
  }

  toggleRotation() {
    // Activer/désactiver la rotation automatique
    console.log('Basculer la rotation');
  }

  resetView() {
    // Réinitialiser la vue de la caméra
    console.log('Réinitialisation de la vue');
  }

  onFinish() {
    this.router.navigate(['/viewer']);
  }
}