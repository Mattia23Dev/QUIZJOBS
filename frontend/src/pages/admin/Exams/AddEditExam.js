import React,{useState,useEffect} from 'react';
import PageTitle from '../../../components/PageTitle';
import { Form, Row, Col, message, Tabs, DatePicker, Select, Popconfirm } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { addExam, deleteQuestionFromExam, editExam, getExamById } from '../../../apicalls/exams';
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
import 'antd/dist/antd.css';
import leftArrow from '../../../imgs/leftarrow.png'
import rightArrow from '../../../imgs/arrowright.png'
import edit from '../../../imgs/edit.png'
import move from '../../../imgs/move.png'
import cancel from '../../../imgs/cancel.png'
import { setDatiGenerali } from '../../../redux/createTestSlice';
const { Option } = Select;

const DomandeComponent = ({ domande, onUpdateDomande }) => {
   const [currentDomanda, setCurrentDomanda] = useState(domande[0]);
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
            <img alt='edit question' src={edit} onClick={() => handleDomandaClick(domanda, index)} />
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
             <li className={currentDomanda.rispostaCorretta && risposta === currentDomanda.rispostaCorretta.risposta ? "risposta risposta-corretta" : "risposta"} key={index}><span>{lettera.substring(0, 1)}</span> {risposta}</li>
           ))}
         </ul>
       </div>
     </div>
   );
 };
 

