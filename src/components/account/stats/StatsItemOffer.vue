<script setup lang="ts">
import Panel from "@/components/template/Panel.vue"
import {inject, onMounted, ref, watch} from "vue"
import Chart from "primevue/chart"
import {FwbButton, FwbDropdown} from "flowbite-vue"

const props = defineProps({
  offerId: {
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
  chartRadarData.value = setChartRadarData()
  chartRadarOptions.value = setChartRadarOptions()

  watch(open, () => {
    chartData.value = setChartData()
    chartOptions.value = setChartOptions()
    chartRadarData.value = setChartRadarData()
    chartRadarOptions.value = setChartRadarOptions()
  })
})

const chartData = ref()
const chartOptions = ref()
const chartRadarData = ref()
const chartRadarOptions = ref()

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
        display: true,
        ticks: {
          display: true,
          color: '#808080',
        },
        grid: {
          display: false,
        }
      },
      y: {
        display: true,
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
const setChartRadarData = () => {
  return {
    labels: ['Produkt 1', 'Produkt 2', 'Produkt 3', 'Produkt 4'],
    datasets: [
      {
        label: 'First Dataset',
        data: [33, 20, 44, 12],
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
        borderWidth: 2,
        tension: 0
      }
    ]
  };
}
const setChartRadarOptions = () => {
  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
    plugins: {
      decimation: {
        enabled: true,
        algorithm: 'min-max',
        threshold: 5
      },
      legend: {
        display: false,
      },
      tooltip: {
        position: 'nearest'
      }
    },
    scales: {
      x: {
        display: false,
        ticks: {
          display: false,
          color: '#808080',
        },
        grid: {
          display: false,
        }
      },
      y: {
        display: false,
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
    <div class="p-6 flex flex-col gap-y-8">
      <div class="flex items-center justify-between">
        <div class="md:text-lg truncate">
          Ponuka na výstavbu štvorizbového bungalovu na kľúč
        </div>
        <div>
          <button type="button" @click="open = !open" :class="[ open ? 'form-secondary-button-sm' : 'form-button-sm']">
            {{ open ? 'Zatvoriť' : 'Zobraziť štatistiku' }}
          </button>
        </div>
      </div>
      <div class="grid grid-cols-5">
        <div class="text-center">
          <div class="text-3xl font-semibold mb-2 text-gray-800 dark:text-gray-300">
            1 322
          </div>
          <div class="text-xs">Zobrazenia za celú dobu</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-semibold mb-2 text-green-400 flex items-center justify-center gap-x-1">
            45% <i class="fa-solid fa-arrow-trend-up text-base"></i>
          </div>
          <div class="text-xs">Posledných 7 dní</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-semibold mb-2 text-gray-800 dark:text-gray-300">
            4
          </div>
          <div class="text-xs">Produkty</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-semibold mb-2 text-gray-800 dark:text-gray-300">
            233
          </div>
          <div class="text-xs">Kliknutia na produkty</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-semibold mb-2 text-gray-800 dark:text-gray-300">
            10
          </div>
          <div class="text-xs">Odoslané správy</div>
        </div>
      </div>
      <div v-if="open" class="grid grid-cols-12 divide-x divide-gray-200 dark:divide-gray-700/75 border-t border-gray-200 dark:border-gray-700/75">
        <div class="col-span-6 pe-4">
          <div class="flex items-center justify-between p-6">
            <div>
              <h5 class="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">4 421</h5>
              <p class="text-base font-normal text-gray-500 dark:text-gray-400">Kliknutia na produkty</p>
            </div>
            <fwb-dropdown>
              <template #trigger>
                <fwb-button outline>
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
          <Chart type="radar" :data="chartRadarData" :options="chartRadarOptions" class="h-72" />
        </div>
        <div class="col-span-6 ps-4">
          <div class="flex items-center justify-between p-6">
            <div>
              <h5 class="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">133</h5>
              <p class="text-base font-normal text-gray-500 dark:text-gray-400">Zobrazenia ponuky</p>
            </div>
            <fwb-dropdown>
              <template #trigger>
                <fwb-button outline>
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
          <Chart type="line" :data="chartData" :options="chartOptions" class="h-72" />
        </div>
      </div>
    </div>
  </Panel>
</template>