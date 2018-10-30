/**
 * Author 邓小龙 on 2017/03/16.
 * @description 驯宠掌握考点的动画
 */
import  directives from './../index';
import  $ from 'jquery';
const COLORS = ["rgba(51,181,229,1)", "rgba(0,153,204,1)", "rgba(170,102,204,1)", "rgba(153,51,204,1)", "rgba(153,204,0,1)", "rgba(102,153,0,1)", "rgba(255,187,51,1)", "rgba(255,136,0,1)", "rgba(255,68,68,1)", "rgba(204,0,0,1)"];
const DEG = Math.PI / 180, FRAME_PER_SECOND = 24, FRAME_SPENT_TIME = 1000 / FRAME_PER_SECOND, SCREEN_WIDTH = 675, SPRITE_LOGO_SIZE = 19, SPRITE_SHEET_WIDTH = 512, NOTE_SIZE = {
    SMALL_SCREEN_MIN_WIDTH: 5,
    SMALL_SCREEN_MAX_WIDTH: 15,
    SMALL_SCREEN_MIN_HEIGHT: 5,
    SMALL_SCREEN_MAX_HEIGHT: 20,
    BIG_SCREEN_MIN_WIDTH: 8,
    BIG_SCREEN_MAX_WIDTH: 25,
    BIG_SCREEN_MIN_HEIGHT: 8,
    BIG_SCREEN_MAX_HEIGHT: 32
};
directives.directive('diagnoseMasterAct', ["$timeout", "$rootScope","finalData", function ($timeout, $rootScope,finalData) {
    return {
        restrict: 'E',
        scope: {
            actEndCallBack: '&',
            numIndex: '@'
        },
        replace: true,
        template: '<canvas id="diagnoseMasterActCanvas"   ></canvas>',
        link: function ($scope, element, attr) {
            let canvas = document.getElementById("diagnoseMasterActCanvas"),
                ctx = canvas.getContext('2d'),
                w = canvas.width = window.innerWidth,
                h = canvas.height = window.innerHeight,
                executeCount = 0,
                lastAdvance = 0,
                imgHasLoadCount = 0,
                noteRoutePerFrame = 10,//折纸每帧旋转10
                firstNotesTimeDelay = 5,
                secondNotesTimeDelay = 10,//n帧之后
                threeNotesTimeDelay = 15,//n帧之后
                notesFadeStart = 50,//n帧之后折纸开始消失
                bottomImgShowComplete = 15,//底部图片组在n帧之前渲染完
                bottomImgFadeStart = 43,//底部图片组在n帧开始消失
                spriteSheetFadeStart = 72,//精灵动画在n帧开始消失
                imgItem,
                notList = [],
                effectsSprite = new Image(),
                adorablePetSprite = new Image(),
                noteMinWidth,
                noteMaxWidth,
                noteMinHeight,
                noteMaxHeight,
                numIndex = parseInt($scope.numIndex || 0) % finalData.ADORABLE_PET_TOTAL_COUNT,//目前只有5种萌宠，每一种萌宠都是固定19帧
                actStartIndex = numIndex * SPRITE_LOGO_SIZE,
                imgList = [
                    {src: 'sImages/glow_03.png', radius: 5, id: "1"},
                    {src: 'sImages/glow_02.png', radius: 5, id: "2", routeAngle: 0.5, routeAngleInit: 0.5},
                    {src: 'sImages/glow_01.png', radius: 5, id: "3", routeAngle: -0.5, routeAngleInit: -0.5},
                    {src: 'sImages/glow_00.png', radius: 5, id: "4", routeAngle: -0.5, routeAngleInit: -0.5}
                ];

            let runInPlace = {
                execute: (sprite, ctx, now) => {
                    sprite.painter.advance();
                }
            };


            let handleColorFade = (color)=> {
                if (color.indexOf('rgba') === -1) return;

                let firstStr = "";
                let alpha = color.replace(/rgba.*,/g, (object)=> {
                    firstStr = object;
                    return '';
                }).replace(/\)/g, '');
                let newAlpha = (parseFloat(alpha) * 10 - 1) / 10;
                return firstStr + newAlpha + ')';
            };

            let handleGlobalAlphaFade = (executeCount, fadeStart, initAlpha)=> {
                if (executeCount > (fadeStart + initAlpha * 10)) return 0;
                return executeCount > fadeStart ? (initAlpha * 10 - (executeCount - fadeStart)) * 0.1 : initAlpha;
            };

            let randomRange = (max, min) => {
                return Math.floor(Math.random() * (max - min + 1) + min);
            };

            let Sprite = function (name, painter, behaviors) {
                if (name !== undefined) this.name = name;
                if (painter !== undefined) this.painter = painter;
                this.top = 0;//精灵左上角y
                this.left = 0;//精灵左上角x
                this.width = 10;//宽度
                this.height = 10;//高度
                this.velocityX = 0;//水平速度
                this.velocityY = 0;//垂直速度
                this.visible = true;//是否可见
                this.animating = false;//是否正在执行动画
                this.behaviors = behaviors || [];//一个包含精灵行为对象的数组
            };
            Sprite.prototype = {
                paint: function (ctx) {
                    if (this.painter !== undefined && this.visible) {
                        this.painter.paint(this, ctx);
                    }
                },
                update: function (ctx, time) {
                    for (var i = 0; i < this.behaviors.length; ++i) {
                        this.behaviors[i].execute(this, ctx, time);
                    }
                }
            };

            let SpriteSheetPainter = function (effectCells, adorablePetCells) {
                this.effectCells = effectCells || [];
                this.adorablePetCells = adorablePetCells || [];
                this.adorablePetCellsIndex = -1;
                this.effectCellsIndex = -1;
            };
            SpriteSheetPainter.prototype = {
                advance: function () {
                    if (this.adorablePetCellsIndex == this.adorablePetCells.length - 1) {
                        this.adorablePetCellsIndex = 0;
                    } else {
                        this.adorablePetCellsIndex++;
                    }
                    if (this.effectCellsIndex == this.effectCells.length - 1) {
                        this.effectCellsIndex = 0;
                    } else {
                        this.effectCellsIndex++;
                    }
                },
                paint: function (sprite, ctx) {
                    let adorablePetCell = this.adorablePetCells[this.adorablePetCellsIndex];
                    let effectCell = this.effectCells[this.effectCellsIndex];
                    ctx.save();
                    ctx.globalAlpha = handleGlobalAlphaFade(executeCount, spriteSheetFadeStart, 1);
                    ctx.drawImage(effectsSprite, effectCell.left, effectCell.top, effectCell.width, effectCell.height, sprite.left, sprite.top, sprite.width, sprite.width);
                    ctx.globalCompositeOperation = 'destination-over';
                    // ctx.drawImage(adorablePetSprite, adorablePetCell.left, adorablePetCell.top, adorablePetCell.width, adorablePetCell.height, sprite.left, sprite.top, sprite.width, sprite.width);
                    ctx.restore();
                }
            };

            let effectCells = [
                    {left: 512, top: 0, width: 512, height: 512},
                    {left: 2048, top: 2048, width: 512, height: 512},
                    {left: 0, top: 512, width: 512, height: 512},
                    {left: 512, top: 512, width: 512, height: 512},
                    {left: 1024, top: 0, width: 512, height: 512},
                    {left: 1024, top: 512, width: 512, height: 512},
                    {left: 0, top: 1024, width: 512, height: 512},
                    {left: 512, top: 1024, width: 512, height: 512},
                    {left: 1024, top: 1024, width: 512, height: 512},
                    {left: 1536, top: 0, width: 512, height: 512},
                    {left: 1536, top: 512, width: 512, height: 512},
                    {left: 1536, top: 1024, width: 512, height: 512},
                    {left: 0, top: 1536, width: 512, height: 512},
                    {left: 512, top: 1536, width: 512, height: 512},
                    {left: 1024, top: 1536, width: 512, height: 512},
                    {left: 1536, top: 1536, width: 512, height: 512},
                    {left: 2048, top: 0, width: 512, height: 512},
                    {left: 2048, top: 512, width: 512, height: 512},
                    {left: 2048, top: 1024, width: 512, height: 512},
                    {left: 2048, top: 1536, width: 512, height: 512},
                    {left: 0, top: 2048, width: 512, height: 512},
                    {left: 512, top: 2048, width: 512, height: 512},
                    {left: 1024, top: 2048, width: 512, height: 512},
                    {left: 1536, top: 2048, width: 512, height: 512},
                    {left: 0, top: 0, width: 512, height: 512},
                    {left: 2560, top: 0, width: 512, height: 512},
                    {left: 2560, top: 512, width: 512, height: 512},
                    {left: 2560, top: 1024, width: 512, height: 512},
                    {left: 2560, top: 1536, width: 512, height: 512},
                    {left: 2560, top: 2048, width: 512, height: 512},
                    {left: 0, top: 2560, width: 512, height: 512},
                    {left: 512, top: 2560, width: 512, height: 512},
                    {left: 1024, top: 2560, width: 512, height: 512},
                    {left: 1536, top: 2560, width: 512, height: 512},
                    {left: 2048, top: 2560, width: 512, height: 512},
                    {left: 2560, top: 2560, width: 512, height: 512},
                    {left: 3072, top: 0, width: 512, height: 512},
                    {left: 3072, top: 512, width: 512, height: 512},
                    {left: 3072, top: 1024, width: 512, height: 512},
                    {left: 3072, top: 1536, width: 512, height: 512},
                    {left: 3072, top: 2048, width: 512, height: 512},
                    {left: 3072, top: 2560, width: 512, height: 512},
                    {left: 0, top: 3072, width: 512, height: 512},
                    {left: 512, top: 3072, width: 512, height: 512},
                    {left: 1024, top: 3072, width: 512, height: 512},
                    {left: 1536, top: 3072, width: 512, height: 512},
                    {left: 2048, top: 3072, width: 512, height: 512},
                    {left: 2560, top: 3072, width: 512, height: 512}
                ],
                adorablePetCells0 = [
                    {left: 512, top: 0, width: 512, height: 512},
                    {left: 1536, top: 0, width: 512, height: 512},
                    {left: 0, top: 512, width: 512, height: 512},
                    {left: 512, top: 512, width: 512, height: 512},
                    {left: 1024, top: 0, width: 512, height: 512},
                    {left: 1024, top: 512, width: 512, height: 512},
                    {left: 0, top: 1024, width: 512, height: 512},
                    {left: 512, top: 1024, width: 512, height: 512},
                    {left: 1024, top: 1024, width: 512, height: 512},
                    {left: 0, top: 0, width: 512, height: 512},
                    {left: 1536, top: 512, width: 512, height: 512},
                    {left: 1536, top: 1024, width: 512, height: 512},
                    {left: 0, top: 1536, width: 512, height: 512},
                    {left: 512, top: 1536, width: 512, height: 512},
                    {left: 1024, top: 1536, width: 512, height: 512},
                    {left: 1536, top: 1536, width: 512, height: 512},
                    {left: 2048, top: 0, width: 512, height: 512},
                    {left: 2048, top: 512, width: 512, height: 512},
                    {left: 2048, top: 1024, width: 512, height: 512}
                ],
                adorablePetCells1 = [
                    {left: 513, top: 0, width: 513, height: 512},
                    {left: 1539, top: 0, width: 513, height: 512},
                    {left: 0, top: 512, width: 513, height: 512},
                    {left: 513, top: 512, width: 513, height: 512},
                    {left: 1026, top: 0, width: 513, height: 512},
                    {left: 1026, top: 512, width: 513, height: 512},
                    {left: 0, top: 1024, width: 513, height: 512},
                    {left: 513, top: 1024, width: 513, height: 512},
                    {left: 1026, top: 1024, width: 513, height: 512},
                    {left: 0, top: 0, width: 513, height: 512},
                    {left: 1539, top: 512, width: 513, height: 512},
                    {left: 1539, top: 1024, width: 513, height: 512},
                    {left: 0, top: 1536, width: 513, height: 512},
                    {left: 513, top: 1536, width: 513, height: 512},
                    {left: 1026, top: 1536, width: 513, height: 512},
                    {left: 1539, top: 1536, width: 513, height: 512},
                    {left: 2052, top: 0, width: 513, height: 512},
                    {left: 2052, top: 512, width: 513, height: 512},
                    {left: 2052, top: 1024, width: 513, height: 512}
                ],
                adorablePetCells = numIndex === 0 ? adorablePetCells0 : adorablePetCells1,
                sprite = new Sprite('runner', new SpriteSheetPainter(effectCells, adorablePetCells), [runInPlace]);

            //折纸
            let Note = function (x, y, w, h, vx, vy, type, topAngle, bottomAngle, fillStyle, timeDelay, routeAngle) {
                this.x = x;
                this.y = y;
                this.w = w;
                this.h = h;
                this.type = type;
                this.topAngle = topAngle;
                this.bottomAngle = bottomAngle;
                this.fillStyle = fillStyle;
                this.routeAngle = routeAngle;
                this.g = 1.3 + Math.random();
                this.vx = vx;
                this.vy = vy;
                this.excuteCount = 0;
                this.timeDelay = timeDelay || 0;

            };
            Note.prototype = {
                paint: function (ctx) {
                    if (this.type === 1) {//折纸
                        var dotX = -this.w / 2, doxY = 0, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5;
                        x1 = dotX - this.h * Math.sin(this.topAngle);
                        y1 = doxY - this.h * Math.cos(this.topAngle);
                        x2 = x1 + this.w;
                        y2 = y1;
                        x3 = dotX + this.w;
                        y3 = doxY;
                        x5 = dotX - this.h * Math.sin(this.bottomAngle);
                        y5 = doxY + this.h * Math.cos(this.bottomAngle);
                        x4 = x5 + this.w;
                        y4 = y5;
                        ctx.save();
                        ctx.globalCompositeOperation = 'source-over';
                        ctx.translate(this.x, this.y);
                        ctx.rotate(this.routeAngle);
                        ctx.beginPath();
                        ctx.moveTo(dotX, doxY);
                        ctx.lineTo(x1, y1);
                        ctx.lineTo(x2, y2);
                        ctx.lineTo(x3, y3);
                        ctx.lineTo(x4, y4);
                        ctx.lineTo(x5, y5);
                        ctx.fillStyle = this.fillStyle;

                        ctx.fill();
                        ctx.restore();
                    } else {//方片纸
                        ctx.save();
                        ctx.globalCompositeOperation = 'source-over';
                        ctx.transform(1, Math.tan(this.topAngle), Math.tan(this.bottomAngle), 1, this.x, this.y);
                        if (this.routeAngle) {
                            ctx.rotate(this.routeAngle);
                        }
                        ctx.fillStyle = this.fillStyle;
                        ctx.fillRect(0, 0, this.w, this.h);
                        ctx.restore();
                    }
                },
                update: function (routeAngle, time) {
                    if (this.excuteCount > this.timeDelay) {
                        //todo:优化成像素速度
                        var addSpeed = (this.excuteCount - this.timeDelay) <= 5 ? 3 : 0;
                        this.x += this.vx + addSpeed;
                        this.y += this.vy + addSpeed;
                        this.vy += this.g;
                        this.routeAngle += routeAngle * DEG;
                        if (this.excuteCount >= notesFadeStart) {//执行35帧之后就可以慢慢消失
                            this.fillStyle = handleColorFade(this.fillStyle);
                        }
                    }
                    this.excuteCount++;
                }
            };

            noteMinWidth = window.innerWidth > SCREEN_WIDTH ? NOTE_SIZE.BIG_SCREEN_MIN_WIDTH : NOTE_SIZE.SMALL_SCREEN_MIN_WIDTH;
            noteMaxWidth = window.innerWidth > SCREEN_WIDTH ? NOTE_SIZE.BIG_SCREEN_MAX_WIDTH : NOTE_SIZE.SMALL_SCREEN_MAX_WIDTH;
            noteMinHeight = window.innerWidth > SCREEN_WIDTH ? NOTE_SIZE.BIG_SCREEN_MIN_HEIGHT : NOTE_SIZE.SMALL_SCREEN_MIN_HEIGHT;
            noteMaxHeight = window.innerWidth > SCREEN_WIDTH ? NOTE_SIZE.BIG_SCREEN_MIN_HEIGHT : NOTE_SIZE.SMALL_SCREEN_MIN_HEIGHT;

            let createNot = (x, y, vx, vy, timeDelay) => {
                var w, h, type, topAngle, bottomAngle, fillStyle, routeAngle;
                w = randomRange(noteMinWidth, noteMaxWidth);
                h = randomRange(noteMinHeight, noteMaxHeight);
                topAngle = randomRange(15, 25) * DEG;
                bottomAngle = randomRange(10, 15) * DEG;
                routeAngle = randomRange(1, 360) * DEG;
                fillStyle = COLORS[Math.floor(Math.random() * COLORS.length)];
                type = Math.random() > 0.5 ? 1 : 0;
                let notInfo = new Note(x, y, w, h, vx, vy, type, topAngle, bottomAngle, fillStyle, timeDelay, routeAngle);
                notList.push(notInfo);
                notInfo.paint(ctx);
            };

            let initNotList = () => {
                let x, y, vx, vy;
                for (var i = 0; i < 40; i++) {
                    x = randomRange(canvas.width / 2 - 50, canvas.width / 2 + 50);
                    y = canvas.height + 10;
                    vx = randomRange(-15, 15);
                    vy = randomRange(-40, -30);
                    createNot(x, y, vx, vy, firstNotesTimeDelay);//最底部一组
                }
                for (; i < 70; i++) {//居左的一组
                    x = -22;
                    y = randomRange(canvas.height / 2 + 150, canvas.height / 2 + 200);
                    vx = randomRange(5, 15);
                    vy = randomRange(-40, -30);
                    createNot(x, y, vx, vy, secondNotesTimeDelay);//最底部一组
                }
                for (; i < 100; i++) {//居右的一组
                    x = canvas.width + 22;
                    y = randomRange(canvas.height / 2 + 150, canvas.height / 2 + 200);
                    vx = randomRange(-15, -5);
                    vy = randomRange(-40, -30);
                    createNot(x, y, vx, vy, threeNotesTimeDelay);//最底部一组
                }
            };


            let initImgs = () => {
                for (var i = 0; i < imgList.length; i++) {
                    imgItem = imgList[i];
                    imgItem.imgInfo = new Image();
                    imgItem.imgInfo.src = imgItem.src;
                    imgItem.imgInfo.onload = (e) => {
                        imgHasLoadCount++;
                    };
                }
            };


            let imgUpdate = (item, routeAngle, executeCount)=> {
                let imgInfo = item.imgInfo;
                let pattern = ctx.createPattern(imgInfo, "no-repeat");
                ctx.save();
                ctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = handleGlobalAlphaFade(executeCount, bottomImgFadeStart, 0.8);
                if (routeAngle) {
                    ctx.translate(w / 2, h);
                    if (routeAngle)   ctx.rotate(routeAngle);
                    ctx.translate(-w / 2, -h);
                    ctx.drawImage(imgInfo, w / 2 - imgInfo.width / 2, h - imgInfo.height / 2, imgInfo.width, imgInfo.height);
                } else {
                    ctx.translate(w / 2 - imgInfo.width / 2, h - imgInfo.height / 2);
                    ctx.arc(imgInfo.width / 2, imgInfo.height / 2, item.radius, 0, 2 * Math.PI, false);
                }
                ctx.fillStyle = pattern;
                ctx.fill();
                ctx.restore();
            };

            let batchUpdateImg = ()=> {
                for (var j = 0; j < imgList.length; j++) {
                    imgItem = imgList[j];
                    if (executeCount < bottomImgShowComplete) {
                        imgItem.radius = imgItem.radius + 10;
                        imgUpdate(imgItem, null, executeCount);
                    } else {
                        if (imgItem.routeAngle) {
                            imgUpdate(imgItem, imgItem.routeAngle * DEG, executeCount);
                            imgItem.routeAngle = imgItem.routeAngle + imgItem.routeAngleInit;
                            if (Math.abs(imgItem.routeAngle) >= 360) {
                                imgItem.routeAngle = imgItem.routeAngleInit;
                            }
                        } else
                            imgUpdate(imgItem, null, executeCount);
                    }
                }
            };


            let animate = (time)=> {

                if (time - lastAdvance > FRAME_SPENT_TIME) {
                    ctx.clearRect(0, 0, w, h);
                    sprite.update(ctx, time);
                    sprite.paint(ctx);
                    if (executeCount === 0) {
                        initNotList();
                    } else {
                        var noteInfo;
                        for (var i = 0; i < notList.length; i++) {
                            noteInfo = notList[i];
                            noteInfo.update(noteRoutePerFrame, time);
                            noteInfo.paint(ctx);
                        }
                    }

                    /*if (imgHasLoadCount === imgList.length && executeCount < (bottomImgFadeStart + 8)) {
                        batchUpdateImg();
                    }*/

                    lastAdvance = time;
                    executeCount++;
                }
                if (executeCount <= (spriteSheetFadeStart + 10)) {
                    window.requestAnimationFrame(animate);
                } else {
                    $scope.actEndCallBack();
                }
            };

            //initImgs(); //暂时去掉底部旋转的光
            //animate();

            effectsSprite.src = $rootScope.loadImg('diagnose/effects-sprite.png');
            // adorablePetSprite.src = $rootScope.loadImg('diagnose/adorable-pet-sprite-' + numIndex + '.png');
            sprite.width = canvas.width >= SPRITE_SHEET_WIDTH * 2 ? SPRITE_SHEET_WIDTH : canvas.width / 2;
            sprite.left = canvas.width / 2 - sprite.width / 2;
            sprite.top = canvas.height / 2 - sprite.width / 2;
            effectsSprite.onload = (e) => {
                animate();
            };

        }
    };
}]);
