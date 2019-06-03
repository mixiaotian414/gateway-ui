import { Table, Input, Icon, Button, Popconfirm ,message,Select,TimePicker,DatePicker,Modal,Checkbox} from 'antd';
import React,{ Component } from 'react'
import classnames from 'classnames'
import styles from './EditableTable.less'
import moment from 'moment';

import { DropOption } from 'components'
import lodash from 'lodash'
import { request } from 'utils'
const { Option } = Select;
const {
  confirm,
} = Modal
class EditableCell extends Component {
  state = {
    value: this.props.value,
    editable: false,
  }
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value });
  }

  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }
  edit = () => {
    this.setState({ editable: true });
  }
  render() {
    const { value, editable } = this.state;
    return (
      <div className={classnames(styles['editable-cell'] )}>
        {
          editable ?
            <div className={classnames(styles['editable-cell-input-wrapper'] )}>
              <Input
                value={value}
                onChange={this.handleChange}
                style={{ width: 80 }}
                onPressEnter={this.check}
                onBlur={this.check}
              />

              <Icon
                type="check"
                className={classnames(styles['editable-cell-icon-check'] )}
                onClick={this.check}
              />
            </div>
            :
            <div className={classnames(styles['editable-cell-text-wrapper'] )} >
              {value || ' '}
              {this.props.eSave?<Icon
                type="edit"
                className={classnames(styles['editable-cell-icon'] )}
                onClick={this.edit}
              />:null}
            </div>
        }
      </div>
    );
  }
}
class EditableSelectCell extends Component {
  state = {
    value: this.props.value,
    editable: false,
  }

  componentDidMount() {
    const {value,UsageDate=[]} =this.props
   /* console.log(UsageDate,value,"select")*/

    let obj=lodash.find(UsageDate, {'dictValue':value} )
    if (obj){
    let showName=obj.dictName
    /*console.log(showName,"showName")*/
    this.setState({ showName });
   }
  }

  componentWillReceiveProps(props) {
    const {value,UsageDate=[]} =props
   /* console.log(UsageDate,value,"select")*/
    /*   console.log(UsageDate,"UsageDate")*/
    let obj=lodash.find(UsageDate, {'dictValue':value} )
    if (obj){
      let showName=obj.dictName
     /* console.log(showName,"showName")*/
      this.setState({ showName });
    }
  }

  handleSelectChange = (value,option) => {
    let showName=option.props.children
    this.setState({ value,showName });

  }
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }
  edit = () => {
    this.setState({ editable: true });
  }
  render() {
    const { value, editable ,showName} = this.state;
    //用途下拉项
    const UsageDate = this.props.UsageDate ? this.props.UsageDate : []
    const UsageDateOptions = UsageDate.map(tmp => <Select.Option key={tmp.dictValue} value={tmp.dictValue}>{tmp.dictName}</Select.Option>);
    return (
      <div className={classnames(styles['editable-cell'] )}>
        {
          editable ?
            <div className={classnames(styles['editable-cell-input-wrapper'] )}>

              <Select
                value={value}
              /*  mode="combobox"*/

                style={{ width: 80 }}
                placeholder="选择用途"
                optionFilterProp="children"
                onChange={this.handleSelectChange}
                onBlur={this.check}
              >
                {UsageDateOptions}
              </Select>
              <Icon
                type="check"
                className={classnames(styles['editable-cell-icon-check'] )}
                onClick={this.check}
              />
            </div>
            :
            <div className={classnames(styles['editable-cell-text-wrapper'] )} >
              {showName || ' '}
              {this.props.eSave?
              <Icon
                type="edit"
                className={classnames(styles['editable-cell-icon'] )}
                onClick={this.edit}
              />:null}
            </div>
        }
      </div>
    );
  }
}

class SelectDimensionCell extends Component {
  state = {
    value: this.props.value,
    editable: false,
  }

  componentDidMount() {
    const {value,UsageDate=[]} =this.props
  /*  console.log(UsageDate,value,"select")*/
    /*   console.log(UsageDate,"UsageDate")*/
    let obj=lodash.find(UsageDate, {'id':value} )
    if (obj){
      let showName=obj.dimensionName
   /*   console.log(showName,"showName")*/
      this.setState({ showName });
    }
  }

  componentWillReceiveProps(props) {
    const {value,UsageDate=[]} =props
    /*console.log(UsageDate,value,"select")*/
    /*   console.log(UsageDate,"UsageDate")*/
    let obj=lodash.find(UsageDate, {'id':value} )
    if (obj){
      let showName=obj.dimensionName

     /* console.log(showName,"showName")*/
      this.setState({ showName });
    }
  }

