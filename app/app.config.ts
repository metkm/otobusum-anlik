export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'neutral',
    },
    input: {
      slots: {
        base: 'rounded-full',
        leading: '[&>a]:rounded-full',
      },
      variants: {
        size: {
          xl: {
            base: 'py-3',
            leadingIcon: 'size-5',
          },
        },
      },
    },
    button: {
      defaultVariants: {
        size: 'lg',
      },
      variants: {
        size: {
          lg: {
            base: 'py-3',
          },
        },
      },
    },
  },
})
