<script setup lang="ts">
import Chart from "primevue/chart"
import {onMounted, ref} from "vue";

onMounted(() => {
  chartBarData.value = setChartBarData()
  chartBarOptions.value = setChartBarOptions()
})

const chartBarData = ref()
const chartBarOptions = ref()

const setChartBarData = () => {
  return {
    labels: ['1 ★', '2 ★', '3 ★', '4 ★', '5 ★'],
    datasets: [
      {
        label: 'Počet',
        data: [540, 325, 702, 620, 1000],
        backgroundColor: ['rgba(34, 211, 238, 0.1)', 'rgba(34, 211, 238, 0.2)', 'rgba(34, 211, 238, 0.3)', 'rgba(34, 211, 238, 0.4)', 'rgba(34, 211, 238, 0.5)'],
        borderColor: ['rgba(34, 211, 238, 1)'],
        borderWidth: 1
      }
    ]
  };
};
const setChartBarOptions = () => {
  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      tooltip: {
        enabled: false,
      },
      decimation: {
        enabled: false
      },
      legend: {
        display: false,
      }
    },
    scales: {
      x: { display: false },
      y: { display: false }
    }
  };
}
</script>

<template>
  <div class="bg-gradient-to-bl from-indigo-600/25 to-indigo-200/25 dark:from-indigo-600/25 dark:to-indigo-400/5 text-gray-600 dark:text-gray-300 rounded-xl md:rounded-3xl overflow-hidden">
    <div class="p-6 xxs:p-8 md:p-16 xl:p-12 xxl:p-16">
      <div class="text-2xl lg:text-4xl font-semibold mb-5 drop-shadow">
        <div class="text-black dark:text-white font-semibold">Majstrovské ponuky</div>
      </div>
      <div class="font-light lg:text-xl max-w-md tracking-wide">
        Prezentujte svoje služby a produkty výraznými ponukami. Pracujete ako firma alebo živnostník?
        Vytvorte ponuku a zviditeľnite to, v čom ste odborníkom.
      </div>
      <div class="mt-12">
        <router-link to="/" class="inline-flex text-lg items-center gap-x-2 text-indigo-600 dark:text-indigo-500 tracking-wide font-medium border-b border-transparent hover:border-indigo-600 dark:hover:border-indigo-500">
          Zistiť viac
          <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"/>
          </svg>
        </router-link>
      </div>
    </div>
    <div class="opacity-80 dark:opacity-50">
      <div class="flex justify-center gap-x-4">
        <div class="w-20 h-28 bg-black rounded-xl bg-gradient-to-bl from-indigo-600 to-indigo-300 dark:from-indigo-600/30 dark:to-indigo-500/40 shadow-xl mt-4"></div>
        <div class="w-24 h-24 bg-black rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-300 dark:from-indigo-600/30 dark:to-indigo-500/40 shadow-xl mt-1"></div>
        <div class="w-28 h-16 bg-black rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-300 dark:from-indigo-600/30 dark:to-indigo-500/40 shadow-xl mt-6"></div>
        <div class="w-32 h-32 bg-black rounded-xl bg-gradient-to-tl from-indigo-600 to-indigo-300 dark:from-indigo-600/30 dark:to-indigo-500/40 shadow-xl -mt-4"></div>
      </div>
      <div class="flex justify-center gap-x-4 -mt-10">
        <div class="w-20 h-28 bg-black rounded-xl bg-gradient-to-bl from-indigo-600 to-indigo-300 dark:from-indigo-600/30 dark:to-indigo-500/40 shadow-xl -mt-6"></div>
        <div class="w-24 h-24 bg-black rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-300 dark:from-indigo-600/30 dark:to-indigo-500/40 shadow-xl -mt-4"></div>
        <div class="w-32 h-28 bg-black rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-300 dark:from-indigo-600/30 dark:to-indigo-500/40 shadow-xl -mt-4"></div>
        <div class="w-28 h-16 bg-black rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-300 dark:from-indigo-600/30 dark:to-indigo-500/40 shadow-xl -mt-2"></div>
        <div class="w-24 h-28 bg-black rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-300 dark:from-indigo-600/30 dark:to-indigo-500/40 shadow-xl -mt-2"></div>
      </div>
    </div>
  </div>
</template>