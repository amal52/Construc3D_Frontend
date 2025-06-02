import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import screenfull from 'screenfull';
import { ModelSettingsService, ModelSettings } from '../../services/model-settings.service';

interface ModelNote {
  id: string;
  text: string;
  position: THREE.Vector3;
}

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
    MatSidenavModule,
    MatExpansionModule,
    MatInputModule,
    MatListModule,
    MatTooltipModule,
    FormsModule
  ],
  template: `
    <div class="customize-container" [class.fullscreen]="isFullscreen">
      <mat-sidenav-container>
        <mat-sidenav #sidenav mode="side" opened class="settings-panel">
          <div class="settings-header">
            <h2>Personnalisation</h2>
            <button mat-icon-button (click)="sidenav.toggle()">
              <mat-icon>chevron_left</mat-icon>
            </button>
          </div>

          <mat-accordion>
            <!-- Appearance Panel -->
            <mat-expansion-panel expanded>
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon>palette</mat-icon>
                  Apparence
                </mat-panel-title>
              </mat-expansion-panel-header>

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
                <label>Brillance: {{shininess}}%</label>
                <mat-slider min="0" max="100" step="1" class="full-width">
                  <input matSliderThumb [(ngModel)]="shininess" (change)="updateModel()">
                </mat-slider>
              </div>
            </mat-expansion-panel>

            <!-- Lighting Panel -->
            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon>lightbulb</mat-icon>
                  Éclairage
                </mat-panel-title>
              </mat-expansion-panel-header>

              <div class="control-group">
                <label>Intensité: {{lightIntensity}}%</label>
                <mat-slider min="0" max="100" step="1" class="full-width">
                  <input matSliderThumb [(ngModel)]="lightIntensity" (change)="updateLighting()">
                </mat-slider>
              </div>

              <div class="control-group">
                <label>Ombres: {{shadowIntensity}}%</label>
                <mat-slider min="0" max="100" step="1" class="full-width">
                  <input matSliderThumb [(ngModel)]="shadowIntensity" (change)="updateLighting()">
                </mat-slider>
              </div>

              <div class="control-group">
                <label>Ambiance: {{ambientLight}}%</label>
                <mat-slider min="0" max="100" step="1" class="full-width">
                  <input matSliderThumb [(ngModel)]="ambientLight" (change)="updateLighting()">
                </mat-slider>
              </div>
            </mat-expansion-panel>

            <!-- Animation Panel -->
            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon>animation</mat-icon>
                  Animation
                </mat-panel-title>
              </mat-expansion-panel-header>

              <div class="control-group">
                <label>Vitesse: {{rotationSpeed}}%</label>
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
            </mat-expansion-panel>

            <!-- Versions Panel -->
            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon>history</mat-icon>
                  Versions
                </mat-panel-title>
              </mat-expansion-panel-header>

              <div class="versions-list">
                <mat-list>
                  <mat-list-item *ngFor="let version of versions" (click)="loadVersion(version.settings)">
                    <img matListItemAvatar [src]="version.thumbnail" alt="Version thumbnail">
                    <div matListItemTitle>{{version.name}}</div>
                    <div matListItemLine>{{version.date | date}}</div>
                  </mat-list-item>
                </mat-list>
              </div>

              <button mat-raised-button color="primary" (click)="saveVersion()" class="mt-3">
                <mat-icon>save</mat-icon>
                Sauvegarder la version actuelle
              </button>
            </mat-expansion-panel>

            <!-- Notes Panel -->
            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon>note_add</mat-icon>
                  Notes
                </mat-panel-title>
              </mat-expansion-panel-header>

              <div class="notes-list">
                <mat-list>
                  <mat-list-item *ngFor="let note of notes">
                    <mat-icon matListItemIcon>comment</mat-icon>
                    <div matListItemTitle>{{note.text}}</div>
                    <button mat-icon-button (click)="deleteNote(note)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </mat-list-item>
                </mat-list>
              </div>

              <div class="note-input">
                <mat-form-field class="full-width">
                  <input matInput placeholder="Ajouter une note" [(ngModel)]="newNote">
                </mat-form-field>
                <button mat-icon-button (click)="addNote()">
                  <mat-icon>add</mat-icon>
                </button>
              </div>
            </mat-expansion-panel>
          </mat-accordion>

      
        </mat-sidenav>

        <mat-sidenav-content>
          <div class="viewer-container">
            <div class="toolbar">
              <button mat-icon-button (click)="sidenav.toggle()" matTooltip="Paramètres">
                <mat-icon>settings</mat-icon>
              </button>

              <div class="view-controls">
                <button mat-icon-button (click)="setView('top')" matTooltip="Vue de dessus">
                  <mat-icon>arrow_downward</mat-icon>
                </button>
                <button mat-icon-button (click)="setView('front')" matTooltip="Vue frontale">
                  <mat-icon>arrow_forward</mat-icon>
                </button>
                <button mat-icon-button (click)="setView('side')" matTooltip="Vue latérale">
                  <mat-icon>arrow_right_alt</mat-icon>
                </button>
                <button mat-icon-button (click)="setView('isometric')" matTooltip="Vue isométrique">
                  <mat-icon>3d_rotation</mat-icon>
                </button>
              </div>

               <div class="playback-controls">
            <button mat-icon-button (click)="toggleRotation()" matTooltip="Rotation">
              <mat-icon>{{isRotating ? 'pause' : 'play_arrow'}}</mat-icon>
            </button>
            <button mat-icon-button (click)="resetView()" matTooltip="Réinitialiser">
              <mat-icon>restart_alt</mat-icon>
            </button>
            <button mat-icon-button (click)="toggleFullscreen()" matTooltip="Plein écran">
              <mat-icon>{{isFullscreen ? 'fullscreen_exit' : 'fullscreen'}}</mat-icon>
            </button>
            <button mat-raised-button color="primary" class="brown-button" (click)="resetChanges()">
              <mat-icon>restart_alt</mat-icon>
              Réinitialiser
            </button>
            <button mat-raised-button color="primary" class="brown-button" (click)="onFinish()">
              <mat-icon>check</mat-icon>
              Terminer
            </button>
      </div>
            </div>

            <div class="viewer-content">
              <div class="loading-indicator" *ngIf="!modelLoaded">
                <mat-icon>hourglass_empty</mat-icon>
                <p>Chargement du modèle 3D...</p>
              </div>
              <div #viewerContainer class="model-viewer"></div>
            </div>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .customize-container {
      height: 100vh;
      background-color: var(--background-color);
    }

    .customize-container.fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      z-index: 9999;
    }

    mat-sidenav-container {
      height: 100%;
    }
.brown-button {
  background-color: #8B4513 !important;
  color: white !important;
  margin-left: 8px;
}

.brown-button:hover {
  background-color: #A0522D !important;
}

.playback-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}
    .settings-panel {
      width: 320px;
      background: var(--surface-color);
      border-right: 1px solid rgba(0, 0, 0, 0.12);
    }

    .settings-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }

    .settings-header h2 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 500;
    }

    mat-accordion {
      padding: 16px;
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

    .settings-actions {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      background: var(--surface-color);
      border-top: 1px solid rgba(0, 0, 0, 0.12);
    }

    .viewer-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px;
      background: var(--surface-color);
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }

    .view-controls,
    .playback-controls {
      display: flex;
      gap: 8px;
    }

    .viewer-content {
      flex: 1;
      position: relative;
      background: linear-gradient(45deg, #f5f5f5 25%, transparent 25%),
                  linear-gradient(-45deg, #f5f5f5 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #f5f5f5 75%),
                  linear-gradient(-45deg, transparent 75%, #f5f5f5 75%);
      background-size: 20px 20px;
      background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
    }

    .model-viewer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .loading-indicator {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .loading-indicator mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      animation: spin 2s infinite linear;
    }

    .versions-list {
      max-height: 200px;
      overflow-y: auto;
    }

    .mt-3 {
      margin-top: 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .settings-panel {
        width: 280px;
      }
    }
  `]
})
export class CustomizeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('viewerContainer', { static: false }) viewerContainer!: ElementRef;
  @ViewChild('sidenav') sidenav: any;

  // Model properties
  mainColor: string = '#FFA000';
  selectedTexture: string = 'smooth';
  shininess: number = 50;
  lightIntensity: number = 75;
  shadowIntensity: number = 50;
  ambientLight: number = 30;
  rotationSpeed: number = 2;
  animationType: string = 'rotate';
  isRotating: boolean = true;
  isFullscreen: boolean = false;
  modelLoaded: boolean = false;
  newNote: string = '';
  notes: ModelNote[] = [];
  versions: any[] = [];

  // Three.js objects
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private model!: THREE.Group;
  private animationId: number | null = null;
  private ambientLightObj!: THREE.AmbientLight;
  private directionalLight!: THREE.DirectionalLight;
  private pointLight!: THREE.PointLight;

  // URLs
  objUrl!: string;
  glbUrl!: string;

  constructor(
    private router: Router,
    private modelSettingsService: ModelSettingsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const state = window.history.state;

    if (!state || !state.objUrl || !state.glbUrl) {
      console.warn("Aucun modèle disponible. Retour vers /upload.");
      this.router.navigate(['/upload']);
      return;
    }

    this.objUrl = state.objUrl;
    this.glbUrl = state.glbUrl;

    // Load settings from service
    this.modelSettingsService.getAll().subscribe(settings => {
      if (settings.length > 0) {
        const latestSettings = settings[0];
        this.applySettings(latestSettings);
      }
      this.loadVersions();
    });
  }

  ngAfterViewInit(): void {
    if (!this.viewerContainer) {
      setTimeout(() => this.ngAfterViewInit(), 100);
      return;
    }
    
    this.initThreeJS();
    this.loadModel();
  }

  ngOnDestroy(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    this.cleanupThreeJS();
  }

  private initThreeJS(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeeeeee);

    const width = this.viewerContainer.nativeElement.clientWidth;
    const height = this.viewerContainer.nativeElement.clientHeight;

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(5, 5, 5);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    
    this.viewerContainer.nativeElement.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    this.setupLights();
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private setupLights(): void {
    this.ambientLightObj = new THREE.AmbientLight(0xffffff, this.ambientLight / 100);
    this.scene.add(this.ambientLightObj);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, this.lightIntensity / 100);
    this.directionalLight.position.set(5, 5, 5);
    this.scene.add(this.directionalLight);

    this.pointLight = new THREE.PointLight(0x0088ff, this.lightIntensity / 200);
    this.pointLight.position.set(-5, 5, -5);
    this.scene.add(this.pointLight);
  }

  private loadModel(): void {
    const loader = new GLTFLoader();
    
    loader.load(
      this.glbUrl,
      (gltf) => {
        if (this.model) {
          this.scene.remove(this.model);
        }
        
        this.model = gltf.scene;
        this.scene.add(this.model);
        this.centerModel();
        this.updateModel();
        this.animate();
        this.modelLoaded = true;
      },
      (xhr) => {
        console.log(`Chargement: ${(xhr.loaded / xhr.total * 100)}%`);
      },
      (error) => {
        console.error('Erreur de chargement:', error);
        this.modelLoaded = false;
      }
    );
  }

  private centerModel(): void {
    if (!this.model) return;

    const box = new THREE.Box3().setFromObject(this.model);
    const center = box.getCenter(new THREE.Vector3());
    this.model.position.sub(center);

    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));
    this.camera.position.z = cameraZ * 1.5;
    this.camera.lookAt(0, 0, 0);
  }

  updateModel(): void {
    if (!this.model) return;

    const color = new THREE.Color(this.mainColor);
    const roughness = this.selectedTexture === 'rough' ? 0.8 :
                     this.selectedTexture === 'metallic' ? 0.1 : 0.3;
    const metalness = this.selectedTexture === 'metallic' ? 0.8 : 0.1;

    this.model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          if (!(mesh.material instanceof THREE.MeshStandardMaterial)) {
            mesh.material = new THREE.MeshStandardMaterial({
              color: color,
              roughness: roughness,
              metalness: metalness
            });
          } else {
            (mesh.material as THREE.MeshStandardMaterial).color = color;
            (mesh.material as THREE.MeshStandardMaterial).roughness = roughness;
            (mesh.material as THREE.MeshStandardMaterial).metalness = metalness;
            mesh.material.needsUpdate = true;
          }
        }
      }
    });
  }

  updateLighting(): void {
    if (this.ambientLightObj) {
      this.ambientLightObj.intensity = this.ambientLight / 100;
    }
    if (this.directionalLight) {
      this.directionalLight.intensity = this.lightIntensity / 100;
    }
    if (this.pointLight) {
      this.pointLight.intensity = this.lightIntensity / 200;
    }
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());

    if (this.model && this.isRotating) {
      const speed = (this.rotationSpeed / 1000) * 2 * Math.PI;
      
      switch (this.animationType) {
        case 'rotate':
          this.model.rotation.y += speed;
          break;
        case 'bounce':
          this.model.position.y = Math.sin(Date.now() * speed) * 0.2;
          break;
        case 'wave':
          this.model.rotation.x = Math.sin(Date.now() * speed) * 0.1;
          this.model.rotation.z = Math.cos(Date.now() * speed) * 0.1;
          break;
      }
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    if (!this.viewerContainer) return;
    
    const width = this.viewerContainer.nativeElement.clientWidth;
    const height = this.viewerContainer.nativeElement.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  setView(view: string): void {
    if (!this.model) return;

    switch (view) {
      case 'top':
        this.camera.position.set(0, 10, 0);
        break;
      case 'front':
        this.camera.position.set(0, 0, 10);
        break;
      case 'side':
        this.camera.position.set(10, 0, 0);
        break;
      case 'isometric':
        this.camera.position.set(5, 5, 5);
        break;
    }

    this.camera.lookAt(0, 0, 0);
    this.controls.update();
  }

  toggleRotation(): void {
    this.isRotating = !this.isRotating;
  }

  resetView(): void {
    this.controls.reset();
    if (this.model) {
      this.model.rotation.set(0, 0, 0);
      this.model.position.set(0, 0, 0);
      this.centerModel();
    }
  }

  toggleFullscreen(): void {
    if (screenfull.isEnabled) {
      screenfull.toggle();
      this.isFullscreen = !this.isFullscreen;
    }
  }

  private createThumbnail(): string {
    return this.renderer.domElement.toDataURL('image/jpeg', 0.7);
  }

  saveVersion(): void {
    const thumbnail = this.createThumbnail();
    
    const settings: ModelSettings = {
      name: `Version ${Date.now()}`,
      color: this.mainColor,
      texture: this.selectedTexture,
      shininess: this.shininess,
      lightIntensity: this.lightIntensity,
      ambientLight: this.ambientLight,
      shadowIntensity: this.shadowIntensity,
      rotationSpeed: this.rotationSpeed,
      animationType: this.animationType,
      objUrl: this.objUrl,
      glbUrl: this.glbUrl,
      thumbnail: thumbnail,
      notes: this.notes.map(note => note.text)
    };

    this.modelSettingsService.create(settings).subscribe({
      next: () => {
        this.snackBar.open('Version sauvegardée avec succès', 'Fermer', {
          duration: 3000
        });
        this.loadVersions();
      },
      error: (error) => {
        console.error('Erreur lors de la sauvegarde:', error);
        this.snackBar.open('Erreur lors de la sauvegarde', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  loadVersion(version: ModelSettings): void {
    this.applySettings(version);
    this.updateModel();
    this.updateLighting();
  }

  private applySettings(settings: ModelSettings): void {
    this.mainColor = settings.color;
    this.selectedTexture = settings.texture;
    this.shininess = settings.shininess;
    this.lightIntensity = settings.lightIntensity;
    this.ambientLight = settings.ambientLight;
    this.shadowIntensity = settings.shadowIntensity;
    this.rotationSpeed = settings.rotationSpeed;
    this.animationType = settings.animationType;
  }

  private loadVersions(): void {
    this.modelSettingsService.getAll().subscribe({
      next: (settings) => {
        this.versions = settings.map(s => ({
          id: s.id!.toString(),
          name: s.name,
          date: s.createdAt?.toISOString() || new Date().toISOString(),
          settings: s,
          thumbnail: s.thumbnail,
          notes: s.notes
        }));
      },
      error: (error) => {
        console.error('Erreur lors du chargement des versions:', error);
      }
    });
  }

  addNote(): void {
    if (!this.newNote.trim()) return;

    const note: ModelNote = {
      id: Date.now().toString(),
      text: this.newNote,
      position: this.camera.position.clone()
    };

    this.notes.push(note);
    this.newNote = '';
  }

  deleteNote(note: ModelNote): void {
    this.notes = this.notes.filter(n => n.id !== note.id);
  }

  resetChanges(): void {
    this.mainColor = '#FFA000';
    this.selectedTexture = 'smooth';
    this.shininess = 50;
    this.lightIntensity = 75;
    this.shadowIntensity = 50;
    this.ambientLight = 30;
    this.rotationSpeed = 2;
    this.animationType = 'rotate';
    this.updateModel();
    this.updateLighting();
  }

  onFinish(): void {
    const thumbnail = this.createThumbnail();
    const currentSettings: ModelSettings = {
      name: `Version finale ${new Date().toLocaleString()}`,
      color: this.mainColor,
      texture: this.selectedTexture,
      shininess: this.shininess,
      lightIntensity: this.lightIntensity,
      ambientLight: this.ambientLight,
      shadowIntensity: this.shadowIntensity,
      rotationSpeed: this.rotationSpeed,
      animationType: this.animationType,
      objUrl: this.objUrl,
      glbUrl: this.glbUrl,
      thumbnail: thumbnail,
      notes: this.notes.map(note => note.text),
      isModified: true
    };

    this.modelSettingsService.create(currentSettings).subscribe({
      next: () => {
        this.router.navigate(['/viewer'], {
          state: {
            objUrl: this.objUrl,
            glbUrl: this.glbUrl,
            thumbnail: thumbnail,
            settings: currentSettings,
            isModified: true
          }
        });
      },
      error: (error) => {
        console.error('Erreur lors de la sauvegarde finale:', error);
        this.snackBar.open('Erreur lors de la finalisation', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  private cleanupThreeJS(): void {
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.scene) {
      this.scene.clear();
    }
    if (this.controls) {
      this.controls.dispose();
    }
    if (this.viewerContainer && this.viewerContainer.nativeElement) {
      this.viewerContainer.nativeElement.innerHTML = '';
    }
  }
}