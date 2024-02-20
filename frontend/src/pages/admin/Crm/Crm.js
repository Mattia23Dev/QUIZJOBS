import React,{useState,useEffect} from 'react'
import PageTitle from '../../../components/PageTitle'
import {Table, message} from 'antd'
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice'
import { useDispatch, useSelector } from 'react-redux'
import { getAllAttempts, getAllAttemptsByUser } from '../../../apicalls/reports'
import moment from 'moment'
import { getCandidateCrm } from '../../../apicalls/exams'
import DragAndDrop from '../../../components/dragAndDrop/DragAndDrop'

function Crm() {
  const [initialData, setInitialData] = useState([])
  const id = useSelector(state=>state.users.user._id);
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
        message.success(response.message)
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
  return (
    <div>
      <PageTitle title="Reports"/>
      <div className='divider'></div>
      <div className='flex gap-2 mt-2'>
        <input type="text" placeholder='Exam' value={filters.examName} onChange={(e)=>setFilters({...filters, examName: e.target.value})}/>
        <input type="text" placeholder='User' value={filters.userName} onChange={(e)=>setFilters({...filters, userName: e.target.value})}/>
        <button className='primary-outlined-btn' onClick={()=>{
            setFilters({
                userName: "",
                examName: "",
            })
            getData({
                userName: "",
                examName: "",
            })
        }}>
            Clear
        </button>
        <button className='primary-contained-btn' onClick={()=>getData(filters)}>
            Search
        </button>
      </div>
      <DragAndDrop initialData={initialData} />
    </div>
  )
}

export default Crm