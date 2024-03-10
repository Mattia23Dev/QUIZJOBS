import React, {useState} from 'react'
import PageTitle from '../../../components/PageTitle'
import { Collapse, message } from 'antd';
import './index.css'
import { sendHelpEmail } from '../../../apicalls/users';
import {useSelector} from 'react-redux'

const Assistenza = () => {
    const { Panel } = Collapse;
    const [helpMessage, setHelpMessage] = useState("")
    const [activeTab, setActiveTab] = useState(1)
    const user = useSelector(state=>state.users.user)
    const [faqData, setFaqData] = useState([
        { question: 'Domanda 1', answer: 'Risposta 1' },
        { question: 'Domanda 2', answer: 'Risposta 2' },
        { question: 'Domanda 3', answer: 'Risposta 3' },
        { question: 'Domanda 1', answer: 'Risposta 1' },
        { question: 'Domanda 2', answer: 'Risposta 2' },
        { question: 'Domanda 3', answer: 'Risposta 3' },
        { question: 'Domanda 1', answer: 'Risposta 1' },
        { question: 'Domanda 2', answer: 'Risposta 2' },
        { question: 'Domanda 3', answer: 'Risposta 3' },
      ]);

      const sendRequest = async () => {
        if (helpMessage === ""){
            window.alert("Compila il campo")
            return
        }
        try {
            const payload = {
                email: user.email,
                helpMessage,
            }
          const response = await sendHelpEmail(payload)
          if (response.success){
            message.success('Messaggio inviato, ti contatteremo il prima possibile!')
            setHelpMessage("")
          } else {
            message.error("Errore nell'invio del messaggio, riprova")
          }
        } catch (error) {
            console.error(error)
        }
      }
  return (
    <div className='home-content'>
        <div className='help-top'>
            <div onClick={() => setActiveTab(1)} className={activeTab === 1 ? 'active' : 'elemento1'}>
              <span></span>
              <p>Contattaci</p>
            </div>
            <hr />
            <div onClick={() => setActiveTab(2)} className={activeTab === 2 ? 'active' : 'elemento2'}>
              <span></span>
              <p>Domande</p>
            </div>
          </div>
        <div className='assistenza'>
        <PageTitle title={"Assistenza"} />
        {activeTab === 1 ? (
            <div className='faq-help'>
                <div>
                    <label>Inserisci qui la richiesta di Assistenza</label>
                    <textarea value={helpMessage} onChange={(e) => setHelpMessage(e.target.value)} />
                </div>
                <button onClick={sendRequest} style={{minWidth: '150px'}} className='primary-outlined-btn'>Invia</button>
            </div>            
            ):(
            <div className='faq-help'>
                <Collapse accordion>
                {faqData.map((faq, index) => (
                    <Panel header={faq.question} key={index}>
                    <p>{faq.answer}</p>
                    </Panel>
                ))}
                </Collapse>
            </div>                
            )}
        </div>
    </div>
  )
}

export default Assistenza