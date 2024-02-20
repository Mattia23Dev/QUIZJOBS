import React from 'react';
import './DragAndDrop.css'

const CardItem = ({ data, handleDragging }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text', `${data.id}`);
    handleDragging(true);
  };
  
  const handleDragEnd = () => handleDragging(false);

  return (
    <div
      className='card-container'
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <p>{data?.name + ' ' + data?.surname}</p>
    </div>
  );
};

export default CardItem;