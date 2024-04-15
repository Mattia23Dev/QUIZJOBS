import React, { useEffect, useState } from 'react'
import { Modal, message, Progress, Collapse, Tag, Steps } from 'antd'
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice'
import { useDispatch } from 'react-redux'
import { getCandidateInfo } from '../../../apicalls/users'
import allegati from '../../../imgs/allegati.png'
import eduImg from '../../../imgs/edu.png'
import workImg from '../../../imgs/work.png'
import logo from '../../../imgs/logo.png'
import corretta from '../../../imgs/corretta.png'
import sbagliata from '../../../imgs/cancel.png'
import { Bar, Doughnut } from 'react-chartjs-2'
import time from '../../../imgs/time.png'
import { FaUserGraduate, FaBriefcase, FaTools } from 'react-icons/fa';
import { Chart, registerables } from 'chart.js';
import { IoSchoolOutline } from "react-icons/io5";
Chart.register(...registerables);
const { Panel } = Collapse;
const { Step } = Steps

const SkillsChart = ({ skills }) => {

  return (
    <div className='chart-container'>
        {skills?.map((skill, index) => (
          <span 
          className={index % 2 === 0 ? 'even-style' : 'odd-style'} 
          key={index}>{skill}</span>
        ))}
    </div>
  );
};

const WorkExperienceChart = ({ works }) => {
  return (
    <div className='eduwork'>
      <Steps direction='vertical'>
        {works?.map((work, index) => (
          <Step status="finish" icon={<img src={workImg} alt='work skilltest' />} key={index} description={work} />
        ))}
      </Steps>
    </div>
  );
};

const EducationChart = ({ educ }) => {
  return (
    <div className='eduwork'>
      <Steps direction='vertical'>
        {educ?.map((edu, index) => (
          <Step icon={<img src={eduImg} alt='education skilltest'/>} status="process" key={index} description={edu} />
        ))}
      </Steps>
    </div>
  );
};

