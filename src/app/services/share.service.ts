import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  private apiUrl = `${environment.apiUrl}/api/share`;

  constructor(private http: HttpClient) {}

  shareModel(modelId: string, email: string, permission: string): Observable<any> {
    return this.http.post(this.apiUrl, { modelId, email, permission });
  }

  getSharedUsers(modelId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${modelId}/users`);
  }

  updatePermission(shareId: string, permission: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${shareId}/permission`, { permission });
  }

  removeShare(shareId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${shareId}`);
  }
}