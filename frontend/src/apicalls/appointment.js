import axiosInstance from ".";

export const saveAppointment = async(payload) => {
    try{
        const response = await axiosInstance.post(`/api/app/addAppointment`,payload)
        return response.data
    }
    catch(error){
        return error.response
    }
}

export const getAppointmentUser = async(id) => {
    try{
        const response = await axiosInstance.get(`/api/app/appointments/${id}`)
        return response.data
    }
    catch(error){
        return error.response
    }
}

export const deleteAppointmentUser = async(id) => {
    try{
        const response = await axiosInstance.post(`/api/app/deleteAppointment/${id}`)
        return response.data
    }
    catch(error){
        return error.response
    }
}

export const updateAppointmentUser = async(id, payload) => {
    try{
        const response = await axiosInstance.post(`/api/app/updateAppointment/${id}`, payload)
        return response.data
    }
    catch(error){
        return error.response
    }
}