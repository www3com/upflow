import { Flex, Space, theme} from "antd";
import React, {memo, useRef, useEffect, useCallback} from "react";
import styles from "./styles.less";
import {Handle, Position, useUpdateNodeInternals} from "@xyflow/react";
import {CompareOprType} from "@/utils/constants";

import IconFont from '@/components/IconFont';
import {Case, NodeType} from "@/typings";
import NodeWrapper from "@/pages/flow/components/NodeWrapper";

const {useToken} = theme;


export default memo((node: NodeType) => {

    const updateNodeInternals = useUpdateNodeInternals();

    useEffect(() => {
        // 使用requestAnimationFrame来确保DOM更新完成后再执行
        const rafId = requestAnimationFrame(() => {
            updateNodeInternals(node.id);
        });
        return () => cancelAnimationFrame(rafId);
    }, [node.id, node.data.detail, updateNodeInternals]);

    const keywordElementsRef = useRef<Map<string, HTMLSpanElement>>(new Map());

    const setKeywordRef = useCallback((id: string, element: HTMLSpanElement | null) => {
        if (element) {
            keywordElementsRef.current.set(id, element);
        } else {
            keywordElementsRef.current.delete(id);
        }
    }, []);

    const calculateHandlePosition = (element: HTMLSpanElement | undefined) => {
        if (!element) {
            return 0;
        }
        return element.offsetTop + element.offsetHeight / 2 - 1;
    };

    const handles = [];
    if (node.data.detail) {
        for (const caseItem of node.data.detail) {
            const top = calculateHandlePosition(keywordElementsRef.current.get(caseItem.id));
            if (top > 0) {
                handles.push(
                    <Handle
                        type="source"
                        position={Position.Right}
                        id={caseItem.id}
                        style={{top}}
                        key={caseItem.id}
                    />
                );
            }
        }
    }

    const elseTop = calculateHandlePosition(keywordElementsRef.current.get('else'));
    if (elseTop > 0) {
        handles.push(
            <Handle
                type="source"
                position={Position.Right}
                id={node.id}
                style={{top: elseTop}}
                key={`${node.id}-else`}
            />
        );
    }

    return (
        <NodeWrapper node={node}>
            <Flex vertical gap={5} className='node-container'>
                <Flex vertical gap={10}>
                    {node.data.detail && node.data.detail.map((item: Case, index: number) => (
                        <CaseCom
                            key={item.id}
                            count={node.data.detail.length}
                            index={index}
                            item={item}
                            keywordRef={(el) => setKeywordRef(item.id, el)}
                        />
                    ))}
                </Flex>
                <Flex justify={'end'}>
                    <span
                        className={styles.keyword}
                        ref={(el) => setKeywordRef('else', el)}
                    >
                        ELSE
                    </span>
                </Flex>
                <Handle type="target" position={Position.Left}/>
                {handles}
            </Flex>
        </NodeWrapper>
    )
});

export const CaseCom = ({count, index, item, keywordRef}: {
    count: number, index: number, item: Case, keywordRef?: (el: HTMLSpanElement | null) => void,
}) => {
    const {token} = useToken();

    return (
        <Flex vertical gap={3}>
            <Flex justify={"space-between"} align={"center"}>
                <span>{count > 1 && `CASE ` + (index + 1)}</span>
                {index === 0 && <span className={styles.keyword} ref={keywordRef}>IF</span>}
                {index > 0 && <span className={styles.keyword} ref={keywordRef}>ELIF</span>}
            </Flex>

            <Flex vertical gap={3}>
                {item.conditions.map((condition, condIndex) => (
                    <Flex key={condition.nodeId} align="center" gap={15} className={styles.conditionItem}>
                        {condIndex > 0 && (
                            <span className={styles.logicalOpr} style={{ color: token.colorPrimary }}>
                                {(item.opr || 'and').toUpperCase()}
                            </span>
                        )}
                        <Space size={3}>
                            <IconFont type="icon-variable" style={{color: token.colorPrimary}}/>
                            <span style={{color: token.colorPrimary}}>{condition.varName}</span>
                            <span className={styles.compareOpr}>{CompareOprType[condition.opr]}</span>
                            <span>{condition.value}</span>
                        </Space>
                    </Flex>
                ))}
            </Flex>
        </Flex>
    )
}


