import React from 'react';
import './DragAndDrop.css'
import eye from '../../imgs/eye.png'
import test from '../../imgs/test.png'
import timeem from '../../imgs/timeem.png'
import allegati from '../../imgs/allegati.png'
import timered from '../../imgs/timered.png'
import timegreen from '../../imgs/timegreen.png'
import { FaHeart } from 'react-icons/fa';
import moment from 'moment';

const CardItem = ({ data, internal, handleDragging, jobPosition, setPreferito, setSelectedCandidate, setShowInfoCandidateModal, selectedCandidate,openInfoIntCandidate }) => {
  const handleDragStart = (e) => {
    const dataString = JSON.stringify(data);
    e.dataTransfer.setData('text', dataString);
    handleDragging(true);
  };
  const daysSinceCreation = moment().diff(moment(data?.createdAt), 'days');
  const handleDragEnd = () => {
    if (data) {
      handleDragging(false);
      //console.log(data)
    } else {
      console.error('Invalid data:', data);
    }
  };

  const infoCandidate = (data) => {
    setSelectedCandidate(data);
    setShowInfoCandidateModal(true)
  }
  const handleTouchStart = (e) => {
    const dataString = JSON.stringify(data);
    e.dataTransfer.setData('text', dataString);
    handleDragging(true);
};
const handleTouchEnd = () => {
  if (data) {
      handleDragging(false);
  } else {
      console.error('Invalid data:', data);
  }
};
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
const totalSeconds = data.report ? Object.values(data?.report?.result?.allSeconds).reduce((accumulator, currentValue) => accumulator + currentValue, 0) : 0;
const formattedTime = formatTime(totalSeconds);

  return (
    <div
      className={internal ? 'card-container card-internal' : 'card-container'}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {internal && <span className={data?.report?.result?.percentage.toFixed(2) > 60 ? "punteggio-crm-green":"punteggio-crm-red"}>{data?.report?.result?.percentage.toFixed(0)}%</span>}
      <p>{!internal ? data?.name + ' ' + data?.surname : data?.candidate?.name + ' ' + data?.candidate?.surname} <img alt='guarda candidato skilltest' onClick={!internal ? () => infoCandidate(data) : () => openInfoIntCandidate(data)} src={eye} /></p>
      {internal && <p className='email-crm'>{data?.candidate?.email}</p>}
      {internal && <p className='email-crm'>{data?.candidate?.city}</p>}
      {!internal ? <p><span>Posizione</span><span>{data?.jobPosition}</span></p> :
      <span className={data?.report?.result?.percentage.toFixed(2) > 60 ? "time-crm-green":"time-crm-red"}><img alt='tempo medio' src={data?.report?.result?.percentage.toFixed(2) > 60 ? timegreen : timered} />{formattedTime && formattedTime}</span>}
      {!internal ? <div>
        <p><img alt='allegati' src={allegati} /> 1</p>
        <p><img alt='numero test skilltest' src={test} /> {data?.tests?.length}</p>
        <p><img alt='tempo di creazione' src={timeem} /> {daysSinceCreation} Days</p>
      </div> :
      <div className="custom-download-link">
        <span onClick={data.preferito ? () => setPreferito(data, "no") : () => setPreferito(data, "si")} style={{display: 'flex', alignItems: 'center', cursor:'pointer'}}><FaHeart color={data.preferito ? "#F95959" : 'grey'} size={15} /></span>
        <a style={{textAlign: 'center', fontSize: '18px'}} href={data.candidate.cvUrl ? data.candidate.cvUrl : `https://quizjobs-production.up.railway.app/uploads/${data?.candidate?.cv}`} target="__blank" download>
          <i className="ri-download-line" />
        </a>
      </div>}
    </div>
  );
};

export default CardItem;