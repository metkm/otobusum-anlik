import { View } from 'react-native'
import { type VariantProps, tv } from 'tailwind-variants'

import { cn } from '@/utils/cn'

import { UIcon, type IconName } from './UIcon'
import { UText } from './UText'

const ui = tv({
  compoundVariants: [
    {
      className: {
        base: 'bg-primary',
        label: 'text-inverted',
      },
      color: 'primary',
      variant: 'solid',
    },
    {
      className: {
        base: 'bg-primary/15',
        label: 'text-primary',
      },
      color: 'primary',
      variant: 'soft',
    },
    {
      className: {
        base: 'bg-neutral-muted',
        label: 'text-neutral-default',
      },
      color: 'neutral',
      variant: 'soft',
    },
  ],
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
  },
  slots: {
    base: 'px-2.5 py-1.5 flex-row gap-1 rounded-full',
    label: 'font-inter-semibold text-xs',
  },
  variants: {
    color: {
      neutral: '',
      primary: '',
    },
    variant: {
      soft: '',
      solid: '',
    },
  },
})

export const UBadge = ({
  label,
  icon,
  color,
  variant,
  className,
}: {
  label?: string
  icon?: IconName
  className?: string
} & VariantProps<typeof ui>) => {
  const { base: uiBase, label: uiLabel } = ui({ color, variant })

  return (
    <View className={cn(uiBase(), className)}>
      {icon && (
        <UIcon
          name={icon}
          sizeClassName="size-4"
          colorClassName={uiLabel()}
        />
      )}

      {label && <UText className={uiLabel()}>{label}</UText>}
    </View>
  )
}
