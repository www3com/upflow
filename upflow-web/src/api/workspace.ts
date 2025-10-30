import request from '../utils/request';

// 获取工作空间列表
export async function getWorkspaces(): Promise<R<Workspace[]>> {
  return request.get('/workspaces');
}