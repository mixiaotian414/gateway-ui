import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import App from 'routes/app'
import { LocaleProvider } from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'
import zhCN from 'antd/lib/locale-provider/zh_CN';
const { ConnectedRouter } = routerRedux

const Routers = function ({ history, app }) {
  const error = dynamic({
    app,
    component: () => import('./routes/error'),
  })
  const routers = [
    {
      path: '/login',
      models: () => [import('./models/login')],
      component: () => import('./routes/login/'),
    },
    {
      path: '/dashboard',
      models: () => [import('./models/dashboard')],
      component: () => import('./routes/dashboard/'),
    },
  ]
  //const routersList = (JSON.parse(window.localStorage.getItem("routersList"))) == null ? routers :JSON.parse(window.localStorage.getItem("routersList"))
  const routes = [
    {
      path: '/dashboard',
      models: () => [import('./models/dashboard')],
      component: () => import('./routes/dashboard/'),
    }, /*{
      path: '/user',
      models: () => [import('./models/user')],
      component: () => import('./routes/user/'),
    }, */{
      path: '/user/:id',
      models: () => [import('./models/user/detail')],
      component: () => import('./routes/user/detail/'),
    }, {
      path: '/login',
      models: () => [import('./models/login')],
      component: () => import('./routes/login/'),
    }, {
      path: '/request',
      component: () => import('./routes/request/'),
    }, {
      path: '/UIElement/iconfont',
      component: () => import('./routes/UIElement/iconfont/'),
    }, {
      path: '/UIElement/search',
      component: () => import('./routes/UIElement/search/'),
    }, {
      path: '/UIElement/dropOption',
      component: () => import('./routes/UIElement/dropOption/'),
    }, {
      path: '/UIElement/layer',
      component: () => import('./routes/UIElement/layer/'),
    }, {
      path: '/UIElement/dataTable',
      component: () => import('./routes/UIElement/dataTable/'),
    }, {
      path: '/UIElement/editor',
      component: () => import('./routes/UIElement/editor/'),
    }, {
      path: '/chart/ECharts',
      component: () => import('./routes/chart/ECharts/'),
    }, {
      path: '/chart/highCharts',
      component: () => import('./routes/chart/highCharts/'),
    }, {
      path: '/chart/Recharts',
      component: () => import('./routes/chart/Recharts/'),
    }, {
      path: '/post',
      models: () => [import('./models/post')],
      component: () => import('./routes/post/'),
    }, {
      path: '/menumanage',
      component: () => import('./routes/menumanage/'),
      models: () => [import('./models/menumanage')],
    }, {
      path: '/organmanage',
      component: () => import('./routes/organmanage/'),
      models: () => [import('./models/organmanage')],
    }, {
      path: '/roleSetting',
      models: () => [import('./models/roleSetting')],
      component: () => import('./routes/roleSetting'),
    }, {
      path: '/application',
      models: () => [import('./models/application')],
      component: () => import('./routes/application/'),
    }, {
      path: '/apimanage',
      models: () => [import('./models/apimanage')],
      component: () => import('./routes/apimanage/'),
    }, {
      path: '/routemanage',
      models: () => [import('./models/routemanage')],
      component: () => import('./routes/routemanage/'),
    }, {
      path: '/datasource',
      models: () => [import('./models/datasource')],
      component: () => import('./routes/datasource/'),
    }, {
      path: '/sqlmonitor',
      models: () => [import('./models/sqlmonitor')],
      component: () => import('./routes/sqlmonitor/'),
    }, {
      path: '/webapplication',
      models: () => [import('./models/webapplication')],
      component: () => import('./routes/webapplication/'),
    }, {
      path: '/urimonitor',
      models: () => [import('./models/urimonitor')],
      component: () => import('./routes/urimonitor/'),
    }, {
      path: '/operlog',
      models: () => [import('./models/logSelect')],
      component: () => import('./routes/logSelect/'),
    }, {
      path: '/loginlog',
      models: () => [import('./models/loginLog')],
      component: () => import('./routes/loginLog/'),
    }, {
      path: '/notice',
      models: () => [import('./models/notice')],
      component: () => import('./routes/notice/'),
    }, {
      path: '/readnotice',
      models: () => [import('./models/readnotice')],
      component: () => import('./routes/readnotice/'),
    }, {
      path: '/secdict',
      models: () => [import('./models/secdict')],
      component: () => import('./routes/secdict/'),
    }, {
      path: '/treedict',
      models: () => [import('./models/treedict')],
      component: () => import('./routes/treedict/'),
    }, {
      path: '/function',
      component: () => import('./routes/function/'),
      models: () => [import('./models/function')],
    }, {
      path: '/userSetting',
      models: () => [import('./models/userSetting')],
      component: () => import('./routes/userSetting/'),

    }, {
      path: '/sysparam',
      models: () => [import('./models/sysparam')],
      component: () => import('./routes/sysparam/'),

    }, {
      path: '/accesscontrol',
      models: () => [import('./models/accesscontrol')],
      component: () => import('./routes/accesscontrol'),

    }, {
      path: '/test',
      component: () => import('./routes/test/'),
    }, {
      path: '/listdemo',
      models: () => [import('./models/TestListDemo')],
      component: () => import('./routes/TestListDemo'),
    }, {
      path: '/chartdemo',
      models: () => [import('./models/TestChartDemo')],
      component: () => import('./routes/TestChartDemo'),
    },
    {
      path: '/customIndex',
      models: () => [import('./models/reportManage/customIndex')],
      component: () => import('./routes/ReportManage/CustomIndex/'),
    },{
      path: '/basicIndex',
      models: () => [import('./models/reportManage/basicIndex')],
      component: () => import('./routes/ReportManage/BasicIndex/'),
    },{
      path: '/queryIndexData',
      models: () => [import('./models/reportManage/queryIndexData')],
      component: () => import('./routes/ReportManage/QueryIndexData/'),
    },{
      path: '/adjustIndex',
      models: () => [import('./models/reportManage/adjustIndex')],
      component: () => import('./routes/ReportManage/AdjustIndex/'),
    },{
      path: '/modelManage',
      models: () => [import('./models/reportManage/modelManage')],
      component: () => import('./routes/ReportManage/ModelManage/'),
    },{
      path: '/indexTypeManage',
      models: () => [import('./models/reportManage/indexTypeManage')],
      component: () => import('./routes/ReportManage/IndexTypeManage/'),
    },{
      path: '/reportQuery',
      models: () => [import('./models/reportManage/reportQuery')],
      component: () => import('./routes/ReportManage/ReportQuery/'),
    },{
      path: '/modelManageDetail/:id',
      models: () => [import('./models/reportManage/modelManageDetail')],
      component: () => import('./routes/ReportManage/ModelManage/modelManageDetail/'),
    },{
      path: '/reportQueryDetail/:id',
      models: () => [import('./models/reportManage/reportQueryDetail')],
      component: () => import('./routes/ReportManage/ReportQuery/reportQueryDetail/'),
    },{
      path: '/runqianReport/:id',
 /*     models: () => [import('./models/reportManage/runqianReport')],*/
      component: () => import('./routes/ReportManage/RunqianReport/'),
    },{
      path: '/fanruanReport/:id',
  /*    models: () => [import('./models/reportManage/fanruanReport')],*/
      component: () => import('./routes/ReportManage/FanruanReport/'),
    },{
      path: '/Flexiblequery',
      component: () => import('./routes/flexiblequery/'),
    },  {
      path: '/loglistener',
      models: () => [import('./models/loglistener')],
      component: () => import('./routes/loglistener'),
    },{
      path: '/connectionIndex',
      models: () => [import('./models/connectionManage/connectionIndex')],
      component: () => import('./routes/ConnectionManage'),
    },{
      path: '/connManage',
      models: () => [import('./models/reportManage/connManager')],
      component: () => import('./routes/ReportManage/ConnManage/'),
    },{
      path: '/newModelManage',
      models: () => [import('./models/reportManage/newModelManage')],
      component: () => import('./routes/ReportManage/NewModelManage/'),
    },{
      path: '/indexMgr',
      models: () => [import('./models/IndexLibMgr/indexMgr')],
      component: () => import('./routes/IndexLibMgr/IndexMgr/'),
    },{
      path: '/IndexTree',
      models: () => [import('./models/IndexLibMgr/indexTree')],
      component: () => import('./routes/IndexLibMgr/IndexTree/'),
    },{
      path: '/businessIndex',
      models: () => [import('./models/businessManage/businessIndex')],
      component: () => import('./routes/BusinessManage'),
    },{
      path: '/adhocIndex',
      models: () => [import('./models/adhocquery')],
      component: () => import('./routes/adhocquery'),
    },{
      path: '/analysisIndex',
      models: () => [import('./models/analysisIndex')],
      component: () => import('./routes/analysisIndex'),
    },{
      path: '/custommetricIndex',
      models: () => [import('./models/custommetric')],
      component: () => import('./routes/custommetric'),
    },{
      path: '/datasupplement',
      models: () => [import('./models/datasupplement')],
      component: () => import('./routes/datasupplement'),
    },{
      path: '/fileIndex',
      models: () => [import('./models/filemanage')],
      component: () => import('./routes/filemanage'),
    },{
      path: '/imageuploading',
      models: () => [import('./models/imageuploading')],
      component: () => import('./routes/imageuploading'),
    },{
      path: '/imagequery',
      models: () => [import('./models/imagequery')],
      component: () => import('./routes/imagequery'),
    },
    {
      path: '/DimensionsMgr',
      models: () => [import('./models/IndexLibMgr/dimensionsmgr')],
      component: () => import('./routes/IndexLibMgr/DimensionsMgr/'),
    },
    {
      path: '/IndexQuery',
      models: () => [import('./models/IndexLibMgr/indexquery')],
      component: () => import('./routes/IndexLibMgr/IndexQuery/'),
    },
    {
      path: '/IndexRunListen',
      models: () => [import('./models/IndexLibMgr/indexrunlisten')],
      component: () => import('./routes/IndexLibMgr/IndexRunListen/'),
    },{
      path: '/CustomReportQuery',
      models: () => [import('./models/customReportQuery')],
      component: () => import('./routes/CustomReportQuery/'),
    },



  ]

  return (
    <ConnectedRouter history={history}>
      <LocaleProvider locale={zhCN}>
        <App>
          <Switch>
            <Route path="/" exact render={() => (<Redirect to="/dashboard" />)} />
            {
              routes.map(({ path, ...dynamics }, key) => (
                <Route key={key}
                  exact
                  path={path}
                  component={dynamic({
                    app,
                    ...dynamics,
                  })}
                /* component={dynamic({
                 app,
                 models: () => [import("./models"+path)],
                 component: () => import("./routes"+path),

               })}*/
                />
              ))
            }
            <Route component={error} />
          </Switch>
        </App>
      </LocaleProvider>
    </ConnectedRouter>
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
