# Documentation de l'Interface de Soumission d'Images 2D

## Vue d'ensemble
L'interface de soumission d'images 2D permet aux créateurs de télécharger facilement leurs fichiers 2D pour une conversion en modèles 3D. Cette interface est accessible après l'authentification via la route `/upload`.

## Fonctionnalités principales

### 1. Zone de dépôt de fichiers
- Support du glisser-déposer (drag & drop)
- Clic pour sélection manuelle de fichiers
- Formats supportés : PNG, JPG, JPEG, SVG
- Retour visuel lors du survol et du dépôt

### 2. Barre de progression
- Affichage en temps réel de la progression du téléchargement
- Indication visuelle claire de l'état du processus

## Spécifications techniques

### Composant : UploadComponent
```typescript
@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ]
})
```

### Méthodes principales

#### `onDrop(event: DragEvent)`
- Gère le dépôt de fichiers
- Empêche le comportement par défaut du navigateur
- Traite le premier fichier déposé

#### `onFileSelected(event: Event)`
- Gère la sélection de fichiers via le dialogue de fichiers
- Traite le fichier sélectionné

#### `handleFile(file: File)`
- Traite le fichier téléchargé
- Simule la progression du téléchargement
- Redirige vers l'interface de personnalisation après le téléchargement

## Guide d'utilisation

1. **Accès à l'interface**
   - Se connecter à la plateforme
   - Naviguer vers la section "Soumettre un Design 2D"

2. **Téléchargement de fichiers**
   - Option 1 : Glisser-déposer le fichier directement dans la zone indiquée
   - Option 2 : Cliquer sur la zone pour ouvrir le sélecteur de fichiers

3. **Suivi du téléchargement**
   - Observer la barreM? cxwxd hl&  ion
   - Attendre la fin du téléchargement
   - Redirection automatique vers l'interface de personnalisation

## Styles et apparence
- Thème Material Design avec palette jaune-orange
- Zone de dépôt avec bordure pointillée
- Icône de téléchargement centrée
- Retour visuel lors des interactions

## Contraintes et limitations
- Un seul fichier à la fois
- Formats acceptés : PNG, JPG, JPEG, SVG uniquement
- Taille maximale de fichier recommandée : 10 MB

## Messages d'erreur
- Format de fichier non supporté
- Erreur de téléchargement
- Fichier trop volumineux

## Prochaines étapes après le téléchargement
1. Traitement automatique par l'IA
2. Redirection vers l'interface de personnalisation
3. Possibilité d'ajuster le modèle 3D généré
# 3D Conversion Application Documentation

## Backend Setup

### Environment Variables (.env)

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=3d_conversion
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
```

### Database Schema

The application uses MySQL with the following main tables:
- `3d_users`: User management
- `3d_projects`: Project information
- `3d_models`: 3D model data
- `3d_comments`: User comments
- `3d_model_exports`: Export records

### API Endpoints

#### Authentication
- `POST /api/auth/login`: User login
- `POST /api/auth/register`: User registration
- `GET /api/auth/me`: Get current user

#### File Upload
- `POST /api/upload/local`: Upload local file
  - Requires authentication
  - Accepts multipart/form-data
  - Supports: PNG, JPG, SVG
  - Max file size: 10MB

#### Projects
- `GET /api/projects`: List projects
- `POST /api/projects`: Create project
- `GET /api/projects/:id`: Get project details
- `PUT /api/projects/:id`: Update project
- `DELETE /api/projects/:id`: Delete project

## Frontend Setup

### Environment Configuration

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### Authentication Service

The `AuthService` handles user authentication:
- Login/logout functionality
- Token management
- User session handling

### Upload Service

The `UploadService` manages file uploads:
- File validation
- Upload progress tracking
- Error handling
- 
### Components

1. Login Component
- Handles user authentication
- Form validation
- Error messages

2. Upload Component
- File selection
- Upload progress
- Format validation
- Error handling

## Integration Guide

### 1. Authentication Flow

```typescript
// Frontend: Login
this.authService.login(email, password).subscribe({
  next: (response) => {
    if (response.data?.token) {
      this.authService.setToken(response.data.token);
      this.router.navigate(['/upload']);
    }
  },
  error: (error) => {
    this.handleError(error);
  }
});

// Backend: Token Verification
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      error: { message: 'No token provided' }
    });
  }
  // Verify token and proceed
};
```
### 2. File Upload Flow

```typescript
// Frontend: File Upload
const formData = new FormData();
formData.append('file', file);

this.http.post(`${this.apiUrl}/upload/local`, formData, {
  headers: { Authorization: `Bearer ${token}` },
  reportProgress: true,
  observe: 'events'
}).pipe(
  map(event => this.handleUploadProgress(event))
);

// Backend: File Processing
const handleUpload = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user.id;
    
    // Save file info to database
    const result = await saveFileInfo(file, userId);
    
    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        fileUrl: result.fileUrl
      }
    });
  } catch (error) {
    handleError(error, res);
  }
};
```

### 3. Error Handling

```typescript
// Frontend: Global Error Interceptor
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}

// Backend: Error Handler
const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal server error'
    }
  });
};
```

## Security Considerations

1. Authentication
- JWT tokens for session management
- Token expiration
- Secure password storage with bcrypt

2. File Upload
- File type validation
- Size limits
- Malware scanning
- Secure storage

3. API Security
- CORS configuration
- Rate limiting
- Input validation
- XSS protection

## Development Workflow

1. Start Backend Server
```bash
cd backend
npm install
npm run dev
```

2. Start Frontend Development Server
```bash
cd frontend
npm install
ng serve
```

3. Database Setup
```bash
# Initialize database
mysql -u root -p < schema.sql
```

## Testing

1. Backend Tests
```bash
cd backend
npm test
```

2. Frontend Tests
```bash
cd frontend
ng test
```

## Deployment

1. Backend
- Set production environment variables
- Configure PM2 or similar process manager
- Set up reverse proxy (nginx)

2. Frontend
- Build production assets
```bash
ng build --configuration=production
```
- Deploy to static hosting

## Monitoring

1. Backend Logging
- Winston for logging
- Error tracking
- Performance monitoring

2. Frontend Monitoring
- Error tracking
- Performance metrics
- User analytics

## Troubleshooting

Common Issues:

1. Upload Errors
- Check file size limits
- Verify file types
- Ensure authentication token is valid
- Check storage permissions

2. Authentication Issues
- Verify JWT token
- Check token expiration
- Validate credentials
- Check CORS settings

3. Database Connection
- Verify credentials
- Check connection string
- Ensure database is running
- Check network connectivity