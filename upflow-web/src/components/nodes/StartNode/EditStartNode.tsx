import {Card, Flex, List, Space} from "antd";
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

export default ({data}: StartNodeProps) => {
    return (
        <List header={data.title}
              bordered={false}
              dataSource={data.variables}
              renderItem={(item: any) => (
                  <List.Item>{item}</List.Item>
              )}/>

    )
};