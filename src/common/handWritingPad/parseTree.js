/**
 * Created by Administrator on 2017/5/8.
 */

import {TreeNode} from './node/treeNode';
import Char from './node/char';
import Pow from './node/pow';
import Frac from './node/frac';
import Row from './node/row';
import {PowStroke, CharStroke, FracStroke} from './stroke/index';
import _find from 'lodash.find';
import _each from 'lodash.foreach';

class ParseTree {
    strokesInfo = {
        dataPoints: [{
            imgData: [
                {"x": 147, "y": 189}, {"x": 147, "y": 189}, {"x": 147, "y": 189},
                {"x": 146, "y": 189}, {"x": 146, "y": 188}, {"x": 146, "y": 187},
                {"x": 148, "y": 187}, {"x": 150, "y": 186}, {"x": 153, "y": 185},
                {"x": 154, "y": 185}, {"x": 158, "y": 185}, {"x": 163, "y": 185}, {"x": 168, "y": 186},
                {"x": 174, "y": 188}, {"x": 179, "y": 191}, {"x": 185, "y": 193},
                {"x": 189, "y": 196}, {"x": 192, "y": 199}, {"x": 194, "y": 202},
                {"x": 195, "y": 205}, {"x": 196, "y": 209}, {"x": 196, "y": 212},
                {"x": 196, "y": 219}, {"x": 192, "y": 228}, {"x": 186, "y": 237},
                {"x": 178, "y": 243}, {"x": 169, "y": 250}, {"x": 157, "y": 255},
                {"x": 145, "y": 259}, {"x": 135, "y": 262}, {"x": 125, "y": 263},
                {"x": 116, "y": 264}, {"x": 111, "y": 264}, {"x": 108, "y": 264},
                {"x": 105, "y": 264}, {"x": 104, "y": 264}, {"x": 105, "y": 264}, {"x": 110, "y": 263}, {
                    "x": 117,
                    "y": 261
                },
                {"x": 125, "y": 260}, {"x": 134, "y": 259}, {"x": 142, "y": 259},
                {"x": 152, "y": 259}, {"x": 162, "y": 259}, {"x": 170, "y": 259},
                {"x": 178, "y": 259}, {"x": 185, "y": 259}, {"x": 189, "y": 259},
                {"x": 191, "y": 259}, {"x": 193, "y": 259}, {"x": 194, "y": 259}
            ],
            strokeUUID: "709c90f6-faee-490f-824a-241e5abea573"
        }],
        recognize: '2',
        type: 'char',
        x: 104,
        y: 264,
        height: 79,
        width: 92,
    };

    constructor(canvasWidth, canvasHeight) {
        this.default = {
            fontSize : 24,
            padding:6
        };
        this.rootNode = new TreeNode();
        if (!isNaN(canvasWidth) && !isNaN(canvasHeight) && canvasWidth > 0 && canvasHeight > 0) {
            this.rootNode.setHeight(canvasHeight)
                .setWidth(canvasWidth)
                .setRoot(true);
        } else {
            console.error('parseTree:=> new ParseTree()必须传入canvas宽高......')
        }
    }

