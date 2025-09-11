import TextUpdaterNode from "@/components/TextUpdaterNode";
import ColorSelectorNode from "@/components/ColorSelectorNode";
import StartNode from "@/components/nodes/StartNode";
import ConditionNode from "@/components/nodes/ConditionNode";
import ScriptNode from "@/components/nodes/ScriptNode";

export const nodeTypes = {
    textUpdater: TextUpdaterNode,
    selectorNode: ColorSelectorNode,
    startNode: StartNode,
    conditionNode: ConditionNode,
    scriptNode: ScriptNode,
};