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