import { Modal } from 'antd'
import React from 'react'
import logo from '../../imgs/logonewsmall.png'
import './authPopup.css'

const AuthPopup = ({loginPopup, registerPopup, setRegisterPopup, setLoginPopup, pop}) => {
    const isMobile = () => {
        return window.innerWidth <= 768;
      };
  return (
    <div className='auth-popup'>
        <Modal
        title={
        <div className="modal-header">
            <img src={logo} alt="logo skilltest" />
        </div>
        }
        style={{ top: '1rem' }}
        width={isMobile() ? '100%' : '45%'}
        open={loginPopup || registerPopup}
        footer={false}
        onCancel={()=>{
        setLoginPopup(false)
        setRegisterPopup(false)
        }}>
        {pop === "log" ? (
            <h1>Log</h1>
        ) : (
            <h1>Reg</h1>
        )}
      </Modal>
    </div>
  )
}

export default AuthPopup