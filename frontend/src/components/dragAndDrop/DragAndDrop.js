import React, { useEffect, useState } from 'react';
import CardItem from './CardItem';
import { changeCandidateStatus, getExamByUser } from '../../apicalls/exams';
import { useDispatch, useSelector } from 'react-redux'
import {FaSearch} from 'react-icons/fa'
import {message, Select} from 'antd'
import { HideLoading, ShowLoading } from '../../redux/loaderSlice';
import Tour from 'reactour'
const { Option } = Select;
const typesHero = ['Da contattare', 'Primo colloquio', 'Secondo colloquio', 'Offerta', 'Offerta accettata'];

const DragAndDrop = ({openTour, setOpenTour, tour, showAddCandidateModal, internal, setAddStatus, setShowAddCandidateModal, initialData, setInitialData, selectedCandidate, setShowInfoCandidateModal, setSelectedCandidate, openInfoIntCandidate, originalData, examIdInt, setChangeStatus}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [listItems, setListItems] = useState(initialData);
    const user = useSelector(state=>state.users.user)
    const dispatch = useDispatch()
    const [searchValue, setSearchValue] = useState("");
    const [filterCity, setFilterCity] = useState("tutti");
    const [filterTest, setFilterTest] = useState("tutti");
    const [filterScore, setFilterScore] = useState("tutti");
    const [filterTestOption, setFilterTestOption] = useState()
    const [cityOption, setCityOption] = useState()
    const steps = [
      {
        content: 'Filtra tutti i candidati',
        selector: '.elemento1', // Selettore CSS dell'elemento
      },
      {
        content: 'Trascina i candidati per cambiargli il percorso.',
        selector: '.elemento2', // Selettore CSS dell'elemento
      },
      {
        content: 'Aggiungi i candidati manualmente.',
        selector: '.elemento3', // Selettore CSS dell'elemento
      },
    ]
    const extractCities = (items) => {
      const citiesSet = new Set();
      items.forEach(item => {
        if (item.city) {
          const city = item.city.trim().toLowerCase();
          citiesSet.add(city);
        }
      });
      const citiesArray = [...citiesSet];
      setCityOption(citiesArray)
    };
    const searchCandidates = (candidates, searchTerm) => {
      if (internal){
        return candidates.filter(candidate => {
          const nomeCompleto = candidate.candidate.name + ' ' + candidate.candidate.surname;
          return candidate.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          candidate.candidate.surname.toLowerCase().includes(searchTerm.toLowerCase()) || 
          nomeCompleto.toLocaleLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.candidate.city?.toLocaleLowerCase().includes(searchTerm.toLowerCase());
        });
      } else {
        return candidates.filter(candidate => {
          return candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || candidate.surname.toLowerCase().includes(searchTerm.toLowerCase());
        });
      }
    };
    const handleSearchChange = (e) => {
      setSearchValue(e.target.value);
      const filteredCandidates = internal ? searchCandidates(originalData, e.target.value) : searchCandidates(initialData, e.target.value);
      setListItems(filteredCandidates);
      if (internal){
       setInitialData(filteredCandidates); 
      }
    };
    const getExamsData = async() => {
      try{
        const response = await getExamByUser(user._id)
        if(response.success){
         setFilterTestOption(response.data)
        }
        else{
         message.error(response.message)
        }
      }
      catch(error){
           dispatch(HideLoading())
           message.error(error.message)
      }
    }

    useEffect(() => {
        setListItems(initialData);
        extractCities(initialData)
        getExamsData()
      }, [initialData]);
      console.log(initialData)
    const handleDragging = dragging => setIsDragging(dragging);
    const handleDrop = async (e) => {
        e.preventDefault();
        const dataString = e.dataTransfer.getData('text');
        const draggedItem = JSON.parse(dataString);
        console.log(draggedItem)
        const { status } = e.currentTarget.dataset;
        console.log(status)
        const examId = draggedItem.examId;

        try {

          const response = !internal ? 
                await changeCandidateStatus({ userId: draggedItem.candidateId, examId: examId, newStatus: status }) :
                await changeCandidateStatus({ userId: draggedItem.candidate._id, examId: examIdInt, newStatus: status });
            console.log(response)

            if (response.success) {
              if (!internal){
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
              } else {
                const newData = initialData?.map(item => {
                  if (item.candidate._id === draggedItem.candidate._id) {
                    return { ...item, status: response.data.newStatus };
                  }
                  return item;
                });
                setChangeStatus(newData);
                setListItems(prevData =>
                  prevData.map(item => {
                    if (item.candidate._id === draggedItem.candidate._id) {
                      return { ...item, status: response.data.newStatus }; // Aggiorna solo lo status
                    }
                    return item;
                  })
                );
              }
          }
        } catch (error) {
          console.error('Errore durante il cambiamento dello stato del candidato:', error);
        }
    
        handleDragging(false);
      };
    
      const handleDragOver = (e) => e.preventDefault();

    return (
      <div>
        <div className='filter-crm'>
          <div className={internal && 'search-internal'}>
            <FaSearch />
            <input type='text' placeholder='Cerca candidato o città' value={searchValue} onChange={handleSearchChange} />
          </div>
          {!internal && <div className='elemento1'>
            <div>
              <label>filtra per test:</label>
              <Select value={filterTest} onChange={(value) => setFilterTest(value)}>
                <Option value='tutti'>Tutti</Option>
                {filterTestOption && filterTestOption.length > 0 && filterTestOption.map((test) => (
                  <Option key={test._id} value={test._id}>{test.jobPosition}</Option>
                ))}
              </Select>
            </div>
            <div>
              <label>filtra per punteggio:</label>
              <Select value={filterScore} onChange={(value) => setFilterScore(value)}>
                <Option value='tutti'>Tutti</Option>
                <Option value='low'>0 - 40%</Option>
                <Option value='medium'>41% - 70%</Option>
                <Option value='high'>71% - 100%</Option>
              </Select>
            </div>
            <div>
              <label>filtra per città:</label>
              <Select value={filterCity} onChange={(value) => setFilterCity(value)}>
                <Option value='tutti'>Tutti</Option>
                {cityOption && cityOption.length > 0 && cityOption.map((city) => (
                  <Option key={city} value={city}>{city}</Option>
                ))}
              </Select>
            </div>
          </div>}
        </div>
        <div className="grid elemento2">
            {
                typesHero.map(container => (
                 <div
                    className={`layout-cards ${isDragging ? 'layout-dragging' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    data-status={container}
                  >
                    <p>{container}</p>
                    <button className='elemento3' onClick={() => {setShowAddCandidateModal(true); setAddStatus(container)}}>+</button>
                    <div className='drag-scroll'>
                    {listItems.length > 0 && listItems
                    .filter(item => {
                      if (filterCity === "tutti" && filterTest === "tutti" && filterScore === "tutti") {
                        return true;
                      }

                      let shouldInclude = true;

                      if (filterCity !== "tutti") {
                        if (!internal){
                          if (item.city.trim().toLowerCase() !== filterCity){
                            shouldInclude = false;
                          }
                        } else {
                          if (item.candidate.city.trim().toLowerCase() !== filterCity){
                            shouldInclude = false;
                          }
                        }
                      }

                      if (filterTest !== "tutti") {
                        if (!internal){
                          if (!item.tests.some(test => test.testId === filterTest)){
                            shouldInclude = false;
                          }
                        } else {
                          if (!item.tests.some(test => test.testId === filterTest)){
                            shouldInclude = false;
                          }
                        }
                      }

                      if (filterScore !== "tutti") {
                        const calculateScore = (test) => {
                          const { correctAnswers, totalQuestions } = test;
                          return (correctAnswers / totalQuestions) * 100;
                        };
                        
                        const testScore = !internal ? calculateScore(item.tests.find(test => test.testId === item.examId)) : item.report?.result?.percentage?.toFixed(2);
                        console.log(testScore)
                        if (filterScore === "low" && testScore > 40) {
                          shouldInclude = false;
                        }
                        if (filterScore === "medium" && (testScore <= 40 || testScore >= 70)) {
                          shouldInclude = false;
                          console.log('medio')
                        }
                        if (filterScore === "high" && testScore <= 70) {
                          shouldInclude = false;
                        }
                      }

                      return shouldInclude;
                    })
                    .map((item) => container === item.status && <CardItem internal={internal} setSelectedCandidate={setSelectedCandidate} selectedCandidate={selectedCandidate} setShowInfoCandidateModal={setShowInfoCandidateModal} openInfoIntCandidate={openInfoIntCandidate} data={item} key={item.id} handleDragging={handleDragging} />)}
                    </div>
                  </div>
                ))
            }
        </div>
        <Tour
        isOpen={openTour && tour === "crm"}
        onRequestClose={() => {setOpenTour(false)}}
        steps={steps}
        rounded={5}
      />
      </div>  
    );
};

export default DragAndDrop;