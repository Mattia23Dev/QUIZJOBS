import React,{useState,useEffect} from 'react';
import PageTitle from '../../../components/PageTitle';
import { Modal, message, Table, Popconfirm } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { addExam, addTrackLink, deleteQuestionFromExam, deleteTrackLink, editExam, getExamById } from '../../../apicalls/exams';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import AddEditQuestion from './AddEditQuestion';
import copia from '../../../imgs/copia.png';
import copiablu from '../../../imgs/copiablu.png';
import eye from '../../../imgs/eye.png';
import 'antd/dist/antd.css';
import leftArrow from '../../../imgs/leftarrow.png'
import rightArrow from '../../../imgs/arrowright.png'
import edit from '../../../imgs/edit.png'
import move from '../../../imgs/move.png'
import time from '../../../imgs/time.png'
import cancel from '../../../imgs/cancel.png'
import track from '../../../imgs/track.png'
import timered from '../../../imgs/timered.png'
import timegreen from '../../../imgs/timegreen.png'
import InfoCandidate from './InfoCandidate';
import moment from 'moment';
import './infoExam.css'

const DomandeComponent = ({ domande, onUpdateDomande, setSelectedQuestion, setShowAddEditQuestionModal }) => {
   const [currentDomanda, setCurrentDomanda] = useState(domande[0]);
   console.log(currentDomanda);
   const [currentDomandaIndex, setCurrentDomandaIndex] = useState(0); // Inizializza l'indice della domanda corrente a 0
   const [confirmVisible, setConfirmVisible] = useState(Array(domande.length).fill(false));

   const handleConfirm = () => {
     const filteredDomande = domande.filter(domanda => domanda !== currentDomanda);
     onUpdateDomande(filteredDomande);
     setCurrentDomanda(domande[0]);
     const updatedConfirmVisible = [...confirmVisible];
     const index = domande.indexOf(currentDomanda);
     updatedConfirmVisible[index] = false;
     setConfirmVisible(updatedConfirmVisible); 
   };
 
   const handleCancel = () => {
    setConfirmVisible(Array(domande.length).fill(false));
   };
 
   const handleDomandaClick = (domanda, index) => {
     setCurrentDomanda(domanda);
     setCurrentDomandaIndex(index)
   };
 
   const [draggingIndex, setDraggingIndex] = useState(null); // Stato per tener traccia dell'indice della domanda che viene trascinata

   const handleDragStart = (event, domanda, index) => {
     event.dataTransfer.setData('domanda', JSON.stringify(domanda));
     setDraggingIndex(index); // Imposta l'indice della domanda che viene trascinata
   };
   
   const handleDragOver = (event) => {
     event.preventDefault();
   };
   
   const handleDragEnter = (index) => {
     setDraggingIndex(index); // Imposta l'indice della domanda su cui passa sopra
   };
   
   const handleDragLeave = () => {
     setDraggingIndex(null); // Resettare l'indice della domanda quando si lascia l'area di trascinamento
   };
   
   const handleDrop = (event, index) => {
     const droppedDomanda = JSON.parse(event.dataTransfer.getData('domanda'));
     const updatedDomande = Array.from(domande);
     const currentIndex = updatedDomande.indexOf(droppedDomanda);
     
     // Rimuovi la domanda dalla sua posizione precedente
     updatedDomande.splice(currentIndex, 1);
     
     // Aggiungi la domanda nella nuova posizione
     updatedDomande.splice(index, 0, droppedDomanda);
     
     // Aggiorna lo stato delle domande con la nuova posizione della domanda
     onUpdateDomande(updatedDomande);
   
     setDraggingIndex(null); // Resettare l'indice della domanda trascinata dopo il rilascio
   };
 
   return (
     <div className="domande-container">
       <div className="lista-domande">
         {domande.map((domanda, index) => (
           <div
             key={index}
             onDragStart={(event) => handleDragStart(event, domanda, index)} // Gestisci l'inizio del trascinamento sulla domanda
             onDragOver={handleDragOver}
             onDragEnter={() => handleDragEnter(index)} // Gestisci l'entrata del trascinamento sulla domanda
             onDragLeave={handleDragLeave} // Gestisci l'uscita del trascinamento dall'area della domanda
             onDrop={(event) => handleDrop(event, index)}
             className={`domanda-item ${currentDomanda === domanda ? "domanda-selected" : ""} ${draggingIndex === index ? "dragging" : ""}`}
             >
            <Popconfirm
              visible={confirmVisible[index]}
              title="Sei sicuro di voler eliminare?"
              onConfirm={() => handleConfirm(domanda)}
              onCancel={handleCancel}
              okText="Sì"
              cancelText="No"
              placement="top"
            >
            <img alt='cancel question' src={cancel} onClick={() => { setConfirmVisible((prevState) => {
                const updatedConfirmVisible = [...prevState];
                updatedConfirmVisible[index] = true;
                return updatedConfirmVisible;
              }); setCurrentDomanda(domanda) }} />
              </Popconfirm>
            <img alt='edit question' src={edit} onClick={() => {setSelectedQuestion(domanda); setShowAddEditQuestionModal(true)}} />
            <img
            className='drag-handle'
            src={move}
            draggable
            />
             <p onClick={() => handleDomandaClick(domanda, index)}><span>{index + 1}.</span>{domanda.question}</p>
           </div>
         ))}
       </div>
       <div className="domanda-attuale">
         <p><span>{currentDomandaIndex + 1}.</span>{currentDomanda?.question}</p>
         <ul className="opzioni">
           {Object.entries(currentDomanda?.options).map(([lettera, risposta], index) => {
            const opzioneLettera = lettera;
            const corretta = currentDomanda.correctOption && currentDomanda.correctOption.includes(opzioneLettera);
            return (
             <li className={corretta ? "risposta risposta-corretta" : "risposta"} key={index}><span>{lettera.substring(0, 1)}</span> {risposta}</li>
           )})}
         </ul>
       </div>
     </div>
   );
 };

