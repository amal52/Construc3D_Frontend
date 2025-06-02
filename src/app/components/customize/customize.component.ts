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
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import screenfull from 'screenfull';

interface ModelVersion {
  id: string;
  name: string;
  date: string;
  settings: any;
  notes?: string[];
  objUrl?: string;
  glbUrl?: string;
  thumbnail?: string;
  images?: string[];
}

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
                  Versions et Images
                </mat-panel-title>
              </mat-expansion-panel-header>

              <div class="versions-list">
                <mat-list>
                  <mat-list-item *ngFor="let version of versions" (click)="loadVersion(version)">
                    <mat-icon matListItemIcon>restore</mat-icon>
                    <div matListItemTitle>{{version.name}}</div>
                    <div matListItemLine>{{version.date | date}}</div>
                    <div class="version-images" *ngIf="version.images?.length">
                      <img *ngFor="let img of version.images" [src]="img" alt="Version image" class="version-thumbnail">
                    </div>
                  </mat-list-item>
                </mat-list>
              </div>

              <div class="version-actions">
                <input type="file" #imageInput accept="image/*" multiple (change)="onImagesSelected($event)" style="display: none">
                <button mat-stroked-button (click)="imageInput.click()">
                  <mat-icon>add_photo_alternate</mat-icon>
                  Ajouter des images
                </button>
                <button mat-stroked-button (click)="saveVersion()">
                  <mat-icon>save</mat-icon>
                  Sauvegarder la version
                </button>
              </div>
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
                <button mat-raised-button  (click)="onFinish()">
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

    .versions-list,
    .notes-list {
      max-height: 200px;
      overflow-y: auto;
    }

    .version-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 16px;
    }

    .version-images {
      display: flex;
      gap: 8px;
      margin-top: 8px;
      overflow-x: auto;
    }

    .version-thumbnail {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
      cursor: pointer;
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
  mainColor: string = '#f4f1ec';
  selectedTexture: string = 'smooth';
  shininess: number = 50;
  lightIntensity: number = 75;
  shadowIntensity: number = 50;
  ambientLight: number = 30;
  rotationSpeed: number = 2;
  animationType: string = 'rotate';
  isRotating: boolean = true;
  isFullscreen: boolean = false;

  // URLs
  objUrl!: string;
  glbUrl!: string;

  // State
  modelLoaded: boolean = false;
  newNote: string = '';
  notes: ModelNote[] = [];
  versions: ModelVersion[] = [];

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
  private grid!: THREE.GridHelper;
  private axes!: THREE.AxesHelper;
  
  // Storage key for versions
  private readonly STORAGE_KEY = 'modelVersions';

  constructor(private router: Router) {
    this.loadVersions();
  }

  ngOnInit(): void {
    const state = window.history.state;

    if (!state || !state.objUrl || !state.glbUrl) {
      console.warn("Aucun modèle disponible. Retour vers /upload.");
      this.router.navigate(['/upload']);
      return;
    }

    this.objUrl = state.objUrl;
    this.glbUrl = state.glbUrl;
    
    // Load settings from state if available
    if (state.settings) {
      this.applySettings(state.settings);
    }
    // Load versions from state if available
    if (state.versions && Array.isArray(state.versions)) {
      this.versions = [...this.versions, ...state.versions].filter((version, index, self) => 
        index === self.findIndex(v => v.id === version.id)
      );
      this.saveVersions();
    }
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
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    this.cleanupThreeJS();
  }
  private initThreeJS(): void {
    // Create scene with gradient background
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeeeeee);

    const width = this.viewerContainer.nativeElement.clientWidth;
    const height = this.viewerContainer.nativeElement.clientHeight;

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(5, 5, 5);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      logarithmicDepthBuffer: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    
    this.viewerContainer.nativeElement.appendChild(this.renderer.domElement);

    // Enhanced controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.rotateSpeed = 0.8;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 20;

    // Add grid helper
    this.grid = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    this.scene.add(this.grid);

    // Add axes helper
    this.axes = new THREE.AxesHelper(5);
    this.scene.add(this.axes);

    this.setupLights();
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }
  private setupLights(): void {
    // Ambient light
    this.ambientLightObj = new THREE.AmbientLight(0xffffff, this.ambientLight / 100);
    this.scene.add(this.ambientLightObj);
    // Main directional light with enhanced shadows
    this.directionalLight = new THREE.DirectionalLight(0xffffff, this.lightIntensity / 100);
    this.directionalLight.position.set(5, 5, 5);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.mapSize.height = 2048;
    this.directionalLight.shadow.camera.near = 0.5;
    this.directionalLight.shadow.camera.far = 500;
    this.directionalLight.shadow.bias = -0.0001;
    this.scene.add(this.directionalLight);

    // Additional rim light
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
              metalness: metalness,
              envMapIntensity: 1.0,
              emissive: new THREE.Color(0x000033),
              emissiveIntensity: 0.1
            });
          } else {
            (mesh.material as THREE.MeshStandardMaterial).color = color;
            (mesh.material as THREE.MeshStandardMaterial).roughness = roughness;
            (mesh.material as THREE.MeshStandardMaterial).metalness = metalness;
            (mesh.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x000033);
            (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.1;
            mesh.material.needsUpdate = true;
          }
          mesh.castShadow = true;
          mesh.receiveShadow = true;
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
  // View Controls
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

  // Create a thumbnail from the current view
  private createThumbnail(): string {
    if (!this.renderer) return '';
    
    // Temporarily disable rotation for the screenshot
    const wasRotating = this.isRotating;
    this.isRotating = false;
    
    // Render the current view
    this.renderer.render(this.scene, this.camera);
    
    // Get the data URL from the canvas
    const thumbnail = this.renderer.domElement.toDataURL('image/jpeg', 0.7);
    
    // Restore rotation state
    this.isRotating = wasRotating;
    
    return thumbnail;
  }

  // Version Management
  saveVersion(): void {
    const thumbnail = this.createThumbnail();
    const version: ModelVersion = {
      id: Date.now().toString(),
      name: `Version ${this.versions.length + 1}`,
      date: new Date().toISOString(),
      objUrl: this.objUrl,
      glbUrl: this.glbUrl,
      thumbnail: thumbnail,
      settings: {
        color: this.mainColor,
        texture: this.selectedTexture,
        shininess: this.shininess,
        lightIntensity: this.lightIntensity,
        ambientLight: this.ambientLight,
        shadowIntensity: this.shadowIntensity,
        rotationSpeed: this.rotationSpeed,
        animationType: this.animationType
      }
    };

    this.versions.unshift(version);
    this.saveVersions();
  }

  loadVersion(version: ModelVersion): void {
    if (version.settings) {
      this.applySettings(version.settings);
      this.updateModel();
      this.updateLighting();
    }
  }
  
  private applySettings(settings: any): void {
    this.mainColor = settings.color || this.mainColor;
    this.selectedTexture = settings.texture || this.selectedTexture;
    this.shininess = settings.shininess || this.shininess;
    this.lightIntensity = settings.lightIntensity || this.lightIntensity;
    this.ambientLight = settings.ambientLight || this.ambientLight;
    this.shadowIntensity = settings.shadowIntensity || this.shadowIntensity;
    this.rotationSpeed = settings.rotationSpeed || this.rotationSpeed;
    this.animationType = settings.animationType || this.animationType;
  }

  private loadVersions(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.versions = JSON.parse(saved);
      } catch (e) {
        console.error('Erreur de chargement des versions:', e);
        this.versions = [];
      }
    }
  }

  private saveVersions(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.versions));
  }

  onImagesSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file: any) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const currentVersion = this.versions[0] || this.createNewVersion();
          if (!currentVersion.images) {
            currentVersion.images = [];
          }
          currentVersion.images.push(e.target.result);
          this.saveVersions();
        };
        reader.readAsDataURL(file);
      });
    }
  }

  private createNewVersion(): ModelVersion {
    const version: ModelVersion = {
      id: Date.now().toString(),
      name: `Version ${this.versions.length + 1}`,
      date: new Date().toISOString(),
      settings: this.getCurrentSettings(),
      images: []
    };
    this.versions.unshift(version);
    return version;
  }

  private getCurrentSettings(): any {
    return {
      color: this.mainColor,
      texture: this.selectedTexture,
      shininess: this.shininess,
      lightIntensity: this.lightIntensity,
      ambientLight: this.ambientLight,
      shadowIntensity: this.shadowIntensity,
      rotationSpeed: this.rotationSpeed,
      animationType: this.animationType
    };
  }

  downloadModel(): void {
    if (this.objUrl) {
      const link = document.createElement('a');
      link.href = this.objUrl;
      link.download = 'model.obj';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (this.glbUrl) {
      const link = document.createElement('a');
      link.href = this.glbUrl;
      link.download = 'model.glb';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  //Notes Management
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
    this.mainColor = '#f4f1ec';
    this.selectedTexture = 'smooth';
    this.shininess = 50;
    this.lightIntensity = 75;
    this.shadowIntensity = 50;
    this.ambientLight = 30;
    this.rotationSpeed = 2;
    this.animationType = 'rotate';
    this.isRotating = true;
    this.updateModel();
    this.updateLighting();
  }

  onFinish(): void {
    // Create current version thumbnail for the gallery
    const thumbnail = this.createThumbnail();
    
    // Navigate to viewer with current settings and model data
    this.router.navigate(['/viewer'], {
      state: {
        objUrl: this.objUrl,
        glbUrl: this.glbUrl,
        thumbnail: thumbnail,
        modificationDate: new Date().toISOString(),
        isModified: true,
        settings: {
          color: this.mainColor,
          texture: this.selectedTexture,
          shininess: this.shininess,
          lightIntensity: this.lightIntensity,
          ambientLight: this.ambientLight,
          shadowIntensity: this.shadowIntensity,
          rotationSpeed: this.rotationSpeed,
          animationType: this.animationType
        },
        versions: this.versions
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