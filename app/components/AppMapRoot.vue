<script lang="ts">
import type { ShallowRef } from 'vue'
import { createContext } from '~/createContext'

interface VideoRootContext {
  map: ShallowRef<google.maps.Map | undefined>
}

export const [injectMapRootContext, provideMapRootContext] = createContext<VideoRootContext>('MapRoot')
</script>

<script setup lang="ts">
const map = shallowRef<google.maps.Map>()

provideMapRootContext({
  map,
})
</script>

<template>
  <slot />
</template>
