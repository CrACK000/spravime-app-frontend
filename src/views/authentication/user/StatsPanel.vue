<script setup lang="ts">
import Panel from "@/components/Panel.vue"
import {inject, onMounted, ref} from "vue"
import ApexCharts from 'apexcharts'
import {useMeta} from "vue-meta"

useMeta({ title: 'Štatistika' })

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
  const charOptions = {
    chart: {
      height: '100%',
      maxWidth: '100%',
      type: 'area',
      fontFamily: 'Poppins, sans-serif',
      dropShadow: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
        shade: '#1C64F2',
        gradientToColors: ['#1C64F2'],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 6,
    },
    grid: {
      show: false,
      strokeDashArray: 2,
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
    },
    series: [
      {
        name: 'Zobrazenia',
        data: generateRandomNumbers(10, 2000, 15),
        color: '#1A56DB',
      },
    ],
    xaxis: {
      categories: generateLastDays(15),
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
  }
  const pieOptions = {
    series: [44, 55],
    labels: ['Prihlásený', 'Neprihlásený'],
    colors: ["#1C64F2", "#334155"],
    chart: {
      type: 'donut',
    },
    stroke: {
      colors: ["transparent"],
      lineCap: "",
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [{
      options: {
        legend: {
          position: 'bottom'
        }
      }
    }]
  }
  const barOptions = {
    colors: ["#1A56DB"],
    series: [
      {
        name: "Počet",
        color: "#1A56DB",
        data: [
          { x: "1 ★", y: 4 },
          { x: "2 ★", y: 5 },
          { x: "3 ★", y: 1 },
          { x: "4 ★", y: 5 },
          { x: "5 ★", y: 10 }
        ],
      },
    ],
    chart: {
      type: "bar",
      height: "180px",
      width: '200px',
      fontFamily: "Inter, sans-serif",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
        borderRadiusApplication: "end",
        borderRadius: 8,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      style: {
        fontFamily: "Inter, sans-serif",
      },
    },
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 1,
        },
      },
    },
    stroke: {
      show: true,
      width: 0,
      colors: ["transparent"],
    },
    grid: {
      show: false,
      strokeDashArray: 2,
      padding: {
        left: 0,
        right: 0,
        top: 0
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      floating: false,
      labels: {
        show: true,
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: 'text-sm font-normal fill-gray-500 dark:fill-gray-400'
        }
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    fill: {
      opacity: 1,
    },
  }

  const chartArea = document.getElementById('area-chart')
  const pieArea = document.getElementById('pie-chart')
  const barArea = document.getElementById('bar-chart')

  if(chartArea) {
    const chart = new ApexCharts(chartArea, charOptions)
    const pie = new ApexCharts(pieArea, pieOptions)
    const bar = new ApexCharts(barArea, barOptions)
    chart.render()
    pie.render()
    bar.render()
  }
})
</script>

<template>
  <div class="grid grid-cols-2 gap-0.5 md:gap-10 md:-mx-0">

    <panel class="rework-element col-span-1 xxs:col-span-2 sm:col-span-1 p-2 md:p-4 flex justify-between relative">
      <div id="pie-chart"></div>
      <div class="absolute bottom-4 right-4">
        <div class="leading-none text-5xl font-bold text-gray-900 dark:text-white pb-2 text-end">{{ user.views }}</div>
        <div class="font-normal text-gray-500 dark:text-gray-400 text-end">Zobrazenia profilu</div>
      </div>
    </panel>

    <panel class="rework-element col-span-1 xxs:col-span-2 sm:col-span-1 p-2 md:p-4 flex justify-between items-end relative h-[200px]">
      <div id="bar-chart" class="w-[180px] h-[200px]"></div>
      <div class="absolute bottom-4 right-4">
        <div class="leading-none text-5xl font-bold text-gray-900 dark:text-white pb-2 text-end">{{ user.reviews.average_rating }}</div>
        <div class="font-normal text-gray-500 dark:text-gray-400 text-end">Hodnotenie profilu</div>
      </div>
    </panel>

    <panel class="rework-element col-span-2">
      <div class="grid grid-cols-12 items-end">
        <div class="col-span-12 md:col-span-5 p-6">
          <div>
            <h5 class="leading-none text-5xl font-bold text-gray-900 dark:text-white pb-3">1 233</h5>
            <p class="text-sm opacity-75">posledných 15 dní</p>
            <p class="font-normal text-gray-500 dark:text-gray-400">Návštevnosť profilu</p>
          </div>
        </div>
        <div class="col-span-12 md:col-span-7">
          <div id="area-chart"></div>
        </div>
      </div>
    </panel>

  </div>
</template>