import { UiText } from '@/components/ui/UiText'

import { useLine } from '@/hooks/queries/useLine'
import { useCountdown } from '@/hooks/useCountdown'

import { i18n } from '@/translations/i18n'

interface LineUpdateCountdownProps {
  lineCode: string
}

export const LineUpdateCountdown = ({ lineCode }: LineUpdateCountdownProps) => {
  const { query } = useLine(lineCode)
  const { count } = useCountdown(query.dataUpdatedAt)

  return <UiText size="sm" dimmed>{i18n.t('updateCount', { count: Math.floor(count / 1_000) })}</UiText>
}
