import React,{useState,useEffect} from 'react';
import PageTitle from '../../../components/PageTitle';
import { Form, Row, Col, message, Segmented, DatePicker, Select, Popconfirm, Modal } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { addExam, addTrackLink, deleteQuestionFromExam, deleteTrackLink, editExam, getExamById } from '../../../apicalls/exams';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import AddEditQuestion from './AddEditQuestion';
import locale from 'antd/es/date-picker/locale/it_IT'; 
import './addEditTest.css';
import openai from 'openai';
import copia from '../../../imgs/copia.png';
import copiablu from '../../../imgs/copiablu.png';
import eye from '../../../imgs/eye.png';
import leftArrow from '../../../imgs/leftarrow.png'
import rightArrow from '../../../imgs/arrowright.png'
import edit from '../../../imgs/edit.png'
import move from '../../../imgs/move.png'
import logo from '../../../imgs/logo.png'
import cancel from '../../../imgs/cancel.png'
import track from '../../../imgs/track.png'
import { useLocation } from 'react-router-dom';
import Tour from 'reactour'
const { Option } = Select;

const DomandeComponent = ({ domande, onUpdateDomande, setSelectedQuestion, setShowAddEditQuestionModal }) => {
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
            <img alt='edit question' src={edit} onClick={() => {setSelectedQuestion(domanda); setShowAddEditQuestionModal(true)}} />
            <img
            className='drag-handle'
            src={move}
            draggable
            />
             <p onClick={() => handleDomandaClick(domanda, index)}><span>{index + 1}.</span>{domanda.domanda}</p>
           </div>
         ))}
       </div>
       <div className="domanda-attuale">
         <p><span>{currentDomandaIndex + 1}.</span>{currentDomanda.domanda}</p>
         <ul className="opzioni">
           {Object.entries(currentDomanda.opzioni).map(([lettera, risposta], index) => (
             <li className={currentDomanda.rispostaCorretta && risposta.trim() === currentDomanda.rispostaCorretta.risposta ? "risposta risposta-corretta" : "risposta"} key={index}><span>{lettera.substring(0, 1)}</span> {risposta}</li>
           ))}
         </ul>
       </div>
     </div>
   );
 };
 

