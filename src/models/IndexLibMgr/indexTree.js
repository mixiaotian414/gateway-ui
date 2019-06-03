/* eslint-disable quotes */
import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import * as indexTree from 'services/IndexLibMgr/indexTree'
import { pageModel } from 'models/common'
import { message } from 'antd'

const { query,getIndexType } = indexTree
const LedgerType="IndexTree"
export default modelExtend(pageModel,{
  namespace: 'IndexTree',

  state: {
    data: {},
    item: [],
    LedgerType,
    IndexTypeList:[],
    formValues:{
      page: 1,
      pageSize: 10
    },


  },

  effects: {
    //树列表
    * query ({ payload }, { put, call,select }) {

      const response = yield call(query,payload);
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          const data = response.RSP_BODY.data;
          yield put({
            type: 'querySuccess',
            payload: {
              data,
            }
          })
        }
      }
    },

 * querytype ({ payload }, { put, call,select }) {
   const data1 = {
     appId: "1",
     dictCode: "IndexType",
   }
      const response = yield call(getIndexType,data1);
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          const IndexTypeList = response.RSP_BODY.dictList;
          yield put({
            type: 'querySuccess',
            payload: {
              IndexTypeList,
            }
          })
        }
      }
    },


  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/IndexTree').exec(pathname)
        if (match) {

          dispatch({
            type: 'querytype'
          })
        }
      })
    },
  },

  reducers: {


    querySuccess(state, {payload}) {
      return {...state, ...payload}
    },

  }
})
