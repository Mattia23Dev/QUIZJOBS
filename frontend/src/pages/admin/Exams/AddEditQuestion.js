import React, { useState } from 'react'
import { Modal, Form, message, Segmented } from 'antd'
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice'
import { useDispatch } from 'react-redux'
import edit from '../../../imgs/edit.png'
import v from '../../../imgs/vb.png'
import vg from '../../../imgs/vg.png'

export function AddEditQuestion(props) {
  const {showAddEditQuestionModal, creato, tag, setShowAddEditQuestionModal,editQuestionInExam,addQuestionToExam, selectedQuestion, setSelectedQuestion} = props
  const dispatch = useDispatch()
  const [domandaType, setDomandaType] = useState("")
  const [correctOpzAdd, setCorrectOpzAdd] = useState("A)");
  const [editDomanda, setEditDomanda] = useState(0)
  const [domandaVisual, setDomandaVisual] = useState(selectedQuestion ? selectedQuestion : {})
  const onFinish = async(values) => {
   try{
     if(selectedQuestion){
      if (creato){
        const requiredPayload1 = {
          question: domandaVisual.domanda,
          correctOption: selectedQuestion.rispostaCorretta?.lettera?.trim() === "A)" ? 'A) '+domandaVisual.opzioni["A)"] :
            selectedQuestion.rispostaCorretta?.lettera?.trim() === "B)" ? 'B) '+domandaVisual.opzioni["B)"] : 
            selectedQuestion.rispostaCorretta?.lettera?.trim() === "C)" ? 'C) '+domandaVisual.opzioni["C)"] :
            'D) '+domandaVisual.opzioni["D)"],
          options: {
            'A)': domandaVisual.opzioni["A)"],
            'B)': domandaVisual.opzioni["B)"],
            'C)': domandaVisual.opzioni["C)"],
            'D)': domandaVisual.opzioni["D)"]
          }
        }
        editQuestionInExam(requiredPayload1)
        console.log(requiredPayload1);        
      } else {
        const requiredPayload1 = {
          domanda: domandaVisual.domanda,
          rispostaCorretta: {
            lettera: selectedQuestion.rispostaCorretta.lettera,
            risposta: selectedQuestion.rispostaCorretta?.lettera?.trim() === "A)" ? domandaVisual.opzioni["A)"] :
            selectedQuestion.rispostaCorretta?.lettera?.trim() === "B)" ? domandaVisual.opzioni["B)"] : 
            selectedQuestion.rispostaCorretta?.lettera?.trim() === "C)" ? domandaVisual.opzioni["C)"] :
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
      }

       dispatch(HideLoading())
       message.success("Domanda modificata")
       setShowAddEditQuestionModal(false)
     }
     else{
      if (!values.question || !values.A || !values.B || !values.C || !values.D) {
        window.alert("Compila tutti i campi")
        return
      }
      if (creato){
        const requiredPayload2 = {
          question: values.question,
          correctOption: correctOpzAdd === "A)" ? 'A) ' +values.A :
            correctOpzAdd === "B)" ? 'B) ' +values.B : 
            correctOpzAdd === "C)" ? 'C) ' +values.C :
            'D) ' +values.D,
          options: {
            'A)': values.A,
            'B)': values.B,
            'C)': values.C,
            'D)': values.D
          },
        }
        addQuestionToExam(requiredPayload2)
        console.log(requiredPayload2);
      } else {
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
      }

      message.success("Domanda aggiunta")
      setShowAddEditQuestionModal(false)
     }
   }
   catch(error){
    setShowAddEditQuestionModal(false)
    message.error(error.message)
   }
  }
console.log(selectedQuestion)
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
    } else if (name === "question") {
      setDomandaVisual(prevState => ({
        ...prevState,
        domanda: value,
      }));
    } 
  };

  const finishOpenQuestion = (values) => {
    if (!values.question) {
      window.alert("Inserisci la domanda")
      return
    }
    console.log(values)
    if (creato){
      const payload = {
        question: values.question
      }
      addQuestionToExam(payload)
    } else {
      const payload = {
        domanda: values.question
      }
      addQuestionToExam(payload)
    }
    setShowAddEditQuestionModal(false)
  }
  const onFinishClose = (values) => {
    if (selectedQuestion){
      if (!domandaVisual.opzioni["A)"] || !domandaVisual.opzioni["B)"] || !domandaVisual.opzioni["C)"] || 
          !domandaVisual.opzioni["D)"]) {
            window.alert("Compila tutti i campi")
            return
          }
      if (creato){
        const requiredPayload1 = {
          question: domandaVisual.domanda,
          options: {
            'A)': domandaVisual.opzioni["A)"],
            'B)': domandaVisual.opzioni["B)"],
            'C)': domandaVisual.opzioni["C)"],
            'D)': domandaVisual.opzioni["D)"]
          }
        }
        editQuestionInExam(requiredPayload1)  
      } else {
        const requiredPayload1 = {
          domanda: selectedQuestion.domanda,
          opzioni: {
            'A)': domandaVisual.opzioni["A)"],
            'B)': domandaVisual.opzioni["B)"],
            'C)': domandaVisual.opzioni["C)"],
            'D)': domandaVisual.opzioni["D)"]
          }
        }
        editQuestionInExam(requiredPayload1)      
      }
      message.success("Domanda modificata")
      setShowAddEditQuestionModal(false)
    } else {
      if (!values.question || !values.A || !values.B || !values.C || !values.D) {
        window.alert("Compila tutti i campi")
        return
      }
      if (creato){
        const requiredPayload1 = {
          question: values.question,
          options: {
            'A)': values.A,
            'B)': values.B,
            'C)': values.C,
            'D)': values.D
          },
         }
         addQuestionToExam(requiredPayload1)  
      } else {
        const requiredPayload1 = {
          domanda: values.question,
          opzioni: {
            'A)': values.A,
            'B)': values.B,
            'C)': values.C,
            'D)': values.D
          },
        }
        addQuestionToExam(requiredPayload1)      
      }
       message.success("Domanda modificata")
       setShowAddEditQuestionModal(false)
    }
    
  }
  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  return (
    <Modal title={selectedQuestion? "Modifica la domanda" : "Aggiungi una domanda"} 
      open={showAddEditQuestionModal} 
      footer={false} onCancel={()=>{
      setShowAddEditQuestionModal(false)
      setSelectedQuestion()
      }}
      width={isMobile() ? '100%' : "40%"}>
      {tag === "manual" ? (
        <>
        <div style={{display: 'flex', justifyContent: 'center', margin: '0px 0 20px 0'}}> 
        {!selectedQuestion && <Segmented
              options={['Domanda chiusa', 'Domanda aperta']}
              onChange={(value) => {
                console.log(value);
                setDomandaType(value)
              }}
            />}
        </div>
        {domandaType === "Domanda aperta" ? (
        <Form onFinish={finishOpenQuestion} layout='vertical'>
          <div className="div-question-edit">
            <Form.Item name="question">
              <input type="text" />
            </Form.Item>
          </div>
          <div className='flex justify-center gap-2 mt-2'>
            <button className='primary-contained-btn'
            type="submit"
            >
            Salva modifiche
            </button>
          </div>
        </Form>
      ) : (
     <Form onFinish={onFinishClose} layout="vertical" initialValues={{
       question: selectedQuestion?.domanda,
       A: selectedQuestion?.opzioni['A)'],
       B: selectedQuestion?.opzioni['B)'],
       C: selectedQuestion?.opzioni['C)'],
       D: selectedQuestion?.opzioni['D)'],
     }}>
      {selectedQuestion ? (
      editDomanda !== 5 ?
      <div className="div-question-edit">
        <img style={{cursor: 'not-allowed'}} alt='edit question' src={edit} />
          <h4>
            {domandaVisual?.domanda}
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
       <div className='flex flex-mobile gap-2'>
       {selectedQuestion ? (
        editDomanda !== 1 ?
          <div className="div-not-edit">
            <img onClick={() => setEditDomanda(1)} alt='edit question' src={edit} />
              <h4 className="risposta-edit">
                <span>A</span>{domandaVisual?.opzioni["A)"]}
              </h4>
          </div> :
          <div className="risposta-edit-edit">
            <span>A</span>
            <Form.Item name="A">
              <input type="text" onChange={(e) => handleChange(e, 'A')}/>
            </Form.Item>
            <img className='img-set-correct' alt='imposta risposta corretta' src={vg} />
          </div>
       ) :
        <div className="risposta-edit-edit">
          <span>A</span>
          <Form.Item name="A">
            <input type="text" />
          </Form.Item>
          <img className='img-set-correct' alt='imposta risposta corretta' src={vg} />
        </div>}
       {selectedQuestion ? (
        editDomanda !== 2 ?
          <div className="div-not-edit">
            <img onClick={() => setEditDomanda(2)} alt='edit question' src={edit} />
              <h4 className="risposta-edit">
                <span>B</span>{domandaVisual?.opzioni["B)"]}
              </h4>
          </div> :
          <div className="risposta-edit-edit">
            <span>B</span>
            <Form.Item name="B">
              <input type="text" onChange={(e) => handleChange(e, 'B')} />
            </Form.Item>
            <img className='img-set-correct' alt='imposta risposta corretta' src={vg} />
          </div>
       ) :
        <div className="risposta-edit-edit">
          <span>B</span>
          <Form.Item name="B">
            <input type="text" />
          </Form.Item>
          <img className='img-set-correct' alt='imposta risposta corretta' src={vg} />
        </div>}
       </div>
       <div className='flex flex-mobile gap-2'>
       {selectedQuestion ? (
        editDomanda !== 3 ?
          <div className="div-not-edit">
            <img onClick={() => setEditDomanda(3)} alt='edit question' src={edit} />
              <h4 className="risposta-edit">
                <span>C</span>{domandaVisual?.opzioni["C)"]}
              </h4>
          </div> :
          <div className="risposta-edit-edit">
            <span>C</span>
            <Form.Item name="C">
              <input type="text" onChange={(e) => handleChange(e, 'C')} />
            </Form.Item>
            <img className='img-set-correct' alt='imposta risposta corretta' src={vg} />
          </div>
       ) :
        <div className="risposta-edit-edit">
          <span>C</span>
          <Form.Item name="C">
            <input type="text" />
          </Form.Item>
          <img className='img-set-correct' alt='imposta risposta corretta' src={vg} />
        </div>}
       {selectedQuestion ? (
        editDomanda !== 4 ?
          <div className="div-not-edit">
            <img onClick={() => setEditDomanda(4)} alt='edit question' src={edit} />
              <h4 className="risposta-edit">
                <span>D</span>{domandaVisual?.opzioni["D)"]}
              </h4>
          </div> :
          <div className="risposta-edit-edit">
            <span>D</span>
            <Form.Item name="D">
              <input type="text" onChange={(e) => handleChange(e, 'D')} />
            </Form.Item>
            <img className='img-set-correct' alt='imposta risposta corretta' src={vg} />
          </div>
       ) :
        <div className="risposta-edit-edit">
          <span>D</span>
          <Form.Item name="D">
            <input type="text" />
          </Form.Item>
          <img className='img-set-correct' alt='imposta risposta corretta' src={vg} />
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
      )}
        </>
      ) : (
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
          <img style={{cursor: 'not-allowed'}} alt='edit question' src={edit} />
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
        <div className='flex flex-mobile gap-2'>
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
        <div className='flex flex-mobile gap-2'>
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
      )}


    </Modal>
  )
}

export function AddEditQuestionPersonalizzate(props) {
  const {showAddEditQuestionModal, creato, tag, setShowAddEditQuestionModal,editQuestionInExam,addQuestionToExam, selectedQuestion, setSelectedQuestion} = props
  const dispatch = useDispatch()
  const [domandaType, setDomandaType] = useState("")
  const [correctOpzAdd, setCorrectOpzAdd] = useState("A)");
  const [editDomanda, setEditDomanda] = useState(0)
  const [domandaVisual, setDomandaVisual] = useState(selectedQuestion ? selectedQuestion : {})
  const onFinish = async(values) => {
   try{
     if(selectedQuestion){
      if (creato){
        const requiredPayload1 = {
          question: domandaVisual.domanda,
          correctOption: selectedQuestion.rispostaCorretta?.lettera?.trim() === "A)" ? 'A) '+domandaVisual.opzioni["A)"] :
            selectedQuestion.rispostaCorretta?.lettera?.trim() === "B)" ? 'B) '+domandaVisual.opzioni["B)"] : 
            selectedQuestion.rispostaCorretta?.lettera?.trim() === "C)" ? 'C) '+domandaVisual.opzioni["C)"] :
            'D) '+domandaVisual.opzioni["D)"],
          options: {
            'A)': domandaVisual.opzioni["A)"],
            'B)': domandaVisual.opzioni["B)"],
            'C)': domandaVisual.opzioni["C)"],
            'D)': domandaVisual.opzioni["D)"]
          }
        }
        editQuestionInExam(requiredPayload1)
        console.log(requiredPayload1);        
      } else {
        const requiredPayload1 = {
          domanda: domandaVisual.domanda,
          rispostaCorretta: {
            lettera: selectedQuestion.rispostaCorretta.lettera,
            risposta: selectedQuestion.rispostaCorretta?.lettera?.trim() === "A)" ? domandaVisual.opzioni["A)"] :
            selectedQuestion.rispostaCorretta?.lettera?.trim() === "B)" ? domandaVisual.opzioni["B)"] : 
            selectedQuestion.rispostaCorretta?.lettera?.trim() === "C)" ? domandaVisual.opzioni["C)"] :
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
      }

       dispatch(HideLoading())
       message.success("Domanda modificata")
       setShowAddEditQuestionModal(false)
     }
     else{
      if (!values.question || !values.A || !values.B || !values.C || !values.D) {
        window.alert("Compila tutti i campi")
        return
      }
      if (creato){
        const requiredPayload2 = {
          question: values.question,
          correctOption: correctOpzAdd === "A)" ? 'A) ' +values.A :
            correctOpzAdd === "B)" ? 'B) ' +values.B : 
            correctOpzAdd === "C)" ? 'C) ' +values.C :
            'D) ' +values.D,
          options: {
            'A)': values.A,
            'B)': values.B,
            'C)': values.C,
            'D)': values.D
          },
        }
        addQuestionToExam(requiredPayload2)
        console.log(requiredPayload2);
      } else {
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
      }

      message.success("Domanda aggiunta")
      setShowAddEditQuestionModal(false)
     }
   }
   catch(error){
    setShowAddEditQuestionModal(false)
    message.error(error.message)
   }
  }
console.log(selectedQuestion)
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
    } else if (name === "question") {
      setDomandaVisual(prevState => ({
        ...prevState,
        domanda: value,
      }));
    } 
  };

  const finishOpenQuestion = (values) => {
    if (!values.question) {
      window.alert("Inserisci la domanda")
      return
    }
    console.log(values)
    if (creato){
      const payload = {
        question: values.question
      }
      addQuestionToExam(payload)
    } else {
      const payload = {
        domanda: values.question
      }
      addQuestionToExam(payload)
    }
    setShowAddEditQuestionModal(false)
  }
  const onFinishClose = (values) => {
    if (selectedQuestion){
      if (!domandaVisual.opzioni["A)"] || !domandaVisual.opzioni["B)"] || !domandaVisual.opzioni["C)"] || 
          !domandaVisual.opzioni["D)"]) {
            window.alert("Compila tutti i campi")
            return
          }
      if (creato){
        const requiredPayload1 = {
          question: domandaVisual.domanda,
          options: {
            'A)': domandaVisual.opzioni["A)"],
            'B)': domandaVisual.opzioni["B)"],
            'C)': domandaVisual.opzioni["C)"],
            'D)': domandaVisual.opzioni["D)"]
          }
        }
        editQuestionInExam(requiredPayload1)  
      } else {
        const requiredPayload1 = {
          domanda: selectedQuestion.domanda,
          opzioni: {
            'A)': domandaVisual.opzioni["A)"],
            'B)': domandaVisual.opzioni["B)"],
            'C)': domandaVisual.opzioni["C)"],
            'D)': domandaVisual.opzioni["D)"]
          }
        }
        editQuestionInExam(requiredPayload1)      
      }
      message.success("Domanda modificata")
      setShowAddEditQuestionModal(false)
    } else {
      if (!values.question || !values.A || !values.B || !values.C || !values.D) {
        window.alert("Compila tutti i campi")
        return
      }
      if (creato){
        const requiredPayload1 = {
          question: values.question,
          options: {
            'A)': values.A,
            'B)': values.B,
            'C)': values.C,
            'D)': values.D
          },
         }
         addQuestionToExam(requiredPayload1)  
      } else {
        const requiredPayload1 = {
          domanda: values.question,
          opzioni: {
            'A)': values.A,
            'B)': values.B,
            'C)': values.C,
            'D)': values.D
          },
        }
        addQuestionToExam(requiredPayload1)      
      }
       message.success("Domanda modificata")
       setShowAddEditQuestionModal(false)
    }
    
  }
  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  return (
    <Modal title={selectedQuestion? "Modifica la domanda" : "Aggiungi una domanda"} 
      open={showAddEditQuestionModal} 
      footer={false} onCancel={()=>{
      setShowAddEditQuestionModal(false)
      setSelectedQuestion()
      }}
      width={isMobile() ? '100%' : "40%"}>
        <div style={{display: 'flex', justifyContent: 'center', margin: '0px 0 20px 0'}}> 
          {!selectedQuestion && <Segmented
              options={['Domanda chiusa', 'Domanda aperta']}
              onChange={(value) => {
                console.log(value);
                setDomandaType(value)
              }}
            />}
        </div>
        {domandaType === "Domanda aperta" ? (
        <Form onFinish={finishOpenQuestion} layout='vertical'>
          <div className="div-question-edit">
            <Form.Item name="question">
              <input type="text" />
            </Form.Item>
          </div>
          <div className='flex justify-center gap-2 mt-2'>
            <button className='primary-contained-btn'
            type="submit"
            >
            Salva modifiche
            </button>
          </div>
        </Form>
      ) : (
     <Form onFinish={onFinishClose} layout="vertical" initialValues={{
       question: selectedQuestion?.domanda,
       A: selectedQuestion?.opzioni['A)'],
       B: selectedQuestion?.opzioni['B)'],
       C: selectedQuestion?.opzioni['C)'],
       D: selectedQuestion?.opzioni['D)'],
     }}>
      {selectedQuestion ? (
      editDomanda !== 5 ?
      <div className="div-question-edit">
          <h4>
            {domandaVisual?.domanda}
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
       <div className='flex flex-mobile gap-2'>
       {selectedQuestion ? (
        editDomanda !== 1 ?
          <div className="div-not-edit">
            <img onClick={() => setEditDomanda(1)} alt='edit question' src={edit} />
              <h4 className="risposta-edit">
                <span>A</span>{domandaVisual?.opzioni["A)"]}
              </h4>
          </div> :
          <div className="risposta-edit-edit">
            <span>A</span>
            <Form.Item name="A">
              <input type="text" onChange={(e) => handleChange(e, 'A')}/>
            </Form.Item>
            <img className='img-set-correct' alt='imposta risposta corretta' src={vg} />
          </div>
       ) :
        <div className="risposta-edit-edit">
          <span>A</span>
          <Form.Item name="A">
            <input type="text" />
          </Form.Item>
          <img className='img-set-correct' alt='imposta risposta corretta' src={vg} />
        </div>}
       {selectedQuestion ? (
        editDomanda !== 2 ?
          <div className="div-not-edit">
            <img onClick={() => setEditDomanda(2)} alt='edit question' src={edit} />
              <h4 className="risposta-edit">
                <span>B</span>{domandaVisual?.opzioni["B)"]}
              </h4>
          </div> :
          <div className="risposta-edit-edit">
            <span>B</span>
            <Form.Item name="B">
              <input type="text" onChange={(e) => handleChange(e, 'B')} />
            </Form.Item>
            <img className='img-set-correct' alt='imposta risposta corretta' src={vg} />
          </div>
       ) :
        <div className="risposta-edit-edit">
          <span>B</span>
          <Form.Item name="B">
            <input type="text" />
          </Form.Item>
          <img className='img-set-correct' alt='imposta risposta corretta' src={vg} />
        </div>}
       </div>
       <div className='flex flex-mobile gap-2'>
       {selectedQuestion ? (
        editDomanda !== 3 ?
          <div className="div-not-edit">
            <img onClick={() => setEditDomanda(3)} alt='edit question' src={edit} />
              <h4 className="risposta-edit">
                <span>C</span>{domandaVisual?.opzioni["C)"]}
              </h4>
          </div> :
          <div className="risposta-edit-edit">
            <span>C</span>
            <Form.Item name="C">
              <input type="text" onChange={(e) => handleChange(e, 'C')} />
            </Form.Item>
            <img className='img-set-correct' alt='imposta risposta corretta' src={vg} />
          </div>
       ) :
        <div className="risposta-edit-edit">
          <span>C</span>
          <Form.Item name="C">
            <input type="text" />
          </Form.Item>
          <img className='img-set-correct' alt='imposta risposta corretta' src={vg} />
        </div>}
       {selectedQuestion ? (
        editDomanda !== 4 ?
          <div className="div-not-edit">
            <img onClick={() => setEditDomanda(4)} alt='edit question' src={edit} />
              <h4 className="risposta-edit">
                <span>D</span>{domandaVisual?.opzioni["D)"]}
              </h4>
          </div> :
          <div className="risposta-edit-edit">
            <span>D</span>
            <Form.Item name="D">
              <input type="text" onChange={(e) => handleChange(e, 'D')} />
            </Form.Item>
            <img className='img-set-correct' alt='imposta risposta corretta' src={vg} />
          </div>
       ) :
        <div className="risposta-edit-edit">
          <span>D</span>
          <Form.Item name="D">
            <input type="text" />
          </Form.Item>
          <img className='img-set-correct' alt='imposta risposta corretta' src={vg} />
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
      )}
    </Modal>
  )
}