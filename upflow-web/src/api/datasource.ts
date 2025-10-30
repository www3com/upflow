import { Connection, ConnectionReq } from '@/types/datasource';
import request from '../utils/request';

// 获取数据库链接列表
export async function getConnections(params?: ConnectionReq) {
  return request.get('/datasource/connections', params);
}

// 新增数据库链接
export async function createConnection(data: Connection) {
  return request.post('/datasource/connections', data);
}

// 更新数据库链接
export async function updateConnection(id: string, data: Connection) {
  return request.put(`/datasource/connections/${id}`, data);
}

// 删除数据库链接
export async function deleteConnection(id: string) {
  return request.delete(`/datasource/connections/${id}`);
}
