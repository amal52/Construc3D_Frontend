import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

@Injectable({
    providedIn: 'root'
    })
    export class TriposrService {
    private readonly API_URL = 'http://localhost:3000/triposr/convert';
    private objLoader = new OBJLoader();

    constructor(private http: HttpClient) {}

    /**
     * Envoie l'image au backend Express → reçoit le .obj en ArrayBuffer
     */
    convertImageTo3D(imageFile: File): Observable<ArrayBuffer> {
        const formData = new FormData();
        formData.append('file', imageFile);

        return this.http.post(this.API_URL + '/convert', formData, {
        responseType: 'arraybuffer'
        });
    }

    /**
     * Charge le modèle .obj dans la scène Three.js
     */
    loadOBJModel(objData: ArrayBuffer): Observable<THREE.Group> {
        return from(new Promise<THREE.Group>((resolve, reject) => {
        try {
            const blob = new Blob([objData], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);

            this.objLoader.load(
            url,
            (object) => {
                URL.revokeObjectURL(url);
                resolve(object);
            },
            undefined,
            (error) => {
                URL.revokeObjectURL(url);
                reject(error);
            }
            );
        } catch (err) {
            reject(err);
        }
        }));
    }

    applyMaterialToModel(model: THREE.Group, material: THREE.Material): void {
        model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.material = material;
        }
        });
    }

    createDefaultMaterial(): THREE.MeshStandardMaterial {
        return new THREE.MeshStandardMaterial({
        color: 0xE4995B,
        roughness: 0.5,
        metalness: 0.5,
        side: THREE.DoubleSide
        });
    }
    }