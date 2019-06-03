const qs = require('qs')
const Mock = require('mockjs')

const config = require('../utils/config')

const { apiPrefix } = config
let DataMock = Mock.mock({
  'data|30-50': [
    {
      'key|+1':1,
      id: '@id',
      'ruleSetName|1': ["风险投资","欺诈","转人工","默认集合"],
      'schema|1': ["独裁","求和","最大值","默认集合"],
      score: /^[3456789]\d{1}$/,
      'showName|1': ["交易反欺诈工作流","常用工作流","不常用工作流"],
      date: '@date',
      time: '@time',
      money: /^[34578]\d{5}$/,
      'type|1':  ["消费","转入","ATM","POS","自助终端"],
      'qudao|1':  ["手机银行","网银","转出","取现","查询"],
      num: '@id',

      'statusname|1': ["告警","强认证","阻断"],
    },
  ],
})
let database = DataMock.data

const NOTFOUND = {
  message: 'Not Found',
  /*documentation_url: 'http://localhost:8000/request',*/
}


module.exports = {

  [`GET ${apiPrefix}/reportQueryDetail/:id`] (req, res) {

    const newData =[{
      kemu:"1", name:"一、资产类",
    },{
      kemu:"1001", name:"现金",
    },{
      kemu:"1002", name:"存放中央银行款项",
    },{
      kemu:"1003", name:"专项央行票据",
    },{
      kemu:"1004", name:"央行专项扶持资金",
    },{
      kemu:"1011", name:"存放同业款项",
    },{
      kemu:"1012", name:"存放系统内款项",
    },{
      kemu:"1013", name:"拆放同业款项",
    },{
      kemu:"1014", name:"拆放系统内款项",
    },{
      kemu:"1031", name:"存出保证金",
    },{
      kemu:"1032", name:"存出保证金减值准备",
    },{
      kemu:"1101", name:"交易性金融资产",
    },{
      kemu:"1111", name:"买入返售金融资产",
    },{
      kemu:"1112", name:"买入返售金融资产减值准备",
    },{
      kemu:"1131", name:"应收股利",
    },{
      kemu:"1132", name:"应收利息",
    },{
      kemu:"1221", name:"其他应收款",
    },{
      kemu:"1231", name:"坏账准备",
    },{
      kemu:" a01", name:"各项贷款",
    },{
      kemu:" a02", name:"农业贷款小计",
    },{
      kemu:"1301", name:"农户贷款",
    },{
      kemu:"1302", name:"农村企业贷款",
    },{
      kemu:"1303", name:"非农贷款",
    },{
      kemu:"1304", name:"信用卡透支",
    },{
      kemu:"1305", name:"贴现资产",
    },{
      kemu:"1307", name:"贸易融资",
    },{
      kemu:"1308", name:"垫款",
    },{
      kemu:"2", name:"二、负债类",
    },{
      kemu:"a03", name:"各项存款",
    },{
      kemu:"2001", name:"单位活期存款",
    },{
      kemu:"2002", name:"单位定期存款",
    },{
      kemu:"2003", name:"个人活期存款",
    },{
      kemu:"2004", name:"个人定期存款",
    },{
      kemu:"2005", name:"银行卡存款",
    },{
      kemu:"2006", name:"财政性存款",
    },{
      kemu:"2007", name:"待结算财政款项",
    },{
      kemu:"2011", name:"应解汇款",
    },{
      kemu:"2012", name:"汇出汇款",
    },{
      kemu:"2013", name:"开出本票",
    },{
      kemu:"2014", name:"保证金存款",
    },{
      kemu:"2015", name:"向中央银行借款",
    },{
      kemu:"2016", name:"央行拨付专项票据资金",
    },{
      kemu:"2017", name:"同业存放款项",
    },{
      kemu:"2018", name:"系统内存放款项",
    },{
      kemu:"2019", name:"同业拆入资金",
    },{
      kemu:"2020", name:"系统内拆入资金",
    },{
      kemu:"2021", name:"转贴现负债",
    },{
      kemu:"2022", name:"再贴现负债",
    },{
      kemu:undefined, name:"表外合计",
    },]

    res.status(200).json({
      LIST: newData,
      total: newData.length,
      RESCODE:"1",
      RESMESSAGE:"获取数据错误",
      PARAMS:{"paraCode":"200005"},
    })
  },

}
