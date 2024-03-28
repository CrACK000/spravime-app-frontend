<script setup lang="ts">
interface Props {
  submit: () => void,
}

defineProps<Props>()
</script>

<template>
  <div class="sticky bottom-0 w-full p-5 z-50">
    <form method="post" @submit.prevent="submit">
      <div class="h-20 relative group">
        <slot name="textarea"/>
        <div class="absolute bottom-0 h-full right-0 p-4">
          <slot name="button"/>
        </div>
      </div>
    </form>
  </div>
</template>