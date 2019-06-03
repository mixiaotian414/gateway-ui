import modelExtend from 'dva-model-extend'
import * as Service from 'services/IndexLibMgr/DimensionsMgr/dimensionsmgr'
import {message} from 'antd'
const { query,create,update,del,getSelectList,dataview,datasource,dimensiontable,dimensionvalue } = Service
const LedgerType="DimensionsMgr"

export default modelExtend({
  namespace: LedgerType,
  state:{
    list:[],
    selectedRowKeys: [],
    ids: [],
    formValues:{
      page: 1,
      pageSize: 10
    },
    dataViewFormValues:{
      page: 1,
      pageSize: 5
    },
    LedgerType,
    currentItem:{},
    modalVisible: false,//操作模态框
    modalType: 'create',
    dataViewVisible:false,
    dataViewList:[],
    datasourceList:[],
    dimensiontableList:[],
    dimensionValueList:[],
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname==="/DimensionsMgr") {
          dispatch({
            type: 'getSelectList'
          })
          dispatch({
            type: 'datasource'
          })

        }
      })
    },
  },
  effects: {
    * getSelectList({ payload }, { call, put, select }) {
      const { user } = yield select(_ => _.app)
      const { appId } = user
      const data = {
        appId:appId,
        dictCode: 'DIMENSION_TYPE'
      }

      const response = yield call(getSelectList, data)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'getType',
            payload: response.RSP_BODY.dictList,
          })
        }
      }

    },
    * datasource({payload}, {call, put}) {
      const data = yield call(datasource, payload)
      if(data.success) {
        if (data.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              datasourceList: data.RSP_BODY.connectionList,
            },
          })
        }
      }
    },
    * dimensiontable({payload}, {call, put}) {
      const data = yield call(dimensiontable, payload)
      if(data.success) {
        if (data.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              dimensiontableList: data.RSP_BODY.tableList,
            },
          })
        }
      }
    },
    * dimensionvalue({payload}, {call, put}) {
      const data = yield call(dimensionvalue, payload)
      if(data.success) {
        if (data.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              dimensionValueList: data.RSP_BODY.modelList,
            },
          })
        }
      }
    },
    * query({payload={ page: 1, pageSize: 10 }}, {call, put}) {
      const data = yield call(query, payload)
      if(data.success) {
        if (data.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data.RSP_BODY.dimensionList,
              pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 10,
                total: data.RSP_BODY.total,
              },
            },
          })
        }
      }
    },
    * create ({ payload }, { call, put }) {
      const data = yield call(create, payload)
      if (data.RSP_HEAD.TRAN_SUCCESS==="1") {
        message.success('添加成功')
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * update ({ payload }, { call, put }) {
      const data = yield call(update, payload)
      if (data.RSP_HEAD.TRAN_SUCCESS==="1") {
        message.success('修改成功')
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
    * del({ payload },{ call,put }){
      const response = yield call(del,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          message.success('删除成功')
          yield put({
            type:'query',
          })
        }
      }
    },
    * queryDataView({payload={ page: 1, pageSize: 10 }}, {call, put}) {
      const data = yield call(dataview, payload)
      if(data.success) {
        if (data.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              dataViewList: data.RSP_BODY.dataList,
              pagination1: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 10,
                total: data.RSP_BODY.total,
              },
            },
          })
        }
      }
    },
  },
  reducers: {
    querySuccess(state, {payload}) {
      return {...state, ...payload}
    },
    getType(state, { payload }) {
      return {
        ...state,
        getType: payload,
      }
    },
    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },
    hideModal (state) {
      return { ...state, modalVisible: false }
    },
  }
})
