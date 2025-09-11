import {proxy} from "valtio";
import {AttributePanelProps} from "@/pages/flow/components/AttributePanel";

export const flowState = proxy({
    attr: {open: true} as AttributePanelProps
})

export const setAttr = (attr: AttributePanelProps) => {
    flowState.attr = attr;
}