/* eslint-disable quotes */
import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import * as newModelManage from 'services/IndexLibMgr/newModelManage'
import { pageModel } from 'models/common'
import { message } from 'antd'

const { query, queryid, queryPersonnel,del,add,update,updatetree,getConList,getModelTypeList,addModel,deleteModal } = newModelManage
const LedgerType="newmodelManage"
export default modelExtend(pageModel,{
  namespace: 'newmodelManage',

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
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    conList:[],//数据源类型
    modelTypeList:[],//模型类型
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
          const orgtreeData = response.RSP_BODY.modeltree;
          const mockdata=[{
            id: '-1',
            modelDirCode: "1",
            modelDirName: "模型目录",
            parentId: "-999",
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
          const {formValues} = yield (select(_ => _.newmodelManage))
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
          const {formValues} = yield (select(_ => _.newmodelManage))
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
      const{model_info:{modelName}}=payload

      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          const {formValues} = yield (select(_ => _.newmodelManage))
          yield put({
            type: 'queryid',
            payload: {...formValues,modelName}
          })
          yield put({ type: 'hideModal' })
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
    * queryid ({payload={ page: 1, pageSize: 10 }}, { call, put }) {
      const response = yield call(queryid, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              list: response.RSP_BODY.modelList,
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
    * getSelectList({ payload }, { call, put, select }) {
      const { user } = yield select(_ => _.app)

      const data = {
        appId: "1",
        dictCode: "modeltype",
      }
      const responsea = yield call(getConList, data)
      const responseb = yield call(getModelTypeList, data)
      if (responsea.success) {
        if (responsea.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              conList: responsea.RSP_BODY.connectionList,
              modelTypeList: responseb.RSP_BODY.dictList
            }
          })
        }
      }
    },


    * create ({ payload }, { call, put,select }) {
      const data = yield call(addModel, payload)
      const{model_info:{modelName}}=payload

      if (data.success) {
        if (data.RSP_HEAD.TRAN_SUCCESS === '1') {
          const {formValues} = yield (select(_ => _.newmodelManage))
          yield put({
            type: 'queryid',
            payload: {...formValues,modelName}
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
        const {formValues} = yield (select(_ => _.newmodelManage))
        yield put({ type: 'hideModal' })
        yield put({ type: 'queryid',   payload: formValues, })
        message.success('删除成功')
      } else {
        throw data
      }
    },
/*    //列表
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
*/

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
        const match = pathToRegexp('/newmodelManage').exec(pathname)
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

    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },
  }
})
