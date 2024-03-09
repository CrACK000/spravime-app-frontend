import { reactive } from 'vue'
import axios from 'axios'

interface MessagesStore {
    containers: MessagesContainer[]
    containers_loading: boolean
    container: MessagesContainer
    container_loading: boolean
}

const data: MessagesStore = reactive({
    containers: [],
    containers_loading: true,
    container: Object(),
    container_loading: true,
})

async function fetchAccounts(): Promise<void> {

    data.containers_loading = true

    await axios.post(`${import.meta.env.VITE_BACKEND}/auth/messages/accounts`, {}, { withCredentials: true })
        .then(response => {
            data.containers = response.data
        })
        .finally(() => {
            data.containers_loading = false
        })
}

async function isRead(container: string) {

    await axios.post(`${import.meta.env.VITE_BACKEND}/auth/messages/read`, { container: container }, { withCredentials: true })
        .then(response => {
            return !!response.data.success
        }).catch(error => {
            return false
        })
}

async function selectContainer(container: string): Promise<void> {

    data.container_loading = true

    await axios.post(`${import.meta.env.VITE_BACKEND}/auth/messages`, { container: container }, { withCredentials: true })
        .then(response => {
            data.container = response.data
        })
        .finally(() => {
            data.container_loading = false
        })

}

const msg = {
    data,
    fetchAccounts,
    isRead,
    selectContainer,
}

export default msg