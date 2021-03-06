/**
 * Created by WangLu on 2017/4/7.
 */
import ruler from '../images/ruler.png';
import triangle from '../images/triangle.png';
import btnPlay from '../images/btn_play.png';
import square1 from '../images/square1.png';
import square2 from '../images/square2.png';
import rectangle1 from '../images/rectangle1.png';
import rectangle2 from '../images/rectangle2.png';
import closeBtn from '../images/close_open_class.png';


/*
 let ruler ='images/ruler.png';
 let triangle ='images/triangle.png';
 let btnPlay ='images/btn_play.png';
 let square1 ='images/square1.png';
 let square2 ='images/square2.png';
 let rectangle1 ='images/rectangle1.png';
 let rectangle2 ='images/rectangle2.png';
 let closeBtn = 'images/close_open_class.png';
 */

class OpenClass02Ctrl {
    constructor($scope, recordPlayer, $compile, $window) {
        this.$scope = $scope;
        this.$compile = $compile;
        this.$window = $window;
        this.recordPlayer = recordPlayer;
        this.initData();

    }

    initData() {
        this.closeBtn = closeBtn;
        /*this.isStyleFlag = window.innerWidth < window.innerHeight;*/
        this.isBigScenePlay = false; //是否是大屏显示
        this.isCanPlayAnimation = false; //是否能播放动画
        if (!this.$scope.textContent || (this.$scope.textContent && !this.$scope.textContent.expr)) {
            this.$scope.textContent = {
                expr: '',
                inputBoxUUID: ''
            };
        } else {
            this.isBigScenePlay = true;
            this.isCanPlayAnimation = true;
        }

        /*   this.$scope.textContent = {
         expr: '',
         inputBoxUUID: ''
         };*/
        this.$scope.openClass02ImgArr = [];
        this.dragActionArr = [];
        this.startPostion = {};
        this.oneAaction = {};
        this.oneAaction.path = [];
        this.hasAdsorbFlag = false;
        this.hasInAdsorbArea = false; //是否已经进入过吸附区域
        this.oldInAdsorbArea = null; //发生吸附时的区域
        this.showWordSpr = null;//展示的描述文字
        this.ans = {
            similarityNum: 1,
            data: this.dragActionArr,
        };


        this.DATA = {
            DEGREE: Math.PI / 2,
            RULER: "ruler",
            TRIANGLE: "triangle",
            CANVAS_WIDTH: 600,
            CANVAS_HEIGHT: 600,
            SCALE: {
                RULER: 0.8,
                BIG_RULER: 1.2,
            },
            /*  CANVAS_BG_COLOR: "0x1099bb",*/
            CANVAS_BG_COLOR: "0xfafad2",
            ACTION: {
                MOVE: 'move',
                ROTATE: 'rotate',
            },
            SHAPE: {
                SQU: "正方形",
                RECT: '长方形'
            }
        };

        this.selfMovePathArr = [];
        this.adsorbParam = {
            ruler: {startPoint: {}, index: 0, arr: [], startDegree: 0, currentAreaArr: [], count: 0},
            triangle: {startPoint: {}, index: 0, arr: [], startDegree: 0, currentAreaArr: [], count: 0}
        };

        this.toolText = {
            position: {},
            ruler: {
                descWidthCon: null, //这条边的长是n厘米（数字和单位放大，红色）,
                descHeightCon: null, //这条边的长是n厘米（数字和单位放大，红色）,
                unitArr: [], //上下左右
                unitPosArr: []
            },
            triangle: {
                descCon: null, //这是一个直角 （直角为红色）
                rectFlagArr: [], //直角标志 顺序是从左上角开始，顺时针顺序
                rectFlagPointArr: []
            }
        }


    };

    initStage() {
        this.app = new PIXI.Application(this.DATA.CANVAS_WIDTH, this.DATA.CANVAS_HEIGHT, {backgroundColor: this.DATA.CANVAS_BG_COLOR});
        this.body.appendChild(this.app.view);

       /* if(this.isStyleFlag){
            this.app.view.style.width = "100%";
        }else{
            this.app.view.style.height = "100%";
        }*/
        //设置工具的初始位置
        this.adsorbParam.ruler.startPoint = {x: this.app.renderer.width / 2, y: 70};
        this.adsorbParam.triangle.startPoint = {x: this.app.renderer.width / 2, y: this.app.renderer.height / 1.18};
        this.initSprite();
    }

