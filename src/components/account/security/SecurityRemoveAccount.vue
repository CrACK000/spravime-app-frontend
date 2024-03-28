<script setup lang="ts">
import {useRouter} from "vue-router"
import {useDialog} from "primevue/usedialog"
import Panel from "@/components/template/Panel.vue"
import RemoveAccount from "@/components/dialogs/RemoveAccount.vue"

const router = useRouter()
const dialog = useDialog()


const removeAccountModal = () => {
  dialog.open(RemoveAccount, {
    props: {
      header: 'Odstrániť účet',
      contentClass: 'max-w-sm',
      modal: true,
    },
    onClose: (opt: any) => {
      if (opt.data) {
        router.push({ name: 'index' })
      }
    }
  })
}

</script>

<template>
  <panel>
    <div class="p-4 xs:p-6 md:p-10">
      <div class="mb-2 text-lg">
        Odstrániť účet
      </div>
      <p class="mb-1 opacity-70 text-sm">
        Tým, že odstránite tento účet, vymažete všetky s ním spojené údaje natrvalo.
        Toto zahrňuje požiadavky, ponuky, data obrázkov, recenzie, galériu a všetky ostatné údaje.
      </p>
      <p class="mb-3.5 opacity-70 text-sm">
        Prosím, mali by ste vedieť, že ak sa rozhodnete pokračovať, údaje nebudú možné obnoviť.
        Ak sa chystáte na tento krok, kliknite na tlačidlo nižšie a potvrďte odstránenie v ďalšom dialógu.
        Čo i len najmenšie pochybnosti by mali byť dôvodom prehodnotiť tento krok.
      </p>
      <button @click="removeAccountModal" type="button" class="form-danger-button">
        <i class="fa-solid fa-ban me-1.5"></i>
        Odstrániť účet
      </button>
    </div>
  </panel>
</template>