import modelExtend from 'dva-model-extend'
import * as connectionService from 'services/ReportManage/connectionList'
import { pageModel } from 'models/common'
import { message } from 'antd'
const { query,linkAdd,linksave,linktablelist,linktableadd,linktabletree,linkdbshow,
  linkcheck,linktabledel,linkdel,linkcoladd,linkcoldel,linkpreview, linkcount, linktablestructure,linkattrisave,
  getSelectList
} = connectionService

const LedgerType="connManage"

export default modelExtend(pageModel,{
  namespace: LedgerType,
  state:{
    list:[],
    formValues:{
      page: 1,
      pageSize: 10
    },
    LedgerType,
    currentItem: {},
    modalVisible: false,
    modalType: 'create',

  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/connManage') {
          dispatch({
            type: 'query'
          })
          dispatch({
            type: 'getSelectList'
          })
        }
      })
    },
  },
  effects:{


    * getSelectList({ payload }, { call, put, select }) {
      const { user } = yield select(_ => _.app)
      const { appId } = user
      const data = {
        appId:appId,
        dictCode: 'DB_TYPE'
      }

      const response = yield call(getSelectList, data)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'getDbType',
            payload: response.RSP_BODY.dictList,
          })
        }
      }

    },

    //列表
    * query({payload={ page: 1, pageSize: 10 }}, {call, put}) {
      const data = yield call(query, payload)
      if(data.success) {
        if (data.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data.RSP_BODY.connectionList,
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
      const data = yield call(linkAdd, payload)
      if (data.RSP_HEAD.TRAN_SUCCESS==="1") {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * update ({ payload }, { call, put }) {
      const data = yield call(linksave, payload)
      if (data.RSP_HEAD.TRAN_SUCCESS==="1") {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },


    //测试连接
    * linkcheck({ payload },{ call,put }){
      const response = yield call(linkcheck,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          if (response.RSP_BODY.result)
            message.success('测试连接成功')
          else{
            message.error('连接失败')
          }
        }
      }
    },


    //连接删除
    * linkdel({ payload },{ call,put }){
      const response = yield call(linkdel,payload)
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
    querySuccess (state, { payload }) {
      return { ...state, ...payload }
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
    getAttriQuery(state, { payload }) {
      return {
        ...state,
        getAttriQuery: payload,
      }
    },
    getAttriXls(state, { payload }) {
      return {
        ...state,
        getAttriXls: payload,
      }
    },


    hideModal (state) {
      return { ...state, modalVisible: false }
    },

  },
})