    initSprite() {
        let _this = this;
        let shapeArr = [{
            name: "shape",
            imgSrc: this.shapeSrc,
            param: {
                x: this.app.renderer.width / 2,
                y: this.app.renderer.height / 2 - 10
            }
        },
            {
                name: this.DATA.RULER,
                imgSrc: ruler,
                param: {
                    x: this.adsorbParam.ruler.startPoint.x,
                    y: this.adsorbParam.ruler.startPoint.y,
                    scale: 0.8
                },
                callback: this.setRulerAdsorbPoint
            },
            {
                name: this.DATA.TRIANGLE,
                imgSrc: triangle,
                param: {
                    x: this.adsorbParam.triangle.startPoint.x,
                    y: this.adsorbParam.triangle.startPoint.y,
                    scale: 0.8
                },
                callback: this.setTriangleAdsorbPoint
            },
            {
                name: "btnPlay",
                imgSrc: btnPlay,
                param: {
                    x: this.app.renderer.width / 8,
                    y: this.app.renderer.height - 50
                },
                callback: this.initStartData
            }
        ];
        var newImage = [];

        var imgScope = this.$scope.$parent;
        if (!imgScope.$parent) {
            imgScope.$parent = this.$scope.saveParentScope;
        }

        while (!imgScope.$root && imgScope.$parent) {
            imgScope = imgScope.$parent;
        }
        imgScope = imgScope.$root;
        if (!imgScope) {
            angular.forEach(shapeArr, function (data) {
                _this.createSprite(data);
            });
            return;
        }

        if (!imgScope.openClass02ImgArr) {
            imgScope.openClass02ImgArr = [];
        }

        if (imgScope.openClass02ImgArr.length == 0) {
            angular.forEach(shapeArr, function (img) {
                imgScope.openClass02ImgArr.push(img.imgSrc);
            });
            newImage = imgScope.openClass02ImgArr;
        } else {
            if (imgScope.openClass02ImgArr.indexOf(this.shapeSrc) == -1) {
                newImage = this.shapeSrc;
                imgScope.openClass02ImgArr.push(newImage);
            }
        }

        if (newImage.length == 0) {
            angular.forEach(shapeArr, function (data) {
                _this.createSprite(data);
            });
            return;
        }

        PIXI.loader
            .add(newImage)
            .load(function () {
                angular.forEach(shapeArr, function (data) {
                    _this.createSprite(data);
                })
            });

        /*
         PIXI.loader
         .add([
         shapeArr[0].imgSrc,
         shapeArr[1].imgSrc,
         shapeArr[2].imgSrc,
         shapeArr[3].imgSrc,
         ])
         .load(function () {
         angular.forEach(shapeArr, function (data) {
         _this.createSprite(data);
         })
         })*/
    }

    initStartData() {
        this.initShape();
        this.pathData = {
            rulerPosition: [this.adsorbParam.ruler.startPoint.x, this.adsorbParam.ruler.startPoint.y],
            trianglePosition: [this.adsorbParam.triangle.startPoint.x, this.adsorbParam.triangle.startPoint.y],
            rulerRotate: this.adsorbParam.ruler.startDegree,
            triangleRotate: this.adsorbParam.triangle.startDegree,
            config: this.dragActionArr,
        };
        this.$scope.textContent.inputBoxUUID = this.$scope.inputBoxUUID;

        this.updateStage();
        if (this.$scope.showType == 'doQuestion') {
            this.initListenerEvent();
        } else {
            //this.app.view.style.touchAction = "initial";
            this.initPlayEvent();
        }  //TODO
        /*   this.initListenerEvent();
         this.btnPlay.alpha = 1;
         this.initPlayEvent();*/
    }

    createSprite(data) {
        let sprName = data.name;
        let imgSrc = data.imgSrc;
        let x = data.param.x || 0;
        let y = data.param.y || 0;
        let scale = data.param.scale || 1;
        let callback = data.callback || null;

        let player = new PIXI.Sprite.fromImage(imgSrc);
        // 将中心点定在角色图片的中心
        player.anchor.set(0.5);
        player.position.set(x, y);
        player.scale.x = scale;
        player.scale.y = scale;
        player.alpha = 0;
        player.interactive = true;
        player.buttonMode = true;
        // 将玩家精灵加入到舞台上
        this.app.stage.addChild(player);
        this[sprName] = player;
        if (typeof callback == "function") {
            callback.call(this);
        }
    }

