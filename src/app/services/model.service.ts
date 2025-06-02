import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ModelSettings {
  color: string;
  texture: string;
  shininess: number;
  lightIntensity: number;
  shadowIntensity: number;
  ambientLight: number;
  rotationSpeed: number;
  animationType: string;
}

export interface ModelVersion {
  id: string;
  thumbnail: string;
  date: string;
  name: string;
  objUrl: string;
  glbUrl: string;
  settings: ModelSettings;
  isModified: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  private defaultSettings: ModelSettings = {
    color: '#f4f1ec',
    texture: 'smooth',
    shininess: 50,
    lightIntensity: 75,
    shadowIntensity: 50,
    ambientLight: 30,
    rotationSpeed: 2,
    animationType: 'rotate'
  };

  private modelSettings = new BehaviorSubject<ModelSettings>(this.defaultSettings);
  private modelVersions = new BehaviorSubject<ModelVersion[]>([]);
  private currentVersionId = new BehaviorSubject<string | null>(null);
  private objUrl = new BehaviorSubject<string>('');
  private glbUrl = new BehaviorSubject<string>('');

  modelSettings$ = this.modelSettings.asObservable();
  modelVersions$ = this.modelVersions.asObservable();
  currentVersionId$ = this.currentVersionId.asObservable();
  objUrl$ = this.objUrl.asObservable();
  glbUrl$ = this.glbUrl.asObservable();

  updateModelSettings(settings: ModelSettings): void {
    this.modelSettings.next({ ...this.defaultSettings, ...settings });
  }

  updateModelUrls(objUrl: string, glbUrl: string): void {
    this.objUrl.next(objUrl);
    this.glbUrl.next(glbUrl);
  }

  addModelVersion(version: ModelVersion): void {
    const currentVersions = [...this.modelVersions.value];
    currentVersions.unshift(version);
    this.modelVersions.next(currentVersions);
    this.currentVersionId.next(version.id);
  }

  setCurrentVersionId(id: string): void {
    this.currentVersionId.next(id);
  }

  getCurrentSettings(): ModelSettings {
    return this.modelSettings.value;
  }

  getVersionById(id: string): ModelVersion | undefined {
    return this.modelVersions.value.find(v => v.id === id);
  }

  resetSettings(): void {
    this.modelSettings.next(this.defaultSettings);
  }

  getCurrentVersion(): ModelVersion | undefined {
    const currentId = this.currentVersionId.value;
    return currentId ? this.getVersionById(currentId) : undefined;
  }
}