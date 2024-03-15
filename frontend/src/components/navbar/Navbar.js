import React, { useState } from 'react';
import './navbar.css';
import { useNavigate } from 'react-router-dom'
import logobianco from '../../imgs/logobianco.png'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="navbar-home bg-secondary">
        <p><i className="ri-earth-line"></i> IT</p>
        <div>
          <button><u>Istruzioni per i candidati</u></button>
          <button onClick={() => navigate('/contact')}>Aiuto</button>
          <button onClick={() => navigate('/login')}>Accedi</button>
        </div>
      </nav>
      <nav className='navbar-home bg-primary'>
        <div className='logo'>
          <img alt='logo skilltest' src={logobianco} />
        </div>
        <div className={`menu`}>
          <a href='/#product'>Prodotto</a>
          <a href='/#price'>Prezzi</a>
          <a href='/contact'>Contatti</a>
        </div>
        <div className='auth-buttons'>
          <button onClick={() => navigate('/register')}>Demo</button>
        </div>
      </nav>    
    </>

  )
}

export default Navbar;