    /**
     * 设置直尺的吸附区域
     */
    setRulerAdsorbPoint() {
        this.ruler.shapeName = this.DATA.RULER;
        let tool = {
            w: this.ruler.width,
            w2: this.ruler.width / 2,
            h: this.ruler.height,
            h2: this.ruler.height / 2,
            h3: this.ruler.height / 3
        };
        let shape = {
            w2: this.shape.width / 2,
            h2: this.shape.height / 2
        };
        let spaceWidth = this.ruler.width / 22;

        let positionTop = {
            x: this.shape.x + tool.w2 - shape.w2 - spaceWidth,
            y: this.shape.y - shape.h2 + tool.h2 + 1
        };
        let positionRight = {
            x: this.shape.x + shape.w2 - tool.h2,
            y: this.shape.y + tool.w2 - shape.h2 - spaceWidth,
        };
        let positionBottom = {
            x: this.shape.x + tool.w2 - shape.w2 - spaceWidth,
            y: this.shape.y + shape.h2 + tool.h2
        };
        let positionLeft = {
            x: this.shape.x - shape.w2 - tool.h2,
            y: this.shape.y + tool.w2 - shape.h2 - spaceWidth,
        };

        this.adsorbParam.ruler.arr = [
            {position: positionTop, area: getTopOrBottomArea(positionTop), flag: false},
            {position: positionBottom, area: getTopOrBottomArea(positionBottom), flag: false},
            {position: positionLeft, area: getLeftOrRight(positionLeft), flag: false},
            {position: positionRight, area: getLeftOrRight(positionRight), flag: false}
        ];

        for (let i = 0; i < 4; i++) {
            this.adsorbParam.ruler.currentAreaArr.push(this.adsorbParam.ruler.arr[i]);
        }

        function getTopOrBottomArea(position) {
            return {
                topY: position.y - tool.h3,
                bottomY: position.y + tool.h3,
                rightX: position.x + tool.h,
                leftX: position.x - tool.h
            };
        }

        function getLeftOrRight(position) {
            return {
                topY: position.y - tool.h,
                bottomY: position.y + tool.h,
                rightX: position.x + tool.h3,
                leftX: position.x - tool.h3
            };
        }

    };

    /**
     * 设置三角板的吸附区域
     */
    setTriangleAdsorbPoint() {
        this.triangle.shapeName = this.DATA.TRIANGLE;
        this.triangle.interactive = false; //禁止拖动三角板
        this.triangle.buttonMode = false;

        let tool = {
            w: this.triangle.width,
            w2: this.triangle.width / 2,
            h: this.triangle.height,
            h2: this.triangle.height / 2,
            h3: this.triangle.height / 10
        };
        let shape = {
            w2: this.shape.width / 2,
            h2: this.shape.height / 2
        };
        let spaceWidth = 0;

        let positionTop = {
            x: this.shape.x + tool.w2 - shape.w2 - spaceWidth,
            y: this.shape.y - shape.h2 + tool.h2 + 1
        };
        let positionRight = {
            x: this.shape.x + shape.w2 - tool.h2,
            y: this.shape.y + tool.w2 - shape.h2 - spaceWidth,
        };
        let positionBottom = {
            x: this.shape.x - tool.w2 + shape.w2 - spaceWidth,
            y: this.shape.y - tool.h2 + shape.h2
        };
        let positionLeft = {
            x: this.shape.x + tool.h2 - shape.w2,
            y: this.shape.y - tool.w2 + shape.h2 - spaceWidth,
        };

        this.adsorbParam.triangle.arr = [
            {position: positionTop, area: getTopOrBottomArea(positionTop), flag: false},
            {position: positionRight, area: getLeftOrRight(positionRight), flag: false},
            {position: positionBottom, area: getTopOrBottomArea(positionBottom), flag: false},
            {position: positionLeft, area: getLeftOrRight(positionLeft), flag: false}
        ];
        this.adsorbParam.triangle.currentAreaArr.push(this.adsorbParam.triangle.arr[0]);

        function getTopOrBottomArea(position) {
            return {
                topY: position.y - tool.h3,
                bottomY: position.y + tool.h3,
                rightX: position.x + tool.h,
                leftX: position.x - tool.h
            };
        }

        function getLeftOrRight(position) {
            return {
                topY: position.y - tool.h,
                bottomY: position.y + tool.h,
                rightX: position.x + tool.h3,
                leftX: position.x - tool.h3
            };
        }
    };

    getRotateAction(rotation) {
        let myAction = {}; //旋转
        myAction.target = this.oneAaction.target;
        myAction.action = this.DATA.ACTION.ROTATE;
        myAction.path = null;
        myAction.degree = rotation;
        let waitAction = {action: "wait", target: this.oneAaction.target, textName: null};
        this.dragActionArr.push(myAction); //旋转
        this.dragActionArr.push(waitAction);//旋转后的暂停

        this.selfMovePathArr.push(myAction); //旋转
        this.selfMovePathArr.push(waitAction);//旋转后的暂停
        this.tooPlay();
    }

