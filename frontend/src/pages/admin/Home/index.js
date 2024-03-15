import { Card, Row, Col, Statistic, message, Timeline, Tag, Drawer, List, Typography, Button, Space, Select, Affix } from 'antd';
import React,{useState,useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllExams, getExamByUser } from '../../../apicalls/exams'
import PageTitle from '../../../components/PageTitle'
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice'
import { SolutionOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import Tour from 'reactour'
import './testPage.css';
const {Option} = Select;

const SalesDashboard = ({exams}) => {
    return (
      <div className='overview-top'>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Test creati"
                value={exams?.length}
                prefix={<><SolutionOutlined style={{ fontSize: '24px' }} /><span style={{ margin: '0 8px' }} /></>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Candidati"
                value={300}
                prefix={<><UserOutlined style={{ fontSize: '24px' }} /><span style={{ margin: '0 8px' }} /></>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Appuntamenti"
                value={0}
                prefix={<><CalendarOutlined style={{ fontSize: '24px' }} /><span style={{ margin: '0 8px' }} /></>}
              />
            </Card>
          </Col>
        </Row>
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
        <Card title="Prossimi appuntamenti">
          <Timeline>
            <Timeline.Item color="green">Appuntamento 1 - 12:00</Timeline.Item>
            <Timeline.Item color="red">Appuntamento 2 - 15:00</Timeline.Item>
            <Timeline.Item color="blue">Appuntamento 3 - 18:00</Timeline.Item>
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

function HomePage({tour, setOpenTour, openTour}) {
  const [exams, setExams] = useState([])
  const [openDrawer, setOpenDrawer] = useState(false);
  const dispatch = useDispatch()
  const [filterTestOption, setFilterTestOption] = useState()
  const [filterTest, setFilterTest] = useState('Tutti')
  const navigate = useNavigate()
  const user = useSelector(state=>state.users.user)

  const onCloseDrawer = () => {
    setOpenDrawer(false)
  }
  const steps = [
    {
      content: 'Analizza il numero di candidati',
      selector: '.elemento1', // Selettore CSS dell'elemento
    },
    {
      content: 'Analizza i punteggi',
      selector: '.elemento2', // Selettore CSS dell'elemento
    },
    {
      content: 'Altre azioni',
      selector: '.elemento3', // Selettore CSS dell'elemento
    },
  ];
  const getExamsData = async() => {
    try{
      const response = await getExamByUser(user._id)
      if(response.success){
       setFilterTestOption(response.data)
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
  useEffect(() => {
    getExamsData()
  }, [])
  const data = [
    { name: 'Esame 1', candidates: 50, percentage: 80 },
    { name: 'Esame 2', candidates: 70, percentage: 75 },
    { name: 'Esame 3', candidates: 45, percentage: 85 },
    { name: 'Esame 1', candidates: 50, percentage: 80 },
    { name: 'Esame 2', candidates: 70, percentage: 75 },
    { name: 'Esame 3', candidates: 45, percentage: 85 },
    { name: 'Esame 1', candidates: 50, percentage: 80 },
    { name: 'Esame 2', candidates: 70, percentage: 75 },
    { name: 'Esame 3', candidates: 45, percentage: 85 },
  ];
  return (
    user && <div className='home-content'>
      <div className='test-header'>
        <div>
          <PageTitle title={`Dashboard`}/>
          <div>
              <label>filtra per test:</label>
              <Select value={filterTest} onChange={(value) => setFilterTest(value)}>
                <Option value='tutti'>Tutti</Option>
                {filterTestOption && filterTestOption.length > 0 && filterTestOption.map((test) => (
                  <Option key={test._id} value={test._id}>{test.jobPosition}</Option>
                ))}
              </Select>
          </div>
        </div>
        <button onClick={() => setOpenDrawer(true)}>Vedi dati</button>
      </div> 
      <div className='dashboard-container'>
        <div>
          <div className='elemento1'>
            <SalesDashboard exams={exams} />
          </div>
          <div className='elemento2'>
            <UserStatsDashboard />
          </div>
          <StatisticsDashboard />
          <TagDashboard />
        </div>
        <Affix className='right-dash-affix' offsetTop={180}>
          <div className='right-dash'>
            <div className='elemento3'>
              <ActivityDashboard /> 
            </div>
            <List
            className='list-dash'
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
              <List.Item>
                <Typography.Text strong>{item.name}</Typography.Text>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <Typography.Text>{item.candidates} candidati</Typography.Text>
                  <Typography.Text style={{ marginLeft: 8 }}>{item.percentage}%</Typography.Text>
                </div>
              </List.Item>
              )}
            />
          </div>
        </Affix>
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
        <Tour
        isOpen={openTour && tour === "home"}
        onRequestClose={() => {setOpenTour(false)}}
        steps={steps}
        rounded={5}
      />
    </div>
  )
}

export default HomePage