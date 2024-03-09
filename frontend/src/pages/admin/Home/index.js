import { Card, Row, Col, Statistic, message, Timeline, Tag, Drawer, Button, Space } from 'antd';
import React,{useState,useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllExams } from '../../../apicalls/exams'
import PageTitle from '../../../components/PageTitle'
import "antd/dist/antd.css";
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice'
import './testPage.css';

const SalesDashboard = () => {
    return (
      <div>
        <Card title="Statistiche delle vendite">
          <Row gutter={16}>
            <Col span={8}>
              <Statistic title="Vendite totali" value={1000} />
            </Col>
            <Col span={8}>
              <Statistic title="Vendite settimanali" value={300} />
            </Col>
            <Col span={8}>
              <Statistic title="Vendite mensili" value={700} />
            </Col>
          </Row>
        </Card>
      </div>
    );
  }

  const UserStatsDashboard = () => {
    const userData = {
        totalUsers: 1000,
        activeUsers: 750,
        inactiveUsers: 250,
      };
    
      // Dati fittizi per userGenderData
      const userGenderData = {
        male: 600,
        female: 400,
      };
    return (
      <div>
        <Card title="Statistiche degli utenti">
          <Row gutter={16}>
            <Col span={12}>
              <Statistic type="bar" data={userData} />
            </Col>
            <Col span={12}>
              <Statistic type="pie" data={userGenderData} />
            </Col>
          </Row>
        </Card>
      </div>
    );
  }

  const ActivityDashboard = () => {
    return (
      <div>
        <Card title="Attività recenti">
          <Timeline>
            <Timeline.Item color="green">Creazione del nuovo documento</Timeline.Item>
            <Timeline.Item color="red">Eliminazione dell'utente</Timeline.Item>
            <Timeline.Item color="blue">Modifica del profilo</Timeline.Item>
          </Timeline>
        </Card>
      </div>
    );
  }

  const TagDashboard = () => {
    return (
      <div>
        <Card title="Tag degli utenti">
          <Tag color="magenta">VIP</Tag>
          <Tag color="red">Cliente premium</Tag>
          <Tag color="volcano">Nuovo utente</Tag>
          <Tag color="orange">Utente registrato</Tag>
          <Tag color="gold">Abbonato</Tag>
        </Card>
      </div>
    );
  }

  const StatisticsDashboard = () => {
    return (
      <div>
        <Card title="Statistiche">
          <Statistic title="Utenti attivi" value={1000} />
          <Statistic title="Nuovi utenti oggi" value={15} />
          <Statistic title="Entrate mensili" value={15000} prefix="$" />
        </Card>
      </div>
    );
  }

function HomePage() {
  const [exams, setExams] = useState([])
  const [openDrawer, setOpenDrawer] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state=>state.users.user)
  const getExams = async() => {
    try{
       dispatch(ShowLoading())
       const response = await getAllExams()
       dispatch(HideLoading())
       if(response.success){
        message.success(response.message)
        console.log(response.data)
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
  useEffect(()=>{
    getExams()
  },[])

  const onCloseDrawer = () => {
    setOpenDrawer(false)
  }
  return (
    user && <div className='home-content'>
      <div className='test-header'>
        <PageTitle title={`Dashboard`}/>
        <button onClick={() => setOpenDrawer(true)}>Vedi dati</button>
      </div>  
      <div>
        <SalesDashboard />
        <UserStatsDashboard />
        <ActivityDashboard />
        <StatisticsDashboard />
        <TagDashboard />
      </div>
      <Drawer
            title="Drawer with extra actions"
            width={500}
            className='drawer-dash'
            onClose={onCloseDrawer}
            open={openDrawer}
            placement='right'
            extra={
            <Space>
                <Button onClick={onCloseDrawer}>Cancel</Button>
                <button className='outlined-btn-primary' onClick={onCloseDrawer}>
                OK
                </button>
            </Space>
            }
        >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </Drawer>
    </div>
  )
}

export default HomePage