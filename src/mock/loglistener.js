const Mock = require('mockjs')
const config = require('../utils/config')

const { apiPrefix } = config
let datalist = Mock.mock({
    'data|10-50': [
        {
            'key|+1': 1,
            name: '@name',
            'age|11-99': 1,
            email: '@email',
            address: '@county(true)',
            'appName|1': ["绩效考核系统", "报表管理系统", "客户关系系统", "财务管理系统", "总账管理系统"],
        },
    ],
})
let database = datalist.data

module.exports = {
    [`GET ${apiPrefix}/loglistener`](req, res) {
        const { query } = req
        let { pageSize, page } = query
        pageSize = pageSize || 10
        page = page || 1
        let newData = database
        res.status(200).json({
            RSP_BODY: { LogList: newData, total: newData.length },
            RSP_HEAD: { TRAN_SUCCESS: "1" },
        })
    },
}
