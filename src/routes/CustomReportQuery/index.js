import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'dva'
import { Button,Form ,Row,Col,Tag,Tooltip,Icon,message} from 'antd'
import styles from './index.less'
import { DynamicFilter } from 'components'
import { Page } from 'components'
import { request,config } from 'utils'
import queryString from 'query-string'

import DateFilter from './components/DateFilter'
import OtherFilter from './components/OtherFilter'

/**
 * @Title:指标库管理=》自定义报表查询
 * @Description:子组件（stateless）
 * @Author: cs
 * @Time: 2019/5/27
 * @Version 1.0
 * @Copyright: Copyright (c) 2019 .DHCC
 */

const FormItem = Form.Item
let queryData=[]
let filedslist = {}
let queryUrl = []
class CustomReportQuery extends React.Component{
  state = {
    src:"",
    loading:false,
    data:[],
    dimensionId:[],
    pdate:[],
    title:"",
  }
  componentDidMount () {
      this.fetchUrl()
  }
  fetchParaList = (urlname ) => {
    this.promise = request({
      url:'/gateway/customreportdimension.json',
      method: 'post',
      data: {
        fileUrl:urlname,
      },
    }).then((result) => {
      if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
        return
      }
      if(result.RSP_BODY.dimensionList === undefined){
        this.setState({
          data:[],
          src:queryUrl+this.props.location.search.substring(1)+"?date=20990101"+"&t="+new Date().getTime()
        })
      }else {
        queryData = result.RSP_BODY.dimensionList
        let Data =queryData.map((data)=>{
          let obj={
            key:data.id,
            title:data.dimensionName,
            type:data.dimensionType,
            code:data.dimensionCode,
          }
          return obj
        })
        this.setState({
          data:[...Data],
          src:queryUrl+this.props.location.search.substring(1)+"?date=20990101"+"&t="+new Date().getTime()
        })
      }

    })
  }
  fetchUrl =()=>{
    this.promise = request({
      url:'/gateway/reportquery.json',
      method: 'post',
      data: {
      },
    }).then((result)=>{
      if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
        return
      }else {
        queryUrl = result.RSP_BODY.engineUrl
        const fileurl = decodeURI(this.props.location.search.substring(1))
        this.fetchParaList( fileurl)
      }
    })
  }
  componentWillReceiveProps =(nextProps)=>{

    let g = []
    if(nextProps.CustomReportQuery.paramDate && nextProps.CustomReportQuery.paramCode){
      g.push({
        code:nextProps.CustomReportQuery.paramCode,
        date:nextProps.CustomReportQuery.paramDate
      })
    }
    this.setState({
      pdate:g,
    })
  }


  render(){
    const { dispatch } = this.props
    const {
      LedgerType,
      dateVisible,
      dateModalList,
      otherVisible,
      otherModalList,
      code,
      filtersData,
    } =this.props.CustomReportQuery


    const changeFilter =(id,dimensionType,code)=>{
      if(dimensionType === '1'){ //1 为日期维度，0为非日期维度
        this.props.dispatch({
          type:LedgerType+'/dataModalData',
          payload: {
            id:id,
            page: "",
            pageSize: "",
            filterKey: "",
            filterValue: "",
          },
        })
        this.props.dispatch({
          type: LedgerType+'/showModal',
          payload:{
            code:code
          }
        })
      }else {
        this.props.dispatch({
          type:LedgerType+'/otherModalData',
          payload: {
            id:id,
            page: "",
            pageSize: "",
            filterKey: "",
            filterValue: "",
          },
        })
        this.props.dispatch({
          type: LedgerType+'/othershowModal',
          payload:{
            code:code
          }
        })
      }


    }
    const otherProps = {
      dispatch,
      otherVisible,
      otherModalList,
      code,
      queryData,
      visible: otherVisible,
      title: '过滤',

      onOk (data) {
        dispatch({
          type:'CustomReportQuery/querySuccess',
          payload: {
            filtersData:data,
          },
        })
        dispatch({
          type: 'CustomReportQuery/otherhideModal',
        })
      },
      onCancel () {
        dispatch({
          type: 'CustomReportQuery/otherhideModal',
        })
      },
    }
    const dateProps = {
      dispatch,
      dateVisible,
      dateModalList,
      code,
      visible: dateVisible,
      title: '过滤',

      onOk (data) {
        dispatch({
          type:'CustomReportQuery/querySuccess',
          payload: {
            //dimensionValue:data,
          },
        })
        dispatch({
          type: 'CustomReportQuery/hideModal',
        })
      },
      onCancel () {
        dispatch({
          type: 'CustomReportQuery/hideModal',
        })
      },
    }
    const { src } = this.state
    const handleSubmit = (e) => {
      if(filtersData){
       if(filtersData.length>0){
         filtersData.map((item)=>{
           filedslist[item.code] =item.name
         })
       }
      }
      let fileds = queryString.stringify(filedslist)
      if(this.state.pdate){
        if(fileds !=='' &&this.state.pdate.length>0){
          let pd = this.state.pdate.map((item)=>{
            let o = {
              code:item.code,
              date:item.date,
            }
            return o
          })
          this.setState({
            src:queryUrl+this.props.location.search.substring(1)+"?"+fileds+"&"+pd[0].code+"="+pd[0].date+"&"+"&t="+new Date().getTime()
          })
        }else {
          message.warning('过滤条件均不能为空')
        }
      }
    }

    console.log("src:",src)

    const tagDimensionList = this.state.data.map((item,key)=>(<Tag color="#1890ff" key={item.key}>{item.title} <Icon type="search" style={{color: '#eee'}} onClick={()=> changeFilter(item.key,item.type,item.code)} /></Tag>))
    /*报表title 截取最后一个"/"后面的字符串*/
    let arg = (this.props.location.search.substring(1)).split("\/");
    let titleName = arg[arg.length-1];
    let title = decodeURI(titleName)
    document.title = title
    const frameHeight =window.document.body.offsetHeight-110
    return(
        <div className={styles.divbackground}>
          <Form layout="inline">
            <section className={styles.topbtn}>
              <FormItem style={{ marginLeft:'15px',marginTop:'0px' }}>
                <Tooltip placement="bottomLeft"  title="执行">
                  <Button icon="play-circle" size="small" style={{ color:'#1890ff' }} onClick={()=>handleSubmit()}  />
                </Tooltip>
              </FormItem>
              {/*<FormItem style={{ marginLeft:'0px',marginTop:'0px' }}>
                <Tooltip placement="bottomLeft" title="下载">
                  <Button icon="download" size="small" style={{ color:'#1890ff' }}   />
                </Tooltip>
              </FormItem>*/}
            </section>

            <div id="topTable">
              <Row style={{marginTop:'0px'}}>
                <div className={styles.filtercss}>
                  <div className={styles.filtercss1}>
                    <p className={styles.ptext}><span>维度</span></p>
                  </div>
                  <Row style={{marginLeft:'70px',marginTop:'5px'}}>
                    {tagDimensionList}
                  </Row>
                </div>
              </Row>
            </div>
            <Row >
              <Col span={24}>
                {/*<Report spinning={this.state.loading} />*/}
                <table cellSpacing="0" cellPadding="0" width="100%" border="0" align="center">
                  <tbody>
                  <tr>
                    <td width="100%">
                      <iframe id="myframe"  frameBorder="1"  src={src}  style={{ backgroundColor:'white' }} width="100%" height={frameHeight} marginWidth="0" marginHeight="0"  ></iframe>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </Form>
          <DateFilter {...dateProps} />
          <OtherFilter {...otherProps} />
        </div>
    )
  }

}
export default connect(({ CustomReportQuery,app, loading }) => ({ CustomReportQuery, app,loading }))(Form.create()(CustomReportQuery))
