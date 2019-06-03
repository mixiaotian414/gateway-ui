import { request, config } from 'utils'

const { api } = config
const { userSetting } = api

export async function user_list(params) {
  return request({
    url: '/gateway/userlist.json',
    method: 'post',
    data: params,
  })


}

export async function user_delete(params) {
  return request({
    url: '/gateway/userdelete.json',
    method: 'post',
    data: params,
  })
}

export async function userbusslist(params) {
  return request({
    url: '/gateway/userbusslist.json',
    method: 'post',
    data: params,
  })
}


export async function user_load(params) {
  return request({
    url: '/gateway/userload.json',
    method: 'post',
    data: params,
  })
}
export async function user_add(params) {
  return request({
    url: '/gateway/useradd.json',
    method: 'post',
    data: params,
  })
}
export async function user_save(params) {
  return request({
    url: '/gateway/usersave.json',
    method: 'post',
    data: params,
  })
}
export async function getSelectList(params) {
  return request({
    url: 'gateway/secdictselect.json',
    method: 'POST',
    data: params,
  })
}
//角色
export async function queryPersonnelrole(params) {
  return request({
    url: '/gateway/roleallrole.json',
    method: 'post',
    data: params,
  })
}
//密码重置
export async function userpassword(params) {
  return request({
    url: '/gateway/userpassword.json',
    method: 'post',
    data: params,
  })
}
//角色关联取值
export async function userchecklist(params) {
  return request({
    url: '/gateway/userchecklist.json',
    method: 'post',
    data: params,
  })
}
//角色关联保存
export async function useruserrole(params) {
  return request({
    url: '/gateway/useruserrole.json',
    method: 'post',
    data: params,
  })
}

export async function organizationtree(params) {
  return request({
    url: '/gateway/organizationtree.json',
    method: 'post',
    data: params,
  })
}
export async function organizationtreetwo(params) {
  return request({
    url: '/gateway/organizationtree.json',
    method: 'post',
    data: params,
  })
}

export async function UserLockOrUnlock(params) {
  return request({
    url: '/gateway/userlock.json',
    method: 'post',
    data: params,
  })
}