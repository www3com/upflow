import {Card, Flex, Space, theme} from "antd";
import {memo} from "react";
import {createFromIconfontCN} from "@ant-design/icons";
import {Handle, Position} from "@xyflow/react";
import styles from './styles.less'
import {NodeTypes} from "@/utils/constants";
const IconFont = createFromIconfontCN({
    scriptUrl: '/public/iconfont.js',
});
const {useToken} = theme;

interface StartNodeProps {
    type: string,
    data: {
        title: string,
        input: []
    }
}

export default memo(({type, data}: StartNodeProps) => {
    const {token} = useToken();
    return (
        <Flex vertical >
            <Space className={styles.title} size={5} align={"start"}>
                <IconFont type={NodeTypes[type].icon} style={{color: token.colorPrimary, fontSize: 16}}/>
                {data.title}
            </Space>
            <Flex vertical gap={5}>
                {data.input.map((item: any, index: number) => (
                    <Flex justify="space-between" align="center" className={styles.variable} key={item.name}>
                        <Space size={3}><IconFont type="icon-variable" style={{color: token.colorPrimary}}/>{item.name}</Space>
                        <label className={styles.rules}>{item.type}</label>
                    </Flex>
                ))}
            </Flex>
            <Handle type="source" position={Position.Right}/>
        </Flex>
    )
});