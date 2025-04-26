import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { RefObject } from 'react'

import { UiButton, UiButtonProps } from '../UiButton'

import { UiSheetModal, UiSheetModalProps } from './UiSheetModal'

interface UiSheetOptionsProps extends Omit<UiSheetModalProps, 'children'> {
  cRef: RefObject<BottomSheetModal | null>
  options: UiButtonProps[]
}

export const UiSheetOptions = ({ cRef, options, ...modalProps }: UiSheetOptionsProps) => {
  return (
    <UiSheetModal cRef={cRef} {...modalProps}>
      {options.map(option => (
        <UiButton key={option.title} square variant="soft" align="left" {...option} />
      ))}
    </UiSheetModal>
  )
}
