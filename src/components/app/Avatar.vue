<script setup lang="ts">

/*
  @todo
  Pridať načítavanie obrázku @load
 */

interface AvatarComponent {
  img?: string | undefined,
  alt?: string,
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl",
  rounded?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "full",
  notify?: boolean,
  prefix?: boolean,
  resolution?: string,
}

const Size = {
  xxs: "w-5 h-5",
  xs: "w-8 h-8",
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-24 h-24",
  xl: "w-36 h-36",
  xxl: "w-64 h-64",
}

const SizeIcon = {
  xxs: "w-6 h-6",
  xs: "w-10 h-10",
  sm: "w-16 h-16",
  md: "w-20 h-20",
  lg: "w-32 h-32",
  xl: "w-48 h-48",
  xxl: "w-80 h-80",
}

const Rounded = {
  xs: "rounded-sm",
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  xxl: "rounded-2xl",
  full: "rounded-full",
}

withDefaults(defineProps<AvatarComponent>(), {
  img: undefined,
  alt: '',
  size: "md",
  rounded: "md",
  notify: false,
  prefix: true,
  resolution: '150x150',
})

const Prefix = `${import.meta.env.VITE_BACKEND}/cloud/`
</script>

<template>
  <div class="relative inline-block">
    <div :class="`relative overflow-hidden -mb-2 ${Rounded[rounded]}`">
      <div v-if="!img?.length" :class="`bg-gray-200 dark:bg-gray-600 ${Size[size]}`">
        <svg :class="`absolute ${SizeIcon[size]} text-gray-400 inset-x-1/2 -translate-x-1/2`" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
      </div>
      <div v-else :class="`${Size[size]}`">
        <img :src="`${prefix ? Prefix : ''}${img}${img && resolution ? `/${resolution}` : ''}`" :alt="alt" :class="`${Size[size]}`"/>
      </div>
    </div>
    <div v-if="notify" class="absolute top-0 right-0">
      <span class="relative flex h-2.5 w-2.5">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
      </span>
    </div>
  </div>
</template>