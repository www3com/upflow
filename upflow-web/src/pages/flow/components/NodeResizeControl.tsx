import {memo} from "react";
import {NodeResizeControl} from "@xyflow/react";
import {createFromIconfontCN} from "@ant-design/icons";
import {theme} from "antd";

const IconFont = createFromIconfontCN({
    scriptUrl: 'https://at.alicdn.com/t/c/font_5021436_vb3zfi9bjm.js',
});

const {useToken} = theme;

interface NodeResizeControlProps {
    show?: boolean;
}

export default memo(({show}: NodeResizeControlProps) => {
    const {token} = useToken();
    return <>
        <NodeResizeControl style={{background: 'transparent', border: 'none'}}>
            {show && <IconFont type='icon-zoom' style={{
                color: token.colorPrimary,
                position: 'absolute',
                right: 5,
                bottom: 5
            }}/>}
        </NodeResizeControl>
    </>;
});