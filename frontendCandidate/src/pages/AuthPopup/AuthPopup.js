import { Modal, Select, Upload, Form, Input, Checkbox, message, Segmented } from 'antd'
import React, {useState} from 'react'
import logo from '../../imgs/logonewsmall.png'
import './authPopup.css'
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import pdfToText from 'react-pdftotext'
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { loginCandidate, registerCandidate } from '../../apicalls/users';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../redux/loaderSlice';
import { fetchJWTToken } from '../../apicalls';
import { SetUser } from '../../redux/usersSlice';
const { Option } = Select

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

const AuthPopup = ({loginPopup, registerPopup, setRegisterPopup, setLoginPopup, pop}) => {
  const dispatch = useDispatch()
  const [popType, setPopType] = useState(pop)
  const [pdfText, setPdfText] = useState("")
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    city: '',
    degree: '',
    jobPosition: '',
    coverLetter: '',
    password: '',
    privacyPolicy: false,
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null);
  const uploadFileToWordPress = async (file) => {
    console.log(file)
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(
        'https://skillstest.it/wp-json/wp/v2/media',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3NraWxsc3Rlc3QuaXQiLCJpYXQiOjE3MTM2MTAyMTUsIm5iZiI6MTcxMzYxMDIxNSwiZXhwIjoxNzE0MjE1MDE1LCJkYXRhIjp7InVzZXIiOnsiaWQiOiIxIn19fQ.7lFrDyUiIqvH0m5LOOXwANDxnw3PGbWcWn4t2kRFpQ8`
          },
        }
      );
  
      console.log('File caricato con successo:', response.data.source_url);
      return response.data.source_url;
    } catch (error) {
      console.error('Errore durante il caricamento del file:', error);
      throw error;
    }
  };
  const isMobile = () => {
        return window.innerWidth <= 768;
    };
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      setSelectedFile(file);
      pdfToText(file)
        .then(text => {
          console.log(text)
          setPdfText(text)
        })
        .catch(error => {
          console.error(error)
          message.error("CV corrotto o non leggibile, caricane un altro")
        })
    };

    const handleChange = (changedValues, allValues) => {
      setFormData(allValues);
    };

    const handleChangeLogin = (changedValues, allValues) => {
      setLoginData(allValues);
    };
  
    const handleSubmit = async () => {

      if (!selectedFile || !pdfText){
        message.error("Inserisci il cv")
        return
      }
      if (!formData.name || formData.name === "" || !formData.surname || formData.surname === '' || !formData.email || formData.email === '' || !formData.phone || formData.phone === '' || formData.city === '' || formData.degree === ''){
        message.error("Compila tutti i campi")
        return
      }
      if (formData.privacyPolicy === false) {
        message.error("Accetta la privacy")
      }
      //dispatch(ShowLoading())
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
  
      formDataToSend.append('cv', selectedFile);
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}: ${value}`);
      }
      try {
        const url = await uploadFileToWordPress(selectedFile)
        formDataToSend.append('url', url);
        const response = await registerCandidate(formDataToSend);
        console.log(response)
        if (response.success){
          localStorage.setItem("token",response.data.token)
          dispatch(SetUser(response.data.user))
          message.success("Benvenuto!");
          setLoginPopup(false)
          setRegisterPopup(false)
        }
        dispatch(HideLoading())
      } catch (error) {
        console.error(error)
      }
    };
    const handleLogin = async(values) => {
      console.log(loginData)
      if (loginData.email === '' || loginData.password === ''){
        message.error("Compila i campi")
      }
      try{
        dispatch(ShowLoading())
        const response = await loginCandidate(loginData)
        dispatch(HideLoading())
        if(response.success){
          message.success('Bentornato!');
          localStorage.setItem("token",response.data.token)
          dispatch(SetUser(response.data.user))
          setLoginPopup(false)
          setRegisterPopup(false)
        }
        else{
          message.error(response.message)
        }
      }
      catch(error){
          dispatch(HideLoading())
          message.error(error.message);
      }
    }
  return (
    <div className='auth-popup'>
        <Modal
        title={
        <div className="modal-header">
            <img src={logo} alt="logo skilltest" />
        </div>
        }
        style={{ top: '1rem' }}
        width={isMobile() ? '100%' : '45%'}
        open={loginPopup || registerPopup}
        footer={false}
        onCancel={()=>{
        setLoginPopup(false)
        setRegisterPopup(false)
        }}>
          <div className='choose-auth-type'>
            <Segmented
              className='segmented'
              options={['Registrati', 'Accedi']}
              onChange={(value) => {
                setPopType(value)
              }}
              />
          </div>
        {popType === "Accedi" ? (
            <div className='auth-reg'>
              <Form
              className="form-candidato"
              layout="vertical"
              onFinish={handleLogin}
              initialValues={loginData}
              onValuesChange={handleChangeLogin}
              style={{ width: '100%' }}
            >
              <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, type: 'email', message: 'Inserisci una email valida!' }]}
                  >
                    <input type='text' />
                  </Form.Item>
                  <div>
                      <label>Password</label>
                      <div className="password-input">
                        <Form.Item name='password'>
                          <input type={showPassword ? 'text' :'password'} placeholder='Password' required/>
                        </Form.Item>
                        <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <FiEye /> : <FiEyeOff />}
                        </span>
                      </div>                    
                  </div>
              </Form>
              <button onClick={handleLogin} className='primary-outlined-btn'>Accedi</button>
            </div>
        ) : (
            <div className='auth-reg'>
              <Form
              className="form-candidato"
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={formData}
              onValuesChange={handleChange}
              style={{ width: '100%' }}
            >
              <div className='form-group'>
                <Form.Item
                  label="Nome"
                  name="name"
                  rules={[{ required: true, message: 'Inserisci il tuo nome!' }]}
                >
                  <input type='text' />
                </Form.Item>

                <Form.Item
                  label="Cognome"
                  name="surname"
                  rules={[{ required: true, message: 'Inserisci il tuo cognome!' }]}
                >
                  <input type='text' />
                </Form.Item>                
              </div>
              <div className='form-group form2'>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, type: 'email', message: 'Inserisci una email valida!' }]}
                >
                  <input type='text' />
                </Form.Item>

                <Form.Item
                  label="Cellulare"
                  name="phone"
                  rules={[{ required: true, message: 'Inserisci il tuo numero di cellulare!' }]}
                >
                  <input type='text' />
                </Form.Item>
              </div>
              <div className='form-group form2'>
                <Form.Item
                      label="Città"
                      name="city"
                      rules={[{ required: true, message: 'Inserisci la tua città!' }]}
                    >
                    <Select
                      showSearch
                      placeholder="Provincia"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                      }
                  >
                      {provinceItaliane.map((prov, index) => (
                      <Option key={index} value={prov}>{prov}</Option>
                      ))}
                  </Select>
                  </Form.Item>
                  <Form.Item
                      label="Titolo di Studio"
                      name="degree"
                      rules={[{ required: true, message: 'Seleziona il tuo titolo di studio!' }]}
                    >
                      <Select placeholder="Titolo di Studio">
                        <Option value="">Seleziona</Option>
                        <Option value="Scuola media">Scuola media</Option>
                        <Option value="Diploma">Diploma</Option>
                        <Option value="Istituto professionale">Istituto professionale</Option>
                        <Option value="Laurea triennale">Laurea triennale</Option>
                        <Option value="Laurea magistrale">Laurea magistrale</Option>
                        <Option value="Dottorato">Dottorato</Option>
                      </Select>
                  </Form.Item>
              </div>
                <div className='form-group form2'>
                  <Form.Item
                    label="Posizione lavorativa"
                    name="jobPosition"
                    rules={[{ required: true, message: 'Inserisci la tua posizione lavorativa!' }]}
                  >
                    <input type='text' required/>
                  </Form.Item>
                  <div className='password-cont'>
                    <label>Password</label>
                    <div className="password-input">
                      <Form.Item name='password'>
                        <input type={showPassword ? 'text' :'password'} placeholder='Password' required/>
                      </Form.Item>
                      <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FiEye /> : <FiEyeOff />}
                      </span>
                    </div>                    
                  </div>
                </div>
                <div className='upload-mobile form2'>
                <Form.Item
                    className='form-group'
                    label="Upload CV"
                    rules={[{ required: true, message: 'Carica il tuo CV!' }]}
                    valuePropName="fileList"
                  >
                    <input
                      className='cv-upload'
                      type="file"
                      id="cv"
                      name="cv"
                      onChange={handleFileChange}
                      accept=".pdf"
                      required
                    />
                  </Form.Item>
                  </div>
                  <Form.Item
                    label="Lettera di presentazione (opzionale)"
                    name="coverLetter"
                    rules={[{ required: true, message: 'Inserisci una lettera di presentazione!' }]}
                  >
                    <Input.TextArea rows={4} placeholder="Lettera di Presentazione" />
                  </Form.Item>
                  <Form.Item name='privacyPolicy' valuePropName="checked" className="terms-checkbox">
                    <Checkbox required>
                      Privacy policy
                    </Checkbox>
                  </Form.Item>
              </Form>
              <button onClick={handleSubmit} className='primary-outlined-btn'>Registrati</button>
            </div>
        )}
      </Modal>
    </div>
  )
}

export default AuthPopup