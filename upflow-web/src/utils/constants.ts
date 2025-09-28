import StartNode from "@/pages/flow/components/nodes/StartNode";
import ConditionNode from "@/pages/flow/components/nodes/CaseNode";
import ScriptNode from "@/pages/flow/components/nodes/ScriptNode";
import EditStartNode from "@/pages/flow/components/nodes/StartNode/EditStartAttribute";
import {NodeCfgType, ObjectType} from "@/typings";
import {nanoid} from "nanoid";
import ForNode from "@/pages/flow/components/nodes/ForNode";
import ForStartNode from "@/pages/flow/components/nodes/ForNode/ForStartNode";

export const IconFontUrl = 'https://at.alicdn.com/t/c/font_5021436_vj8jgnno7i.js';

// 节点类型 key 常量
export const NODE_TYPE = {
    START: 'start',
    CASE: 'case',
    FOR: 'for',
    FOR_START: 'for-start',
    SCRIPT: 'script',
    SQL: 'sql',
    SUBFLOW: 'subflow',
    ASSIGN: 'assign'
} as const;

export const NodeTypes: ObjectType<NodeCfgType> = {
    [NODE_TYPE.START]: {
        icon: 'icon-start',
        node: StartNode,
        attr: EditStartNode,
        width: 220,
        data: {
            title: '开始',
            input: [],
            group: false,
        }
    },
    [NODE_TYPE.CASE]: {
        icon: 'icon-case',
        node: ConditionNode,
        attr: null,
        data: {
            title: '条件分支',
            detail: [{id: nanoid(8), opr: 'and', conditions: []}],
            group: false,
        }
    },
    [NODE_TYPE.FOR]: {
        width: 400,
        height: 200,
        icon: 'icon-for',
        node: ForNode,
        attr: null,
        data: {
            title: '循环',
            input: [],
            group: true,
        }
    },
    [NODE_TYPE.FOR_START]: {
        icon: 'icon-start',
        node: ForStartNode,
        attr: null,
        width: 30,
        height: 30,
        draggable: false,
        position: {
            x: 10,
            y: 50
        },
        data: {group: false},

    },
    [NODE_TYPE.SCRIPT]: {
        icon: 'icon-script',
        node: ScriptNode,
        attr: null,
        data: {
            title: '代码执行',
            input: [],
            group: false,
        }
    },
    [NODE_TYPE.SQL]: {
        icon: 'icon-sql',
        node: ScriptNode,
        attr: null,
        data: {
            title: 'SQL脚本',
            input: [],
            group: false,
        }
    },
    [NODE_TYPE.SUBFLOW]: {
        icon: 'icon-subflow',
        node: ScriptNode,
        attr: null,
        data: {
            title: '子流程',
            input: [],
            group: false,
        }
    },
    [NODE_TYPE.ASSIGN]: {
        icon: 'icon-assign',
        node: ScriptNode,
        attr: null,
        data: {
            title: '变量赋值',
            input: [],
            group: false,
        }
    },
}

export const CompareOprType: ObjectType<string> = {
    'in': "包含",
    'not in': "不包含",
    '=': "等于",
    '>': "大于",
    '<': "小于",
    '>=': "大于等于",
    '<=': "小于等于",
    '!=': "不等于",
    'start with': "开头为",
    'end with': "结尾为",
    'is empty': "为空",
    'is not empty': "不为空"
};