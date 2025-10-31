import { createFlow, deleteFlow, listFlows, listFlowTags, updateFlowTag } from '@/api/flow';
import { CreateFlowReq, Flow, UpdateFlowTagReq } from '@/types/flow';
import { AsyncState, createAsyncState, runAsync } from '@/utils/async-state';
import { proxy } from 'valtio';

export interface FlowState {
  asyncFlows: AsyncState<Flow[]>;
  asyncTags: AsyncState<string[]>;
  loadState: AsyncState<void>;
}

export const state = proxy<FlowState>({
  // 工作流列表相关状态
  asyncFlows: createAsyncState(),
  // 标签相关状态
  asyncTags: createAsyncState(),
  loadState: createAsyncState(),
});

// ==================== 工作流列表管理相关函数 ====================

// 获取标签列表
export const fetchTags = async () => {
  await runAsync(state.asyncTags, listFlowTags);
};

// 更新工作流标签
export const editFlowTag = async (data: UpdateFlowTagReq) => {
  await runAsync(state.loadState, updateFlowTag, data);
  const index = state.asyncFlows.data!.findIndex((flow) => flow.id === data.flowId);
  if (index !== -1) {
    state.asyncFlows.data![index] = { ...state.asyncFlows.data![index], tags: data.tags };
  }
};

// 获取工作流列表
export const fetchFlows = async () => {
  await runAsync(state.asyncFlows, listFlows);
};

// 创建新工作流
export const addFlow = async (data: CreateFlowReq) => {
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
