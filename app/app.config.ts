export default defineAppConfig({
  ui: {
    colors: {
      primary: 'orange',
      neutral: 'mauve',
    },
    drawer: {
      variants: {
        direction: {
          bottom: {
            handle: 'mt-2 mb-2',
          },
        },
      },
      slots: {
        content: 'pb-page-bottom px-page-left z-10',
      },
    },
    dropdownMenu: {
      slots: {
        content: 'z-10',
        viewport: 'z-10',
      },
    },
    selectMenu: {
      slots: {
        content: 'z-10',
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