function AddEditExam({setBigLoading}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {id} = useParams()
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  const [examData,setExamData] = useState();
  const [activeTab, setActiveTab] = useState(1);
  const [showAddEditQuestionModal, setShowAddEditQuestionModal] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [questions, setQuestions] = useState();
  const [showQuestions, setShowQuestions] = useState(false);
  const [copyLink, setCopyLink] = useState(false);
  const [preview, setPreview] = useState(false);
  const [link, setLink] = useState("");
  const idUser = useSelector(state=>state.users.user._id);
  const datiGenerali = useSelector(state => state.domanda?.datiGenerali);
  const [config, setConfig] = useState({
      numOfQuestions: datiGenerali?.numOfQuestions || 30,
      difficulty: datiGenerali?.difficulty || '',
      generalSector: datiGenerali?.generalSector || '',
      jobPosition: datiGenerali?.jobPosition || '',
      testLanguage: datiGenerali?.testLanguage || '',
      skills: datiGenerali?.skills || [''],
      deadline: datiGenerali?.deadline || null,
  });

  const handleCopyLink = (examLink) => {
    navigator.clipboard.writeText(examLink)
      .then(() => {
        message.success('Link copiato negli appunti');
      })
      .catch((error) => {
        // Gestione degli errori
        console.error('Si è verificato un errore durante la copia del link:', error);
        message.error('Si è verificato un errore durante la copia del link');
      });
  };

  useEffect(() => {
    if (datiGenerali){
      setConfig(datiGenerali);
    }
  }, [datiGenerali])

   const handleChange = (selectedItems) => {
    setConfig(prevConfig => ({ ...prevConfig, difficulty: selectedItems }));
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
                  opzioni[letteraOpzione] = testoOpzione;
              }
          }
  
          let rispostaMatch = righe[righe.length - 1].match(/(Risposta:|Risposta corretta:) ([A-D]\)) (.+)/);
          if (rispostaMatch) {
              const letteraRispostaCorretta = rispostaMatch[2];
              const rispostaEffettiva = rispostaMatch[3].replace(/\*+$/, '');
              rispostaCorretta = { lettera: letteraRispostaCorretta, risposta: rispostaEffettiva };
          } else {
              rispostaMatch = righe[righe.length - 1].match(/- ([A-D]\)) (.+)/);
              if (rispostaMatch) {
                  const letteraRispostaCorretta = rispostaMatch[1];
                  const rispostaEffettiva = rispostaMatch[2].replace(/\*+$/, '');
                  rispostaCorretta = { lettera: letteraRispostaCorretta, risposta: rispostaEffettiva };
              }
          }
  
          domandeArray.push({
              domanda: testoDomanda,
              opzioni: opzioni,
              rispostaCorretta: rispostaCorretta
          });
      });
  
      return domandeArray;
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
      Assicurati di non inserire opzioni che non centrano con il contesto della domanda o del ruolo, Assicurati di fare domande non banali e specifiche alle competenze fornite: ${config.skills.join(', ')}, con difficoltà ${config.difficulty}, nella lingua ${config.testLanguage}.`;

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
        dispatch(setDatiGenerali(config));
        setBigLoading(true);
        const response = await client.chat.completions.create(requestData);
        console.log(response.choices);
        const allQuestions = [];
        response.choices.forEach(async  (choice) => {
            const domandeOggetto = await convertiStringaInOggetti(choice.message.content);
            const domandeFiltrate = domandeOggetto.filter(domanda => domanda.rispostaCorretta !== null && Object.keys(domanda.opzioni).length > 3);
            allQuestions.push(...domandeFiltrate);
        });
        
        console.log(allQuestions);
        setQuestions(allQuestions);

        setShowQuestions(true);
        setActiveTab(2);
        setBigLoading(false);
        setPreview(true);
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
         idEsame: uniqueId,
       };

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
        setLink(response.data.examLink);
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
       };
       const handlePreviewClick = () => {
      
        const queryParams = new URLSearchParams();
        queryParams.append('domande', JSON.stringify(questions));
        const url = `/admin/exams/add/preview?${queryParams.toString()}`;
      
        navigate(url, { target: '_blank' });
      };

  return (
      <div className='home-content'>
        <div className='copy-preview'>
          {!examData && !id ? <button className={!copyLink ? 'copy-link' : 'copy-link-active'}><img src={!copyLink ? copia : copiablu} alt='copia link skilltest' />Copia link</button> : <button onClick={() => handleCopyLink(link)} className='copy-link-active'><img src={copiablu} alt='copia link skilltest' />Copia link</button>}
          <a onClick={preview ? handlePreviewClick : null} className={preview ? 'preview': 'preview-disabled'}><img src={eye} alt='Anteprima skilltest' />Anteprima</a>
        </div>
          <div className='create-exam-top'>
            <div onClick={() => setActiveTab(1)} className={activeTab === 1 ? 'active' : ''}>
              <span></span>
              <p>Dettagli test</p>
            </div>
            <hr />
            <div onClick={() => setActiveTab(2)} className={activeTab === 2 ? 'active' : ''}>
              <span></span>
              <p>Domande</p>
            </div>
            <hr />
            <div onClick={() => setActiveTab(3)} className={activeTab === 3 ? 'active' : ''}>
              <span></span>
              <p>Candidati</p>
            </div>
          </div>
          {(examData || !id) &&
          activeTab === 1 ?
          <div className='create-exam-body'>
          <PageTitle title={"Genera un nuovo test"} style={{textAlign: 'center', fontWeight: '600', marginTop: '20px'}} />
          <button className='button-ligh-blue' onClick={() => navigate('/admin/exams')}>Visualizza test salvati</button>
          <Form layout="vertical" onFinish={generateQuestions} initialValues={examData} className="create-exam-form">
            <Row gutter={[10,10]}>
                  <Col flex="auto">
                    <Form.Item label="Settore" name="general-sector">
                      <input type="text" value={config.generalSector || ''}  onChange={(e) => setConfig(prevConfig => ({ ...prevConfig, generalSector: e.target.value }))} />
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
                      <select value={config.testLanguage} onChange={(e) => setConfig(prevConfig => ({ ...prevConfig, testLanguage: e.target.value }))}>
                          <option value="">Seleziona</option>
                          <option value="Italiano">Italiano</option>
                          <option value="Inglese">Inglese</option>
                          <option value="Tedesco">Tedesco</option>
                          <option value="Spagnolo">Spagnolo</option>
                          <option value="Francese">Francese</option>
                          <option value="Portoghese">Portoghese</option>
                      </select>
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
                      <select value={config.difficulty} onChange={(e) => setConfig(prevConfig => ({ ...prevConfig, difficulty: e.target.value }))}>
                          <option value="">Seleziona</option>
                          <option value="Facile">Facile</option>
                          <option value="Medio">Medio</option>
                          <option value="Difficile">Difficile</option>
                      </select>
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
              <div className='flex justify-center gap-2 flex-column items-center' style={{flexDirection: 'column', marginTop: '40px'}}>
                <button className='primary-outlined-btn w-25 cursor-pointer' type="submit">
                    Genera test
                </button>
                <button className='btn btn-link'
                style={{ textDecoration: 'underline', cursor: 'pointer', backgroundColor: 'transparent', border: 'none' }}
                onClick={()=>navigate('/admin/exams')}
                >
                    Annulla
              </button>
              </div>
            {id && <Tabs.TabPane tab="Questions" key="3">
                <div className='flex justify-end'> 
                <button className="primary-outlined-btn cursor-pointer"
                type="button"
                onClick={()=>{
                setShowAddEditQuestionModal(true)
                }}>Add Question</button>
                </div>
            </Tabs.TabPane>}
          </Form>
          </div> : activeTab === 2 ? 
          <div className='create-exam-body'>
            <PageTitle title={"Domande"} style={{textAlign: 'center', fontWeight: '600', marginTop: '20px'}} />
              <div className='flex justify-end'> 
                <button className="button-ligh-blue"
                onClick={()=>{
                setShowAddEditQuestionModal(true)
                }}>+ Aggiungi domanda</button>
              </div>
              {showQuestions && questions && 
              <div className='domande-container-save'>
                    <a onClick={() => setActiveTab(1)}><img alt='left arrow' src={leftArrow} /> Torna ai dettagli del test</a>
                    <DomandeComponent domande={questions} onUpdateDomande={handleUpdateDomande} />
                    <button onClick={onFinish}><img alt='arrow right' src={rightArrow} />Salva e Genera Test</button>
              </div>}
          </div> : 
          <div>
            <PageTitle title={"Candidati"} style={{textAlign: 'center', fontWeight: '600', marginTop: '20px'}} />
          </div>}
          {showAddEditQuestionModal&&<AddEditQuestion   setShowAddEditQuestionModal={setShowAddEditQuestionModal}
          showAddEditQuestionModal={showAddEditQuestionModal}
          examId = {id}
          refreshData = {getExamDataById}
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
          />}
      </div>    
  )
}

export default AddEditExam