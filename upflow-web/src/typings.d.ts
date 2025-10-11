interface ObjectType<T> {
    [key: string]: T
}

interface ListItemType {
    label: string
    value: number | string
}

/**
 * 节点类型
 */
interface NodeType {
    id: string
    type: string
    position: { x: number, y: number }
    data: any
    width?: number
    height?: number
    dragging?: boolean
    draggable?: boolean
}

/**
 * 节点配置项
 */
interface NodeDefineType {
    icon: string
    renderComponent: React.ComponentType<any>
    propertiesEditor?: React.ComponentType<any>
    defaultConfig?: NodeType
}

/**
 * 开始节点
 */
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

interface StartNodeType {
    title?: string
    description?: string
    variables?: Variable[]
    group?: boolean
    expanded?: boolean
    hidden?: boolean
}


/**
 * 条件分支 - 条件
 */
export interface Condition {
    nodeId: string,
    varName: string,
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

/**
 * 循环节点类型
 */
export interface LoopNodeType {
    title?: string
    description?: string
    type: 'for' | 'while' | 'forever'
    forNodeId?: string,
    forVarName?: string,
    whileNumber?: number,
    bodyVarName: string,
    bodyIndexName: string,
}