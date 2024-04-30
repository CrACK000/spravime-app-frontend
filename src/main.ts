import { createApp } from 'vue'
import { createMetaManager } from "vue-meta"
import { useAuth } from '@/plugins/auth'
import axios from 'axios'
import router from '@/router'
import * as Sentry from "@sentry/vue"

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
app.use(PrimeVue)
app.use(createMetaManager())

/*
Sentry.init({
    app,
    dsn: import.meta.env.VITE_SENTRY_DNS,
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
            maskAllText: false,
            blockAllMedia: false,
        }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/spravi\.me/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});*/

app.use(router)
app.mount('#app')
