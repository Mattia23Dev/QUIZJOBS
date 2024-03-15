import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar/Navbar'
import hero from '../imgs/register.png'
import home2 from '../imgs/home2.png'
import home1 from '../imgs/home1.png'
import home3 from '../imgs/home3.png'
import homegiù from '../imgs/homegiù.png'
import homegiù2 from '../imgs/homegiù2.png'
import homegiù3 from '../imgs/homegiù3.png'
import footer1 from '../imgs/footer1.png'
import './home.css';
import Footer from '../components/footer/Footer'
import { OverPack } from 'rc-scroll-anim';
import QueueAnim from 'rc-queue-anim';

function Home() {

    const navigate = useNavigate()

  return (
    <div className='home-out'>
      <Navbar /> 
      <div className='hero-section'>
        <div>
          <h1>SkillTest® <b>funziona. <br /> i CV no.</b></h1>
          <p>I nostri test di selezione ti consentono di trovare i <b>candidati migliori</b> e di prendere decisioni veloci, facili e imparziali.</p>
          <div>
            <button onClick={() => navigate('/register')}>Provalo gratis</button>
            <button onClick={() => navigate('/contact')}>Contattaci</button>
          </div>
        </div>
        <div>
          <img alt='skilltest ai numero 1' src={hero} />
        </div>
      </div>
      <div id='product' className='service-section'>
        <h2>Testa le competenze per <br /> <b>il successo lavorativo</b></h2>
        <p>Prevedi le performance lavorative reali dei potenziali candidati <br /> 
        grazie a una libreria <b>400+ test scientificamente provati.</b></p>
        <div>
         <div key="a">
           <img alt="test scientifici" src={home2} />
           <p>Generati ed integrati con <b>intelligenza artificiale</b></p>
          </div>
          <div key="b">
           <img className='img-home-piccola' alt="test scientifici" src={home1} />
           <p><b>400+ test</b> scientificamente provati</p>
          </div> 
          <div key="c">
           <img alt="test scientifici" src={home3} />
           <p><b>Supporto efficace</b> nella selezione del candidato</p>
          </div>
        </div>
        <div>
            <button onClick={() => navigate('/register')}>Provalo gratis</button>
            <button onClick={() => navigate('/contact')}>Contattaci</button>
        </div>
      </div>
      <div className='service-section2'>
        <img alt='selezione ottimizzata' src={homegiù} />
        <div>
          <p>SELEZIONE OTTIMIZZATA</p>
          <h2>Tempo di qualità per <br /> <b>candidati di qualità.</b></h2>
          <p>Basta <b>perdere tempo</b> nella selezione dei CV e nei colloqui preliminari. <br /><br />
          <b>SkillTest®</b> valuta e classifica automaticamente i tuoi candidati.</p>
          <div>
            <button onClick={() => navigate('/register')}>Provalo gratis</button>
            <button onClick={() => navigate('/contact')}>Contattaci</button>
          </div>
        </div>
      </div>
      <hr />
      <div className='service-section3'>
        <div>
          <p>BASTA PREGIUDIZI</p>
          <h2>Stesse opportunità <br /> <b>per la selezione.</b></h2>
          <p>Un team diversificato garantisce <b>risultati migliori</b>. <br /><br />
           Con SkillTest®, <b>darai a tutti i candidati le stesse opportunità di mettersi in mostra.</b> <br /><br />
          Risultato? Assumerai i migliori talenti indipendentemente dai loro percorsi di vita.</p>
          <div>
            <button onClick={() => navigate('/register')}>Provalo gratis</button>
            <button onClick={() => navigate('/contact')}>Contattaci</button>
          </div>
        </div>
        <img alt='selezione ottimizzata' src={homegiù2} />
      </div>
      <hr />
      <div className='service-section2 ss2-last'>
        <img alt='selezione ottimizzata' src={homegiù3} />
        <div>
          <p>NETWORKING</p>
          <h2>Cultura delle risorse <br /> umane <b>basate su dati.</b></h2>
          <p>Classifichiamo i tuoi candidati in base ai punteggi dei test certificati dai nostri esperti.<br /><br />
          Ciò significa che il team delle risorse umane potrà prendere decisioni importanti facendo affidamento 
          su dati di <b>buona qualità</b> e non solo sull'istinto</p>
          <div>
            <button onClick={() => navigate('/register')}>Provalo gratis</button>
            <button onClick={() => navigate('/contact')}>Contattaci</button>
          </div>
        </div>
      </div>
      <hr />
      <div className='come-funziona'>
        <h2>Come funziona SkillTest?</h2>
        <div>
          <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"  // Sostituisci questo URL con l'URL del video YouTube desiderato
              title="Video di YouTube"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
        </div>
      </div>
      <div className='prezzi' id='price'>
        <h2>Come funziona SkillTest?</h2>
        <div>
          <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"  // Sostituisci questo URL con l'URL del video YouTube desiderato
              title="Video di YouTube"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
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
          <button onClick={() => navigate('/contact')}>Contattaci</button>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home