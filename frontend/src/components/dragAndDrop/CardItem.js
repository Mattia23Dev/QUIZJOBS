import React from 'react';
import './DragAndDrop.css'
import eye from '../../imgs/eye.png'
import test from '../../imgs/test.png'
import timeem from '../../imgs/timeem.png'
import allegati from '../../imgs/allegati.png'
import moment from 'moment';

const CardItem = ({ data, handleDragging, setSelectedCandidate, setShowInfoCandidateModal, selectedCandidate }) => {
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

  return (
    <div
      className='card-container'
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <p>{data?.name + ' ' + data?.surname} <img alt='guarda candidato skilltest' onClick={() => infoCandidate(data)} src={eye} /></p>
      <p><span>Posizione</span><span>{data?.jobPosition}</span></p>
      <div>
        <p><img alt='allegati' src={allegati} /> 1</p>
        <p><img alt='numero test skilltest' src={test} /> {data?.tests?.length}</p>
        <p><img alt='tempo di creazione' src={timeem} /> {daysSinceCreation} Days</p>
      </div>
    </div>
  );
};

export default CardItem;