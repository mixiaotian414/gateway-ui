import { request, config } from 'utils'

const { api } = config
const { functionQuery } = api

//查询树列表
export async function query (params) {
  return request({
    url: functionQuery,
    method: 'post',
    data: params,
  })
}
//编辑取值
export async function queryid (params) {
  return request({
    url: '/gateway/functionload.json',
    method: 'post',
    data: params,
  })
}
//功能节点查询接口
export async function func_read (params) {
  return request({
    url: '/gateway/functionread.json',
    method: 'post',
    data: params,
  })
}
export async function del (params) {
  return request({
    url: '/gateway/functiondel.json',
    method: 'post',
    data: params,
  })
}
//添加保存
export async function add (params) {
  return request({
    url: '/gateway/functionadd.json',
    method: 'post',
    data: params,
  })
}
//修改保存
export async function update (params) {
  return request({
    url: '/gateway/functionsave.json',
    method: 'post',
    data: params,
  })
}
//接口列表
export async function queryapi (params) {
  return request({
    url: '/gateway/apilist.json',
    method: 'post',
    data: params,
  })
}
//接口信息绑定
export async function function_apisave (params) {
  return request({
    url: '/gateway/functionapisave.json',
    method: 'post',
    data: params,
  })
}
//接口信息取值
export async function function_apis (params) {
  return request({
    url: '/gateway/functionapis.json',
    method: 'post',
    data: params,
  })
}
//功能对应角色信息
export async function queryPersonnelrole (params) {
  return request({
    url: '/gateway/functionfrlist.json',
    method: 'post',
    data: params,
  })
}
//获取功能类型下拉列表
export async function getSelectList(params) {
  return request({
    url: 'gateway/secdictselect.json',
    method: 'post',
    data: params,
  })
}
export async function apiDetail(params) {
  return request({
    url: '/gateway/apiload.json',
    method: 'POST',
    data: params,
  })
}
