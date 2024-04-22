import React, {useEffect, useState} from 'react'
import PageTitle from '../../../components/PageTitle'
import './team.css'
import team from '../../../imgs/team.png'
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice'
import { deleteTeam, getTeamById, registerTeam, updateTeam } from '../../../apicalls/team'
import { useSelector } from 'react-redux'
import { message, Table, Modal, Popconfirm } from 'antd'
import logo from '../../../imgs/logo.png'
import Tour from 'reactour'
import {EyeInvisibleOutlined, EyeTwoTone, EditOutlined, DeleteOutlined} from '@ant-design/icons'

const Team = ({openTour, setOpenTour, tour}) => {
  const [teams, setTeams] = useState([])
  const user = useSelector(state=>state.users.user)
  const [modifyTeam, setModifyTeam] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(Array(teams).fill(false));
  const [selectedTeam, setSelectedTeam] = useState()
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    role: 'admin',
    company: user._id
  });
  const [visiblePassword, setVisiblePassword] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const togglePasswordVisibility = id => {
    setVisiblePassword(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const steps = [
    {
      content: 'Aggiungi un membro che può accedere al tuo profilo',
      selector: '.elemento1', 
    },
    {
      content: 'Modifica o elimina il membro, ricorda che eliminando non potrà più effettuare l\'accesso.',
      selector: '.elemento2', // Selettore CSS dell'elemento
    },
    {
      content: 'Invita uno o più membri tramite email',
      selector: '.elemento3', // Selettore CSS dell'elemento
    },
  ];

  const handleEdit = (record) => {
    setDeleteConfirm(Array(teams).fill(false))
    setSelectedTeam(record)
    setModifyTeam(true)
  };
  
  const handleDelete = (record, index) => {
    setSelectedTeam(record)
    setDeleteConfirm((prevState) => {
      const updatedConfirmVisible = [...prevState];
      updatedConfirmVisible[index] = true;
      return updatedConfirmVisible;
    })
  };

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => `${record.name} ${record.surname}`
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Password',
      dataIndex: 'password',
      key: 'password',
      render: (text, record) => (
        <div onClick={() => togglePasswordVisibility(record._id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {visiblePassword[record._id] ? text : '••••••••'}
          {visiblePassword[record._id] ? <EyeTwoTone className='icon-eye' /> : <EyeInvisibleOutlined className='icon-eye' />}
        </div>
      )
    },
    {
      title: 'Azione',
      key: 'action',
      render: (text, record, index) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
            <EditOutlined onClick={() => handleEdit(record)} style={{ color: 'blue', marginRight: 20, cursor: 'pointer' }} />
            <Popconfirm
            visible={deleteConfirm[index]}
            title={"Sei sicuro di voler eliminare il membro? Ricorda che non potrà più accedere."}
            onConfirm={async () => {
              try {
                  const payload = {
                    userId: user._id,
                    id: selectedTeam._id,
                  }
                  const response = await deleteTeam(payload); 
                  if (response.success){
                    message.success("Membro eliminato")
                    const newTeam = teams.filter((team) => team._id !== selectedTeam._id)
                    setTeams(newTeam)
                    setSelectedTeam()
                    setDeleteConfirm(Array(teams).fill(false))
                  }
                  console.log("Si")
              } catch (error) {
                  console.error('Si è verificato un errore durante la conferma:', error);
              }
            }}
            onCancel={() => {
              setDeleteConfirm(Array(teams).fill(false))
              setSelectedTeam()
            }}
            okText="Sì"
            cancelText="No"
            placement="left"
          >
            <DeleteOutlined onClick={() => handleDelete(record, index)} style={{ color: 'red', cursor: 'pointer' }} />
            </Popconfirm>
          </div>
      )
    }
  ];

  const addTeam = () => {
    try {
      if (selectedRowKeys.length === 0){
        window.alert("Seleziona dalla tabella chi vuoi invitare")
        return
      }
    } catch (error) {
      console.error(error)
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleChangeModify = (e) => {
    const { name, value } = e.target;
    setSelectedTeam(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    if (formData.name === "" || formData.surname === '' || formData.email === '' || formData.password === ''){
      window.alert("Inserisci tutti i campi")
      return
    }
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    try {
      const response = await registerTeam(formData);
      console.log(response)
      if (response.success){
        const teamsNew = [...teams, response.data]; // Crea un nuovo array con il nuovo elemento
        setTeams(teamsNew); // Aggiorna lo stato con il nuovo array
        message.success("Membro aggiunto");
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
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  const handleSaveEdit = async () => {
    try {
      const teamToModify = {
        name: selectedTeam.name,
        surname: selectedTeam.surname,
        email: selectedTeam.email,
        password: selectedTeam.password,
        role: selectedTeam.role
      }
      console.log(selectedTeam)
      console.log(selectedTeam._id)
      const response = await updateTeam(teamToModify, selectedTeam._id)
      console.log(response)
      if (response.success){
        message.success("Membro modificato")
        const updatedTeams = teams.map((team) => {
          if (team._id === response.data._id) {
            return { ...team, ...response.data };
          }
          return team;
        });
        setTeams(updatedTeams);
        setSelectedTeam()
        setModifyTeam(false)
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className='home-content'>
      <div>
        <div className='team-top'>
          <div>
            <PageTitle title={"Team"} />
            <img alt='team avatar skilltest' src={team} />
          </div>
          {!isMobile() ?<button className='primary-outlined-btn elemento3' onClick={addTeam}>Invita membro per email</button> : <button className='primary-outlined-btn elemento3' onClick={addTeam}>Invita</button>}
        </div>
        <div className='team-bottom'>
          <div className='left-team elemento1'>
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
          <div className='right-team elemento2'>
            <Table rowSelection={rowSelection} columns={columns} dataSource={teams} rowKey="_id" />
          </div>
        </div>
      </div>
      <Modal
      title={
        <div className="modal-header">
            <img src={logo} alt="logo skilltest" />
        </div>
        }
        style={{ top: '1rem' }}
        width={isMobile() ? '100%' : '25%'}
        open={modifyTeam}
        footer={false}
        onCancel={()=>{
          setModifyTeam(false)
          setSelectedTeam()
          }}>
          <div className='modifica-team'>
            <div>
              <label>
                Nome:
                <input
                  type="text"
                  name="name"
                  value={selectedTeam?.name}
                  onChange={handleChangeModify}
                />
              </label>
            </div>
            <div>
              <label>
                Cognome:
                <input
                  type="text"
                  name="surname"
                  value={selectedTeam?.surname}
                  onChange={handleChangeModify}
                />
              </label>
            </div>
            <div>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={selectedTeam?.email}
                  onChange={handleChangeModify}
                />
              </label>
            </div>
            <div>
              <label>
                Password:
                <input
                  type="text"
                  name="password"
                  value={selectedTeam?.password}
                  onChange={handleChangeModify}
                />
              </label>
            </div>
            <div>
              <button onClick={handleSaveEdit} className='primary-outlined-btn'>Modifica</button>
            </div>
          </div>
        </Modal>
        <Tour
        isOpen={openTour && tour === "team"}
        onRequestClose={() => {setOpenTour(false)}}
        steps={steps}
        rounded={5}
      />
    </div>
  )
}

export default Team