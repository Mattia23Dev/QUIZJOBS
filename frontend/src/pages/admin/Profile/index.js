import React, {useState} from 'react'
import PageTitle from '../../../components/PageTitle'
import {useDispatch, useSelector} from 'react-redux'
import {message} from 'antd'
import './index.css'
import { updateUserData } from '../../../apicalls/users';
import { SetUser } from '../../../redux/usersSlice'
import axios from 'axios'
import edit from '../../../imgs/edit.png'
import { fetchJWTToken } from '../../../apicalls'

function Profile() {
    const [selectedMenu, setSelectedMenu] = useState('datiPersonali');
    const user = useSelector(state=>state.users.user)
    const [editImg, setEditImg] = useState(false)
    const dispatch = useDispatch()
    const [userData, setUserData] = useState(user)
    const handleMenuClick = (menu) => {
      setSelectedMenu(menu);
    };
    const handleImageUpload = async (event) => {
        const imageFile = event.target.files[0];
        await uploadImageToWordPress(imageFile);
      };
    const handleUpdateUser = async () => {
        console.log(userData)
        if (!userData.address || !userData.codeSdi || !userData.companyName){
            window.alert('Inserisci tutti i dati')
            return
        }
        try {
          const response = await updateUserData(userData,user._id)
          console.log(response)
          if (response.success){
            dispatch(SetUser(response.user));
            message.success("Profilo aggiornato!")
          }  
        } catch (error) {
            console.error(error)
        }
    }
    const uploadImageToWordPress = async (imageFile) => {
      const token = await fetchJWTToken()
      try {
        const formData = new FormData();
        formData.append('file', imageFile);
    
        const response = await axios.post(
          'https://skillstest.it/wp-json/wp/v2/media',
          //'https://skillstest.it/wp-json/jwt-auth/v1/token?username=user03170545353762&password=MAD7389gva@@@',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'authorization': `Bearer ${token}`
            },
          }
        );
    
        console.log('Immagine caricata con successo:', response.data.source_url);
        await uploadImageToServer(imageFile, response.data.source_url);
        return response.data;
      } catch (error) {
        console.error('Errore durante il caricamento dell\'immagine:', error);
        throw error;
      }
    };
    const uploadImageToServer = async (imageFile, imageUrl) => {
        try {
          const formData = new FormData();
          formData.append('image', imageFile);
          formData.append('imageUrl', imageUrl);
      
          const response = await axios.post('https://quizjobs-production.up.railway.app/api/upload-image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
      
          setUserData({...userData, profileImage: imageUrl});
          setEditImg(false)
        } catch (error) {
          console.error('Errore durante il caricamento dell\'immagine:', error);
        }
      };
  return (
    <div className='home-content'>
        <PageTitle title={"Profilo"} />
        <div className='profile'>
        <div>
            <img onClick={() => setEditImg(!editImg)} className='edit-profileimg' alt='edit profile image' src={edit} />
            <div className="profile-image-container">
                {userData?.profileImage && editImg === false
                 ? (
                <img src={userData?.profileImage} alt="Profile" />
                ) : (
              <label htmlFor="profile-image-upload" className="profile-image-placeholder">
                <p className='plus-icon'>+</p>
                <input hidden type="file" id="profile-image-upload" accept="image/*" onChange={handleImageUpload} />
              </label>
            )}
          </div>
          <div
          style={{marginTop: '20px'}}
            className={`menu-item ${selectedMenu === 'datiPersonali' ? 'active' : ''}`}
            onClick={() => handleMenuClick('datiPersonali')}
          >
            Dati
          </div>
          <div
            className={`menu-item ${selectedMenu === 'pagamenti' ? 'active' : ''}`}
            onClick={() => handleMenuClick('pagamenti')}
          >
            Pagamenti
          </div>
        </div>
        <div>
          {selectedMenu === 'datiPersonali' && (
            <div>
              {userData !== user && <button onClick={handleUpdateUser} className='primary-outlined-btn'>Salva</button>}
              <h2>Dati Personali</h2>
              <div>
                <div>
                    <label>Nome</label>
                    <input value={userData?.name ? userData.name : ""} onChange={(e) => setUserData({...userData, name: e.target.value})} />
                </div>
                <div>
                    <label>Nome azienda</label>
                    <input value={userData?.companyName ? userData.companyName : ""} onChange={(e) => setUserData({...userData, companyName: e.target.value})} />
                </div>
                <div>
                    <label>Email</label>
                    <input value={userData?.email ? userData.email : ""} onChange={(e) => setUserData({...userData, email: e.target.value})} />
                </div>
                <div>
                    <label>Partita Iva</label>
                    <input value={userData?.partitaIva ? userData.partitaIva : ""} onChange={(e) => setUserData({...userData, partitaIva: e.target.value})} />
                </div>
                <div>
                    <label>Indirizzo</label>
                    <input value={userData?.address ? userData.address : ""} onChange={(e) => setUserData({...userData, address: e.target.value})} />
                </div>
                <div>
                    <label>Codice SDI</label>
                    <input value={userData?.codeSdi ? userData.codeSdi : ""} onChange={(e) => setUserData({...userData, codeSdi: e.target.value})} />
                </div>
              </div>
            </div>
          )}
          {selectedMenu === 'pagamenti' && (
            <div>
              <h2>Pagamenti</h2>
              <button className='primary-outlined-btn'>Carta salvata</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile