import React, {useEffect, useState} from 'react'
import PageTitle from '../../../components/PageTitle'
import './team.css'
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice'
import { getTeamById, registerTeam } from '../../../apicalls/team'
import { useSelector } from 'react-redux'
import { message } from 'antd'

const Team = () => {
  const [teams, setTeams] = useState([])
  const user = useSelector(state=>state.users.user)
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    role: 'admin',
    company: user._id
  });

  const addTeam = () => {
    console.log('add team')
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    try {
      const response = await registerTeam(formData);
      console.log(response)
      if (response.success){
        teams.push(response.data)
        message.success("Membro aggiunto")
      } 
    } catch (error) {
      console.error(error)
    }
  };

  const getTeam = async () => {
    try {
      const response = await getTeamById(user._id);
      console.log(response)
      if (response.success){
        setTeams(response.data)
        HideLoading()
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    ShowLoading()
    getTeam()
  }, [])
  return (
    <div className='home-content'>
      <div>
        <div className='team-top'>
          <PageTitle title={"Team"} />
          <button className='primary-outlined-btn' onClick={addTeam}>Invita membro</button>
        </div>
        <div className='team-bottom'>
          <div className='left-team'>
            <div>
              <label>
                Nome:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                Cognome:
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </label>
            </div>
            <button onClick={handleSubmit} className='primary-outlined-btn'>Crea membro</button>
          </div>
          <div className='right-team'>
            {teams && teams.length > 0 && teams.map((team) => (
              <div key={team._id}>
                {team.email}
              </div>
            ))}
          </div>
        </div>
      </div>  
    </div>
  )
}

export default Team