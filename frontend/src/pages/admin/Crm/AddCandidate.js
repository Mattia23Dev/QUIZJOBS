import React, { useEffect, useState } from 'react'
import { Modal, message, Progress } from 'antd'
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice'
import { useDispatch } from 'react-redux'
import { getCandidateInfo } from '../../../apicalls/users'
import allegati from '../../../imgs/allegati.png'
import logo from '../../../imgs/logo.png'
import corretta from '../../../imgs/corretta.png'
import sbagliata from '../../../imgs/cancel.png'
import time from '../../../imgs/time.png'
import timered from '../../../imgs/timered.png'
import timegreen from '../../../imgs/timegreen.png'
import { addCandidate } from '../../../apicalls/exams'

function AddCandidate(props) {
  const { setShowAddCandidateModal, showAddCandidateModal, addStatus} = props
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    city: "",
    coverLetter: "",
    degree: "",
    trackLink: "add-by-hr",
    jobPosition: ""
  });

  console.log(formData.trackLink)

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
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Modal
    title={
      <div className="modal-header">
          <img src={logo} alt="logo skilltest" />
      </div>
      }
      width={'45%'}
      style={{ top: '1rem' }}
    open={showAddCandidateModal}
    footer={false}
    onCancel={()=>{
      setShowAddCandidateModal(false)
      }}>
      <div className='flex flex-col items-center gap-5 p-3'>
          <form className="form-candidato" onSubmit={handleSubmit} style={{width: '100%'}}>
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
            </div>
            <div className="form-group">
              <label htmlFor="titoloStudio">Posizione lavorativa:</label>
              <input
                type="text"
                id="jobPosition"
                name="jobPosition"
                value={formData.jobPosition}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group" style={{width: '100%'}}>
              <label htmlFor="letteraPresentazione">Note (opzionale):</label>
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
          >Salva candidato</button>
          </div>
      </div>
    </Modal>
  )
}

export default AddCandidate