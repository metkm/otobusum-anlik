import type { UseFetchOptions } from '#app'

export const useAPI = <T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {},
) => {
  const config = useRuntimeConfig()

  return useFetch(url, {
    ...options,
    baseURL: config.public.baseUrl as string | undefined,
  })
}
