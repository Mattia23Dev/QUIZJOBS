import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Navbar from '../../components/navbar/Navbar'
import Footer from '../../components/footer/Footer'
import hero from '../../imgs/contact1.png'
import homegiù from '../../imgs/homegiù.png'
import '../home.css'
import {Collapse} from 'antd'
const {Panel} = Collapse;

const Contatti = () => {
    const navigate = useNavigate()
    const [faqData, setFaqData] = useState([
      { question: `Perchè dovresti usare SkillTest?`, answer: `Noi crediamo che l'analisi delle persone basate su dati sia il futuro di ogni mercato, ecco perchè tramite dei semplici test (focalizzati su competenze oppure di semplice profilazione o screening) possano fornire un overview completa del candidato / membro del team. <br />La nostra piattaforma è pensata per essere più flessibile possibile, integrata con algoritmi di AI proprietari, vogliamo dare la possibilità a chiunque di poter creare un test in modo rapido e con un design accattivante.`},
      { question: `Quali tipologie di test posso creare?`, answer: `Abbiamo 3 tipologie di test:<br /><b>- Manuale</b>, in cui puoi aggiungere qualsiasi domanda, aperta o chiusa, con lo scopo di profilare il candidato sulle soft skills o sullo screening, non esistono risposte corrette.<br ><b>- SkillTest</b>, un test generato dal nostro algoritmo AI con un focus sulle competenze inserite in fase di creazione, il candidato verrà valutato con un punteggio.<br /><b>- Mix Test</b>, è il test più flessibile, con minimo due moduli obbligatori, uno focalizzato sulle competenze, e gli altri di profilazione.`},
      { question: `Posso modificare le domande dopo aver creato il test?`, answer: `Certo, le domande <b>possono essere modificate anche se hai già dei candidati</b>, le informazioni sulle domande loro rimarranno invariate` },
      { question: `Cosa significa il bottone On/Off sul Test`, answer: `Con il bottone puoi <b>attivare o disattivare</b> il test in qualsiasi momento. Disattivanto il test il link non sarà più valido. <br />Ti consigliamo di assicurarti che non hai delle Job position attive prima di disattivare il test.` },
      { question: `I test sono disponibili in diverse lingue?`, answer: `Assolutamente Si, il nostro modello generativo (AI) può supportare varie lingue, tra cui <b>inglese, spagnolo, portoghese, francese, italiano e tedesco</b>. Tra i prossimi aggiornamenti vogliamo aggiungere altre lingue e trasformare la piattaforma interna in multilingua.` },
      { question: `Posso scegliere le domande del test che verranno poste ai candidati?`, answer: `Oltre alle domande generate dall’AI tramite il nostro algoritmo proprietario, <b>Skilltest da la possibilità non solo di modificare le domande così generate ma anche di creare ex-novo un test disegnato sulle necessità dell’utilizzatore.</b>` },
      { question: `Esistono sistemi di controllo per valutare se il candidato si stia avvalendo di altri strumenti per completare il test (cheating)?`, answer: `Per i Test focalizzati sulle competenze inseriamo tra i vari controlli, <b>il timer di 30 secondi per fornire la risposta</b>, <b>il candidato non può ripetere il test e se interrompe ripartirà dall'ultima domanda</b>e non si può copiare nessuna domanda o risposta.` },
      { question: `Posso provare personalmente il test che ho creato?`, answer: `Sì, e riteniamo sia molto utile per la calibrazione del test! In questo modo HR ed Hiring Manager potranno vivere la stessa esperienza del candidato e comparare in maniera efficace i risultati raggiunto dai partecipanti in base alle competenze tipicamente acquisite all’interno dell’azienda` },
      { question: `Posso vedere quanto tempo ha impiegato il mio candidato per completare la valutazione?`, answer: `Sì questa è una funzionalità offerta attualmente e particolarmente utile per valutare l’attenzione, oltre che l’abilità dei candidati per rispondere al test. <b>riusciamo a tracciare i secondi necessari per ogni risposta e un tempo totale di completamento del test.</b>` },
      { question: `E’ possibile brandizzare il test con un logo aziendale?`, answer: `Al momento la veste grafica è in <b>fase di aggiornamento</b> ma in futuro sarà possibile personalizzare la landing page di ogni test.` },
      { question: `SkillTest può essere utilizzato per scopi formativi o educativi?`, answer: `La nostra piattaforma vuole essere il più flessibile possibile e grazie al numero illimitato di test generabili, <b>può essere utilizzata anche ai fini di formazione interna aziendale, valutazione dei partner a seguito di workshop e strumento di ingaggio durante i meeting</b>. Il limite è la tua inventiva.` },
      { question: `Quali funzionalità sono comprese?`, answer: `Cerchiamo di aggiornare sempre le funzionalità della piattaforma, per questo abbiamo aggiunto:<br /> <b>Il calendario,</b> dove puoi fissare gli appuntamenti per i tuoi candidati o membri del team. <br /><b>Il nostro CRM,</b> nel quale puoi gestire l'intero processo del candidato. <br />In fase di aggiornamento stiamo aggiungendo il team così da mantenere più accessi, e la dashboard per gestire l'analisi del lavoro facilmente.` },
      { question: `Come posso tracciare i candidati?`, answer: `In fase di creazione test oppure modificando il test già esistente clicca sul pulsante Track Link, li potrai aggiungere dei tag di tracciamento che potrai visualizzare nella scheda del candidato.` },
      ]);
      const parseHTML = (htmlString) => {
        return { __html: htmlString };
      };
  return (
    <div className='home-out'>
    <Navbar />
    <div className='hero-section'>
      <div>
        <h1>Hai bisogno di <b>assistenza?</b></h1>
        <p>Il nostro team di assistenza è pronto a rispondere ad ogni tua domanda.</p>
        <div>
          <button>Richiedi assistenza</button>
          <button onClick={() => navigate('/')}>Home</button>
        </div>
      </div>
      <div>
        <img alt='skilltest ai numero 1' src={hero} />
      </div>
    </div>
    <div id='help' className='service-section-contact'>
        <p>CONTATTI</p>
        <h2>Lasciaci la tua email</h2>
        <input type='text' placeholder='Email' />
        <p>Richiesta</p>
        <textarea placeholder='Richiesta' />
        <button>Invia richiesta</button>
    </div>
    <div className='service-section'>
      <h2>Hai dubbi o curiosità? <br /> <b>Abbiamo le risposte che cerchi.</b></h2>
      <div className='faq-help-contatti'>
        <Collapse accordion>
        {faqData.map((faq, index) => (
            <Panel header={faq.question} key={index}>
                <div dangerouslySetInnerHTML={parseHTML(faq.answer)} />
            </Panel>
        ))}
        </Collapse>
       </div> 
    </div>
    <div className='footer1 bg-secondary'>
      <h2>Trovare talenti migliori non ha prezzo. <br />
      <b>Con skillTest è anche conveniente</b></h2>
      <p>Un processo di selezione prolungato nel tempo può costarti molto. <br />
      Assumere le persone sbagliate può costarti ancor di più.</p>
      <p><b>Con SkillTest puoi evitare tutti questi rischi e godere ogni anno di <br />
      un enorme ritorno sull'investimento.</b></p>
      <div>
        <button onClick={() => navigate('/register')}>Provalo gratis</button>
        <button>Contattaci</button>
      </div>
    </div>
    <Footer />
  </div>
  )
}

export default Contatti