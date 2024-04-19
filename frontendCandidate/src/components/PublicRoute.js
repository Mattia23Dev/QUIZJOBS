import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './navbar/Navbar';

function PublicRoute({children, loginPopup, registerPopup, setLoginPopup, setRegisterPopup}) {
  const navigate = useNavigate();
  useEffect(()=>{
   if(localStorage.getItem('token')){
    navigate('/user/home');
   }
  },[])
  return (
    <div className='public-layout'>
        <Navbar setRegisterPopup={setRegisterPopup} setLoginPopup={setLoginPopup} loginPopup={loginPopup} registerPopup={registerPopup} />
        {children}
    </div>
  )
}

export default PublicRoute