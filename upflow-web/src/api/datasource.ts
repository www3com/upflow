import { Connection, ConnectionReq } from '@/types/datasource';
import request from '../utils/request';

// 获取数据库链接列表
export async function getConnections(params?: ConnectionReq): Promise<R<Connection[]>> {
  return request.get('/datasource/connections', params);
}

// 新增数据库链接
export async function createConnection(data: Connection): Promise<R<Connection>> {
  return request.post('/datasource/connections', data);
}

// 更新数据库链接
export async function updateConnection(id: string, data: Connection): Promise<R<Connection>> {
  return request.put(`/datasource/connections/${id}`, data);
}

// 删除数据库链接
export async function deleteConnection(id: string): Promise<R<void>> {
  return request.delete(`/datasource/connections/${id}`);
}
