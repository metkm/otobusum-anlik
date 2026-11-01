import { TrueSheet, type TrueSheetProps } from '@lodev09/react-native-true-sheet'
import type { RefObject } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useCSSVariable, withUniwind } from 'uniwind'

import { cn } from '@/utils/cn'

const StyledGestureHandlerRootView = withUniwind(GestureHandlerRootView)

interface USheetProps extends TrueSheetProps {
  ref: RefObject<TrueSheet | null>
  contentContainerClassName?: string
}

export const USheet = ({ ref, contentContainerClassName, children, ...props }: USheetProps) => {
  const backgroundColor = useCSSVariable('--background-color-default')?.toString()
  const spacing = useCSSVariable('--spacing') as number

  return (
    <TrueSheet
      ref={ref}
      backgroundColor={backgroundColor}
      detents={[0.5, 0.8]}
      style={{ flex: 1 }}
      grabberOptions={{
        adaptive: true,
        topMargin: spacing * 2,
      }}
      {...props}
    >
      <StyledGestureHandlerRootView
        className={cn('flex-1 pb-2', props.header ? 'p-0' : 'pt-5', contentContainerClassName)}
      >
        {children}
      </StyledGestureHandlerRootView>
    </TrueSheet>
  )
}
