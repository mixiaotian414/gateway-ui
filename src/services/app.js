import { request, config } from 'utils'

const { api } = config
const { user, userLogout, userLogin, getNotice } = api

export function login(params) {
  return request({
    url: userLogin,
    method: 'post',
    data: params,
  })
}

export function logout(params) {
  return request({
    url: userLogout,
    method: 'post',
    data: params,
  })
}
export function userbusslist(params) {
  return request({
    url: "/gateway/userbusslist.json",
    method: 'post',
    data: params,
  })
}

export function query(params) {
  return request({
    url: user,
    method: 'post',
    data: params,
  })
}
export function chpasswd(params) {
  return request({
    url: "/gateway/userchangepwd.json",
    method: 'post',
    data: params,
  })
}
export function validateVal(params) {
  return request({
    url: "/gateway/utilsvalidateVal.json",
    method: 'post',
    data: params,
  })
}
export async function queryNotices(params) {
  return request({
    url: "/gateway/sysnotifylist.json",
    method: 'post',
    data: params,
  });
}
export async function clearNotices(params) {
  return request({
    url: "/gateway/sysnotifyClean.json",
    method: 'post',
    data: params,
  });
}
export async function user_load(params) {
  return request({
    url: "/gateway/userload.json",
    method: 'post',
    data: params,
  });
}
export async function loginroleRouters(params) {
  return request({
    url: "/gateway/loginroleRouters.json",
    method: 'post',
    data: params,
  });
}

export async function userFuncList(params) {
  return request({
    url: "/gateway/userFuncList.json",
    method: 'post',
    data: params,
  });
}

export async function settheme(params) {
  return request({
    url: "/gateway/userchangestyle.json",
    method: 'post',
    data: params,
  });
}
