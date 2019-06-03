import React,{Component} from 'react'
import { Page } from 'components'
import { Row, Col,Form,Icon,Tag,message,Button,Tooltip } from 'antd'
import styles from '.././index.less'
import { request } from 'utils'
/**
 * @Title:指标查询=》筛选组件（指标，维度）
 * @Description:子组件
 * @Author: chenshuai
 * @Time: 2019/4/10
 * @Version 1.0
 * @Copyright: Copyright (c) 2019 .DHCC
 */
const FormItem = Form.Item
const CheckableTag = Tag.CheckableTag;
let mapids = new Map()
class Filter extends Component{

  state={
    selectedIds: [],//维度id集合
    selectedNames: [],//维度名称集合
    dimensionList:[],
    columnsname:[],//动态table列名
    selectIndexIds:[],//指标id集合
    filterId:"",//维度id
    dimensionType:"",//维度类型
    dimensionId:"",
    filters:{},
    dataList:{}
  }
  componentDidMount = () => {
    mapids.clear()
  }

  componentWillReceiveProps =(nextProps)=>{
    if(this.props.filtersData.length ===0){
      mapids.clear()
      this.setState({
        selectIndexIds:[],
        selectedIds:[],
      })
    }
    let datakey = ["curr","org","date","index"]
    let datatitle = ["币种","机构","日期","总账指标"]
    if(nextProps.dimensionList && nextProps.filtersData){
      if(nextProps.dimensionList.length >0 && nextProps.filtersData.length >0){
        let columnName = [];//动态table列名
        let objname = [];//维度名称集合
        let objid = [];//维度id集合
        let indexids = []; //指标id集合
        nextProps.dimensionList.map((item)=>{
          objname.push(item.dimensionName)
          objid.push(item.id)
          //columnName.push(item.dimensionName)
        })
        /*判断标签是否被点击 更新数据*/
        if(nextProps.selectdata.length>0){
          this.setState({
            selectedNames:nextProps.selectdata,
            selectedIds:nextProps.selectdataid,
          })
          nextProps.selectdata.map((item)=>{
            columnName.push(item)
          })
        }else {
          this.setState({
            selectedNames:objname,
            selectedIds:objid,
          })
          nextProps.dimensionList.map((item)=>{
            columnName.push(item.dimensionName)
          })
        }
        nextProps.filtersData.map((item)=>{
          columnName.push(item.title)
          indexids.push(item.propertiesId)
        })
        this.setState({
          //selectedIds:objid,
          //selectedNames:objname,
          dimensionList:this.props.dimensionList,
          columnsname:columnName,
          selectIndexIds:indexids,
        })
      }
    }else {
      this.setState({
        //selectedDimension:obj,
        selectedNames:[],
        dimensionList:[],
        selectedIds:[],
        columnsname:[],
        selectIndexIds:[],
      })
    }
  }

