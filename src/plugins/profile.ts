import { reactive } from 'vue'
import axios from 'axios'

export interface UserStore {
    user: User | null;
    user_loading: boolean;

    reviews: Review[];
    reviews_loading: boolean;
}

const data: UserStore = reactive({
    user: null,
    user_loading: true,

    reviews: [],
    reviews_loading: true,
})

async function profile(id: string): Promise<void> {
    data.user_loading = true
    const response = await axios.get(`${import.meta.env.VITE_BACKEND}/profile/${id}`, { withCredentials: true })
    data.user = response.data
    data.user_loading = false
}

async function profileReviews(key: string): Promise<void> {
    data.reviews_loading = true
    const response = await axios.get(`${import.meta.env.VITE_BACKEND}/reviews/${key}/all`, { withCredentials: true })
    data.reviews = response.data
    data.reviews_loading = false
}

const user = {
    data,
    profile,
    profileReviews,
}

export default user