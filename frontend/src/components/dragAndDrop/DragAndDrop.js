import React, { useState } from 'react';
import ContainerCards from './ContainerCards';

const typesHero = ['Candidati', 'Contattati', 'Colloquio', 'Scartati', 'Assunti'];

const DragAndDrop = ({status, initialData}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [listItems, setListItems] = useState(initialData);

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

    return (
        <div className="grid">
            {
                typesHero.map(container => (
                    <ContainerCards
                        items={listItems}
                        status={container}
                        key={container}
                        isDragging={isDragging}
                        handleDragging={handleDragging}
                        handleUpdateList={handleUpdateList}
                    />
                ))
            }
        </div>
    );
};

export default DragAndDrop;