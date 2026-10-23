import ky from 'ky'

import type { BusLocation, BusLocationOpenData, BusLocationResponse } from '@/types/bus'
import type { City } from '@/types/city'

export const fetchBusLocations = async (code: string, city: City) => {
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
      console.log('fetching data using open data')
      return fetchBusLocationsUsingOpenData(code)
    }
  }

  throw new Error('Error getting bus locatios')
}

export const fetchBusLocationsUsingOpenData = async (
  code: string,
): Promise<BusLocationResponse> => {
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
