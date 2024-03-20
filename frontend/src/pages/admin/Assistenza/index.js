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
        { question: `Quali tipologie di test posso creare?`, answer: `Abbiamo 3 tipologie di test:<br /><b>- Manuale</b>, in cui puoi aggiungere qualsiasi domanda, aperta o chiusa, con lo scopo di profilare il candidato sulle soft skills o sullo screening, non esistono risposte corrette.<br ><b>- SkillTest</b>, un test generato dal nostro algoritmo AI con un focus sulle competenze inserite in fase di creazione, il candidato verrà valutato con un punteggio.<br /><b>- Mix Test</b>, è il test più flessibile, con minimo due moduli obbligatori, uno focalizzato sulle competenze, e gli altri di profilazione.`},
        { question: `Posso modificare le domande dopo aver creato il test?`, answer: `Certo, le domande <b>possono essere modificate anche se hai già dei candidati</b>, le informazioni sulle domande loro rimarranno invariate` },
        { question: `Cosa significa il bottone On/Off sul Test`, answer: `Con il bottone puoi <b>attivare o disattivare</b> il test in qualsiasi momento. Disattivanto il test il link non sarà più valido. <br />Ti consigliamo di assicurarti che non hai delle Job position attive prima di disattivare il test.` },
        { question: `I test sono disponibili in diverse lingue?`, answer: `Assolutamente Si, il nostro modello generativo (AI) può supportare varie lingue, tra cui <b>inglese, spagnolo, portoghese, francese, italiano e tedesco</b>. Tra i prossimi aggiornamenti vogliamo aggiungere altre lingue e trasformare la piattaforma interna in multilingua.` },
        { question: `Posso scegliere le domande del test che verranno poste ai candidati?`, answer: `Oltre alle domande generate dall’AI tramite il nostro algoritmo proprietario, <b>Skilltest da la possibilità non solo di modificare le domande così generate ma anche di creare ex-novo un test disegnato sulle necessità dell’utilizzatore.</b>` },
        { question: `Esistono sistemi di controllo per valutare se il candidato si stia avvalendo di altri strumenti per completare il test (cheating)?`, answer: `Per i Test focalizzati sulle competenze inseriamo tra i vari controlli, <b>il timer di 30 secondi per fornire la risposta</b>, <b>il candidato non può ripetere il test e se interrompe ripartirà dall'ultima domanda</b>e non si può copiare nessuna domanda o risposta.` },
        { question: `Posso provare personalmente il test che ho creato?`, answer: `Sì, e riteniamo sia molto utile per la calibrazione del test! In questo modo HR ed Hiring Manager potranno vivere la stessa esperienza del candidato e comparare in maniera efficace i risultati raggiunto dai partecipanti in base alle competenze tipicamente acquisite all’interno dell’azienda` },
        { question: `Posso vedere quanto tempo ha impiegato il mio candidato per completare la valutazione?`, answer: `Sì questa è una funzionalità offerta attualmente e particolarmente utile per valutare l’attenzione, oltre che l’abilità dei candidati per rispondere al test. <b>riusciamo a tracciare i secondi necessari per ogni risposta e un tempo totale di completamento del test.</b>` },
        { question: `Domanda 3`, answer: `Risposta 3` }   
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
      const parseHTML = (htmlString) => {
        return { __html: htmlString };
      };
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
                       <div dangerouslySetInnerHTML={parseHTML(faq.answer)} />
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