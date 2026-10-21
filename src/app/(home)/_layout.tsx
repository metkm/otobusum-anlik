import { Stack } from 'expo-router'

export const IndexLayout = () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="(tabs)" />
    <Stack.Screen name="search" />
  </Stack>
)

export default IndexLayout
