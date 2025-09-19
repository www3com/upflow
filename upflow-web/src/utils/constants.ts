import StartNode from "@/components/nodes/StartNode";
import ConditionNode from "@/components/nodes/CaseNode";
import ScriptNode from "@/components/nodes/ScriptNode";
import EditStartNode from "@/components/nodes/StartNode/EditStartAttribute";
import {NodeCfgType, ObjectType} from "@/typings";

export const IconFontUrl = 'https://at.alicdn.com/t/c/font_5021436_vj8jgnno7i.js';

export const NodeTypes: ObjectType<NodeCfgType> = {
    'start': {
        title: "开始",
        icon: 'icon-start',
        node: StartNode,
        attr: EditStartNode
    },
    'case': {
        title: "条件分支",
        icon: 'icon-case',
        node: ConditionNode,
        attr: null
    },
    'for': {
        title: "循环",
        icon: 'icon-for',
        node: ScriptNode,
        attr: null
    },
    'script': {
        title: "代码执行",
        icon: 'icon-script',
        node: ScriptNode,
        attr: null
    },
    'sql': {
        title: "SQL脚本",
        icon: 'icon-sql',
        node: ScriptNode,
        attr: null,
    },
    'subflow': {
        title: "子流程",
        icon: 'icon-subflow',
        node: ScriptNode,
        attr: null
    },
    'assign': {
        title: "变量赋值",
        icon: 'icon-assign',
        node: ScriptNode,
        attr: null
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