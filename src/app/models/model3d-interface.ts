export interface Model3D {
    id: string;
    name: string;
    description?: string;
    userId: string;
    originalImageUrl: string;
    
    modelData: {
        vertices: number[];
        faces: number[];
        textureCoords?: number[];
        normals?: number[];
    };

    renderSettings: {
        color: string;
        texture: string;
        shininess: number;
        lightIntensity: number;
        shadowIntensity: number;
        ambientLight: number;
    };

    status: 'processing' | 'completed' | 'failed';
    createdAt: Date;
    updatedAt: Date;
    sharedWith?: string[];
    isPublic: boolean;
    tags?: string[];
    version: number;
}