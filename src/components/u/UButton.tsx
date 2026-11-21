import { useRouter, type Href } from 'expo-router'
import { createContext, use, type ComponentProps } from 'react'
import { Touchable } from 'react-native-gesture-handler'
import { type VariantProps } from 'tailwind-variants'
import { withUniwind } from 'uniwind'

import { cn, tv } from '@/utils/cn'

import { UActivityIndicator } from './UActivityIndicator'
import { UIcon, type IconName } from './UIcon'
import { UText } from './UText'

const StyledTouchable = withUniwind(Touchable)

type TouchableProps = ComponentProps<typeof StyledTouchable>

const ui = tv({
  compoundVariants: [
    {
      className: {
        base: 'bg-primary',
        icon: 'accent-inverted',
        label: 'text-inverted',
      },
      color: 'primary',
      variant: 'solid',
    },
    {
      className: {
        base: 'bg-primary/10',
        icon: 'accent-primary',
        label: 'text-primary',
      },
      color: 'primary',
      variant: 'soft',
    },
    {
      className: {
        base: 'bg-transparent',
        icon: 'accent-primary',
        label: 'text-primary',
      },
      color: 'primary',
      variant: 'ghost',
    },
    {
      className: {
        base: 'bg-neutral-elevated',
        icon: 'accent-neutral-default',
        label: 'text-neutral-default',
      },
      color: 'neutral',
      variant: 'soft',
    },
    {
      className: {
        base: 'bg-neutral-muted',
        icon: 'text-neutral-default',
        label: 'text-neutral-default',
      },
      color: 'neutral',
      variant: 'solid',
    },
    {
      className: {
        base: 'bg-transparent',
        icon: 'text-neutral-default',
        label: 'text-neutral-default',
      },
      color: 'neutral',
      variant: 'ghost',
    },
    {
      className: {
        base: 'bg-error',
        icon: 'text-inverted',
        label: 'text-inverted',
      },
      color: 'error',
      variant: 'solid',
    },
    {
      className: {
        base: 'bg-error/15',
        icon: 'accent-error',
        label: 'text-error',
      },
      color: 'error',
      variant: 'soft',
    },
    {
      className: {
        base: 'bg-transparent',
        icon: 'accent-error',
        label: 'text-error',
      },
      color: 'error',
      variant: 'ghost',
    },
    {
      className: {
        base: 'border-hairline border-accented bg-muted',
      },
      color: 'neutral',
      size: 'lg',
      variant: 'subtle',
    },
  ],
  defaultVariants: {
    color: 'primary',
    size: 'md',
    variant: 'solid',
  },
  slots: {
    base: 'flex flex-row items-center gap-1.5 rounded-md',
    icon: '',
    label: 'shrink font-inter-medium text-sm',
  },
  variants: {
    block: {
      true: 'justify-center',
    },
    color: {
      error: '',
      neutral: '',
      primary: '',
    },
    disabled: {
      true: {
        base: 'opacity-50',
      },
    },
    size: {
      lg: {
        base: 'p-3',
        icon: 'size-4.5',
      },
      md: {
        base: 'p-2.5',
        icon: 'size-4',
      },
      xl: {
        base: 'p-4',
        icon: 'size-4.5',
      },
    },
    variant: {
      ghost: '',
      soft: '',
      solid: '',
      subtle: '',
    },
  },
})

interface UButtonProps extends VariantProps<typeof ui>, TouchableProps {
  label?: string
  icon?: IconName
  trailingIcon?: IconName
  to?: Href
  disabled?: boolean
  loading?: boolean
}

interface ButtonContext {
  labelClassName: string
  iconClassName: string
}

const UButtonContext = createContext<ButtonContext | undefined>(undefined)

export const UButton = ({
  label,
  className,
  icon,
  trailingIcon,
  to,
  color,
  variant,
  size,
  block,
  children,
  style,
  disabled,
  loading,
  ...props
}: UButtonProps) => {
  const router = useRouter()

  const {
    base: uiBase,
    label: uiLabel,
    icon: uiIcon,
  } = ui({ block, color, disabled, size, variant })

  const handlePress: TouchableProps['onPress'] = () => {
    if (!to) {
      return
    }

    router.push(to)
  }

  const content = () => {
    if (children) {
      return children
    }

    if (label) {
      return (
        <UText
          className={uiLabel()}
          numberOfLines={1}
        >
          {label}
        </UText>
      )
    }
  }

  return (
    // oxlint-disable-next-line react/jsx-no-constructed-context-values
    <UButtonContext value={{ iconClassName: uiIcon(), labelClassName: uiLabel() }}>
      <StyledTouchable
        className={cn(uiBase(), className)}
        onPress={handlePress}
        style={style}
        underlayColor="black"
        animationDuration={0}
        androidRipple={{}}
        disabled={disabled}
        {...props}
      >
        {loading ? (
          <UActivityIndicator
            colorClassName={uiIcon()}
            sizeClassName={uiIcon()}
          />
        ) : (
          icon && (
            <UIcon
              name={icon}
              sizeClassName={uiIcon()}
              colorClassName={uiIcon()}
            />
          )
        )}

        {content()}

        {trailingIcon && (
          <UIcon
            name={trailingIcon}
            sizeClassName={uiIcon()}
            colorClassName={uiIcon()}
            className="ml-auto"
          />
        )}
      </StyledTouchable>
    </UButtonContext>
  )
}

const UButtonText = ({ className, ...props }: ComponentProps<typeof UText>) => {
  const context = use(UButtonContext)

  return (
    <UText
      className={cn(context?.labelClassName, className)}
      numberOfLines={1}
      {...props}
    />
  )
}

const UButtonIcon = (props: ComponentProps<typeof UIcon>) => {
  const context = use(UButtonContext)

  return (
    <UIcon
      sizeClassName={context?.iconClassName}
      colorClassName={context?.iconClassName}
      {...props}
    />
  )
}

UButton.Text = UButtonText
UButton.Icon = UButtonIcon
