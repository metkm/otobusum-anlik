import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { UiSheetModal } from './UiSheetModal'
import { UiButton, UiButtonProps } from '../UiButton'
import { RefObject } from 'react'

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
