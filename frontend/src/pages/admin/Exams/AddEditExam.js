import React, { useState, useEffect } from "react";
import PageTitle from "../../../components/PageTitle";
import {
  domandeAperteCarattere,
  domandeAperteCreativita,
  domandeAperteEtica,
  domandeAperteRelazioni,
  domandeAperteDecisionMaking,
  domandeAperteLeadership,
  domandeAperteProblem,
  domandeChiuseCarattere,
  domandeChiuseCreativita,
  domandeChiuseDecisionMaking,
  domandeChiuseEtica,
  domandeChiuseLeadership,
  domandeChiuseProblem,
  domandeChiuseRelazioni,
  domandeChiuseScreening,
  domandeAperteScreening,
} from "../../../components/Moduli";
import {
  Form,
  Row,
  Col,
  message,
  Segmented,
  Select,
  Popconfirm,
  Modal,
  Tooltip,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  addExam,
  addExamMix,
  addTrackLink,
  deleteQuestionFromExam,
  deleteTrackLink,
  editExam,
  getExamById,
} from "../../../apicalls/exams";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import {
  AddEditQuestion,
  AddEditQuestionPersonalizzate,
} from "./AddEditQuestion";
import "./addEditTest.css";
import openai from "openai";
import copia from "../../../imgs/copia.png";
import copiablu from "../../../imgs/copiablu.png";
import eye from "../../../imgs/eye.png";
import leftArrow from "../../../imgs/leftarrow.png";
import rightArrow from "../../../imgs/arrowright.png";
import edit from "../../../imgs/edit.png";
import move from "../../../imgs/move.png";
import logo from "../../../imgs/logo.png";
import cancel from "../../../imgs/cancel.png";
import track from "../../../imgs/track.png";
import { useLocation } from "react-router-dom";
import Tour from "reactour";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import GoBackButton from "../../../components/GoBackButton";
import {
  addItemToLocalStorage,
  generateUniqueId,
  getExampleQuestionsAiPrompt,
  getGenQuestionsAiPrompt,
  handleCopyLink,
  isMobile,
} from "../../../utlis/functions";
import { provinceItaliane } from "../../../utlis/constants";
import skillsjson from "../../../utlis/skills.json";
import jobPositionsJson from "../../../utlis/jobpositions.json";
import { useTranslation } from "react-i18next";
import BigLoader from "../../../components/bigLoader/BigLoader";
import { BsQuestion } from "react-icons/bs";

const { Option } = Select;

