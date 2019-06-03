import React from 'react'
import PropTypes from 'prop-types'
import lodash from 'lodash'
import { Button,message} from 'antd';
import classnames from 'classnames'
import { request } from 'utils'
import IndexCard from './IndexCard'
import DragSortingTable from './DragSortingTable'
import styles from './TransferSelect.less';


/**
 * @Title:报表管理》自定义指标》穿梭框组件
 * @Param:
 *
 * @Description:
 * @Author: mxt
 * @Time: 2018/3/22
 * @UpdateTime: 2018/4/17
 * @UpdateContent: 自定义穿梭框
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
class TransferSelect extends React.Component {
  state = {
    //树组件选中的data
    tableData:[],
    //已选框内存在的data
    data:[],
    //是否指标树选中指标提交
    isSubmit:false,
    //已选框内删除的指标主键
    deleteKeys:undefined,

    //初始Key,控制树形不可选
    initKeys:undefined,
  }
  componentDidMount() {
    const {onChange}=this.props
    const data=this.props.value||[]

    let initKeys=[]

      data.map((index)=>{
      initKeys.push(index.key)
    })
    //避免修改时，如果不拖拽 就会以对象的时候保存，产生报错

    this.setState({
      data:data,
      initKeys:initKeys,
    })

  }
  render() {

    const {value,onChange}=this.props

    const handleRight=()=>{
      //就算所有拦截都错过了，也可以用取并集来防止重复选择指标，这是最后一道防线
      //当然也可以用取数组交集的方式，来警告用户哪一个指标重复了
      const uniondata=lodash.uniqBy([...this.state.data,...this.state.tableData],'key')
      //getFieldDecorator提供的受控方法
      onChange(uniondata)

      this.setState({
        tableData:[],
        data:uniondata,
        isSubmit:true
      })
    }

    const DragTableProps={
      todrag:(data)=>{
        this.setState({data})
        onChange(data)
      } ,

      data:this.state.data,
      todeleteKey:(deleteKeys)=>{
        let data1=lodash.remove(this.state.data,(value)=>{return value.key!=deleteKeys});
        this.setState({
          data:data1
        })
        onChange(data1)
        this.setState({deleteKeys})
      }
    }
    const indexCardProps={
      //获取指标树选中的指标，将数据处理成table格式
      getTreeData:(checkedKeys,info)=>{
        const tableData=info.checkedNodes.map(data=>{
          return {
            'key':data.key,
          /*  'name':data.props.title,*/
            'name':data.key,
            'title':data.props.title
          }
        })
        this.setState({
          tableData:tableData
        })
      },
      onListSelect:(value)=>{
        const ListSelectData={
          'key':value.code,
          /*  'name':data.props.title,*/
          'name':value.code,
          'title':value.name
        }
        //并集
        const uniondata=lodash.uniqBy([...this.state.data,ListSelectData],'key')
        onChange(uniondata)
        this.setState({
          data:uniondata,
        })
      },
      isSubmit:this.state.isSubmit,
      clearDone:()=>{this.setState({isSubmit:false})},
      deleteKeys:this.state.deleteKeys,
      deleteDone:()=>{this.setState({deleteKeys:undefined})},
      initKeys:this.state.initKeys,
      initDone:()=>{this.setState({initKeys:undefined})}

    }
    return (
      <div className={styles.configMain}>
        <div  className={classnames(styles["ant-transfer"])}>
          <div  style={{width:" 250px", height:" 300px"}} className={classnames(styles["ant-transfer-list"],styles["ant-transfer-list-with-footer"])}>
            <div  className={classnames(styles["ant-transfer-list-header"])}>
              <span className={classnames(styles["ant-transfer-list-header-selected"])}>指标树
              </span>
              <span className={classnames(styles["ant-transfer-list-header-title"])}>待选</span>
            </div>
            <div  className={classnames(styles["ant-transfer-list-body"])}>

            <ul  className={classnames(styles["ant-transfer-list-content"])}>
                <IndexCard {...indexCardProps}/>
            </ul>
            <div  className={classnames(styles["ant-transfer-list-body-not-found"])}>Not Found</div>
          </div>

        </div>
        <div  className={classnames(styles["ant-transfer-operation"])}>

          <Button disabled="" type="button"
                  onClick={(e)=>{handleRight(e)}}  className={classnames(styles["ant-btn"],styles["ant-btn-primary"],styles["ant-btn-sm"])}><i
            className={classnames(styles["anticon"],styles["anticon-right"])}></i><span>&gt;</span></Button>

        </div>
        <div  style={{width:" 250px", height:" 300px"}} className={classnames(styles["ant-transfer-list"],styles["ant-transfer-list-with-footer"])}>
          <div  className={classnames(styles["ant-transfer-list-header"])}>
              <span className={classnames(styles["ant-transfer-list-header-selected"])}>列表(可拖拽排序)
              </span>
            <span className={classnames(styles["ant-transfer-list-header-title"])}>已选</span>
          </div>
          <div  className={classnames(styles["ant-transfer-list-body"])}>
          <ul  className={classnames(styles["ant-transfer-list-content"])}>
              <DragSortingTable {...DragTableProps}/>
          </ul>
          <div  className={classnames(styles["ant-transfer-list-body-not-found"])}>Not Found</div>
        </div>

      </div>
  </div>



      </div>
    );
  }
}

TransferSelect.propTypes = {
  /*form: PropTypes.object,
  fetchData: PropTypes.string,*/
}

export default TransferSelect
