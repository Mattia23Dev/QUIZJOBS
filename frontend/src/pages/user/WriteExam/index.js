import React, {useState, useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getExamById, saveTestProgress } from '../../../apicalls/exams'
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice'
import { message } from 'antd'
import Instructions from './Instructions'
import { addReport, reportAi, reportAiManual } from '../../../apicalls/reports'
import { useSelector } from 'react-redux'
import { useCookies } from 'react-cookie';
import logo from '../../../imgs/logonew.png'
import time from '../../../imgs/time.png'
import arrowRight from '../../../imgs/arrowright.png'
import alert from '../../../imgs/alert.png'
import thanks from '../../../imgs/thanks.png'
import v from '../../../imgs/v.png'
import cbig from '../../../imgs/cbig.png'
import openai from 'openai';
import './writeExamUser.css';

function WriteExam() {
  const [examData, setExamData] = useState()
  const [questions, setQuestions] = useState([])
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [seconds, setSeconds] = useState({})
  const [result, setResult] = useState()
  const { idUser, jobPositionSlug, uniqueId } = useParams()
  const dispatch = useDispatch()
  const params = new URLSearchParams(window.location.search);
  const trackLink = params.get('name');
  const [view, setView] = useState("instructions")
  const [secondsLeft, setSecondsLeft] = useState(30)
  const [timeUp, setTimeUp] = useState(false)
  const [intervalId, setIntervalId] = useState(null);
  const [user, setUser] = useState();
  const [cookies, setCookie] = useCookies(['answers']);

  const navigate = useNavigate();

  const getExamDataById = async(id) => {
    try{
       dispatch(ShowLoading())
       const response = await getExamById(id)
       console.log(response.data);
       dispatch(HideLoading())
       if(response.success){
          message.success(response.message)
          setExamData(response.data[0])
          setQuestions(response.data[0].questions)
          setSecondsLeft(10000);
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

const calculateResult = async() => {
  try {
      let correctAnswersCount = 0;
      questions.forEach((question, index) => {
          if (question.correctOption.includes(selectedOptions[index])) {
              correctAnswersCount++;
          }
      });

      const totalQuestions = questions.length;
      const percentage = (correctAnswersCount / totalQuestions) * 100;
      const verdict = percentage >= 60 ? "Pass" : "Fail";

      const tempResult = {
          correctAnswersCount,
          totalQuestions,
          percentage,
          verdict,
          allAnswers: selectedOptions,
          allSeconds: seconds,
      };

      setResult(tempResult);
      dispatch(ShowLoading());

      const response = await addReport({
          exam: examData._id,
          result: tempResult,
          user: user._id,
          email: user.email,
      });

      dispatch(HideLoading());
      setView("thanks");

      const responseAi = await reportAi({
        exam: examData._id,
        questions: questions,
        answers: selectedOptions,
        user: user._id,
        email: user.email,
      })
      if(response.success) {
          console.log(response);
      } else {
          message.error(response.message);
      }
  } catch(error) {
      dispatch(HideLoading());
      message.error(error.message);
  }
};

const calculateResultManual = async() => {
  try {
      let correctAnswersCount = questions.length;
      const totalQuestions = questions.length;

      const tempResult = {
          correctAnswersCount,
          totalQuestions,
          percentage: 100,
          verdict : 'Pass',
          allAnswers: selectedOptions,
          allSeconds: seconds,
      };

      setResult(tempResult);
      dispatch(ShowLoading());

      const response = await addReport({
          exam: examData._id,
          result: tempResult,
          user: user._id,
          email: user.email,
      });

      dispatch(HideLoading());
      setView("thanks");
      const responseAi = await reportAiManual({
        exam: examData._id,
        questions: questions,
        answers: selectedOptions,
        user: user._id,
        email: user.email,
      })

      if(response.success) {
          console.log(response);
      } else {
          message.error(response.message);
      }
  } catch(error) {
      dispatch(HideLoading());
      message.error(error.message);
  }
};
console.log(examData)
useEffect(() => {
  if (user && user.tests && user.tests.length > 0) {
    const currentTest = user.tests[0];
    if (currentTest.progress && currentTest.totalQuestions) {
      if (currentTest.arrayAnswers.questions.length >= questions.length-1){
        setView('thanks')
      } else {
        setSelectedQuestionIndex(currentTest.progress.questionIndex+1);
        const remainingTime = examData.tag === "manual" ? 180 : 30;
        setSecondsLeft(remainingTime);
        const answers = currentTest.arrayAnswers?.answers;
        if (answers) {
          setSelectedOptions({ ...selectedOptions, ...answers });
        }        
      }
    } else {
      setSelectedQuestionIndex(0);
      setSecondsLeft(examData.tag === "manual" ? 180 : 30);
    }
  }
}, [user]);

const handleNextButtonClick = async (index) => {
  let correctAnswersCount = 0;
  let correctQuestions = [];
  for (let i = 0; i <= selectedQuestionIndex; i++) {
    const question = questions[i];
    if (question.correctOption.includes(selectedOptions[i])) {
      correctAnswersCount++;
      correctQuestions.push(question.question);
    }
  }
  setSelectedQuestionIndex(index);
  startTimer();
  const response = await saveTestProgress({
      email: user.email,
      testId: examData._id,
      questionIndex: selectedQuestionIndex+1,
      selectedOption: selectedOptions[selectedQuestionIndex],
      arrayAnswers: {
        answers: selectedOptions,
        questions: questions.slice(0, selectedQuestionIndex + 1).map(question => question.question),
        seconds: seconds,
        correctQuestions: correctQuestions,
      },
      correctAnswer: correctAnswersCount,
      totalQuestions: selectedQuestionIndex + 1,
  })
  console.log(response);
};

const handleNextButtonClickManual = async (index) => {
  setSelectedQuestionIndex(index);
  startTimer();
  const response = await saveTestProgress({
      email: user.email,
      testId: examData._id,
      questionIndex: selectedQuestionIndex+1,
      selectedOption: selectedOptions[selectedQuestionIndex],
      arrayAnswers: {
        answers: selectedOptions,
        questions: questions.slice(0, selectedQuestionIndex + 1).map(question => question.question),
        seconds: seconds,
        correctQuestions: [],
      },
      correctAnswer: questions.length,
      totalQuestions: selectedQuestionIndex + 1,
  })
  console.log(response);
};

const startTimer = () => {
  clearInterval(intervalId);
  let remainingTime = examData.tag === "manual" ? 180 : 30;
  setSecondsLeft(remainingTime);

  const intervalIdSt = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime -= 1; 
      setSecondsLeft(remainingTime); 
      setSeconds(prevSeconds => ({
        ...prevSeconds,
        [selectedQuestionIndex]: examData.tag === "manual" ? 180 - remainingTime : 30 - remainingTime
      }));
    } else {
      clearInterval(intervalIdSt);
      console.log('ok')
      if (selectedQuestionIndex < questions.length - 1) {
        console.log('okok')
        if (examData.tag === "manual"){
          setSelectedQuestionIndex(prevIndex => prevIndex + 1);
          handleNextButtonClickManual(selectedQuestionIndex + 1)
        } else {
          console.log('okokok')
          setSelectedQuestionIndex(prevIndex => prevIndex + 1);
          handleNextButtonClick(selectedQuestionIndex + 1)
        }
      } else {
        setTimeUp(true);
      }
    }
  }, 1000);
  setIntervalId(intervalIdSt);
};

useEffect(() => {
  if (timeUp && view === "questions") {
    clearInterval(intervalId);
    if (selectedQuestionIndex < questions.length - 1) {
      setSelectedQuestionIndex(prevIndex => prevIndex + 1);
      startTimer(); 
    } else {
      if (examData.tag === "manual"){
        calculateResultManual();
      } else {
        calculateResult();
      };
    }
  }
}, [timeUp]);

useEffect(()=>{
  const id = uniqueId;
  if(id){
    getExamDataById(id)
  }
},[])

  return (
   examData && (
    examData.active === true ?
    <div className='exam-user-container'>
        <div className='header-big-loader' style={{padding: '10px', position: 'sticky', top: '0', zIndex: 20, backgroundColor: '#fff'}}>
            <img src={logo} alt='logo skilltest' />
        </div>
    {view!=="thanks" &&<h1 className='text-center user-select-none mt-2'>Test per l'offerta <b>{jobPositionSlug && jobPositionSlug.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</b></h1>}
    {view!=="thanks" &&<p>Ciao, questo è solo un test per categorizzarti e non influirà sul successo della candidatura.</p>}
    {view==="instructions"&&<Instructions trackLink={trackLink} setUser={setUser} examData={examData} setExamData={setExamData}
    view={view}
    setView={setView}
    startTimer={startTimer}
    />}
    {(view==="questions"&&questions?.length > 0) ? examData?.tag === "manual" ?
     <div className='flex flex-col gap-2 mt-2'>
     <div className='question-exam-container'>
     <div className='timer'>
       <img alt='time user' src={time} />
       <span className='text-2xl user-select-none'>{secondsLeft >= 60 ? secondsLeft >= 120 ? secondsLeft >= 180 ? '03' : '02' : '01' : '00'}:{secondsLeft <10 ? '0' : null}{secondsLeft >= 180 ? secondsLeft - 180 : secondsLeft >= 120 ? secondsLeft - 120 : secondsLeft >= 60 ? secondsLeft - 60 : secondsLeft}:00</span>
      </div>
      <div style={{width: '60%'}} className='flex justify-center mt-2'>
      <h1 style={{width:'65%'}} className='text-xl user-select-none'>
        {selectedQuestionIndex+1} : {questions[selectedQuestionIndex].question}
      </h1>
      </div>
      {questions[selectedQuestionIndex].options ?
      <div className='flex flex-col gap-2 align-left'>
       {Object.entries(questions[selectedQuestionIndex].options).map(([lettera, risposta], index) => (
           <div
             className={`flex gap-2 items-center ${selectedOptions[selectedQuestionIndex] === risposta ? "selected-option" : "option" }`}
             key={index}
             onClick={() => {
               setSelectedOptions({...selectedOptions, [selectedQuestionIndex]: risposta});
               console.log(selectedOptions);
             }}
           >
             <h4 className='text-m user-select-none'>
               <span>{lettera.substring(0, 1)}</span>{risposta}
             </h4>
           </div>
         ))}
      </div> : 
      <div style={{width: '50%'}} className='flex flex-col gap-2 align-left'>
        <textarea 
        className='textarea-writexam'
        value={selectedOptions[selectedQuestionIndex] || ''}
        onChange={(e) => setSelectedOptions({...selectedOptions, [selectedQuestionIndex]: e.target.value})}
        />
      </div>}
      <div className='alert-exam'>
         <img src={alert} alt='alert' />
         <p>Si prega notare che, in caso di uscita dal test, questo verrà interrotto. <br />
           Tuttavia, avrai la possibiltà di riprendere esattamente dove ti eri fermato una volta che riaccedi nel sistema.
         </p>
      </div>
      <div className='button-exam-container flex justify-between'>
       {selectedQuestionIndex<questions.length-1&&
       <div style={{display: 'flex', flexDirection: 'column', textAlign: 'center', gap: '20px'}}>
         <button className='primary-contained-btn'
       onClick={()=> handleNextButtonClickManual(selectedQuestionIndex + 1)}
       style={{display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center'}}>
        <img src={arrowRight} alt='arrow right' />Domanda successiva
       </button>
       <p><b>Non è possibile</b> tornare all <br /> <u style={{color: '#F95959'}}>domanda precedente</u></p>
       </div>
       }
       {selectedQuestionIndex===questions.length-1&&<button className='primary-contained-btn'
       style={{display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center'}}
       onClick={()=>{
         clearInterval(intervalId)
         setTimeUp(true)
       }}
       >
        <img src={arrowRight} alt='arrow right' />
        Invia candidatura
       </button>}
      </div>
     </div>
     </div>
    :
    <div className='flex flex-col gap-2 mt-2'>
    <div className='question-exam-container'>
    <div className='timer'>
      <img alt='time user' src={time} />
      <span className='text-2xl user-select-none'>00:{secondsLeft <10 ? '0' : null}{secondsLeft}:00</span>
     </div>
     <div style={{width: '60%'}} className='flex justify-center mt-2'>
     <h1 style={{width:'65%'}} className='text-xl user-select-none'>
       {selectedQuestionIndex+1} : {questions[selectedQuestionIndex].question}
     </h1>
     </div>
     <div className='flex flex-col gap-2 align-left'>
      {Object.entries(questions[selectedQuestionIndex].options).map(([lettera, risposta], index) => (
          <div
            className={`flex gap-2 items-center ${selectedOptions[selectedQuestionIndex] === risposta ? "selected-option" : "option" }`}
            key={index}
            onClick={() => {
              setSelectedOptions({...selectedOptions, [selectedQuestionIndex]: risposta});
              console.log(selectedOptions);
            }}
          >
            <h4 className='text-m user-select-none'>
              <span>{lettera.substring(0, 1)}</span>{risposta}
            </h4>
          </div>
        ))}
     </div>
     <div className='alert-exam'>
        <img src={alert} alt='alert' />
        <p>Si prega notare che, in caso di uscita dal test, questo verrà interrotto. <br />
          Tuttavia, avrai la possibiltà di riprendere esattamente dove ti eri fermato una volta che riaccedi nel sistema.
        </p>
     </div>
     <div className='button-exam-container flex justify-between'>
      {selectedQuestionIndex<questions.length-1&&
      <div style={{display: 'flex', flexDirection: 'column', textAlign: 'center', gap: '20px'}}>
        <button className='primary-contained-btn'
      onClick={()=> handleNextButtonClick(selectedQuestionIndex + 1)}
      style={{display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center'}}>
       <img src={arrowRight} alt='arrow right' />Domanda successiva
      </button>
      <p><b>Non è possibile</b> tornare all <br /> <u style={{color: '#F95959'}}>domanda precedente</u></p>
      </div>
      }
      {selectedQuestionIndex===questions.length-1&&<button className='primary-contained-btn'
      style={{display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center'}}
      onClick={()=>{
        clearInterval(intervalId)
        setTimeUp(true)
      }}
      >
       <img src={arrowRight} alt='arrow right' />
       Invia candidatura
      </button>}
     </div>
    </div>
    </div> : null}
    {view==="thanks"&&<div className='thanks-exam-container flex flex-col gap-2'> 
       <img alt='skilltest' src={thanks} className='back-img' />
       <img src={v} alt='ok' />
       <h2>Grazie per aver completato il nostro test!</h2>
       <p>Il tuo tempo e il tuo impegno sono molto apprezzati. <br />
       <b>Abbiamo registrato con successo le tue risposte.</b></p>
       <p>Ti informeremo <i>via email</i> riguardo i prossimi e eventuali <br /> aggiornamenti.</p>
       {/*<button style={{zIndex: 10}} className='primary-contained-btn' onClick={() => navigate('/login')}>Registrati gratuitamente</button>*/}
    </div>}
    </div>
    :
    <div className='thanks-exam-container flex flex-col gap-2'> 
       <img alt='skilltest' src={thanks} className='back-img' />
       <img src={cbig} alt='ok' />
       <h2>Mi spiace!</h2>
       <p>L'azienda che ha creato questo test l'ha disattivato momentaneamente. <br />
       <b>Contatta l'azienda o riprova nei prossimi giorni.</b></p>
       <p>Intanto potresti iscriverti per non perderti i prossimi<br /> aggiornamenti.</p>
       {/*<button style={{zIndex: 10}} className='primary-contained-btn' onClick={() => navigate('/login')}>Registrati gratuitamente</button>*/}
    </div>
   )
  )
}

export default WriteExam