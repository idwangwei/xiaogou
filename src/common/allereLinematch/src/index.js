import "./index.less";
import yesPng from "../images/icon_yes.png";
import noPng from "../images/icon_no.png";
import yes2Png from "../images/icon_yes2.png";

angular.module('lineMatch', [])
    .directive('lineMatch', ['$compile', function ($compile) {
        return {
            district: "E",
            // scope: {
            //     showType: '@',//由于先compileHtml指令公用（即做题和批改），这个类型为correct则为批改，其他则为做题 doQuestion
            //     judgingResults: "@" //1正确 0错误 -1半对
            // },
            scope: true,
            controller: ['$scope', function ($scope) {
                this.lastItemObj = null;
                this.matchList = [];
                this.lineDatas = [];
                $scope.textContent = {
                    expr: '',
                    inputBoxUUID: ''
                };
                this.loadImgCount = 0;
                this.imgNum = 0;

                /**
                 * 获取html中的配置信息
                 */
                this.getConfig = function (element) {

                    let rt = [];
                    try {
                        let configStr = element.children()[0].innerHTML;
                        rt = JSON.parse(configStr);
                        if (angular.isObject(rt[0])) {
                            $scope.textContent.inputBoxUUID = rt.shift().inputBoxUUID;
                        }

                        //对配置进行校验
                        rt.forEach(function (item) {
                            if (!(item instanceof Array && item.length === 2)) {
                                throw new Error('格式不正确！');
                            }
                        })
                    } catch (e) {
                        console.error("连线题获取配置失败->" + e.message);
                    }
                    this.config = rt;
                    return rt;
                };

                this.genUIByConfig = function (config) {
                    let uiStr = "";
                    var leftPart = `<div class="left-part-content">`;
                    var middlePart = `<div class="mid-part-content">`;
                    var rightPart = `<div class="right-part-content">`;
                    var me = this;
                    config.forEach(function (configRow, row) {
                        configRow.forEach(function (config, col) {
                            let cellStr = "";
                            if (config.img) {
                                cellStr += `<img img-load="loadImgDone()" class="line-match-item-img" src="${config.img}"/>`
                                me.imgNum++;
                            }
                            if (config.text) {
                                if (!me.dealNumberBeak(config.text)) {
                                    cellStr += `<div class="line-match-item-text">${config.text}</div>`;
                                } else {
                                    cellStr += me.dealNumberBeak(config.text);
                                }
                            }
                            if (col === 0 && config.index) leftPart += `<div class="line-match-item" MLId="${config.index}" row="${row}" col="${col}" ng-click="handleMatchItemClick($event)">${cellStr}</div>`;
                            if (col === 1 && config.index) rightPart += `<div class="line-match-item" MLId="${config.index}" row="${row}" col="${col}" ng-click="handleMatchItemClick($event)">${cellStr}</div>`;
                        });
                        middlePart += `<div class="line-match-item-empty"></div>`;
                    });
                    uiStr += `<div class="line-match-content">${leftPart}</div>${middlePart}</div>${rightPart}</div></div>`;
                    uiStr = `${uiStr}`;
                    return uiStr;
                };

                //处理数字换行的问题
                this.dealNumberBeak = function (data) {
                    let htmlStr = `<div class="line-match-item-text">`;
                    htmlStr += data.replace(/\d+(\.\d+)?/g,(v)=>{
                        return 	`<span class="line-match-item-num">${v}</span>`;
                    });
                    htmlStr += `</div>`;
                    return htmlStr;
                };

                this.getMatchItemObject = function (element) {
                    element = angular.element(element);
                    return {
                        col: element.attr("col"),
                        row: element.attr("row"),
                        MLId: element.attr("MLId")
                    }
                };

                //记录连线过程
                this.lineRecord = function () {
                    var optionsList = [];
                    this.matchList.forEach((item, index)=> {
                        optionsList.push(item.start.MLId + "-" + item.end.MLId);
                    });
                    this.answerStr = optionsList.join("#");
                    $scope.textContent.expr = this.answerStr;
                };

                /**
                 *  处理连线逻辑
                 */
                this.handleMatch = function (element, lineMatchElement) {
                    let itemObj = this.getMatchItemObject(element);

                    function getMatchObj(item1, item2) {
                        if (item1.col == 0) {
                            return {
                                start: item1,
                                end: item2
                            }
                        } else {
                            return {
                                start: item2,
                                end: item1
                            }
                        }
                    }

                    if (this.lastItemObj) {
                        if (this.lastItemObj.col == itemObj.col) {//点击的是同一边的
                            this.lastItemObj = itemObj;
                        } else {
                            let hasMatch = false;
                            let matchObj = getMatchObj(itemObj, this.lastItemObj);
                            let svgId = this.genSVGLineId(matchObj);
                            let svg = lineMatchElement.querySelectorAll('#' + svgId);
                            if (svg.length) hasMatch = true;
                            if (!hasMatch) {
                                this.matchList.push(matchObj);
                                this.drawMatchLine(matchObj);
                            } else {
                                let matchIdx = null;
                                this.matchList.forEach((match, matchIndex)=> {
                                    if (match.start.row == matchObj.start.row
                                        && match.start.col == matchObj.start.col
                                        && match.end.row == matchObj.end.row
                                        && match.end.col == matchObj.end.col) {
                                        matchIdx = matchIndex;
                                    }
                                });
                                this.matchList.splice(matchIdx, 1);
                                this.removeMatchLine(matchObj);
                            }

                            this.lastItemObj = null;
                            angular.element(this.element[0].querySelector('.active')).removeClass('active');
                            this.lineRecord();
                        }
                    } else {
                        this.lastItemObj = itemObj;
                    }
                };
                this.genSVGLineId = function (matchObj) {
                    return `svg${matchObj.start.row}${matchObj.start.col}${matchObj.end.row}${matchObj.end.col}`;
                };
                this.drawMatchLine = function (matchObj, color) {
                    let svgId = this.genSVGLineId(matchObj);
                    let svg = this.element[0].querySelectorAll('#' + svgId);
                    if (svg.length) return;
                    let strokeColor = color || '#52AAFA';

                    let startEle = this.element[0].querySelector(`[row="${matchObj.start.row}"][col="${matchObj.start.col}"]`);
                    let endEle = this.element[0].querySelector(`[row="${matchObj.end.row}"][col="${matchObj.end.col}"]`);
                    let startPosX = startEle.offsetLeft + startEle.offsetWidth;
                    let startPosY = startEle.offsetTop + startEle.offsetHeight / 4 + (startEle.offsetHeight / 2) / this.config.length * (+matchObj.end.row + 1);
                    let endPosX = endEle.offsetLeft;
                    let endPosY = endEle.offsetTop + endEle.offsetHeight / 4 + (endEle.offsetHeight / 2) / this.config.length * (+matchObj.start.row + 1);
                    let svgTemplate = `
                            <svg id="${svgId}" xmlns="http://www.w3.org/2000/svg" version="1.1" style="position: absolute;width: 100%;top:0;left:0;height: 100%;pointer-events: none;">
                              <line x1="${startPosX}" y1="${startPosY}" x2="${endPosX}" y2="${endPosY}" style="stroke: ${strokeColor};stroke-width:2"></line>
                              <!--<circle cx="${Math.abs((startPosX - endPosX) / 2)}" cy="${Math.abs((startPosY - endPosY) / 2)}" r="10" stroke="black"  stroke-width="2" fill="red"/>-->
                            </svg>
                    `;
                    this.element.append(svgTemplate);
                };
                this.removeMatchLine = function (matchObj) {
                    let svg = this.element[0].querySelector('#' + this.genSVGLineId(matchObj));
                    angular.element(svg).remove();
                };

                /**
                 * 已知的连线数据
                 */
                this.initLineData = function () {
                    // $scope.showType = "correct";
                    // $scope.textContent.expr = "A1-B3#A2-B1#A3-B2";
                    if (!$scope.textContent || $scope.textContent && !$scope.textContent.expr) return;

                    var lines = $scope.textContent.expr.split("#");
                    lines.forEach((items, index)=> {
                        let linePoint = items.split("-");
                        this.lineDatas.push(linePoint);
                    });
                };

                /**
                 * 根据线段画线
                 */
                this.drawMatchLineByData = function () {
                    // if ($scope.showType != "correct" && $scope.showType != "doQuestion") return;
                    this.lineDatas.splice(0, this.lineDatas.length);
                    this.initLineData();

                    this.lineDatas.forEach((item, key)=> {
                        if (item.length == 2) {
                            var matchObj = {start: {}, end: {}};
                            matchObj.start = this.getRowAndCol(this.config, item[0]);
                            matchObj.end = this.getRowAndCol(this.config, item[1]);
                            if (matchObj.start && matchObj.end) {
                                this.drawMatchLine(matchObj);
                            }
                        }
                    });

                    this.markErrorLine();
                };

                this.getRowAndCol = function (config, mlid) {
                    var matchObj = null;
                    config.forEach(function (v, k) {
                        config[k].forEach(function (v1, k1) {
                            if (config[k][k1].index == mlid) {
                                matchObj = {row: k, col: k1, MLId: mlid};
                            }
                        });
                    });
                    return matchObj;
                };


                /**
                 * 显示钩叉
                 */
                this.showJudgingResults = function () {
                    if ($scope.showType != "correct") return;
                    let imgSrc = "";
                    let correctness = 0;
                    try {
                        correctness = $scope.currentQInput[0].correctness;
                    } catch (e) {
                        console.error('correctness:', e);
                    }
                    if (Number(correctness) == 1) {
                        imgSrc = yesPng;
                    } else if (Number(correctness) == 0) {
                        imgSrc = noPng;
                    } else {
                        imgSrc = yes2Png;
                    }
                    let imgStr = `<img class="right-wrong-mark" src="${imgSrc}"/>`;
                    this.element.append(imgStr);
                };

                /**
                 * 标出连线错误的线段
                 */
                this.markErrorLine = function () {
                    if ($scope.showType != "correct") return;
                    let errLine = "";
                    try {
                        errLine = $scope.currentQInput[0].reverse;
                    } catch (e) {
                        console.error('errLine:', e);
                    }

                    if (!errLine) return;
                    if (angular.isString(errLine) && errLine.match(/^\[.*\]$/))  errLine = JSON.parse(errLine);
                    if (angular.isArray(errLine)) {
                        errLine.forEach((item, key)=> {
                            let items = item.split("-");
                            if (items.length == 2) {
                                var matchObj = {start: {}, end: {}};
                                matchObj.start = this.getRowAndCol(this.config, items[0]);
                                matchObj.end = this.getRowAndCol(this.config, items[1]);
                                if (matchObj.start && matchObj.end) {
                                    this.removeMatchLine(matchObj);
                                    this.drawMatchLine(matchObj, '#FF1111');
                                }
                            }
                        });
                    } else {
                        let errMsg = this.element[0].querySelector('.right-wrong-msg');
                        if (errMsg) angular.element(errMsg).remove();

                        let msg = `<label class="right-wrong-msg">${errLine}</label>`;
                        this.element.append(msg);
                    }
                };


            }],
            link: function (scope, element, attr, ctrl) {
                // ctrl.newScope = angular.element($(element).parents('[compile-html]')).scope();
                ctrl.element = element;
                let config = ctrl.getConfig(element);
                let uiStr = ctrl.genUIByConfig(config);
                let uiElements = angular.element(uiStr);
                ctrl.element.attr("id", scope.textContent.inputBoxUUID);
                element.empty();
                element.append(uiElements);
                $compile(uiElements)(scope);

                scope.loadImgDone = function () {
                    ctrl.loadImgCount++;
                    if (ctrl.loadImgCount == ctrl.imgNum) {
                        ctrl.drawMatchLineByData();
                        ctrl.showJudgingResults();
                    }
                };

                scope.$watch('textContent.expr', function (newVal, oldVal) {
                    if (newVal && ctrl.loadImgCount == ctrl.imgNum) {
                        ctrl.drawMatchLineByData();
                    }
                })
            }
        }
    }])
    .directive('lineMatchItem', [function () {
        return {
            restrict: "C",
            require: '^lineMatch',
            link: function (scope, element, attr, ctrl) {
                scope.handleMatchItemClick = function (ev) {
                    if (scope.showType == "correct") return;
                    angular.element(ctrl.element[0].querySelector('.active')).removeClass('active');
                    angular.element(ev.currentTarget).addClass('active');
                    ctrl.handleMatch(ev.currentTarget, ctrl.element[0]);
                }
            }
        }
    }])
    .directive('imgLoad', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                var fn = $parse(attrs.imgLoad);
                elem.on('load', function (event) {
                    scope.$apply(function () {
                        fn(scope, {$event: event});
                    });
                });
            }
        };
    }]);