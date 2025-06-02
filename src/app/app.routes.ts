import { Routes } from '@angular/router';
import { UploadComponent } from './components/upload/upload.component';
import { CustomizeComponent } from './components/customize/customize.component';
import { ViewerComponent } from './components/viewer/viewer.component';
import { LoginComponent } from './components/login/login.component';
import { ExportComponent } from './components/export/export.component';
import { ShareComponent } from './components/share/share.component';
//import { ProfileComponent } from './components/profile.component';


export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'customize', component: CustomizeComponent },
  { path: 'viewer', component: ViewerComponent },
  { path: 'export', component: ExportComponent },
  { path: 'share', component: ShareComponent },
  //{ path: 'profile', component: ProfileComponent },

];