import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Page } from 'components'
import queryString from 'query-string'
import { Row, Col,Form,Button,Table,Tabs,message,Modal,Card,Icon,Tree,Select,Tag } from 'antd'
import styles from './index.less'
import IndexTree from './components/IndexTree'
import CollectionTree from './components/CollectionTree'
import Filter from './components/Filter'
import TableList from './components/TableList'
import FilterModal from './components/FilterModal'
import CollectionModal from './components/CollectionModal'
import ExportModal from './components/ExportModal'
/**
 * @Title:指标库管理=》指标查询
 * @Description:父组件
 * @Author: chenshuai
 * @Time: 2019/4/9
 * @Version 1.0
 * @Copyright: Copyright (c) 2019 .DHCC
 */
const IndexQuery = ({
                         location, dispatch, IndexQuery, loading
                       }) => {
  location.query = queryString.parse(location.search)
  const TabPane = Tabs.TabPane;
  const {
    formValues,
    LedgerType,
    pagination,
    indexTreeData,
    dimensionList,
    collectionTreeData,
    collectionSelectedKeys,
    selectdata,
    keyData,
    filtersData,
    filterVisible,
    treeVisible,
    collectionModalVisible,
    currentItem,
    columnsName,
    dirItem,
    modalType,
    modalTreeType,
    dimensionparams,
    collectionModalType,
    getType,
    getReportType,
    selectIndexIds,
    checkedKeys,
    selectdataid,
    filterModalList,//过滤列表List
    dimensionType,//维度类型
    dimensionId,
    dimensionValue,//过滤后的维度值
    changefields,
    dataList,
    titleList,
    exportVisible,//控制导出模态框
    indexName,//收藏里的指标名称
    exportparams,//指标导出参数
    ...liststate
  } = IndexQuery

  /*列表参数*/
  const listProps={
    dispatch,
    /*namespace*/
    LedgerType,
    loading,
    ...liststate,
    formValues,
    columnsName,
    dataList,
    titleList,
    changefields,
    pagination,
    /*查询表单*/
    onTableChange:(params)=>{
      dispatch({
          type:LedgerType+'/querySuccess',
          payload:{formValues: {...formValues},}
        }
      )
      dispatch({
        type:LedgerType+'/query',
        payload: params,
      });
    },
    /*操作模态框*/
    changeModal:(data)=>{
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          modalVisible:data
        },
      })
    },
  }

  const indexTreeProps = {
    dispatch,
    LedgerType,
    //formValues,
    indexTreeData,
    filtersData,
    dimensionList,
    dimensionparams,
    selectdata,
    selectdataid,
    loading,
    collectionSelectedKeys,
    keyData,
    columnsName,
    selectIndexIds,
    checkedKeys,
    dimensionType,
    dimensionValue,//过滤后的维度值
    changefields,//指标查询参数
    exportparams,//指标导出参数
    onDimensionData (data){
      dispatch({
        type:LedgerType+'/indexdimension',
        payload: {
          id:data
        },
      })
    },
    onSelectDimension (data){
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          selectdata:data
        },
      })
    },
    onSelectDimensionid (data){
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          selectdataid:data
        },
      })
    },
    onAddFilters (data){
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          filtersData:data
        },
      })
    },
    onOpenFilter (data) {
      dispatch({
        type: LedgerType+'/showModal',
        payload: {
          modalType: 'create',
          dimensionType:data.type,
          dimensionId:data.id,
          currentItem: {},
        },
      })
    },
    toSubmit:(changefields)=>{
      /*dispatch({
          type: LedgerType+'/querySuccess',
          payload:{formValues: changefields,}
        }
      )*/
      dispatch({
        type:LedgerType+'/query',
        payload: changefields
      })
    },
    onOpenCollectionModal () {
      dispatch({
        type: LedgerType+'/showCollectionModal',
        payload: {
          modalType: 'create',
          currentItem: {},
        },
      })
    },
    onSelectColumnsName(data){
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          columnsName:data
        },
      })
    },
    onSelectIndexIds(data){
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          selectIndexIds:data
        },
      })
    },
    onCheckedKeys (data){
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          checkedKeys:data
        },
      })
    },
    //指标查询参数
    onChangeFileds (data){
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          changefields:data
        },
      })
    },
    onOpenExport (data) {
      dispatch({
        type: LedgerType+'/exportShowModal',
        payload: {
          exportparams: data,
        },
      })
    },

  }
  const collectionTreeProps = {
    modalTreeType,
    collectionTreeData,
    collectionSelectedKeys,
    filtersData,
    dispatch,
    LedgerType,
    indexName,
    item: modalTreeType === 'createDir' ? {} : dirItem,
    visible: treeVisible,
    title: `${modalTreeType === 'createDir' ? '目录新增' : '目录修改'}`,
    dimensionType:getType,
    onOpenDir () {
      dispatch({
        type: LedgerType+'/showModalTree',
        payload: {
          modalTreeType: 'createDir',
          currentItem: {},
        },
      })
    },
    onEditDirItem (item) {
      dispatch({
        type: LedgerType + '/showModalTree',
        payload: {
          modalTreeType: 'updateDir',
          dirItem: item,
        },
      })
    },
    //目录删除
    onDeleteItem (item) {
      dispatch({
        type: LedgerType + '/delDir',
        payload: {
          id: item,
        },
      })
    },
    //报表删除
    onDeleteReport (item) {
      dispatch({
        type: LedgerType + '/delReport',
        payload: {
          id: item,
        },
      })
    },
    onOk (data) {
      dispatch({
        type:LedgerType+`/${modalTreeType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: LedgerType+'/hideModalTree',
      })
    },
    onSelectKey (data){
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          collectionSelectedKeys:data
        },
      })
    },
    onSelectKeyData (data){
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          keyData:data
        },
      })
    },
  }
  const filterModalProps = {
    dispatch,
    modalType,
    LedgerType,
    formValues,
    filterModalList,
    dimensionList,
    filtersData,
    dimensionType,
    dimensionId,
    dimensionValue,
    item: modalType === 'create' ? {} : currentItem,
    visible: filterVisible,
    title: `${modalType === 'create' ? '过滤' : '过滤1'}`,

    onOk (data) {
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          dimensionValue:data,
        },
      })
      dispatch({
        type: LedgerType+'/hideModal',
      })
    },
    onCancel () {
      dispatch({
        type: LedgerType+'/hideModal',
      })
    },
  }
  const collectionModalProps = {
    getReportType,
    selectIndexIds,
    item: keyData,
    visible: collectionModalVisible,
    title: `指标收藏`,

    onOk (data) {
      dispatch({
        type:LedgerType+'/indexcollection',
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: LedgerType+'/hideCollectionModal',
      })
    },
  }
  const exportModalProps = {
    dispatch,
    LedgerType,
    indexName,
    exportparams,
    visible: exportVisible,
    title: `指标导出`,

    onOk (data) {
      dispatch({
        type:LedgerType+'/download',
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: LedgerType+'/exportHideModal',
      })
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          indexName:"",
          exportparams:{},
        },
      })
    },
  }
  /*点击切换页签时，清空上个页签的数据*/
  const onChangeTabs =(key)=>{
    if(key ==='1'){
      dispatch({
        type: LedgerType+'/querySuccess',
        payload:{
          filtersData:[],
          dimensionList:[],
          collectionSelectedKeys:[],
          checkedKeys:[],
          selectdata:[],
          selectdataid:[],
          dataList:[],
          titleList:[],
        }
      });
    }

  }


  return (
    <div className={styles.divbackground}>
      <Row gutter={24} >
        <Col lg={6} md={24}>
          <Tabs type="card" onChange={onChangeTabs} style={{ marginTop:'10px',marginLeft:'10px'}}>
            <TabPane tab="指标选择" key="1"  >
              <IndexTree  {...indexTreeProps} />
            </TabPane>
            <TabPane tab="指标收藏" key="2">
              <CollectionTree  {...collectionTreeProps} />
            </TabPane>
          </Tabs>
        </Col>
        <Col lg={18} md={24}>
          <Row>
            <Filter {...indexTreeProps}/>
          </Row>
          <Row style={{ marginTop:'10px',marginRight:'8px' }}>
            <TableList {...listProps}/>
          </Row>
        </Col>
      </Row>
      <FilterModal {...filterModalProps}/>
      <CollectionModal {...collectionModalProps}/>
      <ExportModal {...exportModalProps}/>
    </div>

  )
}

IndexQuery.propTypes = {
  DimensionsMgr: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ IndexQuery, loading }) => ({ IndexQuery, loading }))(IndexQuery)
