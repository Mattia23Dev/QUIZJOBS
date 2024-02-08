import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar/Navbar'
import './home.css';

function Home() {

    const navigate = useNavigate()

  return (
    <div className='home-out'>
      <Navbar /> 
      <div className='hero-section'>

      </div>
    </div>
  )
}

export default Home