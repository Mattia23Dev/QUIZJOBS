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
  const [attivo, setAttivo] = useState('tutti'); // Valori possibili: 'tutti', 'attivo', 'non attivo'
  const [difficolta, setDifficolta] = useState('tutti'); // Valori possibili: 'tutti', 'facile', 'medio', 'difficile'
  const [numCandidati, setNumCandidati] = useState('tutti');

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
       //message.success(response.message)
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
  const handleSwitchChange = (examId, checked) => {
    setExams((prevExams) =>
    prevExams.map((exam) =>
      exam._id === examId ? { ...exam, active: checked } : exam
    )
  );
  };
  return (
    <div className='exams-container'>
      <div className='flex justify-between items-center mt-1'>
        <PageTitle title="Test"/>
        <div className='test-filter'>
          <div>
            <label>Filtra per attività:</label>
            <select value={attivo} onChange={(e) => setAttivo(e.target.value)}>
              <option value='tutti'>Tutti</option>
              <option value='attivo'>Attivo</option>
              <option value='non attivo'>Non attivo</option>
            </select>
          </div>
          <div>
            <label>filtra per difficoltà:</label>
            <select value={difficolta} onChange={(e) => setDifficolta(e.target.value)}>
              <option value='tutti'>Tutti</option>
              <option value='facile'>Facile</option>
              <option value='medio'>Medio</option>
              <option value='difficile'>Difficile</option>
            </select>
          </div>
          <div>
            <label>Numero di Candidati:</label>
            <select value={numCandidati} onChange={(e) => setNumCandidati(e.target.value)}>
              <option value='tutti'>Tutti</option>
              <option value='0-50'>0 - 50</option>
              <option value='51-100'>51 - 100</option>
              <option value='101-500'>101 - 500</option>
              <option value='oltre500'>Oltre 500</option>
            </select>
          </div>
        </div>
        <button className='primary-outlined-btn flex items-center cursor-pointer' onClick={()=>navigate('/admin/exams/add')}>
          <i className='ri-add-line'></i>
          Add Exam
        </button>
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
                    <button onClick={()=>navigate(`/admin/exams/info/${exam._id}`)}>Info candidati</button>
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
                    <Switch 
                    checked={exam.active} 
                    onChange={(checked) => handleSwitchChange(exam.id, checked)}/>
                  </div>

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