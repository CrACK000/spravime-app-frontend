<script lang="ts">
export default {
  props: ['tabs', 'startTab'],
  data() {
    return {
      selectedTab: this.startTab
    }
  },
  methods: {
    selectTab(name: string) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      this.selectedTab = name
    }
  },
  created() {
    if (this.$route.hash) this.selectedTab = this.$route.hash.replace('#', '')
  }
}
</script>

<template>
  <ul class="flex flex-col gap-2">
    <li v-for="tab in tabs" @click="selectTab(tab.name)">
      <a :href="'#'+tab.name"
         v-text="tab.title"
         :class="{'tab-active': selectedTab === tab.name}"
         class="cursor-pointer block w-full hover:bg-white/80 dark:hover:bg-gray-800/50 transition duration-100 px-4 py-2.5 rounded-md"
      ></a>
    </li>
  </ul>
</template>

<style scoped>
.tab-active:after {
  content: '';
}
</style>