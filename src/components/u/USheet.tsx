import { TrueSheet, type TrueSheetProps } from '@lodev09/react-native-true-sheet'
import type { RefObject } from 'react'
import { useCSSVariable } from 'uniwind'

import { cn } from '@/utils/cn'

import { UNativeGestureHandlerRootView } from './native/UNativeGestureHandlerRootView'

interface USheetProps extends TrueSheetProps {
  ref: RefObject<TrueSheet | null>
  contentContainerClassName?: string
}

export const USheet = ({ ref, contentContainerClassName, children, ...props }: USheetProps) => {
  const backgroundColor = useCSSVariable('--background-color-default')?.toString()
  const backgroundColorAccented = useCSSVariable('--background-color-accented')?.toString()

  return (
    <TrueSheet
      ref={ref}
      backgroundColor={backgroundColor}
      style={{ flex: 1 }}
      grabberOptions={{
        color: backgroundColorAccented,
      }}
      {...props}
    >
      <UNativeGestureHandlerRootView
        className={cn('flex-1 pb-2', props.header ? 'p-0' : 'pt-9', contentContainerClassName)}
      >
        {children}
      </UNativeGestureHandlerRootView>
    </TrueSheet>
  )
}
