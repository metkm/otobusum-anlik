import { createContext, ReactNode, use, useEffect, useState } from 'react'

type Layer = {
  id: string
  group: number
}

type MapLayerOrderContextValue = {
  layers: Layer[]
  register: (layer: Layer) => void
  unregister: (id: string) => void
}

export const GROUP_ORDER = {
  route: 10,
  stop: 20,
  bus: 30,
} as const

export const MapLayerOrderContext = createContext<MapLayerOrderContextValue | null>(null)

export const MapLayerOrder = ({ children }: { children: ReactNode }) => {
  const [layers, setLayers] = useState<Layer[]>([])

  const register = (layer: Layer) => {
    setLayers((current) => {
      const next = [
        ...current.filter(item => item.id !== layer.id),
        layer,
      ]

      return next.sort((a, b) => {
        return a.group - b.group
      })
    })
  }

  const unregister = (id: string) => {
    setLayers(current => current.filter(layer => layer.id !== id))
  }

  return (
    <MapLayerOrderContext value={{ register, unregister, layers }}>
      {children}
    </MapLayerOrderContext>
  )
}

export const useMapLayerOrder = ({ id, group }: Layer) => {
  const context = use(MapLayerOrderContext)

  if (!context) {
    throw new Error('useMapLayerOrder must be used inside MapLayerOrder')
  }

  const { layers, register, unregister } = context

  useEffect(() => {
    register({ id, group })

    return () => {
      unregister(id)
    }
  }, [id, register, unregister, group])

  const index = layers.findIndex(layer => layer.id === id)

  if (index === -1) {
    return {
      afterId: undefined,
    }
  }

  return {
    afterId: layers[index - 1]?.id,
    // afterId: layers[index + 1]?.id,
  }
}
