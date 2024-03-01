import axios from "axios";
import {settings} from "@/plugins/config";
import type {User} from "@/types/users";
import {reactive} from "vue";

export interface StoreState {
    top_profiles: User[];
    loading_top_profiles: boolean;
}

const data: StoreState = reactive({
    top_profiles: [],
    loading_top_profiles: true,
});

async function fetchTopProfiles(): Promise<void> {
    data.loading_top_profiles = true
    const response = await axios.get(`${settings.backend}/api/top-profiles`, { withCredentials: true })
    data.top_profiles = response.data
    data.loading_top_profiles = false
}

const panel = {
    data,
    fetchTopProfiles
};

export default panel;