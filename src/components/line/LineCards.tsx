import { Dimensions } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { clamp, LinearTransition, useAnimatedReaction, useAnimatedStyle, useDerivedValue, useSharedValue, withDecay, withSpring, withTiming } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { LineCard } from './card/LineCard'

import { useLineCardWidth } from '@/composables'
import { LineContext } from '@/composables/useLine'
import { ExitScaleOut } from '@/constants/animation'
import { useLineStore } from '@/stores/line'

const width = Dimensions.get('window').width

const roundToStep = (x: number, step: number) => {
  'worklet'
  // if (x < step) return 0
  return Math.round(x / step) * step
}

const dampen = (value: number) => {
  'worklet'
  return 8 * Math.log(value + 1)
}

export const LineCards = () => {
  const { cardWidth, snapInterval } = useLineCardWidth()
  const lines = useLineStore(useShallow(state => state.lines()))

  const offset = useSharedValue(0)
  const offsetStart = useSharedValue(0)

  const contentWidth = useSharedValue(0)

  const offsetLimit = useDerivedValue(() => -(contentWidth.value - width), [])

  const pan = Gesture.Pan()
    .onStart(() => {
      offsetStart.value = offset.value
    })
    .onChange(({ translationX }) => {
      let newOffset = offsetStart.value + translationX
      let offsetModifier = translationX > 0 ? 1 : -1

      if ((newOffset > 0) || (newOffset < offsetLimit.value)) {
        newOffset = offsetStart.value + dampen(Math.abs(translationX)) * offsetModifier
      }

      offset.value = newOffset
    })
    .onFinalize(({ velocityX }) => {
      if (offset.value < offsetLimit.value) {
        offset.value = withSpring(offsetLimit.value)
        return
      }

      if (offset.value > 0) {
        offset.value = withSpring(0)
        return
      }

      offset.value = withDecay({
        velocity: velocityX,
        clamp: [offsetLimit.value, 0],
      }, () => {
        const rounded = roundToStep(clamp(offset.value, offsetLimit.value, 0), snapInterval + 4)
        offset.value = withSpring(rounded)
      })
    })

  // const pan = Gesture.Pan()
  //   .activeOffsetY(Infinity)
  //   .activeOffsetX([-100, 100])
  //   .onChange(({ changeX }) => {
  //     offset.value += changeX
  //   })
  //   .onFinalize(({ velocityX }) => {
  //     offset.value = withDecay({
  //       velocity: velocityX,
  //       // rubberBandEffect: true,
  //       clamp: [
  //         offsetLimit.value,
  //         0,
  //       ],
  //     }, () => {
  //       const closest = roundToStep(offset.value, snapInterval + 4)
  //       offset.value = withSpring(closest)
  //     })
  //   })

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
      padding: withTiming(lines.length > 1 ? 8 : 0),
    }
  })

  useAnimatedReaction(() => contentWidth.value, () => {
    const limit = Math.min(0, -(contentWidth.value - width))
    if (offset.value < limit) {
      offset.value = withSpring(limit)
    }
  })

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={containerStyle}
        className="gap-2 flex-row"
        onLayout={({ nativeEvent }) => {
          const cw = nativeEvent.layout.width
          contentWidth.value = cw
        }}
      >
        {lines.map(code => (
          <Animated.View
            key={code}
            exiting={ExitScaleOut}
            layout={LinearTransition}
          >
            <LineContext value={code}>
              <LineCard
                style={{ width: cardWidth }}
                className={lines.length < 2 ? 'rounded-none' : ''}
              />
            </LineContext>
          </Animated.View>
        ))}
      </Animated.View>
    </GestureDetector>
  )

  // return (
  //   <FlatList
  //     ref={flatlistRef}
  //     data={lines}
  //     renderItem={({ item }) => (
  //       <LineContext value={item}>
  //         <LineCard
  //           style={{ width: cardWidth }}
  //           className={lines.length < 2 ? 'rounded-none' : ''}
  //         />
  //       </LineContext>
  //     )}
  //     contentContainerClassName={`gap-2 ${isOneElement ? 'p-0' : 'pb-2 px-2'}`}
  //     keyExtractor={item => item}
  //     snapToInterval={snapInterval}
  //     horizontal
  //     onEndReached={() => {
  //       flatlistRef.current?.scrollToIndex({
  //         index: lines.length - 1,
  //         viewPosition: -5,
  //       })
  //     }}
  //     onScrollToIndexFailed={() => {}}
  //     initialNumToRender={2}
  //     maxToRenderPerBatch={2}
  //   />
  // )
}
