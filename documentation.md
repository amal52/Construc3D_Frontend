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