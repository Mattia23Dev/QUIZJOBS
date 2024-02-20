import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import PageTitle from '../../../components/PageTitle'
import {Table,message, Row, Col, Popconfirm, Switch} from 'antd'
import { MdMore } from 'react-icons/md';
import { useDispatch } from 'react-redux'
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice'
import { getAllExams, deleteExam } from '../../../apicalls/exams'
import './index.css'
import testImg from '../../../imgs/testimg.png';
import candidateNumber from '../../../imgs/candidate.png'

function ExamsPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [exams,setExams] = useState([])
  const [confirmVisibleMap, setConfirmVisibleMap] = useState({});
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleConfirm = () => {
    // Qui puoi inserire la logica per confermare l'azione desiderata
    // Ad esempio, eseguire una funzione per eliminare un elemento o eseguire un'altra azione
    setConfirmVisible(false); // Chiudi il Popconfirm dopo la conferma
  };

  const handleCancel = () => {
    setConfirmVisible(false); // Chiudi il Popconfirm se l'utente annulla l'azione
  };
  const handleToggleConfirm = (examId) => {
    setConfirmVisibleMap(prevState => ({
      ...prevState,
      [examId]: !prevState[examId]
    }));
  };

  /*
  <div className='flex gap-2'>
          <i className='ri-pencil-line cursor-pointer'
          onClick={()=>navigate(`/admin/exams/edit/${record._id}`)}></i>
          <span className='cursor-pointer'
          onClick={()=>navigate(`/admin/exams/info/${record._id}`)}>Info</span>
          <i className='ri-delete-bin-line cursor-pointer' onClick={()=>{deleteExamById(record._id)}}></i>
  </div>
  */
  const getExamsData = async() => {
    try{
      dispatch(ShowLoading())
      const response = await getAllExams()
      dispatch(HideLoading())
      if(response.success){
       message.success(response.message)
       console.log(response);
       setExams(response.data)
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
  const handleCopyLink = (examLink) => {
    // Copia il link negli appunti
    navigator.clipboard.writeText(examLink)
      .then(() => {
        // Messaggio di successo
        message.success('Link copiato negli appunti');
      })
      .catch((error) => {
        // Gestione degli errori
        console.error('Si è verificato un errore durante la copia del link:', error);
        message.error('Si è verificato un errore durante la copia del link');
      });
  };
  useEffect(()=>{
     getExamsData()
  },[])
  return (
    <div className='exams-container'>
      <div className='flex justify-between items-center mt-1'>
        <PageTitle title="Test"/>
        <img className='exam-testimg' alt='domande generate SkillTest' src={testImg} />
        <button className='primary-outlined-btn flex items-center cursor-pointer' onClick={()=>navigate('/admin/exams/add')}>
          <i className='ri-add-line'></i>
          Add Exam
        </button>
      </div>
      <Row gutter={[16,16]} className="exam-list mt-2">
          {exams&&exams.map((exam,index)=>{
              const examId = exam._id;
              const isConfirmVisible = confirmVisibleMap[examId] || false;
            return (
                <div className='card-exam' key={examId}>
                  <Switch defaultChecked/>
                  <div className='card-exam-top'>
                    <h1>
                      {exam.jobPosition}
                    </h1>
                    <button onClick={()=>navigate(`/admin/exams/info/${exam._id}`)}>Info candidati</button>
                  </div>
                  <div className='divider'></div>
                  <ul className='card-exam-middle'>
                    {exam.skills.map((skill) => (
                      <li className='text-md'>
                        {skill}
                      </li>                    
                    ))}
                  </ul>
                  <div className='card-exam-bottom'>
                    <div>
                      <h4>
                        Difficoltà: 
                        <span className={exam.difficulty === "Facile" ? "easy-diff" : exam.difficulty === "Medio" ? "middle-diff" : "hard-diff"}>o</span>
                      </h4>
                      <h4>Deadline: {exam.deadline ? exam.deadline : 'Nessuna scadenza'}</h4>
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
    </div>
  )
}

export default ExamsPage