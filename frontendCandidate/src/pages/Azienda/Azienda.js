import React, { useEffect, useState } from 'react'
import './azienda.css'
import { FaSearch } from 'react-icons/fa'
import { Select } from 'antd'
import { HideLoading, ShowLoading } from '../../redux/loaderSlice'
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { getExamActiveByUser } from '../../apicalls/exams'
const {Option} = Select

const provinceItaliane = [
    "Agrigento", "Alessandria", "Ancona", "Aosta", "Arezzo", "Ascoli Piceno",
    "Asti", "Avellino", "Bari", "Barletta-Andria-Trani", "Belluno", "Benevento",
    "Bergamo", "Biella", "Bologna", "Bolzano", "Brescia", "Brindisi", "Cagliari",
    "Caltanissetta", "Campobasso", "Carbonia-Iglesias", "Caserta", "Catania",
    "Catanzaro", "Chieti", "Como", "Cosenza", "Cremona", "Crotone", "Cuneo",
    "Enna", "Fermo", "Ferrara", "Firenze", "Foggia", "Forlì-Cesena",
    "Frosinone", "Genova", "Gorizia", "Grosseto", "Imperia", "Isernia",
    "L'Aquila", "La Spezia", "Latina", "Lecce", "Lecco", "Livorno",
    "Lodi", "Lucca", "Macerata", "Mantova", "Massa-Carrara", "Matera",
    "Messina", "Milano", "Modena", "Monza e della Brianza", "Napoli",
    "Novara", "Nuoro", "Olbia-Tempio", "Oristano", "Padova", "Palermo",
    "Parma", "Pavia", "Perugia", "Pesaro e Urbino", "Pescara", "Piacenza",
    "Pisa", "Pistoia", "Pordenone", "Potenza", "Prato", "Ragusa", "Ravenna",
    "Reggio Calabria", "Reggio Emilia", "Rieti", "Rimini", "Roma", "Rovigo",
    "Salerno", "Medio Campidano", "Sassari", "Savona", "Siena", "Siracusa",
    "Sondrio", "Taranto", "Teramo", "Terni", "Torino", "Ogliastra",
    "Trapani", "Trento", "Treviso", "Trieste", "Udine", "Varese",
    "Venezia", "Verbano-Cusio-Ossola", "Vercelli", "Verona", "Vibo Valentia",
    "Vicenza", "Viterbo"
  ];

const Azienda = () => {
    let { id } = useParams();
    const dispatch = useDispatch() 
    const [searchJob, setSearchJob] = useState('')
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedContratto, setSelectedContratto] = useState('');
    const [selectedLavoro, setSelectedLavoro] = useState('');
    const [companyExams, setCompanyExams] = useState([])

    const getExamCompany = async () => {
        console.log(id)
        try {
            const response = await getExamActiveByUser(id)
            console.log(response)
            dispatch(HideLoading())
            if (response.success){
                setCompanyExams(response.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        dispatch(ShowLoading())
        getExamCompany()
    }, [])

    const azienda = {
        img: "https://cdn.pixabay.com/photo/2013/01/29/22/07/google-76659_1280.png",
        companyName: "Google",
        sede: "Milano",
        descriptions: "Google ha modificato più volte il proprio logo nel corso della sua esistenza. Il primo logo è stato disegnato da Sergey Brin e in seguito modificato dalla designer Ruth Kedar, per la cui realizzazione si è servita del carattere tipografico con grazie Catull. Il logo è usato dal motore di ricerca Google e, in occasione di eventi e ricorrenze particolari, viene sostituito con un doodle attinente, talvolta animato."
    }
  return (
    <div className='azienda'>
        <div className='sticky-left-company'>
            <div>
                <img alt='azienda logo' src={azienda.img} />
                <h2>{azienda.companyName}</h2>
                <h4>{azienda.sede}</h4>
                <p>{azienda.descriptions}</p>
            </div>
            <div>

            </div>
        </div>
        <div className='azienda-content'>
           <div className='top-azienda-content'>
            <div>
                <FaSearch className='icon-search' size={32} />
                <input type='text' value={searchJob} onChange={(e) => setSearchJob(e.target.value)}  />
                <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Provincia"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={setSelectedProvince}
                    value={selectedProvince}
                >
                    {provinceItaliane.map((prov, index) => (
                    <Option key={index} value={prov}>{prov}</Option>
                    ))}
                </Select>
                <button className='primary-outlined-btn'>Cerca posizione</button>
            </div>
            <div>
                <Select
                onChange={setSelectedLavoro}
                value={selectedLavoro}
                placeholder="Luogo di lavoro">
                    <Option value='Tutti'>Tutti</Option>
                    <Option value='In sede'>In sede</Option>
                    <Option value='Ibrido'>Ibrido</Option>
                    <Option value='Da remoto'>Da remoto</Option>
                </Select>
                <Select
                onChange={setSelectedContratto}
                value={selectedContratto}
                placeholder="Tipo di contratto">
                    <Option value='Tutti'>Tutti</Option>
                    <Option value='Tempo pieno'>Tempo pieno</Option>
                    <Option value='Part-time'>Part-time</Option>
                    <Option value='Temporaneo'>Temporaneo</Option>
                    <Option value='Stage'>Stage</Option>
                    <Option value='Partita Iva'>Partita Iva</Option>
                </Select>
            </div>
           </div>
           <div className='middle-azienda-content'>
              {companyExams && companyExams.length > 0 && companyExams.map((exam) => (
                <div key={exam._id} className='single-job'>
                    <h3>{exam.jobPosition}</h3>
                </div>
              ))}
           </div>
        </div>
    </div>
  )
}

export default Azienda