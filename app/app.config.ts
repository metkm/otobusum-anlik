export default defineAppConfig({
  ui: {
    colors: {
      primary: 'orange',
      neutral: 'zinc',
    },
    drawer: {
      variants: {
        direction: {
          bottom: {
            handle: 'mt-2',
          },
        },
      },
    },
    input: {
      variants: {
        size: {
          xl: {
            leadingIcon: 'size-5',
          },
        },
      },
    },
    button: {
      variants: {
        size: {
          xl: {
            leadingIcon: '',
            // base: 'py-10',
          },
        },
      },
      compoundVariants: [
        {
          square: true,
          size: 'xl',
          class: 'p-2.5',
        },
      ],
    },
  },
})
