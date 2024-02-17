import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import PageTitle from '../../../components/PageTitle'
import {Table,message} from 'antd'
import { useDispatch } from 'react-redux'
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice'
import { getAllExams, deleteExam } from '../../../apicalls/exams'

function ExamsPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [exams,setExams] = useState([])
  const columns = [
    {
      title: "Exam Name",
      dataIndex: "jobPosition",
    },
    {
      title: "Skills",
      dataIndex: "skills"
    },
    {
      title: "Difficoltà",
      dataIndex: "difficulty"
    },
    {
      title: "Lingua",
      dataIndex: "testLanguage"
    },
    {
      title: "Candidati",
      render: (text, record) => record.candidates.length
    },    
    {
      title: "Action",
      dataIndex: "action",
      render: (text,record) => {
        return <div className='flex gap-2'>
          <i className='ri-pencil-line cursor-pointer'
          onClick={()=>navigate(`/admin/exams/edit/${record._id}`)}></i>
          <span className='cursor-pointer'
          onClick={()=>navigate(`/admin/exams/info/${record._id}`)}>Info</span>
          <i className='ri-delete-bin-line cursor-pointer' onClick={()=>{deleteExamById(record._id)}}></i>
        </div>
      }
    }
  ]
  const getExamsData = async() => {
    try{
      dispatch(ShowLoading())
      const response = await getAllExams()
      dispatch(HideLoading())
      if(response.success){
       message.success(response.message)
       console.log(response);
       setExams(response.data)
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
  const deleteExamById = async(id) => {
    try{
      dispatch(ShowLoading());
      const response = await deleteExam(id);
      dispatch(HideLoading())
      if(response.success){
        message.success(response.message);
        getExamsData()
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
     getExamsData()
  },[])
  return (
    <>
    <div className='flex justify-between mt-1'>
       <PageTitle title="Exams"/>
       <button className='primary-outlined-btn flex items-center cursor-pointer' onClick={()=>navigate('/admin/exams/add')}>
        <i className='ri-add-line'></i>
        Add Exam
       </button>
    </div>
    <div className='divider mt-1'></div>
    <Table columns={columns} dataSource={exams} rowKey={(record) => record._id} />
    </>
  )
}

export default ExamsPage