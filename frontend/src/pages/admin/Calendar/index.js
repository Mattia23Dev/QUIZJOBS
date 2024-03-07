import React, { useState } from 'react'
import PageTitle from '../../../components/PageTitle'
import { Calendar, Modal, Button, DatePicker } from 'antd';
import './index.css'
import locale from 'antd/es/date-picker/locale/it_IT'; 
import moment from 'moment';
import logo from '../../../imgs/logo.png'

const CalendarComponent = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [eventVisible, setEventVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState(1);
  const [eventAppointment, setEventAppointment] = useState(moment());

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setModalVisible(true);
    setEventVisible(true)
    setActiveTab(2)
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEventVisible(false)
    setSelectedEvent(null)
  };

  const handleModalOk = () => {
    alert(`Evento aggiunto per la data: ${selectedDate.format('DD/MM/YYYY')}`);
    setModalVisible(false);
  };
  const events = [
    {
      date: '2024-03-14',
      time: '10:00',
      candidateName: 'Mario Rossi',
      jobPosition: 'Sviluppatore Frontend',
    },
    {
      date: '2024-03-20',
      time: '14:30',
      candidateName: 'Giulia Bianchi',
      jobPosition: 'Sviluppatore Backend',
    },
    {
      date: '2024-03-16',
      time: '10:00',
      candidateName: 'Marco Rossi',
      jobPosition: 'Sviluppatore Frontend',
    },
    {
      date: '2024-03-21',
      time: '18:30',
      candidateName: 'Jhon Bianchi',
      jobPosition: 'Sviluppatore Backend',
    },
  ];

  const handleEventClick = (event) => {
    setEventVisible(true)
    setSelectedEvent(event);
    setSelectedDate(event.date)
  };

  const dateCellRender = (value) => {
    const formattedDate = value.format('YYYY-MM-DD');
    const eventsForDate = events.filter(event => event.date === formattedDate);

    return (
      <ul>
        {eventsForDate.length > 0 && eventsForDate?.map((event, index) => (
          <li key={index} onClick={() => handleEventClick(event)}>
            {event.time} - {event.candidateName} - {event.jobPosition}
          </li>
        ))}
      </ul>
    );
  };
  return (
    <div className='home-content'>
        <div className='top-calendar'>
        <PageTitle title={"Calendario"} />      
        <div className='filter-appointment'>
              <div>
                <button 
                className={eventAppointment.isSame(moment().subtract(1, 'day'), 'day') ? 'active' : ''}
                onClick={() => setEventAppointment(moment().subtract(1, 'day'))}>Ieri</button>
                <button 
                className={eventAppointment.isSame(moment(), 'day') ? 'active' : ''}
                onClick={() => setEventAppointment(moment())}>Oggi</button>
                <button 
                className={eventAppointment.isSame(moment().add(1, 'day'), 'day') ? 'active' : ''}
                onClick={() => setEventAppointment(moment().add(1, 'day'))}>Domani</button>
              </div>
              <DatePicker className='datepicker' locale={locale} value={eventAppointment} onChange={(date, dateString) => setEventAppointment(moment(dateString))} />
          </div>  
        </div>
        <div className='calendar-container'>
          <div>
            <h4>Prossimi appuntamenti</h4>
            <ul>
              {events.map((event, index) => (
                <li key={index}>
                  <strong>Data:</strong> {event.date}, <strong>Ora:</strong> {event.time}, <br />
                  <strong>Candidato:</strong> {event.candidateName}, <br />
                  <strong>Posizione lavorativa:</strong> {event.jobPosition}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Calendar
            dateCellRender={dateCellRender}
            onSelect={handleDateClick}
            mode="month"
          />            
          </div>
        </div>
      <Modal
        title={
          <div className="modal-header">
            <img src={logo} alt="logo skilltest" />
          </div>
          }
        visible={eventVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>Annulla</Button>,
          <Button key="submit" type="primary" onClick={handleModalOk}>Aggiungi</Button>,
        ]}
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
        {selectedEvent ? <p>Selezionato: {selectedEvent.candidateName}</p> : <p>Nessun evento, aggiungilo</p>}
      </Modal>
    </div>
  )
}

export default CalendarComponent