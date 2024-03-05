import React, { useState } from 'react'
import { Modal, Form, message } from 'antd'
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice'
import { useDispatch } from 'react-redux'
import edit from '../../../imgs/edit.png'
import v from '../../../imgs/vb.png'
import vg from '../../../imgs/vg.png'

function AddEditQuestion(props) {
  const {showAddEditQuestionModal,setShowAddEditQuestionModal,editQuestionInExam,addQuestionToExam, selectedQuestion, setSelectedQuestion} = props
  const dispatch = useDispatch()
  const [correctOpzAdd, setCorrectOpzAdd] = useState("A)");
  const [editDomanda, setEditDomanda] = useState(0)
  const [domandaVisual, setDomandaVisual] = useState(selectedQuestion ? selectedQuestion : {})
  const onFinish = async(values) => {
   try{
     dispatch(ShowLoading())
     if(selectedQuestion){
      const requiredPayload1 = {
        domanda: domandaVisual.domanda,
        rispostaCorretta: {
          lettera: selectedQuestion.rispostaCorretta.lettera,
          risposta: selectedQuestion.rispostaCorretta.lettera === "A)" ? domandaVisual.opzioni["A)"] :
          selectedQuestion.rispostaCorretta.lettera === "B)" ? domandaVisual.opzioni["B)"] : 
          selectedQuestion.rispostaCorretta.lettera === "C)" ? domandaVisual.opzioni["C)"] :
          domandaVisual.opzioni["D)"]
        },
        opzioni: {
          'A)': domandaVisual.opzioni["A)"],
          'B)': domandaVisual.opzioni["B)"],
          'C)': domandaVisual.opzioni["C)"],
          'D)': domandaVisual.opzioni["D)"]
        }
       }
       editQuestionInExam(requiredPayload1)
       console.log(requiredPayload1);
       dispatch(HideLoading())
       message.success("Domanda modificata")
       setShowAddEditQuestionModal(false)
     }
     else{
      const requiredPayload2 = {
        domanda: values.question,
        rispostaCorretta: {
          lettera: correctOpzAdd,
          risposta: correctOpzAdd === "A)" ? values.A :
          correctOpzAdd === "B)" ? values.B : 
          correctOpzAdd === "C)" ? values.C :
          values.D
        },
        opzioni: {
          'A)': values.A,
          'B)': values.B,
          'C)': values.C,
          'D)': values.D
        },
       }
      addQuestionToExam(requiredPayload2)
      console.log(requiredPayload2);
      dispatch(HideLoading())
      message.success("Domanda aggiunta")
      setShowAddEditQuestionModal(false)
     }
   }
   catch(error){
    dispatchEvent(HideLoading())
    setShowAddEditQuestionModal(false)
    message.error(error.message)
   }
  }

  const handleChange = (e, name) => {
    const { value } = e.target;
  
    if (name === 'A') {
      setDomandaVisual(prevState => ({
        ...prevState,
        opzioni: {
          ...prevState.opzioni,
          "A)": value
        }
      }));
    } else if (name === "B") {
      setDomandaVisual(prevState => ({
        ...prevState,
        opzioni: {
          ...prevState.opzioni,
          "B)": value
        }
      }));
    } else if (name === "C") {
      setDomandaVisual(prevState => ({
        ...prevState,
        opzioni: {
          ...prevState.opzioni,
          "C)": value
        }
      }));
    } else if (name === "D") {
      setDomandaVisual(prevState => ({
        ...prevState,
        opzioni: {
          ...prevState.opzioni,
          "D)": value
        }
      }));
    }
  };

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
                <span>A</span>{domandaVisual?.opzioni["A)"]}
              </h4>
          </div> :
          <div className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['A)'].trim() ? "risposta-edit-edit" : "risposta-edit-edit"}>
            <span>A</span>
            <Form.Item name="A">
              <input type="text" onChange={(e) => handleChange(e, 'A')}/>
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
          {correctOpzAdd === 'A)' ?
          <img className='img-set-correct' alt='imposta risposta corretta' src={v} /> : <img className='img-set-correct' onClick={() => setCorrectOpzAdd('A)')} alt='imposta risposta corretta' src={vg} />}
        </div>}
       {selectedQuestion ? (
        editDomanda !== 2 ?
          <div className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['B)'] ? "div-correct-not-edit" : "div-not-edit"}>
            <img onClick={() => setEditDomanda(2)} alt='edit question' src={edit} />
              <h4 className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['B)'].trim() ? "risposta-edit risposta-corretta-edit" : "risposta-edit"}>
                <span>B</span>{domandaVisual?.opzioni["B)"]}
              </h4>
          </div> :
          <div className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['B)'].trim() ? "risposta-edit-edit" : "risposta-edit-edit"}>
            <span>B</span>
            <Form.Item name="B">
              <input type="text" onChange={(e) => handleChange(e, 'B')} />
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
          {correctOpzAdd === 'B)' ?
          <img className='img-set-correct' alt='imposta risposta corretta' src={v} /> : <img className='img-set-correct' onClick={() => setCorrectOpzAdd('B)')} alt='imposta risposta corretta' src={vg} />}
        </div>}
       </div>
       <div className='flex gap-2'>
       {selectedQuestion ? (
        editDomanda !== 3 ?
          <div className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['C)'] ? "div-correct-not-edit" : "div-not-edit"}>
            <img onClick={() => setEditDomanda(3)} alt='edit question' src={edit} />
              <h4 className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['C)'].trim() ? "risposta-edit risposta-corretta-edit" : "risposta-edit"}>
                <span>C</span>{domandaVisual?.opzioni["C)"]}
              </h4>
          </div> :
          <div className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['C)'].trim() ? "risposta-edit-edit" : "risposta-edit-edit"}>
            <span>C</span>
            <Form.Item name="C">
              <input type="text" onChange={(e) => handleChange(e, 'C')} />
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
          {correctOpzAdd === "C)" ?
          <img className='img-set-correct' alt='imposta risposta corretta' src={v} /> : <img className='img-set-correct' onClick={() => setCorrectOpzAdd('C)')} alt='imposta risposta corretta' src={vg} />}
        </div>}
       {selectedQuestion ? (
        editDomanda !== 4 ?
          <div className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['D)'] ? "div-correct-not-edit" : "div-not-edit"}>
            <img onClick={() => setEditDomanda(4)} alt='edit question' src={edit} />
              <h4 className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['D)'].trim() ? "risposta-edit risposta-corretta-edit" : "risposta-edit"}>
                <span>D</span>{domandaVisual?.opzioni["D)"]}
              </h4>
          </div> :
          <div className={selectedQuestion.rispostaCorretta.risposta === selectedQuestion.opzioni['D)'].trim() ? "risposta-edit-edit" : "risposta-edit-edit"}>
            <span>D</span>
            <Form.Item name="D">
              <input type="text" onChange={(e) => handleChange(e, 'D')} />
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
          {correctOpzAdd === "D)" ?
          <img className='img-set-correct' alt='imposta risposta corretta' src={v} /> : <img className='img-set-correct' onClick={() => setCorrectOpzAdd('D)')} alt='imposta risposta corretta' src={vg} />}
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