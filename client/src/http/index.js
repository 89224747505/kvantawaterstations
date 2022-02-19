import axios from 'axios';

export const API_URL="http://localhost:5000/api"

const $api = axios.create({
    withCredentials:true,
    baseURL: API_URL,
})

$api.interceptors.request.use((config) =>{
    config.headers.authorization = `Bearer ${localStorage.getItem('jwt')}`
    return config;
})

$api.interceptors.response.use((config) => {return config}, async (error) => {

    const originalRequest = error.config;

    if (error.response.status === 401) {
        try {
            const response = await axios.get(`${API_URL}/refresh`, {withCredentials:true})
            console.log(response);
            localStorage.setItem('jwt', response.data.accessToken);
            return $api.request(originalRequest);
        }catch (e){
            console.log("Не авторизован!");
        }
    }
})


export default $api;