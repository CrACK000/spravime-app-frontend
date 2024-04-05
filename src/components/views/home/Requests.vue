<script setup lang="ts">
import Container from "@/components/template/Container.vue"

const requestInfo = [
  {
    title: 'Filtrovanie',
    description: 'Vyhľadávajte projekty podľa názvu, sekcie, kategórie, lokality.',
    icon: '<svg class="w-4 h-4 md:w-6 md:h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z"/></svg>'
  },
  {
    title: 'Príležitosti',
    description: 'Vyberte si z množstva požiadaviek na služby.',
    icon: '<svg class="w-4 h-4 md:w-6 md:h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m10.827 5.465-.435-2.324m.435 2.324a5.338 5.338 0 0 1 6.033 4.333l.331 1.769c.44 2.345 2.383 2.588 2.6 3.761.11.586.22 1.171-.31 1.271l-12.7 2.377c-.529.099-.639-.488-.749-1.074C5.813 16.73 7.538 15.8 7.1 13.455c-.219-1.169.218 1.162-.33-1.769a5.338 5.338 0 0 1 4.058-6.221Zm-7.046 4.41c.143-1.877.822-3.461 2.086-4.856m2.646 13.633a3.472 3.472 0 0 0 6.728-.777l.09-.5-6.818 1.277Z"/></svg>'
  },
  {
    title: 'Topovanie požiadavky',
    description: 'Dostaňte svoju požiadavku na vrch zoznamu.',
    icon: '<svg class="w-4 h-4 md:w-6 md:h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z"/></svg>'
  },
  {
    title: 'Pridanie požiadavky',
    description: 'Pridajte vlastnú požiadavku a nájdite profesionála.',
    icon: '<svg class="w-4 h-4 md:w-6 md:h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/></svg>'
  }
]
</script>

<template>
  <div class="bg-gray-50 dark:bg-black/10 skew-y-2">
    <div class="-skew-y-2">
      <div class="w-full flex items-center justify-center">
        <div class="p-4 bg-blue-200 dark:bg-blue-950 border-2 border-blue-500 dark:border-blue-600 text-blue-500 dark:text-blue-600 rounded-full -mt-8">
          <svg class="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.005 11.19V12l6.998 4.042L19 12v-.81M5 16.15v.81L11.997 21l6.998-4.042v-.81M12.003 3 5.005 7.042l6.998 4.042L19 7.042 12.003 3Z"/>
          </svg>
        </div>
      </div>
      <div class="mt-14">
        <div class="text-blue-600 text-lg font-medium mb-3 md:mb-6 text-center">
          Nájdi prácu jednoduchšie
        </div>
        <div class="text-black dark:text-gray-200 text-2xl md:text-4xl font-semibold mb-6 text-center">
          Požiadavky
        </div>
        <div class="bg-blue-600 w-32 h-[1px] mx-auto mb-6"></div>
        <div class="px-5 text-gray-600 dark:text-gray-400 mb-16 text-center">
          V našom zozname požiadaviek nájdete svoj ideálny projekt. Objavujte nové možnosti ešte dnes!
        </div>
        <Container small>
          <div class="grid md:grid-cols-2 gap-6 md:gap-12 lg:gap-16 xl:gap-20">
            <div v-for="request in requestInfo" class="relative pt-6 ps-6 pb-10 pe-12 md:pt-8 md:ps-8 md:pb-12 md:pe-14 border border-blue-600 dark:border-blue-600/40 rounded-xl overflow-hidden sp-shadow-request-home">
              <div class="text-blue-600 dark:text-blue-400 font-medium mb-3">{{ request.title }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ request.description }}
              </div>
              <div class="absolute -bottom-3 -right-3 border border-blue-600 dark:border-blue-500/60 text-blue-600 dark:text-blue-500/60 p-6 rounded-full">
                <span v-html="request.icon"></span>
              </div>
            </div>
          </div>
        </Container>
        <Container class="pt-20 pb-44 text-center">
          <router-link to="/" class="form-button block md:inline-block text-center">
            Zoznam požiadaviek
          </router-link>
        </Container>
      </div>
    </div>
  </div>
</template>