  render(){
    const { LedgerType,toSubmit,onSelectColumnsName,onOpenCollectionModal,onSelectIndexIds,collectionSelectedKeys,keyData,onOpenExport } = this.props
    const { dimensionList,selectedNames,selectedIds,columnsname,selectIndexIds } = this.state;
    //console.log("维度名称:",selectedNames)
    //console.log("维度id:",selectedIds)
    //console.log("指标id:",selectIndexIds)
    const handleChange=(name, checked,id,type)=> {
      if(type !=='1'){ //type 0:非日期维度，1:日期为度（日期维度必须存在，不能点灭）
        const dimensionName = checked
          ? [...selectedNames, name]
          : selectedNames.filter(t => t !== name);
        const dimensionIds = checked
          ? [...selectedIds, id]
          : selectedIds.filter(t => t !== id);

        this.setState({
          selectedNames: dimensionName,
          selectedIds:dimensionIds,
          filterId:id,
        });
        this.props.onSelectDimension(dimensionName)
        this.props.onSelectDimensionid(dimensionIds)
      }
    }

    const changeFilter =(id,dimensionType)=>{

      /***
       *  判断标签是否点亮，（如果没点亮，不弹出过滤框）
          selectedIds：指标id集合
          id:点击的指标id
       */
      if(selectedIds.indexOf(id) >-1){
        this.props.dispatch({
          type:LedgerType+'/filterModalData',
          payload: {
            id:id,
            page: "",
            pageSize: "",
            filterKey: "",
            filterValue: "",
          },
        })
        this.setState({
          dimensionId:id
        })
        const params ={
          id:id,
          type:dimensionType,
          modalType:'update'
        }
        this.props.dispatch({
          type:LedgerType+'/querySuccess',
          payload: {
            targetKeys:[],
          },
        })
        this.props.onOpenFilter(params)
      }
    }

    //指标收藏
    const collection =()=>{
      if(collectionSelectedKeys.length>0){
        if(keyData.id ==='-1'){//id为-1 是报表根目录
          message.warning('您当前选择的为根目录，请重新选择收藏目录')
        }else if(keyData.type ==='1'&&keyData.id !=='-1'){ //type =1 为目录，2为报表
          onOpenCollectionModal()
          onSelectIndexIds(selectIndexIds)
        }else {
          message.warning('您当前选择的为报表，请选择收藏目录')
        }
      }else {
        message.warning('请选择收藏目录')
      }
    }

    const handleFields = (fields) => {
      //console.log("维度id集合:",this.state.selectedIds)
      //console.log("指标id集合:",this.state.selectIndexIds)
      let data = {}
      /*如果dimensionValue.length ===0（说明过滤框里没值，这时清空mapids）*/
      if(this.props.dimensionValue.length ===0){
        mapids.clear()
      }
      for(let i = 0;i<this.state.selectedIds.length;i++){
        //data["dimension"+this.state.selectedIds[i]]=[]
        if(this.props.dimensionValue.length>0){
          this.props.dimensionValue.map((item)=>{
            if(this.state.selectedIds[i] === item.id){
              //data["dimension"+this.state.selectedIds[i]]=item.value
              mapids.set(this.state.selectedIds[i],item.value)
            }else {
              //data["dimension"+this.state.selectedIds[i]]=[]
              //mapids.set(data["dimension"+this.state.selectedIds[i]],item.value)
            }
          })
        }
      }
      if(mapids.size>0){
        for(let i of mapids){
          data["dimension"+i[0]]=i[1]
        }
      }else {
        data ={}
      }
      //console.log("data:",(JSON.stringify(data) === "{}"))
      let changefields={
        ...this.props.formValues,
        productIds:JSON.parse('['+this.state.selectIndexIds+']'),
        dimensionIds:JSON.parse('['+this.state.selectedIds+']'),
        ...data,
      };
     //console.log("changefields:",changefields)
      /*将所有参数(不包括formValues)通过onChangeFileds() 方法 传递给列表*/
      let paramlist = {
        productIds:JSON.parse('['+this.state.selectIndexIds+']'),
        dimensionIds:JSON.parse('['+this.state.selectedIds+']'),
        ...data,
      }
      this.props.onChangeFileds(paramlist)
      return changefields
    }

    /**
     * 点击搜索按钮
     * */
    const handleSubmit = (e) => {
      e.preventDefault();
      onSelectColumnsName(columnsname)
      this.props.form.validateFields(function (err, fieldsValue) {
        const changefields = handleFields(fieldsValue)
        toSubmit(changefields)
      });
      return false;
    }
    //导出
    const download =(e)=>{
      if(this.props.filtersData&&this.props.dimensionList){
        if(this.props.filtersData.length>0&&this.props.dimensionList.length>0){
          let data = {}
          if(mapids.size>0){
            for(let i of mapids){
              data["dimension"+i[0]]=i[1]
            }
          }else {
            data ={}
          }
          let paramlist = {
            productIds:JSON.parse('['+this.state.selectIndexIds+']'),
            dimensionIds:JSON.parse('['+this.state.selectedIds+']'),
            ...data,
          }
          onOpenExport(paramlist)
        }else {
          message.warning('维度列表和指标列表不能为空')
        }
      }

    }

    //维度
    const tagDimensionList = this.props.dimensionList&&this.props.dimensionList.map((item,key)=> (
      <span key={item.dimensionName}>
        <CheckableTag
          key={item.dimensionName}
          checked={selectedNames.indexOf(item.dimensionName) > -1}
          onChange={checked => handleChange(item.dimensionName, checked, item.id,item.dimensionType)}
          style={{marginRight:0,borderTopRightRadius:0,borderBottomRightRadius:0,color: '#eee'}}
        >
          {item.dimensionName}
        </CheckableTag>
        <CheckableTag
          //key={item.id}
          checked={selectedNames.indexOf(item.dimensionName) > -1}
          style={{borderTopLeftRadius:0,borderBottomLeftRadius:0}}
        >
          <Icon type="search" style={{color: '#eee'}} onClick={()=> changeFilter(item.id,item.dimensionType)}/>
        </CheckableTag>
      </span>
    ))
    //指标
    const tagIndexList = this.props.filtersData&&this.props.filtersData.map((item,key)=>(
      <Tag key={item.title} color="#1890ff" >{item.title}</Tag>
    ))


    return(
      <div>
        <Form layout="inline" ref="form" onSubmit={handleSubmit}>
          <section className={styles.topbtn}>
            <FormItem style={{ marginLeft:'15px',marginTop:'5px' }}>
              <Tooltip placement="bottomLeft"  title="执行">
                <Button icon="play-circle" size="small" style={{ color:'#1890ff' }} htmlType="submit" loading={this.props.loading.effects['IndexQuery/query']} />
              </Tooltip>
            </FormItem>
            <FormItem style={{ marginLeft:'0px',marginTop:'5px' }}>
              <Tooltip placement="bottomLeft" title="下载">
                <Button icon="download" size="small" style={{ color:'#1890ff' }} onClick={()=>download()}  />
              </Tooltip>
            </FormItem>
            <FormItem style={{ marginLeft:'0px',marginTop:'5px' }}>
              <Tooltip placement="bottomLeft" title="收藏">
                <Button icon="star"  size="small" style={{ color:'#1890ff' }} onClick={()=>collection()}/>
              </Tooltip>
            </FormItem>
          </section>
        </Form>
        <Row style={{marginTop:'5px'}}>
          <div className={styles.filtercss}>
            <div className={styles.filtercss1}>
              <p className={styles.ptext}><span>维度</span></p>
            </div>
            <Row style={{marginLeft:'70px',marginTop:'5px'}}>
                {tagDimensionList}
            </Row>
          </div>
        </Row>
        <Row>
          <div className={styles.filtercss}>
            <div className={styles.filtercss1}>
              <p className={styles.ptext}><span>指标</span></p>
            </div>
            <Row style={{marginLeft:'70px',marginTop:'5px'}}>
              {tagIndexList}
            </Row>
          </div>
        </Row>
      </div>)
  }

}
export default Form.create()(Filter)
