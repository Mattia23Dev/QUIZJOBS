import React,{useState,useEffect, useRef} from 'react';
import PageTitle from '../../../components/PageTitle';
import { Modal, message, Table, Segmented, Popconfirm, Popover, Select, Slider, Input, Switch } from 'antd';
import Highlighter from 'react-highlight-words';
import { UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { addExam, addTrackLink, deleteQuestionFromExam, deleteTrackLink, editExam, getExamById, modificaExam, updateCandidateNotes, updateCandidatePref } from '../../../apicalls/exams';
import { useDispatch } from 'react-redux';
import { SearchOutlined } from '@ant-design/icons';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import AddEditQuestion from './AddEditQuestion';
import copia from '../../../imgs/copia.png';
import { FaHeart } from 'react-icons/fa';
import filter from '../../../imgs/filter.png';
import copiablu from '../../../imgs/copiablu.png';
import eye from '../../../imgs/eye.png';
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
import Tour from 'reactour';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DragAndDrop from '../../../components/dragAndDrop/DragAndDrop';
const {Option} = Select

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

function InfoExam({openTour, setOpenTour, tour}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {id} = useParams()
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  const [examData,setExamData] = useState();
  const [showAddEditQuestionModal, setShowAddEditQuestionModal] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [candidates, setCandidates] = useState([])
  const [activeTab, setActiveTab] = useState(1);
  const [showDettagliTest, setShowDettagliTest] = useState(false);
  const [showInfoCandidateModal, setShowInfoCandidateModal] = useState();
  const [selectedCandidate, setSelectedCandidate] = useState();
  const [showTrackLink, setShowTrackLink] = useState(false);
  const [trackLink, setTrackLink] = useState("");
  const [visual, setVisual] = useState("list");
  const [pdfExtract, setPdfExtract] = useState({});
  const [scoreRange, setScoreRange] = useState([0, 100]);
  const [activePref, setActivePref] = useState(false);
  const [trackingFilter, setTrackingFilter] = useState('Tutti');
  const [questions, setQuestions] = useState();
  const [selNotes, setSelNotes] = useState('')
  const [config, setConfig] = useState({
   numOfQuestions: 30,
   difficulty: examData?.difficulty || "",
   generalSector: examData?.generalSector || "",
   jobPosition: examData?.jobPosition || "",
   testLanguage: examData?.testLanguage || "",
   skills: [examData?.skills] || ["",],
});
console.log(examData)
const [open, setOpen] = useState(false);
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  const handleSliderChange = (value) => {
    console.log('Slider Value:', value);
    setScoreRange(value)
    filterCandidates(value, trackingFilter, activePref);
  };
  const handleSwitchChange = (checked) => {
    setActivePref(checked);
    filterCandidates(scoreRange, trackingFilter, checked);
  };
  const handleSelectChange = (value) => {
    console.log('Select Value:', value);
    setTrackingFilter(value)
    filterCandidates(scoreRange, value, activePref);
  };
  const filterCandidates = (scoreRange, trackingFilter, activePref) => {
    const filtered = examData?.candidates?.filter(candidate => {
      const scoreInRange = candidate.report?.result?.percentage >= scoreRange[0] && candidate.report?.result?.percentage <= scoreRange[1];
      const trackingMatches = trackingFilter === 'Tutti' ? true : (
        trackingFilter === 'Nessuno' ? candidate.trackLink == "null" : candidate.trackLink === trackingFilter
      );
      const pref = activePref ? candidate.preferito === true : true;
      return scoreInRange && trackingMatches && pref;
    });
    setCandidates(filtered);
  };
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    console.log(selectedKeys)
    console.log(dataIndex)
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters, close) => {
    clearFilters();
    setSearchText('');
    close()
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 12,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Cerca il nome`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            display: 'block',
            gap: '10px'
          }}
        />
          <button
            className='btn-search-name'
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          >
            <SearchOutlined />
          </button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
    {
      const nomeCompleto = record.candidate.name + ' ' + record.candidate.surname;
      if (record.candidate.name) return record.candidate.name.toString().toLowerCase().includes(value.toLowerCase()) || record.candidate.surname.toString().toLowerCase().includes(value.toLowerCase()) || nomeCompleto.toString().toLowerCase().includes(value.toLowerCase())},
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text, record) =>
    searchedColumn === dataIndex ? (
      <>
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={record.candidate.name && record.candidate.surname ? record.candidate.name.toString() + ' ' + record.candidate.surname.toString() : ''}
        />
      </>
    ) : (
      <>
        {record.candidate.name && record.candidate.surname ? record.candidate.name + ' ' + record.candidate.surname : ''}
      </>
    ),
  });
  const getColumnSearchPropsCity = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 12,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Cerca la città`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            display: 'block',
            gap: '10px'
          }}
        />
          <button
            className='btn-search-name'
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          >
            <SearchOutlined />
          </button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) => 
    {
      if (record.candidate.city) return record.candidate.city.toString().toLowerCase().includes(value.toLowerCase())},
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text, record) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={record.candidate.city ? record.candidate.city : ''}
        />
      ) : (
        record.candidate.city
      ),
  });
