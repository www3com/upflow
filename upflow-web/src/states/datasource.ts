import * as datasourceService from '@/services/datasource';
import { DatabaseConnection } from '@/types/datasource';
import { proxy } from 'valtio';

// 数据库链接状态管理
interface DatasourceState {
  connections: DatabaseConnection[];
  loading: boolean;
  open: boolean;
  editConnection: DatabaseConnection | null;
}

export const datasourceState = proxy<DatasourceState>({
  connections: [],
  loading: false,
  open: false,
  editConnection: null,
});

// 获取数据库链接列表
export const fetchConnections = async () => {
  datasourceState.loading = true;
  const response = await datasourceService.getConnections();
  datasourceState.connections = response.data?.items || [];
  datasourceState.loading = false;
};

// 新增数据库链接
export const addConnection = async (connection: DatabaseConnection) => {
  const response = await datasourceService.createConnection(connection);
  datasourceState.connections.push(response.data);
  return response.data;
};

// 更新数据库链接
export const updateConnection = async (id: string, connection: DatabaseConnection) => {
  const response = await datasourceService.updateConnection(id, connection);
  const index = datasourceState.connections.findIndex((conn) => conn.id === id);
  if (index !== -1) {
    datasourceState.connections[index] = response.data;
  }
  return response.data;
};

// 删除数据库链接
export const deleteConnection = async (id: string) => {
  await datasourceService.deleteConnection(id);
  const index = datasourceState.connections.findIndex((conn) => conn.id === id);
  if (index !== -1) {
    datasourceState.connections.splice(index, 1);
  }
  return true;
};

// 打开新增/编辑弹窗
export const openModal = (connection?: DatabaseConnection) => {
  datasourceState.editConnection = connection || null;
  datasourceState.open = true;
};

// 关闭弹窗
export const closeModal = () => {
  datasourceState.open = false;
  datasourceState.editConnection = null;
};
