const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')

const { apiPrefix } = config
let datalist = Mock.mock({
  'data|80-100': [
    {
      'key|+1': 1,
      orgId: /^[1234]\d{6}[1-9]$/,
      'userName|1': ["绩效考核系统","报表管理系统","客户关系系统","财务管理系统","总账管理系统"],
      userCode: /^[1]\d{4}[1-9]$/,
      'appDesc|1': ["超级管理员","管理员","财务主任","业务经理","柜员"],
      'appType|1': ["类型1","类型2","类型3"],
      'openAppStatus|1':["停用","启用"],
      'userStatus|1':["0","1"],
      appPeffectivedate: '@date',
      appExpiredate: '@date',
    },
  ],
})
let database = datalist.data

const NOTFOUND = {
  message: 'Not Found',
  //documentation_url: 'http://localhost:8001/request',
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
  [`GET ${apiPrefix}/userSetting`](req, res) {
    const { query } = req
    console.log("query:",query)
    //const { REQ_HEAD } = query
    let { pageSize,page } = query

    console.log("pageSize:",pageSize)

    pageSize = pageSize || 10
    page = page || 1
    let newData = database
    res.status(200).json({
      RSP_BODY:{appList: newData.slice((page - 1) * pageSize, page * pageSize),total: newData.length},
      RSP_HEAD:{TRAN_SUCCESS:  "1"},
    })
  },
  [`GET ${apiPrefix}/userSetting/:orgId`](req, res) {
    const { orgId } = req.params
    console.log(orgId)
    const data = queryArray(database, orgId, 'orgId')
    if (data) {
      res.status(200).json({

          RSP_BODY:{appList:data},
          RSP_HEAD:{TRAN_SUCCESS:  "1",ERROR_CODE:"",ERROR_MESSAGE:""},
        }
      )
    } else {
      res.status(404).json(NOTFOUND)
    }

  },
}

