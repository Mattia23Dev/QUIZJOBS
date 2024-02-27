import React, { useState } from 'react'
import { Modal, Form, message } from 'antd'
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice'
import { useDispatch } from 'react-redux'
import { addQuestionToExam, editQuestionInExam } from '../../../apicalls/exams'
import edit from '../../../imgs/edit.png'

function AddEditQuestion(props) {
  const {showAddEditQuestionModal,setShowAddEditQuestionModal,examId,refreshData, selectedQuestion, setSelectedQuestion} = props
  const dispatch = useDispatch()
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
       <Form.Item name="question">
        <input type="text"/>
       </Form.Item>
       <div className='flex gap-2'>
       {selectedQuestion ? (
        editDomanda !== 1 ?
          <div className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['A)'] ? "div-correct-not-edit" : "div-not-edit"}>
            <img onClick={() => setEditDomanda(1)} alt='edit question' src={edit} />
              <h4 className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['A)'].trim() ? "risposta-edit risposta-corretta-edit" : "risposta-edit"}>
                <span>A</span>{selectedQuestion?.opzioni['A)']}
              </h4>
          </div> :
          <Form.Item name="A" label="A">
            <input type="text" className={selectedQuestion ? selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['A)'] ? "edit-correct" : "" : ""}/>
          </Form.Item>
       ) :
       <Form.Item name="A" label="A">
        <input type="text" />
       </Form.Item>}
       {selectedQuestion ? (
        editDomanda !== 2 ?
          <div className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['B)'] ? "div-correct-not-edit" : "div-not-edit"}>
            <img onClick={() => setEditDomanda(2)} alt='edit question' src={edit} />
              <h4 className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['B)'].trim() ? "risposta-edit risposta-corretta-edit" : "risposta-edit"}>
                <span>B</span>{selectedQuestion?.opzioni['B)']}
              </h4>
          </div> :
          <Form.Item name="B" label="B">
            <input type="text" className={selectedQuestion ? selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['B)'] ? "edit-correct" : "" : ""}/>
          </Form.Item>
       ) :
       <Form.Item name="B" label="B">
        <input type="text" />
       </Form.Item>}
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
          <Form.Item name="C" label="C">
            <input type="text" className={selectedQuestion ? selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['C)'] ? "edit-correct" : "" : ""}/>
          </Form.Item>
       ) :
       <Form.Item name="C" label="C">
        <input type="text" />
       </Form.Item>}
       {selectedQuestion ? (
        editDomanda !== 4 ?
          <div className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['D)'] ? "div-correct-not-edit" : "div-not-edit"}>
            <img onClick={() => setEditDomanda(4)} alt='edit question' src={edit} />
              <h4 className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['D)'].trim() ? "risposta-edit risposta-corretta-edit" : "risposta-edit"}>
                <span>D</span>{selectedQuestion?.opzioni['D)']}
              </h4>
          </div> :
          <Form.Item name="D" label="D">
            <input type="text" className={selectedQuestion ? selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['D)'] ? "edit-correct" : "" : ""}/>
          </Form.Item>
       ) :
       <Form.Item name="D" label="D">
        <input type="text" />
       </Form.Item>}
       </div>
       <div className='flex justify-end gap-2 mt-2'>
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