const steps = [
  {
    content: 'Crea dei link con un nome di tracciamento che decidi tu',
    selector: '.elemento1', // Selettore CSS dell'elemento
  },
  {
    content: 'Vedi le info dei candidati, il punteggio e le risposte corrette',
    selector: '.elemento2', // Selettore CSS dell'elemento
  },
  {
    content: 'Modifica le domande',
    selector: '.elemento3', // Selettore CSS dell'elemento
  },
];
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
            setCandidates(response.data[0].candidates)
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

  const setPreferito = async (candidato, preferito) => {
    console.log(candidato)
    try {
      const payload = {
        idEsame: examData._id,
        idCandidato: candidato.candidate._id,
        preferito: preferito,
      }
      const response = await updateCandidatePref(payload)
      if (response.success){
        message.success(response.data.preferito ? 'Aggiunto ai preferiti' : 'Rimosso dai preferiti')
        const candidateAgg = response.data.candidate;
        setExamData(prevExamData => ({
          ...prevExamData,
          candidates: prevExamData.candidates.map(candidate => 
            candidate.candidate._id === candidateAgg ? { ...candidate, preferito: response.data.preferito } : candidate
          )
        }));

        setCandidates(prevCandidates => prevCandidates.map(candidate =>
          candidate.candidate._id === candidateAgg ? { ...candidate, preferito: response.data.preferito } : candidate
        ));
      }
    } catch (error) {
      console.error(error)
    }
  }

  const updateNotes = async (candidato, notes) => {
    try {
      const payload = {
        idEsame: examData._id,
        idCandidato: candidato._id,
        note: notes,
      }
      const response = await updateCandidateNotes(payload)
      if (response.success){
        message.success('Note aggiornate')
        const candidateAgg = response.data.candidate;
        console.log(response)
        setExamData(prevExamData => ({
          ...prevExamData,
          candidates: prevExamData.candidates.map(candidate => 
            candidate.candidate._id === candidateAgg ? { ...candidate, note: response.data.note } : candidate
          )
        }));

        setCandidates(prevCandidates => prevCandidates.map(candidate =>
          candidate.candidate._id === candidateAgg ? { ...candidate, note: response.data.note } : candidate
        ));
      }
    } catch (error) {
      console.error(error)
    }
  }

  const candidateColumns = [
    {
      title: "",
      dataIndex: "",
      key: "preferiti",
      render: (text, record) => {
        return(
        <span onClick={record.preferito ? () => setPreferito(record, "no") : () => setPreferito(record, "si")} style={{display: 'flex', alignItems: 'center', cursor:'pointer'}}><FaHeart color={record.preferito ? "#F95959" : 'grey'} size={15} /></span>
      )},
    },
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps('name'),
    },
    {
      title: "Tempo",
      dataIndex: "tempo",
      key: "tempo",
      render: (text, record) => {
        const totalSeconds = record.report ? Object.values(record?.report?.result?.allSeconds).reduce((accumulator, currentValue) => accumulator + currentValue, 0) : 0;
        const formattedTime = formatTime(totalSeconds);
        return(
        <span className={record?.report?.result?.percentage.toFixed(2) > 60 ? "time-column-green" : "time-column-red"}><img alt='tempo medio' src={record.report?.result?.percentage.toFixed(2) > 60 ? timegreen : timered} />{formattedTime && formattedTime}</span>
      )},
      sorter: {
        compare: (a, b) => Object.values(a?.report?.result?.allSeconds).reduce((accumulator, currentValue) => accumulator + currentValue, 0) - Object.values(b?.report?.result?.allSeconds).reduce((accumulator, currentValue) => accumulator + currentValue, 0),
        multiple: 2,
      },
    },
    {
      title: "Tracciamento",
      dataIndex: "tracciamento",
      key: "tracciamento",
      render: (text, record) => {
        return(
        <span className="custom-column-style">{record?.trackLink && record?.trackLink !== null && record?.trackLink !== "null" ? record.trackLink : 'Nessuno'}</span>
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
      ...getColumnSearchPropsCity('city'),
    },
    {
      title: "CV",
      dataIndex: "cv",
      key: "cv",
      render: (text, record) => (
        <a style={{textAlign: 'center', fontSize: '18px'}} href={record.candidate.cvUrl ? record.candidate.cvUrl : `https://quizjobs-production.up.railway.app/uploads/${record.candidate.cv}`} target="__blank" download>
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
            setPdfExtract({
              skills: record.skills,
              workExperience: record.workExperience,
              education: record.education,
            })
            setSelNotes(record.note ? record.note : '')
            setShowInfoCandidateModal(true);
          }}><b><u>Info</u></b></span>
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
      sorter: {
        compare: (a, b) => a?.report?.result?.percentage.toFixed(2) - b?.report?.result?.percentage.toFixed(2),
        multiple: 2,
      },
    },
  ];  

