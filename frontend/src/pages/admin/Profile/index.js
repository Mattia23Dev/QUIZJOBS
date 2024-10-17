import React, { useRef, useState } from "react";
import PageTitle from "../../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import "./index.css";
import { updateUserData } from "../../../apicalls/users";
import { SetUser } from "../../../redux/usersSlice";
import axios from "axios";
import edit from "../../../imgs/edit.png";
// import { fetchJWTToken } from "../../../apicalls";

function Profile() {
  const [selectedMenu, setSelectedMenu] = useState("datiPersonali");
  const user = useSelector((state) => state.users.user);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(user);
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const fileInputRef = useRef(null);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };
  const handleImageChange = async (event) => {
    setNewProfileImage(event.target.files[0]);
    setIsDataUpdated(true);
  };
  const handleUpdateUser = async (e) => {
    try {
      e.preventDefault();
      let profileImage;
      if (newProfileImage) {
        profileImage = await uploadImageToServer();
      }

      const response = await updateUserData(
        profileImage ? { ...userData, profileImage } : userData,
        user._id
      );
      dispatch(SetUser(response.user));
      message.success("Profilo aggiornato!");
      setIsDataUpdated(false);
    } catch (error) {
      message.error(error?.response?.data?.message ?? error?.message);
    }
  };

  // const uploadImageToWordPress = async (imageFile) => {
  //   const token = await fetchJWTToken();
  //   try {
  //     const formData = new FormData();
  //     formData.append("file", imageFile);

  //     const response = await axios.post(
  //       "https://skillstest.it/wp-json/wp/v2/media",
  //       //'https://skillstest.it/wp-json/jwt-auth/v1/token?username=user03170545353762&password=MAD7389gva@@@',
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     console.log("Immagine caricata con successo:", response.data.source_url);
  //     await uploadImageToServer(imageFile, response.data.source_url);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Errore durante il caricamento dell'immagine:", error);
  //     throw error;
  //   }
  // };

  const uploadImageToServer = async () => {
    try {
      const formData = new FormData();
      formData.append("image", newProfileImage);
      // formData.append("imageUrl", imageUrl);

      const response = await axios.post(
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
      if (!response.data?.imageUrl) {
        throw new Error("Unexpected error while uploading image, Try again.");
      }
      return response.data?.imageUrl;
    } catch (error) {
      message.error(error?.response?.data?.message ?? error?.message);
    }
  };

  const handleInputOnChange = (e) => {
    const { name, value } = e.target;
    setUserData((pre) => ({ ...pre, [name]: value }));
    setIsDataUpdated(true);
  };

  const handleEditImage = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div className="home-content">
      <PageTitle title={"Profilo"} />
      <div className="profile">
        <div>
          <img
            className="edit-profileimg"
            alt="edit profile image"
            src={edit}
            onClick={handleEditImage}
          />
          <div className="profile-image-container">
            {newProfileImage ? (
              <img src={URL?.createObjectURL(newProfileImage)} alt="Profile" />
            ) : userData?.profileImage ? (
              <img src={userData?.profileImage} alt="Profile" />
            ) : (
              <label
                onClick={handleEditImage}
                htmlFor="profile-image-upload"
                className="profile-image-placeholder"
              >
                <p className="plus-icon">+</p>
              </label>
            )}
            <input
              ref={fileInputRef}
              hidden
              type="file"
              id="profile-image-upload"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div
            style={{ marginTop: "20px", marginBottom: "10px" }}
            className={`menu-item ${
              selectedMenu === "datiPersonali" ? "active" : ""
            }`}
            onClick={() => handleMenuClick("datiPersonali")}
          >
            Dati
          </div>
          <div
            className={`menu-item ${
              selectedMenu === "pagamenti" ? "active" : ""
            }`}
            onClick={() => handleMenuClick("pagamenti")}
          >
            Pagamenti
          </div>
        </div>
        <div>
          {selectedMenu === "datiPersonali" && (
            <form onSubmit={handleUpdateUser}>
              {isDataUpdated ? (
                <button
                  type="submit"
                  onClick={handleUpdateUser}
                  className="primary-outlined-btn"
                >
                  Salva
                </button>
              ) : (
                ""
              )}
              <h2>Dati Personali</h2>
              <div className="profile-inputs-container">
                {/* First Name  */}
                <div>
                  <label htmlFor="first-name">First Name</label>
                  <input
                    name="fName"
                    id="first-name"
                    type="text"
                    required
                    value={userData?.fName ? userData.fName : ""}
                    onChange={handleInputOnChange}
                  />
                </div>

                {/* First Name  */}
                <div>
                  <label htmlFor="last-name">Last Name</label>
                  <input
                    name="lName"
                    id="last-name"
                    type="text"
                    required
                    value={userData?.lName ? userData.lName : ""}
                    onChange={handleInputOnChange}
                  />
                </div>

                <div>
                  <label htmlFor="job-title">Job Title</label>
                  <input
                    name="jobTitle"
                    id="job-title"
                    type="text"
                    value={userData?.jobTitle ? userData.jobTitle : ""}
                    onChange={handleInputOnChange}
                  />
                </div>
                <div>
                  <label htmlFor="company-name">
                    Nome azienda {"    "} (optional)
                  </label>
                  <input
                    name="companyName"
                    id="company-name"
                    type="text"
                    value={userData?.companyName ? userData.companyName : ""}
                    onChange={handleInputOnChange}
                  />
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    name="email"
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={userData?.email ? userData.email : ""}
                    onChange={handleInputOnChange}
                  />
                </div>
                <div>
                  <label htmlFor="partitaIva">Partita Iva</label>
                  <input
                    type="text"
                    id="partitaIva"
                    name="partitaIva"
                    value={userData?.partitaIva ? userData.partitaIva : ""}
                    onChange={handleInputOnChange}
                  />
                </div>
                <div>
                  <label htmlFor="address">Indirizzo</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={userData?.address ? userData.address : ""}
                    onChange={handleInputOnChange}
                  />
                </div>
                <div>
                  <label htmlFor="sdi-code">Codice SDI</label>
                  <input
                    type="text"
                    id="sdi-code"
                    name="codeSdi"
                    value={userData?.codeSdi ? userData.codeSdi : ""}
                    onChange={handleInputOnChange}
                  />
                </div>
              </div>
            </form>
          )}
          {selectedMenu === "pagamenti" && (
            <div>
              <h2>Pagamenti</h2>
              <button className="primary-outlined-btn">Carta salvata</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
