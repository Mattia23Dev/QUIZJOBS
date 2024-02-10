import React,{useState,useEffect} from 'react';
import PageTitle from '../../../components/PageTitle';
import { Form, Row, Col, message, Tabs, Table } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { addExam, deleteQuestionFromExam, editExam, getExamById } from '../../../apicalls/exams';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import AddEditQuestion from './AddEditQuestion';
import openai from 'openai';

const DomandeComponent = ({ domande }) => {
   console.log(domande);
   return (
     <div>
       {domande?.map((domanda, index) => (
         <div key={index}>
           <p>{domanda.domanda}</p>
           <ul>
             {Object.entries(domanda.opzioni).map(([lettera, risposta], index) => (
               <li key={index}>{lettera} {risposta}</li>
             ))}
           </ul>
           <p>Risposta Corretta: {domanda.rispostaCorretta !== null && domanda.rispostaCorretta.risposta}</p>
         </div>
       ))}
     </div>
   );
 };

function AddEditExam() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {id} = useParams()
  const apiKey = "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"
  const [examData,setExamData] = useState();
  const [showAddEditQuestionModal, setShowAddEditQuestionModal] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [questions, setQuestions] = useState();
  const [showQuestions, setShowQuestions] = useState(false);
  const [config, setConfig] = useState({
      numOfQuestions: 30,
      difficulty: 'Media',
      generalSector: 'Informatica', // Sostituisci con il settore generale
      jobPosition: 'Full stack developer', // Sostituisci con la posizione lavorativa
      testLanguage: 'Italiano', // Sostituisci con la lingua del test
      skills: ['Javascript', 'Wordpress', 'React', 'Node js'], // Sostituisci con la lista di competenze
   });

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
      const prompt = `Immagina di essere un recruiter e devi testare le competenze di un candidato per un'offerta lavorativa per la posizione ${config.jobPosition}. Genera ${config.numOfQuestions} domande a risposta multipla con 4 possibilità e con le rispettive risposte. Ripeti le stesse risposte SOLO SE NECESSARIO inserirle nel contesto della domanda. Assicurati di fare domande non banali e specifiche alle competenze fornite: ${config.skills.join(', ')}, con difficoltà ${config.difficulty}, nella lingua ${config.testLanguage}.`;

      const requestData = {
         max_tokens: 1200, 
         n: 5,
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
      dispatch(ShowLoading())
        const response = await client.chat.completions.create(requestData);
        console.log(response.choices);
        const allQuestions = [];
        response.choices.forEach(async  (choice) => {
            const domandeOggetto = await convertiStringaInOggetti(choice.message.content);
            allQuestions.push(...domandeOggetto);
        });
        
        console.log(allQuestions);
        setQuestions(allQuestions);
        setShowQuestions(true);
        dispatch(HideLoading())
      } catch (error) {
        console.error('Errore durante la generazione delle domande:', error);
      }
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
      dataIndex: "name"
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
         return `${record.correctOption}. ${record.options[record.correctOption]}`;
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
  return (
    <div className='home-content'>
        <PageTitle title={id?'Edit Exam':'Add Test'}/>
        <button className='primary-outlined-btn w-15 cursor-pointer' onClick={generateQuestions}>
                Save
         </button>
        {(examData || !id) && <Form layout="vertical" onFinish={onFinish} initialValues={examData} className="mt-2">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Exam Details" key="1">
          <Row gutter={[10,10]}>
                <Col span={8}>
                   <Form.Item label="Exam Name" name="name">
                    <input type="text"/>
                   </Form.Item>
                </Col>
                <Col span={8}>
                   <Form.Item label="Exam Duration" name="duration">
                    <input type="number" min={0}/>
                   </Form.Item>
                </Col>
                <Col span={8}>
                   <Form.Item label="Category" name="category">
                    <select>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Nodejs">Nodejs</option>
                    <option value="React">React</option>
                    <option value="MongoDb">MongoDb</option>
                    </select>
                   </Form.Item>
                </Col>
                <Col span={8}>
                   <Form.Item label="Total Marks" name="totalMarks">
                    <input type="number" min={0}/>
                   </Form.Item>
                </Col>
                <Col span={8}>
                   <Form.Item label="Passing Marks" name="passingMarks">
                    <input type="number" min={0}/>
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
          {id && <Tabs.TabPane tab="Questions" key="2">
              <div className='flex justify-end'> 
              <button className="primary-outlined-btn cursor-pointer"
              type="button"
              onClick={()=>{
               setShowAddEditQuestionModal(true)
              }}>Add Question</button>
              </div>
              <Table columns={questionColumns} dataSource={examData?.questions} className="mt-1">

              </Table>
          </Tabs.TabPane>}
        </Tabs>
        </Form>}
        {showAddEditQuestionModal&&<AddEditQuestion   setShowAddEditQuestionModal={setShowAddEditQuestionModal}
         showAddEditQuestionModal={showAddEditQuestionModal}
         examId = {id}
         refreshData = {getExamDataById}
         selectedQuestion={selectedQuestion}
         setSelectedQuestion={setSelectedQuestion}
        />}
        {showQuestions && questions && <DomandeComponent domande={questions} />}
    </div>
  )
}

export default AddEditExam