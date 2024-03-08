import React, {useEffect, useState} from 'react'
import { Modal, Select, DatePicker, TimePicker, message } from 'antd'
import logo from '../../../imgs/logo.png'
import { getCandidateCrm } from '../../../apicalls/exams';
import { deleteAppointmentUser, saveAppointment } from '../../../apicalls/appointment';
import moment from 'moment';
import edit from '../../../imgs/edit.png'
import move from '../../../imgs/move.png'
import cancel from '../../../imgs/cancel.png'
const { Option } = Select

const InfoApp = ({eventVisible, handleModalCancel, setSelectedEvent, id, handleDeleteApp, handlePushNewApp, activeTab, setActiveTab, selectedDate, selectedEvent}) => {
    const [candidateOptions, setCandidateOptions] = useState([])
    const [title, setTitle] = useState('');
    const [candidate, setCandidate] = useState('');
    const [date, setDate] = useState(selectedDate ? selectedDate : null);
    const [time, setTime] = useState(null);
    const [description, setDescription] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [filterCandidate, setFilterCandidate] = useState(candidateOptions) 
    
    const getData = async() => {
    try{
        const response = await getCandidateCrm(id)
        if(response.success){
            setCandidateOptions(response.data)
            setFilterCandidate(response.data)
            console.log(response.data)
        }
        else{
            message.error(response.message)
            }
        }
        catch(error){
            message.error(error.message)
        }
        }

    useEffect(()=>{
      getData()
    },[])

    const handleDateChange = (value) => {
        setDate(value);
      };
    
      const handleTimeChange = (value) => {
        setTime(value);
      };
    
      const handleCandidateChange = (value) => {
        setCandidate(value);
      };
    
      const handleSubmit = async () => {
        const payload = {
            title,
            candidate,
            date: date ? date.format('YYYY-MM-DD') : null,
            time: time ? time.format('HH:mm') : null,
            description,
            id,
          };
          if (!payload.title || !payload.candidate || !payload.date || !payload.time) {
            message.error('Assicurati di inserire tutti i campi obbligatori.');
            return;
          }
        try {
            const response = await saveAppointment(payload);
            handlePushNewApp(response.data);
            const updatedEvents = [...selectedEvent, response.data];
            setTitle("")
            setDescription("")
            setTime(null)
            setCandidate('')
            console.log(response)
            setSelectedEvent(updatedEvents)
            setActiveTab(1)
            message.success("Appuntamento aggiunto")
        } catch (error) {
            console.error(error)
            message.error('Si è verificato un errore')
        }
      };

      const deleteApp = async (id) => {
        try {
            const response = await deleteAppointmentUser(id)
            console.log(response)
            if (response.success){
                message.success("Appuntamento eliminato") 
                const updatedEvents = selectedEvent.filter(event => event._id !== id);
                setSelectedEvent(updatedEvents);
                handleDeleteApp(id)                
            }
        } catch (error) {
            console.error(error)
        }
      }
    
      const handleSearchCandidate = (value) => {
        setSearchValue(value);
        if (value === "" || value === null){
          setFilterCandidate(candidateOptions)
        } else {
          const filteredCandidates = candidateOptions.filter(candidate =>
            candidate.name.toLowerCase().includes(value.toLowerCase())
          );
          setFilterCandidate(filteredCandidates)      
        }
      };
      console.log(selectedEvent)
  return (
    <Modal
    title={
      <div className="modal-header">
        <img src={logo} alt="logo skilltest" />
      </div>
      }
      style={{top: '2rem'}}
    footer={false}
    visible={eventVisible}
    onCancel={handleModalCancel}
  >
      <div className='modal-candidate-top'>
        <div onClick={() => setActiveTab(1)} className={activeTab === 1 ? 'active' : ''}>
          <span></span>
          <p>Appuntamenti</p>
        </div>
        <hr />
        <div onClick={() => setActiveTab(2)} className={activeTab === 2 ? 'active' : ''}>
          <span></span>
          <p>Aggiungi</p>
        </div>
      </div>
      {activeTab === 1 ? (
        <div className='appointmend-modal'>
        {selectedEvent ? 
        selectedEvent.length > 0 && selectedEvent.sort((a, b) => {
            if (a.date < b.date) return 1;
            if (a.date > b.date) return -1;
            if (a.time < b.time) return 1;
            if (a.time > b.time) return -1;
            return 0;
        }).map((e, index) => {
            const formattedDate = moment(e.date).format('DD-MM-YYYY');
            const formattedTime = moment(e.date).format('HH:mm');
            return (
            <div className='appointment-item' key={index}>
                <div>
                    <p>{e.title}</p>
                    <p>{formattedTime}</p>
                    <p>{e.candidate.name}</p>                    
                </div>
                <div>
                    <p><u>Info</u></p>
                    <img alt='modifica appuntamento skilltest' src={edit}/>
                    <img alt='elimina appuntamento skilltest' onClick={() => deleteApp(e._id)} src={cancel}/>
                </div>
            </div>
        )})
         : <p>Nessun evento, aggiungilo</p>
        }
       </div>  
      ) : (
    <div className='form-add-appointment'>
        <div>
          <label>Titolo dell'evento</label>
          <input placeholder="Titolo" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Candidato</label>
          <Select 
          showSearch={true}
          onSearch={handleSearchCandidate}
          placeholder="Candidato"
          defaultActiveFirstOption={true}
          maxTagCount={10}
          filterOption={false}
          value={candidate} 
          onChange={handleCandidateChange}>
            {filterCandidate?.slice(0, 10).map((candidate) => (
              <Option key={candidate.candidateId} value={candidate.candidateId}>
                {candidate.name + ' ' + candidate.surname}
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <label>Data e ora</label>
          <div>
            <DatePicker placeholder="Data" value={date} onChange={handleDateChange} />
            <TimePicker placeholder="Ora" value={time} onChange={handleTimeChange} format="HH:mm" />        
          </div>        
        </div>
        <div>
          <label>Descrizione (opzionale)</label>
          <textarea style={{minHeight: '100px'}} placeholder="Descrizione" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button className='primary-outlined-btn' onClick={handleSubmit}>Pianifica appuntamento</button>
      </div>
      )}
  </Modal>
  )
}

export default InfoApp