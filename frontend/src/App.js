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
import HomePage from './pages/common/Home';
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

function App() {
  const {loading} = useSelector(state=>state.loaders)
  const [logoutPopup, setLoginPopup] = useState(false);
  return (
    <>
      {loading && <Loader/> }
      {logoutPopup && 
        <div className='popup-shadows'>
          <div className='popup-logout'>
            <button onClick={() => setLoginPopup(false)}>Non uscire</button>
            <a href='/login' onClick={() => {
                localStorage.removeItem("token")
            }}>Esci</a>
          </div>
        </div>
        }
      <Router>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage/></PublicRoute>}/>
        <Route path="/register" element={<PublicRoute><RegisterPage/></PublicRoute>}/>
        <Route path="/" element={<PublicRoute><Home/></PublicRoute>}/>
        <Route path="/user/:jobPositionSlug/:uniqueId" element={<PublicRoute><WriteExam /></PublicRoute>} />
        <Route path="/admin/exams" element={<ProtectedRoute setLoginPopup={setLoginPopup}><HomePage/></ProtectedRoute>}/>
        <Route path="/admin/test" element={<ProtectedRoute setLoginPopup={setLoginPopup}><ExamsPage/></ProtectedRoute>}/>
        <Route path="/admin/exams/add" element={<ProtectedRoute setLoginPopup={setLoginPopup}><AddEditExam/></ProtectedRoute>}/>
        <Route path="/admin/exams/edit/:id" element={<ProtectedRoute setLoginPopup={setLoginPopup}><AddEditExam/></ProtectedRoute>}/>
        <Route path="/admin/exams/info/:id" element={<ProtectedRoute setLoginPopup={setLoginPopup}><InfoExam/></ProtectedRoute>}/>
        <Route path="/user/reports" element={<ProtectedRoute setLoginPopup={setLoginPopup}><ReportsPage/></ProtectedRoute>}/>
        <Route path="/admin/reports" element={<ProtectedRoute setLoginPopup={setLoginPopup}><AdminReportsPage/></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute setLoginPopup={setLoginPopup}><ProfilePage/></ProtectedRoute>}/>
        <Route path="/user/write-exam/:id" element={<ProtectedRoute setLoginPopup={setLoginPopup}><WriteExam/></ProtectedRoute>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
