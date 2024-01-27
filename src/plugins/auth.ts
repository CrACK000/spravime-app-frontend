import {ref} from 'vue'
import type {ComputedRef} from 'vue'
import type {User} from '@/types/users'
import axios from 'axios'
import { settings } from "@/plugins/config"

interface Auth {
    loggedIn: ComputedRef<boolean>;
    user: ComputedRef<User | null>;
    checkAuth: () => Promise<void>;
}

export default function useAuth(): Auth {
    const user = ref<User | null>(null);
    const loggedIn = ref(false);

    const checkAuth = async () => {
        try {
            const response = await axios.get(settings.backend + '/api/check-auth', { withCredentials: true });

            if (response.data.loggedIn) {
                loggedIn.value = true;
                user.value = response.data.user;
            } else {
                loggedIn.value = false;
                user.value = null;
            }

            console.log('User after checkAuth:', user.value);
        }
        catch(error) {
            console.error("Error checking auth:", error);
        }
    };

    return <Auth>{
        loggedIn: loggedIn,
        user: user,
        checkAuth
    }
};