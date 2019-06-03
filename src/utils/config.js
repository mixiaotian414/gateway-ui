const APIV1 = '/api/v1'
const APIV2 = '/api/v2'
const APIV3 = '/gateway'

module.exports = {
  sysCode: 'gw',//系统唯一编码
  name: '东华软件',
  prefix: 'jumpAdmin',
  footerText: 'DHCC © 2018 ',
  logo: '/logo.svg',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  CORS: [],
  openPages: ['/login','/CustomReportQuery'],
  apiPrefix: '/api/v1',
  APIV1,
  APIV2,
  APIV3,
  api: {
    userLogin: `${APIV3}/user/login.json`,
    userLogout: `${APIV3}/user/logout.json`,
    user: `${APIV3}/user.json`,
    userInfo: `${APIV1}/userInfo`,
    users: `${APIV1}/users`,
    posts: `${APIV1}/posts`,
    dashboard: `${APIV1}/dashboard`,
    menus: `${APIV3}/usermenu.json`,
    weather: `${APIV1}/weather`,
    v1test: `${APIV1}/test`,
    v2test: `${APIV2}/test`,
    menumanage: `${APIV3}/menusyntree.json`,
    secdictselect: `${APIV3}/secdictselect.json`,
    organmanage: `${APIV3}/organizationtree.json`,
    roleSetting: `${APIV3}/roletolist.json`,
    functionQuery: `${APIV3}/functiontree.json`,
    validateVal: `${APIV3}/utilsvalidateVal.json`,

    // listdemo: `${APIV1}/loglistener`,
  },
}
