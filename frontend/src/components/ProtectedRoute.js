import React, {useEffect, useState} from 'react'
import { getUserInfo } from '../apicalls/users'
import {message} from 'antd'
import { useDispatch } from 'react-redux'
import { SetUser } from '../redux/usersSlice'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { HideLoading, ShowLoading } from '../redux/loaderSlice'
import logo from '../imgs/logo.png'

function ProtectedRoute({children, setLoginPopup}) {
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
  const adminMenu = [
    {
      title: "Home",
      paths: ["/admin/home"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/admin/home")
    },
    {
      title: "Test",
      paths: ["/admin/exams", "/admin/exams/add", "/admin/exams/edit/:id", "/admin/exams/info/:id"],
      icon: <i className='ri-file-list-line'></i>,
      onClick: () => navigate("/admin/exams")
    },
    {
      title: "CRM",
      paths: ["/admin/crm"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: ()=>navigate("/admin/crm")
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
      onClick: () => navigate("/admin/calendar")
    },
    {
      title: "Team",
      paths: ["/admin/team"],
      icon: <i className='ri-team-line'></i>, // Icona del team
      onClick: () => navigate("/admin/team")
    },
    {
      title: "Automations",
      paths: ["/admin/automations"],
      icon: <i className='ri-settings-line'></i>, // Icona delle automazioni
      onClick: () => navigate("/admin/automations")
    },
    {
      title: "Profilo",
      paths: ["/profile"],
      icon: <i className='ri-user-line'></i>,
      onClick: ()=>navigate("/profile")
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
  return (
    user && <div className='layout'>
     <div className='flex h-100'>
       <div className={!collapsed ? 'sidebar' : 'sidebar-close'}>
       <img className='logo' alt='logo di SkillTest' src={logo} />
         <div className='menu'>
            {menu.map((item,index)=>{
              return(
                <div className={`menu-item ${getIsActiveOrNot(item.paths)&&"active-menu-item"}`} key={index} onClick={item.onClick}>
                    {item.icon}
                    <span className={!collapsed ? '' : 'hide-menu-title'}>{item.title}</span>
                </div>
              )
            })}
            <div onClick={() => setLoginPopup(true)} className='menu-item-bottom'>
              <span><i className='ri-logout-box-line'></i> Logout</span>
            </div>
         </div>
       </div>
       <div className='body'>
         <div className='header flex justify-between'>
            <div className='cursor-pointer-mobile'>
                {!collapsed&&<i className="ri-close-line text-2xl flex items-center"
                onClick={()=>setCollapsed(true)}></i>}
                {collapsed&&<i className="ri-menu-2-line text-2xl flex items-center" onClick={()=>setCollapsed(false)}></i>}
            </div>
            <div className='cursor-pointer'>
              {!collapsed&&<i className="ri-close-line text-2xl flex items-center"
              onClick={()=>setCollapsed(true)}></i>}
              {collapsed&&<i className="ri-menu-2-line text-2xl flex items-center" onClick={()=>setCollapsed(false)}></i>}
            </div>
            <div>
              <div className='flex justify-center items-center gap-1'>
                <i className="ri-user-line"></i>
                {user?.name}
              </div>
              <span>Role : {(user?.isAdmin)?"Admin":"User"}</span>
            </div>
         </div>
         <div className='content'>
            {children}
         </div>
       </div>
     </div>
    </div>
  )
}

export default ProtectedRoute