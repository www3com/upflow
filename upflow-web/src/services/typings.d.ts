interface R<T> {
  readonly code: number
  readonly data?: T
  readonly message?: string
}

interface PageReq {
  pageNo?: number
  pageSize?: number
}

// 分页列表返回参数
interface PageRes<T> {
  total: number // 总数量
  items: T[]
}

interface TreeType {
  id: number
  name: string
  parentId: number
  children?: TreeType[]
}
