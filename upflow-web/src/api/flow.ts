import request from '@/utils/request';
import { CreateFlowReq, Flow, FlowDetail, UpdateFlowReq, UpdateFlowTagReq } from '@/types/flow';

// 获取单个工作流详情
export async function getFlow(id: string): Promise<R<FlowDetail>> {
  return request.get('/flows/detail', { id });
}

// 获取工作流列表
export async function listFlows(): Promise<R<Flow[]>> {
  return request.get('/flows');
}

// 创建新工作流
export async function createFlow(data: CreateFlowReq): Promise<R<Flow>> {
  return request.post('/flows', data);
}

// 更新工作流
export async function updateFlow(data: UpdateFlowReq): Promise<R<Flow>> {
  return request.put('/flows', data);
}

// 删除工作流
export async function deleteFlow(id: string): Promise<R<void>> {
  return request.delete('/flows', { id });
}

// 复制工作流
export async function duplicateFlow(data: CreateFlowReq): Promise<R<Flow>> {
  return request.post('/flows/duplicate', data);
}

// 获取标签列表
export async function listFlowTags(): Promise<R<string[]>> {
  return request.get('/flows/tags');
}

// 更新工作流标签
export async function updateFlowTag(data: UpdateFlowTagReq): Promise<R<void>> {
  return request.put('/flows/tags', data);
}

// 获取工作流目录树
export async function listFlowFolders(): Promise<R<any[]>> {
  return request.get('/flows/folders');
}

// 重命名工作流目录
export async function renameFlowFolder(id: string, name: string): Promise<R<void>> {
  return request.put('/flows/folders', { id, name });
}

// 新建工作流目录
export async function createFlowFolder(parentId: string | undefined, name: string): Promise<R<{ id: string; name: string; parentId?: string }>> {
  return request.post('/flows/folders', { parentId, name });
}

// 删除工作流目录
export async function deleteFlowFolder(id: string): Promise<R<void>> {
  return request.delete('/flows/folders', { id });
}
