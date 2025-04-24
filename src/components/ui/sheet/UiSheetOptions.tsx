import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { RefObject } from 'react'

import { UiButton, UiButtonProps } from '../UiButton'

import { UiSheetModal } from './UiSheetModal'

interface UiSheetOptionsProps {
  cRef: RefObject<BottomSheetModal | null>
  options: UiButtonProps[]
  top?: () => React.ReactNode
}

export const UiSheetOptions = ({ cRef, top, options }: UiSheetOptionsProps) => {
  return (
    <UiSheetModal cRef={cRef} top={top}>
      {options.map(option => (
        <UiButton key={option.title} square variant="soft" align="left" {...option} />
      ))}
    </UiSheetModal>
  )
}
