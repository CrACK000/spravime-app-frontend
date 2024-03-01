import { reactive } from 'vue';
import axios from 'axios';
import { settings } from '@/plugins/config';
import type {User, UserGallery} from '@/types/users'
import type {Reviews} from "@/types/reviews";

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

async function useUser(id: number): Promise<void> {
    user.loading = true
    const response = await axios.get(`${settings.backend}/api/user/${id}`, { withCredentials: true })
    user.data = response.data
    user.loading = false
}

async function useUserGallery(id: number): Promise<void> {
    user.loading_gallery = true
    const response = await axios.get(`${settings.backend}/api/user/gallery/${id}`, { withCredentials: true })
    user.gallery = response.data
    user.loading_gallery = false
}

async function useUserReviews(id: number): Promise<void> {
    user.loading_reviews = true
    const response = await axios.get(`${settings.backend}/api/reviews/all/${id}`, { withCredentials: true })
    user.reviews = response.data
    user.loading_reviews = false
}

const profile = {
    user,
    useUser,
    useUserGallery,
    useUserReviews,
};

export default profile;