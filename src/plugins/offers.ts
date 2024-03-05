import { reactive } from 'vue';
import axios from 'axios';

export interface StoreState {
    offers: Offer[];
    offers_loading: boolean;

    offer: Offer | null;
    offer_loading: boolean;
}

const state: StoreState = reactive({
    offers: [],
    offers_loading: true,

    offer: null,
    offer_loading: true,
})

async function fetchOffers(): Promise<void> {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND}/offers`, { withCredentials: true })
    state.offers = response.data
    state.offers_loading = false
}

async function loadOffer(id: number): Promise<void> {
    state.offer_loading = true
    const response = await axios.get(`${import.meta.env.VITE_BACKEND}/offers/${id}`, { withCredentials: true })
    state.offer = response.data
    state.offer_loading = false
}

const store = {
    state,
    fetchOffers,
    loadOffer
};

export default store;