import { Ref } from 'react'
import { TextInputInstance, TextInputProps, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { type VariantProps } from 'tailwind-variants'

import { cn, tv } from '@/utils/cn'

import { UActivityIndicator } from './UActivityIndicator'
import { IconName, UIcon } from './UIcon'

const ui = tv({
  slots: {
    base: 'rounded-md p-3 grow',
    icon: 'text-muted',
  },
  variants: {
    variant: {
      outline: 'border-hairline border-accented',
      soft: 'bg-neutral-elevated',
    },
  },
})

const Icon = ({
  colorClassName,
  loading,
  sizeClassName,
  icon,
}: {
  icon?: IconName
  colorClassName: string
  sizeClassName: string
  loading?: boolean
}) => {
  if (loading) {
    return <UActivityIndicator colorClassName={colorClassName} />
  }

  if (icon) {
    return (
      <UIcon
        name={icon}
        sizeClassName={sizeClassName}
        colorClassName={colorClassName}
      />
    )
  }
}

interface UInputProps extends TextInputProps {
  ref?: Ref<TextInputInstance>
  variant?: VariantProps<typeof ui>['variant']
  icon?: IconName
  loading?: boolean
  containerClassName?: string
}

export const UInput = ({
  variant = 'outline',
  className,
  icon,
  loading,
  containerClassName,
  children,
  ...props
}: UInputProps) => {
  const { base: uiBase, icon: uiIcon } = ui({ variant })

  return (
    <View className={cn('relative flex-row items-center', containerClassName)}>
      <TextInput
        className={cn(uiBase(), icon || loading ? 'pl-10' : undefined, className)}
        {...props}
      />

      <View className="absolute left-2.5">
        <Icon
          colorClassName={uiIcon()}
          sizeClassName={uiIcon()}
          icon={icon}
        />
      </View>

      {children}
    </View>
  )
}
