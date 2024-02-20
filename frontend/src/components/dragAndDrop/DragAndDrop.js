import React, { useEffect, useState } from 'react';
import CardItem from './CardItem';

const typesHero = ['Da contattare', 'Contattati', 'Colloquio', 'Scartati', 'Assunti'];

const DragAndDrop = ({status, initialData}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [listItems, setListItems] = useState(initialData);

    useEffect(() => {
        setListItems(initialData);
      }, [initialData]);

    const handleUpdateList = (id) => {
        let card = listItems.find(item => item.id === id);

        if (card && card.status !== status) {
            card.status = status;
            if (Array.isArray(listItems)) {
                setListItems(prev => ([
                    card,
                    ...prev.filter(item => item.id !== id)
                ]));
            }
        }
    };

    const handleDragging = dragging => setIsDragging(dragging);
    const handleDrop = (e) => {
        e.preventDefault();
        handleUpdateList(+e.dataTransfer.getData('text'), status);
        handleDragging(false);
      };
    
      const handleDragOver = (e) => e.preventDefault();

    return (
        <div className="grid">
            {
                typesHero.map(container => (
                 <div
                    className={`layout-cards ${isDragging ? 'layout-dragging' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <p>{container}</p>
                    {listItems.length > 0 && listItems.map((item) => container === item.status && <CardItem data={item} key={item.id} handleDragging={handleDragging} />)}
                  </div>
                ))
            }
        </div>
    );
};

export default DragAndDrop;