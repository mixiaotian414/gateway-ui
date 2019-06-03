import {request,config} from 'utils'

const {api} =config


const pagecommen ={"PAGE_COND":{"LIMIT":5,"PAGENUM":1}}
export async function query (params) {
  let data ={
    ...params,
    ...pagecommen,
    "PARAMS":{"paraCode":"200005"}
  }
  return request({
    url:  '/api/v1/reportQuery',
    method: 'get',
    data,
  })
}

export async function querySelectTree (params) {
  let data ={
    ...params,
    ...pagecommen,
    "PARAMS":{"paraCode":"200005"}
  }
  return request({
    url:  '/api/v1/querySelectTree',
    method: 'get',
    data,
  })
}

