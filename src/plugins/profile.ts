import { reactive } from 'vue';
import axios from 'axios';

export interface StoreState {
    data: User | null;
    gallery: UserGallery[];
    reviews: Reviews[];
    loading: boolean;
    loading_gallery: boolean;
    loading_reviews: boolean;
}

const user: StoreState = reactive({
    data: null,
    gallery: [],
    reviews: [],
    loading: true,
    loading_gallery: true,
    loading_reviews: true,
});

async function useUser(id: string): Promise<void> {
    user.loading = true
    const response = await axios.get(`${import.meta.env.VITE_BACKEND}/profile/${id}`, { withCredentials: true })
    user.data = response.data
    user.loading = false
}

async function useUserReviews(key: string): Promise<void> {
    user.loading_reviews = true
    const response = await axios.get(`${import.meta.env.VITE_BACKEND}/reviews/${key}/all`, { withCredentials: true })
    user.reviews = response.data
    user.loading_reviews = false
}

const profile = {
    user,
    useUser,
    useUserReviews,
};

export default profile;