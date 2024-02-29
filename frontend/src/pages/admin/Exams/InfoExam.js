import React,{useState,useEffect} from 'react';
import PageTitle from '../../../components/PageTitle';
import { Modal, message, Table, Popconfirm } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { addExam, deleteQuestionFromExam, editExam, getExamById } from '../../../apicalls/exams';
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
import cancel from '../../../imgs/cancel.png'
import InfoCandidate from './InfoCandidate';
import locale from 'antd/es/date-picker/locale/it_IT'; 
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
            />
            <img alt='cancel question' src={cancel} onClick={() => { setConfirmVisible((prevState) => {
                const updatedConfirmVisible = [...prevState];
                updatedConfirmVisible[index] = true;
                return updatedConfirmVisible;
              }); setCurrentDomanda(domanda) }} />
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

  const onFinish = async(values) => {
     try{
       dispatch(ShowLoading())
       let response;
       if(id){
         response = await editExam(values,id)
       }
       else{
         response = await addExam(values)
       }
       dispatch(HideLoading())
       if(response.success){
        message.success(response.message)
        navigate("/admin/exams")
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

const candidateColumns = [
   {
     title: "Nome completo",
     render: (text, record) => record.candidate.name + ' ' + record.candidate.surname
   },
   {
     title: "Email",
     render: (text, record) => record.candidate.email
   },
   {
     title: "Cellulare",
     render: (text, record) => record.candidate.phone
   },
   {
     title: "Città",
     render: (text, record) => record.candidate.city
   },
   {
     title: "Download CV",
     render: (text, record) => (
      <a href={`http://localhost:8000/uploads/${record.candidate.cv}`} target='__blank' download>
         <i className="ri-download-line" />
      </a>
     )
   },    
   {
     title: "Action",
     dataIndex: "action",
     render: (text,record) => {
       return <div className='flex gap-2'>
         <span className='cursor-pointer'
         onClick={()=>{
            setSelectedCandidate(record.candidate)
            setShowInfoCandidateModal(true)
         }}>Info</span>
         <i className='ri-delete-bin-line cursor-pointer' onClick={()=>{deleteCandidateById(record.candidate._id)}}></i>
       </div>
     }
   }
 ]

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

  return (
    examData && <div className='home-content'>
      <div className='copy-preview'>
          <button onClick={handleCopyLink} className='copy-link-active'><img src={copiablu} alt='copia link skilltest' />Copia link</button>
          <a onClick={handlePreviewClick} className='preview'><img src={eye} alt='Anteprima skilltest' />Anteprima</a>
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
                     <a onClick={() => setActiveTab(1)}><img alt='left arrow' src={leftArrow} /> Torna ai dettagli del test</a>
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
        {showInfoCandidateModal&&<InfoCandidate setShowInfoCandidateModal={setShowInfoCandidateModal}
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
                     <h4>{config?.generalSector}</h4>
                  </div>
                  <div>
                     <h4>Posizione lavorativa</h4>
                     <h4>{config?.jobPosition}</h4>
                  </div>
               </div>   
               <div className='dettagli-test-modal'>
                  <div>
                     <h4>Lingua</h4>
                     <h4>{config?.testLanguage}</h4>
                  </div>
                  <div>
                     <h4>Deadline</h4>
                     <h4>{config?.deadline ? config.deadline : "Nessuna scadenza"}</h4>
                  </div>
               </div>
               <div className='dettagli-test-modal'>  
                  <div>
                     <h4>Difficoltà</h4>
                     <h4>{config?.difficulty}</h4>
                  </div>
                  <div>
                     <h4>Competenze</h4>
                     <h4>{config?.skills.join(', ')}</h4>
                  </div>
               </div>
            </div>   
         </Modal>}
    </div>
  )
}

export default InfoExam