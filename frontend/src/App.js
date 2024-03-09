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
import AdminReportsPage from './pages/admin/Reports';
import Home from './pages/Home';
import { useState } from 'react';
import InfoExam from './pages/admin/Exams/InfoExam';
import Crm from './pages/admin/Crm/Crm';
import BigLoader from './components/bigLoader/BigLoader';
import Preview from './pages/user/WriteExam/Preview';
import Team from './pages/admin/Team';
import CalendarComponent from './pages/admin/Calendar';

function App() {
  const {loading} = useSelector(state=>state.loaders)
  const [logoutPopup, setLoginPopup] = useState(false);
  const [bigLoading, setBigLoading] = useState(false);

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
        <Route path="/user/:jobPositionSlug/:uniqueId" element={<PublicRoute><WriteExam /></PublicRoute>} />
        <Route path="/admin/home" element={<ProtectedRoute setLoginPopup={setLoginPopup}><HomePage/></ProtectedRoute>}/>
        <Route path="/admin/exams" element={<ProtectedRoute setLoginPopup={setLoginPopup}><ExamsPage/></ProtectedRoute>}/>
        <Route path="/admin/team" element={<ProtectedRoute setLoginPopup={setLoginPopup}><Team/></ProtectedRoute>}/>
        <Route path="/admin/calendar" element={<ProtectedRoute setLoginPopup={setLoginPopup}><CalendarComponent/></ProtectedRoute>}/>
        <Route path="/admin/exams/add" element={<ProtectedRoute setLoginPopup={setLoginPopup}><AddEditExam setBigLoading={setBigLoading}/></ProtectedRoute>}/>
        <Route path="/admin/exams/add/preview" element={<ProtectedRoute setLoginPopup={setLoginPopup}><Preview /></ProtectedRoute>}/>
        <Route path="/admin/exams/edit/:id" element={<ProtectedRoute setLoginPopup={setLoginPopup}><AddEditExam setBigLoading={setBigLoading}/></ProtectedRoute>}/>
        <Route path="/admin/exams/info/:id" element={<ProtectedRoute setLoginPopup={setLoginPopup}><InfoExam/></ProtectedRoute>}/>
        <Route path="/user/reports" element={<ProtectedRoute setLoginPopup={setLoginPopup}><ReportsPage/></ProtectedRoute>}/>
        <Route path="/admin/reports" element={<ProtectedRoute setLoginPopup={setLoginPopup}><AdminReportsPage/></ProtectedRoute>}/>
        <Route path="/admin/crm" element={<ProtectedRoute setLoginPopup={setLoginPopup}><Crm/></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute setLoginPopup={setLoginPopup}><ProfilePage/></ProtectedRoute>}/>
        <Route path="/user/write-exam/:id" element={<ProtectedRoute setLoginPopup={setLoginPopup}><WriteExam/></ProtectedRoute>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
