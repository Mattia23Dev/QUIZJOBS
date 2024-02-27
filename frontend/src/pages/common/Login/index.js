import React, { useEffect, useState } from 'react'
import {Form, message, Checkbox} from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { googleLogin, loginUser } from '../../../apicalls/users'
import { useDispatch } from 'react-redux'
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice'
import login from '../../../imgs/login.png'
import logo from '../../../imgs/logo.png'
import { FiEye, FiEyeOff } from 'react-icons/fi';
import logobianco from '../../../imgs/logobianco.png'
import { GoogleLogin } from 'react-google-login';
import { gapi } from "gapi-script";
import 'antd/dist/antd.css';

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: "830063440629-j40l5f7lb1fck6ap120s272d49rp1ph6.apps.googleusercontent.com",
        scope: 'email',
      });
    }

    gapi.load('client:auth2', start);
  }, []);
  const onFinish = async(values) => {
    const { acceptTerms } = values; 
  
    if (!acceptTerms) {
      message.error("Devi accettare i termini e le condizioni per procedere.");
      return;
    }
    try{
      dispatch(ShowLoading())
      const response = await loginUser(values)
      dispatch(HideLoading())
      if(response.success){
        message.success(response.message);
        localStorage.setItem("token",response.data)
        window.location.href="/admin/exams";
      }
      else{
        message.error(response.message)
      }
    }
    catch(error){
        dispatch(HideLoading())
        message.error(error.message);
    }
  }
  const responseSuccessGoogle = async (responseG) => {
    const response = await googleLogin({tokenId: responseG.tokenId})
    console.log(response)
    if (response.success){
      localStorage.setItem("token",response.data)
      window.location.href="/admin/exams";
      message.success("Bentornato!");
    } else {
      console.log(response.message);
      message.error("Errore")
    }
  }

  const responseFailGoogle = (response) => {
    console.log(response);
    message('Si è verificato un errore con Google')
  }
  return (
    <div style={{position: 'relative'}} className='flex justify-center items-center h-screen w-screen bg-primary'>
      <img alt='logo skilltest' src={logobianco} className='logo-auth' />
      <div className='auth-img'>
        <img alt='login skilltest' src={login} />
      </div>
     <div className='w-400 p-3 bg-white form-auth'>
       <img alt='login skilltest' src={login} className='auth-img-mobile' />
       <div className='flex flex-col'>
       <h1 className='text-2xl'>
        Welcome back  <i className='ri-login-circle-line'></i>
       </h1>
       <p>Welcome back! Please enter your details</p>
       <Form layout="vertical" className='mt-2' onFinish={onFinish}>
        <Form.Item name='email'>
          <input type="email" placeholder='Email' required/>
        </Form.Item>
        <Form.Item name='password' className="password-input">
          <input type={showPassword ? "text" : "password"} placeholder='Password' required/>
          <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FiEye /> : <FiEyeOff />}
          </span>
        </Form.Item>
        <Form.Item name='terms' valuePropName="checked" className="terms-checkbox">
          <Checkbox required>
            Terms and conditions
          </Checkbox>
        </Form.Item>
        <div className='flex flex-col gap-2'>
        <button type="submit" className='primary-contained-btn mt-2 w-100'>Login</button>
        <Link to="/register" style={{color: '#000', fontSize: '13px', textDecoration: 'underline', textAlign: 'center'}}>
          Don't have an account? Register Here
        </Link>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px',}}>
          <GoogleLogin
              clientId="830063440629-j40l5f7lb1fck6ap120s272d49rp1ph6.apps.googleusercontent.com"
              buttonText="Accedi con Google"
              onSuccess={responseSuccessGoogle}
              onFailure={responseFailGoogle}
              cookiePolicy={'single_host_origin'}
            />
          </div>
       </Form>
       </div>
     </div>
    </div>
  )
}

export default LoginPage