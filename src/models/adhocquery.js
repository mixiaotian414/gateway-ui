import modelExtend from 'dva-model-extend'
import * as Service from 'services/adhocquery'
import {message} from 'antd'
const { query,querychild } = Service
import { arrayToSelectTree } from 'utils'


const LedgerType="AdhocIndex"
export default modelExtend({
  namespace: LedgerType,
  state:{
    list:[],
    route: "",
    childlist:[],
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
        //if (location.pathname==="/"+LedgerType) {
        if (location.pathname==="/adhocIndex") {
          const payload = location.query || {}
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },
  effects: {
    * query({payload}, {call, put}) {
      //列表data
      const data = yield call(query, payload)
      if (data.success) {
        if (data.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data.RSP_BODY.data,
              route: data.RSP_BODY.route,
            },
          })
        }
      }
    },
    * querychild ({ payload }, { call, put, select }) {
      const response = yield call(querychild, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              childlist: response.RSP_BODY,
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
