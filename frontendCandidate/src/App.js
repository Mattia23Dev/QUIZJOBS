import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loader from './components/Loader';
import './App.css';
import './stylesheets/alignments.css'
import './stylesheets/textelements.css'
import './stylesheets/theme.css'
import './stylesheets/custom-components.css'
import './stylesheets/form-elements.css'
import './stylesheets/layout.css'
import Azienda from './pages/Azienda/Azienda';
import Home from './pages/Home/Home';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { useSelector } from 'react-redux';
import { Modal } from 'antd';
import { useState } from 'react';
import AuthPopup from './pages/AuthPopup/AuthPopup';

function App() {
  const [loginPopup, setLoginPopup] = useState(false)
  const [registerPopup, setRegisterPopup] = useState(false)
  const {loading} = useSelector(state=>state.loaders)
  return (
    <>
    {loginPopup && <AuthPopup pop={"log"} loginPopup={loginPopup} registerPopup={registerPopup} setLoginPopup={setLoginPopup} setRegisterPopup={setRegisterPopup} />}
    {registerPopup && <AuthPopup pop={"reg"} loginPopup={loginPopup} registerPopup={registerPopup} setLoginPopup={setLoginPopup} setRegisterPopup={setRegisterPopup} />}
    {loading && <Loader/> }
    <Router>
      <Routes>
        <Route path="/user/home" element={<ProtectedRoute><Home /></ProtectedRoute>}/>
        <Route path="/" element={<PublicRoute setLoginPopup={setLoginPopup} setRegisterPopup={setRegisterPopup} loginPopup={loginPopup} registerPopup={registerPopup}><Home /></PublicRoute>}/>
        <Route path="/azienda/:id" element={<PublicRoute setLoginPopup={setLoginPopup} setRegisterPopup={setRegisterPopup} loginPopup={loginPopup} registerPopup={registerPopup}><Azienda setRegisterPopup={setRegisterPopup} /></PublicRoute>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
