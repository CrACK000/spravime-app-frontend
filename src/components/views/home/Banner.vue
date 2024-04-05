<script setup lang="ts">
import Container from "@/components/template/Container.vue"
</script>

<template>
  <Container>
    <div class="w-full flex flex-col gap-y-6 md:gap-y-12 h-screen justify-center -mt-10 md:-mt-36 z-10">
      <div class="drop-shadow font-semibold md:font-bold text-3xl md:text-5xl lg:text-6xl">
        Spravime to spoločne!
      </div>

      <div class="drop-shadow font-light text-lg lg:text-xl opacity-80 max-w-4xl">
        Naša platforma umožňuje ľuďom podať požiadavky na rôzne služby, od vykopávania základov po remeselné
        práce. <span class="hidden md:inline-block">Pre firmy a profesionálov je to príležitosť reagovať na tieto požiadavky a získať prácu.</span>
      </div>

      <div class="md:font-medium text-sm opacity-75">Spolu vytvárame spoľahlivú a efektívnu komunitu.</div>

      <div class="py-4">
        <router-link :to="{ name: 'index' }" class="form-button-lg shadow-xl">Vytvoriť požiadavku</router-link>
      </div>
    </div>
  </Container>
</template>