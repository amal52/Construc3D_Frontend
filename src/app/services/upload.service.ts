import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = `${environment.apiUrl}/upload`;
  private uploadProgressSource = new BehaviorSubject<number>(0);
  public uploadProgress$ = this.uploadProgressSource.asObservable();
  private readonly ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml'];
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  uploadLocalFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.post(`${this.apiUrl}/local`, formData, {
      headers,
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const progress = Math.round((100 * event.loaded) / event.total);
          this.uploadProgressSource.next(progress);
        } else if (event.type === HttpEventType.Response) {
          return event.body;
        }
        return null;
      }),
      catchError(error => {
        console.error('Erreur HTTP:', error);
        this.handleUploadError(error);
        return throwError(() => error);
      })
    );
  }

  validateFile(file: File): { isValid: boolean; error?: string } {
    if (!file) {
      return { isValid: false, error: 'Aucun fichier fourni.' };
    }
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { isValid: false, error: 'Type de fichier non supporté.' };
    }
    if (file.size > this.MAX_FILE_SIZE) {
      return { isValid: false, error: 'Fichier trop volumineux.' };
    }
    return { isValid: true };
  }

  private handleUploadError(error: any): void {
    this.uploadProgressSource.next(0);
    console.error('Erreur de téléchargement:', error);
    let message = 'Une erreur est survenue lors du téléchargement ,Service.';
    if (error.error?.message) {
      message = error.error.message;
    } else if (error.message) {
      message = error.message;
    }
    throw new Error(message);
  }
}