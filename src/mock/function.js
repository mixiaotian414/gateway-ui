const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')

const { apiPrefix } = config

let datalist = Mock.mock({
  data: [
    {
      appId:"1",
      funcId: "1",
      pMenuId:"-1",
      funcName: "功能管理",
      funcCode: "XXXXX",
      funcDesc: "0",
      funcType: "功能管理",
    },
    {
      appId:"1",
      funcId: "2",
      pMenuId:"1",
      funcName: "XXX功能1",
      funcCode: "XXXXX",
      funcDesc: "1",
      funcType: "XXX功能1",
    },
    {
      appId:"1",
      funcId: "3",
      pMenuId:"1",
      funcName: "XXX功能2",
      funcCode: "XXXXX",
      funcDesc: "1",
      funcType: "XXX功能2",
    },
    {
      appId:"1",
      funcId: "4",
      pMenuId:"1",
      funcName: "XXX功能3",
      funcCode: "XXXXX",
      funcDesc: "1",
      funcType: "XXX功能3",
    },
    {
      appId:"1",
      funcId: "5",
      pMenuId:"1",
      funcName: "XXX功能4",
      funcCode: "XXXXX",
      funcDesc: "1",
      funcType: "XXX功能4",
    },

  ],
})

let datalist2 = Mock.mock({
  'data|80-100': [
    {
      'key|+1': 1,
      appId: /^[1234]\d{6}[1-9]$/,
      'appName|1': ["绩效考核系统","报表管理系统","客户关系系统","财务管理系统","总账管理系统"],
      appCode: /^[1]\d{4}[1-9]$/,
      'appDesc|1': ["超级管理员","管理员","财务主任","业务经理","柜员"],
      'appType|1': ["类型1","类型2","类型3"],
      'openAppStatus|1':["是","否"],
      'openApp|1':["0","1"],
      appPeffectivedate: '@date',
      appExpiredate: '@date',
    },
  ],
})
let datalist3 = Mock.mock({
  'data|80-100': [
    {
      'key|+1': 1,
      appId: /^[1234]\d{6}[1-9]$/,
      'appName1|1': ["绩效考核系统","报表管理系统","客户关系系统","财务管理系统","总账管理系统"],
      appCode: /^[1]\d{4}[1-9]$/,
      'appDesc1|1': ["超级管理员","管理员","财务主任","业务经理","柜员"],
      'appType1|1': ["类型1","类型2","类型3"],
      'openAppStatus1|1':["是","否"],
      'openApp|1':["0","1"],
      appPeffectivedate: '@date',
      appExpiredate: '@date',
    },
  ],
})
let database = datalist.data
let database2 = datalist2.data
let database3 = datalist3.data


const NOTFOUND = {
  message: 'Not Found',
}

const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  let data

  for (let item of array) {
    if (item[keyAlias] === key) {
      data = item
      break
    }
  }

  if (data) {
    return data
  }
  return null
}

module.exports = {
  [`GET ${apiPrefix}/functionQuery`](req, res) {
    const { query } = req
    let newData = database
    res.status(200).json({
      RSP_BODY:{menuList: newData},
      RSP_HEAD:{TRAN_SUCCESS:  "1"},
    })
  },
  [`GET ${apiPrefix}/function/:funcId`](req, res) {
    const { funcId } = req.params
    const data = queryArray(database, funcId, 'funcId')
    if (data) {
      res.status(200).json({
          menuList2:data,
          tran_success:"1",
          RSP_BODY:{menuList: data},
          RSP_HEAD:{TRAN_SUCCESS:  "1"},

        }
      )
    } else {
      res.status(404).json(NOTFOUND)
    }

  },
  [`GET ${apiPrefix}/functionpersonnel`](req, res) {
    const { query } = req
    let { pageSize, page } = query
    pageSize = pageSize || 10
    page = page || 1
    let newData = database2
    res.status(200).json({
      RSP_BODY:{appList: newData.slice((page - 1) * pageSize, page * pageSize),total: newData.length},
      RSP_HEAD:{TRAN_SUCCESS:  "1"},
    })
  },
  [`GET ${apiPrefix}/functionpersonnelrole`](req, res) {
    const { query } = req
    let { pageSize, page } = query
    pageSize = pageSize || 10
    page = page || 1
    let newData = database3
    res.status(200).json({
      RSP_BODY:{appList: newData.slice((page - 1) * pageSize, page * pageSize),total: newData.length},
      RSP_HEAD:{TRAN_SUCCESS:  "1"},
    })
  },
}
