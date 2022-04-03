import axios from 'axios';

export const API_URL="http://localhost:5000/api"

const $api = axios.create({
    withCredentials:true,
    baseURL: API_URL,
})

$api.interceptors.request.use((config) =>{
    config.headers.authorization = `Bearer ${localStorage.getItem('AccessJwt')}`
    return config;
})

$api.interceptors.response.use((config) => {return config}, async (error) => {

    const originalRequest = error.config;

    if (error.response.status === 400) {
        return {err:400, message:error.response.data.message}
    }

    if (error.response.status === 403) {
        return {err:403, message:error.response.data.message}
    }

    if (error.response.status === 500) {
        return {err:500, message:error.response.data.message}
    }

    if (error.response.status === 401 && error.config && !error.config._isRerty) {
        try {
            originalRequest._isRerty= true;
            const response = await axios.get(`${API_URL}/refresh`, {withCredentials:true})
            localStorage.setItem('AccessJwt', response.data.accessToken);
            return $api.request(originalRequest);
        }catch (e) {
            return {err:401, message:error.response.data.message}
        }
    }
    throw error;
})


export default $api;