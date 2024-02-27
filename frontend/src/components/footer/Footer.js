import React from 'react'
import './footer.css'
import logobianco from '../../imgs/logobianco.png'

const Footer = () => {
  return (
    <div className='footer bg-primary'>
        <div>
            <img alt='logo skilltest' src={logobianco} /><span><u>Area legale</u></span>
            <p>© SkillTest 2024 - Tutti i diritti riservati</p>
        </div>
        <div>
            <a href='#'>Istruzioni per i candidati</a>
            <a href='#'>Privacy Policy</a>
            <a href='#'>Assistenza</a>
        </div>
    </div>
  )
}

export default Footer