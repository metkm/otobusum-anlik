import { View } from 'react-native'
import { type VariantProps } from 'tailwind-variants'

import { cn, tv } from '@/utils/cn'

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
        base: 'bg-primary/10',
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
    {
      className: {
        base: 'border-hairline border-primary/25 bg-primary/10 rounded-full',
        label: 'text-primary',
      },
      color: 'primary',
      variant: 'subtle',
    },
  ],
  defaultVariants: {
    color: 'primary',
    size: 'md',
    variant: 'solid',
  },
  slots: {
    base: 'px-2.5 py-1.5 flex-row items-center gap-1 rounded-full',
    icon: '',
    label: 'font-inter-semibold',
  },
  variants: {
    color: {
      neutral: '',
      primary: '',
    },
    size: {
      lg: {
        base: 'px-3 py-2',
        icon: 'size-5',
      },
      md: {
        base: 'px-3 py-1.5',
        icon: 'size-4',
        label: 'text-sm',
      },
    },
    variant: {
      soft: '',
      solid: '',
      subtle: '',
    },
  },
})

export const UBadge = ({
  label,
  icon,
  color,
  variant,
  className,
  size,
}: {
  label?: string
  icon?: IconName
  className?: string
} & VariantProps<typeof ui>) => {
  const { base: uiBase, label: uiLabel, icon: uiIcon } = ui({ color, size, variant })

  return (
    <View className={cn(uiBase(), className)}>
      {icon && (
        <UIcon
          name={icon}
          sizeClassName={uiIcon()}
          colorClassName={uiLabel()}
        />
      )}

      {label && <UText className={uiLabel()}>{label}</UText>}
    </View>
  )
}
