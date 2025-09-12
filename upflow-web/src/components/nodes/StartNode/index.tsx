import {Card, Flex, Space} from "antd";
import {memo} from "react";
import {EnvironmentOutlined, HomeOutlined, PartitionOutlined} from "@ant-design/icons";
import {Handle, Position} from "@xyflow/react";
import styles from './styles.less'
import {nodeConfig} from "@/pages/flow/initNodes";

interface StartNodeProps {
    data: {
        title: string,
        variables: []
    }
}

export default memo(({data}: StartNodeProps) => {
    return (
        <Flex vertical >
            <Space className={styles.title} size={5} align={"start"}>
                <nodeConfig.startNode.icon/>
                {data.title}
            </Space>
            <Flex vertical gap={5}>
                <Flex justify="space-between" align="center" className={styles.variable}>
                    <Space size={3}><EnvironmentOutlined />name</Space>
                    <label className={styles.rules}>required</label>
                </Flex>
                <Flex justify="space-between" align="center" className={styles.variable}>
                    <Space size={3}><EnvironmentOutlined />sex</Space>
                    <label className={styles.rules}>required</label>
                </Flex>
            </Flex>
            <Handle type="target" position={Position.Right}/>
        </Flex>
    )
});