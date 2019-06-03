import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown, Button, Icon, Menu } from 'antd'

/***
 * @title 用于超链接/link等按钮功能
 * @param FuncListBtn 功能集合
 * @param btnCode  功能Code
 * @param btnText  功能名称
 * @returns {XML}
 * @constructor
 * @author:chenshuai
 * @time:2018/6/21
 */
const MenuButton = ({
  FuncListBtn = [], btnCode = "", btnText = "",
}) => {
  const menuitem = FuncListBtn.map((item, key) => (item.funcCode === btnCode&&item.isRole===true ? <span key={btnCode}>{btnText}</span> : null))
  const btn =(<span>{btnText}</span>)
  return (
    btnCode===""? btn : menuitem
  )
}

MenuButton.propTypes = {
  FuncListBtn: PropTypes.array.isRequired,
}
export default MenuButton