  handleSelectChange = (value,option) => {
    let showName=option.props.children
    let dimensionType=option.props.dimensionType
    this.setState({ value,showName,dimensionType });

  }
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value,this.state.dimensionType);
    }
  }
  edit = () => {
    this.setState({ editable: true });
  }
  render() {
    const { value, editable ,showName} = this.state;
    //用途下拉项
    const UsageDate = this.props.UsageDate ? this.props.UsageDate : []
    const UsageDateOptions = UsageDate.map(tmp => <Select.Option key={tmp.id} value={tmp.id} dimensionType={tmp.dimensionType}>{tmp.dimensionName}</Select.Option>);
    return (
      <div className={classnames(styles['editable-cell'] )}>
        {
          editable ?
            <div className={classnames(styles['editable-cell-input-wrapper'] )}>

              <Select
                value={value}
                /*  mode="combobox"*/

                style={{ width: 80 }}
                placeholder="选择用途"
                optionFilterProp="children"
                onChange={this.handleSelectChange}
                onBlur={this.check}
              >
                {UsageDateOptions}
              </Select>
              <Icon
                type="check"
                className={classnames(styles['editable-cell-icon-check'] )}
                onClick={this.check}
              />
            </div>
            :
            <div className={classnames(styles['editable-cell-text-wrapper'] )} >
              {showName || ' '}
              {this.props.eSave?<Icon
                type="edit"
                className={classnames(styles['editable-cell-icon'] )}
                onClick={this.edit}
              />:null}
            </div>
        }
      </div>
    );
  }
}

class EditableSelectTimeCell extends Component {
  state = {
    value: this.props.value,
    editable: false,
  }

  handleSelectChange = (value,option) => {

    this.setState({ value });
  }
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }
  edit = () => {
    this.setState({ editable: true });
  }
  render() {
    const { value, editable } = this.state;
    return (
      <div className={classnames(styles['editable-cell'] )}>
        {
          editable ?
            <div className={classnames(styles['editable-cell-input-wrapper'] )}>

              <Select
                value={value}
                size="large"
                style={{ width: 120 }}
                placeholder="请选择时间"
                optionFilterProp="children"
                onChange={this.handleSelectChange}

              >
                <Option value="9:00-11:00">9:00-11:00</Option>
                <Option value="11:00-13:00">11:00-13:00</Option>
                <Option value="13:00-15:00">13:00-15:00</Option>
                <Option value="15:00-17:00">15:00-17:00</Option>
              </Select>
              <Icon
                type="check"
                className={classnames(styles['editable-cell-icon-check'] )}
                onClick={this.check}
              />
            </div>
            :
            <div className={classnames(styles['editable-cell-text-wrapper'] )} >
              {value || ' '}
              <Icon
                type="edit"
                className={classnames(styles['editable-cell-icon'] )}
                onClick={this.edit}
              />
            </div>
        }
      </div>
    );
  }
}

class EditableDateCell extends Component {
  state = {
    value: this.props.value,
    editable: false,
  }


  handleSelectChange = (value, dateString) => {
    /*console.log(  console.log('Selected Time: ', dateString));
   */
    this.setState({ value:dateString });
  }
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }
  handleOpen = (value) => {

   //console.log(value)
  }
  edit = () => {
    this.setState({ editable: true });
  }
  range=(start, end)=> {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }
  disabledDateTime=()=>{
    return {
      disabledHours: () => [0,1,2,3,4,5,6,7,8,10,12,14,16,17,18,19,20,21,22,23],
      disabledMinutes: () => this.range(1, 60),

    };
  }
  disabledDate=(current)=> {
    // Can not select days before today and today

    let endtime = new Date(Date.now() + 30 * 24 * 3600 * 1000)
    let startdata=new Date(Date.now() - 1* 24 * 3600 * 1000)


    return (current && current.valueOf() < Date.now()) ||current>endtime;
  }
  render() {
    const { value, editable } = this.state;
    return (
      <div className={classnames(styles['editable-cell'] )}>
        {
          editable ?
            <div className={classnames(styles['editable-cell-input-wrapper'] )}>

             {/* <DatePicker
                disabledDate={this.disabledDate}
                disabledTime={this.disabledDateTime}
                onChange={this.handleSelectChange}
                style={{ width: 150 }}
                placeholder="请选择日期"
                format="YYYY-MM-DD HH:00"
                showToday={false}
                allowClear={false}
                onOk={()=>{message.info("所选预约时间两个小时之内转账")}}
                showTime={{ format: 'HH:mm',

                  hideDisabledOptions:true,}}
              />*/}
              <DatePicker
                disabledDate={this.disabledDate}
                style={{ width: 120 }}
                format="YYYYMMDD"
                onChange={this.handleSelectChange}   />
              <Icon
                type="check"
                className={classnames(styles['editable-cell-icon-check'] )}
                onClick={this.check}
              />
            </div>
            :
            <div className={classnames(styles['editable-cell-text-wrapper'] )} >
              {value || ' '}
              <Icon
                type="edit"
                className={classnames(styles['editable-cell-icon'] )}
                onClick={this.edit}
              />
            </div>
        }
      </div>
    );
  }
}