function InfoExam() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {id} = useParams()
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  const [examData,setExamData] = useState();
  const [showAddEditQuestionModal, setShowAddEditQuestionModal] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [activeTab, setActiveTab] = useState(1);
  const [showDettagliTest, setShowDettagliTest] = useState(false);
  const [showInfoCandidateModal, setShowInfoCandidateModal] = useState();
  const [selectedCandidate, setSelectedCandidate] = useState();
  const [showTrackLink, setShowTrackLink] = useState(false);
  const [trackLink, setTrackLink] = useState("");
  const [questions, setQuestions] = useState();
  const [config, setConfig] = useState({
   numOfQuestions: 30,
   difficulty: examData?.difficulty || "",
   generalSector: examData?.generalSector || "",
   jobPosition: examData?.jobPosition || "",
   testLanguage: examData?.testLanguage || "",
   skills: [examData?.skills] || ["",],
});


const handleCopyLink = () => {
   navigator.clipboard.writeText(examData?.examLink)
     .then(() => {
       message.success('Link copiato negli appunti');
     })
     .catch((error) => {
       console.error('Si è verificato un errore durante la copia del link:', error);
       message.error('Si è verificato un errore durante la copia del link');
     });
 };

 const handlePreviewClick = () => {
      
   const queryParams = new URLSearchParams();
   queryParams.append('domande', JSON.stringify(examData?.questions));
   const url = `/admin/exams/add/preview?${queryParams.toString()}`;
 
   window.open(url, '_blank');
 };

  const getExamDataById = async(id) => {
      try{
         dispatch(ShowLoading())
         const response = await getExamById(id)
         dispatch(HideLoading())
         if(response.success){
            message.success(response.message)
            console.log(response.data);
            setExamData(response.data[0])
            setQuestions(response.data[0].questions)
            setConf(response.data[0])
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
  useEffect(()=>{
    if(id){
      getExamDataById(id)
    }
  },[])
  const deleteCandidateById = async (candidateId) => {
   console.log(candidateId);
  }
  const deleteQuestionById = async(questionId) =>{
    try{
      const reqPayload = {
         questionId: questionId
      }
      dispatch(ShowLoading())
      const response = await deleteQuestionFromExam(id,reqPayload)
      dispatch(HideLoading())
      if(response.success){
         message.success(response.message)
         getExamDataById(id)
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

  const setConf = (examData) => {
   setConfig({
     numOfQuestions: examData?.numOfQuestions,
     difficulty: examData?.difficulty,
     generalSector: examData?.generalSector,
     jobPosition: examData?.jobPosition,
     testLanguage: examData?.testLanguage,
     skills: examData?.skills,
   });
  }

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
  
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  const candidateColumns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span className="custom-column-style">{record.candidate.name} {record.candidate.surname}</span>
      ),
    },
    {
      title: "Tempo",
      dataIndex: "tempo",
      key: "tempo",
      render: (text, record) => {
        const totalSeconds = Object.values(record.report?.result?.allSeconds).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const formattedTime = formatTime(totalSeconds);
        return(
        <span className={record.report?.result?.percentage.toFixed(2) > 60 ? "time-column-green" : "time-column-red"}><img alt='tempo medio' src={record.report?.result?.percentage.toFixed(2) > 60 ? timegreen : timered} />{formattedTime && formattedTime}</span>
      )},
    },
    {
      title: "Tracciamento",
      dataIndex: "tracciamento",
      key: "tracciamento",
      render: (text, record) => {
        return(
        <span className="custom-column-style">{record?.trackLink && record?.trackLink !== null ? record.trackLink : 'Nessuno'}</span>
      )},
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text, record) => (
        <span className="custom-column-style">{record.candidate.email}</span>
      ),
    },
    {
      title: "Città",
      dataIndex: "city",
      key: "city",
      render: (text, record) => (
        <span className="custom-column-style">{record.candidate.city}</span>
      ),
    },
    {
      title: "CV",
      dataIndex: "cv",
      key: "cv",
      render: (text, record) => (
        <a style={{textAlign: 'center', fontSize: '18px'}} href={`http://localhost:8000/uploads/${record.candidate.cv}`} target="__blank" download className="custom-download-link">
          <i className="ri-download-line" />
        </a>
      ),
    },
    {
      title: "Scheda",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <div className="flex justify-center align-center gap-2 custom-action-column">
          <span style={{fontSize: '14px'}} className="cursor-pointer" onClick={() => {
            setSelectedCandidate(record.candidate);
            setShowInfoCandidateModal(true);
          }}><u>Info</u></span>
          {/*<i className="ri-delete-bin-line cursor-pointer" onClick={() => deleteCandidateById(record.candidate._id)}></i>*/}
        </div>
      ),
    },
    {
      title: "Punteggio",
      dataIndex: "punteggio",
      key: "punteggio",
      render: (text, record) => (
        <span className={record.report?.result?.percentage.toFixed(2) > 60 ? "punteggio-column-green":"punteggio-column-red"}>{record.report?.result?.percentage.toFixed(2)}%</span>
      ),
    },
  ];  

const handleUpdateDomande = (updatedDomande) => {
   setQuestions(updatedDomande);
 };
 const formattedSelectedQuestion = selectedQuestion && {
  domanda: selectedQuestion.question,
  rispostaCorretta: {
    risposta: selectedQuestion.correctOption.replace(/^\w+\)\s*/, ''),
    lettera:selectedQuestion.correctOption.match(/^\w+\)\s*/)[0],
  },
  opzioni: selectedQuestion.options,
};

