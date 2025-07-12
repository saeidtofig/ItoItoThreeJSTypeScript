import * as THREE from 'three'
import type { TextureControlsProps, TextureTransform } from '../types/app';


export default function TextureControls({ textures, setTextures }: TextureControlsProps) {
  const handleTextureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const image = new Image()
      image.onload = () => {
        const texture = new THREE.Texture(image)
        texture.needsUpdate = true
        texture.colorSpace = THREE.SRGBColorSpace
        // Store transform directly on the texture
        texture.userData = {
          transform: {
            scale: 1,
            position: { x: 0, y: 0 }
          } as TextureTransform
        }

        // Add new texture to the end of the array
        setTextures([...textures, texture])
      }
      image.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const updateTransform = (index: number, key: keyof TextureTransform | 'position', value: number | { x: number, y: number }) => {
    const newTextures = [...textures]
    if (!newTextures[index]) return

    if (typeof value === 'object') {
      newTextures[index].userData.transform.position = {
        ...newTextures[index].userData.transform.position,
        ...value
      }
    } else {
      (newTextures[index].userData.transform[key as keyof TextureTransform] as number) = value
    }

    // Mark texture for update
    newTextures[index].needsUpdate = true
    setTextures(newTextures)
  }

  const removeTexture = (index: number) => {
    const newTextures = textures.filter((_, i) => i !== index)
    setTextures(newTextures)
  }

  function handleUpTexture(index: number){
    if(index>=textures.length-1) return;

    const newTexture=[...textures];
    [newTexture[index],newTexture[index+1]]=[newTexture[index+1],newTexture[index]];
    setTextures(newTexture);

  }


  return (
    <div className="control-section">
      <h3>Texture Controls</h3>
      <div className="texture-upload">
        <input
          type="file"
          accept="image/*"
          onChange={handleTextureUpload}
        />
      </div>

      {textures.map((texture, index) => (
        <div key={index} className="texture-control">
          <div className="texture-header">
            <h4>Texture {index + 1}</h4>
            <button onClick={() => removeTexture(index)}>Remove</button>
          </div>
          <button
            onClick={() => { handleUpTexture(index) }}>
            Up
          </button>
          <div className="transform-controls">
            <label>Scale:
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={texture.userData.transform.scale}
                onChange={(e) => updateTransform(index, 'scale', parseFloat(e.target.value))}
              />
            </label>
            <label>Position X:
              <input
                type="range"
                min="-1"
                max="1"
                step="0.1"
                value={texture.userData.transform.position.x}
                onChange={(e) => updateTransform(index, 'position', {
                  x: parseFloat(e.target.value),
                  y: texture.userData.transform.position.y
                })}
              />
            </label>
            <label>Position Y:
              <input
                type="range"
                min="-1"
                max="1"
                step="0.1"
                value={texture.userData.transform.position.y}
                onChange={(e) => updateTransform(index, 'position', {
                  y: parseFloat(e.target.value),
                  x: texture.userData.transform.position.x
                })}
              />
            </label>
          </div>
        </div>
      ))}
    </div>
  )
}