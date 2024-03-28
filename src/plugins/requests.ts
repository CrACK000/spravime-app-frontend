import { reactive } from 'vue'
import axios from 'axios'

interface RequestStore {
    requests: Request[]
    requests_loading: boolean

    request: Request | null
    request_loading: boolean
}

const data: RequestStore = reactive({
    requests: [],
    requests_loading: true,

    request: null,
    request_loading: true,
})

async function all(): Promise<void> {
    data.requests_loading = true
    const response = await axios.get(`${import.meta.env.VITE_BACKEND}/requests`, { withCredentials: true })
    data.requests = response.data
    data.requests_loading = false
}

async function view(id: string): Promise<void> {
    data.request_loading = true
    const response = await axios.get(`${import.meta.env.VITE_BACKEND}/requests/${id}`, { withCredentials: true })
    data.request = response.data
    data.request_loading = false
}

const request = {
    data,
    all,
    view
}

export default request