    getBackAction(toolAdsorbParam, currentTarget) {
        let myAction = {}; //旋转
        myAction.target = this.oneAaction.target;
        myAction.action = "back";
        myAction.path = []; //回到原来的位置
        currentTarget.x = toolAdsorbParam.startPoint.x;
        currentTarget.y = toolAdsorbParam.startPoint.y;
        myAction.path.push([currentTarget.x, currentTarget.y]);
        myAction.degree = toolAdsorbParam.startDegree;
        let waitAction = {action: "wait", target: this.oneAaction.target, textName: null}; //回到原来的位置后的暂停
        this.dragActionArr.push(myAction); //回到原来的位置
        this.dragActionArr.push(waitAction);

        this.selfMovePathArr.push(myAction); //回到原来的位置
        this.selfMovePathArr.push(waitAction);//回到原来的位置后的暂停
        this.tooPlay();
    }

    setToolPosition(currentTarget, toolAdsorbParam) {
        let param = toolAdsorbParam.currentAreaArr;
        let minIndex = null;
        if (currentTarget.shapeName == this.DATA.RULER) {
            minIndex = currentTarget.rotation == 0 ? 0 : 2;
        }
        angular.forEach(param, (temp, index)=> {
                if (temp.flag) return;
                if (currentTarget.shapeName == this.DATA.RULER && (index < minIndex || index >= minIndex + 2))return; //用于直尺
                let area = temp.area,
                    position = temp.position;
                //在吸附范围内并且没有进入过吸附区域才会发生吸附
                if (!this.hasInAdsorbArea && currentTarget.x >= area.leftX && currentTarget.x <= area.rightX && currentTarget.y >= area.topY && currentTarget.y <= area.bottomY) {
                    currentTarget.position.x = position.x;
                    currentTarget.position.y = position.y;
                    currentTarget.dragging = false;
                    if (this.oneAaction.path.length > 1) { //拖动事件
                        this.hasInAdsorbArea = true;
                        this.oldInAdsorbArea = area;
                        this.hasAdsorbFlag = true;
                        currentTarget.clicked = false;
                        temp.flag = true; //表示该边已经吸附过了
                        toolAdsorbParam.index = index;
                        toolAdsorbParam.count++;
                    }
                }

                if (this.hasInAdsorbArea && currentTarget.dragging && (currentTarget.x < this.oldInAdsorbArea.leftX || currentTarget.x > this.oldInAdsorbArea.rightX || currentTarget.y < this.oldInAdsorbArea.topY || currentTarget.y > this.oldInAdsorbArea.bottomY)) {
                    {
                        this.hasInAdsorbArea = false;
                        this.oldInAdsorbArea = null;
                    }
                }

            }
        );

    }

    dragStart(data) {
        this.removeBtn();
        if (this.showWordSpr) {
            this.showWordSpr.alpha = 0;
            this.showWordSpr = null;
            if (this.currentShowFlagText) {
                this.currentShowFlagText.alpha = 1;
                this.currentShowFlagText = null;
            }
        }

        data.data.originalEvent.preventDefault();
        if (data.data.originalEvent.stopPropagation) {
            data.data.originalEvent.stopPropagation();
        }
        data.data.originalEvent.cancelBubble = true;

        let currentTarget = data.currentTarget;
        currentTarget.data = data;
        currentTarget.alpha = 0.9;
        currentTarget.dragging = true;
        currentTarget.clicked = true;
        this.startPostion = {x: data.data.global.x, y: data.data.global.y};

        this.oneAaction = {};
        this.oneAaction.path = [];
        this.oneAaction.target = currentTarget.shapeName;

        console.log('mousedown');
    }

