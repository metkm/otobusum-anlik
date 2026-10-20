import { TrueSheet, type TrueSheetProps } from '@lodev09/react-native-true-sheet'
import { RefObject } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useCSSVariable, withUniwind } from 'uniwind'

import { cn } from '@/utils/cn'

const StyledGestureHandlerRootView = withUniwind(GestureHandlerRootView)

export const USheet = ({ ref, contentContainerClassName, children, ...props }: { ref: RefObject<TrueSheet | null>, contentContainerClassName?: string } & TrueSheetProps) => {
  const backgroundColor = useCSSVariable(['--background-color-default'])?.toString()

  return (
    <TrueSheet
      ref={ref}
      backgroundColor={backgroundColor}
      detents={[0.5, 0.8]}
      style={{ flex: 1 }}
      {...props}
    >
      <StyledGestureHandlerRootView className={cn(
        'grow pb-2',
        props.header ? 'p-0' : 'pt-9',
        contentContainerClassName,
      )}
      >
        {children}
      </StyledGestureHandlerRootView>
    </TrueSheet>
  )
}
