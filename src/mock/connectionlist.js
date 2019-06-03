const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')

const { apiPrefix } = config

let datalist1 = Mock.mock({
  data: [
    {
        relaCode: "linkcode",
        relaName: "linkname",
        relaType: "01",
        list: [{
          relaCode:"mysql",
          relaName:"mysql",
          relaType: "02",
          list:[{
            relaCode:"oracle-1",
            relaName:"oracle-1",
            relaType: "03",
          }]
        }]
    },
  ]
})

let datalist2 = Mock.mock({
  data: [
    {
      title:"mysql",
      key: "mysql",
      tablename: "AB",
      children: [{
        title:"模式",
        key:"模式",
        tablename: "DF",
        children:[{
          title:"oracle-1",
          key:"oracle-1",
          tablename: "SFD",
          children:[{
            title:"oracle-2",
            key:"oracle-2",
            tablename: "DSA",
            children:[{
              title:"oracle-4",
              key:"oracle-4",
              tablename: "ADQ2",
              children:[{
                title:"oracle-3",
                key:"oracle-3",
                tablename: "ASDF",
              }]
            }]
          }]
        }]
      },{
        title:"表",
        key:"表",
      },{
        title:"视图",
        key:"视图",
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

let datalist4 = Mock.mock({
   data : [
    {a1: 'AP_ACL_ID', a2:'419201',a3: '2018/04/08 11:32:57.000000000'},
    {a1: 'AP_ACL_ID', a2:'419202',a3: '2018/04/08 11:32:57.000000000'},
    {a1: 'AP_ACL_ID', a2:'419203',a3: '2018/04/08 11:32:57.000000000'},
    {a1: 'AP_ACL_ID', a2:'419204',a3: '2018/04/08 11:32:57.000000000'},
    {a1: 'AP_ACL_ID', a2:'419205',a3: '2018/04/08 11:32:57.000000000'},
  ]
})

let keylist = Mock.mock({
  data : ["a1","a2","a3","a4","a5"]
})

let count = Mock.mock({
  data :1234567
})

let tablestructrue = Mock.mock({
  data : [
    {
      Field:'AP_ACL_ID',
      Type:'test',
      Null:'null',
      Key:'test',
      Default:'test',
      Extra:'test',
    }
  ]
})

let tablelist = Mock.mock({
  data: [
    {
      table:"测试表"
    },{
      table:"测试表"
    },{
      table:"测试表"
    },{
      table:"测试表"
    },{
      table:"测试表"
    }
  ]
})

let database = datalist1.data
let database2 = datalist2.data
let database3 = datalist3.data
let database4 = datalist4.data
let database5 = keylist.data
let database6 = count.data
let data7 = tablestructrue.data
let data8 = tablelist.data

module.exports = {
  [`GET ${apiPrefix}/connectionlist`](req, res) {
    const {query} = req
    let newData = database
    res.status(200).json({
      RSP_BODY: {list: newData},
      RSP_HEAD: {TRAN_SUCCESS: "1"},
    })
  },
  [`GET ${apiPrefix}/exporttree`](req, res) {
    let exporttreeList = database2
    res.status(200).json({
      RSP_BODY: {exporttreeList: exporttreeList,checkCode:true},
      RSP_HEAD: {TRAN_SUCCESS: "1"},
    })
  },
  [`GET ${apiPrefix}/updatetree`](req, res) {
    let updatetreeList = database3
    res.status(200).json({
      RSP_BODY: {updatetreeList: updatetreeList},
      RSP_HEAD: {TRAN_SUCCESS: "1"},
    })
  },
  [`GET ${apiPrefix}/linkpreview`](req, res) {
    let tablelist = database4
    let keyList = database5
    res.status(200).json({
      RSP_BODY: {tablelist: tablelist,keyList:keyList},
      RSP_HEAD: {TRAN_SUCCESS: "1"},
    })
  },
  [`GET ${apiPrefix}/linkcount`](req, res) {
    let count = database6
    res.status(200).json({
      RSP_BODY: {count: count},
      RSP_HEAD: {TRAN_SUCCESS: "1"},
    })
  },
  [`GET ${apiPrefix}/linktablestructure`](req, res) {
    let data = data7
    res.status(200).json({
      RSP_BODY: {list:data},
      RSP_HEAD: {TRAN_SUCCESS: "1"},
    })
  },
  [`GET ${apiPrefix}/linktablelist`](req, res) {
    let data = data8
    res.status(200).json({
      RSP_BODY: {tableList:data},
      RSP_HEAD: {TRAN_SUCCESS: "1"},
    })
  },

}
