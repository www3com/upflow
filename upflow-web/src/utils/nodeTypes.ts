import StartNode from "@/pages/flow/components/nodes/StartNode";
import ConditionNode from "@/pages/flow/components/nodes/CaseNode";
import ScriptNode from "@/pages/flow/components/nodes/ScriptNode";
import EditStartNode from "@/pages/flow/components/nodes/StartNode/EditStartAttribute";
import EditCaseNode from "@/pages/flow/components/nodes/CaseNode/EditCaseAttribute";
import {NodeDefineType, ObjectType} from "@/typings";
import {nanoid} from "nanoid";
import LoopNode from "@/pages/flow/components/nodes/LoopNode";
import LoopStartNode from "@/pages/flow/components/nodes/LoopNode/LoopStartNode";
import CommentNode from "@/pages/flow/components/nodes/CommentNode";
import EditLoopAttribute from "@/pages/flow/components/nodes/LoopNode/EditLoopAttribute";
import LoopContinueNode from "@/pages/flow/components/nodes/LoopContinueNode";
import LoopBreakNode from "@/pages/flow/components/nodes/LoopBreakNode";

// 节点类型 key 常量
export const NODE_TYPE = {
    START: 'start',
    CASE: 'case',
    LOOP: 'loop',
    LOOP_START: 'loop-start',
    LOOP_CONTINUE: 'loop-continue',
    LOOP_BREAK: 'loop-break',
    SCRIPT: 'script',
    SQL: 'sql',
    SUBFLOW: 'subflow',
    ASSIGN: 'assign',
    COMMENT: 'comment'
} as const;

export const NodeDefineTypes: ObjectType<NodeDefineType> = {
    [NODE_TYPE.START]: {
        icon: 'icon-start',
        renderComponent: StartNode,
        propertiesEditor: EditStartNode,
        defaultConfig: {
            id: '',
            type: NODE_TYPE.START,
            position: { x: 0, y: 0 },
            width: 220,
            data: {
                title: '开始',
                variables: [],
                group: false,
            }
        }
    },
    [NODE_TYPE.CASE]: {
        icon: 'icon-case',
        renderComponent: ConditionNode,
        propertiesEditor: EditCaseNode,
        defaultConfig: {
            id: '',
            type: NODE_TYPE.CASE,
            position: { x: 0, y: 0 },
            width: 250,
            data: {
                title: '条件分支',
                detail: [{id: nanoid(8), opr: 'and', conditions: []}],
                group: false,
            }
        }
    },
    [NODE_TYPE.LOOP]: {
        icon: 'icon-loop',
        renderComponent: LoopNode,
        propertiesEditor: EditLoopAttribute,
        defaultConfig: {
            id: '',
            type: NODE_TYPE.LOOP,
            position: { x: 0, y: 0 },
            width: 400,
            height: 200,
            data: {
                title: '循环',
                group: true,
            }
        }
    },
    [NODE_TYPE.LOOP_START]: {
        icon: 'icon-start',
        renderComponent: LoopStartNode,
        defaultConfig: {
            id: '',
            type: NODE_TYPE.LOOP_START,
            position: { x: 10, y: 50 },
            width: 30,
            height: 30,
            draggable: false,
            data: {group: false, hidden: true},
        }
    },
    [NODE_TYPE.LOOP_CONTINUE]: {
        icon: 'icon-continue',
        renderComponent: LoopContinueNode,
        defaultConfig: {
            id: '',
            type: NODE_TYPE.LOOP_CONTINUE,
            position: { x: 0, y: 0 },
            width: 150,
            data: {title: '继续循环', group: false},
        }
    },
    [NODE_TYPE.LOOP_BREAK]: {
        icon: 'icon-break',
        renderComponent: LoopBreakNode,
        defaultConfig: {
            id: '',
            type: NODE_TYPE.LOOP_BREAK,
            position: { x: 0, y: 0 },
            width: 150,
            data: { title: '终止循环', group: false},
        }
    },
    [NODE_TYPE.SCRIPT]: {
        icon: 'icon-script',
        renderComponent: ScriptNode,
        defaultConfig: {
            id: '',
            type: NODE_TYPE.SCRIPT,
            position: { x: 0, y: 0 },
            data: {
                title: '代码执行',
                group: false,
            }
        }
    },
    [NODE_TYPE.SQL]: {
        icon: 'icon-sql',
        renderComponent: ScriptNode,
        defaultConfig: {
            id: '',
            type: NODE_TYPE.SQL,
            position: { x: 0, y: 0 },
            data: {
                title: 'SQL脚本',
                group: false,
            }
        }
    },
    [NODE_TYPE.SUBFLOW]: {
        icon: 'icon-subflow',
        renderComponent: ScriptNode,
        defaultConfig: {
            id: '',
            type: NODE_TYPE.SUBFLOW,
            position: { x: 0, y: 0 },
            data: {
                title: '子流程',
                group: false,
            }
        }
    },
    [NODE_TYPE.ASSIGN]: {
        icon: 'icon-assign',
        renderComponent: ScriptNode,
        defaultConfig: {
            id: '',
            type: NODE_TYPE.ASSIGN,
            position: { x: 0, y: 0 },
            data: {
                title: '变量赋值',
                group: false,
            }
        }
    },
    [NODE_TYPE.COMMENT]: {
        icon: 'icon-file',
        renderComponent: CommentNode,
        defaultConfig: {
            id: '',
            type: NODE_TYPE.COMMENT,
            position: { x: 0, y: 0 },
            width: 200,
            height: 80,
            data: {
                title: '注释',
                detail: '请输入注释内容...',
                group: false,
                hidden: true
            }
        }
    },
}