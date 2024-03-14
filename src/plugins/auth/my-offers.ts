import { reactive } from 'vue'
import axios from 'axios'

interface OfferStore {
    offers: Offer[]
    offers_loading: boolean
}

const data: OfferStore = reactive({
    offers: [],
    offers_loading: true,
})

async function all(): Promise<void> {
    data.offers_loading = true
    const response = await axios.post(`${import.meta.env.VITE_BACKEND}/auth/offers`, {}, { withCredentials: true })
    data.offers = response.data
    data.offers_loading = false
}

const myOffer = {
    data,
    all
}

export default myOffer