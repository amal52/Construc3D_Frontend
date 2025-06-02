// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../environments/environment';
// import { tap, catchError, map } from 'rxjs/operators';

// export interface UserProfile {
//   id: number;
//   email: string;
//   settings: {
//     theme: string;
//     notifications: boolean;
//     language: string;
//   };
//   last_login: string;
//   created_at: string;
//   updated_at: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {
//   private apiUrl = `${environment.apiUrl}/users`;
//   private userProfile = new BehaviorSubject<UserProfile | null>(this.getStoredProfile());

//   userProfile$ = this.userProfile.asObservable();

//   constructor(private http: HttpClient) {
//     this.loadUserProfile();
//   }

//   private getStoredProfile(): UserProfile | null {
//     const stored = localStorage.getItem('userProfile');
//     if (stored) {
//       const profile = JSON.parse(stored);
//       this.applyTheme(profile.settings?.theme || 'light');
//       return profile;
//     }
//     return null;
//   }

//   private getAuthToken(): string | null {
//     return localStorage.getItem('token');
//   }

//   saveProfile(profile: UserProfile) {
//     localStorage.setItem('userProfile', JSON.stringify(profile));
//     this.userProfile.next(profile);
//     this.applyTheme(profile.settings?.theme || 'light');
//   }

//   loadUserProfile(): Observable<UserProfile> {
//     const token = this.getAuthToken();
//     if (!token) {
//       return new Observable<UserProfile>(subscriber => {
//         const defaultProfile: UserProfile = {
//           id: 0,
//           email: '',
//           settings: {
//             theme: 'light',
//             notifications: true,
//             language: 'fr'
//           },
//           last_login: new Date().toISOString(),
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString()
//         };
//         subscriber.next(defaultProfile);
//         subscriber.complete();
//       });
//     }

//     return this.http.get<{success: boolean; data: UserProfile}>(`${this.apiUrl}/profile`, {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     }).pipe(
//       map(response => response.data),
//       tap(profile => this.saveProfile(profile)),
//       catchError(error => {
//         console.error('Error loading profile:', error);
//         return new Observable<UserProfile>(subscriber => {
//           // const defaultProfile: UserProfile = {
//           //   // id: 0,
//             // email: '',
//             // settings: {
//             //   theme: 'light',
//             //   notifications: true,
//             //   language: 'fr'
//             // },
//             // last_login: new Date().toISOString(),
//             // created_at: new Date().toISOString(),
//             // updated_at: new Date().toISOString()
//           // };
//           // subscriber.next(defaultProfile);
//           subscriber.complete();
//         });
//       })
//     );
//   }

//   updateProfile(profile: Partial<UserProfile>): Observable<UserProfile> {
//     const token = this.getAuthToken();
//     return this.http.patch<{success: boolean; data: UserProfile}>(`${this.apiUrl}/profile`, profile, {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     }).pipe(
//       map(response => response.data),
//       tap(updatedProfile => this.saveProfile(updatedProfile))
//     );
//   }

//   updateTheme(theme: string) {
//     const currentProfile = this.userProfile.value;
//     if (currentProfile) {
//       const updatedProfile = {
//         ...currentProfile,
//         settings: {
//           ...currentProfile.settings,
//           theme
//         }
//       };
//       this.saveProfile(updatedProfile);
      
//       const token = this.getAuthToken();
//       if (token) {
//         this.http.patch(`${this.apiUrl}/profile`, {
//           settings: updatedProfile.settings
//         }, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }).subscribe();
//       }
//     }
//   }

//   private applyTheme(theme: string) {
//     document.body.className = `theme-${theme}`;
//     document.documentElement.setAttribute('data-theme', theme);
//   }

//   getCurrentTheme(): string {
//     return this.userProfile.value?.settings?.theme || 'light';
//   }

//   clearProfile() {
//     localStorage.removeItem('userProfile');
//     localStorage.removeItem('token');
//     this.userProfile.next(null);
//   }
// }
