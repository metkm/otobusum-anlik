import { useQuery } from '@tanstack/react-query'
import ky from 'ky'

import { useLine } from './useLine'

import { CACHE_MS_30_MINUTES } from '@/constants/app'

interface Announcement {
  HAT: string
  HATKODU: string
  TIP: string
  GUNCELLEME_SAATI: string
  MESAJ: string
}

export const extractInnerContentXml = (key: string, content: string) => {
  return content.split(`${key}>`).at(1)?.split(`</`).at(0)
}

export function useLineNews() {
  const { code } = useLine()

  const query = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const response = await ky.post('https://api.ibb.gov.tr/iett/UlasimDinamikVeri/Duyurular.asmx?wsdl', {
        headers: {
          'Content-Type': 'text/xml; charset=UTF-8',
          'SOAPAction': '"http://tempuri.org/GetDuyurular_json"',
        },
        body: `
      <soap:Envelope
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
        </soap:Body>
      </soap:Envelope>
    `,
      })

      const key = 'GetDuyurular_jsonResult'
      const content = await response.text()

      const innerContent = extractInnerContentXml(key, content)
      if (!innerContent) return []

      const responseParsed: Announcement[] = JSON.parse(innerContent)
      return responseParsed
    },
    staleTime: CACHE_MS_30_MINUTES,
  })

  const news = query.data?.filter(a => a.HATKODU === code) || []

  return {
    query,
    news,
  }
}
