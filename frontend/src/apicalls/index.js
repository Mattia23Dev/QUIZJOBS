import axios from "axios";
//WORDPRESS TOKEN   SKILLTEST2024

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  // baseURL: 'https://quizjobs-production.up.railway.app',
  // baseURL: 'http://skilltest.sketchanimators.com',
  headers: {
    authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const fetchJWTToken = async () => {
  const credentials = {
    username: "user03170545353762",
    password: "SKILLTEST@@@",
  };

  try {
    const response = await axios.post(
      "https://skillstest.it/wp-json/jwt-auth/v1/token",
      credentials
    );

    const { token } = response.data;
    console.log("Token JWT ottenuto:", token);
    return token;
  } catch (error) {
    console.error("Errore durante il recupero del token JWT:", error);
    throw error;
  }
};

export const uploadFileToWordPress = async (file, token) => {
  const formData = new FormData();
  formData.append("file", file);

  return await axios.post(
    "https://skillstest.it/wp-json/wp/v2/media",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const uploadImageToServer = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  return await axios.post(
    // "https://quizjobs-production.up.railway.app/api/upload-image",
    "http://localhost:5000/api/upload-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

// const uploadImageToServer = async () => {
//   try {
//     const formData = new FormData();
//     formData.append("image", newProfileImage);
//     formData.append("imageUrl", imageUrl);

//     const response = await axios.post(
//       "https://quizjobs-production.up.railway.app/api/upload-image",
//       "http://localhost:5000/api/upload-image",
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       }
//     );
//     if (!response.data?.imageUrl) {
//       throw new Error("Unexpected error while uploading image, Try again.");
//     }
//     return response.data?.imageUrl;
//   } catch (error) {
//     message.error(error?.response?.data?.message ?? error?.message);
//   }
// };

export default axiosInstance;
