import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { ExportComponent } from '../../components/export/export.component';
import { ShareComponent } from '../../components/share/share.component';

interface ModelVersion {
  id: string;
  thumbnail: string;
  date: string;
  name: string;
  objUrl: string;
  glbUrl: string;
  settings?: any;
  isModified?: boolean;
  images?: string[];
}

@Component({
  selector: 'app-viewer',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatGridListModule,
    MatSlideToggleModule,
    ExportComponent,
    ShareComponent
  ],
  template: `
    <div class="viewer-container" [class.dark-theme]="isDarkTheme">
      <div class="main-content">
        <div class="viewer-panel">
          <div class="viewer-header">
            <div class="header-left">
              <h2>Modèle 3D Final</h2>
              <div class="theme-toggle">
                <mat-icon>light_mode</mat-icon>
                <mat-slide-toggle
                  [checked]="isDarkTheme"
                  (change)="toggleTheme()">
                </mat-slide-toggle>
                <mat-icon>dark_mode</mat-icon>
              </div>
            </div>
            <div class="view-controls">
              <button mat-icon-button (click)="toggleGrid()" title="Afficher/Masquer la grille">
                <mat-icon>grid_on</mat-icon>
              </button>
              <button mat-icon-button (click)="toggleRotation()" title="Activer/Désactiver la rotation">
                <mat-icon>{{isRotating ? 'pause' : 'play_arrow'}}</mat-icon>
              </button>
              <button mat-icon-button (click)="resetView()" title="Réinitialiser la vue">
                <mat-icon>restart_alt</mat-icon>
              </button>
              <button mat-icon-button (click)="onZoomIn()" title="Zoom avant">
                <mat-icon>zoom_in</mat-icon>
              </button>
              <button mat-icon-button (click)="onZoomOut()" title="Zoom arrière">
                <mat-icon>zoom_out</mat-icon>
              </button>
              <button mat-icon-button (click)="toggleWireframe()" title="Mode filaire">
                <mat-icon>{{isWireframe ? 'visibility' : 'visibility_off'}}</mat-icon>
              </button>
            </div>
          </div>
          <div class="viewer-content">
            <div class="loading-indicator" *ngIf="!modelLoaded">
              <mat-icon class="loading-icon">hourglass_empty</mat-icon>
              <p>Chargement du modèle 3D...</p>
            </div>
            <div #viewerContainer class="model-viewer-container"></div>
            <div class="view-stats" *ngIf="modelStats">
              <p>Vertices: {{modelStats.vertices}}</p>
              <p>Faces: {{modelStats.faces}}</p>
              <p>FPS: {{modelStats.fps}}</p>
            </div>
          </div>
        </div>

        <div class="gallery-section" [class.expanded]="isGalleryExpanded">
          <div class="gallery-header" (click)="toggleGallery()">
            <h3>Versions et Images</h3>
            <mat-icon>{{ isGalleryExpanded ? 'expand_less' : 'expand_more' }}</mat-icon>
          </div>
          <div class="gallery-grid" [class.expanded]="isGalleryExpanded">
            <mat-card *ngFor="let version of modelVersions" 
                      class="version-card" 
                      (click)="loadVersion(version)"
                      [class.active]="currentVersionId === version.id">
              <img [src]="version.thumbnail" [alt]="version.name" class="version-thumbnail">
              <div class="version-images" *ngIf="version.images?.length">
                <img *ngFor="let img of version.images" 
                     [src]="img" 
                     alt="Additional image"
                     class="additional-image"
                     (click)="openImagePreview(img, $event)">
              </div>
              <div class="version-info">
                <p class="version-name">{{version.name}}</p>
                <p class="version-date">{{version.date | date}}</p>
                <p class="version-modified" *ngIf="version.isModified">Modifié</p>
              </div>
              <div class="version-actions">
                <button mat-icon-button (click)="downloadVersionFiles(version, $event)">
                  <mat-icon>download</mat-icon>
                </button>
              </div>
            </mat-card>
          </div>
        </div>
      </div>
      
      <div class="actions-panel">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Actions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="model-info">
              <h4>Informations du modèle</h4>
              <p>Dimensions: {{modelDimensions}}</p>
              <p>Échelle: {{modelScale}}</p>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="downloadModel()">
              <mat-icon>download</mat-icon>
              Télécharger
            </button>
            <button mat-raised-button color="accent" (click)="openExportDialog()">
              <mat-icon>save_alt</mat-icon>
              Exporter
            </button>
            <button mat-raised-button (click)="openShareDialog()">
              <mat-icon>share</mat-icon>
              Partager
            </button>
            <button mat-raised-button (click)="goToCustomize()">
              <mat-icon>edit</mat-icon>
              Modifier à nouveau
            </button>
            <button mat-raised-button (click)="goToUpload()">
              <mat-icon>add</mat-icon>
              Convertir un autre modèle
            </button>
            <button mat-raised-button (click)="takeScreenshot()">
              <mat-icon>camera_alt</mat-icon>
              Capture d'écran
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .viewer-container {
      display: grid;
      grid-template-columns: 3fr 1fr;
      gap: 24px;
      padding: 24px;
      height: calc(100vh - 100px);
      background-color: var(--background-color);
      transition: all 0.3s ease;
    }
    
    .viewer-container.dark-theme {
      --background-color: #121212;
      --surface-color: #1E1E1E;
      --text-primary: #FFFFFF;
      --text-secondary: #B0B0B0;
      --primary-color: #bb86fc;
    }

    .viewer-container:not(.dark-theme) {
      --background-color: #F5F5F5;
      --surface-color: #FFFFFF;
      --text-primary: #000000;
      --text-secondary: #666666;
      --primary-color: #6200ee;
    }
    
    .main-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .viewer-panel {
      flex: 1;
      background: var(--surface-color);
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    .viewer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: var(--surface-color);
      border-bottom: 1px solid rgba(128, 128, 128, 0.1);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 24px;
    }
    
    .theme-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .viewer-header h2 {
      margin: 0;
      font-size: 1.5rem;
      color: var(--text-primary);
    }
    
    .viewer-content {
      flex: 1;
      position: relative;
      background: var(--background-color);
    }

    .model-viewer-container {
      width: 100%;
      height: 100%;
      position: relative;
    }
    
    .gallery-section {
      background: var(--surface-color);
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
      max-height: 100px;
    }

    .gallery-section.expanded {
      max-height: 600px;
    }

    .gallery-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      cursor: pointer;
      background: var(--surface-color);
    }

    .gallery-header:hover {
      background: rgba(128, 128, 128, 0.1);
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 16px;
      padding: 16px;
      max-height: 0;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .gallery-grid.expanded {
      max-height: 500px;
      overflow-y: auto;
    }

    .version-card {
      cursor: pointer;
      transition: transform 0.2s;
      background: var(--surface-color);
    }

    .version-card:hover {
      transform: translateY(-4px);
    }

    .version-card.active {
      border: 2px solid var(--primary-color);
    }

    .version-card img {
      width: 100%;
      height: 100px;
      object-fit: cover;
      border-radius: 4px 4px 0 0;
    }

    .version-info {
      padding: 12px;
    }

    .version-name {
      margin: 0;
      font-weight: 500;
      color: var(--text-primary);
    }

    .version-date {
      margin: 4px 0 0 0;
      font-size: 0.9em;
      color: var(--text-secondary);
    }
    
    .version-modified {
      margin: 4px 0 0 0;
      font-size: 0.8em;
      color: var(--primary-color);
      font-weight: 500;
    }
    
    .view-stats {
      position: absolute;
      bottom: 16px;
      left: 16px;
      background: rgba(0, 0, 0, 0.7);
      padding: 8px 16px;
      border-radius: 8px;
      color: #ffffff;
    }

    .view-stats p {
      margin: 4px 0;
      font-family: monospace;
    }
    
    .actions-panel {
      display: flex;
      flex-direction: column;
    }
    
    mat-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .model-info {
      padding: 16px;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .model-info h4 {
      margin: 0 0 12px 0;
      color: var(--text-primary);
    }

    .model-info p {
      margin: 4px 0;
      color: var(--text-secondary);
    }
    
    mat-card-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px !important;
    }
    
    button {
      width: 100%;
      padding: 8px 0;
      margin: 0 !important;
    }
    
    button mat-icon {
      margin-right: 8px;
    }
    
    .loading-indicator {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      color: var(--text-primary);
    }
    
    .loading-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      animation: spin 2s infinite linear;
      margin-bottom: 16px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @media (max-width: 992px) {
      .viewer-container {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr auto;
      }
      
      .viewer-content {
        height: 400px;
      }

      .gallery-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
    }

    .version-images {
      display: flex;
      gap: 8px;
      padding: 8px;
      overflow-x: auto;
    }

    .additional-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .additional-image:hover {
      transform: scale(1.1);
    }

    .version-actions {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
    }
  `]
})
export class ViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('viewerContainer', { static: false }) viewerContainer!: ElementRef;

  modelLoaded: boolean = false;
  isRotating: boolean = true;
  isWireframe: boolean = false;
  showGrid: boolean = false;
  isDarkTheme: boolean = true;
  isGalleryExpanded: boolean = true;
  currentVersionId: string | null = null;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private model!: THREE.Group;
  private grid!: THREE.GridHelper;
  private animationId: number | null = null;
  private stars: THREE.Points | null = null;

  private objUrl!: string;
  private glbUrl!: string;
  private settings: any;

  modelStats: { vertices: number; faces: number; fps: number } | null = null;
  modelDimensions: string = 'Calcul en cours...';
  modelScale: string = 'Calcul en cours...';
  
  private readonly STORAGE_KEY = 'modelVersions';

  modelVersions: ModelVersion[] = [];

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const state = window.history.state;
    
    if (!state || (!state.objUrl && !state.glbUrl)) {
      console.warn("Aucun modèle disponible. Retour vers /upload.");
      this.router.navigate(['/upload']);
      return;
    }

    this.objUrl = state.objUrl || '';
    this.glbUrl = state.glbUrl || '';
    this.settings = state.settings || {};

    const versionId = Date.now().toString();
    this.currentVersionId = versionId;
    
    const newVersion: ModelVersion = {
      id: versionId,
      thumbnail: state.thumbnail ,
      date: state.modificationDate ? new Date(state.modificationDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      name: state.isModified ? 'Version modifiée' : 'Version actuelle',
      objUrl: this.objUrl,
      glbUrl: this.glbUrl,
      settings: this.settings,
      isModified: state.isModified || false
    };

    if (state.versions && Array.isArray(state.versions)) {
      this.modelVersions = [newVersion, ...state.versions];
    } else {
      this.modelVersions = [newVersion];
      this.loadSavedVersions();
    }
    
    this.modelVersions = this.modelVersions.filter((version, index, self) => 
      index === self.findIndex(v => v.id === version.id)
    );
  }

  private loadSavedVersions(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const savedVersions = JSON.parse(saved);
        
        this.modelVersions = [...this.modelVersions, ...savedVersions].filter((version, index, self) => 
          index === self.findIndex(v => v.id === version.id)
        );
      } catch (e) {
        console.error('Erreur de chargement des versions:', e);
      }
    }
  }

  ngAfterViewInit(): void {
    if (!this.viewerContainer) {
      setTimeout(() => this.ngAfterViewInit(), 100);
      return;
    }
    
    setTimeout(() => {
      this.initThreeJS();
      this.createStarfield();
      this.createGrid();
      this.loadModel();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    this.cleanupThreeJS();
  }

  private initThreeJS(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.isDarkTheme ? 0x000000 : 0xFFFFFF);

    const width = this.viewerContainer.nativeElement.clientWidth;
    const height = this.viewerContainer.nativeElement.clientHeight;
    
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;

    while (this.viewerContainer.nativeElement.firstChild) {
      this.viewerContainer.nativeElement.removeChild(this.viewerContainer.nativeElement.firstChild);
    }
    
    this.viewerContainer.nativeElement.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    const ambientLight = new THREE.AmbientLight(0xffffff, this.settings.ambientLight / 100 || 0.3);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, this.settings.lightIntensity / 100 || 0.75);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    const rimLight = new THREE.PointLight(0x4444ff, 2);
    rimLight.position.set(-5, 0, -5);
    this.scene.add(rimLight);

    window.addEventListener('resize', () => this.onWindowResize());
  }

  private createGrid(): void {
    this.grid = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    this.grid.visible = this.showGrid;
    this.scene.add(this.grid);
  }

  private createStarfield(): void {
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 2000;
    const positions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 2000;
      positions[i + 1] = (Math.random() - 0.5) * 2000;
      positions[i + 2] = (Math.random() - 0.5) * 2000;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const starsMaterial = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 1,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });

    this.stars = new THREE.Points(starsGeometry, starsMaterial);
    this.scene.add(this.stars);
  }

  private loadModel(): void {
    if (!this.glbUrl) {
      console.error('URL GLB non fournie');
      return;
    }
    
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
        this.applySettings();
        this.calculateModelStats();
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
    const size = box.getSize(new THREE.Vector3());

    this.model.position.x = -center.x;
    this.model.position.y = -center.y;
    this.model.position.z = -center.z;

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / Math.sin(fov / 2)) * 1.5;

    this.camera.position.z = cameraZ;
    this.camera.updateProjectionMatrix();

    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  private calculateModelStats(): void {
    let vertices = 0;
    let faces = 0;

    this.model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const geometry = mesh.geometry;
        vertices += geometry.attributes['position'].count;
        faces += geometry.index ? geometry.index.count / 3 : geometry.attributes['position'].count / 3;
      }
    });

    const box = new THREE.Box3().setFromObject(this.model);
    const size = box.getSize(new THREE.Vector3());
    
    this.modelStats = { vertices, faces, fps: 0 };
    this.modelDimensions = `${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}`;
    this.modelScale = '1:1';
  }

  private applySettings(): void {
    if (!this.model || !this.settings) return;

    const color = new THREE.Color(this.settings.color || '#FFA000');
    const roughness = this.settings.texture === 'rough' ? 0.8 :
                     this.settings.texture === 'metallic' ? 0.1 : 0.3;
    const metalness = this.settings.texture === 'metallic' ? 0.8 : 0.1;

    this.model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          if (!(mesh.material instanceof THREE.MeshStandardMaterial)) {
            mesh.material = new THREE.MeshStandardMaterial({
              color: color,
              roughness: roughness,
              metalness: metalness,
              emissive: new THREE.Color(0x000033),
              emissiveIntensity: 0.1,
              wireframe: this.isWireframe
            });
          } else {
            (mesh.material as THREE.MeshStandardMaterial).color = color;
            (mesh.material as THREE.MeshStandardMaterial).roughness = roughness;
            (mesh.material as THREE.MeshStandardMaterial).metalness = metalness;
            (mesh.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x000033);
            (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.1;
            (mesh.material as THREE.MeshStandardMaterial).wireframe = this.isWireframe;
            mesh.material.needsUpdate = true;
          }
        }
      }
    });
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());

    const startTime = performance.now();

    if (this.stars) {
      this.stars.rotation.y += 0.0002;
    }

    if (this.model && this.isRotating) {
      const speed = ((this.settings.rotationSpeed || 50) / 1000) * 2 * Math.PI;
      
      switch (this.settings.animationType || 'rotate') {
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

    const endTime = performance.now();
    if (this.modelStats) {
      this.modelStats.fps = Math.round(1000 / (endTime - startTime));
    }
  }

  private onWindowResize(): void {
    if (!this.viewerContainer) return;
    
    const width = this.viewerContainer.nativeElement.clientWidth;
    const height = this.viewerContainer.nativeElement.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  toggleRotation(): void {
    this.isRotating = !this.isRotating;
  }

  toggleGrid(): void {
    this.showGrid = !this.showGrid;
    if (this.grid) {
      this.grid.visible = this.showGrid;
    }
  }

  toggleWireframe(): void {
    this.isWireframe = !this.isWireframe;
    this.applySettings();
  }

  resetView(): void {
    this.controls.reset();
    if (this.model) {
      this.model.rotation.set(0, 0, 0);
      this.model.position.set(0, 0, 0);
      this.centerModel();
    }
  }

  onZoomIn(): void {
    this.camera.position.z = Math.max(2, this.camera.position.z - 0.5);
  }

  onZoomOut(): void {
    this.camera.position.z = Math.min(10, this.camera.position.z + 0.5);
  }

  loadVersion(version: ModelVersion): void {
    if (!version.objUrl || !version.glbUrl) {
      console.error('Version sans URLs de modèle');
      return;
    }
    
    this.currentVersionId = version.id;
    
    const currentVersion = this.modelVersions.find(v => v.id === this.currentVersionId);
    if (currentVersion) {
      currentVersion.settings = this.settings;
    }
    
    this.objUrl = version.objUrl;
    this.glbUrl = version.glbUrl;
    this.settings = version.settings || {};
    
    this.loadModel();
  }

  takeScreenshot(): void {
    const canvas = this.renderer.domElement;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'model-screenshot.png';
    link.click();
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

  openExportDialog(): void {
    this.dialog.open(ExportComponent, {
      width: '500px',
      data: {
        objUrl: this.objUrl,
        glbUrl: this.glbUrl,
        settings: this.settings
      }
    });
  }

  openShareDialog(): void {
    this.dialog.open(ShareComponent, {
      width: '500px',
      data: {
        objUrl: this.objUrl,
        glbUrl: this.glbUrl,
        settings: this.settings
      }
    });
  }

  goToCustomize(): void {
    const versions = this.modelVersions.filter(v => v.id !== this.currentVersionId);
    
    this.router.navigate(['/customize'], {
      state: {
        objUrl: this.objUrl,
        glbUrl: this.glbUrl,
        settings: this.settings,
        versions: versions
      }
    });
  }

  goToUpload(): void {
    this.router.navigate(['/upload']);
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.scene.background = new THREE.Color(this.isDarkTheme ? 0x000000 : 0xFFFFFF);
  }

  toggleGallery(): void {
    this.isGalleryExpanded = !this.isGalleryExpanded;
  }

  openImagePreview(imageUrl: string, event: Event): void {
    event.stopPropagation();
  }

  downloadVersionFiles(version: ModelVersion, event: Event): void {
    event.stopPropagation();
    if (version.objUrl) {
      this.downloadFile(version.objUrl, 'model.obj');
    }
    if (version.glbUrl) {
      this.downloadFile(version.glbUrl, 'model.glb');
    }
  }

  private downloadFile(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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