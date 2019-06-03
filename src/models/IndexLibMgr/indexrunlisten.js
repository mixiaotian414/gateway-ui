import modelExtend from 'dva-model-extend'
import * as Service from 'services/IndexLibMgr/IndexRunListen/indexrunlisten'
import {message} from 'antd'
const { query,getSelectList,indexRun,heavyRun,del } = Service
const LedgerType="IndexRunListen"

export default modelExtend({
  namespace: LedgerType,
  state:{
    list:[],
    formValues:{
      page: 1,
      pageSize: 10
    },
    LedgerType,
    currentItem:{},
    modalVisible: false,//操作模态框
    modalType: 'create',
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname==="/IndexRunListen") {
          dispatch({
            type: 'getSelectList'
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
        dictCode: 'TASK_STS'
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
    //列表查询
    * query({payload={ page: 1, pageSize: 10 }}, {call, put}) {
      const data = yield call(query, payload)
      if(data.success) {
        if (data.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data.RSP_BODY.indexList,
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
    //添加跑数任务 运行
    * indexRun ({ payload }, { call, put }) {
      const data = yield call(indexRun, payload)
      if (data.RSP_HEAD.TRAN_SUCCESS==="1") {
        message.success('运行成功')
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
    //指标重跑
    * heavyRun ({ payload }, { call, put }) {
      const data = yield call(heavyRun, payload)
      if (data.RSP_HEAD.TRAN_SUCCESS==="1") {
        message.success('重跑成功')
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
    //指标清除
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
