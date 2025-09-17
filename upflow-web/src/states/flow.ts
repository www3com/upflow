import {proxy} from "valtio";
import {Node} from "@xyflow/react";
import {FlowType, getFlowApi} from "@/services/flow";


export const flowState = proxy({
    open: false,
    node: {} as Node,
})

export const selectNode = (open: boolean, node?: Node) => {
    flowState.open = open;
    flowState.node = node || {} as Node;
}