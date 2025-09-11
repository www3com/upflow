export default {

    // 返回值可以是数组形式
    "GET /api/flow": {
        code: 200,
        msg: "",
        data: {
            nodes: [
                {id: 'n1', position: {x: 100, y: 200}, data: {label: 'Node 2'}, type: 'startNode'},
                {id: 'n2', position: {x: 500, y: 200}, data: {label: 'Node 2'}, type: 'conditionNode'},
                {id: 'n3', position: {x: 1000, y: 200}, data: {label: 'Node 2'}, type: 'scriptNode'}],
            edges: [
                {"id": "n1-n2", "source": "n1", "target": "n2"},
                {"id": "xy-edge__n2-n1", "source": "n2", "target": "n1",},
                {"id": "xy-edge__n3-n2a", "source": "n3", "target": "n2", "targetHandle": "a"}
            ],
            "viewport": {
                "x": 0,
                "y": 0,
                "zoom": 1
            }
        }
    },


}