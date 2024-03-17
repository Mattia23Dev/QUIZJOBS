import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import PageTitle from '../../../components/PageTitle'
import {Table,message, Row, Modal, Popconfirm, Switch, Select} from 'antd'
import { MdMore } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux'
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice'
import { getAllExams, deleteExam, getExamByUser, changeStatusExam } from '../../../apicalls/exams'
import './index.css'
import moment from 'moment';
import candidateNumber from '../../../imgs/candidate.png'
import skilltest from '../../../imgs/skilltest.png'
import manual from '../../../imgs/manual.png'
import mix from '../../../imgs/mix.png'
import skt from '../../../imgs/skt.png'
import Tour from 'reactour'
import logo from '../../../imgs/logo.png'
const { Option } = Select;

function ExamsPage({openTour, setOpenTour, tour}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [exams,setExams] = useState([])
  const [createTest, setCreateTest] = useState()
  const [confirmVisibleMap, setConfirmVisibleMap] = useState({});
  const [attivo, setAttivo] = useState('tutti'); // Valori possibili: 'tutti', 'attivo', 'non attivo'
  const [difficolta, setDifficolta] = useState('tutti'); // Valori possibili: 'tutti', 'facile', 'medio', 'difficile'
  const [numCandidati, setNumCandidati] = useState('tutti');
  const user = useSelector(state=>state.users.user)
  const storedQuestions = JSON.parse(localStorage.getItem('questions'));
  const storedConfig = JSON.parse(localStorage.getItem('config'));
  const [confirmVisible, setConfirmVisible] = useState(Array(exams).fill(false));

  /*
  <div className='flex gap-2'>
          <i className='ri-pencil-line cursor-pointer'
          onClick={()=>navigate(`/admin/exams/edit/${record._id}`)}></i>
          <span className='cursor-pointer'
          onClick={()=>navigate(`/admin/exams/info/${record._id}`)}>Info</span>
          <i className='ri-delete-bin-line cursor-pointer' onClick={()=>{deleteExamById(record._id)}}></i>
  </div>
  */
  const steps = [
    {
      content: 'Crea un nuovo AI test',
      selector: '.elemento1', 
    },
    {
      content: 'Vedi le info dei test creati',
      selector: '.elemento2', // Selettore CSS dell'elemento
    },
    {
      content: 'Attiva/Disattiva il test',
      selector: '.elemento3', // Selettore CSS dell'elemento
    },
  ];
 const continueExam = () => {
  if (storedConfig && storedQuestions){
    if (storedConfig.tag === "manual"){
      navigate('/admin/exams/add/manual',{
        state: {
          storedQuestions: storedQuestions,
        }
      })
    }
  } else if (storedConfig.tag === "ai"){
    navigate('/admin/exams/add/ai',{
      state: {
        storedQuestions: storedQuestions,
      }
    })    
  }

 }
  const getExamsData = async() => {
    try{
      dispatch(ShowLoading())
      const response = await getExamByUser(user._id)
      dispatch(HideLoading())
      if(response.success){
       //message.success(response.message)
       console.log(response);
       setExams(response.data)
       setConfirmVisible(Array(exams).fill(false))
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
  const deleteExamById = async(id) => {
    try{
      dispatch(ShowLoading());
      const response = await deleteExam(id);
      dispatch(HideLoading())
      if(response.success){
        message.success(response.message);
        getExamsData()
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

  const filteredExams = exams.filter((exam) => {
    if (attivo !== 'tutti') {
      if (attivo === 'attivo' && exam.active) {
        return true;
      }
      if (attivo === 'non attivo' && !exam.active) {
        return true;
      }
      return false;
    }

    // Filtraggio per difficoltà
    if (difficolta !== 'tutti') {
      if (difficolta === 'facile' && exam.difficulty === 'Facile') {
        return true;
      }
      if (difficolta === 'medio' && exam.difficulty === 'Medio') {
        return true;
      }
      if (difficolta === 'difficile' && exam.difficulty === 'Difficile') {
        return true;
      }
      return false;
    }

    // Filtraggio per numero di candidati
    if (numCandidati !== 'tutti') {
      const numCandidatiInt = parseInt(numCandidati);
      if (numCandidati === '0-50' && exam.candidates.length <= 50) {
        return true;
      }
      if (numCandidati === '51-100' && exam.candidates.length > 50 && exam.candidates.length <= 100) {
        return true;
      }
      if (numCandidati === '101-500' && exam.candidates.length > 100 && exam.candidates.length <= 500) {
        return true;
      }
      if (numCandidati === 'oltre500' && exam.candidates.length > 500) {
        return true;
      }
      return false;
    }

    return true; 
  });

  useEffect(()=>{
     getExamsData()
  },[])
  const handleSwitchChange = (index) => {
    setConfirmVisible((prevState) => {
      const updatedConfirmVisible = [...prevState];
      updatedConfirmVisible[index] = true;
      return updatedConfirmVisible;
    })
  };

  const handleCancel = () => {
    setConfirmVisible(Array(exams).fill(false));
   };

   const handleOnOff = async (exam) => {
    console.log(exam)
    const payload = {
      examId: exam._id,
      active: exam.active === true ? false : true,
    }
    try {
      const response = await changeStatusExam(payload)
      console.log(response.data)
      const updatedExams = exams.map(item =>
        item._id === exam._id ? { ...item, active: !exam.active } : item
      );  
      setExams(updatedExams);
      setConfirmVisible(Array(exams).fill(false))
    } catch (error) {
      console.error(error);
    }
   }
   const isMobile = () => {
    return window.innerWidth <= 768;
  };
  return (
    <div className='exams-container'>
      <div className='flex justify-between items-center mt-1'>
        {!isMobile() && <PageTitle title="Test"/>}
        <div className='test-filter'>
          <div>
            {isMobile() ? <label>Attività:</label> : <label>Filtra per attività:</label>}
            <Select value={attivo} onChange={(value) => setAttivo(value)}>
              <Option value='tutti'>Tutti</Option>
              <Option value='attivo'>Attivo</Option>
              <Option value='non attivo'>Non attivo</Option>
            </Select>
          </div>
          <div>
          {isMobile() ? <label>Difficoltà:</label> : <label>filtra per difficoltà:</label>}
            <Select value={difficolta} onChange={(value) => setDifficolta(value)}>
              <Option value='tutti'>Tutti</Option>
              <Option value='facile'>Facile</Option>
              <Option value='medio'>Medio</Option>
              <Option value='difficile'>Difficile</Option>
            </Select>
          </div>
          <div>
            {isMobile() ? <label>Candidati:</label> : <label>Numero di Candidati:</label>}
            <Select value={numCandidati} onChange={(value) => setNumCandidati(value)}>
              <Option value='tutti'>Tutti</Option>
              <Option value='0-50'>0 - 50</Option>
              <Option value='51-100'>51 - 100</Option>
              <Option value='101-500'>101 - 500</Option>
              <Option value='oltre500'>Oltre 500</Option>
            </Select>
          </div>
        </div>
        <div>
          {storedQuestions &&
          <button className='primary-outlined-btn flex items-center cursor-pointer'onClick={continueExam}>
          <i style={{marginRight: '3px'}} className='ri-pencil-line'></i>
          Continue Exam
          </button>}
          <button className='primary-outlined-btn flex items-center cursor-pointer elemento1' onClick={()=>setCreateTest(true)}>
            <i className='ri-add-line' style={{marginRight: '7px'}}></i>
            Crea Test
          </button>          
        </div>
      </div>
      <Row gutter={[16,16]} className="exam-list mt-2">
          {filteredExams&&filteredExams.map((exam,index)=>{
              const examId = exam._id;
            return (
                <div className='card-exam' key={examId}>
                  <div className='card-exam-top'>
                    <h1>
                      {exam.jobPosition}
                    </h1>
                    {isMobile() ?
                    <button className='elemento2' onClick={()=>navigate(`/admin/exams/info/${exam._id}`)}>Candidati</button>
                     : 
                    <button className='elemento2' onClick={()=>navigate(`/admin/exams/info/${exam._id}`)}>Info candidati</button>}
                  </div>
                  <div className='divider'></div>
                  <div className='card-exam-middle'>
                    <ul className='card-exam-middle-skills'>
                      {exam.skills.map((skill) => (
                        <li className='text-md'>
                          {skill}
                        </li>                    
                      ))}
                    </ul>
                    <Popconfirm
                      visible={confirmVisible[index]}
                      title={exam.active ? "Sei sicuro di voler disattivare il link?" : "Sei sicuro di voler attivare il link?"}
                      onConfirm={async () => {
                        try {
                            await handleOnOff(exam); 
                        } catch (error) {
                            console.error('Si è verificato un errore durante la conferma:', error);
                        }
                      }}
                      onCancel={handleCancel}
                      okText="Sì"
                      cancelText="No"
                      placement="top"
                    >
                    <Switch
                    className='elemento3' 
                    checked={exam.active} 
                    onChange={(checked) => handleSwitchChange(index)}/>
                    </Popconfirm>
                  </div>

                  <div className='card-exam-bottom'>
                    <div>
                      <h4>
                        Difficoltà: 
                        <span className={exam.difficulty === "Facile" ? "easy-diff" : exam.difficulty === "Medio" ? "middle-diff" : "hard-diff"}>o</span>
                      </h4>
                      <h4>Deadline: {exam.deadline ? moment(exam.deadline).format('DD/MM/YYYY') : 'Nessuna scadenza'}</h4>
                    </div>
                    <h4 className='text-md'>
                      <img src={candidateNumber} alt='candidati al test di SkillTest' />
                      {exam.candidates.length} / 100
                    </h4>
                  </div>
                </div>
            )
          })}
        </Row>
        <Tour
        isOpen={openTour && tour === "exam"}
        onRequestClose={() => {setOpenTour(false)}}
        steps={steps}
        rounded={5}
      />
      <Modal
          title={
            <div className="modal-header">
                <img style={{width: '17%'}} src={logo} alt="logo skilltest" />
            </div>
            }
      open={createTest}
      width={isMobile() ? '95%' : '70%'}
      footer={false} 
      onCancel={()=>{
      setCreateTest(false)
      }}>
      <div className='choose-test'>
        <div onClick={()=>navigate('/admin/exams/add/ai')}>
          <img alt='test skilltest' src={skilltest} />
          <h2>SkillTest AI</h2>
          <p>Test focalizzato per verificare le competenze del candidato generato dall'AI di SkillTest. Le 
            nostre domande sono generate con cura e attenzione per qualificare al meglio il candidato
          </p>
        </div>
        <div onClick={()=>{
          //navigate('/admin/exams/add/mix')
          window.alert("Stiamo lavorando per aggiungerlo, scusate il disagio! Intanto potete creare le altre due tipologie di Test ")
          }}>
          <div><img alt='test misto' src={skt} /><span>Consigliato</span></div>
          <img alt='test misto' src={mix} />
          <h2>Test Misto</h2>
          <p>Testa le competenze del candidato, tramite la nostra AI, con la possibilità di aggiungere
            moduli secondari di tua scelta, focalizzandoti per esempio sulle soft skills o sul carattere del candidato.</p>
        </div>
        <div onClick={()=>navigate('/admin/exams/add/manual')}>
          <img alt='test manual' src={manual} />
          <h2>Test Manuale</h2>
          <p>Aggiungi un test manuale o seleziona i moduli creati da noi per un test qualsiasi non focalizzato su competenze tecniche, non ci saranno risposte esatti o punteggi.</p>
        </div>
      </div>
      </Modal>
    </div>
  )
}

export default ExamsPage