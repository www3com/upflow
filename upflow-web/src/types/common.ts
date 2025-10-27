interface ObjectType<T> {
  [key: string]: T;
}

interface TreeType {
  id: number;
  name: string;
  parentId: number;
  children?: TreeType[];
}

interface PageReq {
  pageNo?: number;
  pageSize?: number;
}

// 分页列表返回参数
interface PageRes<T> {
  total: number; // 总数量
  items: T[];
}

interface ListItem {
  label: string;
  value: number | string;
}

interface R<T> {
  readonly code: number;
  readonly data?: T;
  readonly message?: string;
}
