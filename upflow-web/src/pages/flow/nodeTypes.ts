import ConditionNode from '@/pages/flow/components/nodes/CaseNode';
import EditCaseNode from '@/pages/flow/components/nodes/CaseNode/EditCaseAttribute';
import CodeNode from '@/pages/flow/components/nodes/CodeNode';
import StartNode from '@/pages/flow/components/nodes/StartNode';
import EditStartNode from '@/pages/flow/components/nodes/StartNode/EditStartAttribute';

import EditCodeAttribute from '@/pages/flow/components/nodes/CodeNode/EditCodeAttribute';
import NoteNode from '@/pages/flow/components/nodes/CommentNode';
import EndNode from '@/pages/flow/components/nodes/EndNode';
import EditEndAttribute from '@/pages/flow/components/nodes/EndNode/EditEndAttribute';
import GroupStartNode from '@/pages/flow/components/nodes/GroupStartNode';
import LoopBreakNode from '@/pages/flow/components/nodes/LoopBreakNode';
import LoopContinueNode from '@/pages/flow/components/nodes/LoopContinueNode';
import LoopNode from '@/pages/flow/components/nodes/LoopNode';
import EditLoopAttribute from '@/pages/flow/components/nodes/LoopNode/EditLoopAttribute';
import SqlNode from '@/pages/flow/components/nodes/SqlNode';
import EditSqlAttribute from '@/pages/flow/components/nodes/SqlNode/EditSqlAttribute';
import SqlTransactionNode from '@/pages/flow/components/nodes/SqlTransactionNode';
import EditSqlTransactionAttribute from '@/pages/flow/components/nodes/SqlTransactionNode/EditSqlTransactionAttribute';
import {
  CaseNodeType,
  CodeNodeType,
  EndNodeType,
  LoopNodeType,
  NodeDefineType,
  NodeType,
  NoteNodeType,
  SqlNodeType,
  SqlTransactionNodeType,
  StartNodeType,
  SubFlowNodeType,
} from '@/types/flow';
import { newId } from '@/utils/id';

// 节点类型 key 常量
export const NODE_TYPE = {
  START: 'start',
  END: 'end',
  GROUP_START: 'group-start',
  CASE: 'case',
  LOOP: 'loop',
  LOOP_CONTINUE: 'loop-continue',
  LOOP_BREAK: 'loop-break',
  CODE: 'code',
  SQL: 'sql',
  SQL_TRANSACTION: 'sql-transaction',
  SUBFLOW: 'subflow',
  ASSIGN: 'assign',
  NOTE: 'note',
} as const;

