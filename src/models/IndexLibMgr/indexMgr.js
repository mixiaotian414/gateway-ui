/* eslint-disable quotes */
import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import * as indexMgrService from 'services/IndexLibMgr/indexMgr'
import { pageModel } from 'models/common'
import { message } from 'antd'
const { toupdate,query, queryid, queryPersonnel,indexpublish,del,add,update,updatetree,getIndexType,getFrequency,getunit,addModel,deleteModal } = indexMgrService

const LedgerType="IndexMgr"
export default modelExtend(pageModel,{
  namespace: 'IndexMgr',

  state: {
    list: [],//列表
    organTree: [],//树形
    item: [],
    LedgerType,
    queryPersonnellist: [],

    formValues:{
      page: 1,
      pageSize: 10
    },
    currentItem: {info:{},properties:{},dimList:[]},
    modalVisible: false,
    modalType: 'create',

    IndexTypeList:[],//指标类型
    FrequencyList:[],//数据周期
    unitList: [],//数据单位
    statisticsTypeList: [],//统计类型
    productFormatList: [],//数据格式
  },

  effects: {
    //树列表
    * query ({ payload }, { put, call,select }) {
      const { user } = yield select(_ => _.app)

      payload = {    id:"-1",
        productType:"",
        productCode:"",
        productAttribute:"",
        ...payload}
      const response = yield call(query,payload);
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          const orgtreeData = response.RSP_BODY.producttree;
          const mockdata=[{
            id: '-1',
            productCode: "",
            productName: "指标目录",
            productAttribute:"",
            productType:"",
            children:orgtreeData
          }]
          yield put({
            type: 'querySuccess',
            payload: {
              organTree: mockdata,
            }
          })
        }
      }
    },

    * delete ({ payload }, { select, call, put }) {
      const response = yield call(del, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          const {formValues} = yield (select(_ => _.IndexMgr))
          yield put({
            type: 'query',
            payload: formValues,
          })
          message.success('删除成功')
        }
      }
    },
    * add ({ payload,callback  }, { select, call, put }) {
      const response = yield call(add, payload)
      const{pid}=payload
      let queryParme={
        id: pid,
        productType:"",
        productAttribute:"dir",
        productCode:""
      }
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          message.success('添加成功')
          const responseb = yield call(query, queryParme)
          callback(responseb)
        }
      }
    },
    * toupdate ({ payload }, { select, call, put }) {
      const response = yield call(toupdate, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          console.log(response.RSP_BODY,"info")
          yield put({
            type: 'querySuccess',
            payload: {
              modalType: 'update',
              modalVisible: true,
              currentItem:response.RSP_BODY
            },
          })
        }
      }
    },
    * todetail ({ payload }, { select, call, put }) {
      const response = yield call(toupdate, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          console.log(response.RSP_BODY,"info")
          yield put({
            type: 'querySuccess',
            payload: {
              modalType: 'detail',
              modalVisible: true,
              currentItem:response.RSP_BODY
            },
          })
        }
      }
    },
    * update ({ payload }, { select, call, put }) {
      const response = yield call(update, payload)
      const{info:{productName}}=payload
      console.log(payload,"payload")
      console.log(productName,"productName")
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          const {formValues} = yield (select(_ => _.IndexMgr))
          yield put({
            type: 'queryid',
            payload: {...formValues,productName}
          })
            yield put({
            type: 'hideModal',
          })

          message.success('修改成功')
        }
      }
    },
    * updatetree ({ payload }, { select, call, put }) {
      const response = yield call(updatetree, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'query',
          })
          message.success('修改成功')
        }
      }
    },

    * queryid ({ payload }, { call, put }) {

      const response = yield call(queryid, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              list: response.RSP_BODY.indexList,
              pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 10,
                total: response.RSP_BODY.total,
              },
            },
          })
        }
      }
    },
    * onPublish ({ payload }, { call, put ,select}) {
      const response = yield call(indexpublish, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          message.success("修改状态成功！")
          const {formValues} = yield (select(_ => _.IndexMgr))
          yield put({
            type: 'queryid',
            payload: formValues,
          })
        }
      }
    },
    * getSelectList({ payload }, { call, put, select }) {
      const { user } = yield select(_ => _.app)

      const data1 = {
        appId: "1",
        dictCode: "IndexType",
      }
      const data2 = {
        appId: "1",
        dictCode: "FREQUENCY",
      }
      const data3 = {
        appId: "1",
        dictCode: "unit",
      }
      const data4 = {
        appId: "1",
        dictCode: "statisticsType",
      }
        const data5 = {
        appId: "1",
        dictCode: "productFormat",
      }

      const responsea = yield call(getIndexType, data1)
      const responseb = yield call(getFrequency, data2)
      const responsec = yield call(getunit, data3)
      const responsed = yield call(getunit, data4)
      const responsee = yield call(getunit, data5)
      if (responsea.success) {
        if (responsea.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {

              IndexTypeList: responsea.RSP_BODY.dictList,
              FrequencyList: responseb.RSP_BODY.dictList,
              unitList: responsec.RSP_BODY.dictList,
              statisticsTypeList: responsed.RSP_BODY.dictList,
              productFormatList: responsee.RSP_BODY.dictList,
            }
          })
        }
      }
    },

    * create ({ payload }, { call, put,select }) {
      const data = yield call(addModel, payload)
      const{info:{productName}}=payload
      if (data.success) {
        if (data.RSP_HEAD.TRAN_SUCCESS === '1') {
          const {formValues} = yield (select(_ => _.IndexMgr))
          yield put({
            type: 'queryid',
            payload: {...formValues,productName}
          })
          yield put({ type: 'hideModal' })
          message.success('新增成功')
        }
      }else {
        throw data
      }

    },


    * deleteModal ({ payload }, { call, put,select }) {
      const data = yield call(deleteModal, payload)
      if (data.RSP_HEAD.TRAN_SUCCESS==="1") {
        const {formValues} = yield (select(_ => _.IndexMgr))
        yield put({ type: 'hideModal' })
        yield put({ type: 'queryid',   payload: formValues, })
        message.success('删除成功')
      } else {
        throw data
      }
    },


    //测试连接
    * linkcheck({ payload },{ call,put }){
      const response = yield call(linkcheck,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          if (response.RSP_BODY.checkCode)
            message.success('测试成功')
          else{
            message.error('链接失败')
          }
        }
      }
    },


    //连接删除
    * linkdel({ payload },{ call,put }){
      const response = yield call(linkdel,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){

          if(response.RSP_BODY.flag ){
            message.success('删除成功')
            yield put({
              type:'query',
            })
          }
          else{
            message.warning('此链接已绑定，无法删除')
          }
        }
      }
    },

  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/IndexMgr').exec(pathname)
        if (match) {
          dispatch({
            type: 'getSelectList'
          })
        }
      })
    },
  },

  reducers: {
    hideModal (state) {
      return { ...state, modalVisible: false }
    },

    querySuccess(state, {payload}) {
      return {...state, ...payload}
    },
    getTypeList(state, { payload }) {
      return {
        ...state,
        getTypeList: payload,
      }
    },
    getDbType(state, { payload }) {
      return {
        ...state,
        getDbType: payload,
      }
    },
    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },
  }
})