    dragMove(data) {
        data.data.originalEvent.preventDefault();
        if (data.data.originalEvent.stopPropagation) {
            data.data.originalEvent.stopPropagation();
        }
        data.data.originalEvent.cancelBubble = true;
        let currentTarget = data.currentTarget;

        if (!currentTarget.dragging)return;
        currentTarget.clicked = false;
        let newPosition = {x: data.data.global.x, y: data.data.global.y};
        let toolPosition = {
            x: currentTarget.position.x + newPosition.x - this.startPostion.x,
            y: currentTarget.position.y + newPosition.y - this.startPostion.y
        };
        //防止工具被拖出界
        let tempW = 0;
        toolPosition.x = toolPosition.x < tempW ? tempW : toolPosition.x;
        toolPosition.x = toolPosition.x > this.DATA.CANVAS_WIDTH - tempW ? this.DATA.CANVAS_WIDTH - tempW : toolPosition.x;
        toolPosition.y = toolPosition.y < tempW ? tempW : toolPosition.y;
        toolPosition.y = toolPosition.y > this.DATA.CANVAS_HEIGHT - tempW ? this.DATA.CANVAS_HEIGHT - tempW : toolPosition.y;
        currentTarget.position.x = toolPosition.x;
        currentTarget.position.y = toolPosition.y;
        this.oneAaction.path.push([toolPosition.x, toolPosition.y]);
        if (this.startPostion.x == newPosition.x && this.startPostion.y == newPosition.y) {
            currentTarget.clicked = true;
            this.dragging = false;
            return;
        }
        this.startPostion = newPosition;

        let toolAdsorbParam = this.adsorbParam[currentTarget.shapeName];
        if (currentTarget.shapeName == this.DATA.RULER) {
            if (currentTarget.rotation == 0) {
                this.showWordSpr = this.toolText.ruler.descWidthCon; //宽
            } else {
                this.showWordSpr = this.toolText.ruler.descHeightCon; //高
            }
        } else if (currentTarget.shapeName == this.DATA.TRIANGLE) {
            this.showWordSpr = this.toolText.triangle.descCon;
        }
        this.setToolPosition(currentTarget, toolAdsorbParam);
    }

    /**
     * 拖动直尺后停止
     * @param data
     */
    dragRulerEnd(data) {
        data.data.originalEvent.preventDefault();
        if (data.data.originalEvent.stopPropagation) {
            data.data.originalEvent.stopPropagation();
        }
        data.data.originalEvent.cancelBubble = true;
        let currentTarget = data.currentTarget;
        currentTarget.alpha = 1;
        currentTarget.dragging = false;

        let toolAdsorbParam = this.adsorbParam[currentTarget.shapeName]; //吸附判断的数据
        let flagIndex = null;

        if (currentTarget.clicked) {
            let rotation = currentTarget.rotation;
            rotation = rotation == this.DATA.DEGREE ? 0 : this.DATA.DEGREE;
            currentTarget.rotation = rotation;
            this.oneAaction.action = this.DATA.ACTION.ROTATE;
            this.oneAaction.path = null;
            this.oneAaction.degree = currentTarget.rotation;
        } else {
            this.oneAaction.path.push([currentTarget.x, currentTarget.y]);
            this.oneAaction.action = this.DATA.ACTION.MOVE;
            this.oneAaction.degree = null;
        }

        if (this.hasAdsorbFlag && this.showWordSpr) {
            flagIndex = this.hasAdsorbFlag ? toolAdsorbParam.index : null; //要显示的直角标志的下标
            this.showWordSpr.alpha = 1; //显示这条边的长是n厘米
            this.currentShowFlagText = this.toolText.ruler.unitArr[flagIndex]; //要显示的长度和单位
        }
        this.dragActionArr.push(this.oneAaction);
        let sprName = this.hasAdsorbFlag && this.showWordSpr ? this.showWordSpr.sprName : null;
        let waitAction = {action: "wait", target: this.oneAaction.target, textName: sprName, textFlagIndex: flagIndex};
        this.dragActionArr.push(waitAction); //拖动后的暂停
        this.$scope.textContent.expr = JSON.stringify(this.ans);
        currentTarget.clicked = false;
        this.hasAdsorbFlag = false; //设置是否已经吸附为false
        currentTarget.data = null;
        this.startPostion = {};
        if (toolAdsorbParam.count == 4) {
            this.selfMovePathArr = [];
            this.selfPathData = {
                rulerPosition: [this.ruler.x, this.ruler.y],
                trianglePosition: [this.triangle.x, this.triangle.y],
                rulerRotation: this.ruler.rotation,
                triangleRotation: this.triangle.rotation,
                config: this.selfMovePathArr,
            };
            if (this.currentShowFlagText) {
                this.currentShowFlagText.alpha = 1;
                this.currentShowFlagText = null;
            }
            if (currentTarget.rotation == this.DATA.DEGREE) {
                this.getRotateAction(this.DATA.DEGREE);
            }
            this.getBackAction(toolAdsorbParam, currentTarget);
            this.triangle.interactive = true; //可以拖动三角板
            this.triangle.buttonMode = true;
            this.ruler.interactive = false; //禁止拖动三直尺
            this.ruler.buttonMode = false;
        }
    }

