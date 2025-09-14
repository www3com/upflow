import {Card, Flex, Space} from "antd";
import {memo} from "react";
import {createFromIconfontCN, EnvironmentOutlined, HomeOutlined, PartitionOutlined} from "@ant-design/icons";
import {Handle, Position} from "@xyflow/react";
import styles from './styles.less'
import {nodeConfig} from "@/pages/flow/initNodes";
const IconFont = createFromIconfontCN({
    scriptUrl: '/public/iconfont.js',
});

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
                    <Space size={3}><IconFont type="icon-variable" />name</Space>
                    <label className={styles.rules}>required</label>
                </Flex>
                <Flex justify="space-between" align="center" className={styles.variable}>
                    <Space size={3}><IconFont type="icon-variable" />sex</Space>
                    <label className={styles.rules}>required</label>
                </Flex>
            </Flex>
            <Handle type="target" position={Position.Right}/>
        </Flex>
    )
});