import {ObjectType} from "@/typings";

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

// 校验规则类型配置
export const VALIDATION_RULE_TYPES = [
    {value: "required", label: "必填"},
    {value: "max", label: "最大值"},
    {value: "min", label: "最小值"},
    {value: "length", label: "长度"},
    {value: "enum", label: "枚举"},
    {value: "size", label: "集合大小"},
    {value: "email", label: "邮箱格式"},
    {value: "pattern", label: "正则表达式"}
];

// 校验规则默认错误提示信息
export const VALIDATION_RULE_DEFAULT_MESSAGES: ObjectType<string> = {
    required: "此字段为必填项",
    max: "数值不能大于 {value}",
    min: "数值不能小于 {value}",
    length: "长度必须在 {min} 到 {max} 之间",
    enum: "值必须是以下选项之一：{options}",
    size: "集合大小必须在 {min} 到 {max} 之间",
    email: "请输入有效的邮箱地址",
    pattern: "格式不正确，请检查输入内容"
};


// 根据变量类型定义可用的校验规则
export const VARIABLE_TYPE_RULES_MAP = {
    STRING: ["required", "length", "enum", "email", "pattern"],
    INTEGER: ["required", "max", "min", "enum"],
    LONG: ["required", "max", "min", "enum"],
    DECIMAL: ["required", "max", "min", "enum"],
    BOOLEAN: ["required"],
    OBJECT: ["required"],
    FILE_IMAGE: ["required"],
    FILE_VIDEO: ["required"],
    FILE_AUDIO: ["required"],
    FILE_DOC: ["required"],
    FILE_OTHER: ["required"],
    ARRAY: ["required", "size", "enum"],
    ARRAY_STRING: ["required", "size", "enum"],
    ARRAY_INTEGER: ["required", "size", "enum"],
    ARRAY_LONG: ["required", "size", "enum"],
    ARRAY_DECIMAL: ["required", "size", "enum"],
    ARRAY_BOOLEAN: ["required", "size", "enum"],
    ARRAY_OBJECT: ["required", "size", "enum"],
    ARRAY_FILE_IMAGE: ["required", "size", "enum"],
    ARRAY_FILE_VIDEO: ["required", "size", "enum"],
    ARRAY_FILE_AUDIO: ["required", "size", "enum"],
    ARRAY_FILE_DOC: ["required", "size", "enum"],
    ARRAY_FILE_OTHER: ["required", "size", "enum"]
};


/**
 * 支持的变量类型
 */
export type VARIABLE_TYPE =
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
 * 变量类型树形节点接口
 */
export interface VariableTypeNode {
    label: string;
    value?: VARIABLE_TYPE;
    children?: VariableTypeNode[];
}

/**
 * 变量类型标签树形结构
 */
export const VARIABLE_TYPE_MAP: VariableTypeNode[] = [
    {label: 'String', value: 'STRING'},
    {label: 'Integer', value: 'INTEGER'},
    {label: 'Long', value: 'LONG'},
    {label: 'Decimal', value: 'DECIMAL'},
    {label: 'Boolean', value: 'BOOLEAN'},
    {label: 'Object', value: 'OBJECT'},
    {
        label: 'File', value: 'FILE',
        children: [
            {label: 'Doc', value: 'FILE_DOC'},
            {label: 'Image', value: 'FILE_IMAGE'},
            {label: 'Video', value: 'FILE_VIDEO'},
            {label: 'Audio', value: 'FILE_AUDIO'},
            {label: 'Other', value: 'FILE_OTHER'}]
    }, {
        label: 'Array', value: 'ARRAY',
        children: [
            {label: 'String', value: 'ARRAY_STRING'},
            {label: 'Integer', value: 'ARRAY_INTEGER'},
            {label: 'Long', value: 'ARRAY_LONG'},
            {label: 'Decimal', value: 'ARRAY_DECIMAL'},
            {label: 'Boolean', value: 'ARRAY_BOOLEAN'},
            {label: 'Object', value: 'ARRAY_OBJECT'},
            {
                label: 'File', value: 'FILE',
                children: [
                    {label: 'Doc', value: 'ARRAY_FILE_DOC'},
                    {label: 'Image', value: 'ARRAY_FILE_IMAGE'},
                    {label: 'Video', value: 'ARRAY_FILE_VIDEO'},
                    {label: 'Audio', value: 'ARRAY_FILE_AUDIO'},
                    {label: 'Other', value: 'ARRAY_FILE_OTHER'}]
            }]
    }];
