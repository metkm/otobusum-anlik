import { TrueSheet, type TrueSheetProps } from '@lodev09/react-native-true-sheet'
import { ReanimatedTrueSheet } from '@lodev09/react-native-true-sheet/reanimated'
import { RefObject } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useCSSVariable, withUniwind } from 'uniwind'

import { useLineTheme } from '@/composables/useLineTheme'
import { cn } from '@/utils/cn'

const StyledGestureHandlerRootView = withUniwind(GestureHandlerRootView)

export const USheet = ({ ref, contentContainerClassName, children, ...props }: { ref: RefObject<TrueSheet | null>, contentContainerClassName?: string } & TrueSheetProps) => {
  const [backgroundDefault] = useCSSVariable(['--background-color-default']) as [string]

  const theme = useLineTheme()
  const background = theme?.background({ variant: 'ghost' })

  return (
    <ReanimatedTrueSheet
      ref={ref}
      backgroundColor={background?.backgroundColor || backgroundDefault}
      grabberOptions={{
        topMargin: 8,
        height: 4,
      }}
      {...props}
    >
      <StyledGestureHandlerRootView className={cn('grow pt-5 pb-2', contentContainerClassName)}>
        {children}
      </StyledGestureHandlerRootView>
    </ReanimatedTrueSheet>
  )
}
