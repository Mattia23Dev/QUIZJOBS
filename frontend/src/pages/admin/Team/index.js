import React from 'react'
import PageTitle from '../../../components/PageTitle'
import './team.css'

const Team = () => {
  const addTeam = () => {
    console.log('add team')
  }
  return (
    <div className='home-content'>
      <div>
        <div className='team-top'>
          <PageTitle title={"Team"} />
          <button className='primary-outlined-btn' onClick={addTeam}>Invita membro</button>
        </div>
      </div>  
    </div>
  )
}

export default Team