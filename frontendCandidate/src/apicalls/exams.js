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