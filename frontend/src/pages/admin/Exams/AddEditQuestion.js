import React, { useState } from 'react'
import { Modal, Form, message } from 'antd'
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice'
import { useDispatch } from 'react-redux'
import { addQuestionToExam, editQuestionInExam } from '../../../apicalls/exams'
import edit from '../../../imgs/edit.png'
import v from '../../../imgs/vb.png'
import vg from '../../../imgs/vg.png'

function AddEditQuestion(props) {
  const {showAddEditQuestionModal,setShowAddEditQuestionModal,examId,refreshData, selectedQuestion, setSelectedQuestion} = props
  const dispatch = useDispatch()
  const [correctOpzAdd, setCorrectOpzAdd] = useState(1);
  const [editDomanda, setEditDomanda] = useState(0)
  const onFinish = async(values) => {
   try{
     dispatch(ShowLoading())
     let response;
     if(selectedQuestion){
      const requiredPayload1 = {
        name: values.name,
        correctOption: values.correctOption,
        options: {
          A: values.A,
          B: values.B,
          C: values.C,
          D: values.D
        },
        exam: examId,
        questionId: selectedQuestion?._id
       }
       response = await editQuestionInExam(requiredPayload1, examId)
     }
     else{
      const requiredPayload2 = {
        name: values.name,
        correctOption: values.correctOption,
        options: {
          A: values.A,
          B: values.B,
          C: values.C,
          D: values.D
        },
        exam: examId,
       }
      response = await addQuestionToExam(requiredPayload2,examId)
     }
     dispatch(HideLoading())
     if(response.success){
      message.success(response.message)
      refreshData(examId)
      setShowAddEditQuestionModal(false)
     }
     else{
      message.error(response.message)
      setShowAddEditQuestionModal(false)
     }
   }
   catch(error){
    dispatchEvent(HideLoading())
    setShowAddEditQuestionModal(false)
    message.error(error.message)
   }
  }
  console.log(selectedQuestion)
  return (
    <Modal title={selectedQuestion? "Modifica la domanda" : "Aggiungi una domanda"} 
      open={showAddEditQuestionModal} 
      footer={false} onCancel={()=>{
      setShowAddEditQuestionModal(false)
      setSelectedQuestion()
      }}
      width="40%">
     <Form onFinish={onFinish} layout="vertical" initialValues={{
       question: selectedQuestion?.domanda,
       correctOption: selectedQuestion?.rispostaCorretta,
       A: selectedQuestion?.opzioni['A)'],
       B: selectedQuestion?.opzioni['B)'],
       C: selectedQuestion?.opzioni['C)'],
       D: selectedQuestion?.opzioni['D)'],
     }}>
      {selectedQuestion ? (
      editDomanda !== 5 ?
      <div className="div-question-edit">
        <img onClick={() => setEditDomanda(5)} alt='edit question' src={edit} />
          <h4>
            {selectedQuestion?.domanda}
          </h4>
      </div> :
      <div className="div-question-edit">
        <Form.Item name="question">
          <input type="text" />
        </Form.Item>
      </div>
      ):
        <div className="div-question-edit">
          <Form.Item name="question">
            <input type="text" />
          </Form.Item>
        </div>}
       <div className='flex gap-2'>
       {selectedQuestion ? (
        editDomanda !== 1 ?
          <div className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['A)'] ? "div-correct-not-edit" : "div-not-edit"}>
            <img onClick={() => setEditDomanda(1)} alt='edit question' src={edit} />
              <h4 className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['A)'].trim() ? "risposta-edit risposta-corretta-edit" : "risposta-edit"}>
                <span>A</span>{selectedQuestion?.opzioni['A)']}
              </h4>
          </div> :
          <div className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['A)'].trim() ? "risposta-edit-edit" : "risposta-edit-edit"}>
            <span>A</span>
            <Form.Item name="A">
              <input type="text" />
            </Form.Item>
            {selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['A)'].trim() ? 
            <img className='img-set-correct' alt='imposta risposta corretta' src={v} /> : <img className='img-set-correct' alt='imposta risposta corretta' src={vg} />}
          </div>
       ) :
        <div className="risposta-edit-edit">
          <span>A</span>
          <Form.Item name="A">
            <input type="text" />
          </Form.Item>
          {correctOpzAdd === 1 ?
          <img className='img-set-correct' alt='imposta risposta corretta' src={v} /> : <img className='img-set-correct' onClick={() => setCorrectOpzAdd(1)} alt='imposta risposta corretta' src={vg} />}
        </div>}
       {selectedQuestion ? (
        editDomanda !== 2 ?
          <div className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['B)'] ? "div-correct-not-edit" : "div-not-edit"}>
            <img onClick={() => setEditDomanda(2)} alt='edit question' src={edit} />
              <h4 className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['B)'].trim() ? "risposta-edit risposta-corretta-edit" : "risposta-edit"}>
                <span>B</span>{selectedQuestion?.opzioni['B)']}
              </h4>
          </div> :
          <div className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['B)'].trim() ? "risposta-edit-edit" : "risposta-edit-edit"}>
            <span>B</span>
            <Form.Item name="B">
              <input type="text" />
            </Form.Item>
            {selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['B)'].trim() ? 
            <img className='img-set-correct' alt='imposta risposta corretta' src={v} /> : <img className='img-set-correct' alt='imposta risposta corretta' src={vg} />}
          </div>
       ) :
        <div className="risposta-edit-edit">
          <span>B</span>
          <Form.Item name="B">
            <input type="text" />
          </Form.Item>
          {correctOpzAdd === 2 ?
          <img className='img-set-correct' alt='imposta risposta corretta' src={v} /> : <img className='img-set-correct' onClick={() => setCorrectOpzAdd(2)} alt='imposta risposta corretta' src={vg} />}
        </div>}
       </div>
       <div className='flex gap-2'>
       {selectedQuestion ? (
        editDomanda !== 3 ?
          <div className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['C)'] ? "div-correct-not-edit" : "div-not-edit"}>
            <img onClick={() => setEditDomanda(3)} alt='edit question' src={edit} />
              <h4 className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['C)'].trim() ? "risposta-edit risposta-corretta-edit" : "risposta-edit"}>
                <span>C</span>{selectedQuestion?.opzioni['C)']}
              </h4>
          </div> :
          <div className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['C)'].trim() ? "risposta-edit-edit" : "risposta-edit-edit"}>
            <span>C</span>
            <Form.Item name="C">
              <input type="text" />
            </Form.Item>
            {selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['C)'].trim() ? 
            <img className='img-set-correct' alt='imposta risposta corretta' src={v} /> : <img className='img-set-correct' alt='imposta risposta corretta' src={vg} />}
          </div>
       ) :
        <div className="risposta-edit-edit">
          <span>C</span>
          <Form.Item name="C">
            <input type="text" />
          </Form.Item>
          {correctOpzAdd === 3 ?
          <img className='img-set-correct' alt='imposta risposta corretta' src={v} /> : <img className='img-set-correct' onClick={() => setCorrectOpzAdd(3)} alt='imposta risposta corretta' src={vg} />}
        </div>}
       {selectedQuestion ? (
        editDomanda !== 4 ?
          <div className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['D)'] ? "div-correct-not-edit" : "div-not-edit"}>
            <img onClick={() => setEditDomanda(4)} alt='edit question' src={edit} />
              <h4 className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['D)'].trim() ? "risposta-edit risposta-corretta-edit" : "risposta-edit"}>
                <span>D</span>{selectedQuestion?.opzioni['D)']}
              </h4>
          </div> :
          <div className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['D)'].trim() ? "risposta-edit-edit" : "risposta-edit-edit"}>
            <span>D</span>
            <Form.Item name="D">
              <input type="text" />
            </Form.Item>
            {selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['D)'].trim() ? 
            <img className='img-set-correct' alt='imposta risposta corretta' src={v} /> : <img className='img-set-correct' alt='imposta risposta corretta' src={vg} />}
          </div>
       ) :
        <div className="risposta-edit-edit">
          <span>D</span>
          <Form.Item name="D">
            <input type="text" />
          </Form.Item>
          {correctOpzAdd === 4 ?
          <img className='img-set-correct' alt='imposta risposta corretta' src={v} /> : <img className='img-set-correct' onClick={() => setCorrectOpzAdd(4)} alt='imposta risposta corretta' src={vg} />}
        </div>}
       </div>
       <div className='flex justify-center gap-2 mt-2'>
          <button className='primary-contained-btn'
          type="submit"
          >
           Salva modifiche
          </button>
       </div>
     </Form>
    </Modal>
  )
}

export default AddEditQuestion