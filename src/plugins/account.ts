import { reactive } from 'vue'
import axios from 'axios'

interface AccountStore {
    accounts: User[];
    accounts_loading: boolean;
}

const data: AccountStore = reactive({
    accounts: [],
    accounts_loading: true,
})

async function all(): Promise<void> {
    data.accounts_loading = true
    const response = await axios.get(`${import.meta.env.VITE_BACKEND}/accounts`, { withCredentials: true })
    data.accounts = response.data
    data.accounts_loading = false
}

const account = {
    data,
    all
}

export default account