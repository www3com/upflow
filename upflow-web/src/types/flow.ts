import { Edge, Node, XYPosition } from '@xyflow/react';

/**
 * 支持的脚本语言类型
 */
export type ScriptLanguage = 'javascript' | 'python';

/**
 * 变量校验规则
 */
export interface Rule {
  type: string;
  value?: string | boolean;
  message?: string;
}

/**
 * 支持的变量数据类型
 */
export type VariableKind =
  | 'STRING'
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
 * 变量树形节点接口
 */
export interface VariableNode {
  label: string;
  value?: VariableKind;
  tag?: string;
  children?: VariableNode[];
}

/**
 * 变量
 */
export interface Variable {
  id: string;
  name: string;
  type: VariableKind;
  value?: string;
  rules?: Rule[];
}

/**
 * 节点类型
 */
export interface NodeType<T extends Record<string, any>> extends Node {
  id: string;
  type: string;
  data: T;
  position: XYPosition;
  width?: number;
  height?: number;
  dragging?: boolean;
  draggable?: boolean;
}

export interface EdgeType<T extends Record<string, any>> extends Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  data?: T;
}

/**
 * 节点配置项
 */
export interface NodeDefineType {
  icon: string;
  renderComponent: React.ComponentType<any>;
  attributeEditor?: React.ComponentType<any>;
  defaultConfig?: NodeType<any>;
}

/**
 * 开始节点类型
 */
export interface StartNodeType {
  title?: string;
  description?: string;
  input?: Variable[];
}

/**
 * 脚本节点类型
 */
export interface EndNodeType {
  title?: string;
  description?: string;
  outputVars?: Variable[];
  outputText?: string;
  outputTextStream?: boolean;
}

/**
 * 条件分支 - 条件
 */
export interface Condition {
  varId: string;
  opr: string;
  value: string;
}

/**
 * 条件分支 - 条件
 */
export interface Case {
  id: string;
  opr: string;
  conditions: Condition[];
}

/**
 * 条件分支
 */
export interface CaseNodeType {
  title?: string;
  description?: string;
  cases: Case[];
}

/**
 * 循环节点类型
 */
export interface LoopNodeType {
  title?: string;
  description?: string;
  type: 'for' | 'while' | 'forever';
  forVarId?: string;
  whileNumber?: number;
  bodyVarName: string;
  bodyIndexName: string;
  group: boolean;
  expanded: boolean;
}

/**
 * 脚本节点类型
 */
export interface CodeNodeType {
  title?: string;
  description?: string;
  language: ScriptLanguage;
  content: string;
  input?: Variable[];
  output?: Variable[];
  timeout?: number;
  /** 是否启用调试模式 */
  debug?: boolean;
}

export interface SqlNodeType {
  title?: string;
  description?: string;
  connKey: string;
  content: string;
  input?: Variable[];
  output?: Variable[];
}

export interface SqlTransactionNodeType {
  title?: string;
  description?: string;
  connKey: string;
  group: boolean;
  expanded: boolean;
}

export interface SubFlowNodeType {
  title?: string;
  description?: string;
  flowId: string;
  input?: Variable[];
  output?: Variable[];
}

export interface NoteNodeType {
  title?: string;
  description?: string;
  content: string;
}
