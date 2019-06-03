import modelExtend from 'dva-model-extend'
import * as connectionService from 'services/ConnectionManage/connectionList'
import { pageModel } from 'models/common'
import { message } from 'antd'
const { query,linkAdd,linksearchinfo,linksave,linktablelist,linktableadd,linktabletree,linkdbshow,
  linkcheck,linktabledel,linkdel,linkcoladd,linkcoldel,linkpreview, linkcount, linktablestructure,linkattrisave,
  getSelectList
} = connectionService

const LedgerType="ConnectionIndex"

export default modelExtend(pageModel,{
  namespace: LedgerType,
  state:{
    list:[],
    formValues:{},
    checkCode:true,
    linksearchinfolist:[],//连接编辑取值
    tableList:[],//导入表list
    linktabletreelist:[],//物理表treelist
    linkpreviewlist:[],//预览前100
    keylist: [],//预览前100表头
    selectcount:"",//记录数
    tablestructure:[],//表结构
    dbshowlist:[],//数据库结构
    LedgerType,
    currentItem:{},
    colVisible: false,//控制col模态框
    modalLinkVisible: false,//控制创建连接模态框
    exportVisible:false,//控制导入表模态框
    modalVisible: false,//控制预览前100行模态框
    modalTableVisible: false,//控制显示表结构模态框
    tablePropsVisible: false,//控制表属性模态框
    dataViewVisible: false,//控制数据浏览模态框
    linkModalTitle: 'create',
    TableCode:[],
    dbType:"",
    getDbType:[],
    getAttriQuery:[],
    getAttriXls:[],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/connectionIndex') {
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
      const data1 = {
        appId:appId,
        dictCode: 'ATTRI_QUERY'
      }
      const data2 = {
        appId:appId,
        dictCode: 'ATTRI_XLS'
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

    //同步树
    * query ({ payload },{ call, put, select}){
      const response = yield call(query, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              list: response.RSP_BODY.list,
            },
          })
        }
      }
    },
    //导入表查询
    * linktablelist({ payload },{ call, put}){
      const response = yield call(linktablelist, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              tablelist: response.RSP_BODY.tableList,
            },
          })
        }
      }
    },
    //导入表保存
    * linktableadd({ payload },{ call,put }){
      const response = yield call(linktableadd, payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          yield put({type: 'updateState', payload: {selectedRowKeys: []}})
          message.success('导入成功')
          //关闭modal
          yield put({type: 'querySuccess',payload:{exportVisible:false}})
          yield put({
            type: 'query',
          })
        }
      }

    },

    //创建连接
    * linkAdd ({ payload }, { call, put }) {
      const response = yield call(linkAdd, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          message.success('创建成功')
          //关闭modal
          yield put({type: 'querySuccess', payload:{modalLinkVisible: false}})
          yield put({
            type: 'query',
          })
        }
      }
    },
    //连接编辑取值
    * linksearchinfo({ payload },{ call,put }){
      const response = yield call(linksearchinfo,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          yield put({
            type: 'querySuccess',
            payload: {
              linksearchinfolist: response.RSP_BODY
            },
          })
        }
      }
    },
    //修改连接保存
    * linksave ({ payload },{ call, put }){
      const response = yield call(linksave,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){

          message.success('修改成功')
          //关闭modal
          yield put({type: 'querySuccess', payload:{modalLinkVisible: false}
          })
          yield put({
            type: 'query',
          })
        }
      }
    },
    //测试连接
    * linkcheck({ payload },{ call,put }){
      const response = yield call(linkcheck,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          yield put ({
            type:'querySuccess',
            payload:{
              checkCode:response.RSP_BODY.checkCode
            }
          })
        }
      }
    },
    //表删除
    * linktabledel({ payload },{ call, put }){
      const response = yield call(linktabledel,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          if(response.RSP_BODY.msg === '1'){
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
    //连接删除
    * linkdel({ payload },{ call,put }){
      const response = yield call(linkdel,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){

          if(response.RSP_BODY.msg === '1'){
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


    //物理表 treelist
    * linktabletree({ payload },{ call,put }){
      const response = yield call(linktabletree,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          yield put ({
            type: 'querySuccess',
            payload: {
              linktabletreelist:response.RSP_BODY.list
            },
          })
        }
      }
    },

    //添加col(列)
    * linkcoladd({ payload },{ call,put }){
      const response = yield call(linkcoladd,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          message.success('添加成功')
          yield put ({
            type: 'query',
          })
          yield put({type: 'querySuccess', payload:{colVisible: false}})
        }
      }
    },
    //删除col(列)
    * linkcoldel({ payload },{ call,put }){
      const response = yield call(linkcoldel,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          if(response.RSP_BODY.msg === '1'){
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



    //数据浏览显示表及视图
    * linkdbshow({ payload },{ call,put }){
      const response = yield call(linkdbshow,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          yield put ({
            type: 'querySuccess',
            payload:{
              dbshowlist: response.RSP_BODY.list
            }
          })
        }
      }
    },
    //预览前100
    * linkpreview({ payload },{ call,put }){
      const response = yield call(linkpreview,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          yield put ({
            type: 'querySuccess',
            payload:{
              linkpreviewlist:response.RSP_BODY.tableList,
              keylist:response.RSP_BODY.keyList
            },
          })
        }
      }
    },
    //显示记录数
    * linkcount({ payload },{ call,put }){
      const response = yield call(linkcount,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          yield put ({
            type:'querySuccess',
            payload:{
              selectcount:response.RSP_BODY.count
            }
          })
        }
      }
    },
    //显示表结构
    * linktablestructure({ payload },{ call,put}){
      const response = yield call(linktablestructure,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          yield put ({
            type: 'querySuccess',
            payload:{
              tablestructure:response.RSP_BODY.list
            }
          })
        }
      }
    },
    //table col 属性保存
    * linkattrisave({ payload },{ call,put }){
      const response = yield call(linkattrisave,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          message.success('保存成功')
          yield put ({
            type: 'query',
          })
          yield put({type: 'querySuccess', payload:{tablePropsVisible: false}})
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
