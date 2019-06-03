import {request,config} from 'utils'

const {api} =config


const pagecommen ={"PAGE_COND":{"LIMIT":5,"PAGENUM":1}}
export async function query (params) {
  return request({
    url:  '/gateway/deriveproddirtree.json',
    method: 'post',
    data:params,
  })
}
export async function deriveprodmkdir (params) {
  return request({
    url:  '/gateway/deriveprodmkdir.json',
    method: 'post',
    data:params,
  })
}

export async function querySelectTree (params) {
  return request({
    url:  '/api/v1/querySelectTree',
    method: 'get',
    data:params,
  })
}

