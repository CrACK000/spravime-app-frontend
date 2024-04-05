<script setup lang="ts">
import {onMounted, ref} from "vue"
import Chart from "primevue/chart"

onMounted(() => {
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})

const chartData = ref()
const chartOptions = ref()

const setChartData = () => {
  return {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: true,
        borderColor: '#1A56DB',
        pointRadius: 0,
        backgroundColor: function(context: any) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;

          if (!chartArea) {
            // This case happens on initial chart load.
            return null;
          }

          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(26, 87, 219, 0)');
          gradient.addColorStop(1, 'rgba(26, 87, 219, 0.3)');

          return gradient;
        },
        borderWidth: 4,
        tension: 0.4
      }
    ]
  };
}
const setChartOptions = () => {
  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      tooltip: {
        display: false,
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
  }
}
</script>

<template>
  <div class="bg-gradient-to-tr to-blue-200 from-blue-100 dark:from-blue-600/25 dark:to-gray-800 text-gray-600 dark:text-gray-300 rounded-xl md:rounded-3xl overflow-hidden">
    <div class="p-6 xxs:p-8 md:p-16 xl:p-12 xxl:p-16">
      <div class="text-2xl lg:text-4xl font-semibold mb-5 drop-shadow flex items-center gap-x-2">
        <svg class="w-7 h-7 text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path fill-rule="evenodd" d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z" clip-rule="evenodd"/>
        </svg>
        <div class="text-black dark:text-white font-bold">Plus+</div>
      </div>
      <div class="font-light lg:text-xl max-w-md tracking-wide">
        Získajte lepšiu viditeľnosť, robustnú štatistiku, zľavy na ostatné služby a ďalšie výhody. Urobte skok na ďalší level už dnes!
      </div>
      <div class="mt-12">
        <router-link to="/" class="inline-flex text-lg items-center gap-x-2 text-blue-600 dark:text-blue-400 tracking-wide font-medium border-b border-transparent hover:border-blue-600 dark:hover:border-blue-400">
          Zistiť viac
          <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"/>
          </svg>
        </router-link>
      </div>
    </div>
    <div>
      <Chart type="line" :data="chartData" :options="chartOptions" class="h-60 dark:opacity-50" />
    </div>
  </div>
</template>