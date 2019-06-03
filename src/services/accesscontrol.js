import { request, config } from 'utils'

const { api } = config
const { visitIpList } = api

export async function getVisitIpList(params) {
  return request({
    url: '/gateway/visitIpList.json',
    method: 'post',
    data: params,
  })
}

export async function delList(params) {
  return request({
    url: '/gateway/visitIpsDel.json',
    method: 'post',
    data: params,
  })
}

export async function addVisitIps(params) {
  return request({
    url: '/gateway/disabledVisitIps.json',
    method: 'post',
    data: params,
  })
}
export async function delVisitIps(params) {
  return request({
    url: '/gateway/disabledVisitIpsDel.json',
    method: 'post',
    data: params,
  })
}
