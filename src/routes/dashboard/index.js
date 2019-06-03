import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card,Carousel,Icon,Spin } from 'antd'
import { color } from 'utils'
import { Page } from 'components'
import { NumberCard, Quote, Sales, Weather, RecentSales, Comments, Completed, Browser, Cpu, User } from './components'
import styles from './index.less'

class Dashboard extends React.Component {
  state = {
    timer:null
  }
  componentDidMount(){
    this.state.timer=setInterval(()=>{
      let nowtime=new Date();
      const year=nowtime.getFullYear();
      const month=nowtime.getMonth()+1;
      const date=nowtime.getDate();
      document.getElementById("mytime").innerHTML=year+"年"+month+"月"+date+"日";
      document.getElementById("mytime2").innerHTML=nowtime.toLocaleTimeString();
    }, 1000)
  }
  componentWillUnmount(){
    if(this.state.timer!= null) {
      clearInterval(this.state.timer);
    }
  }
  render(){
    const { dashboard: {weather, sales, quote, numbers,loglist,loglistbytime, notifylist,icons,recentSales, comments, completed, browser, cpu, user,
      modalVisible,}}=this.props

    //默认4个框，没有补上
    let objlist=[];
    for (let i=0;i<4;i++){
      objlist[i]={count:0,logContent:"无数据"}
    }
    for(let j=0;j<loglist.length;j++){
      objlist[j] = loglist[j]
    }
    const numberCards = objlist.map((item, key) => (<Col key={key} lg={6} md={12}>
      <NumberCard {...item} />
    </Col>))
    const Notifylist = notifylist.map((item, key) => (<div key={key}>
      <ul>
        <li style={{paddingTop:'10px',marginLeft:'0px',color: '#fff'}}>标题：{item.notifyTitle}</li>
        <li style={{paddingTop:'10px',marginLeft:'0px',color: '#fff'}}>内容：{item.notifyContent}</li>
        <li style={{paddingTop:'10px',marginLeft:'0px',color: '#fff'}}>时间：{item.lastUpdateTime}</li>
      </ul>
    </div>))

    return (
      <Page loading={this.props.loading.models.dashboard && loglistbytime.length === 0} className={styles.dashboard}>
        <Row gutter={24}>
          {numberCards}
          <Col lg={18} md={24}>
            <Card bordered={false}
                  bodyStyle={{
                    padding: '24px 36px 24px 0',
                  }}
            ><div style={{textAlign:'right'}}>
              <a  onClick={()=>{this.props.dispatch({type: 'dashboard/hideModal',});}}><Icon type="bar-chart" style={{ fontSize: 14, color: '#08c' }} />条形</a>&nbsp;&nbsp;
              <a  onClick={()=>{this.props.dispatch({type: 'dashboard/showModal',});}}><Icon type="line-chart" style={{ fontSize: 14, color: '#08c' }} />折线</a>
            </div>
              <Sales data={loglistbytime} modalVisible={modalVisible} loglist={loglist}/>
            </Card>
          </Col>
          <Col lg={6} md={24}>
            <Row gutter={24}>
              <Col lg={24} md={12}>
                <Card bordered={false}
                      bodyStyle={{
                        padding: 0,
                        height: 204,
                        background: color.blue,
                      }}
                  ><Spin spinning={this.props.loading.effects['dashboard/queryWeather']}>
                    <div className={styles.weather}>
                      <div className={styles.left}>
                        <div className={styles.icon}
                             style={{
                               backgroundImage: `url(${weather.icon})`,
                             }}
                        />
                        <p>{weather.name}</p>
                      </div>
                      <div className={styles.right}>
                        <h1 className={styles.temperature}>{`${weather.temperature}°`}</h1>
                        <p className={styles.description}>{weather.city}</p>
                        <span id="mytime"></span>
                        <span id="mytime2"></span>
                      </div>
                    </div>
                  </Spin>
                </Card>

              </Col>
              <Col lg={24} md={12}>
                <Card bordered={false}
                      className={styles.quote}
                      bodyStyle={{
                        padding: 0,
                        height: 200,
                        background: color.peach,
                      }}
                ><p style={{paddingTop:'10px',marginLeft:'10px',color: '#fff'}}>系统公告</p>
                  <Carousel
                    vertical
                    autoplay
                    dots={false}
                  >
                    {Notifylist}
                  </Carousel>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Page>
    )
  }


}

Dashboard.propTypes = {
  dashboard: PropTypes.object,
  loading: PropTypes.object,
}

export default connect(({ dashboard, loading,app }) => ({ dashboard, loading }))(Dashboard)
