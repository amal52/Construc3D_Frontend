/**
 * Interface représentant un projet de conversion 2D vers 3D
 */
export interface Project {
    /** Identifiant unique du projet */
    id: string;
    
    /** Nom du projet */
    name: string;
    
    /** Date de création */
    createdAt: Date;
    
    /** URL de l'image 2D source dans Google Drive */
    sourceImageUrl: string;
    
    /** URL du modèle 3D généré dans Google Drive */
    model3dUrl: string;
    
    /** État de la conversion */
    status: 'pending' | 'processing' | 'completed' | 'failed';
    
    /** Métadonnées supplémentaires */
    metadata: {
      /** Dimensions originales de l'image */
      originalDimensions: {
        width: number;
        height: number;
      };
      /** Format du fichier source */
      sourceFormat: string;
      /** Taille du fichier en bytes */
      fileSize: number;
      /** Paramètres de conversion utilisés */
      conversionParameters?: {
        quality: 'low' | 'medium' | 'high';
        preserveTextures: boolean;
        generateUV: boolean;
      };
    };
  }
  
  /**
   * Interface pour l'historique des conversions
   */
  export interface ConversionHistory {
    /** Identifiant de l'utilisateur */
    userId: string;
    
    /** Liste des projets */
    projects: Project[];
    
    /** Statistiques d'utilisation */
    stats: {
      totalProjects: number;
      successfulConversions: number;
      failedConversions: number;
      averageProcessingTime: number;
    };
  }