const DomandeComponent = React.memo(
  ({
    domande,
    onUpdateDomande,
    setSelectedQuestion,
    setShowAddEditQuestionModal,
  }) => {
    const [currentDomanda, setCurrentDomanda] = useState(domande[0]);
    const [currentDomandaIndex, setCurrentDomandaIndex] = useState(0); // Inizializza l'indice della domanda corrente a 0
    const [confirmVisible, setConfirmVisible] = useState(
      Array(domande.length).fill(false)
    );
    const [draggedDomanda, setDraggedDomanda] = useState(null);

    const handleConfirm = () => {
      const filteredDomande = domande.filter(
        (domanda) => domanda !== currentDomanda
      );
      onUpdateDomande(filteredDomande);
      setCurrentDomanda(domande[0]);
      const updatedConfirmVisible = [...confirmVisible];
      const index = domande.indexOf(currentDomanda);
      updatedConfirmVisible[index] = false;
      setConfirmVisible(updatedConfirmVisible);
    };

    const handleCancel = () => {
      setConfirmVisible(Array(domande.length).fill(false));
    };

    const handleDomandaClick = (domanda, index) => {
      setCurrentDomanda(domanda);
      setCurrentDomandaIndex(index);
    };

    const [draggingIndex, setDraggingIndex] = useState(null); // Stato per tener traccia dell'indice della domanda che viene trascinata

    const handleDragStart = (event, domanda, index) => {
      event.dataTransfer.setData("domanda", JSON.stringify(domanda));
      setDraggingIndex(index); // Imposta l'indice della domanda che viene trascinata
      setDraggedDomanda(domanda);
    };

    const handleDragOver = (event) => {
      event.preventDefault();
    };

    const handleDragEnter = (index) => {
      setDraggingIndex(index); // Imposta l'indice della domanda su cui passa sopra
    };

    const handleDragLeave = () => {
      setDraggingIndex(null); // Resettare l'indice della domanda quando si lascia l'area di trascinamento
    };

    const handleDrop = (event, index) => {
      if (!draggedDomanda) return; // Se non c'è nessuna domanda trascinata, esci

      const droppedDomanda = JSON.parse(event.dataTransfer.getData("domanda"));
      const updatedDomande = [...domande]; // Crea una copia dell'array delle domande

      // Rimuovi la domanda trascinata dalla sua posizione originale
      const draggedIndex = updatedDomande.indexOf(draggedDomanda);
      if (draggedIndex !== -1) {
        updatedDomande.splice(draggedIndex, 1);
      }

      // Inserisci la domanda trascinata nella nuova posizione
      updatedDomande.splice(index, 0, droppedDomanda);

      onUpdateDomande(updatedDomande); // Aggiorna lo stato delle domande

      setDraggingIndex(null); // Resettare l'indice della domanda trascinata dopo il rilascio
      setDraggedDomanda(null); // Resetta la domanda trascinata
    };
    return (
      <div className="domande-container">
        <div className="lista-domande">
          {domande.map((domanda, index) => (
            <div
              key={index}
              onDragStart={(event) => handleDragStart(event, domanda, index)} // Gestisci l'inizio del trascinamento sulla domanda
              onDragOver={handleDragOver}
              onDragEnter={() => handleDragEnter(index)} // Gestisci l'entrata del trascinamento sulla domanda
              onDragLeave={handleDragLeave} // Gestisci l'uscita del trascinamento dall'area della domanda
              onDrop={(event) => handleDrop(event, index)}
              className={`domanda-item ${
                currentDomanda === domanda ? "domanda-selected" : ""
              } ${draggingIndex === index ? "dragging" : ""}`}
            >
              <Popconfirm
                open={confirmVisible[index]}
                title="Sei sicuro di voler eliminare?"
                onConfirm={() => handleConfirm(domanda)}
                onCancel={handleCancel}
                okText="Sì"
                cancelText="No"
                placement="top"
              >
                <img
                  alt="cancel question"
                  src={cancel}
                  onClick={() => {
                    setConfirmVisible((prevState) => {
                      const updatedConfirmVisible = [...prevState];
                      updatedConfirmVisible[index] = true;
                      return updatedConfirmVisible;
                    });
                    setCurrentDomanda(domanda);
                  }}
                />
              </Popconfirm>
              <img
                alt="edit question"
                src={edit}
                onClick={() => {
                  setSelectedQuestion({ ...domanda, id: index });
                  setShowAddEditQuestionModal(true);
                }}
              />
              <img className="drag-handle" src={move} draggable />
              <p onClick={() => handleDomandaClick(domanda, index)}>
                <span>{index + 1}.</span>
                {domanda?.domanda}
              </p>
            </div>
          ))}
        </div>
        {currentDomanda.opzioni && (
          <div className="domanda-attuale">
            <p>
              <span>{currentDomandaIndex + 1}.</span>
              {currentDomanda?.domanda}
            </p>
            <ul className="opzioni">
              {Object.entries(currentDomanda?.opzioni).map(
                ([lettera, risposta], index) => (
                  <li
                    className={
                      currentDomanda?.rispostaCorretta &&
                      risposta.trim() ===
                        currentDomanda?.rispostaCorretta.risposta
                        ? "risposta risposta-corretta"
                        : "risposta"
                    }
                    key={index}
                  >
                    <span>{lettera?.substring(0, 1)}</span> {risposta}
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }
);
const apiKey = process.env.REACT_APP_OPENAI_API_KEY ?? "";

function AddEditExam({ openTour, setOpenTour, tour }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id, tag } = useParams();
  const { t } = useTranslation();
  const [examData, setExamData] = useState();
  const [activeTab, setActiveTab] = useState(0);
  const [bigLoading, setBigLoading] = useState(false);
  const [showAddEditQuestionModal, setShowAddEditQuestionModal] =
    useState(false);
  const [
    showAddEditQuestionModalPersonalizzate,
    setShowAddEditQuestionModalPersonalizzate,
  ] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [selectedQuestionPersonal, setSelectedQuestionPersonal] = useState();
  const [questions, setQuestions] = useState([]);
  const [questionsPersonal, setQuestionsPersonal] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showTrackLink, setShowTrackLink] = useState(false);
  const [passaOltre, setPassaOltre] = useState(0);
  const [copyLink, setCopyLink] = useState(false);
  const [trackLink, setTrackLink] = useState("");
  const [domandaType, setDomandaType] = useState("Caratteriali");
  const [categoryType, setCategoryType] = useState(
    "Attitudinali e Soft skills"
  );
  const [trackLinkArray, setTrackLinkArray] = useState([]);
  const [examId, setExamId] = useState(null);
  const user = useSelector((state) => state.users.user);
  const [preview, setPreview] = useState(false);
  const [link, setLink] = useState("");
  const [addOurModule, setAddOurModule] = useState(false);
  const [config, setConfig] = useState({
    numOfQuestions: 20,
    difficulty: "",
    generalSector: "",
    jobPosition: "",
    testLanguage: "",
    skills: [],
    deadline: null,
    description: "",
    tag: tag,
    jobDescription: "",
    jobCity: "",
    jobContract: "",
    jobTypeWork: "",
  });
  const location = useLocation();
  const { storedQuestions } = location.state ?? {};
  const { storedQuestionsPersonal } = location.state ?? {};
  const steps = [
    {
      content:
        tag === "ai" || tag === "mix"
          ? t("exam_tour_step_1")
          : t("exam_tour_step_1_manual"),
      selector: ".elemento1",
    },
    {
      content:t("exam_tour_step_2"),
      selector: ".elemento2",
    },
    {
      content:t("exam_tour_step_3"),
      selector: ".elemento3",
    },
    {
      content:t("exam_tour_step_4"),
      selector: ".elemento4",
    },
  ];

  const handleCopyTrackLink = (name) => {
    const baseUrl = link;
    const queryParam = encodeURIComponent(name);
    const trackLink = `${baseUrl}?name=${queryParam}`;

    handleCopyLink(trackLink);
  };

  const handleChange = (selectedItems) => {
    console.log(selectedItems);
    setConfig((prevConfig) => ({ ...prevConfig, skills: selectedItems }));
  };

  function convertiStringaInOggetti(stringaDomande) {
    const domandeArray = [];
    const domandeSeparate = stringaDomande.split(/\d+\.\s+/).filter(Boolean);

    domandeSeparate.forEach((domanda) => {
      const righe = domanda.split("\n").filter(Boolean);
      const testoDomanda = righe[0].trim();
      const opzioni = {};
      let rispostaCorretta = null;

      for (let i = 1; i < righe.length - 1; i++) {
        const opzioneMatch = righe[i].match(/- ([A-D]\)) (.+)/);
        if (opzioneMatch) {
          const letteraOpzione = opzioneMatch[1];
          const testoOpzione = opzioneMatch[2];
          opzioni[letteraOpzione] = testoOpzione.trim();
        }
      }

      let rispostaMatch = righe[righe.length - 1].match(
        /(Risposta:|Risposta corretta:) ([A-D]\)) (.+)/
      );
      if (rispostaMatch) {
        const letteraRispostaCorretta = rispostaMatch[2];
        const rispostaEffettiva = rispostaMatch[3].replace(/\*+$/, "");
        rispostaCorretta = {
          lettera: letteraRispostaCorretta,
          risposta: rispostaEffettiva.trim(),
        };
      } else {
        rispostaMatch = righe[righe.length - 1].match(/- ([A-D]\)) (.+)/);
        if (rispostaMatch) {
          const letteraRispostaCorretta = rispostaMatch[1];
          const rispostaEffettiva = rispostaMatch[2].replace(/\*+$/, "");
          rispostaCorretta = {
            lettera: letteraRispostaCorretta,
            risposta: rispostaEffettiva.trim(),
          };
        }
      }

      domandeArray.push({
        domanda: testoDomanda.trim(),
        opzioni: opzioni,
        rispostaCorretta: rispostaCorretta,
      });
    });

    return domandeArray;
  }

  const generateQuestions = async () => {
    try {
      if (
        !config.numOfQuestions ||
        !config.difficulty ||
        !config.generalSector ||
        !config.jobPosition ||
        !config.testLanguage ||
        config.skills.length < 1
      ) {
        throw new Error("Tutti i campi di config devono essere definiti.");
      }
      if (!apiKey || !apiKey?.includes("sk-")) {
        throw new Error("Open AI api key required.");
      }

      const client = new openai.OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
        model: "gpt-4-turbo-preview",
      });

      if (!client) {
        throw new Error("Open AI config error.");
      }

      const exampleFormat = getExampleQuestionsAiPrompt(config);

      const prompt = getGenQuestionsAiPrompt(config);

      const requestData = {
        max_tokens: 2600,
        n: config.numOfQuestions < 25 ? 1 : 2,
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: exampleFormat },
        ],
        stop: ["Domanda"],
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        format: "json",
      };

      setBigLoading(true);
      localStorage.setItem("config", JSON.stringify(config));
      const response = await client.chat.completions.create(requestData);
      const allQuestions = [];
      for (const choice of response.choices) {
        const domandeOggetto = await convertiStringaInOggetti(
          choice.message.content
        );
        const domandeFiltrate = domandeOggetto.filter(
          (domanda) =>
            domanda.rispostaCorretta !== null &&
            Object.keys(domanda.opzioni).length > 3
        );
        allQuestions.push(...domandeFiltrate);
      }

      console.log(allQuestions);
      setQuestions(allQuestions);
      setShowQuestions(true);
      if (tag === "mix") {
        setActiveTab(4);
      } else {
        setActiveTab(2);
      }
      setPassaOltre(2);
      setBigLoading(false);
      setPreview(true);
      addItemToLocalStorage("questions", allQuestions);
    } catch (error) {
      message.error(error?.message);
      setBigLoading(false);
    }
  };

  const onFinish = async () => {
    if (tag === "mix") {
      try {
        dispatch(ShowLoading());
        const uniqueId = generateUniqueId(6);
        const examData = {
          numOfQuestions: config.numOfQuestions,
          difficulty: config.difficulty,
          generalSector: config.generalSector,
          jobPosition: config.jobPosition,
          testLanguage: config.testLanguage,
          skills: config.skills,
          domande: questions,
          domandePersonal: questionsPersonal,
          deadline: config.deadline,
          idEsame: uniqueId,
          userId: user.teamType ? user.company : user._id,
          description: config.description,
          tag: config.tag,
          jobContract: config.jobContract,
          jobCity: config.jobCity,
          jobDescription: config.jobDescription,
          jobTypeWork: config.jobTypeWork,
        };
        let response;
        response = await addExamMix(examData);
        dispatch(HideLoading());
        if (response.success) {
          message.success(response.message);
          setActiveTab(3);
          setCopyLink(true);
          setExamId(response.data._id);
          setLink(response.data.examLink);
          setPassaOltre(3);
          localStorage.removeItem("config");
          localStorage.removeItem("questions");
          localStorage.removeItem("questionsPersonal");
        } else {
          message.error(response.message);
        }
      } catch (error) {
        dispatch(HideLoading());
        message.error(error.message);
      }
    } else {
      try {
        dispatch(ShowLoading());
        const uniqueId = generateUniqueId(6);
        const examData = {
          numOfQuestions: config.numOfQuestions,
          difficulty: config.difficulty,
          generalSector: config.generalSector,
          jobPosition: config.jobPosition,
          testLanguage: config.testLanguage,
          skills: config.skills,
          domande: questions,
          deadline: config.deadline,
          idEsame: uniqueId,
          userId: user.teamType ? user.company : user._id,
          description: config.description,
          tag: config.tag,
          jobContract: config.jobContract,
          jobCity: config.jobCity,
          jobDescription: config.jobDescription,
          jobTypeWork: config.jobTypeWork,
        };

        let response;
        if (id) {
          response = await editExam(examData, id);
        } else {
          response = await addExam(examData);
        }
        dispatch(HideLoading());
        if (response.success) {
          message.success(response.message);
          setActiveTab(3);
          setCopyLink(true);
          setExamId(response.data._id);
          setLink(response.data.examLink);
          setPassaOltre(3);
          localStorage.removeItem("config");
          localStorage.removeItem("questions");
        } else {
          message.error(response.message);
        }
      } catch (error) {
        dispatch(HideLoading());
        message.error(error.message);
      }
    }
  };

  const getExamDataById = async (id) => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById(id);
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        setExamData(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (id) {
      getExamDataById(id);
    }
  }, []);

  useEffect(() => {
    const storedConfig = JSON.parse(localStorage.getItem("config"));

    if (storedQuestions && storedQuestions !== null) {
      setQuestions(storedQuestions);
      if (storedConfig) {
        setConfig(storedConfig);
      }
      if (storedQuestionsPersonal) {
        setQuestionsPersonal(storedQuestionsPersonal);
      }
      setActiveTab(2);
      setPreview(true);
      setPassaOltre(2);
      setShowQuestions(true);
    }
  }, []);

  const deleteQuestionById = async (questionId) => {
    try {
      const reqPayload = {
        questionId: questionId,
      };
      dispatch(ShowLoading());
      const response = await deleteQuestionFromExam(id, reqPayload);
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        getExamDataById(id);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleUpdateDomande = (updatedDomande) => {
    setQuestions(updatedDomande);
    addItemToLocalStorage("questions", updatedDomande);
  };

  const handleUpdateDomandePersonal = (updatedDomande) => {
    setQuestionsPersonal(updatedDomande);
    addItemToLocalStorage("questionsPersonal", updatedDomande);
  };

  const handlePreviewClick = () => {
    const url = `/admin/exams/add/preview`;

    window.open(url, "_blank");
  };

  const addTrackLinkInput = async () => {
    try {
      if (trackLink === "") {
        throw new Error("Inserire link track");
      }
      const reqPayload = {
        nome: trackLink,
        examId: examId,
      };
      const response = await addTrackLink(reqPayload);
      message.success("Link creato");
      setTrackLinkArray(response.data);
      setTrackLink("");
    } catch (error) {
      message.error(error?.response?.data?.message ?? error?.message);
    }
  };

  const deleteTrackLinkF = async (trackLink) => {
    const reqPayload = {
      nome: trackLink,
      examId: examId,
    };
    try {
      const response = await deleteTrackLink(reqPayload);
      console.log(response);
      if (response.success) {
        message.success("Link eliminato");
        setTrackLinkArray(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const aggiungiDomanda = (domanda) => {
    const nuoveDomande = [...questions, domanda];
    setQuestions(nuoveDomande);
    addItemToLocalStorage("questions", nuoveDomande);
  };

  const aggiungiDomandaPersonalizzata = (domanda) => {
    const nuoveDomande = [...questionsPersonal, domanda];
    setQuestionsPersonal(nuoveDomande);
    addItemToLocalStorage("questionsPersonal", nuoveDomande);
  };

  const modificaDomanda = (domandaModificata) => {
    const domandeModificate = questions.map((domanda, index) => {
      if (index === domandaModificata.id) {
        return domandaModificata;
      }
      return domanda;
    });

    setQuestions(domandeModificate);
    addItemToLocalStorage("questions", domandeModificate);
  };

  const modificaDomandaPersonalizzata = (domandaModificata) => {
    const domandeModificate = questionsPersonal.map((domanda, index) => {
      if (index === domandaModificata.id) {
        return domandaModificata;
      }
      return domanda;
    });

    setQuestionsPersonal(domandeModificate);
    addItemToLocalStorage("questionsPersonal", domandeModificate);
  };

  const nextTab = () => {
    if (
      !config.numOfQuestions ||
      !config.difficulty ||
      !config.generalSector ||
      !config.jobPosition ||
      !config.testLanguage ||
      config.skills.length < 1
    ) {
      console.error("Tutti i campi di config devono essere definiti.");
      return;
    }
    localStorage.setItem("config", JSON.stringify(config));
    setActiveTab(2);
    setShowQuestions(true);
    setPassaOltre(2);
  };

  const handleAddModuleQuestion = (domanda, type) => {
    if (type === "aperta") {
      const domandaAdd = {
        domanda: domanda,
      };
      const nuoveDomande = [...questions, domandaAdd];
      setQuestions(nuoveDomande);
      addItemToLocalStorage("questions", nuoveDomande);
    } else {
      const domandaAdd = {
        domanda: domanda.domanda,
        opzioni: {
          "A)": domanda.opzioni[0],
          "B)": domanda.opzioni[1],
          "C)": domanda.opzioni[2],
          "D)": domanda.opzioni[3],
        },
      };
      const nuoveDomande = [...questions, domandaAdd];
      setQuestions(nuoveDomande);
      addItemToLocalStorage("questions", nuoveDomande);
    }
  };

  const handleDeleteModuleQuestion = (domanda, type) => {
    if (type === "aperta") {
      const newQuestions = questions.filter((item) => item.domanda !== domanda);
      setQuestions(newQuestions);
    } else {
      const newQuestions = questions.filter(
        (item) => item.domanda !== domanda.domanda
      );
      setQuestions(newQuestions);
    }
  };
  
  const checkIfAdded = (domanda, type) => {
    if (type === "aperta") {
      const esiste = questions.filter((d) => d.domanda === domanda);
      if (esiste.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      const esiste = questions.filter((d) => d.domanda === domanda.domanda);
      if (esiste.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  };

  const nextTabOfferta = () => {
    if (
      config.jobDescription === "" ||
      config.jobCity === "" ||
      config.jobContract === "" ||
      config.jobTypeWork === ""
    ) {
      window.alert("Compila tutti i campi");
      return;
    }
    console.log(config);
    setPassaOltre(1);
    setActiveTab(1);
  };

  const handleBack = () => {
    if (activeTab !== 0 && activeTab < 3) {
      setActiveTab(activeTab - 1);
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      {bigLoading && <BigLoader />}
      <div className="home-content">
        <div className="flex flex-row items-center justify-between">
          <GoBackButton onClick={handleBack} />
          <div className="flex flex-row items-center gap-1">
            {activeTab === 2 && tag !== "manual" && (
              <button
                className="button-ligh-blue"
                onClick={() => {
                  setShowAddEditQuestionModal(true);
                }}
              >
                {t("add_question_button")}
              </button>
            )}
            {tag === "manual" && activeTab === 2 ? (
              <button
                onClick={
                  passaOltre >= 2
                    ? () => setAddOurModule(true)
                    : () => window.alert("Inserisci prima le info del test")
                }
                // className="add-our-question"
                className="button-ligh-blue"
              >
                <span>+</span> {!isMobile() && t("add_modules")}
              </button>
            ) : tag === "mix" && (activeTab === 4 || activeTab === 2) ? (
              <button
                onClick={
                  passaOltre >= 2
                    ? () => setAddOurModule(true)
                    : () => window.alert("Inserisci prima le info del test")
                }
                // className="add-our-question"
                className="button-ligh-blue"
              >
                <span>+</span> {!isMobile() && t("add_modules")}
              </button>
            ) : (
              ""
            )}

            {showQuestions && questions.length ? (
              activeTab === 2 ? (
                isMobile() ? (
                  <button onClick={onFinish} className="button-ligh-blue">
                    {/* <img alt="arrow right" src={rightArrow} /> */}
                    {t("save_test")}
                  </button>
                ) : (
                  <button onClick={onFinish} className="button-ligh-blue">
                    {t("save_generate_test")}
                  </button>
                )
              ) : (
                ""
              )
            ) : (
              ""
            )}
          </div>
        </div>

        {/* <div className='copy-preview'>
          {trackLinkArray && trackLinkArray.length > 0 && <button onClick={() => setShowTrackLink(true)} className='copy-link-active'><img src={track} alt='track link skilltest' />Track link</button>}
          {!examData && !id ? <button onClick={copyLink ? handleCopyLink : null} className={!copyLink ? 'copy-link' : 'copy-link-active'}><img src={!copyLink ? copia : copiablu} alt='copia link skilltest' />Copia link</button> : <button onClick={() => handleCopyLink()} className='copy-link-active'><img src={copiablu} alt='copia link skilltest' />Copia link</button>}
          {!isMobile() && tag!=="manual" && <a onClick={preview ? handlePreviewClick : null} className={preview ? 'preview': 'preview-disabled'}><img src={eye} alt='Anteprima skilltest' />Anteprima</a>}
        </div> */}
        <div className={"create-exam-top"}>
          <div
            onClick={() => setActiveTab(0)}
            className={activeTab === 0 ? "active" : "elemento1"}
          >
            <span className="stepper-dot"></span>
            <p>{t("offer")}</p>
          </div>
          <hr />

          <div
            onClick={passaOltre < 1 ? null : () => setActiveTab(1)}
            style={passaOltre < 1 ? { cursor: "not-allowed" } : null}
            className={activeTab === 1 ? "active" : "elemento1"}
          >
            <span className="stepper-dot"></span>
            <p>{t("test_details")}</p>
          </div>

          <hr />
          {tag === "mix" && (
            <div
              onClick={passaOltre < 2 ? null : () => setActiveTab(4)}
              style={passaOltre < 2 ? { cursor: "not-allowed" } : null}
              className={activeTab === 4 ? "active" : "elemento3"}
            >
              <span className="stepper-dot"></span>
              <p>{t("module")}</p>
            </div>
          )}
          {tag === "mix" && <hr />}
          <div
            onClick={passaOltre < 2 ? null : () => setActiveTab(2)}
            style={passaOltre < 2 ? { cursor: "not-allowed" } : null}
            className={activeTab === 2 ? "active" : "elemento2"}
          >
            <span className="stepper-dot"></span>
            <p>{t("questions")}</p>
          </div>
          <hr />
          <div
            onClick={passaOltre < 3 ? null : () => setActiveTab(3)}
            style={passaOltre < 3 ? { cursor: "not-allowed" } : null}
            className={activeTab === 3 ? "active" : "elemento4"}
          >
            <span className="stepper-dot"></span>
            <p>{t("candidates_menu")}</p>
          </div>
        </div>

        {/* {tag === "manual" && (
        <div
          onClick={
            passaOltre >= 2
              ? () => setAddOurModule(true)
              : () => window.alert("Inserisci prima le info del test")
          }
          className="add-our-question"
        >
          <span>+</span> {!isMobile() && t("add_modules")}
        </div>
      )} */}

        {(examData || !id) && activeTab === 1 ? (
          <div
            className={
              activeTab === 1
                ? "create-exam-body elemento1"
                : "create-exam-body"
            }
          >
            <PageTitle
              title={t("generate_new_test")}
              style={{
                textAlign: "center",
                fontWeight: "600",
                marginTop: "20px",
              }}
            />
            {/* <button
            className="button-ligh-blue"
            onClick={() => navigate("/admin/exams")}
          >
            {t("view_saved_tests")} 
          </button> */}
            <Form
              layout="vertical"
              onFinish={tag === "manual" ? nextTab : generateQuestions}
              initialValues={config}
              className="create-exam-form"
            >
              {tag !== "manual" && <h4>{t("choose_num_of_questions")}</h4>}{" "}
              {tag !== "manual" && (
                <Row className="choose-num" gutter={[10, 10]}>
                  {[5, 10, 15, 20, 30, 40, 50].map((num, key) => (
                    <div
                      key={key}
                      className={
                        config.numOfQuestions !== num
                          ? "numQuestions"
                          : "active-numQuestions"
                      }
                      onClick={() =>
                        setConfig((prevConfig) => ({
                          ...prevConfig,
                          numOfQuestions: num,
                        }))
                      }
                    >
                      <p>{num}</p>
                    </div>
                  ))}
                </Row>
              )}
              <Row gutter={[10, 10]}>
                <Col flex="auto" span={12}>
                  <Form.Item
                    initialValue={config.generalSector}
                    required
                    label={
                      <div className="flex flex-row items-center description-tooltip gap-1">
                        {t("sector")}
                        <Tooltip title={t("sector_tooltip")}>
                          <BsQuestion size={18} />
                        </Tooltip>
                      </div>
                    }
                    name="generalSector"
                  >
                    <input
                      required
                      type="text"
                      value={config?.generalSector}
                      onChange={(e) =>
                        setConfig((prevConfig) => ({
                          ...prevConfig,
                          generalSector: e.target.value,
                        }))
                      }
                    />
                  </Form.Item>
                </Col>
                <Col flex="auto" span={12}>
                  <Form.Item
                    initialValue={config.jobPosition}
                    label={t("job_position")}
                    required
                    name="jobPosition"
                  >
                    <Select
                      showSearch
                      value={config.jobPosition}
                      options={jobPositionsJson}
                      onChange={(e) => {
                        const selectedOption = jobPositionsJson.find(
                          (item) => item.value === e
                        );
                        setConfig((prevConfig) => ({
                          ...prevConfig,
                          jobPosition: selectedOption.label,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{ margin: "20px 0" }} gutter={[10, 10]}>
                <Col flex="auto" span={12}>
                  <Form.Item
                    required
                    label={t("test_language")}
                    name="testLanguage"
                    initialValue={config.testLanguage}
                  >
                    <Select
                      className="ant-styiling"
                      value={config.testLanguage}
                      onChange={(value) =>
                        setConfig((prevConfig) => ({
                          ...prevConfig,
                          testLanguage: value,
                        }))
                      }
                    >
                      <option value="">{t("select")}</option> {/* Seleziona */}
                      <option value="Italiano">{t("italian")}</option>{" "}
                      <option value="Inglese">{t("english")}</option>{" "}
                      <option value="Tedesco">{t("german")}</option>{" "}
                      <option value="Spagnolo">{t("spanish")}</option>{" "}
                      <option value="Francese">{t("french")}</option>{" "}
                      <option value="Portoghese">{t("portuguese")}</option>{" "}
                    </Select>
                  </Form.Item>
                </Col>
                <Col flex="auto" span={12}>
                  <Form.Item
                    label={t("deadline")}
                    required
                    name="deadline"
                    initialValue={config.deadline}
                  >
                    <input
                      type="date"
                      required
                      value={config?.deadline ? config?.deadline : null}
                      onChange={(e) => {
                        setConfig((prevConfig) => ({
                          ...prevConfig,
                          deadline: e.target.value,
                        }));
                      }}
                    />
                    {/* <DatePicker
                      className="datepicker"
                      value={config?.deadline ? config?.deadline : null}
                      onChange={(_, dateString) => {
                        setConfig((prevConfig) => ({
                          ...prevConfig,
                          deadline: dateString,
                        }));
                      }}
                    /> */}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[10, 10]}>
                <Col span={12}>
                  <Form.Item
                    initialValue={config.difficulty}
                    required
                    label={t("difficulty")}
                    name="difficulty"
                  >
                    <Select
                      className="ant-styiling"
                      value={config.difficulty}
                      onChange={(value) =>
                        setConfig((prevConfig) => ({
                          ...prevConfig,
                          difficulty: value,
                        }))
                      }
                    >
                      <option value="">{t("select")}</option>
                      <option value="Facile">{t("easy")}</option>
                      <option value="Medio">{t("medium")}</option>
                      <option value="Difficile">{t("difficult")}</option>{" "}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    initialValue={config.skills}
                    label={
                      <div className="flex flex-row items-center description-tooltip gap-1">
                        {t("skills")}
                        <Tooltip title={t("skills_tooltip")}>
                          <BsQuestion size={18} />
                        </Tooltip>
                      </div>
                    }
                    required
                    name="skills"
                  >
                    <Select
                      mode="multiple"
                      options={skillsjson}
                      style={{ width: "100%" }}
                      className="tag-antd"
                      placeholder={t("add_skill")}
                      onChange={handleChange}
                      value={config.skills}
                    >
                      {config.skills.map((tag) => (
                        <Option key={tag} value={tag}>
                          {tag}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[10, 10]}>
                <Col span={24}>
                  <Form.Item
                    required
                    label={
                      <div className="flex flex-row items-center description-tooltip gap-1">
                        {t("description")}
                        {tag !== "manual" && (
                          <Tooltip title={t("ai_description_tooltip")}>
                            <BsQuestion size={18} />
                          </Tooltip>
                        )}
                      </div>
                    }
                    name="description"
                    initialValue={config.description}
                  >
                    <textarea
                      rows={8}
                      required
                      placeholder={t("insert_description")}
                      value={config.description}
                      onChange={(e) =>
                        setConfig((prevConfig) => ({
                          ...prevConfig,
                          description: e.target.value,
                        }))
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <div
                className="flex justify-center gap-2 flex-column items-center"
                style={{ flexDirection: "column", marginTop: "40px" }}
              >
                {tag === "ai" || tag === "mix" ? (
                  <button
                    className="primary-outlined-btn w-25 cursor-pointer"
                    type="submit"
                  >
                    {t("generate_test")}
                  </button>
                ) : (
                  <button
                    className="primary-outlined-btn w-25 cursor-pointer"
                    type="submit"
                  >
                    {t("add_questions")}
                  </button>
                )}
                <button
                  className="btn btn-link"
                  style={{
                    textDecoration: "underline",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                  onClick={() => navigate("/admin/exams")}
                >
                  {t("cancel")}
                </button>
              </div>
            </Form>
          </div>
        ) : activeTab === 2 ? (
          <div
            className={
              activeTab === 2
                ? "create-exam-body elemento2"
                : "create-exam-body"
            }
          >
            <PageTitle
              title={tag === "mix" ? t("competence_questions") : t("questions")}
              style={{
                textAlign: "center",
                fontWeight: "600",
                marginTop: "20px",
              }}
            />
            {tag === "manual" && (
              <div className="flex justify-end">
                <button
                  className="button-ligh-blue"
                  onClick={() => {
                    setShowAddEditQuestionModal(true);
                  }}
                >
                  {t("add_question_button")}
                </button>
              </div>
            )}
            {showQuestions && questions.length > 0 && (
              <div className="domande-container-save">
                {/* <a onClick={() => setActiveTab(1)}>
                <img alt="left arrow" src={leftArrow} />{" "}
                {t("back_to_test_details")}
              </a> */}

                {tag === "manual" ? (
                  <DomandeMixComponent
                    domande={questions}
                    onUpdateDomande={handleUpdateDomande}
                    setSelectedQuestion={setSelectedQuestion}
                    setShowAddEditQuestionModal={setShowAddEditQuestionModal}
                  />
                ) : (
                  <DomandeComponent
                    domande={questions}
                    onUpdateDomande={handleUpdateDomande}
                    setSelectedQuestion={setSelectedQuestion}
                    setShowAddEditQuestionModal={setShowAddEditQuestionModal}
                  />
                )}
                {/* {isMobile() ? (
                <button onClick={onFinish}>
                  <img alt="arrow right" src={rightArrow} />
                  {t("save_test")}
                </button>
              ) : (
                <button onClick={onFinish}>
                  <img alt="arrow right" src={rightArrow} />
                  {t("save_generate_test")}
                </button>
              )} */}
              </div>
            )}
          </div>
        ) : activeTab === 4 ? (
          <div
            className={
              activeTab === 4
                ? "create-exam-body elemento3"
                : "create-exam-body"
            }
          >
            <PageTitle
              title={t("add_modules")}
              style={{
                textAlign: "center",
                fontWeight: "600",
                marginTop: "20px",
              }}
            />
            <h4>{t("add_custom_questions_hint")}</h4>
            <div className="flex justify-end">
              <button
                className="button-ligh-blue"
                onClick={() => {
                  // setShowAddEditQuestionModal(true);
                  setShowAddEditQuestionModalPersonalizzate(true);
                }}
              >
                {t("add_question_button")}
              </button>
              {/* <button
                className="button-light-blue"
                onClick={() => {
                  setShowAddEditQuestionModalPersonalizzate(true);
                }}
              >
                {t("add_question_button")}
              </button> */}
            </div>
            {showQuestions && questionsPersonal.length > 0 && (
              <div
                className="questions-container-save"
                style={{ width: "100%" }}
              >
                {/* <a onClick={() => setActiveTab(1)}>
                <img alt="left arrow" src={leftArrow} />{" "}
                {t("back_to_test_details")}
              </a> */}
                <DomandePersonalizzateComponent
                  domande={questionsPersonal}
                  onUpdateDomande={handleUpdateDomandePersonal}
                  setSelectedQuestion={setSelectedQuestionPersonal}
                  setShowAddEditQuestionModal={
                    setShowAddEditQuestionModalPersonalizzate
                  }
                />
                {/* {isMobile() ? (
                <button onClick={onFinish}>
                  <img alt="arrow right" src={rightArrow} />
                  {t("save_test")}
                </button>
              ) : (
                <button onClick={onFinish}>
                  <img alt="arrow right" src={rightArrow} />
                  {t("save_generate_test")}
                </button>
              )} */}
              </div>
            )}
          </div>
        ) : activeTab === 0 ? (
          <div
            className={
              activeTab === 0
                ? "create-exam-body elemento1"
                : "create-exam-body"
            }
          >
            <PageTitle
              title={t("enter_offer_info")}
              style={{
                textAlign: "center",
                fontWeight: "600",
                marginTop: "20px",
              }}
            />
            {/* <button
            className="button-ligh-blue"
            onClick={() => navigate("/admin/exams")}
          >
            {t("view_saved_tests")}
          </button> */}
            <Form
              layout="vertical"
              onFinish={nextTabOfferta}
              initialValues={examData}
              className="create-exam-form"
            >
              <Row gutter={[10, 10]} className="w-full">
                <Col flex="auto" span={12}>
                  <Form.Item
                    label={t("job_position")}
                    initialValue={config.jobPosition}
                    name="jobPosition"
                  >
                    <Select
                      showSearch
                      value={config.jobPosition}
                      options={jobPositionsJson}
                      onChange={(e) => {
                        const selectedOption = jobPositionsJson.find(
                          (item) => item.value === e
                        );
                        setConfig((prevConfig) => ({
                          ...prevConfig,
                          jobPosition: selectedOption.label,
                        }));
                      }}
                    />
                    {/* <input
                    type="text"
                    value={config.jobPosition}
                    onChange={(e) =>
                      setConfig((prevConfig) => ({
                        ...prevConfig,
                        jobPosition: e.target.value,
                      }))
                    }
                  /> */}
                  </Form.Item>
                </Col>
                <Col flex="auto" span={12}>
                  <Form.Item
                    label={t("job_city")}
                    required
                    initialValue={config.jobCity}
                    name="jobCity"
                  >
                    <Select
                      showSearch
                      //style={{ width: 200 }}
                      placeholder="Provincia"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      onChange={(value) =>
                        setConfig((prevConfig) => ({
                          ...prevConfig,
                          jobCity: value,
                        }))
                      }
                      value={config.jobCity}
                    >
                      {provinceItaliane.map((prov, index) => (
                        <Option key={index} value={prov}>
                          {prov}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[10, 10]}>
                <Col flex="auto" span={12}>
                  <Form.Item
                    label={t("workplace_type")}
                    required
                    initialValue={config.jobTypeWork}
                    name="jobTypeWork"
                  >
                    <Select
                      className="ant-styiling"
                      value={config.jobTypeWork}
                      options={[
                        { label: t("on_site"), value: "In sede" },
                        { label: t("hybrid"), value: "Ibrido" },
                        { label: t("remote"), value: "Da remoto" },
                      ]}
                      onChange={(value) =>
                        setConfig((prevConfig) => ({
                          ...prevConfig,
                          jobTypeWork: value,
                        }))
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t("job_type")}
                    required
                    initialValue={config.jobContract}
                    name="jobContract"
                  >
                    <Select
                      className="ant-styiling"
                      value={config.jobContract}
                      onChange={(value) =>
                        setConfig((prevConfig) => ({
                          ...prevConfig,
                          jobContract: value,
                        }))
                      }
                    >
                      <Option value="Tempo pieno">Tempo pieno</Option>
                      <Option value="Part-time">Part-time</Option>
                      <Option value="Temporaneo">Temporaneo</Option>
                      <Option value="Stage">Stage</Option>
                      <Option value="Partita Iva">Partita Iva</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[10, 10]}>
                <Col span={24}>
                  <Form.Item
                    label={t("description")}
                    required
                    initialValue={config.jobDescription}
                    name="jobDescription"
                  >
                    <CKEditor
                      editor={ClassicEditor}
                      data={config.jobDescription}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setConfig((prevConfig) => ({
                          ...prevConfig,
                          jobDescription: data,
                        }));
                      }}
                      onReady={(editor) => {
                        const editable = editor.editing.view.document.getRoot();
                        editor.editing.view.change((writer) => {
                          writer.setStyle("height", "300px", editable);
                        });
                      }}
                    />
                    {/*<textarea placeholder='Inserisci la descrizione' value={config.jobDescription} onChange={(e) => setConfig(prevConfig => ({ ...prevConfig, jobDescription: e.target.value }))} />*/}
                  </Form.Item>
                </Col>
              </Row>
              <div
                className="flex justify-center gap-2 flex-column items-center"
                style={{ flexDirection: "column", marginTop: "40px" }}
              >
                {tag === "ai" || tag === "mix" ? (
                  <button
                    className="primary-outlined-btn w-25 cursor-pointer"
                    type="submit"
                  >
                    {t("next_step")}
                  </button>
                ) : (
                  <button
                    className="primary-outlined-btn w-25 cursor-pointer"
                    type="submit"
                  >
                    {t("next_step")}
                  </button>
                )}
                <button
                  className="btn btn-link"
                  style={{
                    textDecoration: "underline",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                  onClick={() => navigate("/admin/exams")}
                >
                  {t("cancel")}
                </button>
              </div>
            </Form>
          </div>
        ) : (
          <div
            className={
              activeTab === 3
                ? "candidati-add-exam elemento4"
                : "candidati-add-exam"
            }
          >
            <PageTitle
              title={t("candidates_menu")}
              style={{
                textAlign: "center",
                fontWeight: "600",
                marginTop: "20px",
              }}
            />
            <h4>{t("noCandidates")}</h4>
            <div>
              <h2>{t("trackCandidates")}</h2>
              <p>{t("generateLink")}</p>
              <input
                value={trackLink}
                onChange={(e) => setTrackLink(e.target.value)}
                type="text"
                placeholder={t("tracking")}
              />
              <button
                disabled={!trackLink?.length}
                onClick={addTrackLinkInput}
                className="primary-outlined-btn"
              >
                {t("createTrackedLink")}
              </button>
            </div>
          </div>
        )}
        {showAddEditQuestionModal && (
          <AddEditQuestion
            tag={tag}
            editQuestionInExam={modificaDomanda}
            addQuestionToExam={aggiungiDomanda}
            setShowAddEditQuestionModal={setShowAddEditQuestionModal}
            showAddEditQuestionModal={showAddEditQuestionModal}
            examId={id}
            refreshData={getExamDataById}
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
          />
        )}
        {showAddEditQuestionModalPersonalizzate && (
          <AddEditQuestionPersonalizzate
            tag={tag}
            editQuestionInExam={modificaDomandaPersonalizzata}
            addQuestionToExam={aggiungiDomandaPersonalizzata}
            setShowAddEditQuestionModal={
              setShowAddEditQuestionModalPersonalizzate
            }
            showAddEditQuestionModal={showAddEditQuestionModalPersonalizzate}
            examId={id}
            refreshData={getExamDataById}
            selectedQuestion={selectedQuestionPersonal}
            setSelectedQuestion={setSelectedQuestionPersonal}
          />
        )}
        {showTrackLink && (
          <Modal
            title={"Track Link"}
            open={showTrackLink}
            width={isMobile() ? "95%" : "40%"}
            footer={false}
            onCancel={() => {
              setShowTrackLink(false);
            }}
          >
            <div className="tracklink-modal-container">
              {trackLinkArray.length > 0 &&
                trackLinkArray.map((trackLink, index) => (
                  <div key={index}>
                    <button
                      className="copy-link-track"
                      onClick={() => handleCopyTrackLink(trackLink)}
                    >
                      Link {trackLink}
                    </button>
                    <img
                      alt="delete track link skilltest"
                      onClick={() => deleteTrackLinkF(trackLink)}
                      src={cancel}
                    />
                  </div>
                ))}
            </div>
          </Modal>
        )}
        <Modal
          title={
            <div className="modal-header">
              <img style={{ width: "15%" }} src={logo} alt="logo skilltest" />
            </div>
          }
          open={addOurModule}
          width={isMobile() ? "95%" : "70%"}
          style={{ top: "10px" }}
          footer={false}
          onCancel={() => {
            setAddOurModule(false);
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "0px 0 20px 0",
            }}
          >
            <Segmented
              options={["Attitudinali e Soft skills", "Screening"]}
              onChange={(value) => {
                console.log(value);
                setCategoryType(value);
              }}
            />
          </div>
          {categoryType === "Attitudinali e Soft skills" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "0px 0 20px 0",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Segmented
                className="segmented"
                options={[
                  "Caratteriali",
                  "Problem solving",
                  "Creatività",
                  "Decision Making",
                  "Etica",
                  "Leadership",
                  "Relazioni",
                ]}
                onChange={(value) => {
                  console.log(value);
                  setDomandaType(value);
                }}
              />
              <div className="domande-moduli-nostri">
                <div>
                  <h4>Domande chiuse</h4>
                  {domandaType === "Caratteriali" ? (
                    <div className="domande-cont">
                      {domandeChiuseCarattere.map((d, index) => (
                        <div key={index}>
                          <p>{d.domanda}</p>
                          {checkIfAdded(d, "chiusa") ? (
                            <span
                              onClick={() =>
                                handleDeleteModuleQuestion(d, "chiusa")
                              }
                            >
                              -
                            </span>
                          ) : (
                            <span
                              onClick={() =>
                                handleAddModuleQuestion(d, "chiusa")
                              }
                            >
                              +
                            </span>
                          )}
                          <div className="option-domande-cont">
                            {d.opzioni.map((o, subIndex) => (
                              <p key={subIndex}>{o}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : domandaType === "Problem solving" ? (
                    <div className="domande-cont">
                      {domandeChiuseProblem.map((d, index) => (
                        <div key={index}>
                          <p>{d.domanda}</p>
                          {checkIfAdded(d, "chiusa") ? (
                            <span
                              onClick={() =>
                                handleDeleteModuleQuestion(d, "chiusa")
                              }
                            >
                              -
                            </span>
                          ) : (
                            <span
                              onClick={() =>
                                handleAddModuleQuestion(d, "chiusa")
                              }
                            >
                              +
                            </span>
                          )}
                          <div className="option-domande-cont">
                            {d.opzioni.map((o, subIndex) => (
                              <p key={subIndex}>{o}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : domandaType === "Creatività" ? (
                    <div className="domande-cont">
                      {domandeChiuseCreativita.map((d, index) => (
                        <div key={index}>
                          <p>{d.domanda}</p>
                          {checkIfAdded(d, "chiusa") ? (
                            <span
                              onClick={() =>
                                handleDeleteModuleQuestion(d, "chiusa")
                              }
                            >
                              -
                            </span>
                          ) : (
                            <span
                              onClick={() =>
                                handleAddModuleQuestion(d, "chiusa")
                              }
                            >
                              +
                            </span>
                          )}
                          <div className="option-domande-cont">
                            {d.opzioni.map((o, subIndex) => (
                              <p key={subIndex}>{o}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : domandaType === "Decision Making" ? (
                    <div className="domande-cont">
                      {domandeChiuseDecisionMaking.map((d, index) => (
                        <div key={index}>
                          <p>{d.domanda}</p>
                          {checkIfAdded(d, "chiusa") ? (
                            <span
                              onClick={() =>
                                handleDeleteModuleQuestion(d, "chiusa")
                              }
                            >
                              -
                            </span>
                          ) : (
                            <span
                              onClick={() =>
                                handleAddModuleQuestion(d, "chiusa")
                              }
                            >
                              +
                            </span>
                          )}
                          <div className="option-domande-cont">
                            {d.opzioni.map((o, subIndex) => (
                              <p key={subIndex}>{o}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : domandaType === "Etica" ? (
                    <div className="domande-cont">
                      {domandeChiuseEtica.map((d, index) => (
                        <div key={index}>
                          <p>{d.domanda}</p>
                          {checkIfAdded(d, "chiusa") ? (
                            <span
                              onClick={() =>
                                handleDeleteModuleQuestion(d, "chiusa")
                              }
                            >
                              -
                            </span>
                          ) : (
                            <span
                              onClick={() =>
                                handleAddModuleQuestion(d, "chiusa")
                              }
                            >
                              +
                            </span>
                          )}
                          <div className="option-domande-cont">
                            {d.opzioni.map((o, subIndex) => (
                              <p key={subIndex}>{o}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : domandaType === "Leadership" ? (
                    <div className="domande-cont">
                      {domandeChiuseLeadership.map((d, index) => (
                        <div key={index}>
                          <p>{d.domanda}</p>
                          {checkIfAdded(d, "chiusa") ? (
                            <span
                              onClick={() =>
                                handleDeleteModuleQuestion(d, "chiusa")
                              }
                            >
                              -
                            </span>
                          ) : (
                            <span
                              onClick={() =>
                                handleAddModuleQuestion(d, "chiusa")
                              }
                            >
                              +
                            </span>
                          )}
                          <div className="option-domande-cont">
                            {d.opzioni.map((o, subIndex) => (
                              <p key={subIndex}>{o}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : domandaType === "Relazioni" ? (
                    <div className="domande-cont">
                      {domandeChiuseRelazioni.map((d, index) => (
                        <div key={index}>
                          <p>{d.domanda}</p>
                          {checkIfAdded(d, "chiusa") ? (
                            <span
                              onClick={() =>
                                handleDeleteModuleQuestion(d, "chiusa")
                              }
                            >
                              -
                            </span>
                          ) : (
                            <span
                              onClick={() =>
                                handleAddModuleQuestion(d, "chiusa")
                              }
                            >
                              +
                            </span>
                          )}
                          <div className="option-domande-cont">
                            {d.opzioni.map((o, subIndex) => (
                              <p key={subIndex}>{o}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div>
                  <h4>Domande aperte</h4>
                  {domandaType === "Caratteriali" ? (
                    <div className="domande-cont">
                      {domandeAperteCarattere.map((d, index) => (
                        <div key={index}>
                          <p>{d}</p>
                          {checkIfAdded(d, "aperta") ? (
                            <span
                              onClick={() =>
                                handleDeleteModuleQuestion(d, "aperta")
                              }
                            >
                              -
                            </span>
                          ) : (
                            <span
                              onClick={() =>
                                handleAddModuleQuestion(d, "aperta")
                              }
                            >
                              +
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : domandaType === "Problem solving" ? (
                    <div className="domande-cont">
                      {domandeAperteProblem.map((d, index) => (
                        <div key={index}>
                          <p>{d}</p>
                          {checkIfAdded(d, "aperta") ? (
                            <span
                              onClick={() =>
                                handleDeleteModuleQuestion(d, "aperta")
                              }
                            >
                              -
                            </span>
                          ) : (
                            <span
                              onClick={() =>
                                handleAddModuleQuestion(d, "aperta")
                              }
                            >
                              +
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : domandaType === "Creatività" ? (
                    <div className="domande-cont">
                      {domandeAperteCreativita.map((d, index) => (
                        <div key={index}>
                          <p>{d}</p>
                          {checkIfAdded(d, "aperta") ? (
                            <span
                              onClick={() =>
                                handleDeleteModuleQuestion(d, "aperta")
                              }
                            >
                              -
                            </span>
                          ) : (
                            <span
                              onClick={() =>
                                handleAddModuleQuestion(d, "aperta")
                              }
                            >
                              +
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : domandaType === "Decision Making" ? (
                    <div className="domande-cont">
                      {domandeAperteDecisionMaking.map((d, index) => (
                        <div key={index}>
                          <p>{d}</p>
                          {checkIfAdded(d, "aperta") ? (
                            <span
                              onClick={() =>
                                handleDeleteModuleQuestion(d, "aperta")
                              }
                            >
                              -
                            </span>
                          ) : (
                            <span
                              onClick={() =>
                                handleAddModuleQuestion(d, "aperta")
                              }
                            >
                              +
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : domandaType === "Etica" ? (
                    <div className="domande-cont">
                      {domandeAperteEtica.map((d, index) => (
                        <div key={index}>
                          <p>{d}</p>
                          {checkIfAdded(d, "aperta") ? (
                            <span
                              onClick={() =>
                                handleDeleteModuleQuestion(d, "aperta")
                              }
                            >
                              -
                            </span>
                          ) : (
                            <span
                              onClick={() =>
                                handleAddModuleQuestion(d, "aperta")
                              }
                            >
                              +
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : domandaType === "Leadership" ? (
                    <div className="domande-cont">
                      {domandeAperteLeadership.map((d, index) => (
                        <div key={index}>
                          <p>{d}</p>
                          {checkIfAdded(d, "aperta") ? (
                            <span
                              onClick={() =>
                                handleDeleteModuleQuestion(d, "aperta")
                              }
                            >
                              -
                            </span>
                          ) : (
                            <span
                              onClick={() =>
                                handleAddModuleQuestion(d, "aperta")
                              }
                            >
                              +
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : domandaType === "Relazioni" ? (
                    <div className="domande-cont">
                      {domandeAperteRelazioni.map((d, index) => (
                        <div key={index}>
                          <p>{d}</p>
                          {checkIfAdded(d, "aperta") ? (
                            <span
                              onClick={() =>
                                handleDeleteModuleQuestion(d, "aperta")
                              }
                            >
                              -
                            </span>
                          ) : (
                            <span
                              onClick={() =>
                                handleAddModuleQuestion(d, "aperta")
                              }
                            >
                              +
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "0px 0 20px 0",
              }}
            >
              <div className="domande-moduli-nostri">
                <div>
                  <h4>Domande chiuse</h4>
                  <div className="domande-cont">
                    {domandeChiuseScreening.map((d, index) => (
                      <div key={index}>
                        <p>{d.domanda}</p>
                        {checkIfAdded(d, "chiusa") ? (
                          <span
                            onClick={() =>
                              handleDeleteModuleQuestion(d, "chiusa")
                            }
                          >
                            -
                          </span>
                        ) : (
                          <span
                            onClick={() => handleAddModuleQuestion(d, "chiusa")}
                          >
                            +
                          </span>
                        )}
                        <div className="option-domande-cont">
                          {d.opzioni.map((o, subIndex) => (
                            <p key={subIndex}>{o}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4>Domande aperte</h4>
                  <div className="domande-cont">
                    {domandeAperteScreening.map((d, index) => (
                      <div key={index}>
                        <p>{d}</p>
                        {checkIfAdded(d, "aperta") ? (
                          <span
                            onClick={() =>
                              handleDeleteModuleQuestion(d, "aperta")
                            }
                          >
                            -
                          </span>
                        ) : (
                          <span
                            onClick={() => handleAddModuleQuestion(d, "aperta")}
                          >
                            +
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
        <Tour
          isOpen={openTour && tour === "addexam"}
          onRequestClose={() => {
            setOpenTour(false);
          }}
          steps={steps}
          rounded={5}
        />
      </div>
    </>
  );
}

const DomandeMixComponent = React.memo(
  ({
    domande,
    onUpdateDomande,
    setSelectedQuestion,
    setShowAddEditQuestionModal,
  }) => {
    const [currentDomanda, setCurrentDomanda] = useState(domande[0]);
    const [currentDomandaIndex, setCurrentDomandaIndex] = useState(0); // Inizializza l'indice della domanda corrente a 0
    const [confirmVisible, setConfirmVisible] = useState(
      Array(domande.length).fill(false)
    );
    const [draggedDomanda, setDraggedDomanda] = useState(null);

    const handleConfirm = () => {
      const filteredDomande = domande.filter(
        (domanda) => domanda !== currentDomanda
      );
      onUpdateDomande(filteredDomande);
      setCurrentDomanda(domande[0]);
      const updatedConfirmVisible = [...confirmVisible];
      const index = domande.indexOf(currentDomanda);
      updatedConfirmVisible[index] = false;
      setConfirmVisible(updatedConfirmVisible);
    };

    const handleCancel = () => {
      setConfirmVisible(Array(domande.length).fill(false));
    };

    const handleDomandaClick = (domanda, index) => {
      setCurrentDomanda(domanda);
      setCurrentDomandaIndex(index);
    };

    const [draggingIndex, setDraggingIndex] = useState(null); // Stato per tener traccia dell'indice della domanda che viene trascinata

    const handleDragStart = (event, domanda, index) => {
      event.dataTransfer.setData("domanda", JSON.stringify(domanda));
      setDraggingIndex(index); // Imposta l'indice della domanda che viene trascinata
      setDraggedDomanda(domanda);
    };

    const handleDragOver = (event) => {
      event.preventDefault();
    };

    const handleDragEnter = (index) => {
      setDraggingIndex(index); // Imposta l'indice della domanda su cui passa sopra
    };

    const handleDragLeave = () => {
      setDraggingIndex(null); // Resettare l'indice della domanda quando si lascia l'area di trascinamento
    };

    const handleDrop = (event, index) => {
      if (!draggedDomanda) return; // Se non c'è nessuna domanda trascinata, esci

      const droppedDomanda = JSON.parse(event.dataTransfer.getData("domanda"));
      const updatedDomande = [...domande]; // Crea una copia dell'array delle domande

      // Rimuovi la domanda trascinata dalla sua posizione originale
      const draggedIndex = updatedDomande.indexOf(draggedDomanda);
      if (draggedIndex !== -1) {
        updatedDomande.splice(draggedIndex, 1);
      }

      // Inserisci la domanda trascinata nella nuova posizione
      updatedDomande.splice(index, 0, droppedDomanda);

      onUpdateDomande(updatedDomande); // Aggiorna lo stato delle domande

      setDraggingIndex(null); // Resettare l'indice della domanda trascinata dopo il rilascio
      setDraggedDomanda(null); // Resetta la domanda trascinata
    };

    return (
      <div className="domande-container">
        <div className="lista-domande">
          {domande.map((domanda, index) => (
            <div
              key={index}
              onDragStart={(event) => handleDragStart(event, domanda, index)} // Gestisci l'inizio del trascinamento sulla domanda
              onDragOver={handleDragOver}
              onDragEnter={() => handleDragEnter(index)} // Gestisci l'entrata del trascinamento sulla domanda
              onDragLeave={handleDragLeave} // Gestisci l'uscita del trascinamento dall'area della domanda
              onDrop={(event) => handleDrop(event, index)}
              className={`domanda-item ${
                currentDomanda === domanda ? "domanda-selected" : ""
              } ${draggingIndex === index ? "dragging" : ""}`}
            >
              <Popconfirm
                open={confirmVisible[index]}
                title="Sei sicuro di voler eliminare?"
                onConfirm={() => handleConfirm(domanda)}
                onCancel={handleCancel}
                okText="Sì"
                cancelText="No"
                placement="top"
              >
                <img
                  alt="cancel question"
                  src={cancel}
                  onClick={() => {
                    setConfirmVisible((prevState) => {
                      const updatedConfirmVisible = [...prevState];
                      updatedConfirmVisible[index] = true;
                      return updatedConfirmVisible;
                    });
                    setCurrentDomanda(domanda);
                  }}
                />
              </Popconfirm>
              {domanda.opzioni ? (
                <img
                  alt="edit question"
                  src={edit}
                  onClick={() => {
                    setSelectedQuestion({ ...domanda, id: index });
                    setShowAddEditQuestionModal(true);
                  }}
                />
              ) : null}
              <img className="drag-handle" src={move} draggable />
              <p onClick={() => handleDomandaClick(domanda, index)}>
                <span>{index + 1}.</span>
                {domanda.domanda}
              </p>
            </div>
          ))}
        </div>
        <div className="domanda-attuale">
          <p>
            <span>{currentDomandaIndex + 1}.</span>
            {currentDomanda.domanda}
          </p>
          {currentDomanda.opzioni && (
            <ul className="opzioni">
              {/* <li>test</li> */}
              {Object.entries(currentDomanda.opzioni).map(
                ([lettera, risposta], index) => (
                  <li
                    className={
                      currentDomanda.rispostaCorretta &&
                      risposta.trim() ===
                        currentDomanda.rispostaCorretta.risposta
                        ? "risposta risposta-corretta"
                        : "risposta"
                    }
                    key={index}
                  >
                    <span>{lettera.substring(0, 1)}</span> {risposta}
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      </div>
    );
  }
);

const DomandePersonalizzateComponent = React.memo(
  ({
    domande,
    onUpdateDomande,
    setSelectedQuestion,
    setShowAddEditQuestionModal,
  }) => {
    const [currentDomanda, setCurrentDomanda] = useState(domande[0]);
    const [currentDomandaIndex, setCurrentDomandaIndex] = useState(0); // Inizializza l'indice della domanda corrente a 0
    const [confirmVisible, setConfirmVisible] = useState(
      Array(domande.length).fill(false)
    );
    const [draggedDomanda, setDraggedDomanda] = useState(null);

    const handleConfirm = () => {
      const filteredDomande = domande.filter(
        (domanda) => domanda !== currentDomanda
      );
      onUpdateDomande(filteredDomande);
      setCurrentDomanda(domande[0]);
      const updatedConfirmVisible = [...confirmVisible];
      const index = domande.indexOf(currentDomanda);
      updatedConfirmVisible[index] = false;
      setConfirmVisible(updatedConfirmVisible);
    };

    const handleCancel = () => {
      setConfirmVisible(Array(domande.length).fill(false));
    };

    const handleDomandaClick = (domanda, index) => {
      setCurrentDomanda(domanda);
      setCurrentDomandaIndex(index);
    };

    const [draggingIndex, setDraggingIndex] = useState(null); // Stato per tener traccia dell'indice della domanda che viene trascinata

    const handleDragStart = (event, domanda, index) => {
      event.dataTransfer.setData("domanda", JSON.stringify(domanda));
      setDraggingIndex(index); // Imposta l'indice della domanda che viene trascinata
      setDraggedDomanda(domanda);
    };

    const handleDragOver = (event) => {
      event.preventDefault();
    };

    const handleDragEnter = (index) => {
      setDraggingIndex(index); // Imposta l'indice della domanda su cui passa sopra
    };

    const handleDragLeave = () => {
      setDraggingIndex(null); // Resettare l'indice della domanda quando si lascia l'area di trascinamento
    };

    const handleDrop = (event, index) => {
      if (!draggedDomanda) return; // Se non c'è nessuna domanda trascinata, esci

      const droppedDomanda = JSON.parse(event.dataTransfer.getData("domanda"));
      const updatedDomande = [...domande]; // Crea una copia dell'array delle domande

      // Rimuovi la domanda trascinata dalla sua posizione originale
      const draggedIndex = updatedDomande.indexOf(draggedDomanda);
      if (draggedIndex !== -1) {
        updatedDomande.splice(draggedIndex, 1);
      }

      // Inserisci la domanda trascinata nella nuova posizione
      updatedDomande.splice(index, 0, droppedDomanda);

      onUpdateDomande(updatedDomande); // Aggiorna lo stato delle domande

      setDraggingIndex(null); // Resettare l'indice della domanda trascinata dopo il rilascio
      setDraggedDomanda(null); // Resetta la domanda trascinata
    };

    return (
      <div className="domande-container">
        <div className="lista-domande">
          {domande?.map((domanda, index) => (
            <div
              key={index}
              onDragStart={(event) => handleDragStart(event, domanda, index)} // Gestisci l'inizio del trascinamento sulla domanda
              onDragOver={handleDragOver}
              onDragEnter={() => handleDragEnter(index)} // Gestisci l'entrata del trascinamento sulla domanda
              onDragLeave={handleDragLeave} // Gestisci l'uscita del trascinamento dall'area della domanda
              onDrop={(event) => handleDrop(event, index)}
              className={`domanda-item ${
                currentDomanda === domanda ? "domanda-selected" : ""
              } ${draggingIndex === index ? "dragging" : ""}`}
            >
              <Popconfirm
                open={confirmVisible[index]}
                title="Sei sicuro di voler eliminare?"
                onConfirm={() => handleConfirm(domanda)}
                onCancel={handleCancel}
                okText="Sì"
                cancelText="No"
                placement="top"
              >
                <img
                  alt="cancel question"
                  src={cancel}
                  onClick={() => {
                    setConfirmVisible((prevState) => {
                      const updatedConfirmVisible = [...prevState];
                      updatedConfirmVisible[index] = true;
                      return updatedConfirmVisible;
                    });
                    setCurrentDomanda(domanda);
                  }}
                />
              </Popconfirm>
              {domanda.opzioni ? (
                <img
                  alt="edit question"
                  src={edit}
                  onClick={() => {
                    setSelectedQuestion({ ...domanda, id: index });
                    setShowAddEditQuestionModal(true);
                  }}
                />
              ) : null}
              <img className="drag-handle" src={move} draggable />
              <p onClick={() => handleDomandaClick(domanda, index)}>
                <span>{index + 1}.</span>
                {domanda.domanda}
              </p>
            </div>
          ))}
        </div>
        <div className="domanda-attuale">
          <p>
            <span>{currentDomandaIndex + 1}.</span>
            {currentDomanda.domanda}
          </p>
          {currentDomanda.opzioni && (
            <ul className="opzioni">
              {Object.entries(currentDomanda.opzioni).map(
                ([lettera, risposta], index) => (
                  <li
                    className={
                      currentDomanda.rispostaCorretta &&
                      risposta.trim() ===
                        currentDomanda.rispostaCorretta.risposta
                        ? "risposta risposta-corretta"
                        : "risposta"
                    }
                    key={index}
                  >
                    <span>{lettera.substring(0, 1)}</span> {risposta}
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      </div>
    );
  }
);

export default React.memo(AddEditExam);
