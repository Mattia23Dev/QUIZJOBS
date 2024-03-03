import React, { useEffect, useState } from 'react'
import { Modal, message, Progress } from 'antd'
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice'
import { useDispatch } from 'react-redux'
import { getCandidateInfo } from '../../../apicalls/users'
import allegati from '../../../imgs/allegati.png'
import logo from '../../../imgs/logo.png'
import corretta from '../../../imgs/corretta.png'
import sbagliata from '../../../imgs/cancel.png'
import time from '../../../imgs/time.png'

function InfoCandidate(props) {
  const {showInfoCandidateModal,setShowInfoCandidateModal,examId,refreshData, selectedCandidate, setSelectedCandidate, jobPosition, examQuestion} = props
  const dispatch = useDispatch()
  const [candidate, setCandidate] = useState()
  const [activeTab, setActiveTab] = useState(1)
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

  console.log(examQuestion)

  return (
    <Modal
    title={
      <div className="modal-header">
          <img src={logo} alt="logo skilltest" />
      </div>
      }
      style={{ top: '1rem' }}
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
          </div>
          {activeTab === 1 ? 
          <h2>{selectedCandidate?.name + ' ' + selectedCandidate?.surname} | {jobPosition && jobPosition}</h2>: 
          <h2 style={{textAlign: 'center'}}>Overview Domande</h2>
          }
          {activeTab === 1 ? 
          <><div className='modal-candidate-middle'>
            <div className='modal-punteggio'>
              <p>Punteggio</p>
              <p><font color='#34C15B'>{candidate?.tests[0].correctAnswers}</font>/{candidate?.tests[0].totalQuestions}</p>
            </div>
            <div className='modal-bar'>
              <p>Risposte corrette</p>
              <Progress 
              percent={candidate?.tests[0].report.result.percentage.toFixed(2)} 
              strokeColor={candidate?.tests[0].report.result.percentage > 60 ? "#34C15B" : "#F95959"} />
            </div>
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
          <hr />
          <a className='allegati' href='#'><img src={allegati} alt='documento link'/>Document Links</a>
          <a className='add-allegato' href='#'><span>+</span> Aggiungi allegato</a>
       
            <div className="flex justify-center">
                <button className="primary-contained-btn" onClick={onFinish}>
                Invia email
                </button>
            </div></> :
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
            </div>}
        </div>
    </Modal>
  )
}

export default InfoCandidate