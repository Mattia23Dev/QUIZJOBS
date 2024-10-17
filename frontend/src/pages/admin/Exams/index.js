import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";
import {
  Table,
  message,
  Row,
  Modal,
  Popconfirm,
  Switch,
  Select,
  Col,
  Card,
  Badge,
} from "antd";
import { MdMore } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import {
  getAllExams,
  deleteExam,
  getExamByUser,
  changeStatusExam,
} from "../../../apicalls/exams";
import "./index.css";
import moment from "moment";
import candidateNumber from "../../../imgs/candidate.png";
import skilltest from "../../../imgs/skilltest.png";
import manual from "../../../imgs/manual.png";
import mix from "../../../imgs/mix.png";
import skt from "../../../imgs/skt.png";
import Tour from "reactour";
import logo from "../../../imgs/logo.png";
import { useTranslation } from "react-i18next";
import { isMobile } from "../../../utlis/functions";
import { GenerateTestOptions } from "../../../utlis/constants";
const { Option } = Select;

function ExamsPage({ openTour, setOpenTour, tour }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [exams, setExams] = useState([]);
  const [createTest, setCreateTest] = useState();
  const [confirmVisibleMap, setConfirmVisibleMap] = useState({});
  const [attivo, setAttivo] = useState("tutti"); // Valori possibili: 'tutti', 'attivo', 'non attivo'
  const [difficolta, setDifficolta] = useState("tutti"); // Valori possibili: 'tutti', 'facile', 'medio', 'difficile'
  const [numCandidati, setNumCandidati] = useState("tutti");
  const user = useSelector((state) => state.users.user);
  const storedQuestions = JSON.parse(localStorage.getItem("questions"));
  const storedQuestionsPersonal = JSON.parse(
    localStorage.getItem("questionsPersonal")
  );
  const storedConfig = JSON.parse(localStorage.getItem("config"));
  const [confirmVisible, setConfirmVisible] = useState(
    Array(exams).fill(false)
  );

  /*
  <div className='flex gap-2'>
          <i className='ri-pencil-line cursor-pointer'
          onClick={()=>navigate(`/admin/exams/edit/${record._id}`)}></i>
          <span className='cursor-pointer'
          onClick={()=>navigate(`/admin/exams/info/${record._id}`)}>Info</span>
          <i className='ri-delete-bin-line cursor-pointer' onClick={()=>{deleteExamById(record._id)}}></i>
  </div>
  */
  const steps = [
    {
      content: "Crea un nuovo AI test",
      selector: ".elemento1",
    },
    {
      content: "Vedi le info dei test creati",
      selector: ".elemento2", // Selettore CSS dell'elemento
    },
    {
      content: "Attiva/Disattiva il test",
      selector: ".elemento3", // Selettore CSS dell'elemento
    },
  ];
  const continueExam = () => {
    if (storedConfig && storedQuestions) {
      if (storedConfig.tag === "manual") {
        navigate("/admin/exams/add/manual", {
          state: {
            storedQuestions: storedQuestions,
          },
        });
      } else if (storedConfig.tag === "ai") {
        navigate("/admin/exams/add/ai", {
          state: {
            storedQuestions: storedQuestions,
          },
        });
      } else {
        navigate("/admin/exams/add/mix", {
          state: {
            storedQuestions: storedQuestions,
            storedQuestionsPersonal: storedQuestionsPersonal,
          },
        });
      }
    }
  };
  const getExamsData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamByUser(
        user.teamType ? user.company : user._id
      );
      dispatch(HideLoading());
      if (response.success) {
        //message.success(response.message)
        setExams(response.data);
        setConfirmVisible(Array(exams).fill(false));
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  const deleteExamById = async (id) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteExam(id);
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        getExamsData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const filteredExams = exams.filter((exam) => {
    if (attivo !== "tutti") {
      if (attivo === "attivo" && exam.active) {
        return true;
      }
      if (attivo === "non attivo" && !exam.active) {
        return true;
      }
      return false;
    }

    // Filtraggio per difficoltà
    if (difficolta !== "tutti") {
      if (difficolta === "facile" && exam.difficulty === "Facile") {
        return true;
      }
      if (difficolta === "medio" && exam.difficulty === "Medio") {
        return true;
      }
      if (difficolta === "difficile" && exam.difficulty === "Difficile") {
        return true;
      }
      return false;
    }

    // Filtraggio per numero di candidati
    if (numCandidati !== "tutti") {
      const numCandidatiInt = parseInt(numCandidati);
      if (numCandidati === "0-50" && exam.candidates.length <= 50) {
        return true;
      }
      if (
        numCandidati === "51-100" &&
        exam.candidates.length > 50 &&
        exam.candidates.length <= 100
      ) {
        return true;
      }
      if (
        numCandidati === "101-500" &&
        exam.candidates.length > 100 &&
        exam.candidates.length <= 500
      ) {
        return true;
      }
      if (numCandidati === "oltre500" && exam.candidates.length > 500) {
        return true;
      }
      return false;
    }

    return true;
  });

  useEffect(() => {
    getExamsData();
  }, []);
  const handleSwitchChange = (index) => {
    setConfirmVisible((prevState) => {
      const updatedConfirmVisible = [...prevState];
      updatedConfirmVisible[index] = true;
      return updatedConfirmVisible;
    });
  };

  const handleCancel = () => {
    setConfirmVisible(Array(exams).fill(false));
  };

  const handleOnOff = async (exam) => {
    console.log(exam);
    const payload = {
      examId: exam._id,
      active: exam.active === true ? false : true,
    };
    try {
      const response = await changeStatusExam(payload);
      console.log(response.data);
      const updatedExams = exams.map((item) =>
        item._id === exam._id ? { ...item, active: !exam.active } : item
      );
      setExams(updatedExams);
      setConfirmVisible(Array(exams).fill(false));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="exams-container">
      <div className=" flex justify-between items-center">
        {!isMobile() && <PageTitle title="Test" />}

        <div>
          {storedQuestions && (
            <button
              className="primary-outlined-btn flex items-center cursor-pointer"
              onClick={continueExam}
            >
              <i style={{ marginRight: "3px" }} className="ri-pencil-line"></i>
              Continue Exam
            </button>
          )}
          <button
            className="primary-outlined-btn flex items-center cursor-pointer elemento1"
            onClick={() => setCreateTest(true)}
          >
            <i className="ri-add-line" style={{ marginRight: "7px" }}></i>
            {t("create_test")}
          </button>
        </div>
      </div>

      <div className="test-filter">
        <div>
          {isMobile() ? (
            <label>{t("activity")}:</label>
          ) : (
            <label>{t("filter_by_activity")}</label>
          )}
          <Select value={attivo} onChange={(value) => setAttivo(value)}>
            <Option value="tutti">{t("all")}</Option>
            <Option value="attivo">{t("active")} </Option>
            <Option value="non attivo">{t("inactive")} </Option>
          </Select>
        </div>
        <div>
          {isMobile() ? (
            <label>{t("difficulty")}</label>
          ) : (
            <label>{t("filter_by_difficulty")}</label>
          )}
          <Select value={difficolta} onChange={(value) => setDifficolta(value)}>
            <Option value="tutti">{t("all")}</Option>
            <Option value="facile">{t("easy")}</Option>
            <Option value="medio">{t("medium")}</Option>
            <Option value="difficile">{t("difficult")}</Option>
          </Select>
        </div>
        <div>
          {isMobile() ? (
            <label>{t("candidates")}</label>
          ) : (
            <label>{t("number_of_candidates")}</label>
          )}
          <Select
            value={numCandidati}
            onChange={(value) => setNumCandidati(value)}
          >
            <Option value="tutti">{t("all")}</Option>
            <Option value="0-50">0 - 50</Option>
            <Option value="51-100">51 - 100</Option>
            <Option value="101-500">101 - 500</Option>
            <Option value="oltre500">{t("more_than")} 500</Option>
          </Select>
        </div>
      </div>

      <Row gutter={[16, 16]} className="exam-list mt-2">
        {filteredExams &&
          filteredExams.map((exam, index) => {
            const examId = exam._id;
            return (
              <div
                className={exam.tag === "mix" ? "card-exam ceg" : "card-exam"}
                key={examId}
              >
                <div className="card-exam-top">
                  <div>
                    <h1>{exam.jobPosition}</h1>
                    {exam.tag === "mix" && (
                      <div className="taggetto">
                        <img alt="test misto" src={skt} />
                        <span>Misto</span>
                      </div>
                    )}
                  </div>
                  {/* {isMobile() ? (
                    <button
                      className="elemento2"
                      onClick={() => navigate(`/admin/exams/info/${exam._id}`)}
                    >
                      Candidati
                    </button>
                  ) : (
                    <button
                      className="elemento2"
                      onClick={() => navigate(`/admin/exams/info/${exam._id}`)}
                    >
                      Info candidati
                    </button>
                  )} */}
                </div>
                {/* <div className="divider"></div> */}
                <div className="card-exam-middle">
                  <ul className="card-exam-middle-skills">
                    {exam.skills.map((skill, subIndex) => (
                      <li className="text-md" key={subIndex}>
                        {skill}
                      </li>
                    ))}
                  </ul>
                  <Popconfirm
                    open={confirmVisible[index]}
                    title={
                      exam.active
                        ? "Sei sicuro di voler disattivare il link?"
                        : "Sei sicuro di voler attivare il link?"
                    }
                    onConfirm={async () => {
                      try {
                        await handleOnOff(exam);
                      } catch (error) {
                        console.error(
                          "Si è verificato un errore durante la conferma:",
                          error
                        );
                      }
                    }}
                    onCancel={handleCancel}
                    okText="Sì"
                    cancelText="No"
                    placement="top"
                  >
                    <Switch
                      size="small"
                      className="elemento3"
                      checked={exam.active}
                      onChange={(checked) => handleSwitchChange(index)}
                    />
                  </Popconfirm>
                </div>

                <div className="card-exam-bottom">
                  <div>
                    <h4>
                      {t("difficulty")}
                      <Badge
                        text={exam?.difficulty}
                        color={
                          exam.difficulty === "Medio"
                            ? "red"
                            : exam.difficulty === "Facile"
                            ? "green"
                            : "yellow"
                        }
                        count={2}
                        size="default"
                      />
                    </h4>
                    
                    <h4>
                      {t("deadline")}:{" "}
                      {exam.deadline
                        ? moment(exam.deadline).format("DD/MM/YYYY")
                        : "Nessuna scadenza"}
                    </h4>
                  </div>
                  <h4 className="text-md">
                    <img
                      src={candidateNumber}
                      alt="candidati al test di SkillTest"
                    />
                    {exam.candidates.length} / 100
                  </h4>
                </div>

                {isMobile() ? (
                  <button
                    className="elemento2"
                    onClick={() => navigate(`/admin/exams/info/${exam._id}`)}
                  >
                    {t("candidates")}
                  </button>
                ) : (
                  <button
                    className="elemento2"
                    onClick={() => navigate(`/admin/exams/info/${exam._id}`)}
                  >
                    {t("candidate_info")}
                  </button>
                )}
              </div>
            );
          })}
      </Row>
      <Tour
        isOpen={openTour && tour === "exam"}
        onRequestClose={() => {
          setOpenTour(false);
        }}
        steps={steps}
        rounded={5}
      />
      <Modal
        title={
          <div className="modal-header">
            <img style={{ width: "17%" }} src={logo} alt="logo skilltest" />
          </div>
        }
        style={{ borderRadius: "12px", overflow: "hidden" }}
        open={createTest}
        width={isMobile() ? "95%" : "70%"}
        footer={false}
        onCancel={() => {
          setCreateTest(false);
        }}
      >
        <div className="choose-test">
          {GenerateTestOptions.map((item, index) => (
            <div onClick={() => navigate(item?.path ?? "#")} key={index}>
              {item.badgeImage && item.badgeText ? (
                <div>
                  <img alt="test misto" src={item.badgeImage} />
                  <span>{t(item.badgeText)}</span>
                </div>
              ) : (
                ""
              )}
              <img alt="test skilltest" src={item.image} />
              <h2>{t(item.title)}</h2>
              <p>{t(item.description)}</p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

export default React.memo(ExamsPage);
