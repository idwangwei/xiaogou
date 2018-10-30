/**
 * Author 邓小龙 on 2017/03/20.
 * @description 倒计时的动画
 */
import  directives from './../index';
import  $ from 'jquery';

const FRAME_PER_SECOND = 24, FRAME_SPENT_TIME = 1000 / FRAME_PER_SECOND, SCREEN_WIDTH = 675, SPRITE_SHEET_WIDTH = 573;
directives.directive('countDownAct', ["$timeout", "$rootScope", function ($timeout, $rootScope) {
    return {
        restrict: 'E',
        scope: {
            actEndCallBack: '&'
        },
        replace: true,
        template: '<canvas id="countDownActCanvas"></canvas>',
        link: function ($scope, element, attr) {
            let canvas = document.getElementById("countDownActCanvas"),
                ctx = canvas.getContext('2d'),
                w = canvas.width = window.innerWidth,
                h = canvas.height = window.innerHeight,
                executeCount = 0,
                lastAdvance = 0,
                goImgHeight = 136,
                countDownComplete = 120,//数字在n帧之前渲染完
                allComplete = 132,//动画在n帧结束
                countDownImgAdaptX = 80,//最后的数字图片在整体布局上的一些x调整
                countDownImgAdaptY = 150,//最后的数字图片在整体布局上的一些y调整
                countDownImgMinWSize = 30,//最后的数字图片最终缩小的宽度大小
                countDownImgMinHSize = 20,//最后的数字图片最终缩小的高度大小
                countDownImg,
                timeText,
                countDownNumX,
                countDownNumY,
                countDownNumAct,
                countDownNumVx,
                countDownNumVy,
                countDownNumDw,
                countDownNumDh,
                imgScale,
                spriteSheet = new Image(),
                runnerCells = [
                    {left: 0, top: 0, width: 463, height: 136},
                    {left: 0, top: 272, width: 74, height: 102},
                    {left: 74, top: 272, width: 62, height: 99},
                    {left: 136, top: 272, width: 53, height: 97},
                    {left: 0, top: 136, width: 208, height: 136},
                    {left: 208, top: 136, width: 124, height: 83},
                    {left: 463, top: 0, width: 573, height: 106}
                ];
            spriteSheet.src = 'sImages/countDown.png';

            let runInPlace = {
                execute: (sprite, ctx, now) => {
                    if (executeCount % FRAME_PER_SECOND == 0 && executeCount != 0) {
                        sprite.painter.advance();
                        sprite.paint(ctx);
                    } else {
                        sprite.paint(ctx);
                    }
                }
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

            let SpriteSheetPainter = function (cells) {
                this.logoCells = [];
                for (var i = 0; i < cells.length; i++) {
                    this.logoCells.push(cells[i]);
                }
                this.logoCellsIndex = 0;
            };
            SpriteSheetPainter.prototype = {
                advance: function () {
                    if (this.logoCellsIndex == this.logoCells.length - 1) {
                        this.logoCellsIndex = 0;
                    } else {
                        this.logoCellsIndex++;
                    }
                },
                paint: function (sprite, ctx) {
                    let logoCell = this.logoCells[this.logoCellsIndex];
                    ctx.save();
                    ctx.drawImage(spriteSheet, logoCell.left, logoCell.top, logoCell.width, logoCell.height, (w - logoCell.width * imgScale) / 2, (h - logoCell.height * imgScale - goImgHeight) / 2, logoCell.width * imgScale, logoCell.height * imgScale);
                    ctx.restore();
                }
            };


            let sprite = new Sprite('runner', new SpriteSheetPainter(runnerCells, spriteSheet), [runInPlace]);

            let CountDownNum = function (imgInfo, x, y, w, h) {
                this.imgInfo = imgInfo;
                this.x = x;
                this.y = y;
                this.w = w;
                this.h = h;
            };
            CountDownNum.prototype = {
                paint: function () {
                    ctx.globalCompositeOperation = 'destination-over';
                    ctx.drawImage(spriteSheet, this.imgInfo.left, this.imgInfo.top, this.imgInfo.width, this.imgInfo.height, this.x, this.y, this.w, this.h);
                },
                update: function (x, y, w, h) {
                    this.x += x;
                    this.y += y;
                    this.w += w;
                    this.h += h;
                }
            };


            function countDownNumAnimate(excuteCount) {
                if (excuteCount === countDownComplete) {
                    countDownNumAct.paint();
                    return;
                }
                if (excuteCount > countDownComplete && excuteCount < allComplete) {
                    countDownNumAct.update(-countDownNumVx, -countDownNumVy, -countDownNumDw, -countDownNumDh);
                    countDownNumAct.paint();
                    return;
                }

            }

            function initData() {
                countDownImg = runnerCells[5];
                timeText = runnerCells[6];
                imgScale = w < 2 * SPRITE_SHEET_WIDTH ? (w / (2 * SPRITE_SHEET_WIDTH)).toFixed(2) : 1;
                goImgHeight = goImgHeight * imgScale;
                countDownImgAdaptX = countDownImgAdaptX * imgScale;
                countDownImgAdaptY = countDownImgAdaptY * imgScale;

                countDownNumX = (w - countDownImg.width * imgScale + countDownImgAdaptX) / 2;
                countDownNumY = (h - countDownImg.height * imgScale + countDownImgAdaptY) / 2;
                countDownNumAct = new CountDownNum(countDownImg, countDownNumX, countDownNumY, countDownImg.width * imgScale, countDownImg.height * imgScale);
                countDownNumVx = 0;
                countDownNumVy = 2 * (countDownNumY+13)/ FRAME_PER_SECOND;
                countDownNumDw = 2 * (countDownImg.width * imgScale - countDownImgMinWSize) / FRAME_PER_SECOND;
                countDownNumDh = 2 * (countDownImg.height * imgScale - countDownImgMinHSize) / FRAME_PER_SECOND;
            }

            let animate = (time)=> {
                if (time - lastAdvance > FRAME_SPENT_TIME) {
                    ctx.clearRect(0, 0, w, h);
                    if (executeCount < countDownComplete) {
                        sprite.update(ctx, time);
                        ctx.drawImage(spriteSheet, timeText.left, timeText.top, timeText.width, timeText.height, (w - timeText.width * imgScale) / 2, (h - timeText.height * imgScale + goImgHeight) / 2, timeText.width * imgScale, timeText.height * imgScale);
                    }
                    countDownNumAnimate(executeCount);
                    lastAdvance = time;
                    executeCount++;
                }
                if (executeCount > allComplete) {
                    $scope.actEndCallBack();
                    return;
                }
                window.requestAnimationFrame(animate);
            };
            initData();
            animate();
        }
    };
}]);
