import React, {useEffect, useRef, useState} from 'react'
import { getTeamInfo, getUserInfo, getUserInfoCandidate } from '../apicalls/users'
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

function ProtectedRoute({children, setLogoutPopup, setTour, handleStartTour, tour, openTour, setOpenTour}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state=>state.users.user)
  console.log(user)
  const [menu, setMenu] = useState([]);
  const isMobile = () => {
    return window.innerWidth <= 768;
  };
  const [collapsed, setCollapsed] = useState(isMobile() ? true : false);
  const userMenu = [
    {
      title: "Home",
      paths: ["/","/user/write-exam/:id", "/user/home"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/user/home")
    },
    /*{
      title: "Reports",
      paths: ["/user/reports"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: ()=>navigate("/user/reports")
    },*/
    /*{
     title: "Profile",
     paths: ["/profile"],
     icon: <i className='ri-user-line'></i>,
     onClick: ()=>navigate("/profile")
    },*/
    /*{
      title: "Logout",
      paths: ["/logout"],
      icon: <i className='ri-logout-box-line'></i>,
      onClick: ()=>{
        localStorage.removeItem("token")
        navigate("/login");
      }
    }*/
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

  useEffect(() => {
    if (tour === "total" && isMobile()){
      setCollapsed(false)
    }
  }, [tour])
  const adminMenu = [
    {
      title: "Home",
      paths: ["/admin/home"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => {
        if (isMobile()) {
          setCollapsed(true);
        }
        window.alert("Stiamo lavorando per aggiungerlo, scusate il disagio!")
      } //() => navigate("/admin/home"),
    },
    {
      title: "Test",
      paths: ["/admin/exams", "/admin/exams/add/ai", "/admin/exams/add/mix", "/admin/exams/add/manual", "/admin/exams/edit/:id", "/admin/exams/info/:id"],
      icon: <i className='ri-file-list-line'></i>,
      onClick: () => {
        if (isMobile()) {
          setCollapsed(true);
        }
        navigate("/admin/exams")
      },
    },
    {
      title: "CRM",
      paths: ["/admin/crm"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: ()=>{
        if (isMobile()) {
          setCollapsed(true);
        }
        navigate("/admin/crm")
      },
    },
    {
      title: "Calendar",
      paths: ["/admin/calendar"],
      icon: <i className='ri-calendar-line'></i>, // Icona del calendario
      onClick: () => {
        if (isMobile()) {
          setCollapsed(true);
        }
        navigate("/admin/calendar")
      },
    },
    {
      title: "Team",
      paths: ["/admin/team"],
      icon: <i className='ri-team-line'></i>,
      onClick: () => {
        if (isMobile()) {
          setCollapsed(true);
        }
        navigate("/admin/team");
      }
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
      onClick: ()=>{
        if (isMobile()) {
          setCollapsed(true);
        }
        navigate("/admin/profile")
      },
    },
    {
      title: "Assistenza",
      paths: ["/admin/help"],
      icon: <i className="ri-headphone-line"></i>,
      onClick: ()=>{
        if (isMobile()) {
          setCollapsed(true);
        }
        navigate("/admin/help")
      }
    },
  ];
  const teamMenu = [
    {
      title: "Home",
      paths: ["/admin/home"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => {
        if (isMobile()) {
          setCollapsed(true);
        }
        window.alert("Stiamo lavorando per aggiungerlo, scusate il disagio!")
      } //() => navigate("/admin/home"),
    },
    {
      title: "Test",
      paths: ["/admin/exams", "/admin/exams/add/ai", "/admin/exams/add/mix", "/admin/exams/add/manual", "/admin/exams/edit/:id", "/admin/exams/info/:id"],
      icon: <i className='ri-file-list-line'></i>,
      onClick: () => {
        if (isMobile()) {
          setCollapsed(true);
        }
        navigate("/admin/exams")
      },
    },
    {
      title: "CRM",
      paths: ["/admin/crm"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: ()=>{
        if (isMobile()) {
          setCollapsed(true);
        }
        navigate("/admin/crm")
      },
    },
    {
      title: "Calendar",
      paths: ["/admin/calendar"],
      icon: <i className='ri-calendar-line'></i>, // Icona del calendario
      onClick: () => {
        if (isMobile()) {
          setCollapsed(true);
        }
        navigate("/admin/calendar")
      },
    },
    {
      title: "Profilo",
      paths: ["/admin/profile"],
      icon: <i className='ri-user-line'></i>,
      onClick: ()=>{
        if (isMobile()) {
          setCollapsed(true);
        }
        navigate("/admin/profile")
      },
    },
    {
      title: "Assistenza",
      paths: ["/admin/help"],
      icon: <i className="ri-headphone-line"></i>,
      onClick: ()=>{
        if (isMobile()) {
          setCollapsed(true);
        }
        navigate("/admin/help")
      }
    },
  ];
  const getUserData = async() => {
    try{
      dispatch(ShowLoading())
      const token = localStorage.getItem('token');
      let response = await getUserInfoCandidate();
      dispatch(HideLoading())
      if(response.success){
        message.success(response.message)
        dispatch(SetUser(response.data))
        if(response.data.isAdmin){
          if (response.data.teamType){
            setMenu(teamMenu)
          } else {
            setMenu(adminMenu)
          }
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
        } else {
          setMenu(userMenu)
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
const [searchTerm, setSearchTerm] = useState('');

const handleSearch = (event) => {
  const term = event.target.value;
  setSearchTerm(term);

  const textToSearch = window.getSelection().toString();
  if (textToSearch && textToSearch.includes(term)) {
    const range = window.getSelection().getRangeAt(0);
    const span = document.createElement('span');
    span.style.backgroundColor = 'yellow';
    span.textContent = term;
    range.surroundContents(span);
  } else {
    const spans = document.querySelectorAll('span[style="background-color: yellow"]');
    spans.forEach(span => {
      const parent = span.parentNode;
      parent.replaceChild(span.firstChild, span);
      parent.normalize();
    });
  }
};
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
            <div onClick={() => setLogoutPopup(true)} className='menu-item-bottom'>
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
              <input type='text' placeholder='Cerca' value={searchTerm} onChange={handleSearch} />
            </div>
          </div>
            <div style={{display: 'flex', gap: '3rem', alignItems: 'center'}}>
              <div style={{cursor: 'pointer', fontSize: '14px'}} onClick={handleStartTour}>
                <u className='how-work'>Come funziona?</u><p className='how-work-mobile'>?</p>
              </div>
              <div onClick={() => navigate('/user/home')} style={{cursor: 'pointer', ontSize: '14px'}} className='flex justify-center items-center gap-1 profile-header-mobile'>
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
        onRequestClose={() => {setOpenTour(false); setTour("")}}
        steps={steps}
        rounded={5}
      />
    </div>
  )
}

export default ProtectedRoute