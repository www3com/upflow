export default {

    // 返回值可以是数组形式
    "GET /api/flow": {
        code: 200,
        msg: "",
        data: {
            "nodes": [{
                "id": "7zis3FGI",
                "type": "start",
                "position": {
                    "x": 256,
                    "y": 229
                },
                "width": 220,
                "data": {
                    "title": "开始",
                    "input": [{
                        "name": "name",
                        "rules": [{
                            "type": "required",
                            "message": "此字段为必填项"
                        }, {
                            "type": "length",
                            "message": "长度必须在 1 到 10 之间",
                            "value": "1,10"
                        }],
                        "type": "STRING",
                        "id": "RgCSYJoD"
                    }, {
                        "name": "sex",
                        "rules": [{
                            "type": "required",
                            "message": "此字段为必填项"
                        }],
                        "type": "INTEGER",
                        "id": "sBFNTxvh"
                    }],
                    "group": false
                },
                "measured": {
                    "width": 220,
                    "height": 115
                },
                "selected": false
            }],
            "edges": []
        }
    },


}