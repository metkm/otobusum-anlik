import { View } from 'react-native'
import { tv, type VariantProps } from 'tailwind-variants'

import { IconName, UIcon } from './UIcon'
import { UText } from './UText'

import { cn } from '@/utils/cn'

const ui = tv({
  variants: {
    color: {
      primary: '',
      neutral: '',
    },
    variant: {
      solid: '',
      soft: '',
    },
  },
  compoundVariants: [
    {
      color: 'primary',
      variant: 'solid',
      className: {
        base: 'bg-primary',
        label: 'text-inverted',
      },
    },
    {
      color: 'primary',
      variant: 'soft',
      className: {
        base: 'bg-primary/15',
        label: 'text-primary',
      },
    },
    {
      color: 'neutral',
      variant: 'soft',
      className: {
        base: 'bg-neutral-muted',
        label: 'text-neutral-default',
      },
    },
  ],
  slots: {
    base: 'px-2.5 py-1.5 flex-row gap-1 rounded-full',
    label: 'font-inter-semibold text-xs',
  },
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
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

      {label && (
        <UText className={uiLabel()}>
          {label}
        </UText>
      )}
    </View>
  )
}
