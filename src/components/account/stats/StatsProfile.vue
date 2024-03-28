<script setup lang="ts">
import {inject, onMounted, ref} from "vue"
import Chart from "primevue/chart"
import Panel from "@/components/template/Panel.vue"
import AverageRating from "@/components/app/AverageRating.vue"
import StatsHead from "@/components/account/stats/StatsHead.vue"
import {FwbButton, FwbDropdown} from "flowbite-vue";

const auth = inject<Auth>('auth')
const user = ref(auth?.userData as User)

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
  chartBarData.value = setChartBarData()
  chartBarOptions.value = setChartBarOptions()
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})

const chartBarData = ref()
const chartBarOptions = ref()
const chartData = ref()
const chartOptions = ref()

const setChartBarData = () => {
  return {
    labels: ['1 ★', '2 ★', '3 ★', '4 ★', '5 ★'],
    datasets: [
      {
        label: 'Počet',
        data: [540, 325, 702, 620, 1000],
        backgroundColor: ['rgba(26, 87, 219, 0.1)', 'rgba(26, 87, 219, 0.2)', 'rgba(26, 87, 219, 0.3)', 'rgba(26, 87, 219, 0.4)', 'rgba(26, 87, 219, 0.5)'],
        borderColor: ['rgba(26, 87, 219, 1)'],
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
      legend: {
        display: false,
      }
    },
    scales: {
      x: {
        ticks: {
          display: true,
          color: '#808080',
        },
        grid: {
          display: false,
          drawBorder: false
        }
      },
      y: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
          drawBorder: false
        }
      }
    }
  };
}
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
</script>

<template>

  <StatsHead>Štatistika profilu</StatsHead>

  <panel class="col-span-12 lg:col-span-5 p-4 md:p-8">
    <div class="flex justify-between mb-4">
      <div>
        <div class="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
          <AverageRating :rating="user.reviews.average_rating"/>
        </div>
        <p class="text-base font-normal text-gray-500 dark:text-gray-400">Priemerné hodnotenie profilu</p>
      </div>
    </div>
    <Chart type="bar" :data="chartBarData" :options="chartBarOptions" class="h-56" />
  </panel>

  <panel class="col-span-12 lg:col-span-7 p-4 md:p-8">
    <div class="flex justify-between mb-4">
      <div>
        <h5 class="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">133</h5>
        <p class="text-base font-normal text-gray-500 dark:text-gray-400">Návštevnosť profilu</p>
      </div>
      <div class="ms-auto">
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
    </div>

    <Chart type="line" :data="chartData" :options="chartOptions" class="h-56" />
  </panel>

</template>