    /**
     * 拖动三角板后停止
     * @param data
     */
    dragTriangleEnd(data) {
        data.data.originalEvent.preventDefault();
        if (data.data.originalEvent.stopPropagation) {
            data.data.originalEvent.stopPropagation();
        }
        data.data.originalEvent.cancelBubble = true;
        let currentTarget = data.currentTarget;
        currentTarget.clicked = false; //设置工具的点击状态为false
        currentTarget.dragging = false; //设置工具的拖动状态为false
        let toolAdsorbParam = this.adsorbParam[currentTarget.shapeName]; //吸附判断的数据
        let arrParam = toolAdsorbParam.currentAreaArr; //当前可吸附的范围以及相关数据
        let rotation = currentTarget.rotation; //工具当前的角度
        let flagIndex = this.hasAdsorbFlag ? toolAdsorbParam.count - 1 : null; //要显示的直角标志的下标
        currentTarget.alpha = 1;
        this.selfMovePathArr = [];

        //保存三角板的拖动状态和拖动后的停止状态并显示
        this.oneAaction.path.push([currentTarget.x, currentTarget.y]);
        this.oneAaction.action = this.DATA.ACTION.MOVE;
        this.oneAaction.degree = null;
        this.dragActionArr.push(this.oneAaction); //拖动
        let sprName = this.showWordSpr && this.hasAdsorbFlag ? this.showWordSpr.sprName : null;
        let waitAction = {action: "wait", target: this.oneAaction.target, textName: sprName, textFlagIndex: flagIndex};
        this.dragActionArr.push(waitAction); //拖动后的暂停
        this.selfMovePathArr.push(waitAction);

        if (!this.hasAdsorbFlag) return; //没有吸附，继续操作
        this.selfPathData = {
            rulerPosition: [this.ruler.x, this.ruler.y],
            trianglePosition: [this.triangle.x, this.triangle.y],
            rulerRotation: this.ruler.rotation,
            triangleRotation: this.triangle.rotation,
            config: this.selfMovePathArr,
        };


        if (toolAdsorbParam.count == 4) {
            this.getBackAction(toolAdsorbParam, currentTarget);
            this.triangle.interactive = false; //可以拖动三角板
            this.triangle.buttonMode = false;
        } else {
            toolAdsorbParam.currentAreaArr = [];
            toolAdsorbParam.currentAreaArr.push(toolAdsorbParam.arr[toolAdsorbParam.count]);
            rotation += this.DATA.DEGREE;
            rotation = rotation > this.DATA.DEGREE * 4 ? this.DATA.DEGREE : rotation;
            this.getRotateAction(rotation);
        }


        this.$scope.textContent.expr = JSON.stringify(this.ans);
        this.hasAdsorbFlag = false; //设置是否已经吸附为false
        currentTarget.data = null;
        this.startPostion = {};
    }

    initListenerEvent() {
        this.ruler.alpha = 1;
        this.ruler.on('pointerdown', this.dragStart.bind(this))
            .on('pointerup', this.dragRulerEnd.bind(this))
            .on('pointerupoutside', this.dragRulerEnd.bind(this))
            .on('pointermove', this.dragMove.bind(this));

        this.triangle.alpha = 1;
        this.triangle.on('pointerdown', this.dragStart.bind(this))
            .on('pointerup', this.dragTriangleEnd.bind(this))
            .on('pointerupoutside', this.dragTriangleEnd.bind(this))
            .on('pointermove', this.dragMove.bind(this));

    };

    updateStage() {
        let _this = this;
        requestAnimationFrame(function () {
            _this.app.renderer.render(_this.app.stage);
        });
    };


    getOpenClass02Style() {
        return window.innerWidth > window.innerHeight ? "open-class-02-width" : "open-class-02-height";
    };

    /**
     * 移除放大的图片
     */
    closeBigScene() {
        this.$scope.saveParentScope = this.$scope.$parent;
        //let navView = $('ion-nav-view');
        //navView.show();
        this.recordPlayer.cancleAnimate();
        this.$scope.$destroy();
        let template = $(".open-class-02-area");
        template.remove();
    }

