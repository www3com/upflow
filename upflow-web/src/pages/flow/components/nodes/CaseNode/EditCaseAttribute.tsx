import { Button, List } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import EditCaseItem from './EditCaseItem';
import './styles.less';
import { useSnapshot } from 'valtio';
import { state } from '@/states/flow';
import { getAvailableVariablesWithNode } from '@/pages/flow/variables';
import { newId } from '@/utils/id';
import { Case, CaseNodeType, EdgeType, NodeType } from '@/types/flow';

interface CaseNodeProps {
  node: NodeType<CaseNodeType>;
  onChange: (node: NodeType<CaseNodeType>) => void;
}

export default ({ node, onChange }: CaseNodeProps) => {
  // 获取流程状态和可用变量
  const flowState = useSnapshot(state);
  const variablesWithNode = getAvailableVariablesWithNode(node.id, flowState.nodes as NodeType<any>[], flowState.edges as EdgeType<any>[]);

  const cases = node.data.cases || [];

  const onAddCase = () => {
    const newCase: Case = {
      id: newId(),
      opr: 'and',
      conditions: [],
    };

    const updatedNode = {
      ...node,
      data: {
        ...node.data,
        cases: [...cases, newCase],
      },
    };
    onChange(updatedNode);
  };

  const onDeleteCase = (index: number) => {
    const newCases = cases.filter((_, i) => i !== index);
    const updatedNode = {
      ...node,
      data: {
        ...node.data,
        cases: newCases,
      },
    };
    onChange(updatedNode);
  };

  const onCaseChange = (index: number, updatedCase: Case) => {
    const newCases = [...cases];
    newCases[index] = updatedCase;
    const updatedNode = {
      ...node,
      data: {
        ...node.data,
        cases: newCases,
      },
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
          <Button type="dashed" icon={<PlusOutlined />} style={{ width: '100%' }} size="small" onClick={onAddCase}>
            添加条件分支
          </Button>
        }
        renderItem={(item: Case, index: number) => (
          <List.Item key={item.id} style={{ padding: 0, margin: 0 }}>
            <EditCaseItem
              value={item}
              onChange={(updatedCase) => onCaseChange(index, updatedCase)}
              title={cases.length === 1 ? 'IF' : `CASE ${index + 1}`}
              variablesWithNode={variablesWithNode}
              onDelete={cases.length > 1 ? () => onDeleteCase(index) : undefined}
            />
          </List.Item>
        )}
      />
      <div style={{ marginTop: 16, padding: 8, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
        <strong>Else</strong>
        <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>用于定义当 if 条件不满足时应执行的逻辑。</div>
      </div>
    </div>
  );
};
