import React, { useEffect, useState } from 'react'
import PageTitle from '../../../components/PageTitle'
import { Calendar, Modal, Button, DatePicker, TimePicker, Select, Input } from 'antd';
import './index.css'
import locale from 'antd/es/date-picker/locale/it_IT'; 
import moment from 'moment';
import InfoApp from './InfoApp';
import {useDispatch, useSelector} from 'react-redux'
import { getAppointmentUser } from '../../../apicalls/appointment';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
const { Option } = Select;

const CalendarComponent = () => {
  const [eventVisible, setEventVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector(state=>state.users.user);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState(1);
  const [eventAppointment, setEventAppointment] = useState(moment());
  const [events, setEvents] = useState([])

  const getAppointment = async () => {
    try {
      const response = await getAppointmentUser(user._id);
      console.log(response)
      setEvents(response.data)
      dispatch(HideLoading())
    } catch (error) {
      console.error(error);
    }
  }

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const eventsForDate = events?.filter(e => moment(e.date).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD'));
    console.log(eventsForDate)
    if (eventsForDate){
      setSelectedEvent(eventsForDate);
      setActiveTab(1)
    } else {
      setActiveTab(2)
    }
    setEventVisible(true)
  };

  const handleModalCancel = () => {
    setEventVisible(false)
    setSelectedEvent(null)
  };

  const dateCellRender = (value) => {
    const formattedDate = value.format('YYYY-MM-DD');
    const eventsForDate = events?.filter(event => moment(event.date).format('YYYY-MM-DD') === formattedDate);
    return (
      <ul>
        {eventsForDate.length > 0 && eventsForDate?.map((event, index) => {
          const formattedTime = moment(event.date).format('HH:mm');
          const formatDate = moment(event.date).format("DD-MM-YYYY");
          return(
          <li key={index}>
            {formattedTime} - {event.candidate.name + ' ' + event.candidate.surname} - {event.jobPosition}
          </li>
        )})}
      </ul>
    );
  };

  useEffect(() => {
    dispatch(ShowLoading())
    getAppointment()
  }, [])
  const handlePushNewApp = (app) => {
    const updatedEvents = [...events, app];
    setEvents(updatedEvents);
  }
  const handleDeleteApp = (id) => {
    const updatedEvents = events.filter(event => event._id !== id);
    setEvents(updatedEvents)
  }
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
              {events && events.length > 0 && events?.map((event, index) => {
                const formattedDate = moment(event.date).format('DD-MM-YYYY');
                const formattedTime = moment(event.date).format('HH:mm');
                return(
                <li key={index}>
                  <strong>Data:</strong> {formattedDate}, <strong>Ora:</strong> {formattedTime} <br />
                  <strong>Candidato:</strong> {event.candidate.name + ' ' + event.candidate.surname}, <br />
                  <strong>Posizione lavorativa:</strong> {event.jobPosition}
                </li>
              )})}
            </ul>
          </div>
          <div>
            <Calendar
            dateCellRender={events && dateCellRender}
            onSelect={handleDateClick}
            mode="month"
          />            
          </div>
        </div>
        {eventVisible &&
        <InfoApp
        eventVisible={eventVisible}
        handleModalCancel={handleModalCancel}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedDate={selectedDate}
        selectedEvent={selectedEvent}
        handlePushNewApp={handlePushNewApp}
        setSelectedEvent={setSelectedEvent}
        handleDeleteApp={handleDeleteApp}
        id={user._id}
         />}
    </div>
  )
}

export default CalendarComponent