import request from './request'

export class ApiService {
  constructor(url) {
    this.baseUrl = url;
  }

  //获取列表数据
  list(query) {
    return request({
      url: this.baseUrl + '/list',
      method: 'get',
      params: query
    })
  }

  //新增数据
  create(data) {
    return request({
      url: this.baseUrl + '/create',
      method: 'post',
      data: data
    })
  }

  //修改数据
  update(data) {
    return request({
      url: this.baseUrl + '/update',
      method: 'put',
      data: data
    })
  }

  //删除数据
  delete(id) {
    return request({
      url: this.baseUrl + '/delete/' + id,
      method: 'delete'
    })
  }

  //获取数据详情
  view(id) {
    return request({
      url: this.baseUrl + '/view/' + id,
      method: 'get'
    })
  }
}