import { request, config } from 'utils'

const { api } = config
const { listdemo } = api

export function getLog(params) {
    return request({
        url: '/gateway/logsgetLogs.json',
        method: 'post',
        data: params,
    })
}