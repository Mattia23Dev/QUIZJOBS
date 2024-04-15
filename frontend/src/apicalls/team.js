import axiosInstance from ".";

export const registerTeam = async(payload) => {
    try{
      const response = await axiosInstance.post('/api/team/createTeam',payload);
      return response.data
    }
    catch(error){
      return error.response.data
    }
}

export const deleteTeam = async(payload) => {
    try{
      const response = await axiosInstance.post('/api/team/deleteTeam',payload);
      return response.data
    }
    catch(error){
      return error.response.data
    }
}

export const updateTeam = async(payload, id) => {
    try{
      const response = await axiosInstance.post(`/api/team/updateTeam/${id}`,payload);
      return response.data
    }
    catch(error){
      return error.response.data
    }
}

export const getTeamById = async(id) => {
    try{
       const response = await axiosInstance.get(`/api/team/getTeam/${id}`)
       return response.data
    }
    catch(error){
        return error.response.data
    }
}