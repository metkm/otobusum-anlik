import { TrueSheet, type TrueSheetProps } from '@lodev09/react-native-true-sheet'
import { RefObject, use } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { withUniwind } from 'uniwind'

import { LineContext } from '@/composables/useLine'
import { useLineTheme } from '@/composables/useLineTheme'
import { cn } from '@/utils/cn'

const StyledGestureHandlerRootView = withUniwind(GestureHandlerRootView)

export const USheet = ({ ref, contentContainerClassName, children, ...props }: { ref: RefObject<TrueSheet | null>, contentContainerClassName?: string } & TrueSheetProps) => {
  const code = use(LineContext)
  const theme = useLineTheme(code)

  return (
    <TrueSheet
      ref={ref}
      backgroundColor={theme?.['ui-bg']}
      grabberOptions={{
        topMargin: 8,
        height: 4,
      }}
      {...props}
    >
      <StyledGestureHandlerRootView className={cn('grow pt-5 pb-2', contentContainerClassName)}>
        {/* <StyledGestureHandlerRootView className="grow gap-2 pt-5 pb-2 px-2"> */}
        {children}
      </StyledGestureHandlerRootView>
    </TrueSheet>
  )
}
