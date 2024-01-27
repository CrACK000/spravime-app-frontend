import axios from 'axios';
import {onMounted} from "vue";
import {settings} from "@/plugins/config";

interface CheckMessagesResponse {
    status: boolean;
    count: number;
}

export async function checkNewMessages(id: number): Promise<number | null> {
    try {
        const response = await axios.get<CheckMessagesResponse>(settings.backend + '/api/messages/check/' + id, { withCredentials: true });

        if (response.data.status) {
            return response.data.count;
        } else {
            console.error('API call was not successful');
            return null;
        }

    } catch (error) {
        console.error('Error while checking new messages', error);
        return null;
    }
}