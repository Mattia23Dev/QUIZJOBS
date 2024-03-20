import React, { useEffect, useState } from 'react'
import { Form, message, Checkbox, Input} from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { googleLogin, registerUser } from '../../../apicalls/users'
import { useDispatch } from 'react-redux'
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice'
import register from '../../../imgs/register.png'
import logo from '../../../imgs/logo.png'
import logobianco from '../../../imgs/logobianco.png'
import { GoogleLogin } from 'react-google-login';
import { gapi } from "gapi-script";
import { FiEye, FiEyeOff } from 'react-icons/fi';

function RegisterPage() {
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
    const onFinish = async (values) => {
      console.log(values)
        try{
          dispatch(ShowLoading())
          const response = await registerUser(values)
          dispatch(HideLoading())
          if(response.success){
            localStorage.setItem("token",response.data)
            window.location.href="/admin/exams";
            message.success("Benvenuto!");
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
        message.error('Si è verificato un errore con Google')
      }
      return (
        <div style={{position: 'relative'}} className='flex justify-center items-center h-screen w-screen bg-primary'>
          <img alt='logo skilltest' src={logobianco} className='logo-auth' />
         <div className='w-400 p-3 bg-white form-auth'>
           <img alt='login skilltest' src={register} className='auth-img-mobile' />
           <div className='flex flex-col'>
           <h1 className='text-2xl'>
           Welcome  <i className='ri-user-add-line'></i>
           </h1>
           <p>Welcome! Please enter your details</p>
           <Form layout="vertical" className='mt-2' onFinish={onFinish}>
           <Form.Item name='name'>
              <input type="text" placeholder='Nome' required/>
            </Form.Item>
            <Form.Item name='companyName'>
              <input type="text" placeholder='Nome Azienda' required/>
            </Form.Item>
            <Form.Item name='partitaIva'>
              <input type="text" placeholder='Partita IVA' required/>
            </Form.Item>
            <Form.Item name='email'>
              <input type="email" placeholder='Email' required/>
            </Form.Item>
            <div className="password-input">
              <Form.Item name='password'>
                <input type={showPassword ? 'text' :'password'} placeholder='Password' required/>
              </Form.Item>
              <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FiEye /> : <FiEyeOff />}
              </span>
            </div>
            <Form.Item name='terms' valuePropName="checked" className="terms-checkbox">
              <Checkbox required>
                Terms and conditions
              </Checkbox>
            </Form.Item>
            <div className='flex flex-col gap-2'>
            <button type="submit" className='primary-contained-btn mt-2 w-100'>Register</button>
            <Link to="/login" style={{color: '#000', fontSize: '13px', textDecoration: 'underline', textAlign: 'center'}}>
              Already have an account? Login Here
            </Link>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px',}}>
            <GoogleLogin
              clientId="830063440629-j40l5f7lb1fck6ap120s272d49rp1ph6.apps.googleusercontent.com"
              buttonText="Registrati con Google"
              onSuccess={responseSuccessGoogle}
              onFailure={responseFailGoogle}
              cookiePolicy={'single_host_origin'}
            />
            </div>
           </Form>
           </div>
         </div>
         <div className='auth-img' style={{width: '40%', marginLeft: '3rem'}}>
            <img alt='login skilltest' src={register} />
         </div>
        </div>
      )
}

export default RegisterPage