import { onMounted, inject, ref } from 'vue'
import axios from 'axios'
import router from '@/router'
import { settings } from "@/plugins/config"

export default {
    name: 'Logout',
    setup() {
        const auth = inject<any>('auth');
        const loggedIn = ref(auth.loggedIn);
        const user = ref(auth.user);

        const logout = async () => {
            try {
                const response = await axios.get(settings.backend + '/api/logout', { withCredentials: true });
                if (response.data.success) {
                    await router.push({name: 'index'});
                    loggedIn.value = false;
                    user.value = null;
                } else {
                    await router.push({name: 'index'});
                    console.log('Failed to logout user');
                }
            } catch (error) {
                await router.push({name: 'index'});
                console.error('Error when trying to logout:', error);
            }
        };

        onMounted(logout);

        return {
            loggedIn,
            user
        };
    },
};