<script setup lang="ts">
import { useLineTheme } from '~/hooks/useLineTheme'

const props = defineProps<{
  code: string
}>()

const { cssVariableTemplate } = useLineTheme(props.code)
</script>

<template>
  <div :style="cssVariableTemplate">
    <!-- <div class="fixed top-20 left-0 z-50">
      <div
        v-for="shade in colorShades"
        :key="shade"
        class="size-10"
        :style="{ backgroundColor: shade }"
      />
    </div> -->

    <slot />
  </div>
</template>

<style>
/* :root {
--ui-color-neutral-${code}-50: ${colors[0]};
  --ui-color-neutral-${code}-100: ${colors[1]};
  --ui-color-neutral-${code}-200: ${colors[2]};
  --ui-color-neutral-${code}-300: ${colors[3]};
  --ui-color-neutral-${code}-400: ${colors[4]};
  --ui-color-neutral-${code}-500: ${colors[5]};
  --ui-color-neutral-${code}-600: ${colors[6]};
  --ui-color-neutral-${code}-700: ${colors[7]};
  --ui-color-neutral-${code}-800: ${colors[8]};
  --ui-color-neutral-${code}-900: ${colors[9]};
--ui-color-neutral-${code}-950: ${colors[10]};
}

.line-theme .dark {

}

.line-theme {

} */
</style>
