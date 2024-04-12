<script setup lang="ts">
import Container from "@/components/template/Container.vue"
import FooterMenuHead from "@/components/template/FooterMenuHead.vue"
import FooterMenuItem from "@/components/template/FooterMenuItem.vue"
import FooterMenu from "@/components/template/FooterMenu.vue"
import FooterMenuItemExt from "@/components/template/FooterMenuItemExt.vue"
</script>

<template>
  <div class="sp-footer">
    <Container>
      <div class="grid xl:grid-cols-6 gap-8 md:mb-10 md:mt-28 px-4">

        <div class="col-span-full xl:col-span-2 order-2 xl:order-1">
          <div class="flex flex-col md:flex-row xl:flex-col justify-between gap-y-8 p-6 h-full">
            <div class="mx-auto md:mx-0 md:me-auto">
              <div class="sp-baloo text-2xl lg:text-3xl text-center">Spravime</div>
              <div class="text-center text-xs opacity-50">www.spravi.me</div>
            </div>
            <div class="xl:mt-auto text-xs sm:text-sm dark:text-gray-400 text-center md:text-start">
              Copyright © {{ new Date().getFullYear() }} Spravime.<br> All rights reserved.
            </div>
          </div>
        </div>

        <div class="col-span-full xl:col-span-4 order-1 xl:order-2 grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 lg:gap-8 items-start text-sm md:text-base">
          <FooterMenu>
            <FooterMenuHead title="Pomoc"/>
            <FooterMenuItem title="Časté otázky" :to="{ name: 'index' }"/>
            <FooterMenuItem title="Zoznam zmien" :to="{ name: 'index' }"/>
            <FooterMenuItem title="Spätná väzba" :to="{ name: 'index' }"/>
            <FooterMenuItem title="Plus+" :to="{ name: 'index' }"/>
            <FooterMenuItem title="Topovanie" :to="{ name: 'index' }"/>
            <li>
              <button id="theme-toggle" type="button" class="link hover:underline">
                <span id="theme-toggle-dark-icon" class="hidden">Tmavý režim</span>
                <span id="theme-toggle-light-icon" class="hidden">Svetlý režim</span>
              </button>
            </li>
          </FooterMenu>

          <FooterMenu>
            <FooterMenuHead title="Firma"/>
            <FooterMenuItem title="O nás" :to="{ name: 'index' }"/>
            <FooterMenuItem title="Shop" :to="{ name: 'index' }"/>
          </FooterMenu>

          <FooterMenu>
            <FooterMenuHead title="Kontakt"/>
            <FooterMenuItemExt title="Facebook" href="#"/>
            <FooterMenuItemExt title="Instagram" href="#"/>
            <FooterMenuItemExt title="Email" href="#"/>
          </FooterMenu>

          <FooterMenu>
            <FooterMenuHead title="Práva & Podmienky"/>
            <FooterMenuItem title="Zásady ochrany osobných údajov" :to="{ name: 'index' }"/>
            <FooterMenuItem title="Podmienky služby" :to="{ name: 'index' }"/>
          </FooterMenu>
        </div>

      </div>
    </Container>
  </div>
</template>