import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType,HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
interface StatusResponse {
  status: 'processing' | 'complete';
  obj_file?: string;
  glb_file?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  public readonly apiUrl = 'http://localhost:5000';
  private uploadProgressSource = new BehaviorSubject<number>(0);
  public uploadProgress$ = this.uploadProgressSource.asObservable();

  private readonly ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  constructor(private http: HttpClient) {}

  // Méthode principale pour téléverser un fichier
uploadFile(file: File): Observable<{ task_id: string }> {
  const formData = new FormData();
  formData.append('file', file);

  return this.http.post(`${this.apiUrl}/api/upload`, formData, {
    reportProgress: true,
    observe: 'events'
  }).pipe(
    tap(event => {
      if (event.type === HttpEventType.UploadProgress && event.total) {
        const progress = Math.round((100 * event.loaded) / event.total);
        this.uploadProgressSource.next(progress);
      }
    }),
    filter(event => event.type === HttpEventType.Response), // ✅ Garde uniquement les réponses HTTP
    map(event => {
      return {
        task_id: (event as HttpResponse<any>).body.task_id
      };
    }),
    catchError(error => this.handleUploadError(error))
  );
}
  // Vérifie l'état du traitement via un ID de tâche
  checkStatus(taskId: string): Observable<StatusResponse> {
    return this.http.get<StatusResponse>(`${this.apiUrl}/api/status/${taskId}`).pipe(
      map(response => {
        console.log('Statut reçu:', response); // 👈 Debug
        return response;
      }),
      catchError(error => {
        console.error('Erreur lors de la vérification du statut:', error);
        return throwError(() => error);
      })
    );
  }

  // Télécharge le fichier traité
  downloadFile(taskId: string, filename: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/api/download/${taskId}/${filename}`, {
      responseType: 'blob'
    }).pipe(
      catchError(error => {
        console.error('Erreur lors du téléchargement:', error);
        return throwError(() => error);
      })
    );
  }

  // Validation du fichier avant envoi
  validateFile(file: File): { isValid: boolean; error?: string } {
    if (!file) {
      return { isValid: false, error: 'Aucun fichier sélectionné.' };
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: 'Format non supporté. Formats acceptés : PNG, JPG, JPEG, WEBP.'
      };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `Fichier trop volumineux. Taille maximale autorisée : ${this.MAX_FILE_SIZE / (1024 * 1024)} Mo.`
      };
    }

    return { isValid: true };
  }

  // Gestion des erreurs d'upload
  private handleUploadError(error: any): Observable<never> {
    this.uploadProgressSource.next(0);
    console.error('Erreur d\'upload:', error);
    let message = 'Une erreur est survenue lors du téléchargement.';
    if (error?.error?.message) {
      message = error.error.message;
    } else if (error.message) {
      message = error.message;
    }

    return throwError(() => new Error(message));
  }
}