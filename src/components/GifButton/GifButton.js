import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'

/***
 * 功能按钮组件
 * @param onBtnClick 点击事件
 * @param FuncListBtn 功能集合
 * @param btnCode 功能Code
 * @param btnText 按钮名称
 * @param btnType  按钮Type
 * @param btnIcon  按钮图标
 * @returns {XML}
 * @constructor
 * @author:chenshuai
 * @time:2018/6/21
 */
const GifButton = ({
   onBtnClick, FuncListBtn=[], btnCode="", btnText="",btnType="",btnIcon="",style={},
}) =>{
  const gifbtn = FuncListBtn.map((item,key)=>(item.funcCode===btnCode&&item.isRole===true?<Button type={btnType} icon={btnIcon} style={style} key={key} onClick={onBtnClick}>{btnText}</Button>:null))
  const btn = (<Button type={btnType} icon={btnIcon} style={style} onClick={onBtnClick} >{btnText}</Button>)
  return(
    btnCode ===""? btn : gifbtn
  )
}
GifButton.propTypes = {
  onBtnClick: PropTypes.func,
  FuncListBtn: PropTypes.array.isRequired,
}
export default GifButton
