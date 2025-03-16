import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ExportComponent } from '../export/export.component';
import { ShareComponent } from '../share/share.component';
import * as THREE from 'three';

@Component({
  selector: 'app-viewer',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="viewer-container">
      <div class="controls">
        <button mat-icon-button (click)="onRotate()" >
          <img src="/assets/icons/rotate.svg" alt="Rotation" class="control-icon">
        </button>
        <button mat-icon-button (click)="onZoomIn()" >
          <img src="/assets/icons/zoom-in.svg" alt="Zoom avant" class="control-icon">
        </button>
        <button mat-icon-button (click)="onZoomOut()" matTooltip="Zoom arrière">
          <img src="/assets/icons/zoom-out.svg" alt="Zoom arrière" class="control-icon">
        </button>
        <button mat-icon-button (click)="openExportDialog()" matTooltip="Exporter">
          <img src="/assets/icons/export.svg" alt="Exporter" class="control-icon">
        </button>
        <button mat-icon-button (click)="openShareDialog()" matTooltip="Partager">
          <img src="/assets/icons/share.svg" alt="Partager" class="control-icon">
        </button>
      </div>
      <canvas #canvas></canvas>
    </div>
  `,
  styles: [`
    .viewer-container {
      width: 100%;
      height: 100vh;
      position: relative;
      background-color: var(--background-color);
    }

    .controls {
      position: absolute;
      top: 20px;
      right: 20px;
      background: var(--surface-color);
      padding: 10px;
      border-radius: 8px;
      display: flex;
      gap: 8px;
      box-shadow: 0 2px 8px var(--shadow-color);
    }
    .controls button {
      color: var(--text-primary);
      background-color: var(--tertiary-color);
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .controls button:hover {
      background-color: var(--hover-color);
    }
    .control-icon {
      width: 24px;
      height: 24px;
      filter: invert(1);
    }

    canvas {
      width: 100%;
      height: 100%;
    }
  `]
})
export class ViewerComponent implements AfterViewInit {
  @ViewChild('canvas') private canvasRef!: ElementRef;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private cube!: THREE.Mesh;

  constructor(private dialog: MatDialog) {}

  ngAfterViewInit() {
    this.initThree();
    this.animate();
  }

  private initThree() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.nativeElement, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x010000);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial({ 
      color: 0xE4995B,
      specular: 0x924118,
      shininess: 30
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    const ambientLight = new THREE.AmbientLight(0xF0E3CA, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xE4995B, 0.8);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);

    this.camera.position.z = 5;
  }
  private animate() {
    requestAnimationFrame(() => this.animate());
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  }
  onRotate() {
    this.cube.rotation.y += Math.PI / 4;
  }
  onZoomIn() {
    this.camera.position.z = Math.max(2, this.camera.position.z - 0.5);
  }

  onZoomOut() {
    this.camera.position.z = Math.min(10, this.camera.position.z + 0.5);
  }

  openExportDialog() {
    this.dialog.open(ExportComponent, {
      width: '500px',
      panelClass: 'export-dialog'
    });
  }

  openShareDialog() {
    this.dialog.open(ShareComponent, {
      width: '500px',
      panelClass: 'share-dialog'
    });
  }
}