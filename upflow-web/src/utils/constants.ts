import StartNode from "@/components/nodes/StartNode";
import ConditionNode from "@/components/nodes/CaseNode";
import ScriptNode from "@/components/nodes/ScriptNode";
import EditStartNode from "@/components/nodes/StartNode/EditStartAttribute";
import {NodeCfgType, ObjectType} from "@/typings";
import {nanoid} from "nanoid";
import ForNode from "@/components/nodes/ForNode";

export const IconFontUrl = 'https://at.alicdn.com/t/c/font_5021436_vj8jgnno7i.js';

export const NodeTypes: ObjectType<NodeCfgType> = {
    'start': {
        icon: 'icon-start',
        node: StartNode,
        attr: EditStartNode,
        data: {
            title: '开始',
            input: []
        }
    },
    'case': {
        icon: 'icon-case',
        node: ConditionNode,
        attr: null,
        data: {
            title: '条件分支',
            detail: [{id: nanoid(8), opr: 'and', conditions: []}]
        }
    },
    'for': {
        width: 400,
        height: 200,
        icon: 'icon-for',
        node: ForNode,
        attr: null,
        data: {
            title: '循环',
            input: []
        }
    },
    'script': {
        icon: 'icon-script',
        node: ScriptNode,
        attr: null,
        data: {
            title: '代码执行',
            input: []
        }
    },
    'sql': {
        icon: 'icon-sql',
        node: ScriptNode,
        attr: null,
        data: {
            title: 'SQL脚本',
            input: []
        }
    },
    'subflow': {
        icon: 'icon-subflow',
        node: ScriptNode,
        attr: null,
        data: {
            title: '子流程',
            input: []
        }
    },
    'assign': {
        icon: 'icon-assign',
        node: ScriptNode,
        attr: null,
        data: {
            title: '变量赋值',
            input: []
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