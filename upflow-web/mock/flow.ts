export default {

    // 返回值可以是数组形式
    "GET /api/flow": {
        code: 200,
        msg: "",
        data: {
            nodes: [
                {
                    id: 'n1',
                    position: {x: 100, y: 200},
                    type: 'start',
                    data: {
                        title: '开始',
                        input: [{
                            name: 'name',
                            type: 'string',
                            value: 'value',
                            rules: [{type: 'required', value: true, message: 'Please input your password!'},
                                {type: 'min', value: 5, message: 'Min length is 5'},
                                {type: 'max', value: 10, message: 'Max length is 10'}]
                        }, {
                            name: 'sex',
                            type: 'number',
                            value: '100'
                        }]
                    }
                }, {
                    id: 'n2',
                    position: {x: 500, y: 200},
                    type: 'case',
                    data: {
                        title: '选择分支',
                        detail: [
                            {
                                id: 'if1',
                                opr: 'and',
                                conditions: [
                                    {
                                        nodeId: 'n1',
                                        varName: 'name',
                                        varType: 'string',
                                        opr: 'in',
                                        value: '张三'
                                    }, {
                                        nodeId: 'n2',
                                        varName: 'sex',
                                        varType: 'string',
                                        opr: '=',
                                        value: '男'
                                    },{
                                        nodeId: 'n3',
                                        varName: 'sex',
                                        varType: 'string',
                                        opr: 'start with',
                                        value: '男'
                                    },{
                                        nodeId: 'n4',
                                        varName: 'sex',
                                        varType: 'string',
                                        opr: 'not in',
                                        value: '男'
                                    },
                                ]
                            },{
                                id: 'elseIf1',
                                opr: 'and',
                                conditions: [
                                    {
                                        nodeId: 'n5',
                                        varName: 'name',
                                        varType: 'string',
                                        opr: '>=',
                                        value: '张三'
                                    },
                                ]
                            }]
                    }
                }, {
                    id: 'n3',
                    position: {x: 1000, y: 200},
                    type: 'script',
                    data: {title: 'Node 3'}
                }],
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