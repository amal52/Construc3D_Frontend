import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

// Déclaration des objets globaux
declare const gapi: any;
declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {
  private readonly CLIENT_ID = '845933994547-jsu9f094klli753cds5s82vjts731qp6.apps.googleusercontent.com';
  private readonly API_KEY = 'AIzaSyBNXCzNXpvgUgM9pj4UtQy0PmPGn0mL9Xw';
  private readonly SCOPE = ['https://www.googleapis.com/auth/drive.readonly'];
  private readonly DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
  private isApiLoaded = false;
  private pickerApiLoaded = false;
  private oauthToken: string | null = null;

  constructor() {
    this.loadGoogleApis();
  }

  private loadGoogleApis(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        gapi.load('client:auth2:picker', async () => {
          try {
            await gapi.client.init({
              apiKey: this.API_KEY,
              clientId: this.CLIENT_ID,
              scope: this.SCOPE.join(' '),
              discoveryDocs: this.DISCOVERY_DOCS
            });

            await gapi.auth2.init({
              client_id: this.CLIENT_ID,
              scope: this.SCOPE.join(' ')
            });

            this.isApiLoaded = true;
            this.pickerApiLoaded = true;
            resolve();
          } catch (error) {
            console.error('Erreur lors de l\'initialisation de l\'API Google:', error);
            reject(error);
          }
        });
      };
      script.onerror = (error: any) => {
        console.error('Erreur lors du chargement du script Google API:', error);
        reject(error);
      };
      document.body.appendChild(script);
    });
  }

  public async signIn(): Promise<boolean> {
    if (!this.isApiLoaded) {
      await this.loadGoogleApis();
    }

    try {
      const googleAuth = gapi.auth2.getAuthInstance();
      const user = await googleAuth.signIn({ scope: this.SCOPE.join(' ') });

      if (user.isSignedIn()) {
        const authResponse = user.getAuthResponse(true);
        this.oauthToken = authResponse.access_token;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return false;
    }
  }

  public async signOut(): Promise<void> {
    if (!this.isApiLoaded) {
      return;
    }

    try {
      const googleAuth = gapi.auth2.getAuthInstance();
      await googleAuth.signOut();
      this.oauthToken = null;
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  }

  public isSignedIn(): boolean {
    if (!this.isApiLoaded) {
      return false;
    }
    const googleAuth = gapi.auth2.getAuthInstance();
    return googleAuth?.isSignedIn.get() || false;
  }

  public async openPicker(): Promise<File | null> {
    if (!this.isApiLoaded || !this.pickerApiLoaded) {
      throw new Error('L\'API Google ou Picker n\'est pas encore chargée');
    }

    if (!this.isSignedIn()) {
      throw new Error('Utilisateur non connecté');
    }

    return new Promise((resolve, reject) => {
      const picker = new google.picker.PickerBuilder()
        .addView(google.picker.ViewId.DOCS_IMAGES)
        .setOAuthToken(this.oauthToken!)
        .setDeveloperKey(this.API_KEY)
        .setCallback(async (data: any) => {
          if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED) {
            const doc = data[google.picker.Response.DOCUMENTS][0];
            try {
              const file = await this.downloadFile(doc.id).toPromise();
              if (file) {
                resolve(file);
              } else {
                resolve(null);
              }
            } catch (error) {
              reject(error);
            }
          } else if (data[google.picker.Response.ACTION] === google.picker.Action.CANCEL) {
            resolve(null);
          }
        })
        .enableFeature(google.picker.Feature.NAV_HIDDEN)
        .setSize(800, 600)
        .build();

      picker.setVisible(true);
    });
  }

  private downloadFile(fileId: string): Observable<File> {
    return from(fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${this.oauthToken}` }
    })).pipe(
      switchMap(async (response: Response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const blob = await response.blob();
        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        const contentDisposition = response.headers.get('content-disposition');
        const fileName = contentDisposition
          ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
          : 'downloaded-file';

        return new File([blob], fileName, { type: contentType });
      }),
      catchError(error => {
        console.error('Erreur lors du téléchargement du fichier:', error);
        return throwError(() => new Error('Échec du téléchargement du fichier'));
      })
    );
  }

  public async getFileMetadata(fileId: string): Promise<any> {
    try {
      const response = await gapi.client.drive.files.get({
        fileId: fileId,
        fields: 'id, name, mimeType, size, modifiedTime'
      });
      return response.result;
    } catch (error) {
      console.error('Erreur lors de la récupération des métadonnées:', error);
      throw error;
    }
  }
}