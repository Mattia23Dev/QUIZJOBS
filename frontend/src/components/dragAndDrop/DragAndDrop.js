import React, { useEffect, useState } from 'react';
import CardItem from './CardItem';
import { changeCandidateStatus } from '../../apicalls/exams';
import { useSelector } from 'react-redux'

const typesHero = ['Da contattare', 'Primo colloquio', 'Secondo colloquio', 'Offerta', 'Offerta accettata'];

const DragAndDrop = ({status, initialData, setInitialData, selectedCandidate, setShowInfoCandidateModal, setSelectedCandidate}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [listItems, setListItems] = useState(initialData);
    const user = useSelector(state=>state.users.user)

    useEffect(() => {
        setListItems(initialData);
      }, [initialData]);

    const handleDragging = dragging => setIsDragging(dragging);
    const handleDrop = async (e) => {
        e.preventDefault();
        const dataString = e.dataTransfer.getData('text'); // Ottengo la stringa JSON
        const draggedItem = JSON.parse(dataString);
        console.log(draggedItem)
        const { status } = e.currentTarget.dataset;
        console.log(status)
        const examId = draggedItem.examId;

        try {

          const response = await changeCandidateStatus({ userId: draggedItem.candidateId, examId: examId, newStatus: status });
            console.log(response)

            if (response.success) {
            setInitialData(prevData =>
              prevData.map(item => {
                if (item.candidateId === draggedItem.candidateId) {
                  return { ...item, status: response.data.newStatus }; // Aggiorna solo lo status
                }
                return item;
              })
            );
            setListItems(prevData =>
              prevData.map(item => {
                if (item.candidateId === draggedItem.candidateId) {
                  return { ...item, status: response.data.newStatus }; // Aggiorna solo lo status
                }
                return item;
              })
            );
          }
        } catch (error) {
          console.error('Errore durante il cambiamento dello stato del candidato:', error);
        }
    
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
                    data-status={container}
                  >
                    <p>{container}</p>
                    <button>+</button>
                    {listItems.length > 0 && listItems.map((item) => container === item.status && <CardItem setSelectedCandidate={setSelectedCandidate} selectedCandidate={selectedCandidate} setShowInfoCandidateModal={setShowInfoCandidateModal} data={item} key={item.id} handleDragging={handleDragging} />)}
                  </div>
                ))
            }
        </div>
    );
};

export default DragAndDrop;