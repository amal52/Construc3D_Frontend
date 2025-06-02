// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MatCardModule } from '@angular/material/card';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { FormsModule } from '@angular/forms';
// import { UserService, UserProfile } from '../services/user.service';

// @Component({
//   selector: 'app-profile',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatCardModule,
//     MatButtonModule,
//     MatIconModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatSelectModule,
//     FormsModule
//   ],
//   template: `
//     <div class="profile-container">
//       <mat-card class="profile-card">
//         <mat-card-header>
//           <mat-card-title>Mon Profil</mat-card-title>
//         </mat-card-header>
        
//         <mat-card-content>
//           <div class="profile-avatar">
//             <div class="avatar-wrapper">
//               <button mat-mini-fab color="primary" class="change-avatar-btn">
//                 <mat-icon>edit</mat-icon>
//               </button>
//             </div>
//           </div>

//           <div class="profile-form">
//             <mat-form-field appearance="outline">
//               <mat-label>Id</mat-label>
//               <input matInput [(ngModel)]="userProfile.id" name="name">
//             </mat-form-field>

//             <mat-form-field appearance="outline">
//               <mat-label>Thème</mat-label>
//               <mat-select [(ngModel)]="userProfile.settings" (selectionChange)="updateTheme($event.value)">
//                 <mat-option value="light">Clair</mat-option>
//                 <mat-option value="dark">Sombre</mat-option>
//                 <mat-option value="system">Système</mat-option>
//               </mat-select>
//             </mat-form-field>

//             <div class="profile-info">
//               <p><strong>Dernière connexion:</strong> {{userProfile.last_login | date:'medium'}}</p>
//             </div>
//           </div>
//         </mat-card-content>

//         <mat-card-actions>
//           <button mat-raised-button color="primary" (click)="saveProfile()">
//             Enregistrer les modifications
//           </button>
//         </mat-card-actions>
//       </mat-card>
//     </div>
//   `,
//   styles: [`
//     .profile-container {
//       padding: 24px;
//       max-width: 800px;
//       margin: 0 auto;
//     }

//     .profile-card {
//       padding: 24px;
//       background: var(--card-background);
//       border-radius: 12px;
//       box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//     }

//     .profile-avatar {
//       display: flex;
//       justify-content: center;
//       margin-bottom: 24px;
//     }

//     .avatar-wrapper {
//       position: relative;
//       width: 150px;
//       height: 150px;
//     }

//     .avatar-wrapper img {
//       width: 100%;
//       height: 100%;
//       border-radius: 50%;
//       object-fit: cover;
//       border: 3px solid var(--primary-color);
//       background: var(--card-background);
//     }

//     .change-avatar-btn {
//       position: absolute;
//       bottom: 0;
//       right: 0;
//       background-color: var(--primary-color);
//     }

//     .profile-form {
//       display: flex;
//       flex-direction: column;
//       gap: 16px;
//       max-width: 400px;
//       margin: 0 auto;
//     }

//     .profile-info {
//       background: rgba(var(--primary-rgb), 0.1);
//       padding: 16px;
//       border-radius: 8px;
//       margin-top: 16px;
//     }

//     .profile-info p {
//       margin: 8px 0;
//       color: var(--text-color);
//     }

//     mat-card-actions {
//       display: flex;
//       justify-content: center;
//       padding-top: 24px;
//     }

//     mat-form-field {
//       width: 100%;
//     }

//     ::ng-deep .mat-mdc-form-field-flex {
//       background-color: var(--card-background) !important;
//     }

//     ::ng-deep .mat-mdc-text-field-wrapper {
//       background-color: var(--card-background) !important;
//     }

//     ::ng-deep .mdc-text-field--filled:not(.mdc-text-field--disabled) {
//       background-color: var(--card-background) !important;
//     }

//     ::ng-deep .mat-mdc-select-value {
//       color: var(--text-color);
//     }

//     ::ng-deep .mat-mdc-select-arrow {
//       color: var(--text-color);
//     }

//     ::ng-deep .mat-mdc-form-field-label {
//       color: var(--text-color) !important;
//     }

//     @media (max-width: 600px) {
//       .profile-container {
//         padding: 16px;
//       }

//       .profile-card {
//         padding: 16px;
//       }

//       .avatar-wrapper {
//         width: 120px;
//         height: 120px;
//       }
//     }
//   `]
// })
// export class ProfileComponent implements OnInit {
//   userProfile: UserProfile;

//   constructor(
//     private userService: UserService,
//     private snackBar: MatSnackBar
//   ) {
//     this.userProfile = {
//       id:1,
//       email: '',
//       last_login: new Date().toISOString(),
//       created_at :new Date().toISOString(),
//       settings :{theme:'light'}
//     };
//   }

//   ngOnInit() {
//     this.userService.userProfile$.subscribe(profile => {
//       if (profile) {
//         this.userProfile = { ...profile };
//       }
//     });
//   }

//   updateTheme(theme: string) {
//     this.userService.updateTheme(theme);
//     this.snackBar.open('Thème mis à jour avec succès', 'Fermer', {
//       duration: 3000,
//       panelClass: ['success-snackbar']
//     });
//   }

//   saveProfile() {
//     this.userService.updateProfile(this.userProfile).subscribe(
//       () => {
//         this.snackBar.open('Profil mis à jour avec succès', 'Fermer', {
//           duration: 3000,
//           panelClass: ['success-snackbar']
//         });
//       },
//       error => {
//         this.snackBar.open('Erreur lors de la mise à jour du profil', 'Fermer', {
//           duration: 3000,
//           panelClass: ['error-snackbar']
//         });
//       }
//     );
//   }
// }
