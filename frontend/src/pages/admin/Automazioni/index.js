import React from 'react'
import './index.css'
import Tour from 'reactour';
import PageTitle from '../../../components/PageTitle';
import { Auth20Gmail } from './Auth2.0';

const Automazioni = ({tour, openTour, setOpenTour}) => {
    const steps = [
        {
          content: 'Crea un nuovo AI test',
          selector: '.elemento1', 
        },
        {
          content: 'Vedi le info dei test creati',
          selector: '.elemento2', // Selettore CSS dell'elemento
        },
        {
          content: 'Attiva/Disattiva il test',
          selector: '.elemento3', // Selettore CSS dell'elemento
        },
      ];
      const isMobile = () => {
        return window.innerWidth <= 768;
      };
  return (
    <div className='automations'>
        {!isMobile() && <PageTitle title="Automazioni"/>}
        <Auth20Gmail />
    <Tour
        isOpen={openTour && tour === "automations"}
        onRequestClose={() => {setOpenTour(false)}}
        steps={steps}
        rounded={5}
      />
    </div>
  )
}

export default Automazioni