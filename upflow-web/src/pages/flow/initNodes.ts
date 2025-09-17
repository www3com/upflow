import StartNode from "@/components/nodes/StartNode";
import ConditionNode from "@/components/nodes/ConditionNode";
import ScriptNode from "@/components/nodes/ScriptNode";
import { HomeOutlined, PartitionOutlined, FunctionOutlined } from "@ant-design/icons";
import EditStartNode from "@/components/nodes/StartNode/EditStartAttribute";

export const nodeTypes = {
    startNode: StartNode,
    conditionNode: ConditionNode,
    scriptNode: ScriptNode,
};

export const nodeConfig = {
    startNode: {
        title: "开始",
        icon: HomeOutlined,
        edit: EditStartNode,
    },
    conditionNode: {
        title: "条件分支",
        icon: PartitionOutlined,
        edit: null,
    },
    scriptNode: {
        title: "代码执行",
        icon: FunctionOutlined,
        edit: null,
    },
};

