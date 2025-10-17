import {Button, List} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import EditCaseItem from './EditCaseItem';
import './styles.less';
import {Node} from "@xyflow/react";
import {Case, CaseNodeType, Condition, NodeType} from "@/typings";
import {useSnapshot} from "valtio";
import {state} from "@/states/flow";
import {getAvailableVariablesWithNode} from "@/pages/flow/variables";
import {newId} from "@/utils/id";


interface CaseNodeProps {
    node: NodeType<CaseNodeType>,
    onChange: (node: NodeType<CaseNodeType>) => void
}

export default ({node, onChange}: CaseNodeProps) => {

    // 获取流程状态和可用变量
    const flowState = useSnapshot(state);
    const variablesWithNode = getAvailableVariablesWithNode(node.id, [...flowState.nodes] as Node[], [...flowState.edges] as any[]);

    const cases = (node.data.cases) || [];

    const onAddCase = () => {
        const newCase: Case = {
            id: newId(),
            opr: 'and',
            conditions: []
        };

        const updatedNode = {
            ...node,
            data: {
                ...node.data,
                cases: [...cases, newCase]
            }
        };
        onChange(updatedNode);
    };

    const onDeleteCase = (index: number) => {
        const newCases = cases.filter((_, i) => i !== index);
        const updatedNode = {
            ...node,
            data: {
                ...node.data,
                cases: newCases
            }
        };
        onChange(updatedNode);
    };

    const onUpdateCase = (caseIndex: number, conditions: Condition[], logicalOperator?: string) => {
        const newCases = [...cases];
        newCases[caseIndex] = {
            ...newCases[caseIndex],
            opr: logicalOperator || newCases[caseIndex].opr, // 更新逻辑操作符
            conditions: conditions
        };

        const updatedNode = {
            ...node,
            data: {
                ...node.data,
                cases: newCases
            }
        };
        onChange(updatedNode);
    };

    return (
        <div>
            <List
                size="small"
                bordered={false}
                dataSource={cases}
                footer={
                    <Button
                        type="dashed"
                        icon={<PlusOutlined/>}
                        style={{width: "100%"}}
                        size="small"
                        onClick={onAddCase}
                    >
                        添加条件分支
                    </Button>
                }
                renderItem={(item: Case, index: number) => (
                    <List.Item key={item.id} style={{padding: 0, margin: 0}}>
                        <EditCaseItem
                            item={item}
                            index={index}
                            caseLength={cases.length}
                            variablesWithNode={variablesWithNode}
                            onDeleteCase={onDeleteCase}
                            onUpdateCase={onUpdateCase}
                        />
                    </List.Item>
                )}
            />
            <div style={{marginTop: 16, padding: 8, backgroundColor: '#f5f5f5', borderRadius: 4}}>
                <strong>Else</strong>
                <div style={{fontSize: 12, color: '#666', marginTop: 4}}>
                    用于定义当 if 条件不满足时应执行的逻辑。
                </div>
            </div>
        </div>
    );
};