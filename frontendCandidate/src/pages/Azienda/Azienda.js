import React, { useEffect, useState } from 'react'
import './azienda.css'
import { FaSearch } from 'react-icons/fa'
import { Select, Drawer, Space } from 'antd'
import { HideLoading, ShowLoading } from '../../redux/loaderSlice'
import { useParams } from 'react-router-dom';
import time from '../../imgs/time.png'
import { useDispatch, useSelector } from 'react-redux'
import { addCandidateToTest, getExamActiveByUser } from '../../apicalls/exams'
import { getUserInfoById } from '../../apicalls/users'
import { BsFillInfoCircleFill } from "react-icons/bs";
import moment from 'moment'
import 'moment/locale/it'
import { useNavigate } from 'react-router-dom'
moment.locale('it');
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

const Azienda = ({setRegisterPopup}) => {
    let { id } = useParams();
    const dispatch = useDispatch() 
    const navigate = useNavigate()
    const user = useSelector(state=>state.users.user)
    const [searchJob, setSearchJob] = useState('')
    const [selectedProvince, setSelectedProvince] = useState();
    const [selectedContratto, setSelectedContratto] = useState();
    const [selectedLavoro, setSelectedLavoro] = useState();
    const [companyExams, setCompanyExams] = useState([])
    const [originalExams, setOriginalExams] = useState([])
    const [companyInfo, setCompanyInfo] = useState()
    const [drawerMobile, setDrawerMobile] = useState(false)

    const getExamCompany = async () => {
        console.log(id)
        try {
            const response = await getExamActiveByUser(id)
            console.log(response)
            dispatch(HideLoading())
            if (response.success){
                setCompanyExams(response.data)
                setOriginalExams(response.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const getUserInfo = async () => {
        try {
            const response = await getUserInfoById(id)
            console.log(response)
            dispatch(HideLoading())
            if (response.success){
                setCompanyInfo(response.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        dispatch(ShowLoading())
        getExamCompany()
        getUserInfo()
    }, [])

    function toSnakeCase(str) {
        return str.toLowerCase().replace(/\s+/g, '_');
    }

    const handleStartTest = async (exam) => {
        dispatch(ShowLoading())
        const jobPos = toSnakeCase(exam?.jobPosition);
        try {
            const payload = {
                testId: exam._id,
                candidateId: user._id,
                email: user.email,
            }
            const response = await addCandidateToTest(payload)
            console.log(response)
            if (response.success){
               navigate('/test/'+jobPos+'/'+exam._id)
            }
        } catch (error) {
            console.error(error)
        }
    }
    const isMobile = () => {
        return window.innerWidth <= 768;
      };
      const handleSearch = () => {
        const filteredExams = originalExams.filter(exam => {
            const matchJob = selectedLavoro === 'Tutti' || !selectedLavoro || exam.jobTypeWork === selectedLavoro;
            const matchContract = selectedContratto === 'Tutti' || !selectedContratto || exam.jobContract === selectedContratto;
            const matchProvince = !selectedProvince || selectedProvince === '' || exam.jobCity === selectedProvince;
            const matchSearchJob = !searchJob || searchJob === '' || exam.jobPosition.toLowerCase().includes(searchJob.toLowerCase());

            return matchJob && matchContract && matchProvince && matchSearchJob;
        });
        setCompanyExams(filteredExams);
    };

  return (
    <div className='azienda'>
        <div className='sticky-left-company'>
            <div>
                <img alt='azienda logo' src={companyInfo?.profileImage} />
                <h2>{companyInfo?.companyName}</h2>
                <h4>{companyInfo?.companyCity}</h4>
                <p>{companyInfo?.companyDescription}</p>
            </div>
            <div>

            </div>
        </div>
        <div className='azienda-content'>
            {isMobile() && <h1 onClick={() => setDrawerMobile(true)}>{companyInfo?.companyName} <BsFillInfoCircleFill size={22} /></h1>}
           <div className='top-azienda-content'>
            <div>
                {!isMobile() && <FaSearch className='icon-search' size={32} />}
                <input className='input-search' type='text' value={searchJob} onChange={(e) => setSearchJob(e.target.value)}  />
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
                <button onClick={handleSearch} className='primary-outlined-btn'>{isMobile() ? 'Cerca' :  'Cerca posizione'}</button>
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
              {companyExams && companyExams.length > 0 && companyExams.map((exam) => {
                const date = moment(exam.createdAt);
                const timeAgo = date.fromNow()
                const hasTest = user && user.tests.some(test => test.testId === exam._id);

                return(
                <div key={exam._id} className='single-job'>
                    <div className='single-job-top'>
                        <h2>{exam.jobPosition}</h2>
                        <img alt='logo offerta lavorativa' src={companyInfo?.profileImage} />
                    </div>
                    <hr />
                    <div className='single-job-middle'>
                        <div>
                            <h4>Descrizione offerta</h4>
                            <p dangerouslySetInnerHTML={{ __html: exam.jobDescription }} />
                        </div>
                        <div>
                            <div>
                                <span>{exam.jobContract}</span>
                                <span>{exam.jobCity}</span>
                                <span>{exam.jobTypeWork}</span>
                            </div>
                            {hasTest ? (
                                <button onClick={null} className='primary-outlined-btn'>
                                    Test già fatto
                                </button>
                            ) : (
                                <button onClick={user ? () => handleStartTest(exam) : () => setRegisterPopup(true)} className='primary-outlined-btn'>
                                    Fai il test
                                </button>
                            )}
                        </div>
                    </div>
                    <hr />
                    <div className='single-job-bottom'>
                        <div>
                            <span>Competenze</span>
                            {exam?.skills?.map((skill) => (
                                <span>{skill}</span>
                            ))}
                        </div>
                        <p><img src={time} alt='time' />{timeAgo && timeAgo}</p>
                    </div>
                </div>
              )})}
           </div>
        </div>
        <Drawer
            title="Info azienda"
            width={isMobile() ? '70%' : 500}
            className='drawer-dash'
            onClose={() => setDrawerMobile(false)}
            open={drawerMobile}
            placement='right'
        >
            <div className='drawer-info-company'>
                <img alt='azienda logo' src={companyInfo?.profileImage} />
                <h2>{companyInfo?.companyName}</h2>
                <h4>{companyInfo?.companyCity}</h4>
                <p>{companyInfo?.companyDescription}</p>
            </div>
        </Drawer>
    </div>
  )
}

export default Azienda