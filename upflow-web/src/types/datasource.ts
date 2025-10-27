// 数据库链接类型定义
export interface DatabaseConnection {
  id: string;
  name: string;
  key: string;
  url: string;
  username: string;
  password: string;
  type: string;
  createTime: string;
}

// 数据库链接列表查询参数
export interface DatabaseConnectionQuery extends PageReq {
  name?: string;
  type?: string;
}
