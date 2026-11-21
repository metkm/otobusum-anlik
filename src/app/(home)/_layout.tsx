import { Stack } from 'expo-router'

export const IndexLayout = () => (
  <Stack
    screenOptions={{ headerShown: false }}
    activityEnabled
  >
    <Stack.Screen name="(tabs)" />
  </Stack>
)

export default IndexLayout
