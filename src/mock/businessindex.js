const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')

const { apiPrefix } = config

let datalist1 = Mock.mock({
  data: [
    {
      modelName:"Bussiness Models",
      modelCode: "Bussiness",
      relaType:"04",
      BusinessTables: [{
        tableCode:"Customer(mysql)",
        tableName:"mysql",
        relaType:"03",
        colList:[{
          colName:"colName",
          colCode:"oracle-1",
          relaType:"03",
        }]
      }],
      Relationships:[{
        relationalCode:"relationalCode",
        relationalName:"relationalName",
        relaType:"05"
      }]
    },
    {
      modelName:"Models",
      modelCode: "Models",
      relaType:"04",
      BusinessTables: [{
        tableCode:"Customer",
        tableName:"Customer",
        relaType:"03",
        colList:[{
          colName:"asdf",
          colCode:"asdf-1",
          relaType:"03",
        }]
      }],
      Relationships:[{
        relationalCode:"sdfsfds",
        relationalName:"sdfsdf",
        relaType:"05"
      }]
    },
  ]
})

let datalist3 = Mock.mock({
  data : [
    {
      title:"AP_FUNC",
      key: "AP_FUNC",
      children: [{
        title:"APP_ID",
        key:"APP_ID",
      },{
        title:"FUNC_ID",
        key:"FUNC_ID",
      },{
        title:"FUNC_CODE",
        key:"FUNC_CODE",
      },{
        title:"FUNC_NAME",
        key:"FUNC_NAME",
      }]
    },
  ]
})

let database = datalist1.data
let database3 = datalist3.data
module.exports = {
  [`GET ${apiPrefix}/businesslist`](req, res) {
    const {query} = req
    let newData = database
    res.status(200).json({
      RSP_BODY: {modelList: newData},
      RSP_HEAD: {TRAN_SUCCESS: "1"},
    })
  },
  [`GET ${apiPrefix}/businessupdatetree`](req, res) {
    let businessTableList = database3
    res.status(200).json({
      RSP_BODY: {businessTableList: businessTableList},
      RSP_HEAD: {TRAN_SUCCESS: "1"},
    })
  },
}
