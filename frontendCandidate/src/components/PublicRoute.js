import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './navbar/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { HideLoading, ShowLoading } from '../redux/loaderSlice';
import { message } from 'antd';
import { SetUser } from '../redux/usersSlice';
import { getUserInfoCandidate } from '../apicalls/users';

function PublicRoute({children, loginPopup, registerPopup, setLoginPopup, setRegisterPopup}) {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const user = useSelector(state=>state.users.user)
  const getUserData = async() => {
    try{
      dispatch(ShowLoading())
      const token = localStorage.getItem('token');
      let response = await getUserInfoCandidate();
      dispatch(HideLoading())
      if(response.success){
        message.success(response.message)
        dispatch(SetUser(response.data))
      }
      else{
        dispatch(HideLoading())
        message.error(response.message)
      }
    }
    catch(error){
      console.error(error)
        message.error(error.message)
    }
  }
  useEffect(()=> {
    if(localStorage.getItem('token')){
        if(!user){
            getUserData();
        }
    }
  },[])
  return (
    <div className='public-layout'>
        <Navbar user={user} setRegisterPopup={setRegisterPopup} setLoginPopup={setLoginPopup} loginPopup={loginPopup} registerPopup={registerPopup} />
        {children}
    </div>
  )
}

export default PublicRoute