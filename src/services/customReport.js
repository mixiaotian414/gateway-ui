import {request} from 'utils'

export async function query (params) {
  return request({
    url:  '/gateway/modelquery.json',
    method: 'post',
    data:params,
  })
}
export async function otherdataview (params) {
  return request({
    url: '/gateway/dimensionview.json',
    method: 'post',
    data:params,
  })
}
export async function dataview(params) {
  return request({
    url: '/gateway/dimensionview.json',
    method: 'POST',
    data: params,
  })
}