    recordPlay() {
        this.removeBtn();
        let dataObj = JSON.parse(this.$scope.textContent.expr);
        let data = dataObj.data || dataObj;
        if (!this.isBigScenePlay) { //复制
            this.isCanPlayAnimation = false;
            let htmlTemplate = `<div class="open-class-02-area">
                                <open-class-02  bg="${this.attr.bg}" 
                                ng-class="ctrl.isStyleFlag ? 'open-class-02-width' : 'open-class-02-height'">   
                                <img src="${this.closeBtn}" alt=""
                        class="close-btn" ng-click="ctrl.closeBigScene()" >  
            </open-class-02></div>`;
            //let compiledOpenClass02 = this.$compile(htmlTemplate)(angular.copy(this.$scope));
            let compiledOpenClass02 = this.$compile(htmlTemplate)(this.$scope);
            let navView = $('ion-nav-view');
            let body = $('body');
            //body.append(compiledOpenClass02);
            $(this.app.view).parents('ion-view').eq(0).append(compiledOpenClass02);
        }
        if (!this.isCanPlayAnimation) {
            this.isCanPlayAnimation = true;
            return;
        }

        this.pathData = {
            rulerPosition: [this.adsorbParam.ruler.startPoint.x, this.adsorbParam.ruler.startPoint.y],
            trianglePosition: [this.adsorbParam.triangle.startPoint.x, this.adsorbParam.triangle.startPoint.y],
            config: data,
        };


        this.recordPlayer.initPlayerData(this.pathData, this.ruler, this.triangle, this.app, this.toolText);
        this.recordPlayer.recordPlaying(false);
    };

    initPlayEvent() {
        this.ruler.alpha = 1;
        this.triangle.alpha = 1;
        //this.$scope.$parent.$watch("textContent.expr", this.watchAnsExpr.bind(this));

        if (!this.isBigScenePlay) { //点击按钮出现大屏
            this.$scope.$parent.$watch("textContent.expr", this.watchAnsExpr.bind(this));
            if (this.$scope.textContent && this.$scope.textContent.expr) {
                this.watchAnsExpr();
            }
            return;
        } else { //大屏播放直接进入播放
            this.btnPlay.alpha = 0;  //隐藏播放按钮
            this.recordPlay();
        }
    };

    watchAnsExpr() {
        if (this.btnPlay.alpha != 0 || !this.$scope.textContent || (this.$scope.textContent && !this.$scope.textContent.expr))return;
        let dataObj = JSON.parse(this.$scope.textContent.expr);
        let data = dataObj.data || dataObj;
        this.pathData = {
            rulerPosition: [this.app.renderer.width / 2, this.app.renderer.height / 5],
            trianglePosition: [this.app.renderer.width / 2, this.app.renderer.height],
            config: data,
        };

        this.btnPlay.alpha = 0.9;
        this.btnPlay.on('pointerdown', this.recordPlay.bind(this));
    }

    tooPlay() {
        this.recordPlayer.initPlayerData(this.selfPathData, this.ruler, this.triangle, this.app, this.toolText);
        this.recordPlayer.ruler.waitTime = 0;
        this.recordPlayer.triangle.waitTime = 0;
        this.recordPlayer.recordPlaying(true);
    }

    /************添加要显示的所有文字*************/
    initNum(num) {
        let tempNum = Math.round(num);
        let n = Math.abs(tempNum - num);
        let rtn = n <= 0.2 ? tempNum : num;
        return rtn;
    };

    /**
     * 获取图形的长宽和高
     */
    initShape() {
        this.shape.alpha = 1;
        let unitLen = this.ruler.width / 11;
        let width = this.initNum((this.shape.width / unitLen).toFixed(1));
        let height = this.initNum((this.shape.height / unitLen).toFixed(1));

        let shapeName = width == height ? this.DATA.SHAPE.SQU : this.DATA.SHAPE.RECT;
        this.currentShape = {
            width: width,
            height: height,
            name: shapeName
        };
        this.initTextWord();
    };


