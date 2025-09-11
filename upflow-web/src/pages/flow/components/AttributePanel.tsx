import {Button, Card, Flex, Space} from "antd";
import styles from "@/pages/flow/stytles.less";
import {Node, Panel} from "@xyflow/react";

export interface AttributePanelProps {
    open: boolean,
    node?: Node
}

export default ({open, node}: AttributePanelProps) => {
    console.log('属性面板:',open, node)
    return <>
        <Panel hidden={!open} position="top-right" className={styles.panel}>
            <Card title='开始' variant='borderless' size='small' className={styles.noBorderCard}>
收拾收拾
            </Card>
        </Panel>
    </>
}