const handleUpdateDomande = (updatedDomande) => {
   setQuestions(updatedDomande);
 };
 const formattedSelectedQuestion = selectedQuestion && (examData?.tag === "manual" ? {
  domanda: selectedQuestion.question,
  opzioni: selectedQuestion.options,
} : {
  domanda: selectedQuestion.question,
  rispostaCorretta: {
    risposta: selectedQuestion.correctOption.replace(/^\w+\)\s*/, ''),
    lettera:selectedQuestion.correctOption.match(/^\w+\)\s*/)[0],
  },
  opzioni: selectedQuestion.options,
})

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
const isMobile = () => {
  return window.innerWidth <= 768;
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

const saveButtonQuestion = () => {
  if (questions === examData?.questions){
    return false
  } else {
    return true
  }
}
const onSaveNewQuestion = async () => {
  dispatch(ShowLoading())
  try {
    const payload = {
      tag: examData?.tag,
      questions: questions,
      examId: examData._id,
    }
    const response = await modificaExam(payload)
    console.log(response)
    if (response.success){
      message.success("Domande salvate")
      dispatch(HideLoading())
    }
  } catch (error) {
    console.error(error)
  }
}
const aggiungiDomanda = (domanda) => {
  const nuoveDomande = [...questions, domanda];
  setQuestions(nuoveDomande);
};

const modificaDomanda = (domandaModificata) => {
  const domandeModificate = questions.map(domanda => {
    if (domanda.question === domandaModificata.question) {
      return domandaModificata;
    }
    return domanda;
  });
  setSelectedQuestion(null)
  setQuestions(domandeModificate);
};
const [selectedRowKeys, setSelectedRowKeys] = useState([]);
const onSelectChange = (newSelectedRowKeys) => {
  console.log('selectedRowKeys changed: ', newSelectedRowKeys);
  setSelectedRowKeys(newSelectedRowKeys);
};
const rowSelection = {
  selectedRowKeys,
  onChange: onSelectChange,
};

  return (
    examData && <div className='home-content'>
      <div className='copy-preview'>
          <button onClick={handleCopyLink} className='copy-link-active'><img src={copiablu} alt='copia link skilltest' />Copia link</button>
          {examData?.trackLink && examData?.trackLink.length > 0 ? 
          <button onClick={() => setShowTrackLink(true)} className='copy-link-active elemento1'><img src={track} alt='track link skilltest' />Track link</button> :
          <button onClick={() => setShowTrackLink(true)} className='copy-link-active elemento1'><img src={track} alt='track link skilltest' />Track link</button>}
      </div>
      {activeTab === 1 && <div className='choose-visualize'>
        <Segmented
           options={[
            { label: <UnorderedListOutlined style={{ fontSize: '18px'}} />, value: 'list' },
            { label: <AppstoreOutlined style={{ fontSize: '18px'}} />, value: 'grid' }
          ]}
           onChange={(value) => {
              console.log(value);
              setVisual(value)
            }}
          />
          <Popover
            content={
              <div className='filter-container'>
                  <div>
                    <label>Filtra per punteggio</label>
                    <Slider range defaultValue={[0, 100]} onChange={handleSliderChange} /> 
                  </div>
                  <div>
                    <label>Filtra per tracciamento</label>
                    <Select defaultValue='Tutti' style={{ width: 120, marginLeft: '20px' }} onChange={handleSelectChange}>
                        <Option value="Tutti">
                          Tutti
                        </Option>
                        <Option value="Nessuno">
                          Nessuno
                        </Option>
                      {examData?.trackLink?.length > 0 && examData?.trackLink?.map((option, index) => (
                        <Option key={index} value={option}>
                          {option}
                        </Option>
                      ))}
                    </Select>                    
                  </div>
                  <div>
                    <label>Filtra per preferiti</label>
                    <Switch checked={activePref} onChange={handleSwitchChange} style={{ marginLeft: '20px' }} />
                  </div>
              </div>
            }
            trigger="click"
            placement="right"
            open={open}
            onOpenChange={handleOpenChange}
          >
            <button className='primary-outlined-btn'>Filtra <img alt='filter skilltest' src={filter} /></button>
        </Popover>
      </div>}
      <div className='create-exam-top cet-exam'>
            <div onClick={() => setActiveTab(1)} className={activeTab === 1 ? 'active' : 'elemento2'}>
              <span></span>
              <p>Candidati</p>
            </div>
            <hr />
            <div onClick={() => setActiveTab(2)} className={activeTab === 2 ? 'active' : 'elemento3'}>
              <span></span>
              <p>Domande</p>
            </div>
            <hr />
            <div onClick={() => setShowDettagliTest(true)} className={activeTab === 3 ? 'active' : ''}>
              <span></span>
              <p>Dettagli</p>
            </div>
      </div>
        {(examData || !id) &&
        activeTab === 1 ?
         <div className={activeTab === 1 ? 'info-exam-candidate elemento2' : 'info-exam-candidate'}>
            <PageTitle title={"Candidati"} style={{textAlign: 'center', fontWeight: '600', marginTop: '20px'}} />
            {visual === "list" ? 
            <Table
            rowSelection={rowSelection}
            columns={candidateColumns} dataSource={candidates} rowKey={(record) => record._id} 
            className="mt-1"
            expandable={{
              expandedRowRender: (record) => (
                <p
                  style={{
                    margin: 0,
                    textAlign: 'left'
                  }}
                >
                  {record?.candidate?.coverLetter ? record.candidate.coverLetter : 'Nessuna lettera di presentazione'}
                </p>
              ),
              rowExpandable: (record) => record?.name !== 'Not Expandable',
            }}>

            </Table> : 
            <DragAndDrop
            setPreferito={setPreferito}
            setSelectedCandidate={setSelectedCandidate}
            selectedCandidate={selectedCandidate} 
            setShowInfoCandidateModal={setShowInfoCandidateModal}
            setShowAddCandidateModal={null}
            showAddCandidateModal={null}
            originalData={examData?.candidates}
            examIdInt={examData?._id}
            setChangeStatus={(data) => {
              setExamData((exam) => ({ ...exam, candidates: data }))
              setCandidates(data)
              console.log(data)
            }}
            setInitialData={(data) => {
              setCandidates(data)
            }}
            tour={tour}
            openInfoIntCandidate={(data) =>{
              setShowInfoCandidateModal(true)
              setSelectedCandidate(data.candidate);
              setPdfExtract({
                skills: data.skills,
                workExperience: data.workExperience,
                education: data.education,
              })
              setSelNotes(data.note ? data.note : '')
            }}
            setOpenTour={setOpenTour}
            openTour={openTour}
            setAddStatus={null}
            internal={true}
            jobPosition={examData?.jobPosition}
            initialData={candidates} />}
         </div>
         : activeTab === 2 ?
         <div className={activeTab === 2 ? 'create-exam-body elemento3' : 'create-exam-body'}>
               <PageTitle title={"Domande"} style={{textAlign: 'center', fontWeight: '600', marginTop: '20px'}} />
               <div className='flex justify-end'> 
                  <button className="button-ligh-blue"
                  onClick={()=>{
                  setShowAddEditQuestionModal(true)
                  }}>+ Aggiungi domanda</button>
               </div>
               {examData?.questions.length > 0 && questions && 
               <div className='domande-container-save'>
                     <a onClick={() => setActiveTab(1)}><img alt='left arrow' src={leftArrow} /> Torna ai candidati</a>
                     {examData?.tag === "manual" ? 
                    <DomandeMixComponent 
                    domande={questions && questions} 
                    onUpdateDomande={handleUpdateDomande}
                    setSelectedQuestion={setSelectedQuestion}
                    setShowAddEditQuestionModal={setShowAddEditQuestionModal} />
                    :
                    <DomandeComponent 
                    domande={questions && questions} 
                    onUpdateDomande={handleUpdateDomande}
                    setSelectedQuestion={setSelectedQuestion}
                    setShowAddEditQuestionModal={setShowAddEditQuestionModal} />}
                    {saveButtonQuestion() && <button onClick={onSaveNewQuestion}><img alt='arrow right' src={rightArrow} />Modifica Test</button>}
               </div>}
         </div> :
         null
         }
        {showAddEditQuestionModal&&<AddEditQuestion creato={true}  editQuestionInExam={modificaDomanda} addQuestionToExam={aggiungiDomanda}   setShowAddEditQuestionModal={setShowAddEditQuestionModal}
         showAddEditQuestionModal={showAddEditQuestionModal}
         examId = {id}
         tag={examData?.tag}
         refreshData = {getExamDataById}
         selectedQuestion={formattedSelectedQuestion}
         setSelectedQuestion={setSelectedQuestion}
        />}
        {showInfoCandidateModal&&<InfoCandidate
        updateNotes={updateNotes}
        pdfExtract={pdfExtract}
        notes={selNotes}
        jobPosition={examData.jobPosition}
        tag={examData.tag}
        setShowInfoCandidateModal={setShowInfoCandidateModal}
        examQuestion={questions}
        showInfoCandidateModal={showInfoCandidateModal}
        selectedCandidate={selectedCandidate}
        setSelectedCandidate={setSelectedCandidate}
        examId = {id}
        />}
        {showDettagliTest &&
        <Modal
        width={isMobile() ? '100%':'55%'}
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
               <div className='dettagli-test-modal'>
                  <div>
                     <h4>Tipologia Test</h4>
                     <h4>{examData?.tag === "manual" ? "Manuale" : examData?.tag === "ai" ? "SkillTest Ai" : ""}</h4>
                  </div>
                  <div>
                     <h4>Tipo di contratto</h4>
                     <h4>{examData?.jobContract ? examData?.jobContract : ''}</h4>
                  </div>
               </div>
               <div className='dettagli-test-modal'>
                  <div>
                     <h4>Città</h4>
                     <h4>{examData?.jobCity ? examData?.jobCity : ''}</h4>
                  </div>
                  <div>
                     <h4>Tipo di contratto</h4>
                     <h4>{examData?.jobTypeWork ? examData?.jobTypeWork : ''}</h4>
                  </div>
               </div>
               <div className='dettagli-test-modal dtm-desc'>  
                  <div>
                     <h4>Descrizione Offerta</h4>
                     <h4><CKEditor
                          editor={ClassicEditor}
                          data={examData?.jobDescription ? examData.jobDescription : ''}
                          onChange={(event, editor) => {
                              const data = editor.getData();
                              setConfig(prevConfig => ({ ...prevConfig, jobDescription: data }))
                          }}
                          onReady={editor => {
                            const editable = editor.editing.view.document.getRoot();
                            editor.editing.view.change(writer => {
                                writer.setStyle('height', '300px', editable);
                            });
                        }}
                      /></h4>
                  </div>
               </div>
               <div className='dettagli-test-modal dtm-desc'>  
                  <div>
                     <h4>Descrizione Test</h4>
                     <h4>{examData?.description ? examData.description : ""}</h4>
                  </div>
               </div>
            </div>   
         </Modal>}
         {showTrackLink &&
          <Modal
          title={"Track Link"} 
          open={showTrackLink}
          width={isMobile() ? '95%' : '40%'}
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
      <Tour
        isOpen={openTour && tour === "infoexam"}
        onRequestClose={() => {setOpenTour(false)}}
        steps={steps}
        rounded={5}
      />
    </div>
  )
}

const DomandeMixComponent = ({ domande, onUpdateDomande, setSelectedQuestion, setShowAddEditQuestionModal }) => {
  const [currentDomanda, setCurrentDomanda] = useState(domande[0]);
  const [currentDomandaIndex, setCurrentDomandaIndex] = useState(0); // Inizializza l'indice della domanda corrente a 0
  const [confirmVisible, setConfirmVisible] = useState(Array(domande.length).fill(false));
  const [draggedDomanda, setDraggedDomanda] = useState(null);

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
    setDraggedDomanda(domanda);
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
   if (!draggedDomanda) return; // Se non c'è nessuna domanda trascinata, esci
   
   const droppedDomanda = JSON.parse(event.dataTransfer.getData('domanda'));
   const updatedDomande = [...domande]; // Crea una copia dell'array delle domande
   
   // Rimuovi la domanda trascinata dalla sua posizione originale
   const draggedIndex = updatedDomande.indexOf(draggedDomanda);
   if (draggedIndex !== -1) {
     updatedDomande.splice(draggedIndex, 1);
   }
   
   // Inserisci la domanda trascinata nella nuova posizione
   updatedDomande.splice(index, 0, droppedDomanda);
   
   onUpdateDomande(updatedDomande); // Aggiorna lo stato delle domande
   
   setDraggingIndex(null); // Resettare l'indice della domanda trascinata dopo il rilascio
   setDraggedDomanda(null); // Resetta la domanda trascinata
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
           {domanda.options ? <img alt='edit question' src={edit} onClick={() => {setSelectedQuestion(domanda); setShowAddEditQuestionModal(true)}} /> : null}
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
        <p><span>{currentDomandaIndex + 1}.</span>{currentDomanda.question}</p>
        {currentDomanda.options && 
        <ul className="opzioni">
          {Object.entries(currentDomanda.options).map(([lettera, risposta], index) => (
            <li className="risposta" key={index}><span>{lettera.substring(0, 1)}</span> {risposta}</li>
          ))}
        </ul>}
      </div>
    </div>
  );
};

export default InfoExam