export default {

    // 返回值可以是数组形式
    "GET /api/flow": {
        code: 200,
        msg: "",
        data: {
            "nodes": [{
                "id": "n2",
                "position": {
                    "x": 500,
                    "y": 200
                },
                "type": "case",
                "data": {
                    "title": "选择分支",
                    "detail": [{
                        "id": "if1",
                        "opr": "and",
                        "conditions": [{
                            "nodeId": "n1",
                            "varName": "name",
                            "varType": "string",
                            "opr": "in",
                            "value": "张三"
                        }, {
                            "nodeId": "n2",
                            "varName": "sex",
                            "varType": "string",
                            "opr": "=",
                            "value": "男"
                        }, {
                            "nodeId": "n3",
                            "varName": "sex",
                            "varType": "string",
                            "opr": "start with",
                            "value": "男"
                        }, {
                            "nodeId": "n4",
                            "varName": "sex",
                            "varType": "string",
                            "opr": "not in",
                            "value": "男"
                        }]
                    }, {
                        "id": "elseIf1",
                        "opr": "and",
                        "conditions": [{
                            "nodeId": "n5",
                            "varName": "name",
                            "varType": "string",
                            "opr": ">=",
                            "value": "张三"
                        }]
                    }]
                },
                "measured": {
                    "width": 220,
                    "height": 268
                },
                "selected": false
            },{
                "id": "n3",
                "position": {
                    "x": 1000,
                    "y": 200
                },
                "type": "for",
                "width": 936,
                "height": 695,
                "data": {
                    "title": "Node 3"
                },
                "measured": {
                    "width": 936,
                    "height": 695
                },
                "resizing": false,
                "selected": false
            },  {
                "id": "n1",
                "type": "start",
                "parentId": "n3",
                "width": 220,
                "position": {
                    "x": 100,
                    "y": 200
                },
                "data": {
                    "title": "开始",
                    "input": [{
                        "name": "name",
                        "type": "string",
                        "value": "value",
                        "rules": [{
                            "type": "required",
                            "value": true,
                            "message": "Please input your password!"
                        }, {
                            "type": "min",
                            "value": 5,
                            "message": "Min length is 5"
                        }, {
                            "type": "max",
                            "value": 10,
                            "message": "Max length is 10"
                        }]
                    }, {
                        "name": "sex",
                        "type": "number",
                        "value": "100"
                    }]
                },
                "measured": {
                    "width": 620,
                    "height": 115
                },
                "selected": false
            }, {
                "id": "nB-V1ChR",
                "type": "for",
                "width": 400,
                "height": 200,
                "data": {
                    "title": "循环",
                    "input": []
                },
                "position": {
                    "x": 344,
                    "y": 424
                },
                "measured": {
                    "width": 400,
                    "height": 200
                },
                "selected": false,
                "dragging": false,
                "className": "undefined ",
                "parentId": "n3"
            }],
            "edges": []
        }
    },


}