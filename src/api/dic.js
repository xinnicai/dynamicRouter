import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'version',
    method: 'get',
    params
  })
}
