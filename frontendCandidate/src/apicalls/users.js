import axiosInstance from ".";

export const registerUser = async(payload) => {
    try{
      const response = await axiosInstance.post('/api/users/register',payload);
      return response.data
    }
    catch(error){
      return error.response.data
    }
}

export const loginUser = async(payload) => {
    try{
      const response = await axiosInstance.post('/api/users/login',payload);
      return response.data
    }
    catch(error){
      return error.response.data
    }
}

export const loginCandidate = async(payload) => {
  try{
    const response = await axiosInstance.post('/api/candidate/loginCandidate',payload);
    return response.data
  }
  catch(error){
    return error.response.data
  }
}

export const googleLogin = async(payload) => {
  try {
    const response = await axiosInstance.post('/api/users/google-login',payload);
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const getUserInfoCandidate = async() => {
  try{
    const response = await axiosInstance.post('/api/candidate/get-user-info-candidate')
    return response.data
  }
  catch(error){
    return error.response.data
  }
}

export const getUserInfo = async() => {
  try{
    const response = await axiosInstance.post('/api/candidate/get-user-info')
    return response.data
  }
  catch(error){
    return error.response.data
  }
}

export const getUserInfoById = async(id) => {
  try{
    const response = await axiosInstance.get(`/api/candidate/getUserById/${id}`)
    return response.data
  }
  catch(error){
    return error.response.data
  }
}

export const sendHelpEmail = async(payload) => {
  try{
    const response = await axiosInstance.post('/api/users/sendHelpEmail', payload)
    return response.data
  }
  catch(error){
    return error.response.data
  }
}

export const updateUserData = async(payload,id) => {
  try{
      const response = await axiosInstance.post(`/api/users/update/${id}`,payload)
      return response.data
  }
  catch(error){
      return error.response.data
  }
}

export const registerCandidate = async(payload) => {
  try{
      const response = await axiosInstance.post(`/api/candidate/registerCandidate`,payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
  }
  catch(error){
      return error.response.data
  }
}

export const getCandidateTest = async(payload) => {
  try{
    const response = await axiosInstance.post('/api/candidate/getCandidateTestPopulate', payload)
    return response.data
  }
  catch(error){
    return error.response.data
  }
}