const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')

const { apiPrefix } = config

let datalist = Mock.mock({
  data: [
    {
      title:"绩效考核系统",
      key: "绩效考核系统",
      appId:"101",
      pMenuId:"1011",
      children: [{
        pMenuId:"10111",
        title:"绩效人员维护",
        key:"绩效人员维护",
        children:[{
          pMenuId:"101111",
          title:"绩效审核",
          key:"绩效审核",
        }]
      }]
    },
    {
      title:"客户关系系统",
      key: "客户关系系统",
      appId:"102",
      pMenuId:"1012",
      children: [{
        pMenuId:"10122",
        title:"客户关系维护",
        key:"客户关系维护",
        children:[{
          pMenuId:"101222",
          title:"客户关系XXX",
          key:"客户关系XXX",
        }]
      }]
    },
    {
      title:"财务总账系统",
      key: "财务总账系统",
      appId:"103",
      pMenuId:"1013",
      children: [{
        pMenuId:"10133",
        title:"总账人员维护",
        key:"总账人员维护",
        children:[{
          pMenuId:"101333",
          title:"财务总账XX",
          key:"财务总账XX",
        }]
      }]
    },
    {
      title:"报表管理系统",
      key: "报表管理系统",
      appId:"104",
      pMenuId:"1014",
      children: [{
        pMenuId:"10144",
        title:"报表管理维护",
        key:"报表管理维护",
        children:[{
          pMenuId:"101444",
          title:"报表管理XX",
          key:"报表管理系XX",
        }]
      }]
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
let datalist4 = Mock.mock({
  'data|80-100': [
    {
      'key|+1': 1,
      routeCode: /^[1234]\d{6}[1-9]$/,
      'routeName|1': ["绩效考核系统","报表管理系统","客户关系系统","财务管理系统","总账管理系统"],
      appCode: /^[1]\d{4}[1-9]$/,
      'routeUri|1': ["超级管理员","管理员","财务主任","业务经理","柜员"],
      'routeDesc|1': ["类型1","类型2","类型3"],
      'openAppStatus1|1':["是","否"],
      'openApp|1':["0","1"],
      lastUpdator: '@date',
      lastUpdateTime: '@date',
    },
  ],
})
let database = datalist.data
let database2 = datalist2.data
let database3 = datalist3.data
let database4 = datalist4.data


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
  [`GET ${apiPrefix}/menumanage`](req, res) {
    const { query } = req
    let newData = database
    res.status(200).json({
      RSP_BODY:{menuList: newData},
      RSP_HEAD:{TRAN_SUCCESS:  "1"},
    })
  },
  [`GET ${apiPrefix}/menumanage/:menuId`](req, res) {
    const { menuId } = req.params
    const data = queryArray(database, menuId, 'menuId')
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
  [`GET ${apiPrefix}/menuTreepersonnel`](req, res) {
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
  [`GET ${apiPrefix}/menuTreepersonnelrole`](req, res) {
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
  [`GET ${apiPrefix}/menuTreequeryrutelist`](req, res) {
    const { query } = req
    let { pageSize, page } = query
    pageSize = pageSize || 10
    page = page || 1
    let newData = database4
    res.status(200).json({
      RSP_BODY:{appList: newData.slice((page - 1) * pageSize, page * pageSize),total: newData.length},
      RSP_HEAD:{TRAN_SUCCESS:  "1"},
    })
  },
}
