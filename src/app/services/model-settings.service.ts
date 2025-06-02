import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ModelSettings {
  id?: number;
  name: string;
  date?: string;
  color: string;
  texture: string;
  shininess: number;
  lightIntensity: number;
  ambientLight: number;
  shadowIntensity: number;
  rotationSpeed: number;
  animationType: string;
  objUrl?: string;
  glbUrl?: string;
  thumbnail?: string;
  notes?: string[];
  images?: string[];
  isModified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ModelSettingsResponse {
  id: number;
  settings: ModelSettings;
}

@Injectable({
  providedIn: 'root'
})
export class ModelSettingsService {
  private apiUrl = `${environment.apiUrl}/model-settings`;
  private readonly STORAGE_KEY = 'model_settings';
  private settings: ModelSettings[] = [];

  constructor(private http: HttpClient) {
    this.loadSettings();
  }

  getAll(): Observable<ModelSettings[]> {
    // Try API first, fallback to local storage
    return new Observable<ModelSettings[]>(observer => {
      this.http.get<ModelSettings[]>(this.apiUrl).subscribe(
        (settings) => {
          this.settings = settings;
          this.saveSettings();
          observer.next(settings);
          observer.complete();
        },
        () => {
          // Fallback to local storage if API fails
          observer.next(this.settings);
          observer.complete();
        }
      );
    });
  }

  getById(id: number): Observable<ModelSettings> {
    return new Observable<ModelSettings>(observer => {
      this.http.get<ModelSettings>(`${this.apiUrl}/${id}`).subscribe(
        (settings) => {
          observer.next(settings);
          observer.complete();
        },
        () => {
          // Fallback to local storage
          const settings = this.settings.find(s => s.id === id);
          if (settings) {
            observer.next(settings);
          } else {
            observer.error(new Error('Settings not found'));
          }
          observer.complete();
        }
      );
    });
  }

  create(settings: Partial<ModelSettings>): Observable<ModelSettings> {
    return new Observable<ModelSettings>(observer => {
      const newSettings: ModelSettings = {
        id: Date.now(),
        name: settings.name || `Version ${Date.now()}`,
        date: new Date().toISOString(),
        color: settings.color || '#f4f1ec',
        texture: settings.texture || 'smooth',
        shininess: settings.shininess || 50,
        lightIntensity: settings.lightIntensity || 75,
        ambientLight: settings.ambientLight || 30,
        shadowIntensity: settings.shadowIntensity || 50,
        rotationSpeed: settings.rotationSpeed || 2,
        animationType: settings.animationType || 'rotate',
        objUrl: settings.objUrl,
        glbUrl: settings.glbUrl,
        thumbnail: settings.thumbnail,
        notes: settings.notes || [],
        images: settings.images || [],
        isModified: settings.isModified || false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.http.post<ModelSettings>(this.apiUrl, newSettings).subscribe(
        (savedSettings) => {
          this.settings.unshift(savedSettings);
          this.saveSettings();
          observer.next(savedSettings);
          observer.complete();
        },
        () => {
          // Fallback to local storage if API fails
          this.settings.unshift(newSettings);
          this.saveSettings();
          observer.next(newSettings);
          observer.complete();
        }
      );
    });
  }

  update(id: number, settings: Partial<ModelSettings>): Observable<ModelSettings> {
    return new Observable<ModelSettings>(observer => {
      this.http.put<ModelSettings>(`${this.apiUrl}/${id}`, settings).subscribe(
        (updatedSettings) => {
          const index = this.settings.findIndex(s => s.id === id);
          if (index !== -1) {
            this.settings[index] = updatedSettings;
            this.saveSettings();
          }
          observer.next(updatedSettings);
          observer.complete();
        },
        () => {
          // Fallback to local storage
          const index = this.settings.findIndex(s => s.id === id);
          if (index !== -1) {
            this.settings[index] = { ...this.settings[index], ...settings, updatedAt: new Date() };
            this.saveSettings();
            observer.next(this.settings[index]);
          } else {
            observer.error(new Error('Settings not found'));
          }
          observer.complete();
        }
      );
    });
  }

  delete(id: number): Observable<void> {
    return new Observable<void>(observer => {
      this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe(
        () => {
          this.settings = this.settings.filter(s => s.id !== id);
          this.saveSettings();
          observer.next();
          observer.complete();
        },
        () => {
          // Fallback to local storage
          this.settings = this.settings.filter(s => s.id !== id);
          this.saveSettings();
          observer.next();
          observer.complete();
        }
      );
    });
  }

  private loadSettings(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.settings = JSON.parse(saved);
      } catch (e) {
        console.error('Error loading settings:', e);
        this.settings = [];
      }
    }
  }

  private saveSettings(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings));
  }
}
