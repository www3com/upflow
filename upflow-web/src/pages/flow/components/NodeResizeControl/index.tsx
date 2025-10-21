import {memo} from "react";
import {NodeResizeControl} from "@xyflow/react";
import IconFont from '@/components/IconFont';

export default memo(() => {
    return <>
        <NodeResizeControl style={{background: 'transparent', border: 'none'}}>
            <IconFont type='icon-zoom' style={{position: 'absolute', right: 3, bottom: 3}}/>
        </NodeResizeControl>
    </>;
});
