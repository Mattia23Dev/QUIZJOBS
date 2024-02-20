import React, { useEffect } from 'react'
import { Modal, message } from 'antd'
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice'
import { useDispatch } from 'react-redux'
import { getCandidateInfo } from '../../../apicalls/users'

function InfoCandidate(props) {
  const {showInfoCandidateModal,setShowInfoCandidateModal,examId,refreshData, selectedCandidate, setSelectedCandidate} = props
  const dispatch = useDispatch()
  const onFinish = () => {
    setShowInfoCandidateModal(false)
    setSelectedCandidate()
  }
  const getCandidateById = async () => {
    ShowLoading();
    const userId = selectedCandidate._id
    try {
      const response = await getCandidateInfo({userId, examId});
      console.log(response);
      HideLoading();
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    getCandidateById();
  }, [])

  return (
    <Modal title={selectedCandidate? "Edit Question" : "Add Question"} open={showInfoCandidateModal} footer={false} onCancel={()=>{
      setShowInfoCandidateModal(false)
      setSelectedCandidate()
      }}>
        <div className="vertical-form">
            <div className="form-item">
                <p>Nome:</p>
                <p>{selectedCandidate?.name + ' ' + selectedCandidate?.surname}</p>
            </div>
            <div className="form-item">
                <p>Email:</p>
                <p>{selectedCandidate?.email}</p>
            </div>
            <div className="form-item">
                <p>Cellulare:</p>
                <p>{selectedCandidate?.phone}</p>
            </div>
            <div className="form-item">
                <p>Città</p>
                <p>{selectedCandidate?.city}</p>
            </div>
            <div className="form-actions">
                <button className="primary-contained-btn" onClick={onFinish}>
                Save
                </button>
                <button className="primary-outlined-btn" onClick={onFinish}>
                Cancel
                </button>
            </div>
        </div>
    </Modal>
  )
}

export default InfoCandidate