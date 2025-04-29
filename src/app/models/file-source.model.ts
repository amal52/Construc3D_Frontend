import { SafeUrl } from '@angular/platform-browser';

export type FileSource = 'local' | 'google-drive';

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: SafeUrl; // Utilisation de SafeUrl pour la sécurité
  webViewLink: string;
  size: string;
  metadata?: FileMetadata; // Ajout de métadonnées facultatives
}

export interface FileMetadata {
  createdTime: Date;
  modifiedTime: Date;
  owner?: string;
  shared?: boolean;
}

export interface FileSelectionResult {
  source: FileSource;
  file?: GoogleDriveFile;
  localFile?: File;
  error?: string;
}
