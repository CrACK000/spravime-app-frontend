<script setup lang="ts">
import {inject, onMounted, ref} from "vue"
import Panel from "@/components/template/Panel.vue"
import Chart from "primevue/chart"

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
  <panel v-if="user.profile.type !== 'normal'" class="col-span-12">
    <div class="grid grid-cols-12 items-center">
      <div class="col-span-12 md:col-span-5 p-6">
        <div class="flex md:flex-col justify-between">
          <h5 class="leading-none text-5xl font-bold text-gray-900 dark:text-white whitespace-nowrap mb-3">1 233</h5>
          <div>
            <p class="text-sm opacity-75 text-end md:text-start">posledných 10 dní</p>
            <p class="font-normal text-gray-500 dark:text-gray-400 text-end md:text-start text-sm xs:text-base">Návštevnosť profilu</p>
          </div>
        </div>
      </div>
      <div class="col-span-12 md:col-span-7">
        <Chart type="line" :data="chartData" :options="chartOptions" class="h-36" />
      </div>
    </div>
  </panel>
  <panel v-else class="col-span-12 p-10 text-center">
    Základná štatistika profilu je dostupná iba pre profily typu <span class="text-blue-500">Živnostník</span> a <span class="text-blue-500">Firma</span>.
    <div class="mt-4">
      <router-link :to="{ name: 'user-account' }" class="form-button-sm">
        Nastavenia profilu
      </router-link>
    </div>
  </panel>
</template>