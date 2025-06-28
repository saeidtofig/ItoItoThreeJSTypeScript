import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useState, useEffect } from 'react'
import useApiData from './hooks/useApiData'
import ModelViewer from './components/ModelViewer'
import TextureControls from './components/TextureControls'
import DimensionControls from './components/DimensionControls'
import type { Dimensions } from './types/app';
import * as THREE from 'three' 
import './App.css'


export default function App() {
  const { modelUrl, measurements, loading, error } = useApiData()
  const [textures, setTextures] = useState<THREE.Texture[]>([])
  const [dimensions, setDimensions] = useState<Dimensions>(
    measurements?.initial || { x: 10, y: 10, z: 10 }
  )

  // Update dimensions when measurements load
  useEffect(() => {
    if (measurements?.initial) {
      setDimensions(measurements.initial)
    }
  }, [measurements])

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error">Error: {error.message}</div>

  return (
    <div className="app-container">
      <div className="controls-panel">
        <TextureControls textures={textures} setTextures={setTextures} />
        <DimensionControls 
          measurements={measurements} 
          dimensions={dimensions} 
          setDimensions={setDimensions} 
        />
      </div>

      <div className="canvas-container">
        <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          {modelUrl && (
            <ModelViewer 
              modelUrl={modelUrl} 
              textures={textures} 
              dimensions={dimensions} 
            />
          )}
        </Canvas>
      </div>
    </div>
  )
}