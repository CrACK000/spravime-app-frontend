import axios from 'axios';
import Cookies from 'js-cookie';
import { settings } from '@/plugins/config';

type CounterType = 'profile' | 'offer';
type CounterConfig = {
    cookie: string;
    apiUrl: string;
    dataKey: string;
};

const countersConfig: Record<CounterType, CounterConfig> = {
    'profile': {
        cookie: 'profileViews',
        apiUrl: '/api/profile/counter',
        dataKey: 'user_id'
    },
    'offer': {
        cookie: 'offerViews',
        apiUrl: '/api/offers/counter',
        dataKey: 'offer_id'
    },
};

const checkAndIncrementCounter = (counterType: CounterType, dataKey: number) => {
    const counterConfig = countersConfig[counterType];

    const checkCookie = () => {
        const views = JSON.parse(Cookies.get(counterConfig.cookie) || '[]')
        if (!views.includes(dataKey.toString())) {
            incrementCounter().then(r => console.log(r))
        }
    }

    const incrementCounter = async () => {
        const currentViewsInCookies = JSON.parse(
            Cookies.get(counterConfig.cookie) || '[]'
        )
        try {
            const postData = { [counterConfig.dataKey]: dataKey };
            const response = await axios.post(`${settings.backend}${counterConfig.apiUrl}`, postData, { withCredentials: true })
            if (response.data.status) {
                currentViewsInCookies.push(dataKey.toString())
                Cookies.set(counterConfig.cookie, JSON.stringify(currentViewsInCookies), { expires: 1 / 144 })
            } else {
                console.log(response.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    checkCookie();
}

export default checkAndIncrementCounter;