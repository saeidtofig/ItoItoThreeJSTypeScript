import type { DimensionControlsProps, Dimensions } from '../types/app';


export default function DimensionControls({ 
  measurements = {}, 
  dimensions, 
  setDimensions 
}: DimensionControlsProps) {
    
  // Initialize with default values if measurements is not loaded yet
  const { min = { x: 10, y: 10, z: 10 }, 
         max = { x: 200, y: 200, z: 200 } } = measurements;

  const handleDimensionChange = (axis: keyof Dimensions, value: string) => {
    setDimensions(prev => ({
      ...prev,
      [axis]: Math.max(min[axis] || 1, Math.min(max[axis] || 20, parseFloat(value)))
    }))
  }

  return (
    <div className="control-section">
      <h3>Dimension Controls</h3>
      <div className="dimension-control">
        <label>X ({min.x} - {max.x}):
          <input
            type="range"
            min={min.x}
            max={max.x}
            step="1"
            value={dimensions.x}
            onChange={(e) => handleDimensionChange('x', e.target.value)}
          />
          {dimensions.x}
        </label>
      </div>
      <div className="dimension-control">
        <label>Y ({min.y} - {max.y}):
          <input
            type="range"
            min={min.y}
            max={max.y}
            step="1"
            value={dimensions.y}
            onChange={(e) => handleDimensionChange('y', e.target.value)}
          />
          {dimensions.y}
        </label>
      </div>
      <div className="dimension-control">
        <label>Z ({min.z} - {max.z}):
          <input
            type="range"
            min={min.z}
            max={max.z}
            step="1"
            value={dimensions.z}
            onChange={(e) => handleDimensionChange('z', e.target.value)}
          />
          {dimensions.z}
        </label>
      </div>
    </div>
  )
}