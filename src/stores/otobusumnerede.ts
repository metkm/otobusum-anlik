import AsyncStorage from '@react-native-async-storage/async-storage'
import ky from 'ky'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import type { TokenResponse } from '@/types/otobusumnerede'

interface OtobusumNeredeTokenStorage {
  tokens?: TokenResponse
  fetchTokens: () => Promise<TokenResponse>
}

export const useOtobusumNeredeTokenStore = create(
  persist(
    subscribeWithSelector(
      immer<OtobusumNeredeTokenStorage>((set) => ({
        fetchTokens: async () => {
          const response = await ky
            .post<TokenResponse>('https://ntcapi.iett.istanbul/oauth2/v2/auth', {
              body: JSON.stringify({
                client_id: process.env.EXPO_PUBLIC_IBB_CLIENT_ID,
                client_secret: process.env.EXPO_PUBLIC_IBB_CLIENT_SECRET,
                grant_type: 'client_credentials',
                scope: process.env.EXPO_PUBLIC_IBB_CLIENT_SCOPE,
              }),
              headers: {
                'Accept-Encoding': 'gzip',
                'Content-Type': 'application/json; charset=UTF-8',
              },
              timeout: 5000,
            })
            .json()

          set(() => ({
            tokens: response,
          }))

          return response
        },
        tokens: undefined,
      })),
    ),
    {
      name: 'otobusum-nerede-token-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
)
