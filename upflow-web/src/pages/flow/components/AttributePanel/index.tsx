import React, {ComponentType, useCallback, useEffect, useState} from 'react';
import {Button, Form, Input, theme} from 'antd';
import {Panel} from '@xyflow/react';
import {CompressOutlined, ExpandOutlined} from '@ant-design/icons';
import {useSnapshot} from 'valtio';

import styles from './styles.less';
import ResizablePanel from '@/components/ResizablePanel';
import IconFont from '@/components/IconFont';
import {NodeDefineTypes} from '@/pages/flow/nodeTypes';
import {state} from '@/states/flow';
import {NodeType} from '@/types/flow';

const {TextArea} = Input;
const {useToken} = theme;

// 类型定义
interface AttributePanelProps {
}

interface NodeConfig {
    icon?: string;
    attributeEditor?: ComponentType<{
        node: NodeType<any>;
        onChange?: (node: NodeType<any>) => void;
    }>;
}

interface TitleSectionProps {
    config: NodeConfig;
    token: any;
}

interface DescriptionSectionProps {
    token: any;
}

// 标题输入组件
const TitleSection: React.FC<TitleSectionProps> = React.memo(({config, token}) => (
    <div className={styles.titleInputContainer}>
        {config?.icon && (
            <IconFont
                type={config.icon}
                style={{color: token.colorPrimary}}
                className={styles.panelIcon}
            />
        )}
        <Form.Item name="title" style={{margin: 0, flex: 1}}>
            <Input
                variant="borderless"
                className={styles.titleInput}
                style={{color: token.colorText}}
                placeholder="输入标题"
            />
        </Form.Item>
    </div>
));

// 描述输入组件
const DescriptionSection: React.FC<DescriptionSectionProps> = React.memo(({token}) => (
    <div className={styles.descriptionInputContainer}>
        <Form.Item name="description" style={{margin: 0}}>
            <TextArea
                variant="borderless"
                className={styles.descriptionInput}
                style={{color: token.colorTextSecondary, fontSize: '12px'}}
                placeholder="输入描述"
                autoSize={{minRows: 1, maxRows: 4}}
            />
        </Form.Item>
    </div>
));

// 工具栏组件
const PanelToolbar: React.FC<{
    isMaximized: boolean;
    onToggleMaximize: () => void;
}> = React.memo(({isMaximized, onToggleMaximize}) => (
    <div>
        <Button
            type="text"
            size="small"
            icon={isMaximized ? <CompressOutlined/> : <ExpandOutlined/>}
            onClick={onToggleMaximize}
            title={isMaximized ? '还原' : '最大化'}
            className={styles.toolbarButton}
        />
    </div>
));

// 主组件
export const AttributePanel: React.FC<AttributePanelProps> = () => {
    const {token} = useToken();
    const [form] = Form.useForm();
    const [isMaximized, setIsMaximized] = useState<boolean>(false);
    const flowState = useSnapshot(state);

    // 处理节点数据变更
    const handleNodeChange = useCallback((updatedNode: NodeType<any>) => {
        const nodeIndex = state.nodes.findIndex(node => node.id === updatedNode.id);
        if (nodeIndex !== -1) {
            state.nodes[nodeIndex] = {
                ...state.nodes[nodeIndex],
                data: updatedNode.data
            };
            state.selectedNode = updatedNode;
        }
    }, []);

    // 处理表单值变更
    const handleFormValuesChange = useCallback((changedValues: Record<string, any>) => {
        if (!flowState.selectedNode) return;

        const nodeIndex = state.nodes.findIndex(node => node.id === flowState.selectedNode!.id);
        if (nodeIndex === -1) return;

        state.nodes[nodeIndex] = {
            ...state.nodes[nodeIndex],
            data: {
                ...state.nodes[nodeIndex].data,
                ...changedValues
            }
        };
    }, [flowState.selectedNode]);

    // 切换最大化状态
    const toggleMaximize = useCallback(() => {
        setIsMaximized(prev => !prev);
    }, []);

    // 同步表单值与选中节点数据
    useEffect(() => {
        if (flowState.selectedNode) {
            form.setFieldsValue({
                title: flowState.selectedNode.data.title || '',
                description: flowState.selectedNode.data.description || ''
            });
        }
    }, [flowState.selectedNode?.id, form]);

    // 如果没有选中节点，不渲染面板
    if (!flowState.selectedNode) {
        return null;
    }

    // 获取节点配置
    const nodeConfig = NodeDefineTypes[flowState.selectedNode.type!] as NodeConfig;
    const AttributeEditor = nodeConfig?.attributeEditor;

    // 生成面板样式类名
    const panelClassName = `${styles.attributePanel} ${
        isMaximized ? styles['attributePanel--maximized'] : ''
    }`;

    return (
        <Panel
            hidden={!flowState.selectedNode}
            position="top-right"
            className={panelClassName}
        >
            <ResizablePanel
                defaultWidth={500}
                minWidth={200}
                maxWidth={1200}
                isMaximized={isMaximized}
            >
                <div className={styles.panelLayout}>
                    {/* 头部区域 */}
                    <header className={styles.panelHeader}>
                        <Form
                            form={form}
                            layout="vertical"
                            onValuesChange={handleFormValuesChange}
                        >
                            <div className={styles.headerRow}>
                                <div className={styles.titleSection}>
                                    <TitleSection config={nodeConfig} token={token}/>
                                </div>
                                <PanelToolbar
                                    isMaximized={isMaximized}
                                    onToggleMaximize={toggleMaximize}
                                />
                            </div>
                            <DescriptionSection token={token}/>
                        </Form>
                    </header>

                    {/* 内容区域 */}
                    <main className={styles.panelContent}>
                        {AttributeEditor && (
                            <AttributeEditor
                                node={flowState.selectedNode as NodeType<any>}
                                onChange={handleNodeChange}
                            />
                        )}
                    </main>
                </div>
            </ResizablePanel>
        </Panel>
    );
};

// 默认导出保持向后兼容
export default AttributePanel;