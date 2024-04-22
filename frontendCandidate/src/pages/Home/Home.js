import React, { useEffect, useState } from 'react'
import './home.css'
import { useDispatch, useSelector } from 'react-redux'
import { HideLoading, ShowLoading } from '../../redux/loaderSlice'
import { getCandidateTest } from '../../apicalls/users'
import { Table } from 'antd'

const Home = () => {
  const [tests, setTests] = useState([])
  const dispatch = useDispatch()
  const user = useSelector(state=>state.users.user)

  const getTest = async () => {
    try {
      const payload = {
        candidateId: user._id,
      }
      const response = await getCandidateTest(payload)
      console.log(response)
      if (response.success){
        setTests(response.data)
        dispatch(HideLoading())
      }
    } catch (error) {
      console.error(error)
    }
  }

  const columns = [
    {
      title: 'Posizione',
      dataIndex: 'testName',
      key: 'testName',
    },
    {
      title: 'Azienda',
      dataIndex: 'testId',
      key: 'testId',
      render: testId => testId.company?.companyName ? testId.company.companyName : ''
    },
    {
      title: "Punteggio",
      dataIndex: "punteggio",
      key: "punteggio",
      render: (text, record) => (
        <span className={record.report?.result?.percentage.toFixed(2) > 60 ? "punteggio-column-green":"punteggio-column-red"}>{record.report?.result?.percentage.toFixed(2)}%</span>
      ),
      sorter: {
        compare: (a, b) => a?.report?.result?.percentage.toFixed(2) - b?.report?.result?.percentage.toFixed(2),
        multiple: 2,
      },
    },
    {
      title: 'Città',
      dataIndex: 'testId',
      key: 'testId.jobCity',
      render: testId => testId.jobCity ? testId.jobCity : ''
    },
    {
      title: 'Contratto',
      dataIndex: 'testId',
      key: 'testId.jobContract',
      render: testId => testId.jobContract ? testId.jobContract : ''
    },
    {
      title: 'Tipologia',
      dataIndex: 'testId',
      key: 'testId.jobTypeWork',
      render: testId => testId.jobTypeWork ? testId.jobTypeWork : ''
    }
  ];

  useEffect(() => {
    if (user){
      dispatch(ShowLoading())
      getTest()
    }
  }, [])
  return (
    <div className='home-in'>
      <h1>Test svolti</h1>
      <Table dataSource={tests} columns={columns} rowKey={record => record._id}
            expandable={{
              expandedRowRender: (record) => (
                <p
                  style={{
                    margin: 0,
                  }}
                  dangerouslySetInnerHTML={{ __html: record?.testId?.jobDescription ? record.testId.jobDescription : 'Nessuna descrizione' }}
                />
              ),
              rowExpandable: (record) => record?.testName !== 'Not Expandable',
            }}/>
    </div>
  )
}

export default Home