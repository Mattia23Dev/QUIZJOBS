import axiosInstance from ".";

export const registerUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/users/register", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const loginUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/users/login", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const googleLogin = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/users/google-login",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getUserInfo = async () => {
  try {
    const response = await axiosInstance.post("/api/users/get-user-info");
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getTeamInfo = async () => {
  try {
    const response = await axiosInstance.post("/api/users/get-team-info");
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const autenticaGoogleReact = async (code, userId) => {
  console.log(code, userId);
  try {
    const response = await axiosInstance.post(
      `/api/users/completeAuth?code=${code}&id=${userId}`
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getCandidateInfo = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/users/get-candidate-info",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const sendHelpEmail = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/users/sendHelpEmail",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const updateUserData = async (payload, id) => {
  try {
    const response = await axiosInstance.post(
      `/api/users/update/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const AddUserExperience = async (payload) => {
  return await axiosInstance.put(`/api/users/add/experience`, payload);
};
export const UpdateUserExperience = async (payload, id) => {
  return await axiosInstance.put(`/api/users/update/experience/${id}`, payload);
};
export const DeleteUserExperience = async (id) => {
  return await axiosInstance.delete(`/api/users/delete/experience/${id}`);
};

export const SendEmailOtp = async (email) => {
  return await axiosInstance.post(`/api/users/send-email-otp/${email}`);
};

export const VerifyEmailOtp = async (data) => {
  return await axiosInstance.post(`/api/users/verify-email-otp`, data);
};

export const ResetPassword = async (data) => {
  return await axiosInstance.put(`/api/users/reset-password`, data);
};
