import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Injectable({
  providedIn: 'root'
})
export class ModelViewerService {
        private scene!: THREE.Scene;
        private camera!: THREE.PerspectiveCamera;
        private renderer!: THREE.WebGLRenderer;
        private controls!: OrbitControls;
        private model: THREE.Group | null = null;
        private lights: {
            ambient: THREE.AmbientLight;
            directional: THREE.DirectionalLight;
            point: THREE.PointLight;
        };

    constructor() {
        this.lights = {
            ambient: new THREE.AmbientLight(0xffffff, 0.5),
            directional: new THREE.DirectionalLight(0xffffff, 0.8),
            point: new THREE.PointLight(0xffffff, 0.5)
        };
    }

    initialize(canvas: HTMLCanvasElement): void {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Controls setup
        this.controls = new OrbitControls(this.camera, canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // Lights setup
        this.setupLights();

        // Start animation loop
        this.animate();
    }

    private setupLights(): void {
        this.lights.directional.position.set(5, 5, 5);
        this.lights.point.position.set(-5, -5, -5);

        this.scene.add(this.lights.ambient);
        this.scene.add(this.lights.directional);
        this.scene.add(this.lights.point);
    }

    setModel(model: THREE.Group): void {
        if (this.model) {
            this.scene.remove(this.model);
        }
        this.model = model;
        this.scene.add(model);
        this.centerModel();
    }

    private centerModel(): void {
        if (!this.model) return;

        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        this.model.position.sub(center);
        const distance = Math.max(size.x, size.y, size.z) * 2;
        this.camera.position.z = distance;
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    }

    updateMaterial(material: THREE.Material): void {
        if (!this.model) return;
        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material = material;
            }
        });
    }

    updateLighting(params: {
        ambientIntensity?: number;
        directionalIntensity?: number;
        pointIntensity?: number;
    }): void {
            if (params.ambientIntensity !== undefined) {
            this.lights.ambient.intensity = params.ambientIntensity;
            }
            if (params.directionalIntensity !== undefined) {
            this.lights.directional.intensity = params.directionalIntensity;
            }
            if (params.pointIntensity !== undefined) {
            this.lights.point.intensity = params.pointIntensity;
            }
    }

    private animate(): void {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    resize(width: number, height: number): void {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    dispose(): void {
        this.renderer.dispose();
        this.controls.dispose();
    }
}