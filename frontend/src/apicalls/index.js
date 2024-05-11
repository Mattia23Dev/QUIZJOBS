import axios from 'axios'
//WORDPRESS TOKEN   SKILLTEST2024

const axiosInstance = axios.create({
    //baseURL: 'http://localhost:5000',
    baseURL: 'https://quizjobs-production.up.railway.app',
    headers: {
       'authorization': `Bearer ${localStorage.getItem('token')}`
    }
})

export const fetchJWTToken = async () => {
    const credentials = {
      username: 'user03170545353762',
      password: 'SKILLTEST@@@'
    };
  
    try {
      const response = await axios.post(
        'https://skillstest.it/wp-json/jwt-auth/v1/token',
        credentials
      );
  
      const { token } = response.data;
      console.log('Token JWT ottenuto:', token);
      return token;
    } catch (error) {
      console.error('Errore durante il recupero del token JWT:', error);
      throw error;
    }
  };

export default axiosInstance