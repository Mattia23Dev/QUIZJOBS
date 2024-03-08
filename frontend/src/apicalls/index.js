import axios from 'axios'

const axiosInstance = axios.create({
    //baseURL: 'http://localhost:5000',
    baseURL: 'https://quizjobs-production.up.railway.app',
    headers: {
       'authorization': `Bearer ${localStorage.getItem('token')}`
    }
})

export default axiosInstance