import Onboarding from '@blazejkustra/react-native-onboarding'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useCSSVariable } from 'uniwind'

import { UButton } from './u/UButton'
import { UText } from './u/UText'

import { useSettingsStore } from '@/stores'

const Step = ({
  title,
  description,
  onBack,
  onNext,
  isLast,
}: {
  title?: string
  description?: string
  onBack: () => void
  onNext: () => void
  isLast?: boolean
}) => {
  return (
    <View className="bg-muted p-6 rounded-md gap-6">
      {(title || description) && (
        <View>
          {title && (
            <UText className="font-inter-medium text-xl">{title}</UText>
          )}

          {description && (
            <UText className="text-muted">{description}</UText>
          )}
        </View>
      )}

      <View className="flex-row gap-2">
        {!isLast && (
          <>
            <UButton
              size="lg"
              block
              icon="x"
              onPress={() => {
                useSettingsStore.setState((state) => {
                  state.showOnBoarding = false
                })
              }}
              variant="soft"
            />

            <UButton
              size="lg"
              block
              icon="arrow-left"
              onPress={onBack}
              variant="soft"
              label="Back"
            />
          </>
        )}

        <UButton
          label={isLast ? 'That\'s it!' : 'Next'}
          size="lg"
          block
          onPress={onNext}
          className="grow"
        />
      </View>
    </View>
  )
}

export const AppOnboarding = () => {
  const [bgMuted, primary] = useCSSVariable(['--ui-bg-muted', '--ui-primary'])
  const { t } = useTranslation()

  return (
    <Onboarding
      background={() => <View className="flex-1 bg-primary rounded-md absolute inset-0" />}
      introPanel={({ onPressStart }) => (
        <View className="shrink-0 p-6 gap-6 bg-muted">
          <UText className="font-inter-medium text-xl text-center">{t('welcome')}</UText>

          <UButton
            label={t('getStarted')}
            size="lg"
            block
            onPress={onPressStart}
          />
        </View>
      )}
      steps={[
        {
          position: 'top',
          image: require('../assets/onboarding/add-line.gif'),
          component: ({ onBack, onNext }) => (
            <Step
              title={t('boardingStep1Title')}
              description={t('boardingStep1Description')}
              onBack={onBack}
              onNext={onNext}
            />
          ),
        },
        {
          position: 'top',
          image: require('../assets/onboarding/create-group-rename.gif'),
          component: ({ onBack, onNext }) => (
            <Step
              title={t('boardingStep2Title')}
              description={t('boardingStep2Description')}
              onBack={onBack}
              onNext={onNext}
            />
          ),
        },
        {
          position: 'top',
          image: require('../assets/onboarding/add-to-group-switch.gif'),
          component: ({ onBack, onNext }) => (
            <Step
              title={t('boardingStep3Title')}
              description={t('boardingStep3Description')}
              onBack={onBack}
              onNext={onNext}
            />
          ),
        },
        {
          position: 'top',
          image: require('../assets/onboarding/add-to-group-switch.gif'),
          component: ({ onBack, onNext, isLast }) => (
            <Step
              onBack={onBack}
              onNext={onNext}
              isLast={isLast}
            />
          ),
        },
      ]}
      onComplete={() => {
        useSettingsStore.setState((state) => {
          state.showOnBoarding = false
        })
      }}
      // @ts-expect-error
      colors={{
        background: {
          primary: primary as string,
          accent: 'red',
          label: 'red',
          secondary: bgMuted as string,
        },
      }}
    />
  )
}
