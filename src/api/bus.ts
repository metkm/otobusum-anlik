import ky from 'ky'

import { useOtobusumNeredeTokenStore } from '@/stores/otobusumnerede'
import type {
  BusLocation,
  BusLocationOpenData,
  BusLocationOtobusumNerede,
  BusLocationResponse,
} from '@/types/bus'
import type { City } from '@/types/city'
import type { SearchItem } from '@/types/otobusumnerede'

export const fetchBusLocations = async (code: string, city: City): Promise<BusLocationResponse> => {
  try {
    return ky
      .get<BusLocationResponse>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/bus-locations/${code}`, {
        searchParams: {
          city,
        },
      })
      .json()
  } catch {
    if (city === 'istanbul') {
      try {
        return fetchBusLocationsUsingOpenData(code)
      } catch {
        return fetchBusLocationsUsingOtobusumNerede(code)
      }
    }
  }

  throw new Error('Error getting bus locatios')
}

const fetchBusLocationsUsingOpenData = async (code: string): Promise<BusLocationResponse> => {
  const body = `
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
            <GetHatOtoKonum_json xmlns="http://tempuri.org/">
                <HatKodu>${code}</HatKodu>
            </GetHatOtoKonum_json>
        </soap:Body>
    </soap:Envelope>
  `

  const response = await ky
    .post<string>('https://api.ibb.gov.tr/iett/FiloDurum/SeferGerceklesme.asmx', {
      body,
      headers: {
        'Content-Type': 'text/xml; charset=UTF-8',
        SOAPAction: `"http://tempuri.org/GetHatOtoKonum_json"`,
      },
    })
    .text()

  const content = response
    .split('<GetHatOtoKonum_jsonResult>')[1]
    ?.split('</GetHatOtoKonum_jsonResult>')[0]

  if (!content) {
    return {
      data: [],
      next_poll: Date.now() / 1000 + 70,
    }
  }

  const openDataList: BusLocationOpenData[] = JSON.parse(content)
  const parsedList: BusLocation[] = openDataList.map((op) => ({
    bus_id: op.kapino,
    closest_stop_code: parseInt(op.yakinDurakKodu),
    last_update_time: new Date(op.son_konum_zamani),
    lat: parseFloat(op.enlem),
    lng: parseFloat(op.boylam),
    route_code: op.guzergahkodu,
  }))

  let latestUpdateTime = Date.now() / 1000

  if (parsedList.length > 0) {
    latestUpdateTime = Math.max(...parsedList.map((x) => x.last_update_time.getTime() / 1000))
  }

  return {
    data: parsedList,
    next_poll: latestUpdateTime + 70,
  }
}

const getOtobusumNeredeCredentials = async () => {
  const { tokens, fetchTokens } = useOtobusumNeredeTokenStore.getState()
  const now = Date.now()

  if (!tokens || tokens.expire_date < now) {
    return await fetchTokens()
  }

  return tokens
}

export const fetchBusLocationsUsingOtobusumNerede = async (
  code: string,
): Promise<BusLocationResponse> => {
  const tokens = await getOtobusumNeredeCredentials()

  const headers = {
    'Accept-Encoding': 'gzip',
    Authorization: `Bearer ${tokens.access_token}`,
    'Content-Type': 'application/json; charset=UTF-8',
  }

  const searchResults = await ky
    .post<SearchItem[]>('https://ntcapi.iett.istanbul/service', {
      body: JSON.stringify({
        alias: 'mainGetLine_basic_search',
        data: {
          'HATYONETIM.HAT.HAT_KODU': code,
        },
      }),
      headers,
    })
    .json()

  const lineId = searchResults.find((res) => res.HAT_HAT_KODU === code)?.HAT_ID

  if (!lineId) {
    throw new Error(`Couldn't find ${code} - ${lineId} in search results`)
  }

  const locationsResponse = await ky
    .post<BusLocationOtobusumNerede[]>('https://ntcapi.iett.istanbul/service', {
      body: JSON.stringify({
        alias: 'ybs',
        data: {
          data: {
            password: 'n1!t8c7M1',
            username: 'netuce',
          },
          method: 'POST',
          path: ['real-time-information', 'point-passing', lineId],
        },
      }),
      headers,
    })
    .json()

  const parsedList: BusLocation[] = locationsResponse.map((loc) => ({
    bus_id: loc.K_ARAC_KAPINUMARASI,
    closest_stop_code: loc.H_GOREV_DURAK_GECIS_DURAKID,
    last_update_time: new Date(loc.H_GOREV_D_G_KAYITZAMANI),
    lat: loc.ENLEM,
    lng: loc.BOYLAM,
    route_code: loc.K_GUZERGAH_GUZERGAHKODU,
  }))

  let latestUpdateTime = Date.now() / 1000

  if (locationsResponse.length > 0) {
    latestUpdateTime = Math.max(...parsedList.map((x) => x.last_update_time.getTime() / 1000))
  }

  return {
    data: parsedList,
    next_poll: latestUpdateTime + 70,
  }
}
