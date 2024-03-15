import React, {useEffect, useState} from 'react'
import { getUserInfo } from '../apicalls/users'
import {message, Popover} from 'antd'
import { useDispatch } from 'react-redux'
import { SetUser } from '../redux/usersSlice'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { HideLoading, ShowLoading } from '../redux/loaderSlice'
import logo from '../imgs/logo.png'
import logob from '../imgs/logobianco.png'
import { FaSearch } from 'react-icons/fa'
import Tour from 'reactour'

function ProtectedRoute({children, setLoginPopup, handleStartTour, tour, openTour, setOpenTour}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state=>state.users.user)
  const [menu, setMenu] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const userMenu = [
    {
      title: "Home",
      paths: ["/","/user/write-exam/:id"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/")
    },
    {
      title: "Reports",
      paths: ["/user/reports"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: ()=>navigate("/user/reports")
    },
    // {
    //   title: "Profile",
    //   paths: ["/profile"],
    //   icon: <i className='ri-user-line'></i>,
    //   onClick: ()=>navigate("/profile")
    // },
    {
      title: "Logout",
      paths: ["/logout"],
      icon: <i className='ri-logout-box-line'></i>,
      onClick: ()=>{
        localStorage.removeItem("token")
        navigate("/login");
      }
    }
  ] 
  const steps = [
    {
      content: 'Analizza l\'andamento dei tuoi test e delle tue candidature',
      selector: '.elemento1', 
    },
    {
      content: 'Crea, modifica o analizza i candidati del test',
      selector: '.elemento2', // Selettore CSS dell'elemento
    },
    {
      content: 'Gestisci il processo di candidatura',
      selector: '.elemento3', // Selettore CSS dell'elemento
    },
    {
      content: 'Gestisci gli eventi e gli appuntamenti',
      selector: '.elemento4', 
    },
    {
      content: 'Aggiungi o elimina membri del team',
      selector: '.elemento5', // Selettore CSS dell'elemento
    },
    {
      content: 'Gestisci i dati di profilazione',
      selector: '.elemento6', // Selettore CSS dell'elemento
    },
  ];
  const adminMenu = [
    {
      title: "Home",
      paths: ["/admin/home"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/admin/home"),
    },
    {
      title: "Test",
      paths: ["/admin/exams", "/admin/exams/add/ai", "/admin/exams/add/mix", "/admin/exams/add/manual", "/admin/exams/edit/:id", "/admin/exams/info/:id"],
      icon: <i className='ri-file-list-line'></i>,
      onClick: () => navigate("/admin/exams"),
    },
    {
      title: "CRM",
      paths: ["/admin/crm"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: ()=>navigate("/admin/crm"),
    },
    /*{
      title: "Reports",
      paths: ["/admin/reports"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: ()=>navigate("/admin/reports")
    },*/
    {
      title: "Calendar",
      paths: ["/admin/calendar"],
      icon: <i className='ri-calendar-line'></i>, // Icona del calendario
      onClick: () => navigate("/admin/calendar"),
    },
    {
      title: "Team",
      paths: ["/admin/team"],
      icon: <i className='ri-team-line'></i>, // Icona del team
      onClick: () => navigate("/admin/team"),
    },
    /*{
      title: "Automations",
      paths: ["/admin/automations"],
      icon: <i className='ri-settings-line'></i>, // Icona delle automazioni
      onClick: () => navigate("/admin/automations")
    },*/
    {
      title: "Profilo",
      paths: ["/admin/profile"],
      icon: <i className='ri-user-line'></i>,
      onClick: ()=>navigate("/admin/profile"),
    },
    {
      title: "Assistenza",
      paths: ["/admin/help"],
      icon: <i className="ri-headphone-line"></i>,
      onClick: ()=>navigate("/admin/help")
    },
  ]
  const getUserData = async() => {
    try{
      dispatch(ShowLoading())
      const response = await getUserInfo()
      dispatch(HideLoading())
      if(response.success){
        message.success(response.message)
        dispatch(SetUser(response.data))
        if(response.data.isAdmin){
              setMenu(adminMenu)
        }
        else{
              setMenu(userMenu)
        }
      }
      else{
        dispatch(HideLoading())
        message.error(response.message)
      }
    }
    catch(error){
        message.error(error.message)
        navigate("/login")
    }
  }
  useEffect(()=> {
    if(localStorage.getItem('token')){
        if(!user){
            getUserData();
        }
    }
    else{
        navigate('/login');
    }
  },[])
  const activeRoute = window.location.pathname;
  const getIsActiveOrNot = (paths) => {
      if(paths.includes(activeRoute)){
        return true;
      }
      else{
        if(activeRoute.includes("/admin/exams/edit")&&paths.includes("/admin/exams")){
          return true
        }
        if(activeRoute.includes("/admin/exams/info")&&paths.includes("/admin/exams")){
          return true
        }
        if(activeRoute.includes("/user/write-exam/:id")&&paths.includes("/user/write-exam/:id")){
          return true
        }
        return false;
      }
  }
  const getClassTour = (paths) => {
    if (tour === "total"){
      if(paths === "Home"){
        return 'elemento1';
      } else if (paths === "Test"){
        return 'elemento2'
      } else if (paths === "CRM"){
        return 'elemento3'
      } else if (paths === "Calendar"){
        return 'elemento4'
      } else if (paths === "Team"){
        return 'elemento5'
      } else if (paths === "Profilo"){
        return 'elemento6'
      }      
    }
}
  return (
    user && <div className='layout'>
     <div className='flex h-100'>
       <div className={!collapsed ? 'sidebar' : 'sidebar-close'}>
       <div className='cursor-pointer'>
          {!collapsed&&<i className="ri-close-line text-2xl flex items-center"
          onClick={()=>setCollapsed(true)}></i>}
          {collapsed&&<i className="ri-menu-2-line text-2xl flex items-center" onClick={()=>setCollapsed(false)}></i>}
        </div>
       <img className='logo' alt='logo di SkillTest' src={logob} />
         <div className='menu'>
            {menu.map((item,index)=>{
              return(
                collapsed ? 
                <Popover style={{borderRadius: '5px', padding: '5px 20px', backgroundColor: '#233142'}} placement="right" title={''} content={item.title}>
                <div className={`menu-item ${getIsActiveOrNot(item.paths)&&"active-menu-item"} ${getClassTour(item.title)}`} key={index} onClick={item.onClick}>
                    {item.icon}
                    <span className={!collapsed ? '' : 'hide-menu-title'}>{item.title}</span>
                </div>
                </Popover> :
                <div className={`menu-item ${getIsActiveOrNot(item.paths)&&"active-menu-item"} ${getClassTour(item.title)}`} key={index} onClick={item.onClick}>
                    {item.icon}
                    <span className={!collapsed ? '' : 'hide-menu-title'}>{item.title}</span>
                </div>
              )
            })}
            <div onClick={() => setLoginPopup(true)} className='menu-item-bottom'>
              <i className='ri-logout-box-line'></i> <span className={!collapsed ? '' : 'hide-menu-title'}>Logout</span>
            </div>
         </div>
       </div>
       <div className='body'>
         <div className='header flex justify-between'>
          <div>
            <div className='cursor-pointer-mobile'>
                {!collapsed&&<i className="ri-close-line text-2xl flex items-center"
                onClick={()=>setCollapsed(true)}></i>}
                {collapsed&&<i className="ri-menu-2-line text-2xl flex items-center" onClick={()=>setCollapsed(false)}></i>}
            </div>
            <div>
            <FaSearch />
              <input type='text' placeholder='Cerca candidato' />
            </div>
          </div>
            <div style={{display: 'flex', gap: '3rem', alignItems: 'center'}}>
              <div style={{cursor: 'pointer', fontSize: '14px'}} onClick={handleStartTour}>
                <u>Come funziona?</u>
              </div>
              <div onClick={() => navigate('/admin/profile')} style={{cursor: 'pointer', ontSize: '14px'}} className='flex justify-center items-center gap-1'>
              {user?.profileImage
                 ? (
                <img src={user?.profileImage} className='profile-header' alt="Profile" />
                ) : (<i className="ri-user-line"></i>)}
                {user?.name}
              </div>
            </div>
         </div>
         <div className='content'>
            {children}
         </div>
       </div>
     </div>
     <Tour
        isOpen={openTour && tour === "total"}
        onRequestClose={() => {setOpenTour(false)}}
        steps={steps}
        rounded={5}
      />
    </div>
  )
}

export default ProtectedRoute