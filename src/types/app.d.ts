import * as THREE from 'three';

export interface Dimensions {
  x: number;
  y: number;
  z: number;
}

export interface Measurements {
  min?: Dimensions;
  max?: Dimensions;
  initial?: Dimensions;
}

export interface TextureTransform {
  scale: number;
  position: {
    x: number;
    y: number;
  };
}

// Extended Three.js types
declare module 'three' {
  interface Texture {
    userData: {
      transform: TextureTransform;
    };
  }
}

// GLTF Loader types
interface GLTF {
  scene: THREE.Group
  scenes: THREE.Group[]
  cameras: THREE.Camera[]
  animations: THREE.AnimationClip[]
}

// Component props
export interface ModelViewerProps {
  modelUrl: string;
  textures: THREE.Texture[];
  dimensions: Dimensions;
}

export interface TextureControlsProps {
  textures: THREE.Texture[];
  setTextures: React.Dispatch<React.SetStateAction<THREE.Texture[]>>;
}

export interface DimensionControlsProps {
  measurements?: Measurements;
  dimensions: Dimensions;
  setDimensions: React.Dispatch<React.SetStateAction<Dimensions>>;
}

// API types
export interface ApiData {
  modelUrl: string;
  measurements: {
    min: Dimensions;
    max: Dimensions;
    initial: Dimensions;
  };
}


// Type guards
export function isMesh(object: THREE.Object3D): object is THREE.Mesh {
  return (object as THREE.Mesh).isMesh;
}