import { useGLTF } from '@react-three/drei'
import { useMemo, useEffect, useState } from 'react'
import * as THREE from 'three'
import type { ModelViewerProps, GLTF } from '../types/app';


export default function ModelViewer({ modelUrl, textures, dimensions }: ModelViewerProps) {
  const gltf = useGLTF(modelUrl) as unknown as GLTF
  const scene = gltf.scene
  const [material, setMaterial] = useState<THREE.MeshBasicMaterial | null>(null)

  // Function to quantize and combine textures
  const createCombinedMaterial = (): THREE.MeshBasicMaterial | null => {
    if (!textures[0]?.image) return null

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    
    canvas.width = textures[0].image.width
    canvas.height = textures[0].image.height
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    textures.forEach((texture) => {
      if (!texture?.image) return

      const transform = texture.userData?.transform || {
        scale: 1,
        position: { x: 0, y: 0 }
      }

      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = texture.image.width
      tempCanvas.height = texture.image.height
      const tempCtx = tempCanvas.getContext('2d')
      if (!tempCtx) return
      
      tempCtx.drawImage(texture.image, 0, 0)
      const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
      const data = imageData.data
      
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i+1] + data[i+2]) / 3
        const value = avg > 128 ? 255 : 0
        data[i] = data[i+1] = data[i+2] = value
      }
      tempCtx.putImageData(imageData, 0, 0)

      const scaledWidth = tempCanvas.width * transform.scale
      const scaledHeight = tempCanvas.height * transform.scale
      const posX = transform.position.x * canvas.width
      const posY = transform.position.y * canvas.height

      ctx.drawImage(tempCanvas, posX, posY, scaledWidth, scaledHeight)
    })

    const combinedTexture = new THREE.CanvasTexture(canvas)
    combinedTexture.needsUpdate = true
    
    return new THREE.MeshBasicMaterial({
      map: combinedTexture,
      side: THREE.DoubleSide,
      transparent: true
    })
  }

  // Process model with combined material
  const model = useMemo(() => {
    if (!scene) return null
    
    const clonedScene = scene.clone()
    clonedScene.scale.set(dimensions.x / 100, dimensions.y / 100, dimensions.z / 100)

    const combinedMat = createCombinedMaterial()
    if (combinedMat) {
      clonedScene.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          mesh.material = combinedMat
        }
      })
      setMaterial(combinedMat)
    }
    
    return clonedScene
  }, [scene, dimensions, textures])

  // Update when textures change
  useEffect(() => {
    if (material && textures.length > 0 && model) {
      const combinedMat = createCombinedMaterial()
      if (combinedMat) {
        setMaterial(combinedMat)
        model.traverse((child: THREE.Object3D) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            mesh.material = combinedMat
          }
        })
      }
    }
  }, [textures])

  return (
    <group>
      {model && <primitive object={model} />}
    </group>
  )
}