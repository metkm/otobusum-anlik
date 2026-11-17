import type { ReactNode } from 'react'
import { GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated'

import { useCarouselGesture } from '@/composables/useCarouselGesture'
import { useCarouselVirtualization } from '@/composables/useCarouselVirtualization'
import { cn, tv } from '@/utils/cn'

const ui = tv({
  slots: {
    container: 'flex-row',
    item: 'min-w-0 shrink-0',
    viewport: 'flex-row overflow-hidden shrink',
  },
})

export interface UCarouselProps<T> {
  data: T[]
  renderItem: (props: { item: T }) => ReactNode
  keyExtractor: (item: T) => string
  getFixedItemSize: () => number
  ui?: {
    [K in keyof (typeof ui)['slots']]?: string
  }
  initialRenderCount: number
  drawDistance: number
}

export const UCarousel = <T,>({
  data,
  renderItem,
  keyExtractor,
  getFixedItemSize,
  initialRenderCount,
  drawDistance,
  ui: _ui,
}: UCarouselProps<T>) => {
  const { viewport: uiViewport, container: uiContainer, item: uiItem } = ui()

  const viewportWidth = useSharedValue(0)

  const itemWidth = getFixedItemSize()
  const containerWidth = itemWidth * data.length

  const snapPoints = useDerivedValue<number[]>(() => [])

  const { gesture, offset } = useCarouselGesture({
    containerWidth,
    snapPoints,
    viewportWidth,
  })

  const { displayedItems } = useCarouselVirtualization({
    data,
    drawDistance,
    initialRenderCount,
    itemWidth,
    offset,
    viewportWidth,
  })

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
    width: containerWidth,
  }))

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        className={cn(uiViewport(), _ui?.viewport)}
        onLayout={({ nativeEvent }) => {
          'worklet'
          viewportWidth.value = nativeEvent.layout.width
        }}
      >
        <Animated.View
          className={cn(uiContainer(), _ui?.container)}
          style={containerStyle}
        >
          {data.map((item, index) => {
            const isInRange = index >= displayedItems[0] && index < displayedItems[1]
            if (!isInRange) {
              return
            }

            return (
              <Animated.View
                key={keyExtractor(item)}
                className={cn(uiItem(), _ui?.item)}
              >
                {renderItem({ item })}
              </Animated.View>
            )
          })}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  )
}

// import { type ReactNode, use, useEffect } from 'react'
// import { useWindowDimensions, type ViewProps } from 'react-native'
// import { GestureDetector } from 'react-native-gesture-handler'
// import Animated, {
//   useAnimatedStyle,
//   useDerivedValue,
//   useSharedValue,
// } from 'react-native-reanimated'

// import { useCarouselGesture } from '@/composables/useCarouselGesture'
// import { EnterScaleIn, ExitScaleOut, LayoutAnimationTransition } from '@/constants/animation'
// import { cn, tv } from '@/utils/cn'
// import { alignCenter } from '@/utils/math'

// import { CarouselContext } from '../provider/CarouselProvider'

// const ui = tv({
//   slots: {
//     container: 'flex-row',
//     item: 'min-w-0 shrink-0',
//     // item: 'min-w-0 shrink-0 grow-0 basis-[94%]',
//     viewport: 'flex-row overflow-hidden shrink',
//   },
// })

// export interface UCarouselProps<T> extends ViewProps {
//   data: T[]
//   renderItem: (props: { item: T }) => ReactNode
//   keyExtractor: (item: T) => string
//   ui?: {
//     [K in keyof (typeof ui)['slots']]?: string
//   }
//   enabled?: boolean
// }

// export const UCarousel = <T,>({
//   data,
//   renderItem,
//   keyExtractor,
//   enabled = true,
//   ...props
// }: UCarouselProps<T>) => {
//   'use no memo'
//   // Have to disable react compiler or else it gives errors about reading shared values etc

//   const carouselContext = use(CarouselContext)

//   const { width: windowWidth } = useWindowDimensions()
//   const { viewport: uiViewport, container: uiContainer, item: uiItem } = ui()

//   const containerWidth = useSharedValue(0)
//   const viewportWidth = useSharedValue(windowWidth)
//   const localSnapPoints = useSharedValue<number[]>([])

//   const keys = useSharedValue(data.map(keyExtractor))
//   const snapPoints = carouselContext?.snapPoints ?? localSnapPoints

//   const { gesture, offset } = useCarouselGesture({
//     containerWidth,
//     enabled,
//     snapPoints,
//     viewportWidth,
//   })

//   const slideLayouts = useSharedValue<Record<string, { x: number; width: number }>>({})

//   const slideWidthModifier = useSharedValue(() => (data.length > 1 ? 0.94 : 1))
//   const slideWidth = useSharedValue(() => viewportWidth.value * slideWidthModifier.value - 16)

//   useEffect(() => {
//     keys.set(data.map(keyExtractor))
//   }, [data, keyExtractor, keys])

//   useDerivedValue(() => {
//     const points = keys.value.flatMap((key) => {
//       'worklet'
//       const layout = slideLayouts.value[key]
//       if (layout) {
//         return [-layout.x + alignCenter(viewportWidth.value, layout.width)]
//       }

//       return []
//     })

//     snapPoints.set(points)
//   })

//   const containerStyle = useAnimatedStyle(() => ({
//     transform: [{ translateX: offset.value }],
//   }))

//   // have to do this because using flexBasis is buggy. It doesn't update the value when it changes
//   // https://github.com/react/react-native/issues/58294
//   const slideStyle = useAnimatedStyle(() => ({
//     width: slideWidth.value,
//   }))

//   return (
//     <GestureDetector gesture={gesture}>
//       <Animated.View
//         layout={LayoutAnimationTransition}
//         className={cn(uiViewport(), props.ui?.viewport)}
//         onLayout={(event) => {
//           'worklet'
//           viewportWidth.set(event.nativeEvent.layout.width)
//           props.onLayout?.(event)
//         }}
//       >
//         <Animated.View
//           className={cn(uiContainer(), props.ui?.container)}
//           style={containerStyle}
//           onLayout={({ nativeEvent }) => {
//             'worklet'
//             containerWidth.set(nativeEvent.layout.width)
//           }}
//         >
//           {data.map((item) => (
//             <Animated.View
//               layout={LayoutAnimationTransition}
//               exiting={ExitScaleOut}
//               entering={EnterScaleIn}
//               key={keyExtractor(item)}
//               style={slideStyle}
//               className={cn(uiItem(), props.ui?.item)}
//               onLayout={({ nativeEvent }) => {
//                 'worklet'
//                 const { x, width } = nativeEvent.layout

//                 // const snap = -x + alignCenter(viewportWidth.value, width)
//                 const key = keyExtractor(item)

//                 slideLayouts.modify((current) => {
//                   'worklet'
//                   current[key] = { width, x }
//                   return current
//                 })
//               }}
//             >
//               {renderItem({ item })}
//             </Animated.View>
//           ))}
//         </Animated.View>
//       </Animated.View>
//     </GestureDetector>
//   )
// }
