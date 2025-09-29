import {ObjectType} from "@/typings";

export const IconFontUrl = 'https://at.alicdn.com/t/c/font_5021436_vj8jgnno7i.js';

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
    { value: "required", label: "必填" },
    { value: "max", label: "最大值" },
    { value: "min", label: "最小值" },
    { value: "length", label: "长度" },
    { value: "enum", label: "枚举" },
    { value: "size", label: "集合大小" },
    { value: "email", label: "邮箱格式" },
    { value: "pattern", label: "正则表达式" }
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
    string: ["required", "length", "enum", "email", "pattern"],
    int: ["required", "max", "min", "enum"],
    long: ["required", "max", "min", "enum"],
    list: ["required", "size", "enum"]
};