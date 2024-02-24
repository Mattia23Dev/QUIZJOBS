import React, {useState, useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

const Preview = () => {
    const [examData, setExamData] = useState()
    const [questions, setQuestions] = useState([])
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const domandeString = queryParams.get('domande');
    const domande = JSON.parse(domandeString);
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0)
    const [selectedOptions, setSelectedOptions] = useState({})
    const [seconds, setSeconds] = useState({})
    const [result, setResult] = useState()
    const { idUser, jobPositionSlug, uniqueId } = useParams()
    const dispatch = useDispatch()
    const [view, setView] = useState("instructions")
    const [secondsLeft, setSecondsLeft] = useState(30)
    const [timeUp, setTimeUp] = useState(false)
    const [intervalId, setIntervalId] = useState(null);
    const [user, setUser] = useState();
  
    const navigate = useNavigate();
    useEffect(() => {
        if (domande){
          setQuestions(domande);  
        } 
    }, [domande])
  
  const handleNextButtonClick = async () => {
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
        setSeconds(prevSeconds => ({
          ...prevSeconds,
          [selectedQuestionIndex]: 30 - remainingTime
        }));
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
        window.alert('Preview finita, per vedere il test reale, crea il link e prova la candidatura!')
      }
    }
  }, [timeUp]);
  return (
    questions.length > 0 && (
        <div className='mt-2'>
        <div className='divider'></div>
        <h1 className='text-center user-select-none'>{jobPositionSlug && jobPositionSlug.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</h1>
        <div className='divider'></div>
        <div className='flex flex-col gap-2 mt-2'>
         <div className='flex justify-between'>
         <h1 className='text-2xl user-select-none'>
           {selectedQuestionIndex+1} : {questions[selectedQuestionIndex].domanda}
         </h1>
         <div className='timer'>
          <span className='text-2xl user-select-none'>{secondsLeft && secondsLeft}</span>
         </div>
         </div>
         <div className='flex flex-col gap-2'>
          {Object.entries(questions[selectedQuestionIndex].opzioni).map(([lettera, risposta], index) => (
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
        </div>
        </div>
       )
  )
}

export default Preview