import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { addCandidate } from '../../../apicalls/exams';
import { useCookies } from 'react-cookie';
import arrowRight from '../../../imgs/arrowright.png'

const FAQList = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`faq ${isExpanded ? 'expanded' : ''}`} onClick={toggleExpand}>
      <h2 className="faq-question">How does the test work?</h2>
      <div className="faq-answer">
        <ul className='flex flex-col gap-1'>
          <li>
            Exam must be completed in 15 minutes.
          </li>
          <li>
            Exam will be submitted automatically after 15 minutes.
          </li>
          <li>
            Once submitted, you cannot change your answer.
          </li>
          <li>
            Do not refresh the page and do not navigate to other pages like Home, Profile. If did so, you've to restart your exam.
          </li>
          <li>
            You can use the <span className='font-bold'>Previous</span> and <span className='font-bold'>Next</span> buttons to navigate between questions.
          </li>
        </ul>
      </div>
    </div>
  );
};

function Instructions(props) {
  const {examData,setExamData, view, setView, startTimer, setUser} = props
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [cookies, setCookie] = useCookies(['userData']);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    city: "",
    coverLetter: "",
    degree: "",
    testId: examData._id,
    terms: false,
    privacyPolicy: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    console.log(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const key in formData) {
      if (formData[key] === "") {
        alert("Per favore compila tutti i campi del form.");
        return;
      } else if (formData.terms == false || formData.privacyPolicy == false){
        alert("Accetta termini e condizioni");
        return;
      }
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      alert("Per favore inserisci un'email valida.");
      return;
    }
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(formData.phone)) {
      alert("Per favore inserisci un numero di cellulare valido.");
      return;
    }
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    formDataToSend.append('cv', selectedFile);  
    try {
     const response = await addCandidate(formDataToSend); 
     console.log(response);
     setUser(response.candidate);
     startTimer();
     setView("questions")
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='flex flex-col items-center mt-2 gap-5 p-3'>
        <form className="form-candidato" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cognome">Cognome:</label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cellulare">Cellulare:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="città">Città:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cv">Upload CV:</label>
            <input
              className='cv-upload'
              type="file"
              id="cv"
              name="cv"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="titoloStudio">Titolo di Studio:</label>
            <select
              type="text"
              id="degree"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              placeholder="Titolo di Studio"
              required
            >
              <option value={""}>Seleziona</option>
              <option value={"Scuola media"}>Scuola media</option>
              <option value={"Diploma"}>Diploma</option>
              <option value={"Istituto professionale"}>Istituto professionale</option>
              <option value={"Laurea triennale"}>Laurea triennale</option>
              <option value={"Laurea magistrale"}>Laurea magistrale</option>
              <option value={"Dottorato"}>Dottorato</option>
            </select>  
            <div className='accept'>
              <label>
                <input
                  id='terms'
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={() => setFormData({ ...formData, terms: !formData.terms })}
                />
                <a href="/terms">Termini e Condizioni</a>
              </label>
              <label>
                <input
                  id='privacyPolicy'
                  type="checkbox"
                  name="privacyPolicy"
                  checked={formData.privacyPolicy}
                  onChange={() => setFormData({ ...formData, privacyPolicy: !formData.privacyPolicy })}
                />
                <a href="/privacy">Informativa sulla Privacy</a>
              </label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="letteraPresentazione">Lettera di Presentazione (opzionale):</label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              placeholder="Lettera di Presentazione"
              rows="4"
              required
            ></textarea>
          </div>
        </form>
        <div className='flex gap-2'>
        <button className='primary-contained-btn'
        onClick={handleSubmit}
        style={{display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center'}}
        ><img alt='arrow right' src={arrowRight} />Inizia test</button>
        </div>
    </div>
  )
}

export default Instructions