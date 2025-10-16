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
    position?: { x: number, y: number }
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
    attributeEditor?: React.ComponentType<any>
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
    type: VARIABLE_TYPE,
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
    forVariable?: {
        nodeId: string,
        varName: string
    }
    whileNumber?: number,
    bodyVarName: string,
    bodyIndexName: string,
}

/**
 * 支持的脚本语言类型
 */
export type ScriptLanguage = 'javascript' | 'python'

/**
 * 支持的变量类型
 */
export type VariableType = 'string' | 'int' | 'long' | 'list' | 'boolean' | 'object'

/**
 * 变量引用类型 - 引用其他节点的变量
 */
export interface VariableReference {
    /** 引用的节点ID */
    nodeId: string
    /** 引用的变量名 */
    varName: string
}

/**
 * 脚本节点输入变量
 */
export interface ScriptInputVariable {
    /** 在脚本中使用的变量名 */
    name: string
    /** 变量引用 */
    value: VariableReference
}

/**
 * 脚本节点输出变量
 */
export interface ScriptOutputVariable {
    /** 变量名 */
    name: string
    /** 变量类型 */
    type: VariableType
}

/**
 * 脚本节点类型
 */
export interface ScriptNodeType {
    /** 节点标题 */
    title?: string
    /** 节点描述 */
    description?: string
    /** 脚本语言类型 */
    language: ScriptLanguage
    /** 脚本代码内容 */
    script: string
    /** 输入变量列表 */
    variables?: ScriptInputVariable[]
    /** 输出变量列表 */
    output?: ScriptOutputVariable[]
    /** 脚本执行超时时间（毫秒），默认30秒 */
    timeout?: number
    /** 是否启用调试模式 */
    debug?: boolean
}