    initTextWord() {
        let shape = {
            x: this.shape.x,
            y: this.shape.y,
            w2: this.shape.width / 2,
            h2: this.shape.height / 2,
            xAndW: this.shape.x + this.shape.width / 2,
            xMinW: this.shape.x - this.shape.width / 2,
            yAndH: this.shape.y + this.shape.height / 2,
            yMinH: this.shape.y - this.shape.height / 2,
            len: 10,
        };
        this.toolText.position = {x: shape.x, y: shape.y - shape.h2 - 50};
        //上下左右
        this.toolText.ruler.unitPosArr = [
            {x: shape.x, y: this.shape.y - shape.h2 - 15},
            {x: shape.x, y: this.shape.y + shape.h2 + 15},
            {x: shape.x - shape.w2 - 10, y: shape.y},
            {x: shape.x + shape.w2 + 10, y: shape.y}
        ];
        //直角标志 顺序是从左上角开始，顺时针顺序
        this.toolText.triangle.rectFlagPointArr = [
            [{x: shape.xMinW, y: shape.yMinH + shape.len}, {
                x: shape.xMinW + shape.len,
                y: shape.yMinH + shape.len
            }, {x: shape.xMinW + shape.len, y: shape.yMinH}],
            [{x: shape.xAndW, y: shape.yMinH + shape.len}, {
                x: shape.xAndW - shape.len,
                y: shape.yMinH + shape.len
            }, {x: shape.xAndW - shape.len, y: shape.yMinH}],
            [{x: shape.xAndW, y: shape.yAndH - shape.len}, {
                x: shape.xAndW - shape.len,
                y: shape.yAndH - shape.len
            }, {x: shape.xAndW - shape.len, y: shape.yAndH}],
            [{x: shape.xMinW, y: shape.yAndH - shape.len}, {
                x: shape.xMinW + shape.len,
                y: shape.yAndH - shape.len
            }, {x: shape.xMinW + shape.len, y: shape.yAndH}]
        ];
        let text, position;
        text = ["这是一个", "直角"];
        this.toolText.triangle.descCon = this.addTextCon(text, this.toolText.position);
        this.toolText.triangle.descCon.sprName = "rotate";
        text = ["这条边的长是", this.currentShape.width, "厘米"];
        this.toolText.ruler.descWidthCon = this.addTextCon(text, this.toolText.position);
        this.toolText.ruler.descWidthCon.sprName = "width";
        text = ["这条边的长是", this.currentShape.height, "厘米"];
        this.toolText.ruler.descHeightCon = this.addTextCon(text, this.toolText.position);
        this.toolText.ruler.descHeightCon.sprName = "height";

        text = this.currentShape.width + "厘米"; //宽 上

        for (let i = 0; i < 4; i++) {
            this.toolText.triangle.rectFlagArr.push(this.drawLine(this.toolText.triangle.rectFlagPointArr[i]));
            if (i > 1) {
                text = this.currentShape.height + "厘米"
            }
            this.toolText.ruler.unitArr.push(this.addText(text, {
                fontSize: 20,
                alpha: 0,
                x: this.toolText.ruler.unitPosArr[i].x,
                y: this.toolText.ruler.unitPosArr[i].y,
                anchor: [0.5, 0.5]
            }, this.app.stage));
        }

        this.toolText.ruler.unitArr[2].x -= this.toolText.ruler.unitArr[2].width / 2;
        this.toolText.ruler.unitArr[3].x += this.toolText.ruler.unitArr[3].width / 2;
    };

    /**
     * 创建文字描述，例如这是一个直角等
     * @param textArr
     * @param position
     * @param fontSize
     */
    addTextCon(textArr, position, fontSize) {
        let con = new PIXI.Container(); //创建container
        con.x = position.x;
        con.y = position.y;
        this.app.stage.addChild(con);
        let i = 0, len = textArr.length, textX, color, size;
        for (i = 0; i < len; i++) {
            if (i > 0) {
                textX = con.children[i - 1].width + con.children[i - 1].x;
                size = fontSize || 25;
                color = "#ff0000";
            }
            this.addText(textArr[i], {fontSize: size, color: color, x: textX, alpha: 1}, con);
        }
        con.x -= con.width / 2;
        con.alpha = 0;
        return con;
    }

    addText(word, param, con) {
        if (!word) return;
        var wordSpr = new PIXI.Text(word, {
            fontFamily: 'Arial',
            fontSize: param.fontSize || 22,
            fontWeight: 'bold',
            fill: param.color || '#424545'
        });
        let anchorPoint = param.anchor || [0, 0.5];
        wordSpr.anchor.set(anchorPoint[0], anchorPoint[1]);
        wordSpr.x = param.x || 0;
        wordSpr.y = param.y || 0;
        wordSpr.alpha = param.alpha || 0;
        if (con) {
            con.addChild(wordSpr);
        }
        return wordSpr;
    }

    /**
     * 画直角标
     * @param path
     */
    drawLine(path) {
        let graphic = new PIXI.Graphics();
        let line = graphic.lineStyle(1, "#424545", 1)
            .moveTo(path[0].x, path[0].y)
            .lineTo(path[1].x, path[1].y)
            .lineTo(path[2].x, path[2].y);
        this.app.stage.addChild(line);
        line.alpha = 0;
        return line;
    }


    removeBtn() {
        let btnArr = $('[title = "HOOK DIV"]');
        if (btnArr.length == 0) return;
        angular.forEach(btnArr, (btn)=> {
            btn.remove();
        })
    }
}

OpenClass02Ctrl.$inject = [
    '$scope', 'recordPlayer', '$compile', '$window'
];

export default OpenClass02Ctrl;