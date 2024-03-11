<script setup lang="ts">
import {useRouter} from "vue-router"
import {useDialog} from "primevue/usedialog"
import Panel from "@/components/Panel.vue"
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
      <p class="mb-3.5 opacity-70 text-sm">
        Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled.
      </p>
      <button @click="removeAccountModal" type="button" class="form-danger-button">
        <i class="fa-solid fa-ban me-1.5"></i>
        Odstrániť účet
      </button>
    </div>
  </panel>
</template>