import axiosInstance from ".";

export const getExamActiveByUser = async(id) => {
    try{
       const response = await axiosInstance.get(`/api/candidate/getExamActiveById/${id}`)
       return response.data
    }
    catch(error){
        return error.response.data
    }
}

export const addCandidateToTest = async(payload) => {
    try {
        const response = await axiosInstance.post('/api/candidate/addCandidateToTest', payload)
        return response.data
    } catch (error) {
        return error.response.data
    }
}

export const saveTestProgress = async (payload) => {
    try {
      const response = await axiosInstance.put('/api/exams/save-test-progress', payload);
      return response.data
    } catch (error) {
      return error
    }
  };

  export const getExamById = async(id) => {
    try{
       const response = await axiosInstance.get(`/api/exams/getExamById/${id}`)
       return response.data
    }
    catch(error){
        return error.response.data
    }
}