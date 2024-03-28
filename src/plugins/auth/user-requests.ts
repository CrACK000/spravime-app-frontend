import { reactive } from 'vue'
import axios from 'axios'

interface RequestStore {
    requests: Request[]
    requests_loading: boolean
}

const data: RequestStore = reactive({
    requests: [],
    requests_loading: true,
})

async function all(): Promise<void> {
    data.requests_loading = true
    const response = await axios.post(`${import.meta.env.VITE_BACKEND}/auth/requests`, {}, { withCredentials: true })
    data.requests = response.data
    data.requests_loading = false
}

const userRequests = {
    data,
    all
}

export default userRequests