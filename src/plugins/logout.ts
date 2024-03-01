import { onMounted, inject, ref } from 'vue'
import axios from 'axios'
import router from '@/router'
import { settings } from "@/plugins/config"
import type {Auth, User} from "@/types/users";
import {useToast} from "primevue/usetoast";

export default {
    name: 'Logout',
    setup() {
        const toast = useToast()
        const auth = inject<Auth>('auth');
        const user = ref(auth?.user as User | null)
        const loggedIn = ref(auth?.loggedIn as boolean)

        const logout = async () => {
            try {
                const response = await axios.get(settings.backend + '/api/logout', { withCredentials: true });
                if (response.data.success) {
                    await router.push({name: 'index'});
                    loggedIn.value = false;
                    user.value = null;
                    toast.add({severity: 'info', summary: 'Účet', detail: 'Si odhlásený !', group: 'br', life: 3000})
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