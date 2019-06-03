import {request,config} from 'utils'

const {api} =config


const pagecommen ={"PAGE_COND":{"LIMIT":5,"PAGENUM":1}}
export async function query (data) {
/*
  let data ={
    ...params,
    ...pagecommen,
    "PARAMS":{"paraCode":"200005"}
  }
  return request({
    url:  '/api/v1/basicIndex',
    method: 'get',
    data,
  })
*/


  return request({
    url: '/gateway/derivesynbasictree.json',
    method: 'post',
    data,
  })

}export async function queryDetail (data) {
/*
  let data ={
    ...params,
    ...pagecommen,
    "PARAMS":{"paraCode":"200005"}
  }
  return request({
    url:  '/api/v1/basicIndex',
    method: 'get',
    data,
  })
*/


  return request({
    url: '/gateway/basicproddetail.json',
    method: 'post',
    data,
  })

}



