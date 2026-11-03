import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { MS_30_MINUTES } from '@/constants/time'
import { useFilterStore } from '@/stores'

import { useLine } from './useLine'

interface Announcement {
  HAT: string
  HATKODU: string
  TIP: string
  GUNCELLEME_SAATI: string
  MESAJ: string
}

const extractInnerContentXml = (key: string, content: string) =>
  content.split(`${key}>`).at(1)?.split(`</`).at(0)

export const useLineNews = () => {
  const { code } = useLine()
  const city = useFilterStore(useShallow((state) => state.city))

  const query = useQuery({
    queryFn: async () => {
      const response = await ky.post(
        'https://api.ibb.gov.tr/iett/UlasimDinamikVeri/Duyurular.asmx?wsdl',
        {
          body: `
      <soap:Envelope
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
        </soap:Body>
      </soap:Envelope>
    `,
          headers: {
            'Content-Type': 'text/xml; charset=UTF-8',
            SOAPAction: '"http://tempuri.org/GetDuyurular_json"',
          },
        },
      )

      const key = 'GetDuyurular_jsonResult'
      const content = await response.text()

      const innerContent = extractInnerContentXml(key, content)
      if (!innerContent) {
        return []
      }

      const responseParsed: Announcement[] = JSON.parse(innerContent)
      return responseParsed
    },
    queryKey: ['announcements', city],
    staleTime: MS_30_MINUTES,
  })

  const news = query.data?.filter((a) => a.HATKODU === code) || []

  return {
    news,
    query,
  }
}
