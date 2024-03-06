import axios from "axios"
import { ref } from "vue"

export function useAuth() {

    const loggedIn = ref<boolean>(false)
    const userData = ref<User | null>(null)
    const loading = ref<boolean>(false)

    const checkAuth = async () => {
        loading.value = true
        await axios.get(`${import.meta.env.VITE_BACKEND}/auth/check-auth`, { withCredentials: true })
            .then(response => {
                loggedIn.value = response.data.loggedIn
                userData.value = response.data.user
            })
            .catch(error => {
                console.error(error)
            })
            .finally(() => {
                loading.value = false
            })
    }

    return {
        loggedIn,
        userData,
        loading,
        checkAuth
    }
}