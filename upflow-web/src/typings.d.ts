import {Edge, Node} from '@xyflow/react';

interface ObjectType<T> {
    [key: string]: T
}

interface ListItemType {
    label: string
    value: number | string
}

/**
 * 支持的脚本语言类型
 */
export type ScriptLanguage = 'javascript' | 'python'

/**
 * 开始节点
 */
export interface Rule {
    type: string,
    value?: string | boolean,
    message?: string
}

/**
 * 支持的变量类型
 */
export type VariableType =
    'STRING'
    | 'INTEGER'
    | 'LONG'
    | 'DECIMAL'
    | 'BOOLEAN'
    | 'OBJECT'
    | 'FILE'
    | 'FILE_IMAGE'
    | 'FILE_VIDEO'
    | 'FILE_AUDIO'
    | 'FILE_DOC'
    | 'FILE_OTHER'
    | 'ARRAY'
    | 'ARRAY_STRING'
    | 'ARRAY_INTEGER'
    | 'ARRAY_LONG'
    | 'ARRAY_DECIMAL'
    | 'ARRAY_BOOLEAN'
    | 'ARRAY_OBJECT'
    | 'ARRAY_FILE_IMAGE'
    | 'ARRAY_FILE_VIDEO'
    | 'ARRAY_FILE_AUDIO'
    | 'ARRAY_FILE_DOC'
    | 'ARRAY_FILE_OTHER';

/**
 * 变量
 */
export interface Variable {
    id: string,
    name: string,
    type: VariableType,
    value?: string
    rules?: Rule[]
}

/**
 * 节点类型
 */
interface NodeType<T> extends Node {
    id: string
    type: string
    position?: { x: number, y: number }
    data: T
    width?: number
    height?: number
    dragging?: boolean
    draggable?: boolean
}

interface EdgeType<T> extends Edge {
    id: string
    source: string
    target: string
    sourceHandle?: string
    targetHandle?: string
    data?: T
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
 * 开始节点类型
 */
interface StartNodeType {
    title?: string
    description?: string
    input?: Variable[]
}

/**
 * 条件分支 - 条件
 */
export interface Condition {
    varId: string
    opr: string
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
 * 条件分支
 */
export interface CaseNodeType {
    title?: string
    description?: string
    cases: Case[]
}

/**
 * 循环节点类型
 */
export interface LoopNodeType {
    title?: string
    description?: string
    type: 'for' | 'while' | 'forever'
    forVarId?: string
    whileNumber?: number,
    bodyVarName: string,
    bodyIndexName: string,
    group: boolean,
    expanded: boolean
}

/**
 * 脚本节点类型
 */
export interface CodeNodeType {
    title?: string
    description?: string
    language: ScriptLanguage
    content: string
    input?: Variable[]
    output?: Variable[]
    timeout?: number
    /** 是否启用调试模式 */
    debug?: boolean
}

export interface SqlNodeType {
    title?: string
    description?: string
    connKey: string
    content: string
    input?: Variable[]
    output?: Variable[]
}

export interface SqlTransactionNodeType {
    title?: string
    description?: string
    connKey: string
    group: boolean
    expanded: boolean
}

export interface SubFlowNodeType {
    title?: string
    description?: string
    flowId: string
    input?: Variable[]
    output?: Variable[]
}

export interface NoteNodeType {
    title?: string
    description?: string
    content: string
}