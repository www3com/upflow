import {createFromIconfontCN} from "@ant-design/icons";
import {Flex,  theme} from "antd";
import {IconFontUrl} from "@/utils/constants";
import {Handle, Position} from "@xyflow/react";

const IconFont = createFromIconfontCN({
    scriptUrl: IconFontUrl,
});
const {useToken} = theme;

export default () => {
    const {token} = useToken();
    return <Flex align='center' justify={'center'} style={{height: '100%', width: '100%', backgroundColor: token.colorBgContainer, borderRadius: 8}}>
        <IconFont type="icon-start"
                  style={{color: token.colorPrimary, fontSize: 20}}/>
        <Handle type="source" position={Position.Right}/>
    </Flex>
}