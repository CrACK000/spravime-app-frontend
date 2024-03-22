import {inject} from "vue"
import axios from "axios"
import {useToast} from "primevue/usetoast"
import router from "@/router"

export async function logout() {

    const auth = inject<Auth>('auth')
    const toast = useToast()

    await axios.get(`${import.meta.env.VITE_BACKEND}/auth/logout`, { withCredentials: true })
        .then(response => {
            if (response.data.success) {

                localStorage.removeItem('token')

                if (auth) {
                    auth.loggedIn.value = false
                    auth.userData.value = null
                    auth.newMsgCount.value = 0
                }

                toast.add({severity: 'info', summary: 'Účet', detail: 'Si odhlásený !', group: 'br', life: 3000})

                router.push({name: 'index'})

            }   else {
                router.push({name: 'index'})
                console.log('Failed to logout user')
            }
        })
}