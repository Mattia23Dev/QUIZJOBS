import logo from './logo.svg';
import './App.css';
import './stylesheets/alignments.css'
import './stylesheets/textelements.css'
import './stylesheets/theme.css'
import './stylesheets/custom-components.css'
import './stylesheets/form-elements.css'
import './stylesheets/layout.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/common/Login';
import RegisterPage from './pages/common/Register';
import HomePage from './pages/admin/Home';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ReportsPage from './pages/user/Reports';
import ProfilePage from './pages/user/Profile';
import ExamsPage from './pages/admin/Exams';
import AddEditExam from './pages/admin/Exams/AddEditExam';
import Loader from './components/Loader';
import { useSelector } from 'react-redux';
import WriteExam from './pages/user/WriteExam';
import Home from './pages/Home';
import { useState } from 'react';
import InfoExam from './pages/admin/Exams/InfoExam';
import Crm from './pages/admin/Crm/Crm';
import BigLoader from './components/bigLoader/BigLoader';
import Preview from './pages/user/WriteExam/Preview';
import Team from './pages/admin/Team';
import CalendarComponent from './pages/admin/Calendar';
import Assistenza from './pages/admin/Assistenza';
import Profile from './pages/admin/Profile';
import Contatti from './pages/secondaryPages/Contatti';

function App() {
  const {loading} = useSelector(state=>state.loaders)
  const [logoutPopup, setLoginPopup] = useState(false);
  const [bigLoading, setBigLoading] = useState(false);
  const [openTour, setOpenTour] = useState(false);
  const [whichTour, setWhichTour] = useState(false);
  const handleStartTour = (tour) => {
    setWhichTour(tour)
    setOpenTour(true)
    console.log(tour)
  }

  return (
    <>
      {loading && <Loader/> }
      {bigLoading && <BigLoader />}
      {logoutPopup && 
        <div className='popup-shadows'>
          <div className='popup-logout'>
            <h2>Sei sicuro di uscire?</h2>
            <p>Potrai perderti nuovi aggiornamenti e candidati.</p>
            <button className='primary-outlined-btn' onClick={() => setLoginPopup(false)}>Non uscire</button>
            <a href='/login' onClick={() => {
                localStorage.removeItem("token")
            }}><u>Esci</u></a>
          </div>
        </div>
        }
      <Router>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage/></PublicRoute>}/>
        <Route path="/register" element={<PublicRoute><RegisterPage/></PublicRoute>}/>
        <Route path="/" element={<PublicRoute><Home/></PublicRoute>}/>
        <Route path="/contact" element={<PublicRoute><Contatti/></PublicRoute>}/>
        <Route path="/user/:jobPositionSlug/:uniqueId" element={<PublicRoute><WriteExam /></PublicRoute>} />
        <Route path="/admin/home" element={<ProtectedRoute handleStartTour={() => handleStartTour('home')} setLoginPopup={setLoginPopup}><HomePage tour={whichTour} openTour={openTour} setOpenTour={setOpenTour}/></ProtectedRoute>}/>
        <Route path="/admin/exams" element={<ProtectedRoute handleStartTour={() => handleStartTour('exam')} setLoginPopup={setLoginPopup}><ExamsPage tour={whichTour} openTour={openTour} setOpenTour={setOpenTour}/></ProtectedRoute>}/>
        <Route path="/admin/team" element={<ProtectedRoute handleStartTour={() => handleStartTour('team')} setLoginPopup={setLoginPopup}><Team tour={whichTour} openTour={openTour} setOpenTour={setOpenTour}/></ProtectedRoute>}/>
        <Route path="/admin/calendar" element={<ProtectedRoute handleStartTour={() => handleStartTour('calendar')} setLoginPopup={setLoginPopup}><CalendarComponent tour={whichTour} openTour={openTour} setOpenTour={setOpenTour}/></ProtectedRoute>}/>
        <Route path="/admin/exams/add/:tag" element={<ProtectedRoute handleStartTour={() => handleStartTour('addexam')} setLoginPopup={setLoginPopup}><AddEditExam tour={whichTour} openTour={openTour} setOpenTour={setOpenTour} setBigLoading={setBigLoading}/></ProtectedRoute>}/>
        <Route path="/admin/exams/add/preview" element={<ProtectedRoute handleStartTour={() => handleStartTour('preview')} setLoginPopup={setLoginPopup}><Preview tour={whichTour} openTour={openTour} setOpenTour={setOpenTour} /></ProtectedRoute>}/>
        <Route path="/admin/exams/edit/:id" element={<ProtectedRoute handleStartTour={() => handleStartTour('editexam')} setLoginPopup={setLoginPopup}><AddEditExam tour={whichTour} openTour={openTour} setOpenTour={setOpenTour} setBigLoading={setBigLoading}/></ProtectedRoute>}/>
        <Route path="/admin/exams/info/:id" element={<ProtectedRoute handleStartTour={() => handleStartTour('infoexam')} setLoginPopup={setLoginPopup}><InfoExam tour={whichTour} openTour={openTour} setOpenTour={setOpenTour}/></ProtectedRoute>}/>
        <Route path="/user/reports" element={<ProtectedRoute handleStartTour={handleStartTour} setLoginPopup={setLoginPopup}><ReportsPage tour={whichTour} openTour={openTour} setOpenTour={setOpenTour}/></ProtectedRoute>}/>
        <Route path="/admin/crm" element={<ProtectedRoute handleStartTour={() => handleStartTour('crm')} setLoginPopup={setLoginPopup}><Crm tour={whichTour} openTour={openTour} setOpenTour={setOpenTour}/></ProtectedRoute>}/>
        <Route path="/admin/profile" element={<ProtectedRoute tour={whichTour} openTour={openTour} setOpenTour={setOpenTour} handleStartTour={() => handleStartTour('total')} setLoginPopup={setLoginPopup}><Profile tour={whichTour} openTour={openTour} setOpenTour={setOpenTour}/></ProtectedRoute>}/>
        <Route path="/admin/help" element={<ProtectedRoute tour={whichTour} openTour={openTour} setOpenTour={setOpenTour} handleStartTour={() => handleStartTour('total')} setLoginPopup={setLoginPopup}><Assistenza tour={whichTour} openTour={openTour} setOpenTour={setOpenTour}/></ProtectedRoute>}/>
        <Route path="/user/write-exam/:id" element={<ProtectedRoute handleStartTour={handleStartTour} setLoginPopup={setLoginPopup}><WriteExam tour={whichTour} openTour={openTour} setOpenTour={setOpenTour}/></ProtectedRoute>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
