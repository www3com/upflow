import {Card, Flex, Input, Space, theme} from "antd";
import React, {memo} from "react";
import styles from "./styles.less";
import {Handle, Position} from "@xyflow/react";
import {CompareOprType, NodeTypes} from "@/utils/constants";
import {createFromIconfontCN} from "@ant-design/icons";
import {Case} from "@/typings";
import NodeWrapper from "@/pages/flow/components/NodeWrapper";
const {useToken} = theme;
const IconFont = createFromIconfontCN({
    scriptUrl: '/public/iconfont.js',
});

interface CaseNodeProps {
    id: string,
    type: string,
    selected: boolean,
    data: {
        title: string,
        detail: Case[]
    }
}

export default memo(({id, type, selected, data}: CaseNodeProps) => {
    const {token} = useToken();
    const handles = () => {
        let handles = [];
        let height = 45;
        for (const caseItem of data.detail) {
            handles.push(<Handle type="source" position={Position.Right} id={caseItem.id} style={{top: height}}
                                 key={caseItem.id}/>)
            let caseHeight = 19 + caseItem.conditions.length * 26;
            height += caseHeight;
        }
        handles.push(<Handle type="source" position={Position.Right} id={id} style={{top: height}} key={id}/>)
        return handles;
    }

    return (
        <NodeWrapper id={id} type={type} data={data}>
            <Flex vertical gap={5} className='node-container'>
                <Flex vertical gap={10}>
                    {data.detail && data.detail.map((item: Case, index: number) => (
                        <CaseCom key={index} count={data.detail.length} index={index} item={item}/>
                    ))}
                </Flex>
                <Flex justify={'end'}>
                    <span className={styles.keyword}>ELSE</span>
                </Flex>
                <Handle type="target" position={Position.Left}/>
                {handles()}
            </Flex>
        </NodeWrapper>
    )
});

interface CaseComProps {
    count: number,
    index: number,
    item: Case,
}

export const CaseCom = ({count, index, item}: CaseComProps) => {
    const {token} = useToken();
    const renderConditions = () => {
        return item.conditions.map((condition, condIndex) => (
            <Flex key={condition.nodeId} align="center" gap={15} className={styles.conditionItem}>
                {condIndex > 0 && <span className={styles.logicalOpr} style={{color: token.colorPrimary}}>AND</span>}
                <Space size={3}>
                    <IconFont type="icon-variable" style={{color: token.colorPrimary}}/>
                    <span style={{color: token.colorPrimary}}>{condition.varName}</span>
                    <span className={styles.compareOpr}>{CompareOprType[condition.opr]}</span>
                    <span>{condition.value}</span>
                </Space>
            </Flex>
        ));
    };

    return (
        <Flex vertical gap={3}>
            <Flex justify={"space-between"} align={"center"}>
                <span>{count > 1 && `CASE ` + (index + 1)}</span>
                {index === 0 && <span className={styles.keyword}>IF</span>}
                {index > 0 && <span className={styles.keyword}>ELIF</span>}
            </Flex>

            <Flex vertical gap={2}>
                {renderConditions()}
            </Flex>
        </Flex>
    )
}


