import React, {useState, useEffect} from 'react'
import gif from '../../imgs/anim_3.gif'
import './bigLoader.css'
import logo from '../../imgs/logo.png'
import {useSelector} from 'react-redux'

const BigLoader = () => {
    const [progress, setProgress] = useState(0);
    const [textIndex, setTextIndex] = useState(0);
    const user = useSelector(state=>state.users.user)
    const texts = [
      'Sto Generando il test',
      'Cerco Informazioni sulla Job Position',
      'Studio diverse fonti per trovare le più qualitative',
      'Analizzo gli argomenti principali',
      'Identifico le domande chiave',
      'Seleziono le risposte esatte',
      'Verifico la correttezza delle risposte',
      'Genero un link di preview'
    ];
  
    useEffect(() => {
      const startTime = Date.now();
      const endTime = startTime + 105000; // 105 secondi
      const interval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progressPercentage = (elapsed / 105000) * 100;
        if (progressPercentage <= 100) {
          setProgress(progressPercentage);
        } else {
          setProgress(0);
        }
      }, 100);
    
      return () => clearInterval(interval);
    }, []);
    
    useEffect(() => {
      const interval = setInterval(() => {
        const nextIndex = (textIndex + 1) % texts.length;
        setTextIndex(nextIndex);
      }, 5000);
    
      return () => clearInterval(interval); // Cancella l'intervallo precedente quando il componente viene smontato o quando l'indice della frase cambia
    }, [textIndex, texts]);
  
    return (
      <div className='container-big-loader'>
        <div className='header-big-loader'>
          <img src={logo} alt='logo skilltest' />
          <p>{user?.name}</p>
        </div>
        <div className='big-loader'>
          <img alt='loading' src={gif} />
          <div style={{ marginBottom: '40px', zIndex: 150 }}>{texts[textIndex]}</div>
            <div style={{ width: '35%', backgroundColor: '#ddd', height: '20px', borderRadius: '10px', zIndex: 25, padding: '3px 6px' }}>
              <div style={{ width: `${progress}%`, backgroundColor: '#F95959', height: '100%', borderRadius: '15px' }}></div>
            </div>
          <p style={{zIndex: 150}}>Stiamo generando il Test adatto alla tua figura professionale, ci potrebbero volere fino a <font color='#F95959'>2 minuti</font>, grazie per l'attesa.</p>
        </div>
      </div>
    );
}

export default BigLoader