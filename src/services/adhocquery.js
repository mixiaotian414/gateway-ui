import {request} from 'utils'

export async function query (params) {
  return request({
    url:  '/gateway/modelquery.json',
    method: 'post',
    data:params,
  })
}
export async function querychild (params) {
  return request({
    url:  '/gateway/categoriesquery.json',
    method: 'post',
    data:params,
  })
}
