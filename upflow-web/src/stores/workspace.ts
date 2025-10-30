import * as workspaceService from '@/api/workspace';
import { proxy } from 'valtio';
import { AsyncState, createAsyncState, runAsync } from '@/utils/async-state';

// 工作空间状态管理
interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  loading: boolean;
  ws: AsyncState<[]>;
}

export const workspaceState = proxy<WorkspaceState>({
  workspaces: [],
  currentWorkspace: null,
  loading: false,
  ws: createAsyncState(),
});

// 本地缓存键名
const CURRENT_WORKSPACE_KEY = 'CURRENT_WORKSPACE';

// 获取工作空间列表
export const fetchWorkspaces = async () => {
  let r = await runAsync(workspaceState.ws, workspaceService.getWorkspaces);
  console.log('Workspaces:', r);
  workspaceState.loading = true;
  try {
    const res = await workspaceService.getWorkspaces();
    workspaceState.workspaces = res.data || [];

    // 如果没有当前工作空间且有可用工作空间，设置第一个为当前工作空间
    if (!workspaceState.currentWorkspace && workspaceState.workspaces.length > 0) {
      switchWorkspace(workspaceState.workspaces[0]);
    }
  } catch (error) {
    console.error('Failed to fetch workspaces:', error);
    workspaceState.workspaces = [];
  } finally {
    workspaceState.loading = false;
  }
};

// 切换工作空间
export const switchWorkspace = (workspace: Workspace) => {
  workspaceState.currentWorkspace = workspace;
  saveCurrentWorkspaceToCache(workspace);
};

// 初始化工作空间状态
export const initWorkspace = async () => {
  // 先从缓存加载当前工作空间
  loadCurrentWorkspaceFromCache();
  // 然后获取最新的工作空间列表
  await fetchWorkspaces();
};

// 从本地缓存获取当前工作空间
const loadCurrentWorkspaceFromCache = () => {
  try {
    const cached = localStorage.getItem(CURRENT_WORKSPACE_KEY);
    if (cached) {
      workspaceState.currentWorkspace = JSON.parse(cached);
    }
  } catch (error) {
    console.error('Failed to load workspace from cache:', error);
  }
};

// 保存当前工作空间到本地缓存
const saveCurrentWorkspaceToCache = (workspace: Workspace) => {
  try {
    localStorage.setItem(CURRENT_WORKSPACE_KEY, JSON.stringify(workspace));
  } catch (error) {
    console.error('Failed to save workspace to cache:', error);
  }
};
