import React, { useEffect, useState, useRef } from 'react'
import PageTitle from '../../../components/PageTitle'
import { Calendar, DatePicker, Select, Affix, Drawer, Button, Space, Popover } from 'antd';
import './index.css'
import locale from 'antd/es/date-picker/locale/it_IT'; 
import moment from 'moment';
import InfoApp from './InfoApp';
import {useDispatch, useSelector} from 'react-redux'
import { getAppointmentUser } from '../../../apicalls/appointment';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import allegati from '../../../imgs/allegati.png'
import Tour from 'reactour';
const { Option } = Select;

const CalendarComponent = ({tour, openTour, setOpenTour}) => {
  console.log(tour, openTour)
  const [eventVisible, setEventVisible] = useState(false);
  const [openDrawerApp, setOpenDrawerApp] = useState(false);
  const [drawerEvent, setDrawerEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector(state=>state.users.user);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState(2);
  const [eventAppointment, setEventAppointment] = useState(moment());
  const [events, setEvents] = useState([])

  const steps = [
    {
      content: 'Filtra i prossimi appuntamenti con i bottoni o il calendario',
      selector: '.elemento1', // Selettore CSS dell'elemento
    },
    {
      content: 'Visualizza gli appuntamenti giornalieri',
      selector: '.elemento2', // Selettore CSS dell'elemento
    },
    {
      content: 'Vedi a primo impatto il numero di appuntamenti mensilmente, clicca sul giorno per aprire il popup',
      selector: '.elemento3', // Selettore CSS dell'elemento
    },
  ];

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
    const rightDate = moment(value).format('DD-MM-YYYY')
    const eventsForDate = events?.filter(event => moment(event.date).format('YYYY-MM-DD') === formattedDate);
    const content = (
      <div>
        {eventsForDate?.length > 0 && eventsForDate.map((event) => {
          const formattedTime = moment(event.date).format('HH:mm');
          return(
            <p>{event.title} - {formattedTime}</p>
        )})}
      </div>
    );
    return (
      <Popover placement="top" title={rightDate} content={content}>
        {eventsForDate.length > 0 && 
        <ul style={{padding: '20px 0'}}>
            {isMobile() ? 
            <li className='li-calendar'>
              {eventsForDate.length > 0 ? eventsForDate.length : ''}
            </li> :
            <li className='li-calendar'>
              {eventsForDate.length > 1 ? eventsForDate.length + ' eventi' : '1 evento'}
            </li>}
        </ul>
        }
      </Popover>
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
  const onCloseDrawer = () => {
    setOpenDrawerApp(false)
  }
  const handleEditNewApp = (newEvent) => {
    const updatedEvents = events.map(event => {
      if (event._id === newEvent._id){
        return newEvent;
      } else {
        return event;
      }
    });
    setEvents(updatedEvents)
  }
  const isMobile = () => {
    return window.innerWidth <= 768;
  };
  const [mobileView, setMobileView] = useState("app")
  return (
    <div className='home-content'>
      <div className='top-calendar'>
        {isMobile() && <button className='primary-contained-btn' onClick={() => handleDateClick(eventAppointment)}>+ Aggiungi</button>}
        <PageTitle title={"Calendario"} />
        <div className='filter-appointment elemento1'>
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
        {isMobile() &&             
        <div className='help-top' style={{marginTop: '1rem'}}>
              <div onClick={() => setMobileView("app")} className={mobileView === "app" ? 'active' : 'elemento2'}>
                <span></span>
                <p>Appuntamenti</p>
              </div>
              <hr />
              <div onClick={() => setMobileView("cal")} className={mobileView === "cal" ? 'active' : 'elemento3'}>
                <span></span>
                <p>Calendario</p>
              </div>
            </div>}
          {isMobile() ? 
          <div className='calendar-container'>
            {mobileView === "app" ?
            <div>
            <Affix offsetTop={160}>
              <h4>Prossimi appuntamenti</h4>
              <ul className={mobileView === "app" ? 'elemento2' : ''}>
                {events && events.length > 0 && events?.filter(event => {
                    const eventDate = moment(event.date).format('DD-MM-YYYY');
                    return eventDate === moment(eventAppointment).format("DD-MM-YYYY");
                }).length > 0 ? events?.filter(event => {
                    const eventDate = moment(event.date).format('DD-MM-YYYY');
                    return eventDate === moment(eventAppointment).format("DD-MM-YYYY");
                }).map((event, index) => {
                    const formattedDate = moment(event.date).format('DD-MM-YYYY');
                    const formattedTime = moment(event.date).format('HH:mm');
                  return(
                  <li style={{cursor: 'pointer'}} key={index} onClick={() => {setOpenDrawerApp(true); setDrawerEvent(event)}}>
                    <strong>Data:</strong> {formattedDate}, <strong>Ora:</strong> {formattedTime} <br />
                    <strong>Candidato:</strong> {event.candidate.name + ' ' + event.candidate.surname}, <br />
                    <strong>Posizione lavorativa:</strong> {event.jobPosition}
                  </li>
                )}): <p style={{margin: '30px 0', fontWeight: '600'}}>Non ci sono appuntamenti oggi</p>}
              </ul>
              </Affix>
            </div> :
            <div className={mobileView === "cal" ? 'elemento3' : ''}>
              <Calendar
              dateCellRender={events && dateCellRender}
              onSelect={handleDateClick}
              mode="month"
              locale={{ locale: 'it' }}
            />
            </div>}
          </div> :
          <div className='calendar-container'>
            <div>
            <Affix offsetTop={160}>
              <h4>Prossimi appuntamenti</h4>
              <ul className='elemento2'>
                {events && events.length > 0 && events?.filter(event => {
                    const eventDate = moment(event.date).format('DD-MM-YYYY');
                    return eventDate === moment(eventAppointment).format("DD-MM-YYYY");
                }).length > 0 ? events?.filter(event => {
                    const eventDate = moment(event.date).format('DD-MM-YYYY');
                    return eventDate === moment(eventAppointment).format("DD-MM-YYYY");
                }).map((event, index) => {
                    const formattedDate = moment(event.date).format('DD-MM-YYYY');
                    const formattedTime = moment(event.date).format('HH:mm');
                  return(
                  <li style={{cursor: 'pointer'}} key={index} onClick={() => {setOpenDrawerApp(true); setDrawerEvent(event)}}>
                    <strong>Data:</strong> {formattedDate}, <strong>Ora:</strong> {formattedTime} <br />
                    <strong>Candidato:</strong> {event.candidate.name + ' ' + event.candidate.surname}, <br />
                    <strong>Posizione lavorativa:</strong> {event.jobPosition}
                  </li>
                )}): <p style={{margin: '30px 0', fontWeight: '600'}}>Non ci sono appuntamenti oggi</p>}
              </ul>
              </Affix>
            </div>
            <div className='elemento3 calendario'>
              <Calendar
              dateCellRender={events && dateCellRender}
              onSelect={handleDateClick}
              mode="month"
              locale={{ locale: 'it' }}
            />
            </div>
          </div>}

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
        handleEditNewApp={handleEditNewApp}
        id={user._id}
         />}
        <Drawer
            title="Info appuntamento"
            width={isMobile() ? '85%' : 500}
            className='drawer-dash'
            onClose={onCloseDrawer}
            open={openDrawerApp}
            placement='right'
            extra={
            <Space>
                <button className='outlined-primary-btn' onClick={onCloseDrawer}>
                OK
                </button>
            </Space>
            }
        >
            <h2>{drawerEvent?.title}</h2>
            <p>{moment(drawerEvent?.date).format("DD-MM-YYYY")} - {moment(drawerEvent?.date).format('HH:mm')}</p>
            <p>{drawerEvent?.description}</p>
            <hr />
            <div className='modal-candidate-data'>
              <div>
                  <p>Nome:</p>
                  <p>{drawerEvent?.candidate.name + ' ' + drawerEvent?.candidate.surname}</p>
              </div>
              <div>
                  <p>Email:</p>
                  <p>{drawerEvent?.candidate.email}</p>
              </div>
              <div>
                  <p>Cellulare:</p>
                  <p>{drawerEvent?.candidate?.phone}</p>
              </div>
              <div>
                  <p>Città</p>
                  <p>{drawerEvent?.candidate?.city}</p>
              </div>
              <div>
                  <p>Titolo</p>
                  <p>{drawerEvent?.candidate?.degree}</p>
              </div>
              <div>
                  <p>Posizione</p>
                  <p>{drawerEvent?.candidate.jobPosition}</p>
              </div>
              <a className='allegati' href={`https://quizjobs-production.up.railway.app/uploads/${drawerEvent?.candidate.cv}`}><img src={allegati} alt='documento link'/>Scarica CV</a>
          </div>
        </Drawer>
        <Tour
        isOpen={openTour && tour === "calendar"}
        onRequestClose={() => {setOpenTour(false)}}
        steps={steps}
        rounded={5}
      />
    </div>
  )
}

export default CalendarComponent