import React, { useState } from 'react'
import PageTitle from '../../../components/PageTitle'
import { Calendar, Modal, Button } from 'antd';
import './index.css'

const CalendarComponent = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [eventVisible, setEventVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEventVisible(false)
  };

  const handleModalOk = () => {
    alert(`Evento aggiunto per la data: ${selectedDate.format('DD/MM/YYYY')}`);
    setModalVisible(false);
  };
  const events = [
    {
      date: '2024-02-14',
      time: '10:00',
      candidateName: 'Mario Rossi',
      jobPosition: 'Sviluppatore Frontend',
    },
    {
      date: '2024-02-20',
      time: '14:30',
      candidateName: 'Giulia Bianchi',
      jobPosition: 'Sviluppatore Backend',
    },
    {
      date: '2024-02-16',
      time: '10:00',
      candidateName: 'Marco Rossi',
      jobPosition: 'Sviluppatore Frontend',
    },
    {
      date: '2024-02-21',
      time: '18:30',
      candidateName: 'Jhon Bianchi',
      jobPosition: 'Sviluppatore Backend',
    },
  ];

  const handleEventClick = (event) => {
    console.log('Evento cliccato:', event);
    setEventVisible(true)
    setSelectedEvent(event);
  };

  const dateCellRender = (value) => {
    const formattedDate = value.format('YYYY-MM-DD');
    const eventsForDate = events.filter(event => event.date === formattedDate);

    return (
      <ul>
        {eventsForDate.map((event, index) => (
          <li key={index} onClick={() => handleEventClick(event)}>
            {event.time} - {event.candidateName} ({event.jobPosition})
          </li>
        ))}
      </ul>
    );
  };
  return (
    <div className='home-content'>
        <PageTitle title={"Calendario"} />
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
        title="Aggiungi Evento"
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>Annulla</Button>,
          <Button key="submit" type="primary" onClick={handleModalOk}>Aggiungi</Button>,
        ]}
      >
        {selectedDate && <p>Selezionato: {selectedDate.format('DD/MM/YYYY')}</p>}
      </Modal>
      <Modal
        title="Aggiungi Evento"
        visible={eventVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>Annulla</Button>,
          <Button key="submit" type="primary" onClick={handleModalOk}>Aggiungi</Button>,
        ]}
      >
        {selectedEvent && <p>Selezionato: {selectedEvent}</p>}
      </Modal>
    </div>
  )
}

export default CalendarComponent