function AddEditExam({setBigLoading, openTour, setOpenTour, tour}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {id, tag} = useParams()
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  const [examData,setExamData] = useState();
  const [activeTab, setActiveTab] = useState(1);
  const [showAddEditQuestionModal, setShowAddEditQuestionModal] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [questions, setQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showTrackLink, setShowTrackLink] = useState(false);
  const [passaOltre, setPassaOltre] = useState(1);
  const [copyLink, setCopyLink] = useState(false);
  const [trackLink, setTrackLink] = useState("");
  const [domandaType, setDomandaType] = useState("Caratteriali");
  const [categoryType, setCategoryType] = useState("Attitudinali e Soft skills")
  const [trackLinkArray, setTrackLinkArray] = useState([]);
  const [examId, setExamId] = useState(null);
  const user = useSelector(state=>state.users.user)
  const [preview, setPreview] = useState(false);
  const [link, setLink] = useState("");
  const [addOurModule, setAddOurModule] = useState(false);
  const storedConfig = JSON.parse(localStorage.getItem('config'));
  const [config, setConfig] = useState({
      numOfQuestions: 20,
      difficulty: '',
      generalSector: '',
      jobPosition: '',
      testLanguage: '',
      skills: [''],
      deadline: null,
      description: '',
      tag: tag,
  });
  const location = useLocation();
  const { storedQuestions } = location.state ?? {};
  const steps = [
    {
      content: tag === "ai" || tag === 'mix' ? 'Compila il modulo per fornire all\'AI istruzioni su come deve essere il Test' : 'Inserisci le informazioni dell\'annuncio di lavoro',
      selector: '.elemento1', // Selettore CSS dell'elemento
    },
    {
      content: 'Modifica le domande a tuo piacimento, puoi aggiungere anche un modulo aggiuntivo con domande non in focus sulle competenze',
      selector: '.elemento2', // Selettore CSS dell'elemento
    },
    {
      content: 'Inserisci i moduli che vuoi inserire nel test, crea delle domande oppure scegli le nostre.',
      selector: '.elemento3', // Selettore CSS dell'elemento
    },
    {
      content: 'Condividi il link del test, e crea dei link appositi per i vari canali che utilizzi',
      selector: '.elemento4', // Selettore CSS dell'elemento
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link)
      .then(() => {
        message.success('Link copiato negli appunti');
      })
      .catch((error) => {
        console.error('Si è verificato un errore durante la copia del link:', error);
        message.error('Si è verificato un errore durante la copia del link');
      });
  };

  const handleCopyTrackLink = (name) => {
    const baseUrl = link;
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

   const handleChange = (selectedItems) => {
    setConfig(prevConfig => ({ ...prevConfig, skills: selectedItems }));
  };

   const generateUniqueId = (length) => {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    };

   function convertiStringaInOggetti(stringaDomande) {
      const domandeArray = [];
      const domandeSeparate = stringaDomande.split(/\d+\.\s+/).filter(Boolean);
  
      domandeSeparate.forEach(domanda => {
          const righe = domanda.split('\n').filter(Boolean);
          const testoDomanda = righe[0].trim();
          const opzioni = {};
          let rispostaCorretta = null;
  
          for (let i = 1; i < righe.length - 1; i++) {
              const opzioneMatch = righe[i].match(/- ([A-D]\)) (.+)/);
              if (opzioneMatch) {
                  const letteraOpzione = opzioneMatch[1];
                  const testoOpzione = opzioneMatch[2];
                  opzioni[letteraOpzione] = testoOpzione.trim();
              }
          }
  
          let rispostaMatch = righe[righe.length - 1].match(/(Risposta:|Risposta corretta:) ([A-D]\)) (.+)/);
          if (rispostaMatch) {
              const letteraRispostaCorretta = rispostaMatch[2];
              const rispostaEffettiva = rispostaMatch[3].replace(/\*+$/, '');
              rispostaCorretta = { lettera: letteraRispostaCorretta, risposta: rispostaEffettiva.trim() };
          } else {
              rispostaMatch = righe[righe.length - 1].match(/- ([A-D]\)) (.+)/);
              if (rispostaMatch) {
                  const letteraRispostaCorretta = rispostaMatch[1];
                  const rispostaEffettiva = rispostaMatch[2].replace(/\*+$/, '');
                  rispostaCorretta = { lettera: letteraRispostaCorretta, risposta: rispostaEffettiva.trim() };
              }
          }
  
          domandeArray.push({
              domanda: testoDomanda.trim(),
              opzioni: opzioni,
              rispostaCorretta: rispostaCorretta
          });
      });
  
      return domandeArray;
  }

  const handleSetInStorageQuestion = async (questions) => {
    localStorage.setItem("questions", JSON.stringify(questions));
  }

   const generateQuestions = async () => {
    console.log(config);
      if (!config.numOfQuestions || !config.difficulty || !config.generalSector || !config.jobPosition || !config.testLanguage || config.skills.length < 1) {
         console.error('Tutti i campi di config devono essere definiti.');
         return;
     }
      const client = new openai.OpenAI({
         apiKey: apiKey,
         dangerouslyAllowBrowser: true,
         model: 'gpt-4-turbo-preview',
       });
       const exampleFormat = `### Domande per Full Stack Developer

      1. In JavaScript, cosa restituisce 'typeof NaN'?
      - A) "number"
      - B) "NaN"
      - C) "undefined"
      - D) "error"
      - **Risposta corretta: A) "number"**
    
      2. Quale funzione di WordPress permette di aggiungere un nuovo tipo di post personalizzato?
      - A) add_new_post_type()
      - B) register_post_type()
      - C) create_post_type()
      - D) new_post_type()
      - **Risposta corretta: B) register_post_type()**
       
       `;
      const prompt = `Immagina di essere un recruiter e devi testare le competenze di un candidato per un'offerta lavorativa per la posizione ${config.jobPosition}. Genera ${config.numOfQuestions} domande a risposta multipla con 4 possibilità e con le rispettive risposte. Ripeti le stesse risposte SOLO SE NECESSARIO inserirle nel contesto della domanda. 
      Assicurati di non inserire opzioni che non centrano con il contesto della domanda o del ruolo, Assicurati di fare domande non banali e specifiche alle competenze fornite: ${config.skills.join(', ')}, con difficoltà ${config.difficulty}, nella lingua ${config.testLanguage}.
      Descrizione della difficoltà delle domande, prendi in considerazione il campo sopra con la discrezione sotto:
       - Facile (Junior): Le domande si concentrano su concetti di base e conoscenze fondamentali legate alle competenze junior. Utilizza un linguaggio chiaro e comprensibile.
       - Medio (Middle): Le domande coinvolgono scenari più realistici e situazioni di lavoro quotidiane che richiedono una comprensione più approfondita delle competenze. Coinvolgi terminologia tecnica più avanzata e problemi che richiedono una valutazione critica.
       - Difficile (Senior): Le domande sono complesse e richiedono un'elevata competenza e esperienza. Coinvolgi scenari pratici e problemi avanzati che richiedono una solida comprensione del dominio e una valutazione strategica.       
      `;

      const requestData = {
         max_tokens: 2600, 
         n: 2,
         model: 'gpt-4-turbo-preview',
         messages: [
            { role: 'system', content: prompt},
            { role: 'user', content: exampleFormat },
         ],
         stop: ['Domanda'],
         temperature: 0.7,
         top_p: 1,
         frequency_penalty: 0,
         presence_penalty: 0,
         format: 'json'
       };
    
      try {
        setBigLoading(true);
        localStorage.setItem('config', JSON.stringify(config));
        const response = await client.chat.completions.create(requestData);
        console.log(response.choices);
        const allQuestions = [];
        for (const choice of response.choices) {
          const domandeOggetto = await convertiStringaInOggetti(choice.message.content);
          const domandeFiltrate = domandeOggetto.filter(domanda => domanda.rispostaCorretta !== null && Object.keys(domanda.opzioni).length > 3);
          allQuestions.push(...domandeFiltrate);
        }
        
        console.log(allQuestions);
        setQuestions(allQuestions);
        setShowQuestions(true);
        setActiveTab(2);
        setPassaOltre(2);
        setBigLoading(false);
        setPreview(true);
        handleSetInStorageQuestion(allQuestions);
      } catch (error) {
        console.error('Errore durante la generazione delle domande:', error);
        setBigLoading(false);
      }
    };

  const onFinish = async() => {
     try{
       dispatch(ShowLoading())

       const uniqueId = generateUniqueId(6);
       const examData = {
         numOfQuestions: config.numOfQuestions,
         difficulty: config.difficulty,
         generalSector: config.generalSector,
         jobPosition: config.jobPosition,
         testLanguage: config.testLanguage,
         skills: config.skills,
         domande: questions, 
         deadline: config.deadline,
         idEsame: uniqueId,
         userId: user._id,
         description: config.description,
         tag: config.tag,
       };
       console.log(examData)
       let response;
       if(id){
         response = await editExam(examData, id)
       }
       else{
         response = await addExam(examData);
       }
       dispatch(HideLoading())
       if(response.success){
        message.success(response.message)
        setActiveTab(3);
        setCopyLink(true);
        setExamId(response.data._id);
        setLink(response.data.examLink);
        setPassaOltre(3);
        localStorage.removeItem("config");
        localStorage.removeItem("questions");
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
            setExamData(response.data)
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

  useEffect(() => {
    if (storedQuestions && storedQuestions !== null){
      setQuestions(storedQuestions)
      if (storedConfig){
        setConfig(storedConfig)
      }
      setActiveTab(2)
      setPreview(true)
      setPassaOltre(2)
      setShowQuestions(true)
    }
  }, [])
  console.log(config)
  const deleteQuestionById = async(questionId) => {
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

      const handleUpdateDomande = (updatedDomande) => {
         setQuestions(updatedDomande);
         handleSetInStorageQuestion(updatedDomande);
       };
       const handlePreviewClick = () => {
      
        const url = `/admin/exams/add/preview`;
      
        window.open(url, '_blank');
      };

      const addTrackLinkInput = async () => {
        if (trackLink === ""){
          window.alert("Inserire link track");
          return;
        }
        const reqPayload = {
          nome: trackLink,
          examId: examId
       }
       console.log(reqPayload);
       try {
        const response = await addTrackLink(reqPayload);
        console.log(response)
        if (response.success){
          message.success("Link creato")
          setTrackLinkArray(response.data);
          setTrackLink("");
        }
       } catch (error) {
        console.log(error);
       }
      }

      const deleteTrackLinkF = async (trackLink) => {
        const reqPayload = {
          nome: trackLink,
          examId: examId
       }
        try {
          const response = await deleteTrackLink(reqPayload);
          console.log(response)
          if (response.success){
            message.success("Link eliminato")
            setTrackLinkArray(response.data);
          }
        } catch (error) {
          console.log(error);
        }
      }

      const aggiungiDomanda = (domanda) => {
        const nuoveDomande = [...questions, domanda];
        setQuestions(nuoveDomande);
        handleSetInStorageQuestion(nuoveDomande)
      };

      const modificaDomanda = (domandaModificata) => {
        const domandeModificate = questions.map(domanda => {
          if (domanda.domanda === domandaModificata.domanda) {
            return domandaModificata;
          }
          return domanda;
        });
      
        setQuestions(domandeModificate);
        handleSetInStorageQuestion(domandeModificate);
      };

      const nextTab = () => {
        console.log(config);
        if (!config.numOfQuestions || !config.difficulty || !config.generalSector || !config.jobPosition || !config.testLanguage || config.skills.length < 1) {
           console.error('Tutti i campi di config devono essere definiti.');
           return;
       }
        localStorage.setItem('config', JSON.stringify(config));
        setActiveTab(2)
        setShowQuestions(true);
        setPassaOltre(2);
      }

  return (
      <div className='home-content'>
        {tag === "manual" &&
        <div onClick={() => setAddOurModule(true)} className='add-our-question'>
          <span>+</span> Aggiungi i nostri moduli
        </div>}
        <div className='copy-preview'>
          {trackLinkArray && trackLinkArray.length > 0 && <button onClick={() => setShowTrackLink(true)} className='copy-link-active'><img src={track} alt='track link skilltest' />Track link</button>}
          {!examData && !id ? <button onClick={copyLink ? handleCopyLink : null} className={!copyLink ? 'copy-link' : 'copy-link-active'}><img src={!copyLink ? copia : copiablu} alt='copia link skilltest' />Copia link</button> : <button onClick={() => handleCopyLink()} className='copy-link-active'><img src={copiablu} alt='copia link skilltest' />Copia link</button>}
          {tag!=="manual" &&<a onClick={preview ? handlePreviewClick : null} className={preview ? 'preview': 'preview-disabled'}><img src={eye} alt='Anteprima skilltest' />Anteprima</a>}
        </div>
          <div className={tag === "mix" ? 'create-exam-top2' : 'create-exam-top'}>
            <div onClick={() => setActiveTab(1)} className={activeTab === 1 ? 'active' : 'elemento1'}>
              <span></span>
              <p>Dettagli test</p>
            </div>
            <hr />
            {tag === "mix" &&
            <div onClick={passaOltre < 2 ? null : () => setActiveTab(4)} style={passaOltre < 2 ? {cursor: 'not-allowed'} : null} className={activeTab === 4 ? 'active' : 'elemento3'}>
              <span></span>
              <p>Moduli</p>
            </div>}
            {tag === "mix" && <hr />}
            <div onClick={passaOltre < 2 ? null : () => setActiveTab(2)} style={passaOltre < 2 ? {cursor: 'not-allowed'} : null} className={activeTab === 2 ? 'active' : 'elemento2'}>
              <span></span>
              <p>Domande</p>
            </div>
            <hr />
            <div onClick={passaOltre < 3 ? null : () => setActiveTab(3)} style={passaOltre < 3 ? {cursor: 'not-allowed'} : null} className={activeTab === 3 ? 'active' : 'elemento4'}>
              <span></span>
              <p>Candidati</p>
            </div>
          </div>
          {(examData || !id) &&
          activeTab === 1 ?
          <div className={activeTab === 1 ? 'create-exam-body elemento1' : 'create-exam-body'}>
          <PageTitle title={"Genera un nuovo test"} style={{textAlign: 'center', fontWeight: '600', marginTop: '20px'}} />
          <button className='button-ligh-blue' onClick={() => navigate('/admin/exams')}>Visualizza test salvati</button>
          <Form layout="vertical" onFinish={tag === "manual" ? nextTab : generateQuestions} initialValues={examData} className="create-exam-form">
            <Row gutter={[10,10]}>
                  <Col flex="auto">
                    <Form.Item label="Settore" name="general-sector">
                      <input type="text" value={config.generalSector} onChange={(e) => setConfig(prevConfig => ({ ...prevConfig, generalSector: e.target.value }))} />
                    </Form.Item>
                  </Col>
                  <Col flex="auto">
                    <Form.Item label="Job position" name="job-position">
                      <input type="text" value={config.jobPosition}  onChange={(e) => setConfig(prevConfig => ({ ...prevConfig, jobPosition: e.target.value }))}/>
                    </Form.Item>
                  </Col>
            </Row>
            <Row style={{margin: '20px 0'}} gutter={[10,10]}>      
                  <Col flex="auto">
                    <Form.Item label="Lingua del test" name="test-language">
                      <Select className='ant-styiling' value={config.testLanguage} onChange={(value) => setConfig(prevConfig => ({ ...prevConfig, testLanguage: value }))}>
                          <option value="">Seleziona</option>
                          <option value="Italiano">Italiano</option>
                          <option value="Inglese">Inglese</option>
                          <option value="Tedesco">Tedesco</option>
                          <option value="Spagnolo">Spagnolo</option>
                          <option value="Francese">Francese</option>
                          <option value="Portoghese">Portoghese</option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col flex="auto">
                    <Form.Item label="Deadline" name="deadline">
                    <DatePicker className='datepicker' locale={locale} value={config.deadline} onChange={(date, dateString) => setConfig(prevConfig => ({ ...prevConfig, deadline: dateString }))} />
                    </Form.Item>
                  </Col>
            </Row>
            <Row gutter={[10,10]}>    
                  <Col span={12}>
                    <Form.Item label="Difficoltà" name="seniority">
                      <Select className='ant-styiling' value={config.difficulty} onChange={(value) => setConfig(prevConfig => ({ ...prevConfig, difficulty: value }))}>
                          <option value="">Seleziona</option>
                          <option value="Facile">Facile</option>
                          <option value="Medio">Medio</option>
                          <option value="Difficile">Difficile</option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Competenze" name="skills">
                        <Select
                          mode="tags"
                          style={{ width: '100%' }}
                          className='tag-antd'
                          placeholder="Aggiungi una competenza"
                          onChange={handleChange}
                          value={config.skills}
                        >
                          {config.skills.map(tag => (
                            <Option key={tag} value={tag}>{tag}</Option>
                          ))}
                        </Select>
                    </Form.Item>
                  </Col>
              </Row>
              <Row gutter={[10,10]}>
                <Col span={24}>
                  <Form.Item label="Descrizione" name="description">
                    <textarea placeholder='Inserisci la descrizione' value={config.description} onChange={(e) => setConfig(prevConfig => ({ ...prevConfig, description: e.target.value }))} />
                  </Form.Item>
                </Col>
              </Row>
              <div className='flex justify-center gap-2 flex-column items-center' style={{flexDirection: 'column', marginTop: '40px'}}>
                {tag === "ai" || tag === "mix" ? 
                <button className='primary-outlined-btn w-25 cursor-pointer' type="submit">
                    Genera test
                </button> : 
                <button className='primary-outlined-btn w-25 cursor-pointer' type="submit">
                    Aggiungi le domande
                </button>}
                <button className='btn btn-link'
                style={{ textDecoration: 'underline', cursor: 'pointer', backgroundColor: 'transparent', border: 'none' }}
                onClick={()=>navigate('/admin/exams')}
                >
                    Annulla
              </button>
              </div>
          </Form>
          </div> : activeTab === 2 ? 
          <div className={activeTab === 2 ? 'create-exam-body elemento2' : 'create-exam-body'}>
            <PageTitle title={"Domande"} style={{textAlign: 'center', fontWeight: '600', marginTop: '20px'}} />
              <div className='flex justify-end'> 
                <button className="button-ligh-blue"
                onClick={()=>{
                setShowAddEditQuestionModal(true)
                }}>+ Aggiungi domanda</button>
              </div>
              {showQuestions && questions.length > 0 && 
              <div className='domande-container-save'>
                    <a onClick={() => setActiveTab(1)}><img alt='left arrow' src={leftArrow} /> Torna ai dettagli del test</a>
                    {tag === "manual" ? 
                    <DomandeMixComponent 
                    domande={questions} 
                    onUpdateDomande={handleUpdateDomande}
                    setSelectedQuestion={setSelectedQuestion}
                    setShowAddEditQuestionModal={setShowAddEditQuestionModal} />
                    :
                    <DomandeComponent 
                    domande={questions} 
                    onUpdateDomande={handleUpdateDomande}
                    setSelectedQuestion={setSelectedQuestion}
                    setShowAddEditQuestionModal={setShowAddEditQuestionModal} />}
                    <button onClick={onFinish}><img alt='arrow right' src={rightArrow} />Salva e Genera Test</button>
              </div>}
          </div> : activeTab === 4 ?
            <div className={activeTab === 4 ? 'moduli elemento3' : 'moduli'}>
                <PageTitle title={"Aggiungi moduli"} style={{textAlign: 'center', fontWeight: '600', marginTop: '20px'}} />
                <h4>Scegli uno dei nostri test pre creati, o passa direttamente alla sezione domande.</h4>
                <div className='moduli-container'>
                    <div>
                      <h4>Test linguistico</h4>
                    </div>
                    <div>
                      <h4>Test attitudinale</h4>
                    </div>
                </div>
              </div>
           : 
          <div className={activeTab === 3 ? 'candidati-add-exam elemento4' : 'candidati-add-exam'}>
            <PageTitle title={"Candidati"} style={{textAlign: 'center', fontWeight: '600', marginTop: '20px'}} />
            <h4>Non ci sono ancora candidati, <b>condividi il link</b> per profilare i tuoi talenti, puoi inserire il link nell'offerta
              di lavoro su Linkedin o Indeed. <br /><br />
            </h4>
            <div>
                <h2>Traccia la provenienza dei candidati</h2> 
                <p>Puoi generare un link per il test con un nome di tracciamento che imposti tu (es. Linkedin, Indeed, Email ecc..)</p>
                <input value={trackLink} onChange={(e) => setTrackLink(e.target.value)} type='text' placeholder='Tracciamento' />
                <button onClick={addTrackLinkInput} className='primary-outlined-btn'>Crea link tracciato</button>
             </div>
          </div>}
          {showAddEditQuestionModal&&<AddEditQuestion tag={tag} editQuestionInExam={modificaDomanda} addQuestionToExam={aggiungiDomanda}   setShowAddEditQuestionModal={setShowAddEditQuestionModal}
          showAddEditQuestionModal={showAddEditQuestionModal}
          examId = {id}
          refreshData = {getExamDataById}
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
          />}
      {showTrackLink &&
        <Modal
        title={"Track Link"} 
         open={showTrackLink}
         width={'40%'}
         footer={false} onCancel={()=>{
         setShowTrackLink(false)
         }}>
            <div className='tracklink-modal-container'>
              {trackLinkArray.length > 0 && trackLinkArray.map((trackLink, index) => (
                <div>
                  <button className='copy-link-track' key={index} onClick={() => handleCopyTrackLink(trackLink)}>Link {trackLink}</button>
                  <img alt='delete track link skilltest' onClick={() => deleteTrackLinkF(trackLink)} src={cancel} />
                </div>
              ))}
            </div>   
         </Modal>}
         <Modal
                  title={
                    <div className="modal-header">
                        <img style={{width: '15%'}} src={logo} alt="logo skilltest" />
                    </div>
                    } 
         open={addOurModule}
         width={'70%'}
         footer={false} onCancel={()=>{
         setAddOurModule(false)
         }}>
            <div style={{display: 'flex', justifyContent: 'center', margin: '0px 0 20px 0'}}>
              <Segmented
                  options={['Attitudinali e Soft skills', 'Screening']}
                  onChange={(value) => {
                    console.log(value);
                    setCategoryType(value)
                  }}
                />
            </div>
            {categoryType === "Attitudinali e Soft skills" ? (
            <div style={{display: 'flex', justifyContent: 'center', margin: '0px 0 20px 0'}}>
              <Segmented
                  options={['Caratteriali', 'Problem solving', 'Creatività', 'Decision Making', 'Etica', 'Leadership', 'Relazioni']}
                  onChange={(value) => {
                    console.log(value);
                    setDomandaType(value)
                  }}
                />
                {domandaType === "Caratteriali" ? 
                <div>

                </div> : null}
            </div>
            ) : (
            <div style={{display: 'flex', justifyContent: 'center', margin: '0px 0 20px 0'}}>
                <div>
                  
                </div>
            </div>
            )} 
         </Modal>
         <Tour
        isOpen={openTour && tour === "addexam"}
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
           {domanda.opzioni ? <img alt='edit question' src={edit} onClick={() => {setSelectedQuestion(domanda); setShowAddEditQuestionModal(true)}} /> : null}
           <img
           className='drag-handle'
           src={move}
           draggable
           />
            <p onClick={() => handleDomandaClick(domanda, index)}><span>{index + 1}.</span>{domanda.domanda}</p>
          </div>
        ))}
      </div>
      <div className="domanda-attuale">
        <p><span>{currentDomandaIndex + 1}.</span>{currentDomanda.domanda}</p>
        {currentDomanda.opzioni && 
        <ul className="opzioni">
          {Object.entries(currentDomanda.opzioni).map(([lettera, risposta], index) => (
            <li className={currentDomanda.rispostaCorretta && risposta.trim() === currentDomanda.rispostaCorretta.risposta ? "risposta risposta-corretta" : "risposta"} key={index}><span>{lettera.substring(0, 1)}</span> {risposta}</li>
          ))}
        </ul>}
      </div>
    </div>
  );
};

export default AddEditExam