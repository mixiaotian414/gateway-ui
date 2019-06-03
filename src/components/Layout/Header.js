import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Popover, Layout , Tag, message} from 'antd'
import classnames from 'classnames'
import styles from './Header.less'
import Menus from './Menu'
import NoticeIcon from '../../components/NoticeIcon';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import avatarURL from '../NoticeIcon/message.png'
const { SubMenu } = Menu

const Header = ({
  user, logout, switchSider,dispatch, siderFold, isNavbar,chpasswd,userinfo, menuPopoverVisible, location, switchMenuPopover, navOpenKeys, changeOpenKeys, menu,fetchingNotices,notices,currentUser
}) => {
  let handleClickMenu = (e) => {
    if(e.key === 'logout'){
      logout()
    }
    if(e.key === 'userinfo'){
      userinfo()
    }
    if(e.key === 'chpasswd'){
      chpasswd()
    }
  }
  const menusProps = {
    menu,
    siderFold: false,
    darkTheme: false,
    isNavbar,
    handleClickNavMenu: switchMenuPopover,
    location,
    navOpenKeys,
    changeOpenKeys,
  }
  const getNoticeData=()=> {
    const {notifyList=[]} = notices
    if (notifyList.length === 0) {
      return {};
    }

    const newNotices = notifyList.map((notice) => {
      const newNotice = { ...notice,avatar:avatarURL };

      if (newNotice.lastUpdateTime) {
        newNotice.lastUpdateTime = moment(notice.lastUpdateTime).fromNow();
      }
      if (newNotice.notifyId) {
        newNotice.key = newNotice.notifyId;
      }
      return newNotice;
    });
    return newNotices;
  }
  const handleNoticeClear = (tabProps) => {
    console.log(tabProps)

    const notifiIdlist = []
    const list = tabProps.list.map((item) => {

      notifiIdlist.push(parseInt(item.notifyId))

    });

    dispatch({
      type: 'app/clearNotices',
      payload: {
        appId:user.appId,
        userId:user.userId,
        notifyIds:notifiIdlist,
      },
    }).then(()=>{
      dispatch({
        type: 'app/fetchNotices',
        payload: {
          appId:user.appId,
          userId:user.userId,
        },
      });
    });
  }
  const noticeData = getNoticeData();
  const handleNoticeVisibleChange = (visible) => {
    if (visible) {
      dispatch({
        type: 'app/fetchNotices',
        payload: {
          appId:user.appId,
          userId:user.userId,
        },
      });
    }
  }

  return (
    <Layout.Header className={styles.header}>
      {isNavbar
        ? <Popover placement="bottomLeft" onVisibleChange={switchMenuPopover} visible={menuPopoverVisible} overlayClassName={styles.popovermenu} trigger="click" content={<Menus {...menusProps} />}>
          <div className={styles.button}>
            <Icon type="bars" />
          </div>
        </Popover>
        : <div
          className={styles.button}
          onClick={switchSider}
        >
          <Icon type={classnames({ 'menu-unfold': siderFold, 'menu-fold': !siderFold })} />
        </div>}
      <div className={styles.rightWarpper}>
        <NoticeIcon
          className={styles.button}
          count={currentUser.notifyCount}
          onItemClick={(item,tabProps) => {
            dispatch({
              type: 'app/clearNotices',
              payload: {
                appId:user.appId,
                userId:user.userId,
                notifyIds:[parseInt(item.notifyId)],
              },
            }).then(()=>{
              dispatch({
                type: 'app/fetchNotices',
                payload: {
                  appId:user.appId,
                  userId:user.userId,
                },
              });
            });
          }}
          onTabClick={() => {
            dispatch({
              type: 'app/jumpNotice',
            })
          }}
          onClear={handleNoticeClear}
          onPopupVisibleChange={handleNoticeVisibleChange}
          loading={fetchingNotices}
          popupAlign={{ offset: [20, -16] }}
        >
          <NoticeIcon.Tab
            list={noticeData}
            title="通知"
            emptyText="你已查看所有通知"
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
          />
        </NoticeIcon>
        <Menu mode="horizontal" onClick={e=>handleClickMenu(e)}>
          <SubMenu
            style={{
              float: 'right',
            }}
            title={<span>
              <Icon type="user" />
              {user.name}
            </span>}
          >
            <Menu.Item key="userinfo">
              个人信息
            </Menu.Item>
            <Menu.Item key="chpasswd">
              密码修改
            </Menu.Item>
            <Menu.Item key="logout">
              退出
            </Menu.Item>
          </SubMenu>
        </Menu>


        <Menu mode="horizontal">
          <SubMenu
            style={{
              float: 'right',
            }}
            title={<span>
              <Icon type="laptop" />
              子系统
            </span>}
          >
            <Menu.Item key="report">
              <a href="http://59.108.47.37:90/" target="_blank">报表系统</a>
            </Menu.Item>
            <Menu.Item key="control">
              <a href="http://59.108.47.37:5080/flow-base/" target="_blank">调度平台</a>
            </Menu.Item>
            <Menu.Item key="dimensions">
              <a href="http://59.108.47.37:8080/" target="_blank">多维分析</a>
            </Menu.Item>
            {/*<Menu.Item key="monitor">*/}
              {/*<a href="javascript:;">监控平台</a>*/}
            {/*</Menu.Item>*/}
          </SubMenu>
        </Menu>
      </div>
    </Layout.Header>
  )
}

Header.propTypes = {
  menu: PropTypes.array,
  user: PropTypes.object,
  logout: PropTypes.func,
  switchSider: PropTypes.func,
  siderFold: PropTypes.bool,
  isNavbar: PropTypes.bool,
  menuPopoverVisible: PropTypes.bool,
  location: PropTypes.object,
  switchMenuPopover: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Header
