import { createApp } from 'vue'
import { createMetaManager } from "vue-meta"
import { useAuth } from '@/plugins/auth'
import axios from 'axios'
import router from '@/router'

// PrimeVue Components
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import StyleClass from 'primevue/styleclass'

import 'flowbite'
import App from '@/views/layouts/App.vue'

let token = localStorage.getItem('token')
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

const app = createApp(App)

app.provide('auth', useAuth())

app.directive('tooltip', Tooltip)
app.directive('styleclass', StyleClass)

app.use(ToastService)
app.use(ConfirmationService)
app.use(DialogService)
app.use(router)
app.use(PrimeVue)
app.use(createMetaManager())

app.mount('#app')
