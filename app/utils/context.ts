export const createContext = <ContextValue>(providerComponentName: string) => {
  const injectionKey = Symbol(`${providerComponentName}Context`)

  const injectContext = () => {
    const context = inject<ContextValue>(injectionKey)

    if (context)
      return context

    throw new Error(`Component must be used inside ${injectionKey.toString()} component`)
  }

  const provideContext = (value: ContextValue) => {
    provide<ContextValue>(injectionKey, value)
  }

  return [injectContext, provideContext] as const
}
