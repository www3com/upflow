interface ObjectType<T> {
    [key: string]: T
}

interface ListItemType {
    label: string
    value: number | string
}

export interface Variable {
    name: string,
    type: string,
    value: string
    rules?: Rule[]
}

interface NodeDataType {
    title?: string
    description?: string
    input?: Variable[]
    output?: Variable
    detail?: any
    group?: boolean
    expanded?: boolean
    hidden?: boolean
}

interface NodeType {
    id: string
    type: string
    position: { x: number, y: number }
    data: NodeDataType
    width?: number
    height?: number
    dragging?: boolean
    draggable?: boolean
}

interface NodeCfgType {
    icon: string
    node: any
    data: NodeDataType
    width?: number
    height?: number
    position?: { x: number, y: number }
    attr?: any
    dragging?: boolean
    draggable?: boolean
}

/**
 * 开始节点
 */
export interface Rule {
    type: string,
    value?: string | boolean,
    message?: string
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