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
import WriteExam from './pages/WriteExam';
import Privacy from './pages/Privacy';

function App() {
  const [loginPopup, setLoginPopup] = useState(false)
  const [registerPopup, setRegisterPopup] = useState(false)
  const [logoutPopup, setLogoutPopup] = useState(false);
  const {loading} = useSelector(state=>state.loaders)
  return (
    <>
    {loginPopup && <AuthPopup pop={"Accedi"} loginPopup={loginPopup} registerPopup={registerPopup} setLoginPopup={setLoginPopup} setRegisterPopup={setRegisterPopup} />}
    {registerPopup && <AuthPopup pop={"Registrati"} loginPopup={loginPopup} registerPopup={registerPopup} setLoginPopup={setLoginPopup} setRegisterPopup={setRegisterPopup} />}
    {loading && <Loader/> }
    {logoutPopup && 
        <div className='popup-shadows'>
          <div className='popup-logout'>
            <h2>Sei sicuro di uscire?</h2>
            <p>Potrai perderti nuovi aggiornamenti e candidati.</p>
            <button className='primary-outlined-btn' onClick={() => setLogoutPopup(false)}>Non uscire</button>
            <a href='/azienda/65e600b01721f1ee1a651351' onClick={() => {
                localStorage.removeItem("token")
            }}><u>Esci</u></a>
          </div>
        </div>
      }
    <Router>
      <Routes>
        <Route path="/user/home" element={<ProtectedRoute setLogoutPopup={setLogoutPopup}><Home /></ProtectedRoute>}/>
        <Route path="/" element={<PublicRoute setLoginPopup={setLoginPopup} setRegisterPopup={setRegisterPopup} loginPopup={loginPopup} registerPopup={registerPopup}><Home /></PublicRoute>}/>
        <Route path="/azienda/:id" element={<PublicRoute setLoginPopup={setLoginPopup} setRegisterPopup={setRegisterPopup} loginPopup={loginPopup} registerPopup={registerPopup}><Azienda setRegisterPopup={setRegisterPopup} /></PublicRoute>} />
        <Route path="/test/:jobPositionSlug/:uniqueId" element={<PublicRoute><WriteExam /></PublicRoute>} />
        <Route path="/privacy" element={<PublicRoute setLoginPopup={setLoginPopup} setRegisterPopup={setRegisterPopup} loginPopup={loginPopup} registerPopup={registerPopup}><Privacy /></PublicRoute>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
