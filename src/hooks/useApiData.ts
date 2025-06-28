import { useState, useEffect } from 'react'
import type { ApiData } from '../types/app';


export default function useApiData() {
  const [data, setData] = useState<ApiData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/oneone-studio/interview-assets/refs/heads/main/api.json'
        )
        if (!response.ok) throw new Error('Network response was not ok')
        const json = await response.json()
        
        if (!json.model) {
          throw new Error('No model URL found in API response')
        }
        
        setData({
          modelUrl: json.model,
          measurements: {
            min: {
              x: json.measurements.x.min,
              y: json.measurements.y.min,
              z: json.measurements.z.min
            },
            max: {
              x: json.measurements.x.max,
              y: json.measurements.y.max,
              z: json.measurements.z.max
            },
            initial: {
              x: json.measurements.x.value,
              y: json.measurements.y.value,
              z: json.measurements.z.value
            }
          }
        })
      } catch (err) {
        console.error('API fetch error:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return {
    modelUrl: data?.modelUrl || '',
    measurements: data?.measurements || { 
      min: { x: 1, y: 1, z: 1 }, 
      max: { x: 20, y: 20, z: 20 },
      initial: { x: 10, y: 10, z: 10 }
    },
    loading,
    error
  }
}