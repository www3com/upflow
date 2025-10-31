import { getWorkspaces } from '@/api/workspace'; // 工作空间状态管理
import { proxy } from 'valtio';
import { AsyncState, createAsyncState, runAsync } from '@/utils/async-state';

// 本地缓存键名
const CURRENT_WORKSPACE_KEY = 'CURRENT_WORKSPACE';

// 工作空间状态管理
interface WorkspaceState {
  asyncWorkspaces: AsyncState<Workspace[]>;
  currWorkspace: Workspace | null;
}

export const workspaceState = proxy<WorkspaceState>({
  asyncWorkspaces: createAsyncState([]),
  currWorkspace: null,
});

// 初始化工作空间状态
export const initWorkspace = async () => {
  // 先从缓存加载当前工作空间
  loadCurrentWorkspaceFromCache();
  // 然后获取最新的工作空间列表
  await fetchWorkspaces();
};

// 获取工作空间列表
export const fetchWorkspaces = async () => {
  await runAsync(workspaceState.asyncWorkspaces, getWorkspaces);

  // 如果没有当前工作空间且有可用工作空间，设置第一个为当前工作空间
  if (!workspaceState.currWorkspace && workspaceState.asyncWorkspaces.data!.length > 0) {
    switchWorkspace(workspaceState.asyncWorkspaces.data![0]);
  }
};

// 切换工作空间
export const switchWorkspace = (workspace: Workspace) => {
  workspaceState.currWorkspace = workspace;
  saveCurrentWorkspaceToCache(workspace);
};

// 从本地缓存获取当前工作空间
const loadCurrentWorkspaceFromCache = () => {
  try {
    const cached = localStorage.getItem(CURRENT_WORKSPACE_KEY);
    if (cached) {
      workspaceState.currWorkspace = JSON.parse(cached);
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
