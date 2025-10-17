import React from "react";
import {Button, Flex, Form, Select} from "antd";
import {Node} from "@xyflow/react";
import {useSnapshot} from "valtio";
import {state} from "@/states/flow";
import {SettingOutlined} from "@ant-design/icons";

interface LoopNodeProps {
    node: Node,
    onChange: (node: Node) => void
}

export default ({node, onChange}: LoopNodeProps) => {
    const flowState = useSnapshot(state);
    const [form] = Form.useForm();

    const handleConfigClick = () => {
        // TODO: 实现配置功能
        console.log('配置按钮被点击');
    };


    return <>
        <Form form={form} layout="vertical">
            <Form.Item
                name="type"
                label="数据库链接"
                rules={[{required: true, message: '请选择循环类型'}]}
            >
                <Flex gap={3} align="center">
                    <Select
                        placeholder="请选择循环类型"
                    />
                    <Button type={"text"} onClick={handleConfigClick} icon={<SettingOutlined/>}/>
                </Flex>
            </Form.Item>
        </Form>
    </>
}