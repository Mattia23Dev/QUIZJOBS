import React, { useState } from 'react';
import './navbar.css';
import { useNavigate } from 'react-router-dom'
import logobianco from '../../imgs/logonewsmall.png'

const Navbar = ({user, setRegisterPopup, setLoginPopup}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  console.log(user)
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
    {!user ? (
      <>
      <nav className='navbar-home bg-primary'>
        <div className='logo'>
          <img alt='logo skilltest' src={logobianco} />
        </div>
        <div className='auth-buttons'>
          <button onClick={() => setLoginPopup(true)}>Accedi</button>
          <button onClick={() => setRegisterPopup(true)}>Registrati</button>
        </div>
      </nav>
      </>
    ) : (
      <>
        <nav className='navbar-home bg-primary'>
          <div className='logo'>
            <img alt='logo skilltest' src={logobianco} />
          </div>
          <div className='auth-buttons'>
            <button className='btn-entra' onClick={() => navigate('/user/home')}>{user?.name + ' ' + user.surname}</button>
          </div>
        </nav>
      </>
    )}
    </>
  )
}

export default Navbar;