import React,{useState,useEffect} from 'react'
import PageTitle from '../../../components/PageTitle'
import {Table, message} from 'antd'
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice'
import { useDispatch, useSelector } from 'react-redux'
import { getAllAttempts, getAllAttemptsByUser } from '../../../apicalls/reports'
import moment from 'moment'
import { getCandidateCrm } from '../../../apicalls/exams'
import DragAndDrop from '../../../components/dragAndDrop/DragAndDrop'
import InfoCandidate from './InfoCandidate'
import AddCandidate from './AddCandidate'

function Crm({openTour, setOpenTour, tour}) {
  const [initialData, setInitialData] = useState([])
  const id = useSelector(state=>state.users.user._id);
  const [showInfoCandidateModal, setShowInfoCandidateModal] = useState();
  const [showAddCandidateModal, setShowAddCandidateModal] = useState();
  const [addStatus, setAddStatus] = useState();
  const [selectedCandidate, setSelectedCandidate] = useState();
  const [filters, setFilters] = useState({
    examName: "",
    userName: "",
  })
  const dispatch = useDispatch()
  const getData = async(tempFilters) => {
     try{
       dispatch(ShowLoading())
       const response = await getCandidateCrm(id)
       dispatch(HideLoading())
       if(response.success){
        setInitialData(response.data)
        //message.success(response.message)
        console.log(response.data)
       }
       else{
        message.error(response.message)
       }
     }
     catch(error){
      dispatch(HideLoading())
      message.error(error.message)
     }
  }
  useEffect(()=>{
   getData(filters)
  },[])
  const isMobile = () => {
    return window.innerWidth <= 768;
  };
  return (
    <div className='home-content'>
      {!isMobile && <PageTitle title="Reports" />}
      <DragAndDrop
      setSelectedCandidate={setSelectedCandidate}
      selectedCandidate={selectedCandidate} 
      setShowInfoCandidateModal={setShowInfoCandidateModal}
      setShowAddCandidateModal={setShowAddCandidateModal}
      showAddCandidateModal={showAddCandidateModal}
      setInitialData={setInitialData}
      tour={tour}
      setOpenTour={setOpenTour}
      openTour={openTour}
      setAddStatus={setAddStatus}
      initialData={initialData} />

      {showInfoCandidateModal&&<InfoCandidate 
        jobPosition={selectedCandidate.jobPosition}
        setShowInfoCandidateModal={setShowInfoCandidateModal}
        exams={selectedCandidate.tests}
        showInfoCandidateModal={showInfoCandidateModal}
        selectedCandidate={selectedCandidate}
        setSelectedCandidate={setSelectedCandidate}
        examId = {id}
        />}

       {showAddCandidateModal&&<AddCandidate 
        setShowAddCandidateModal={setShowAddCandidateModal}
        showAddCandidateModal={showAddCandidateModal}
        addStatus={addStatus}
        />}
    </div>
  )
}

export default Crm