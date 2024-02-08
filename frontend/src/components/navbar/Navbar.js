import React, { useState } from 'react';
import './navbar.css';
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className='navbar-home'>
      <div className='logo'>LOGO</div>
      <div className={`menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <a href='#'>Home</a>
        <a href='#'>About</a>
        <a href='#'>Services</a>
        <a href='#'>Contact</a>
      </div>
      <div className='auth-buttons'>
        <button onClick={() => navigate('/login')} >Login</button>
        <button onClick={() => navigate('/register')}>Sign Up</button>
      </div>
      <div className='burger-menu' onClick={toggleMobileMenu}>
        &#9776;
      </div>
    </nav>
  )
}

export default Navbar;