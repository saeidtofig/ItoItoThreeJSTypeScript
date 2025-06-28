import { useGLTF } from '@react-three/drei'
import type { ModelViewerProps, GLTF } from '../types/app';


export default function ModelViewer({ modelUrl, textures, dimensions }: ModelViewerProps) {
  const gltf = useGLTF(modelUrl) as unknown as GLTF
  const scene = gltf.scene


  return (
    <group>
      <primitive object={scene} />
    </group>
  )
}