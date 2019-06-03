import { Table, Input, Icon, Button, Popconfirm ,message,Select,TimePicker,DatePicker,Modal,Checkbox} from 'antd';
import React,{ Component } from 'react'
import classnames from 'classnames'
import styles from './EditableTable.less'
import moment from 'moment';
const { Option } = Select;
import { DropOption } from 'components'
import lodash from 'lodash'
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
class EditableSelectCell extends Component {
  state = {
    value: this.props.value,
    editable: false,
  }

  componentDidMount() {
    const {value,UsageDate=[]} =this.props
   //console.log(UsageDate,"UsageDate")
    let obj=lodash.find(UsageDate, {'dictValue':value} )
    if (obj){
    let showName=obj.dictName
   //console.log(showName,"showName")
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
                size="large"
                style={{ width: 80 }}
                placeholder="选择用途"
                optionFilterProp="children"
                onChange={this.handleSelectChange}

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
    this.state={
      selectedRows:[],
      selectedRowKeys:undefined,
    }
    this.columns1 = [{
      title: '模板名称',
      dataIndex: 'model_name',
    }, {
      title: '付款方账号',
      dataIndex: 'pay_acc_no',
    }, {
      title: '付款方户名',
      dataIndex: 'pay_acc_name',
    }, {
      title: '收款方账户',
      dataIndex: 'rec_acc_no',
    }, {
      title: '收款方户名',
      dataIndex: 'rec_acc_name',
    }, {
      title: '*交易金额',
      width: '15%',
      dataIndex: 'tx_amt',
      render: (text, record, index) => (
        <EditableCell
          value={text}
          onChange={this.onCellChange(index, 'tx_amt')}
        />
      ),
    }, {
      title: '*用途',
      width: '13%',
      dataIndex: 'usage',
      render: (text, record, index) => (
        <EditableSelectCell
          value={text}
          onChange={this.onCellChange(index, 'usage')}
          UsageDate={props.UsageList}
        />
      ),
    }, {
      title: '预约转账日期',
      width: '17%',
      dataIndex: 'order_date',
      render: (text, record, index) => (
        <EditableDateCell
          value={text}
          onChange={this.onCellChange(index, 'order_date')}
        />
      ),
    } , {
      title: '预约转账时间',
      width: '17%',
      dataIndex: 'order_time',
      render: (text, record, index) => (
        <EditableSelectTimeCell
          value={text}
          onChange={this.onCellChange(index, 'order_time')}
        />
      ),
    }/*, {
      title: 'operation',
      dataIndex: 'operation',
      render: (text, record, index) => {
        return (
          this.props.dataSource.length > 1 ?
            (
              <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(index)}>
                <a href="#">Delete</a>
              </Popconfirm>
            ) : null
        );
      },
    }*/];

    this.columns = [{
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
          onChange={this.onCellChange(index, 'tableColumnType')}
          UsageDate={props.UsageList}
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
            onChange={this.onCellChange(index, 'fieldType')}
            UsageDate={props.UsageList}
          />
        ),
      },
      {
        title: '维度类型',
        dataIndex:"dimensionType",
        key:"dimensionType",
        render: (text, record, index) => (
          <EditableSelectCell
            value={text}
            onChange={this.onCellChange(index, 'dimensionType')}
            UsageDate={props.UsageList}
          />
        ),
      },{
        title: '聚合类型',
        dataIndex:"aggregateType",
        key:"aggregateType",
        render: (text, record, index) => (
          <EditableSelectCell
            value={text}
            onChange={this.onCellChange(index, 'aggregateType')}
            UsageDate={props.UsageList}
          />
        ),

      },{
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
        dataIndex:"isNull",
        key:"isNull",
        render: (text, record, index) => (
          <Checkbox checked={text}/>
        ),

      },{
        title: '主键',
        dataIndex:"isPrimaryKey",
        key:"isPrimaryKey",
        render: (text, record, index) => (
          <Checkbox checked={text}/>
        ),
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key:"operate",
        render: (text, record) => {
          return <DropOption onMenuClick={e => this.handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '删除' } ]} />
        },
      }];

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
    const dataSource = [...this.props.modalDataSource];
    this.setState({ dataSource });
  }

  onCellChange = (index, key) => {

    return (value) => {
      const dataSource = [...this.state.dataSource];
      dataSource[index][key] = value;
      this.setState({ dataSource });
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

      if (selectedRowsValue.length===0){
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
        if(objs.hasOwnProperty("order_date")&&objs.hasOwnProperty("order_time")){
          objs['order_flag']="OF01"
        }else{
          objs['order_flag']="OF02"
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

    const {dataSource} =this.state


    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
       //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
       this.setState({selectedRows});
        this.setState({selectedRowKeys});
        this.props.tosave(selectedRows)
      },
      getCheckboxProps: record => ({
        disabled: record.model_name === 'Disabled User', // Column configuration not to be checked
      }),
    };
    const columns = this.columns;
    return (
      <div>
        <Table
          rowkey={record => record.model_id}
          bordered
          dataSource={dataSource}
          columns={columns}
          rowSelection={rowSelection}
          style={{marginTop:'10px'}}
        />
        <div className={classnames(styles['but'])}>
          <Button type="primary" size="large" style={{width:'88px',margin:'0px 20px'}} onClick={this.toModalConfirm} >提交转账</Button>

        </div>
      </div>
    );
  }
}


export  default  EditableTable
