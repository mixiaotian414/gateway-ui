import {request,config} from 'utils'

const {api} =config
const {tradeMachine} = api

const pagecommen ={"PAGE_COND":{"LIMIT":5,"PAGENUM":1}}
export async function query (params) {
  return request({
    url: '/api/v1/reportQueryDetail/:id',
    method: 'get',
    data: params,
  })
}
