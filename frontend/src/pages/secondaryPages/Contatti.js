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
                <p>{faq.answer}</p>
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