import React,{useState,useEffect} from 'react';
import PageTitle from '../../../components/PageTitle';
import { Form, Row, Col, message, Tabs, Table } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { addExam, deleteQuestionFromExam, editExam, getExamById } from '../../../apicalls/exams';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import AddEditQuestion from './AddEditQuestion';
import openai from 'openai';
import InfoCandidate from './InfoCandidate';

function InfoExam() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {id} = useParams()
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  const [examData,setExamData] = useState();
  const [showAddEditQuestionModal, setShowAddEditQuestionModal] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [showInfoCandidateModal, setShowInfoCandidateModal] = useState();
  const [selectedCandidate, setSelectedCandidate] = useState();
  const [questions, setQuestions] = useState();
  const [showQuestions, setShowQuestions] = useState(false);
  const [config, setConfig] = useState({
   numOfQuestions: 30,
   difficulty: examData?.difficulty || "",
   generalSector: examData?.generalSector || "",
   jobPosition: examData?.jobPosition || "",
   testLanguage: examData?.testLanguage || "",
   skills: [examData?.skills] || ["",],
});

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
  const questionColumns = [
   {
      title: "Question",
      dataIndex: "question"
   },
   {
      title: "Options",
      dataIndex: "options",
      render: (text,record) => {
         return Object.keys(record.options).map((key)=>{
            return <div>{key} : {record.options[key]}</div>
         })
      }
   },
   {
      title: "Correct Option",
      dataIndex: "correctOption",
      render: (text,record) => {
         return `${record.correctOption}`;
      }
   },
   {
      title: "Action",
      dataIndex: "action",
      render: (text,record) => {
         return (
            <div className='flex gap-2'>
              <i className='ri-pencil-line cursor-pointer'
               onClick={()=>{
                  setSelectedQuestion(record)
                  setShowAddEditQuestionModal(true)
               }}></i>
              <i className='ri-delete-bin-line cursor-pointer' onClick={()=>{deleteQuestionById(record._id)}}></i>
            </div>
         )
      }
   }
]
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
 const handleAddTag = (newSkill) => {
   if (newSkill.trim() !== '') {
      setConfig(prevConfig => ({ ...prevConfig, skills: [...prevConfig.skills, newSkill.trim()] }));
   }
};
const handleRemoveTag = (tagToRemove) => {
   setConfig(prevConfig => ({
   ...prevConfig,
   skills: prevConfig.skills.filter(tag => tag !== tagToRemove)
   }));
};
  return (
    <div className='home-content'>
        <PageTitle title={id?'Edit Exam':'Add Test'}/>
        {(examData || !id) && <Form layout="vertical" onFinish={onFinish} initialValues={examData} className="mt-2">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Candidati" key="1">
            <div className='flex justify-end'> 
              <button className="primary-outlined-btn cursor-pointer"
              type="button"
              onClick={()=>{
               setShowAddEditQuestionModal(true)
              }}>Add Question</button>
              </div>
              <Table columns={candidateColumns} dataSource={examData?.candidates} rowKey={(record) => record._id} className="mt-1">

              </Table>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Domande" key="2">
              <div className='flex justify-end'> 
              <button className="primary-outlined-btn cursor-pointer"
              type="button"
              onClick={()=>{
               setShowAddEditQuestionModal(true)
              }}>Add Question</button>
              </div>
              <Table columns={questionColumns} dataSource={examData?.questions} rowKey={(record) => record._id} className="mt-1">

              </Table>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Dati esame" key="3">
          <Row gutter={[10,10]}>
                <Col span={8}>
                   <Form.Item label="Settore generale" name="general-sector">
                    <input type="text" value={config.generalSector || ''}  onChange={(e) => setConfig(prevConfig => ({ ...prevConfig, generalSector: e.target.value }))} />
                   </Form.Item>
                </Col>
                <Col span={8}>
                   <Form.Item label="Job position" name="job-position">
                    <input type="text" value={config.jobPosition}  onChange={(e) => setConfig(prevConfig => ({ ...prevConfig, jobPosition: e.target.value }))}/>
                   </Form.Item>
                </Col>
                <Col span={8}>
                   <Form.Item label="Difficoltà" name="seniority">
                    <select value={config.difficulty} onChange={(e) => setConfig(prevConfig => ({ ...prevConfig, difficulty: e.target.value }))}>
                        <option value="">Seleziona</option>
                        <option value="Facile">Facile</option>
                        <option value="Medio">Medio</option>
                        <option value="Difficile">Difficile</option>
                    </select>
                   </Form.Item>
                </Col>
                <Col span={8}>
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
                <Col span={8}>
                  <Form.Item label="Competenze" name="skills">
                     <div>
                        {config.skills.map(tag => (
                           <span
                              key={tag}
                              style={{ marginRight: '8px', marginBottom: '8px', display: 'inline-block' }}
                           >
                              {tag} <button onClick={() => handleRemoveTag(tag)}>X</button>
                           </span>
                        ))}
                        <div>
                           <input
                              type="text"
                              placeholder="Aggiungi una competenza"
                              onKeyDown={(e) => {
                                 if (e.key === 'Enter') {
                                    const newSkill = e.target.value.trim();
                                    if (newSkill) {
                                       handleAddTag(newSkill);
                                    }
                                    e.target.value = '';
                                 }
                              }}
                           />
                        </div>
                     </div>
                  </Form.Item>
                </Col>
            </Row>
            <div className='flex justify-end gap-2'>
             <button className='primary-outlined-btn w-15 cursor-pointer' type="submit">
                Save
             </button>
             <button className='primary-contained-btn w-15 cursor-pointer'
             onClick={()=>navigate('/admin/exams')}
             >
                Cancel
             </button>
            </div>
          </Tabs.TabPane>
        </Tabs>
        </Form>}
        {showAddEditQuestionModal&&<AddEditQuestion   setShowAddEditQuestionModal={setShowAddEditQuestionModal}
         showAddEditQuestionModal={showAddEditQuestionModal}
         examId = {id}
         refreshData = {getExamDataById}
         selectedQuestion={selectedQuestion}
         setSelectedQuestion={setSelectedQuestion}
        />}
        {showInfoCandidateModal&&<InfoCandidate setShowInfoCandidateModal={setShowInfoCandidateModal}
        showInfoCandidateModal={showInfoCandidateModal}
        selectedCandidate={selectedCandidate}
        setSelectedCandidate={setSelectedCandidate}
        examId = {id}
        />}
    </div>
  )
}

export default InfoExam