const deleteTrackLinkF = async (trackLink) => {
  const reqPayload = {
    nome: trackLink,
    examId: examData._id
 }
  try {
    const response = await deleteTrackLink(reqPayload);
    console.log(response)
    if (response.success){
      message.success("Link eliminato")
      const updatedExamData = { ...examData };
      updatedExamData.trackLink = response.data;
      setExamData(updatedExamData);
    }
  } catch (error) {
    console.log(error);
  }
}

const handleCopyTrackLink = (name) => {
  const baseUrl = examData.examLink;
  const queryParam = encodeURIComponent(name);
  const trackLink = `${baseUrl}?name=${queryParam}`;
  
  navigator.clipboard.writeText(trackLink)
    .then(() => {
      message.success('Link copiato negli appunti');
    })
    .catch((error) => {
      console.error('Si è verificato un errore durante la copia del link:', error);
      message.error('Si è verificato un errore durante la copia del link');
    });
};

const addTrackLinkInput = async () => {
  if (trackLink === ""){
    window.alert("Inserire link track");
    return;
  }
  const reqPayload = {
    nome: trackLink,
    examId: examData._id
 }
 console.log(reqPayload);
 try {
  const response = await addTrackLink(reqPayload);
  console.log(response)
  if (response.success){
    message.success("Link creato")
    const updatedExamData = { ...examData };
    updatedExamData.trackLink = response.data;
    setExamData(updatedExamData);
    setTrackLink("");
  }
 } catch (error) {
  console.log(error);
 }
}

  return (
    examData && <div className='home-content'>
      <div className='copy-preview'>
          <button onClick={handleCopyLink} className='copy-link-active'><img src={copiablu} alt='copia link skilltest' />Copia link</button>
          {examData?.trackLink && examData?.trackLink.length > 0 ? 
          <button onClick={() => setShowTrackLink(true)} className='copy-link-active'><img src={track} alt='track link skilltest' />Track link</button> :
          <button onClick={() => setShowTrackLink(true)} className='copy-link-active'><img src={track} alt='track link skilltest' />Track link</button>}
      </div>
      <div className='create-exam-top'>
            <div onClick={() => setActiveTab(1)} className={activeTab === 1 ? 'active' : ''}>
              <span></span>
              <p>Candidati</p>
            </div>
            <hr />
            <div onClick={() => setActiveTab(2)} className={activeTab === 2 ? 'active' : ''}>
              <span></span>
              <p>Domande</p>
            </div>
            <hr />
            <div onClick={() => setShowDettagliTest(true)} className={activeTab === 3 ? 'active' : ''}>
              <span></span>
              <p>Dettagli test</p>
            </div>
      </div>
        {(examData || !id) &&
        activeTab === 1 ?
         <div className='info-exam-candidate'>
            <PageTitle title={"Candidati"} style={{textAlign: 'center', fontWeight: '600', marginTop: '20px'}} />
            <Table columns={candidateColumns} dataSource={examData?.candidates} rowKey={(record) => record._id} className="mt-1">

            </Table>
         </div>   
         : activeTab === 2 ?
         <div className='create-exam-body'>
               <PageTitle title={"Domande"} style={{textAlign: 'center', fontWeight: '600', marginTop: '20px'}} />
               <div className='flex justify-end'> 
                  <button className="button-ligh-blue"
                  onClick={()=>{
                  setShowAddEditQuestionModal(true)
                  }}>+ Aggiungi domanda</button>
               </div>
               {examData?.questions && questions && 
               <div className='domande-container-save'>
                     <a onClick={() => setActiveTab(1)}><img alt='left arrow' src={leftArrow} /> Torna ai candidati</a>
                     <DomandeComponent
                     domande={questions && questions} 
                     onUpdateDomande={handleUpdateDomande}
                     setSelectedQuestion={setSelectedQuestion}
                     setShowAddEditQuestionModal={setShowAddEditQuestionModal} />
               </div>}
         </div> :
         null
         }
        {showAddEditQuestionModal&&<AddEditQuestion   setShowAddEditQuestionModal={setShowAddEditQuestionModal}
         showAddEditQuestionModal={showAddEditQuestionModal}
         examId = {id}
         refreshData = {getExamDataById}
         selectedQuestion={formattedSelectedQuestion}
         setSelectedQuestion={setSelectedQuestion}
        />}
        {showInfoCandidateModal&&<InfoCandidate 
        jobPosition={examData.jobPosition}
        setShowInfoCandidateModal={setShowInfoCandidateModal}
        examQuestion={questions}
        showInfoCandidateModal={showInfoCandidateModal}
        selectedCandidate={selectedCandidate}
        setSelectedCandidate={setSelectedCandidate}
        examId = {id}
        />}
        {showDettagliTest &&
        <Modal
        title={"Dettagli Test"} 
         open={showDettagliTest}
         footer={false} onCancel={()=>{
         setShowDettagliTest(false)
         }}>
            <div className='dettagli-test-modal-container'>
               <div className='dettagli-test-modal'>
                  <div>
                     <h4>Settore generale</h4>
                     <h4>{examData?.generalSector}</h4>
                  </div>
                  <div>
                     <h4>Posizione lavorativa</h4>
                     <h4>{examData?.jobPosition}</h4>
                  </div>
               </div>   
               <div className='dettagli-test-modal'>
                  <div>
                     <h4>Lingua</h4>
                     <h4>{examData?.testLanguage}</h4>
                  </div>
                  <div>
                     <h4>Deadline</h4>
                     <h4>{examData?.deadline ? moment(examData.deadline).format('DD/MM/YYYY') : "Nessuna scadenza"}</h4>
                  </div>
               </div>
               <div className='dettagli-test-modal'>  
                  <div>
                     <h4>Difficoltà</h4>
                     <h4>{examData?.difficulty}</h4>
                  </div>
                  <div>
                     <h4>Competenze</h4>
                     <h4>{examData?.skills.map(skill => skill.charAt(0).toUpperCase() + skill.slice(1)).join(', ')}</h4>
                  </div>
               </div>
            </div>   
         </Modal>}
         {showTrackLink &&
          <Modal
          title={"Track Link"} 
          open={showTrackLink}
          width={'40%'}
          footer={false} onCancel={()=>{
          setShowTrackLink(false)
          }}>
            <div className='tracklink-modal-add'>
              <input type='text' value={trackLink} onChange={(e) => setTrackLink(e.target.value)} />
              <button className='primary-outlined-btn' onClick={addTrackLinkInput}>Aggiungi</button>
            </div>
              <div className='tracklink-modal-container'>
                {examData.trackLink && examData?.trackLink.length > 0 && examData?.trackLink.map((trackLink, index) => (
                  <div>
                    <button className='copy-link-track' key={index} onClick={() => handleCopyTrackLink(trackLink)}>Link {trackLink}</button>
                    <img alt='delete track link skilltest' onClick={() => deleteTrackLinkF(trackLink)} src={cancel} />
                  </div>
                ))}
              </div>   
         </Modal>}
    </div>
  )
}

export default InfoExam