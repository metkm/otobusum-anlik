import { TrueSheet, type TrueSheetProps } from '@lodev09/react-native-true-sheet'
import { RefObject } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useCSSVariable, withUniwind } from 'uniwind'

const StyledGestureHandlerRootView = withUniwind(GestureHandlerRootView)

export const USheet = ({ ref, children, ...props }: { ref: RefObject<TrueSheet | null> } & TrueSheetProps) => {
  const backgroundColor = useCSSVariable('--ui-bg') as string

  return (
    <TrueSheet
      ref={ref}
      backgroundColor={backgroundColor}
      grabberOptions={{
        topMargin: 8,
        height: 4,
      }}
      {...props}
    >
      <StyledGestureHandlerRootView className="grow gap-2 pt-5 pb-2 px-2">
        {children}
      </StyledGestureHandlerRootView>
    </TrueSheet>
  )
}
