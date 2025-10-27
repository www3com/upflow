import { DatabaseConnection, DatabaseConnectionQuery } from '@/types/datasource';
import request from '../utils/request';

// 获取数据库链接列表
export async function getConnections(params?: DatabaseConnectionQuery) {
  return request.get('/datasource/connections', params);
}

// 新增数据库链接
export async function createConnection(data: DatabaseConnection) {
  return request.post('/datasource/connections', data);
}

// 更新数据库链接
export async function updateConnection(id: string, data: DatabaseConnection) {
  return request.put(`/datasource/connections/${id}`, data);
}

// 删除数据库链接
export async function deleteConnection(id: string) {
  return request.delete(`/datasource/connections/${id}`);
}
