<template>
  <panel-grid grid="4" class="rework-element">

    <panel class="col-span-4 xxs:col-span-2 sm:col-span-1 p-2 md:p-4">
      <div class="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">230</div>
      <div class="text-xs opacity-75">Zobrazenia profilu</div>
    </panel>

    <panel class="col-span-4 xxs:col-span-2 sm:col-span-1 p-2 md:p-4">
      <div class="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">14</div>
      <div class="text-xs opacity-75">Pozícia</div>
    </panel>

    <panel class="col-span-4 xxs:col-span-2 sm:col-span-1 p-2 md:p-4">
      <div class="flex justify-between">
        <div class="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">4</div>
        <div class="flex flex-col -space-y-2.5">
          <i v-for="i in 4" class="fa-solid fa-angle-up" :key="i"></i>
        </div>
      </div>
      <div class="text-xs opacity-75">Rank</div>
    </panel>

    <panel class="col-span-4 xxs:col-span-2 sm:col-span-1 p-2 md:p-4">
      <div class="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">4.5</div>
      <div class="text-xs opacity-75">Hodnotenie profilu</div>
    </panel>

    <panel class="col-span-4 w-full">
      <div>
        <div class="flex justify-between p-6 pb-0">
          <div>
            <h5 class="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">1 233</h5>
            <p class="text-base font-normal text-gray-500 dark:text-gray-400">Návštevnosť profilu za posledný mesiac</p>
          </div>
          <div class="flex px-2.5">
            <Menu as="div" class="relative inline-block">
              <MenuButton class="text-gray-500 dark:text-gray-400 hover:bg-gray-300/60 dark:hover:bg-gray-700 focus:outline-none rounded-lg text-sm p-2.5 leading-none transition duration-100">
                <i class="fa-solid fa-calendar-days"></i>
              </MenuButton>
              <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                <MenuItems class="absolute right-0 z-10 mt-2 origin-top-right rounded-md shadow w-44 bg-gray-700 overflow-hidden">
                  <MenuItem>
                    <button class="block px-4 py-3 text-gray-200 hover:bg-gray-600 hover:text-white w-full">posledný mesiac</button>
                  </MenuItem>
                  <MenuItem>
                    <button class="block px-4 py-3 text-gray-200 hover:bg-gray-600 hover:text-white w-full">posledných 7 dní</button>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
        <div id="area-chart"></div>
      </div>
    </panel>

  </panel-grid>
</template>

<script setup lang="ts">
import Panel from "@/components/Panel.vue";
import PanelGrid from "@/components/PanelGrid.vue";
import {onMounted} from "vue";
import ApexCharts from 'apexcharts'
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/vue";
import {useMeta} from "vue-meta";

useMeta({ title: 'Štatistika' })
onMounted(() => {
  const options = {
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
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: 0
      },
    },
    series: [
      {
        name: 'Zobrazenia',
        data: [6500, 6418, 6456, 6526, 6356, 6456],
        color: '#1A56DB',
      },
    ],
    xaxis: {
      categories: ['01 February', '02 February', '03 February', '04 February', '05 February', '06 February', '07 February'],
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
  };

  const chartArea = document.getElementById('area-chart');

  if(chartArea) {
    const chart = new ApexCharts(chartArea, options);
    chart.render();
  }
})
</script>