    /**
     * 添加字符到treeNode
     * @param stroke  字符的点阵数据
     * {
     *      strokesInfo:[
     *          {
     *              dataPoints:[],
     *              recognize:'',
     *              type:'',
     *              height:0,
     *              width:0,
     *              x:0,
     *              y:0,
     *          },
     *      ],
     *      wholeStroke:{
     *          dataPoints:[],
     *          recognize:'',
     *          height:0,
     *          width:0,
     *          x:0,
     *          y:0,
     *      }
     * }
     */
    addCharacterToTree(stroke) {
        stroke = stroke || [
            [
                {
                    "outerBox": {
                        "x": 85,
                        "y": 217,
                        "width": 39,
                        "height": 66
                    },
                    "type": "pow",
                    "rows": [
                        [
                            {
                                "outerBox": {
                                    "x": 85,
                                    "y": 217,
                                    "width": 39,
                                    "height": 66
                                },
                                "type": "character",
                                "recognizeCharacter": "2",
                                "strokeIds": [
                                    "0f86fbd6-6246-4b65-9dae-72a05114098c"
                                ]
                            }
                        ],
                        [
                            {
                                "outerBox": {
                                    "x": 85,
                                    "y": 217,
                                    "width": 39,
                                    "height": 66
                                },
                                "type": "character",
                                "recognizeCharacter": "2",
                                "strokeIds": [
                                    "0f86fbd6-6246-4b65-9dae-72a05114098c"
                                ]
                            }
                        ]
                    ]
                },
                {
                    "outerBox": {
                        "x": 173,
                        "y": 206,
                        "width": 45,
                        "height": 79
                    },
                    "type": "character",
                    "recognizeCharacter": "+",
                    "strokeIds": [
                        "a6238b64-c9df-42b6-9a5b-76ebb337b9f2",
                        "03de9144-b09c-4ce2-86e2-5e02762017f7"
                    ],
                    "imgData":[
                        [],
                        []
                    ]
                },
                {
                    "outerBox": {
                        "x": 273,
                        "y": 177,
                        "width": 100,
                        "height": 136
                    },
                    "type": "frac",
                    "rows": [
                        [
                            {
                                "outerBox": {
                                    "x": 294,
                                    "y": 179,
                                    "width": 47,
                                    "height": 52
                                },
                                "type": "character",
                                "recognizeCharacter": "+",
                                "strokeIds": [
                                    "02e7c5c6-83e6-4844-88c4-0dd10dc2c33a",
                                    "901df0d4-9fc9-45bf-b11f-66c694f92391"
                                ]
                            },
                            {
                                "outerBox": {
                                    "x": 348,
                                    "y": 179,
                                    "width": 25,
                                    "height": 47
                                },
                                "type": "character",
                                "recognizeCharacter": "2",
                                "strokeIds": [
                                    "6c92d93f-5d6a-45ba-a849-6868cda46676"
                                ]
                            },
                            {
                                "outerBox": {
                                    "x": 273,
                                    "y": 177,
                                    "width": 5,
                                    "height": 41
                                },
                                "type": "character",
                                "recognizeCharacter": "1",
                                "strokeIds": [
                                    "e500a73d-2585-4739-9329-3415f5b13700"
                                ]
                            }
                        ],
                        [
                            {
                                "outerBox": {
                                    "x": 257,
                                    "y": 246,
                                    "width": 129,
                                    "height": 5
                                },
                                "type": "character",
                                "recognizeCharacter": "-",
                                "strokeIds": [
                                    "2f4ec0ad-7e56-44ff-9327-6181e08f1043"
                                ]
                            }
                        ],
                        [
                            {
                                "outerBox": {
                                    "x": 292,
                                    "y": 267,
                                    "width": 72,
                                    "height": 46
                                },
                                "type": "character",
                                "recognizeCharacter": "2",
                                "strokeIds": [
                                    "f6722048-c885-4920-bace-3f1b4dc32d26"
                                ]
                            }
                        ]
                    ]
                }
            ],//第一行
            [
                {
                    "outerBox": {
                        "x": 48,
                        "y": 394,
                        "width": 60,
                        "height": 27
                    },
                    "type": "character",
                    "recognizeCharacter": "=",
                    "strokeIds": [
                        "a9c6fbe7-e4ca-4055-a179-6a116ad70e1a",
                        "a4f3951b-ee0f-4aef-885a-5380b6b66c70"
                    ]
                },
                {
                    "outerBox": {
                        "x": 145,
                        "y": 382,
                        "width": 39,
                        "height": 70
                    },
                    "type": "character",
                    "recognizeCharacter": "3",
                    "strokeIds": [
                        "740a4465-8b55-4b94-a336-d94155ed9d68"
                    ]
                }
            ] //第二行
        ];


        if (this.rootNode.children.length === 0) {//本次输入为第一次 , 直接添加到rootNode第一行
            this.appendNewRowToRootNode(stroke);

        } else { //判断本次输入的笔记整体位置属于根节点中哪一行row
            let row = this.checkCharacterLocationY(stroke, this.rootNode);

            if(!row){ //不属于已有的任何一行, 换行生成新的row
                this.appendNewRowToRootNode(stroke);
            }else {
                this.appendSpecifyStrokeToRow(stroke,row);
            }
        }

    }

