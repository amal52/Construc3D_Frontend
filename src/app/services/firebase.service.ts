/**
 * @file firebase.service.ts
 * @description Ce fichier contient les services Firebase pour gérer les modèles 3D, 
 *              les partages de modèles et les paramètres de rendu.
 *              Il fournit des méthodes CRUD (Create, Read, Update, Delete) pour interagir avec Firestore.
 */
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { environment } from '../../environments/environment';
import { Model3D } from '../models/model3d-interface';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app = initializeApp(environment.firebase);
  private db = getFirestore(this.app);

  // Collections
  private readonly MODELS_COLLECTION = 'models3d';
  private readonly SHARED_MODELS_COLLECTION = 'sharedModels';
  private readonly RENDER_SETTINGS_COLLECTION = 'renderSettings';


  // Models Collection
  async createModel(modelData: Omit<Model3D, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(this.db, this.MODELS_COLLECTION), {
        ...modelData,
        version: 1,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error("Erreur lors de la création du modèle:", error);
      throw error;
    }
  }
  async getUserModels(userId: string): Promise<Model3D[]> {
    try {
      const q = query(
        collection(this.db, this.MODELS_COLLECTION),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()['createdAt'].toDate(),
        updatedAt: doc.data()['updatedAt'].toDate()
      })) as Model3D[];
    } catch (error) {
      console.error("Erreur lors de la récupération des modèles:", error);
      throw error;
    }
  }

  async updateModel(modelId: string, updateData: Partial<Model3D>): Promise<void> {
    try {
      const modelRef = doc(this.db, this.MODELS_COLLECTION, modelId);
      await updateDoc(modelRef, {
        ...updateData,
        updatedAt: Timestamp.now(),
        version: updateData.version ? updateData.version + 1 : 1
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du modèle:", error);
      throw error;
    }
  }

  async deleteModel(modelId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.db, this.MODELS_COLLECTION, modelId));
      // Supprimer également les paramètres de rendu associés
      await this.deleteRenderSettings(modelId);
    } catch (error) {
      console.error("Erreur lors de la suppression du modèle:", error);
      throw error;
    }
  }

  // Shared Models Collection
  async shareModel(modelId: string, sharedWithUserId: string): Promise<void> {
    try {
      await addDoc(collection(this.db, this.SHARED_MODELS_COLLECTION), {
        modelId,
        sharedWithUserId,
        sharedAt: Timestamp.now()
      });
    } catch (error) {
      console.error("Erreur lors du partage du modèle:", error);
      throw error;
    }
  }

  async getSharedModels(userId: string): Promise<Model3D[]> {
    try {
      const q = query(
        collection(this.db, this.SHARED_MODELS_COLLECTION),
        where("sharedWithUserId", "==", userId)
      );
      const sharedSnapshot = await getDocs(q);
      const modelIds = sharedSnapshot.docs.map(doc => doc.data()['modelId']);

      const models: Model3D[] = [];
      for (const modelId of modelIds) {
        const modelDoc = await this.getModelById(modelId);
        if (modelDoc) {
          models.push(modelDoc);
        }
      }
      return models;
    } catch (error) {
      console.error("Erreur lors de la récupération des modèles partagés:", error);
      throw error;
    }
  }

  // Render Settings Collection
  async saveRenderSettings(modelId: string, settings: Model3D['renderSettings']): Promise<void> {
    try {
      const settingsRef = doc(this.db, this.RENDER_SETTINGS_COLLECTION, modelId);
      await updateDoc(settingsRef, {
        ...settings,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des paramètres de rendu:", error);
      throw error;
    }
  }

  async getRenderSettings(modelId: string): Promise<Model3D['renderSettings'] | null> {
    try {
      const settingsDoc = await getDocs(
        query(
          collection(this.db, this.RENDER_SETTINGS_COLLECTION),
          where("modelId", "==", modelId),
          limit(1)
        )
      );
      if (settingsDoc.empty) return null;
      return settingsDoc.docs[0].data() as Model3D['renderSettings'];
    } catch (error) {
      console.error("Erreur lors de la récupération des paramètres de rendu:", error);
      throw error;
    }
  }

  private async deleteRenderSettings(modelId: string): Promise<void> {
    try {
      const settingsRef = doc(this.db, this.RENDER_SETTINGS_COLLECTION, modelId);
      await deleteDoc(settingsRef);
    } catch (error) {
      console.error("Erreur lors de la suppression des paramètres de rendu:", error);
      throw error;
    }
  }

  private async getModelById(modelId: string): Promise<Model3D | null> {
    try {
      const modelDoc = await getDocs(
        query(
          collection(this.db, this.MODELS_COLLECTION),
          where("id", "==", modelId),
          limit(1)
        )
      );
      if (modelDoc.empty) return null;
      const data = modelDoc.docs[0].data();
      return {
        id: modelDoc.docs[0].id,
        ...data,
        createdAt: data['createdAt'].toDate(),
        updatedAt: data['updatedAt'].toDate()
      } as Model3D;
    } catch (error) {
      console.error("Erreur lors de la récupération du modèle:", error);
      throw error;
    }
  }
}