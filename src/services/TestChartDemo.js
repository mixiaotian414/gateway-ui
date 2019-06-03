import { request, config } from 'utils'

const { api } = config
const { chartdemo } = api

export function query(params) {
    return request({
        url: chartdemo,
        method: 'GET',
        data: params,
    })
}