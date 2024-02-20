import React from 'react';
import CardItem from './CardItem';

const ContainerCards = ({ items = [], status, isDragging, handleDragging, handleUpdateList }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    handleUpdateList(+e.dataTransfer.getData('text'), status);
    handleDragging(false);
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div
      className={`layout-cards ${isDragging ? 'layout-dragging' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <p>{status}</p>
      {items.map((item) => status === item.status && <CardItem data={item} key={item.id} handleDragging={handleDragging} />)}
    </div>
  );
};

export default ContainerCards;
