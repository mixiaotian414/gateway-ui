import modelExtend from 'dva-model-extend'
import * as businessService from 'services/BusinessManage/businessList'
import { pageModel } from 'models/common'
import { message } from 'antd'
const { modelinfo,modelinfoadd,modellinklist, modelsave,modelsyntree,modelupdate, modellinktablelist,modeltableadd,
  modeldel,modeltabledel,modelcoldel,modelfromtablelist,modeltargettablelist,modelfcollist, modeltcollist,modelrelaadd,
  modelrelationalsave,modelrelationalinfo,modelrelationaldel,modeltabletree,modelattrisave, modellinkcollist,modelcoladd,
  getSelectList
} = businessService

const LedgerType="BusinessIndex"

export default modelExtend(pageModel,{
  namespace: LedgerType,
  state:{
    businessTableCollist:[],
    selectFromTableList:[],
    selectTargetTableList:[],
    selectFColList:[],
    selectTColList:[],
    linkColList:[],
    updatelist:[],
    linkList:[],
    tableList:[],
    modelList:[],
    modelInfoList:[],
    modelInfoListT:[],
    relationList:[],
    LedgerType,
    currentItem:{},
    addBusinessVisible:false,//控制创建业务模型模态框
    businsessTableModal:false,//控制表属性模态框
    tableAddVisible:false,//控制物理模型模态框
    businessRelationsVisible:false,//控制业务关系模态框
    colVisible:false,
    businessModalTitle: 'create',
    relationtitle:'create',
    ModelCode:"",
    TableCode:[],
    getAttriQuery:[],
    getAttriXls:[],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/businessIndex') {
          dispatch({
            type: 'linkquery'
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
      const data1 = {
        appId:appId,
        dictCode: 'ATTRI_QUERY'
      }
      const data2 = {
        appId:appId,
        dictCode: 'ATTRI_XLS'
      }

      const response1 = yield call(getSelectList, data1)
      if (response1.success) {
        if (response1.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'getAttriQuery',
            payload: response1.RSP_BODY.dictList,
          })
        }
      }
      const response2 = yield call(getSelectList, data2)
      if (response2.success) {
        if (response2.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'getAttriXls',
            payload: response2.RSP_BODY.dictList,
          })
        }
      }
    },
    //model同步树
    * modelsyntree ({ payload },{ call, put, select}){
      const response = yield call(modelsyntree, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              modelList: response.RSP_BODY.modelList,
            },
          })
        }
      }
    },

    //业务模型属性编辑取值
    * modelinfo ({ payload },{ call, put }){
      const response = yield call(modelinfo,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          yield put({
            type: 'querySuccess',
            payload:{
              modelInfoList: response.RSP_BODY.attriList,
              modelInfoListT:response.RSP_BODY
            }
          })
        }
      }
    },
    //创建模型
    * modelinfoadd ({ payload },{ call, put }){
      const response = yield call(modelinfoadd,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          yield put({
            type: 'querySuccess',
            payload:{
              modelInfoList: response.RSP_BODY.attriList
            }
          })
        }
      }
    },

    //创建业务模型保存
    * modelsave ({ payload },{ call, put }){
      const response = yield call(modelsave,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          message.success('创建成功')
          yield put({
            type: 'modelsyntree',
          })
          //关闭modal
          yield put({type: 'querySuccess', payload:{addBusinessVisible: false}})

        }
      }
    },
    //修改业务模型保存
    * modelupdate ({ payload },{ call, put }){
      const response = yield call(modelupdate,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          message.success('修改成功')
          yield put({
            type: 'modelsyntree',
          })
          //关闭modal
          yield put({type: 'querySuccess', payload:{addBusinessVisible: false}})

        }
      }
    },
    //导入表查询
    * modellinktablelist ({ payload },{ call, put }){
      const response = yield call(modellinktablelist,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          yield put({
            type: 'querySuccess',
            payload:{
              tableList: response.RSP_BODY.tableList
            }
          })
        }
      }
    },
    //导入表保存
    * modeltableadd ({ payload },{ call, put }){
      const response = yield call(modeltableadd,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          yield put({type: 'updateState', payload: {selectedRowKeys: []}})
          yield put({
            type: 'modelsyntree',
          })
          message.success('导入成功')
          yield put({type: 'querySuccess', payload:{tableAddVisible: false}})

        }
      }
    },
    //模型删除
    * modeldel({ payload },{ call, put }){
      const response = yield call(modeldel,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          message.success('删除成功')
          yield put({
            type: 'modelsyntree',
          })
        }
      }
    },

    * modeltabledel({ payload },{ call, put }){
      const response = yield call(modeltabledel,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          message.success('删除成功')
          yield put({
            type: 'modelsyntree',
          })
        }
      }
    },
    * modelcoldel({ payload },{ call, put }){
      const response = yield call(modelcoldel,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          message.success('删除成功')
          yield put({
            type: 'modelsyntree',
          })
        }
      }
    },

    //连接下拉列表
    * linkquery ({ payload },{ call, put }){
      const response = yield call(modellinklist,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          yield put({
            type: 'querySuccess',
            payload:{
              linkList: response.RSP_BODY.linkList
            }
          })
        }
      }
    },
    //tablelist下拉列表
    * modelfromtablelist ({ payload },{ call, put }){
      const response = yield call(modelfromtablelist,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          yield put({
            type: 'querySuccess',
            payload:{
              selectFromTableList: response.RSP_BODY.tableList
            }
          })
        }
      }
    },
    * modeltargettablelist ({ payload },{ call, put }){
      const response = yield call(modeltargettablelist,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          yield put({
            type: 'querySuccess',
            payload:{
              selectTargetTableList: response.RSP_BODY.tableList
            }
          })
        }
      }
    },
    //collist下拉列表
    * modelfcollist ({ payload },{ call, put }){
      const response = yield call(modelfcollist,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          yield put({
            type: 'querySuccess',
            payload:{
              selectFColList: response.RSP_BODY.colList
            }
          })
        }
      }
    },
    * modeltcollist ({ payload },{ call, put }){
      const response = yield call(modeltcollist,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          yield put({
            type: 'querySuccess',
            payload:{
              selectTColList: response.RSP_BODY.colList
            }
          })
        }
      }
    },
    /*创建关系*/
    * modelrelaadd ({ payload },{ call, put }){
      const response = yield call(modelrelaadd,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          message.success('创建成功')
          yield put({
            type: 'modelsyntree',
          })
          //关闭modal
          yield put({type: 'querySuccess', payload:{businessRelationsVisible: false}})
        }
      }
    },
    /*关系编辑取值*/
    * modelrelationalinfo ({ payload },{ call, put }){
      const response = yield call(modelrelationalinfo,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          yield put({
            type: 'querySuccess',
            payload:{
              relationList:response.RSP_BODY
            }
          })
        }
      }
    },
    /*关系编辑保存*/
    * modelrelationalsave ({ payload },{ call, put }){
      const response = yield call(modelrelationalsave,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          message.success('修改成功')
          yield put({
            type: 'modelsyntree',
          })
          //关闭modal
          yield put({type: 'querySuccess', payload:{businessRelationsVisible: false}})
        }
      }
    },
    /*关系删除*/
    * modelrelationaldel ({ payload },{ call, put }){
      const response = yield call(modelrelationaldel,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          message.success('删除成功')
          yield put({
            type: 'modelsyntree',
          })
        }
      }
    },

    /*table col 属性树*/
    * modeltabletree ({ payload },{ call, put, select}){
      const response = yield call(modeltabletree, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              businessTableCollist: response.RSP_BODY.list,
            },
          })
        }
      }
    },

    /*table col 属性编辑保存*/
    * modelattrisave ({ payload },{ call, put, select}){
      const response = yield call(modelattrisave, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          message.success('修改成功')
          yield put({
            type: 'modelsyntree',
          })
          //关闭modal
          yield put({type: 'querySuccess', payload:{businsessTableModal: false}})
        }
      }
    },
    /*物理表col列表*/
    * modellinkcollist ({ payload },{ call, put }){
      const response = yield call(modellinkcollist,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          yield put({
            type: 'querySuccess',
            payload:{
              linkColList: response.RSP_BODY.colList
            }
          })
        }
      }
    },
    * modelcoladd ({ payload },{ call, put }){
      const response = yield call(modelcoladd,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          yield put({type: 'updateState', payload: {selectedRowKeys: []}})
          yield put({
            type: 'modelsyntree',
          })
          message.success('添加成功')
          yield put({type: 'querySuccess', payload:{colVisible: false}})

        }
      }
    },

  },

  reducers: {
    querySuccess (state, { payload }) {
      return { ...state, ...payload }
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
  },

})
