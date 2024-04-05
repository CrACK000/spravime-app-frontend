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
  <div class="bg-gradient-to-bl from-cyan-400/25 to-cyan-200/25 dark:from-cyan-400/25 dark:to-cyan-800/5 text-gray-600 dark:text-gray-300 rounded-xl md:rounded-3xl overflow-hidden">
    <div class="p-6 xxs:p-8 md:p-16 xl:p-12 xxl:p-16">
      <div class="text-2xl lg:text-4xl font-semibold mb-5 drop-shadow">
        <div class="text-black dark:text-white font-semibold">Vaše hodnotenie má význam!</div>
      </div>
      <div class="font-light lg:text-xl max-w-md tracking-wide">
        Vaša spätná väzba je kľúčová. Po vykonaní prác môžete ohodnotiť hviezdičkami, odporučiť a recenzovať firmu alebo majstra.
        Pomáhate tým budovať spoľahlivú komunitu a zlepšovať výber.
      </div>
      <div class="mt-12">
        <router-link to="/" class="inline-flex text-lg items-center gap-x-2 text-cyan-600 dark:text-cyan-500 tracking-wide font-medium border-b border-transparent hover:border-cyan-600 dark:hover:border-cyan-400">
          Zistiť viac
          <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"/>
          </svg>
        </router-link>
      </div>
    </div>
    <div>
      <Chart type="bar" :data="chartBarData" :options="chartBarOptions" class="h-44 px-4 dark:opacity-50" />
    </div>
  </div>
</template>