import ky, { Options } from 'ky'

import { useFiltersStore } from '@/stores/filters'

export async function api<T>(url: string, options?: Options): Promise<T> {
  const selectedCity = useFiltersStore.getState().selectedCity

  const params = (options?.searchParams || {}) as Record<string, any>

  const response = await ky.get<T>(`${process.env.BASE_URL}${url}`, {
    ...options,
    headers: {
      ...options?.headers,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    searchParams: {
      ...params,
      city: selectedCity,
    },
  }).json()

  return response
}