    /**
     * 向根添加最新的一行
     * @param strokeRowArr 输入的笔画,行（row）数组
     */
    appendNewRowToRootNode(strokeRowArr) {
        _each(strokeRowArr,(stroke)=>{
            //新增row

            let row = new Row(this.rootNode, stroke);
            this.rootNode.appendChild(row);

            //向新增的row节点添加详细的stroke.strokesInfo
            _each(stroke,(item)=>{
                if(item.type === TreeNode.TYPE.CHAR){ //普通字符
                    this.appendNewCharToRow(item, row);
                }else if(item.type === TreeNode.TYPE.POW){ //指数幂
                    this.appendNewPowToRow(item, row);
                }else if(item.type === TreeNode.TYPE.FRAC){ //分数
                    this.appendNewFracToRow(item, row);
                }
            });

        });
    }

    /**
     * 向行节点（row）添加一个字符
     * @param charData
     * @param row
     * @return Object 新添加的字符对象
     */
    static appendNewCharToRow(charData, row) {
        let char = new Char(row)
            .setHeight(charData.outerBox.height)
            .setWidth(charData.outerBox.width)
            .setX(charData.outerBox.x)
            .setY(charData.outerBox.y)
            .setText(charData.recognizeCharacter)
            .setDataPoints(charData.dataPoints);

        row.appendChild(char);
        this.standardCharacterSizeAndLocation(row);
        return char
    }

    /**
     * 向行节点（row）添加一个指数幂
     * @param powData
     * @param row
     * @return Object 新添加的指数幂对象
     */
    static appendNewPowToRow(powData, row) {
        let pow = new Pow()
            .setHeight(powData.height)
            .setWidth(powData.width)
            .setX(powData.x)
            .setY(powData.y)
            .setDataPoints(powData.dataPoints);

        row.appendChild(pow);
        return pow
    }

    /**
     * 向行节点（row）添加一个分数
     * @param fracData
     * @param row
     * @return Object 新添加的分数对象
     */
    static appendNewFracToRow(fracData, row) {
        let frac = new Frac()
            .setHeight(fracData.height)
            .setWidth(fracData.width)
            .setX(fracData.x)
            .setY(fracData.y)
            .setDataPoints(fracData.dataPoints);

        row.appendChild(frac);
        return frac

    }

    /**
     * 向行节点（row）添加本次输入的内容
     * @param stroke
     * @param row
     */
    static appendSpecifyStrokeToRow(stroke, row){
        //查找要添加到row中的子节点位置





    }

    /**
     * 判断当前的字符在Node中的位置
     * @param stroke 需要查找位置的笔画
     * @param node 查找的范围节点
     */
    checkCharacterLocationY = (stroke, node) => {
        //判断stroke属于node中的哪一行
        return _find(node.children, (row)=> {
            //stroke整体都在row的高度范围内,stroke在这行row内
            let allInRow = row.y < stroke.y && (row.height + row.y > stroke.height + stroke.y);

            //stroke中间部分都在row的高度范围内,stroke在这行row内
            let middleInRow = (row.y < stroke.y + stroke.height / 2) && (row.y + row.height > stroke.y + stroke.height / 2);

            return allInRow || middleInRow;
        });
    };



    /**
     * 设置手写体的大小和位置与印刷体一致
     * @param Row 指定根节点的行
     */
    standardCharacterSizeAndLocation(Row) {
        let canvasHeight = this.rootNode.height;
        let canvasWidth = this.rootNode.width;

        let setCharSize = (rowChildren) =>{
            let startX = (rowChildren[0] && rowChildren[0].outerBox.x)||0;
            let startY = (rowChildren[0] && rowChildren[0].outerBox.y)||0;
            _each(rowChildren, (child)=>{
                if(child.type !== this.rootNode.TYPE.CHAR){
                    setCharSize(child.rows);
                }else {
                    child.setFontSize(this.default.fontSize)
                        .setX(startX)
                        .setY(startY)
                        .setWidth(this.default.fontSize+this.default.padding)
                        .setHeight(this.default.fontSize+this.default.padding);

                    startX += child.x;
                    startY += child.y;
                    row_width+=child.width;
                    row_height+=child.height;
                    //todo 缩放dataPoints 点阵

                }
            })
        };


        //标准化根节点row的高度
        let row_width = 0;
        let row_height = 0;
        setCharSize(Row);
    }


}
export {ParseTree, PowStroke, CharStroke, FracStroke}