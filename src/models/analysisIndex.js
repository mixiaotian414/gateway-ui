import modelExtend from 'dva-model-extend'
import * as Service from 'services/analysisIndex'
import {message} from 'antd'
const {query} = Service
import { arrayToSelectTree } from 'utils'


const LedgerType="analysisIndex"
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
    LedgerType,
    modalType:'create',
    currentItem:{},
    modalVisible:false,
    getTypeList:[]
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        // if (location.pathname==="/"+LedgerType) {
        if (location.pathname==="/analysisIndex") {
          const payload = location.query || { page: 1, pageSize: 10 }
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },
  effects: {
    * query({payload={ page: 1, pageSize: 10 }}, {call, put}) {
      //列表data
      const data = yield call(query, payload)
      if (data.success) {
        if (data.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data.RSP_BODY.demoList,
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


  },
  reducers: {
    querySuccess(state, {payload}) {
      return {...state, ...payload}
    },
  }

})
