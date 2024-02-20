import React, {useState, useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getExamById, saveTestProgress } from '../../../apicalls/exams'
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice'
import { message } from 'antd'
import Instructions from './Instructions'
import { addReport } from '../../../apicalls/reports'
import { useSelector } from 'react-redux'
import { useCookies } from 'react-cookie';
import './writeExamUser.css';

function WriteExam() {
  const [examData, setExamData] = useState()
  const [questions, setQuestions] = useState([])
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [result, setResult] = useState()
  const { idUser, jobPositionSlug, uniqueId } = useParams();
  const dispatch = useDispatch()
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
      const verdict = percentage >= 70 ? "Pass" : "Fail";

      const tempResult = {
          correctAnswersCount,
          totalQuestions,
          percentage,
          verdict,
          allAnswers: selectedOptions,
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

      if(response.success) {
          //setView("result");
          console.log(response);
      } else {
          message.error(response.message);
      }
  } catch(error) {
      dispatch(HideLoading());
      message.error(error.message);
  }
};

useEffect(() => {
  if (user && user.tests && user.tests.length > 0) {
    const currentTest = user.tests[0];
    if (currentTest.progress && currentTest.totalQuestions) {
      setSelectedQuestionIndex(currentTest.progress.questionIndex);
      const remainingTime = 30;
      setSecondsLeft(remainingTime);
      const answers = currentTest.arrayAnswers?.answers;
      if (answers) {
        setSelectedOptions({ ...selectedOptions, ...answers });
      }
    } else {
      setSelectedQuestionIndex(0); 
      setSecondsLeft(30);
    }
  }
}, [user]);

const handleNextButtonClick = async () => {
  let correctAnswersCount = 0;
  for (let i = 0; i <= selectedQuestionIndex; i++) {
    const question = questions[i];
    if (question.correctOption.includes(selectedOptions[i])) {
      correctAnswersCount++;
    }
  }
  const response = await saveTestProgress({
      email: user.email,
      testId: examData._id,
      questionIndex: selectedQuestionIndex,
      selectedOption: selectedOptions[selectedQuestionIndex],
      arrayAnswers: {
        answers: selectedOptions,
        questions: questions.slice(0, selectedQuestionIndex + 1).map(question => question.question)
      },
      correctAnswer: correctAnswersCount,
      totalQuestions: selectedQuestionIndex + 1,
  })
  console.log(response);
  setSelectedQuestionIndex(selectedQuestionIndex + 1);
  startTimer();
};

const startTimer = () => {
  clearInterval(intervalId);
  let remainingTime = 30;
  setSecondsLeft(remainingTime); 

  const intervalIdSt = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime -= 1; 
      setSecondsLeft(remainingTime); 
    } else {
      clearInterval(intervalIdSt);

      if (selectedQuestionIndex < questions.length - 1) {
        handleNextButtonClick();
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
      calculateResult();
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
    <div className='mt-2'>
    <div className='divider'></div>
    <h1 className='text-center user-select-none'>{jobPositionSlug && jobPositionSlug.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</h1>
    <div className='divider'></div>
    {view==="instructions"&&<Instructions setUser={setUser} examData={examData} setExamData={setExamData}
    view={view}
    setView={setView}
    startTimer={startTimer}
    />}
    {(view==="questions"&&questions?.length > 0)&&<div className='flex flex-col gap-2 mt-2'>
     <div className='flex justify-between'>
     <h1 className='text-2xl user-select-none'>
       {selectedQuestionIndex+1} : {questions[selectedQuestionIndex].question}
     </h1>
     <div className='timer'>
      <span className='text-2xl user-select-none'>{secondsLeft && secondsLeft}</span>
     </div>
     </div>
     <div className='flex flex-col gap-2'>
      {Object.entries(questions[selectedQuestionIndex].options).map(([lettera, risposta], index) => (
          <div
            className={`flex gap-2 items-center ${selectedOptions[selectedQuestionIndex] === risposta ? "selected-option" : "option" }`}
            key={index}
            onClick={() => {
              setSelectedOptions({...selectedOptions, [selectedQuestionIndex]: risposta});
              console.log(selectedOptions);
            }}
          >
            <h1 className='text-xl user-select-none'>
              {lettera} : {risposta}
            </h1>
          </div>
        ))}
     </div>
     <div className='flex justify-between'>
      {selectedQuestionIndex<questions.length-1&&<button className='primary-contained-btn'
      onClick={()=> handleNextButtonClick()}>
       Next
      </button>}
      {selectedQuestionIndex===questions.length-1&&<button className='primary-contained-btn'
      onClick={()=>{
        clearInterval(intervalId)
        setTimeUp(true)
      }}
      >
       Submit
      </button>}
     </div>
    </div>}
    {view==="result"&&<div className='flex justify-center mt-2 gap-2'>
      <div className='flex flex-col gap-2 result'>
      <h1 className='text-2xl'>
        Result
      </h1>
      <div className='marks'>
        <h1 className='text-md'>
           Total Marks : {100}
        </h1>
        <h1 className='text-md'>
           Passing Marks : {70}
        </h1>
        <h1 className='text-md'>
            Obtained Marks : {result.correctAnswers.length}
        </h1>
        <h1 className='text-md'>
            Wrong Answers : {result.wrongAnswers.length}
        </h1>
        <h1 className='text-md'>
            Verdict : {result.verdict}
        </h1>
        <div className='flex gap-2 mt-2'>
          <button className='primary-outlined-btn'
          onClick={()=>{
            setView("instructions")
            setSelectedQuestionIndex(0);
            setSelectedOptions({});
            setTimeUp(false);
            setSecondsLeft(10000)
          }}
          >
          Retake Exam
          </button>
          <button className='primary-contained-btn' onClick={()=>{
            setView("review");
          }}>
            Review Answers
          </button>
        </div>
      </div>
      </div>
      <div className="lottie-animation">
      {result.verdict==="Pass" && <lottie-player src="https://assets5.lottiefiles.com/packages/lf20_uu0x8lqv.json"  background="transparent"  speed="1" loop autoplay></lottie-player>}
      {result.verdict==="Fail"&&<lottie-player src="https://assets4.lottiefiles.com/packages/lf20_qp1spzqv.json"  background="transparent" speed="1" loop autoplay></lottie-player>}
      </div>
    </div>}
    {view==="review"&&<div className='flex flex-col gap-2'> 
       {questions.map((question,index)=>{
          const isCorrect = question.correctOption === selectedOptions[index]
          return <div className={`flex flex-col gap-1 p-2 card ${isCorrect? "bg-success" : "bg-warning"}`}>
            <h1 className='text-xl'>{index+1} : {question.name}</h1>
            <h1 className='text-md'>Submitted Answer : {selectedOptions[index]} : {question.options[selectedOptions[index]]}</h1>
            <h1 className='text-md'>Correct Answer : {question.correctOption} : {question.options[question.correctOption]}</h1>
          </div>
       })}
       <div className='flex justify-center gap-2'>
       <button className='primary-outlined-btn'
          onClick={()=>{
            setView("instructions")
            setSelectedQuestionIndex(0);
            setSelectedOptions({});
            setTimeUp(false);
            setSecondsLeft(10000);
          }}
          >
          Retake Exam
          </button>
          <button className='primary-contained-btn' onClick={()=>{
            navigate("/")
          }}>
            Close
          </button>
       </div>
    </div>}
    </div>
   )
  )
}

export default WriteExam