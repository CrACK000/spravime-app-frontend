import axios from 'axios'
import Cookies from "js-cookie"

async function add(collection: string, id: string): Promise<void> {

    const formData = { collection, id }

    let get = Cookies.get(String(id))

    if (!get) {
        await axios.post(`${import.meta.env.VITE_BACKEND}/counter/views`, formData, { withCredentials: true })
            .then(response => {
                Cookies.set(String(id), 'seen', { expires: 10/1440 }) // 10 min.
            })
            .catch(error => {
                console.error('[Error Counter]', error)
            })
    }

}

const counter = {
    add
}

export default counter