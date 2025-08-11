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
          lg: {
            base: 'py-2.5',
            leadingIcon: 'size-4.5 -mt-0.5',
            leading: 'ps-3.5',
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
