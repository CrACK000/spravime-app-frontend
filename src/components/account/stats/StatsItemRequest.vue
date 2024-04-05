<script setup lang="ts">
import Panel from "@/components/template/Panel.vue"
import {inject, onMounted, ref, watch} from "vue"
import Chart from "primevue/chart"
import {FwbButton, FwbDropdown} from "flowbite-vue"

const props = defineProps({
  requestId: {
    required: true,
    type: String
  }
})

const auth = inject<Auth>('auth')
const user = ref(auth?.userData as User)
const open = ref<boolean>(false)

function generateRandomNumbers(min: number, max: number, count: number) {
  let numbers = []
  for (let i=0; i<count; i++) {
    numbers.push(Math.floor(Math.random() * (max - min + 1)) + min)
  }
  return numbers
}
function generateLastDays(count: number) {
  let days = []
  for (let i=1; i<=count; i++) {
    let date = new Date()
    date.setDate(date.getDate() - i)
    let formattedDate = `${('0' + date.getDate()).slice(-2)} ${getMonthName(date.getMonth())}`
    days.push(formattedDate)
  }
  return days
}
function getMonthName(index: any) {
  const months = ["Jan", "Feb", "Mar", "Apr", "Máj", "Jún", "Júl", "Aug", "Sep", "Okt", "Nov", "Dec"]
  return months[index]
}

onMounted(() => {
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()

  watch(open, () => {
    chartData.value = setChartData()
    chartOptions.value = setChartOptions()
  })
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
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      decimation: {
        enabled: true,
        algorithm: 'min-max',
        threshold: 5
      },
      legend: {
        display: false,
      }
    },
    scales: {
      x: {
        display: open.value,
        ticks: {
          display: true,
          color: '#808080',
        },
        grid: {
          display: false,
        }
      },
      y: {
        display: open.value,
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        }
      }
    }
  };
}
</script>

<template>
  <Panel class="group overflow-hidden">
    <div class="grid grid-cols-12">
      <div class="col-span-12 xl:col-span-7 p-6 flex flex-col gap-y-3">
        <div class="flex items-center gap-x-3">
          <button type="button" @click="open = !open" class="bg-blue-600 p-1 rounded-lg text-white" title="Štatistika požiadavky">
            <svg class="w-5 h-5" :class="{'rotate-180': open}" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/>
            </svg>
          </button>
          <div class="md:text-lg truncate">
            Požiadavka na výstavbu štvorizbového bungalovu na kľúč
          </div>
        </div>
        <div v-if="!open" class="flex flex-wrap gap-x-6 gap-y-2 opacity-70 group-hover:opacity-100 transition">
          <div class="text-sm flex items-center gap-x-1.5">
            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
              <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
            </svg>
            Zobrazenia za celú dobu: <b>123</b>
          </div>
          <div class="text-sm flex items-center gap-x-1.5">
            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 9h5m3 0h2M7 12h2m3 0h5M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.616a1 1 0 0 0-.67.257l-2.88 2.592A.5.5 0 0 1 8 18.477V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/>
            </svg>
            Odpovede: <b>12</b>
          </div>
        </div>
        <div v-if="open" class="grid grid-cols-3 gap-x-8 gap-y-10 py-10 xl:py-0 my-auto">
          <div class="text-center">
            <div class="text-3xl font-semibold mb-2 text-green-400 flex items-center justify-center gap-x-1">
              45% <i class="fa-solid fa-arrow-trend-up text-base"></i>
            </div>
            <div class="text-xs">Posledných 7 dní</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-semibold mb-2 text-gray-800 dark:text-gray-300">
              1 234
            </div>
            <div class="text-xs">Zobrazenia za celú dobu</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-semibold mb-2 text-gray-800 dark:text-gray-300">
              12
            </div>
            <div class="text-xs">Odpovede</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-semibold mb-2 text-gray-800 dark:text-gray-300">
              2
            </div>
            <div class="text-xs">Komentáre</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-semibold mb-2 text-gray-800 dark:text-gray-300">
              4 <small>dni</small>
            </div>
            <div class="text-xs">Pridané</div>
          </div>
        </div>
      </div>
      <div class="col-span-12 xl:col-span-5">
        <div v-if="open" class="flex items-center justify-between p-6">
          <div class="ms-auto">
            <fwb-dropdown>
              <template #trigger>
                <fwb-button size="sm" color="alternative">
                  <template #suffix>
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/>
                    </svg>
                  </template>
                  posledných 7 dní
                </fwb-button>
              </template>
              <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 w-44" aria-labelledby="dropdownDefaultButton">
                <li>
                  <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">posledných 7 dní</a>
                </li>
                <li>
                  <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">posledných 15 dní</a>
                </li>
                <li>
                  <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">posledných 30 dní</a>
                </li>
                <li>
                  <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">posledných 60 dní</a>
                </li>
              </ul>
            </fwb-dropdown>
          </div>
        </div>
        <div :class="{'pe-6 pb-6': open}">
          <Chart type="line" :data="chartData" :options="chartOptions" :class="[open ? 'h-52' : 'h-32']" />
        </div>
      </div>
    </div>
  </Panel>
</template>