export const NodeDefineTypes: ObjectType<NodeDefineType> = {
  [NODE_TYPE.START]: {
    icon: 'icon-start',
    renderComponent: StartNode,
    attributeEditor: EditStartNode,
    defaultConfig: {
      id: newId(),
      type: NODE_TYPE.START,
      position: { x: 0, y: 0 },
      width: 220,
      data: {
        title: '开始',
        input: [],
        group: false,
      },
    } as NodeType<StartNodeType>,
  },
  [NODE_TYPE.END]: {
    icon: 'icon-start',
    renderComponent: EndNode,
    attributeEditor: EditEndAttribute,
    defaultConfig: {
      id: newId(),
      type: NODE_TYPE.END,
      position: { x: 0, y: 0 },
      width: 220,
      data: {
        title: '结束',
        output: {
          type: 'vars',
          vars: [],
          isWrap: false,
          isText: false,
        },
        group: false,
      },
    } as NodeType<EndNodeType>,
  },
  [NODE_TYPE.CASE]: {
    icon: 'icon-case',
    renderComponent: ConditionNode,
    attributeEditor: EditCaseNode,
    defaultConfig: {
      id: '',
      type: NODE_TYPE.CASE,
      position: { x: 0, y: 0 },
      width: 250,
      data: {
        title: '条件分支',
        cases: [{ id: newId(), opr: 'and', conditions: [] }],
        group: false,
      },
    } as NodeType<CaseNodeType>,
  },
  [NODE_TYPE.LOOP]: {
    icon: 'icon-loop',
    renderComponent: LoopNode,
    attributeEditor: EditLoopAttribute,
    defaultConfig: {
      id: newId(),
      type: NODE_TYPE.LOOP,
      position: { x: 0, y: 0 },
      width: 400,
      height: 200,
      data: {
        title: '循环',
        group: true,
        expanded: true,
      },
    } as NodeType<LoopNodeType>,
  },
  [NODE_TYPE.GROUP_START]: {
    icon: 'icon-start',
    renderComponent: GroupStartNode,
    defaultConfig: {
      id: newId(),
      type: NODE_TYPE.GROUP_START,
      position: { x: 10, y: 50 },
      width: 30,
      height: 30,
      draggable: false,
      data: { group: false, hidden: true },
    } as NodeType<any>,
  },
  [NODE_TYPE.LOOP_CONTINUE]: {
    icon: 'icon-continue',
    renderComponent: LoopContinueNode,
    defaultConfig: {
      id: newId(),
      type: NODE_TYPE.LOOP_CONTINUE,
      position: { x: 0, y: 0 },
      width: 150,
      data: { title: '继续循环', group: false },
    } as NodeType<any>,
  },
  [NODE_TYPE.LOOP_BREAK]: {
    icon: 'icon-break',
    renderComponent: LoopBreakNode,
    defaultConfig: {
      id: newId(),
      type: NODE_TYPE.LOOP_BREAK,
      position: { x: 0, y: 0 },
      width: 150,
      data: { title: '终止循环', group: false },
    } as NodeType<any>,
  },
  [NODE_TYPE.CODE]: {
    icon: 'icon-code',
    renderComponent: CodeNode,
    attributeEditor: EditCodeAttribute,
    defaultConfig: {
      id: newId(),
      type: NODE_TYPE.CODE,
      position: { x: 0, y: 0 },
      data: {
        title: '代码执行',
      },
    } as NodeType<CodeNodeType>,
  },
  [NODE_TYPE.SQL]: {
    icon: 'icon-sql',
    renderComponent: SqlNode,
    attributeEditor: EditSqlAttribute,
    defaultConfig: {
      id: '',
      type: NODE_TYPE.SQL,
      position: { x: 0, y: 0 },
      data: {
        title: 'SQL脚本',
      },
    } as NodeType<SqlNodeType>,
  },
  [NODE_TYPE.SQL_TRANSACTION]: {
    icon: 'icon-sql-transaction',
    renderComponent: SqlTransactionNode,
    attributeEditor: EditSqlTransactionAttribute,
    defaultConfig: {
      id: '',
      type: NODE_TYPE.SQL_TRANSACTION,
      position: { x: 0, y: 0 },
      width: 400,
      height: 200,
      data: {
        title: 'SQL事务',
        group: true,
        expanded: true,
      },
    } as NodeType<SqlTransactionNodeType>,
  },
  [NODE_TYPE.SUBFLOW]: {
    icon: 'icon-subflow',
    renderComponent: CodeNode,
    defaultConfig: {
      id: '',
      type: NODE_TYPE.SUBFLOW,
      position: { x: 0, y: 0 },
      data: {
        title: '子流程',
      },
    } as NodeType<SubFlowNodeType>,
  },
  [NODE_TYPE.ASSIGN]: {
    icon: 'icon-assign',
    renderComponent: CodeNode,
    defaultConfig: {
      id: '',
      type: NODE_TYPE.ASSIGN,
      position: { x: 0, y: 0 },
      data: {
        title: '变量赋值',
        group: false,
      },
    } as NodeType<any>,
  },
  [NODE_TYPE.NOTE]: {
    icon: 'icon-file',
    renderComponent: NoteNode,
    defaultConfig: {
      id: '',
      type: NODE_TYPE.NOTE,
      position: { x: 0, y: 0 },
      width: 200,
      height: 80,
      data: {
        title: '注释',
        content: '请输入注释内容...',
      },
    } as NodeType<NoteNodeType>,
  },
};