function InfoCandidate(props) {
  const {showInfoCandidateModal,updateNotes,setShowInfoCandidateModal,pdfExtract,notes,tag,examId,refreshData, selectedCandidate, setSelectedCandidate, jobPosition, examQuestion} = props
  const dispatch = useDispatch()
  const [candidate, setCandidate] = useState()
  const [activeTab, setActiveTab] = useState(1)
  const [note, setNote] = useState(notes ? notes : '');
  const onFinish = () => {
    setShowInfoCandidateModal(false)
    setSelectedCandidate()
  }
  const getCandidateById = async () => {
    const userId = selectedCandidate._id
    try {
      const response = await getCandidateInfo({userId, examId});
      console.log(response);
      setCandidate(response.data);
      HideLoading();
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    ShowLoading();
    getCandidateById();
  }, [])
  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  const arraySkills = (skills) => {
    const cleanedSkillsString = skills?.replace(/^\d+\.\s.*?:\s*/, '');
    const skillsArray = cleanedSkillsString?.split('\n').filter(skill => skill.trim() !== '');
    return skillsArray
  }
  const [openIndex, setOpenIndex] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const MAX_CHARS = 100;
  const fullText = candidate?.tests[0].summary || "Nessuna analisi disponibile";
  const displayedText = expanded ? fullText : fullText.substring(0, MAX_CHARS) + (fullText.length > MAX_CHARS ? '...' : '');

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };
  console.log(note)
  console.log(notes)
  return (
    <Modal
    title={
      <div className="modal-header">
          <img src={logo} alt="logo skilltest" />
      </div>
      }
      style={{ top: '1rem' }}
      width={isMobile() ? '100%' : '45%'}
    open={showInfoCandidateModal}
    footer={false}
    onCancel={()=>{
      setShowInfoCandidateModal(false)
      setSelectedCandidate()
      }}>
        <div className="modal-candidate-body">
          <div className='modal-candidate-top'>
            <div onClick={() => setActiveTab(1)} className={activeTab === 1 ? 'active' : ''}>
              <span></span>
              <p>Overview</p>
            </div>
            <hr />
            <div onClick={() => setActiveTab(2)} className={activeTab === 2 ? 'active' : ''}>
              <span></span>
              <p>Domande</p>
            </div>
            <hr />
            <div onClick={() => setActiveTab(3)} className={activeTab === 3 ? 'active' : ''}>
              <span></span>
              <p>CV</p>
            </div>
          </div>
          {activeTab === 1 ? 
          <h2>{selectedCandidate?.name + ' ' + selectedCandidate?.surname} | {jobPosition && jobPosition}</h2>: activeTab === 2 ? 
          <h2 style={{textAlign: 'center'}}>Overview Domande</h2> :
          null
          }
          {activeTab === 1 ? 
          <><div className='modal-candidate-middle'>
            {tag === "manual" ? 
            <div className='modal-punteggio-summary'>
              <p>Analisi AI</p>
              <p>{displayedText}
              {fullText.length > MAX_CHARS && (
                  <span onClick={() => setExpanded(!expanded)}>
                    {expanded ? 'Leggi meno' : 'Leggi di più'}
                  </span>
                )}
              </p>
            </div>:
            <div className='modal-punteggio'>
              <p>Punteggio</p>
              <p><font color='#34C15B'>{candidate?.tests[0].correctAnswers}</font>/{candidate?.tests[0].totalQuestions}</p>
            </div>}
            <div className='modal-bar'>
              <p>Risposte corrette</p>
              <Progress
              percent={candidate?.tests[0]?.report?.result.percentage.toFixed(2)} 
              strokeColor={candidate?.tests[0]?.report?.result.percentage > 60 ? "#34C15B" : "#F95959"} />
            </div>
            {tag !== "manual" && 
            <div className='modal-punteggio-summary'>
              <p>Analisi AI</p>
              <p>{displayedText}
              {fullText.length > MAX_CHARS && (
                  <span onClick={() => setExpanded(!expanded)}>
                    {expanded ? 'Leggi meno' : 'Leggi di più'}
                  </span>
                )}
              </p>
            </div>}
            <hr />
          </div>
          <div className='modal-candidate-data'>
              <div>
                  <p>Nome:</p>
                  <p>{selectedCandidate?.name + ' ' + selectedCandidate?.surname}</p>
              </div>
              <div>
                  <p>Email:</p>
                  <p>{selectedCandidate?.email}</p>
              </div>
              <div>
                  <p>Cellulare:</p>
                  <p>{selectedCandidate?.phone}</p>
              </div>
              <div>
                  <p>Città</p>
                  <p>{selectedCandidate?.city}</p>
              </div>
              <div>
                  <p>Titolo</p>
                  <p>{candidate?.degree}</p>
              </div>
              <div>
                  <p>Posizione</p>
                  <p>{jobPosition}</p>
              </div>
          </div>
          <div className='note'>
                <label>Inserisci note</label>
                  <textarea
                    value={note}
                    onChange={handleNoteChange}
                    placeholder="Scrivi delle note qui..."
                    rows="4"
                    cols="50"
                  />
                  {notes !== note && <span onClick={() => updateNotes(selectedCandidate, note)}>Salva</span>}
          </div>
          <hr />
          <a className='allegati' href={selectedCandidate.cvUrl ? selectedCandidate.cvUrl : `https://quizjobs-production.up.railway.app/uploads/${selectedCandidate.cv}`} target="__blank"><img src={allegati} alt='documento link'/>Document Links</a>
          <a className='add-allegato' style={{cursor: 'not-allowed'}}><span>+</span> Aggiungi allegato</a>
       
            <div className="flex justify-center">
                <button className="primary-contained-btn" onClick={onFinish}>
                Invia email
                </button>
            </div></> : activeTab === 2 ?
            tag === "manual" ? 
            <div className='modal-candidate-domande'>
              {candidate?.tests[0].arrayAnswers.questions.map((question, index) => {
                 const answer = candidate?.tests[0].arrayAnswers.answers[index];
                 console.log(answer)
                 const seconds = candidate?.tests[0].arrayAnswers.seconds[index];
                 const correctAnswer = examQuestion.find(q => q.question === question)?.correctOption;

                 return (
                  <div className='modal-manual-question'>
                    <div onClick={() => setOpenIndex(openIndex === index ? null : index)} className='modal-candidate-question-m' key={index}>
                      <div style={{ marginBottom: '5px' }}><span>{index + 1}.</span><p>{question}</p></div>
                      <div style={{ textAlign: 'right' }}><img alt='secondi domanda' src={time} /><span>00:{seconds ? seconds < 10 ? '0'+seconds : seconds : '13'}</span></div>
                    </div>
                    {openIndex === index && (
                          <div className='answer-manual'>
                            <p>{answer}</p>
                          </div>
                        )}
                  </div>
                  )
              })}
            </div> : 
            <div className='modal-candidate-domande'>
              {candidate?.tests[0].arrayAnswers.questions.map((question, index) => {
                 const answer = candidate?.tests[0].arrayAnswers.answers[index];
                 const seconds = candidate?.tests[0].arrayAnswers.seconds[index];
                 const correctAnswer = examQuestion.find(q => q.question === question)?.correctOption;
                 const isCorrect = correctAnswer && correctAnswer.includes(answer);

                 return (
                  <div className='modal-candidate-question' key={index}>
                    {isCorrect ? 
                    <img src={corretta} alt="Icona corretto" style={{ marginRight: '10px' }} />: 
                    <img alt='errata' src={sbagliata} style={{ marginRight: '10px' }} />}
                    <div style={{ marginBottom: '5px' }}><span>{index + 1}.</span><p>{question}</p></div>
                    <div style={{ textAlign: 'right' }}><img alt='secondi domanda' src={time} /><span>00:{seconds ? seconds < 10 ? '0'+seconds : seconds : '13'}</span></div>
                  </div>
                  )
              })}
            </div>
             : 
            <div className='cv-extract'>
              <div>
                <h4>Skills</h4>
                <div>
                  <SkillsChart skills={arraySkills(pdfExtract?.skills)} />
                </div>
              </div>
              <div>
                <h4>Esperienze lavorative </h4>
                <div>
                  <WorkExperienceChart works={arraySkills(pdfExtract?.workExperience)} />
                </div>
              </div>
              <div>
                <h4>Istruzione</h4>
                <div>
                  <EducationChart educ={arraySkills(pdfExtract?.education)} />
                </div>
              </div>
            </div>}
        </div>
    </Modal>
  )
}

export default InfoCandidate