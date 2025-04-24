import ky, { type Options } from 'ky'

import { useFiltersStore } from '@/stores/filters'

// polyfill throwIfAborted which seems to be missing in react-native, but ky
// uses it
//
// Fun fact, AbortSignal here is just a react-native polyfill, too:
// https://github.com/facebook/react-native/blob/838d26d7b534133e75c7fa673dfc849b0e64c9d3/packages/react-native/Libraries/Core/setUpXHR.js#L38
//
// Unfortunately it doesn't have a `reason`
//
// ref: https://github.com/tjmehta/fast-abort-controller/blob/42588908035d1512f90e7299a2c70dfb708f9620/src/FastAbortSignal.ts#L39
if (!AbortSignal.prototype.throwIfAborted) {
  AbortSignal.prototype.throwIfAborted = function () {
    if (this.aborted) {
      throw new Error('Aborted')
    }
  }
}

export async function api<T>(url: string, options?: Options): Promise<T> {
  const selectedCity = useFiltersStore.getState().selectedCity

  const params = (options?.searchParams || {}) as Record<string, any>

  const response = await ky<T>(`${process.env.EXPO_PUBLIC_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...options?.headers,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    searchParams: {
      ...params,
      city: selectedCity,
    },
  })
    .json()

  return response
}
