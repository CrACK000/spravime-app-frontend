import { reactive } from 'vue';
import axios from 'axios';

interface OfferStore {
    offers: Offer[];
    offers_loading: boolean;

    offer: Offer | null;
    offer_loading: boolean;
}

const data: OfferStore = reactive({
    offers: [],
    offers_loading: true,

    offer: null,
    offer_loading: true,
})

async function all(): Promise<void> {
    data.offers_loading = true
    const response = await axios.get(`${import.meta.env.VITE_BACKEND}/offers`, { withCredentials: true })
    data.offers = response.data
    data.offers_loading = false
}

async function view(id: string): Promise<void> {
    data.offer_loading = true
    const response = await axios.get(`${import.meta.env.VITE_BACKEND}/offers/${id}`, { withCredentials: true })
    data.offer = response.data
    data.offer_loading = false
}

const offer = {
    data,
    all,
    view
}

export default offer