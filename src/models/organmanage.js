/* eslint-disable quotes */
import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import * as orgTreeService from 'services/organmanage'
import { pageModel } from 'models/common'
import { message } from 'antd'

const { query, queryid, queryPersonnel,del,add,update,getSelectList } = orgTreeService

export default modelExtend(pageModel,{
  namespace: 'organmanage',

  state: {
    list: [],
    item: [],
    formValues: {},
    queryPersonnellist: [],
    getTypeList: [],
  },

  effects: {
    //树列表
    * query ({ payload }, { put, call,select }) {
      const { user } = yield select(_ => _.app)
      const { appId } = user
      payload = {...payload,appId:appId}
      const response = yield call(query,payload);
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          const orgtreeData = response.RSP_BODY.orgList;
          yield put({
            type: 'querySuccess',
            payload: {
              list: orgtreeData,
            }
          })
        }
      }
    },
    //人员明细
    * queryPersonnel ({ payload = { page: 1, pageSize: 10 } }, { call, put} ) {
      const response = yield call(queryPersonnel, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              queryPersonnellist: response.RSP_BODY.userList,
            },
          })
        }
      }
    },
    * delete ({ payload }, { select, call, put }) {
      const response = yield call(del, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          const {formValues} = yield (select(_ => _.organmanage))
          yield put({
            type: 'query',
            payload: formValues,
          })
          message.success('删除成功')
        }
      }
    },
    * add ({ payload }, { select, call, put }) {
      const response = yield call(add, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          const {formValues} = yield (select(_ => _.organmanage))
          yield put({
            type: 'query',
            payload: formValues,
          })
          message.success('添加成功')
        }
      }
    },
    * update ({ payload }, { select, call, put }) {
      const response = yield call(update, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          const {formValues} = yield (select(_ => _.organmanage))
          yield put({
            type: 'query',
            payload: formValues,
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
              item: response.RSP_BODY,

            },
          })
        }
      }
    },
    * getSelectList({ payload }, { call, put, select }) {
      const { user } = yield select(_ => _.app)
      const { appId } = user
      const data = {
          appId: appId,
          dictCode: 'ORG_TYPE'
      }
      const response = yield call(getSelectList, data)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'getTypeList',
            payload: response.RSP_BODY.dictList,
          })
        }
      }
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/organmanage').exec(pathname)
        if (match) {
          dispatch({
            type: 'getSelectList'
          })
        }
      })
    },
  },

  reducers: {
    querySuccess(state, {payload}) {
      return {...state, ...payload}
    },
    getTypeList(state, { payload }) {
      return {
        ...state,
        getTypeList: payload,
      }
    },
  }
})
