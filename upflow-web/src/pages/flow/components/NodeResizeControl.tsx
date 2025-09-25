import {memo} from "react";
import {NodeResizeControl} from "@xyflow/react";
import {createFromIconfontCN} from "@ant-design/icons";
import {IconFontUrl} from "@/utils/constants";

const IconFont = createFromIconfontCN({
    scriptUrl: IconFontUrl,
});

export default memo(() => {
    return <>
        <NodeResizeControl style={{background: 'transparent', border: 'none'}}>
            <IconFont type='icon-zoom' style={{position: 'absolute', right: 5, bottom: 5}}/>
        </NodeResizeControl>
    </>;
});