class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      selectedRowKeys: [],
      dataType: [],
      fieldType: [],
      DIMENSION_TYPE: [],
    }
  }



  handleMenuClick = (record, e) => {
    if (e.key === '1') {
      confirm({
        title: '确定删除吗?',
        okText: "是",
        cancelText: "否",
        onOk() {
         /* deleteIndex(record)*/
        },
      })


    }
  }

  componentDidMount() {
    const {selectModelType,eSave}=this.props
   //console.log(eSave,"eSave")
    const dataSource = [...this.props.modalDataSource];
    /*    console.log(dataSource,"props")*/
    let selectedRowKeys=[]

    if(selectModelType){//如果是总账或者普通指标 默认全部选中
      if(dataSource.length>0){//选中的改变eAvailable为true
        for (let i=0;i<dataSource.length;i++){
          selectedRowKeys.push(dataSource[i].tableColumn)
        }
      }

    }else{

      if(dataSource.length>0){//选中的改变eAvailable为true
        for (let i=0;i<dataSource.length;i++){
          if(  dataSource[i]['eAvailable'] === true){
            selectedRowKeys.push(dataSource[i].tableColumn)
          }

        }
      }
    }

    this.setState({ dataSource,selectedRowKeys });

    this.fetch("dataType")//数据类型
    this.fetch("fieldType")//字段
    this.fetchDIMENSION_TYPE("DIMENSION_TYPE")//维度类型
  }
  fetch=(str)=>{
    this.promise = request({
      url:"gateway/secdictselect.json",
      method: 'post',
      data: {
        appId: "1",
        dictCode: str,
      },
    }).then((result) => {
      if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
        return
      }
      if (result.RSP_BODY) {

        const dictList =result.RSP_BODY.dictList

        this.setState({
          [str]:dictList
        })
      }
    })
  }
  fetchDIMENSION_TYPE=()=>{
    this.promise = request({
      url:"gateway/dimensionlist.json",
      method: 'post',
      data: {
        type: "",
        dimensionName: "",
        dimensionType: "",
        page: "",
        pageSize: "",
      },
    }).then((result) => {
      if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
        return
      }
      if (result.RSP_BODY) {

        const dictList =result.RSP_BODY.dimensionList

        this.setState({
          DIMENSION_TYPE:dictList
        })
      }
    })
  }

  componentWillReceiveProps(props) {

    const {selectModelType}=props
    const dataSource = [...props.modalDataSource];
/*    console.log(dataSource,"props")*/
    let selectedRowKeys=[]

    if(selectModelType){//如果是总账或者普通指标 默认全部选中
      if(dataSource.length>0){//选中的改变eAvailable为true
        for (let i=0;i<dataSource.length;i++){
           dataSource[i]['eAvailable'] = true
            selectedRowKeys.push(dataSource[i].tableColumn)
        }
      }

    }else{

      if(dataSource.length>0){
        for (let i=0;i<dataSource.length;i++){
          if(  dataSource[i]['eAvailable'] === true){
            selectedRowKeys.push(dataSource[i].tableColumn)
          }

        }
      }
    }

   //console.log(selectedRowKeys,"selectedRowKeys")
    this.setState({ dataSource,
      selectedRowKeys });
  }

  onTypeCellChange = (index, key) => {

    return (value,dimensionType) => {
     //console.log(value,"value")
     //console.log(dimensionType,"dimensionDateType")
      let dimensionDateType=dimensionType//是否是日期维度1是，0否
      const dataSource = [...this.state.dataSource];
      dataSource[index][key] = value;
      dataSource[index].dimensionDateType = dimensionDateType;
      /*this.setState({ dataSource });*/
      this.props.onChange(dataSource)
    };
  }


  onCellChange = (index, key) => {

    return (value) => {
     //console.log(value,"value")
      const dataSource = [...this.state.dataSource];
      dataSource[index][key] = value;
      /*this.setState({ dataSource });*/
      this.props.onChange(dataSource)
    };
  }


  onDelete = (index) => {
    const dataSource = [...this.state.dataSource];
    dataSource.splice(index, 1);
    this.setState({ dataSource });
  }
  contains=(arr, obj)=> {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) {
        return true;
      }
    }
    return false;
  }

  toModalConfirm=()=>{
    let selectedRowsValue=this.state.selectedRows?this.state.selectedRows:[];

      if (selectedRowsValue                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           .length===0){
        { message.info('请选择至少一条提交');
          return }
      }


     for (var objs of selectedRowsValue )
    {

      let dataIndexArray=[]
      for (var column of this.columns){
        dataIndexArray.push(column.dataIndex)
      }
      this.contains(dataIndexArray,'order_date')?dataIndexArray.splice(dataIndexArray.indexOf('order_date'.toString()),1):''
      this.contains(dataIndexArray,'order_time')?dataIndexArray.splice(dataIndexArray.indexOf('order_time'.toString()),1):''
     //console.log('dataIndexArray',dataIndexArray)

      for (var obj in objs ) {
       if(!(obj==="order_date"||obj==="order_time"||obj==="use_num")){
       if (!objs[obj]){
        //console.log("没进的是哪个",obj)
         message.info('请检查所选列是否全部填写提交');
         return
       }
         this.contains(dataIndexArray,obj)?dataIndexArray.splice(dataIndexArray.indexOf(obj.toString()),1):''
      }


     }
     //console.log('dataIndexArray',dataIndexArray)
      if (dataIndexArray.length>0){
        message.info('请检查所选列是否全部填写并且✔');
        return
      }


    }

   //console.log(selectedRowsValue)
  /* this.props.toModalConfirm(selectedRowsValue)*/


  }

  render() {

    const {dataSource,dataType,fieldType,DIMENSION_TYPE,selectedRowKeys} =this.state
    const columns = [{
      title: '字段名',
      dataIndex:"tableColumn",
      key:"tableColumn",

    },{
      title: '中文名称',
      dataIndex:"tableColumnName",
      key:"tableColumnName",
      render: (text, record, index) => (
        <EditableCell
          value={text}
          eSave={this.props.eSave}
          onChange={this.onCellChange(index, 'tableColumnName')}
        />
      ),
    },{
      title: '数据类型',
      dataIndex:"tableColumnType",
      key:"tableColumnType",
      render: (text, record, index) => (
        <EditableSelectCell
          value={text}
          eSave={this.props.eSave}
          onChange={this.onCellChange(index, 'tableColumnType')}
          UsageDate={dataType}
        />
      ),

    },
      {
        title: '字段类型',
        dataIndex:"fieldType",
        key:"fieldType",
        render: (text, record, index) => (
          <EditableSelectCell
            value={text}
            eSave={this.props.eSave}
            onChange={this.onCellChange(index, 'fieldType')}
            UsageDate={fieldType}
          />
        ),
      },
      {
        title: '维度类型',
        dataIndex:"dimensionType",
        key:"dimensionType",
        render: (text, record, index) => (
          <SelectDimensionCell
            value={text}
            eSave={this.props.eSave}
            onChange={this.onTypeCellChange(index, 'dimensionType')}
            UsageDate={DIMENSION_TYPE}
          />
        ),
      },/*{
        title: '聚合类型',
        dataIndex:"aggregateType",
        key:"aggregateType",
        render: (text, record, index) => (
          <EditableSelectCell
            value={text}
            onChange={this.onCellChange(index, 'aggregateType')}
            UsageDate={DIMENSION_TYPE}
          />
        ),

      },*/{
        title: '长度',
        dataIndex:"tableColumnLength",
        key:"tableColumnLength",
        align:"left",

      },{
        title: '精度',
        dataIndex:"tableColumnPrecision",
        key:"tableColumnPrecision",
        align:"left",

      },{
        title: '可空',
        dataIndex:"eNull",
        key:"eNull",
        render: (text, record, index) => (
          <Checkbox checked={text}/>
        ),

      },{
        title: '主键',
        dataIndex:"ePrimaryKey",
        key:"ePrimaryKey",
        render: (text, record, index) => (
          <Checkbox checked={text}/>
        ),
      },
    /*  {
        title: '操作',
        dataIndex: 'operate',
        key:"operate",
        render: (text, record) => {
          return <DropOption onMenuClick={e => this.handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '删除' } ]} />
        },
      }*/];



    const rowSelection = {
        selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
       //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        const dataSource = [...this.state.dataSource];

        if(dataSource.length>0){//选中的改变eAvailable为true
          for (let i=0;i<dataSource.length;i++){
            if(selectedRowKeys.indexOf( dataSource[i].tableColumn)>-1)
            dataSource[i]['eAvailable'] = true
            else {
              dataSource[i]['eAvailable'] = false
            }
          }
        }



        this.setState({selectedRows });
        this.props.onChange(dataSource)
       /* this.props.tosave(selectedRows)*/
      },
      getCheckboxProps: record => ({
        disabled: this.props.selectModelType||!this.props.eSave, // Column configuration not to be checked
      /*  checked: (record.eAvailable),*/
      }),
    };

    return (
      <div>
        <Table
          rowKey={record => record.tableColumn}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          rowSelection={rowSelection}
          loading={this.props.confirmLoading}
          style={{marginTop:'10px'}}
        />

      </div>
    );
  }
}


export  default  EditableTable
