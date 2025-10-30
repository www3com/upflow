import { deleteFlow, listFlows, listFlowTags, updateFlowTag } from '@/api/flow';
import { CreateFlowReq, Flow, UpdateFlowTagReq } from '@/types/flow';
import { AsyncState, createAsyncState, runAsync } from '@/utils/async-state';
import { proxy } from 'valtio';

export const state = proxy({
  // 工作流列表相关状态
  flow: createAsyncState<Flow[]>() as AsyncState<Flow[]>,
  // 标签相关状态
  tag: createAsyncState<String[]>() as AsyncState<String[]>,
  loadState: createAsyncState() as AsyncState<void>,
});

// ==================== 工作流列表管理相关函数 ====================

// 获取标签列表
export const fetchTags = async () => {
  await runAsync(state.tag, listFlowTags);
};

// 更新工作流标签
export const editFlowTag = async (data: UpdateFlowTagReq) => {
  await runAsync(state.loadState, updateFlowTag, data);
  const index = state.flow.data!.findIndex((flow) => flow.id === data.flowId);
  if (index !== -1) {
    state.flow.data![index] = { ...state.flow.data![index], tags: data.tags };
  }
};

// 获取工作流列表
export const fetchFlows = async () => {
  await runAsync(state.flow, listFlows);
};

// 创建新工作流
export const createFlow = async (data: CreateFlowReq) => {
  await createFlow(data);
  await fetchFlows();
};

// 删除工作流
export const removeFlow = async (id: string) => {
  await deleteFlow(id);
  await fetchFlows();
};

// 复制工作流
export const duplicateFlow = async (id: string, name: string) => {
  await duplicateFlow(id, name);
  await fetchFlows();
};
