interface ObjectType<T> {
  [key: string]: T
}
interface ListItemType {
  label: string
  value: number | string
}

export interface Rule {
  type: string,
  value?: string | boolean,
  message?: string
}

export interface Variable {
  name: string,
  type: string,
  value: string
  rules?: Rule[]
}

interface NodeDataType {
  title: string
  input?: Variable[]
  output?: Variable
  detail?: any
}

interface NodeCfgType {
  icon: string
  node: any
  attr?: any
  data: NodeDataType
}

/**
 * 条件分支 - 条件
 */
export interface Condition {
  nodeId: string,
  varName: string,
  varType: string,
  opr: string,
  value: string
}

/**
 * 条件分支 - 条件
 */
export interface Case {
  id: string,
  opr: string,
  conditions: Condition[],
}