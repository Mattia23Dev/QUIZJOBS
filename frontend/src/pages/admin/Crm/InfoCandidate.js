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
import timered from '../../../imgs/timered.png'
import timegreen from '../../../imgs/timegreen.png'

function InfoCandidate(props) {
  const {showInfoCandidateModal,setShowInfoCandidateModal,examId,refreshData, selectedCandidate, setSelectedCandidate, jobPosition, exams} = props
  const dispatch = useDispatch()
  const [candidate, setCandidate] = useState()
  const [activeTab, setActiveTab] = useState(1)
  const onFinish = () => {
    setShowInfoCandidateModal(false)
    setSelectedCandidate()
  }
  const getCandidateById = async () => {
    const userId = selectedCandidate.candidateId
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

  const handleScoreMedium = () => {
    const totalScores = candidate.tests.reduce((accumulator, currentTest) => {
      return accumulator + currentTest.report.result.percentage;
    }, 0);
    
    const numberOfTests = candidate.tests.length;
    
    const averageScore = (totalScores / numberOfTests).toFixed(2);
    return averageScore
  }

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
  
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

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
              <p>Test</p>
            </div>
          </div>
          {activeTab === 1 ? 
          <h2>{selectedCandidate?.name + ' ' + selectedCandidate?.surname} | {jobPosition && jobPosition}</h2>: 
          <h2 style={{textAlign: 'center'}}>Overview Test</h2>
          }
          {activeTab === 1 ? 
          <><div className='modal-candidate-middle'>
            <div className='modal-punteggio'>
              <p>Test svolti</p>
              <p><font color='#34C15B'>{candidate?.tests.length}</font></p>
            </div>
            <div className='modal-bar'>
              <p>Media punteggi</p>
              {candidate && <Progress percent={handleScoreMedium()} strokeColor={handleScoreMedium() > 60 ? "#34C15B" : "#F95959"} />}
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
          <a className='allegati' href={`https://quizjobs-production.up.railway.app/uploads/${selectedCandidate.cv}`} target="__blank"><img src={allegati} alt='documento link'/>Document Links</a>
          <a className='add-allegato' href='#'><span>+</span> Aggiungi allegato</a>
       
            <div className="flex justify-center">
                <button className="primary-contained-btn" onClick={onFinish}>
                Invia email
                </button>
            </div></> :
            <div className='modal-candidate-domande'>
              {selectedCandidate?.tests.length > 0 && selectedCandidate.tests.map((test, index) => {
                const report = (test.correctAnswers / test.totalQuestions * 100).toFixed(2);
                const totalSeconds = Object.values(test?.arrayAnswers?.seconds).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                const formattedTime = formatTime(totalSeconds);
                 return (
                  <div className='modal-candidate-question' key={index}>
                    {report > 60 ? 
                    <img src={corretta} alt="Icona corretto" style={{ marginRight: '10px' }} />: 
                    <img alt='errata' src={sbagliata} style={{ marginRight: '10px' }} />}
                    <div style={{ marginBottom: '5px' }}><span>{index + 1}.</span><p style={{fontSize: '14px'}}>{test.testName}</p></div>
                    <div className={report > 60 ? "time-column-green" : "time-column-red"} style={{ textAlign: 'right', fontSize: '12px' }}><span>{report}%</span></div>
                    <div className={report > 60 ? "time-column-green" : "time-column-red"} style={{ textAlign: 'right' }}><img alt='tempo medio' src={report > 60 ? timegreen : timered} /><span>{formattedTime}</span></div>
                  </div>
                  )
              })}
            </div>}
        </div>
    </Modal>
  )
}

export default InfoCandidate