import { Direction } from '@/types/departure'
import { getBody } from './body'

export interface BusStopLocation {
  hatKodu: string
  yon: Direction
  siraNo: string
  durakKodu: string
  durakAdi: string
  xKoordinati: string
  yKoordinati: string
  durakTipi: string
  isletmeBolge: string
  isletmeAltBolge: string
  ilceAdi: string
}

export async function getLineBusStopLocations(code: string) {
  const body = getBody('hat_kodu', 'DurakDetay_GYY', code)

  const response = await fetch('https://api.ibb.gov.tr/iett/ibb/ibb.asmx?wsdl', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml',
      'SOAPAction': '"http://tempuri.org/DurakDetay_GYY"',
    },
    body,
  })

  const text = await response.text()
  const datasetInnerContent = text
    .split(`<NewDataSet xmlns="">`)
    .at(-1)
    ?.split(`</NewDataSet>`)
    .at(0)

  const tableInnerContent = datasetInnerContent?.split(`<Table>`)
  if (!tableInnerContent) return

  const results: BusStopLocation[] = []
  for (let index = 1; index < tableInnerContent.length; index++) {
    const itemInnerContent = tableInnerContent[index]?.slice(0, -8)
    if (!itemInnerContent) continue

    results.push({
      hatKodu: itemInnerContent.split(`<HATKODU>`).at(-1)?.split(`</HATKODU>`).at(0)!,
      yon: itemInnerContent.split(`<YON>`).at(-1)?.split(`</YON>`).at(0) as Direction,
      siraNo: itemInnerContent.split(`<SIRANO>`).at(-1)?.split(`</SIRANO>`).at(0)!,
      durakKodu: itemInnerContent.split(`<DURAKKODU>`).at(-1)?.split(`</DURAKKODU>`).at(0)!,
      durakAdi: itemInnerContent.split(`<DURAKADI>`).at(-1)?.split(`</DURAKADI>`).at(0)!,
      xKoordinati: itemInnerContent.split(`<XKOORDINATI>`).at(-1)?.split(`</XKOORDINATI>`).at(0)!,
      yKoordinati: itemInnerContent.split(`<YKOORDINATI>`).at(-1)?.split(`</YKOORDINATI>`).at(0)!,
      durakTipi: itemInnerContent.split(`<DURAKTIPI>`).at(-1)?.split(`</DURAKTIPI>`).at(0)!,
      isletmeBolge: itemInnerContent
        .split(`<ISLETMEBOLGE>`)
        .at(-1)
        ?.split(`</ISLETMEBOLGE>`)
        .at(0)!,
      isletmeAltBolge: itemInnerContent
        .split(`<ISLETMEALTBOLGE>`)
        .at(-1)
        ?.split(`</ISLETMEALTBOLGE>`)
        .at(0)!,
      ilceAdi: itemInnerContent.split(`<ILCEADI>`).at(-1)?.split(`</ILCEADI>`).at(0)!,
    })
  }

  return results
}
