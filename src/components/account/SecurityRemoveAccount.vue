<script setup lang="ts">
import Panel from "@/components/Panel.vue";
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";
import {ref} from "vue";
import axios from "axios";
import {settings} from "@/plugins/config";

const toast = useToast()
const router = useRouter()

const check_password = ref<string>('')

const removeAccount = () => {
  axios.post(`${settings.backend}/api/security/remove-account`, { password: check_password.value, }, { withCredentials: true })
    .then(response => {
      if (response.data.success) {
        toast.add({severity: 'warn', summary: 'Účet', detail: 'Váš účet a všetky data spojené účtom boli odstránené. !', group: 'br', life: 3000})
        router.push({ name: 'index' })
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
      <p class="mb-5">
        <input type="password" class="input" v-model="check_password" placeholder="heslo"/>
      </p>
      <button @click="removeAccount" type="button" class="form-danger-button">
        <i class="fa-solid fa-ban me-1.5"></i>
        Odstrániť účet
      </button>
    </div>
  </panel>
</template>

<style scoped>

</style>