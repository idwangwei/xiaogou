/**
 * Created by WL on 2017/9/5.
 */

import {Inject, View, Directive, select} from 'ngDecorator/ng-decorator';
import sortBy from 'lodash.sortby';
import localStore from 'local_store/localStore';
import {UserManifest, SYSTEM_TYPE} from 'local_store/UserManifest';
import eraserActive from './../../../images/eraserActive.png';
import eraser from './../../../images/eraser.png';
import scrollUp from './../../../images/scrollUp01.png';
import scrollDown from './../../../images/scrollDown01.png';
import tipCards from './../../../images/tip_cards.png';
import clock from './../../../images/timeCountClock.png';

@View('oral_calculation_do_question', {
    url: '/oral_calculation_do_question/:paperId/:paperInstanceId/:redoFlag',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject: ['$scope', '$timeout', '$state', '$rootScope', '$stateParams'
        , '$ngRedux', '$http', 'commonService', '$ionicScrollDelegate'
        , 'canvasInputDelegate'
        , 'paperService'
        , 'workStatisticsServices'
        , '$interval'
        , '$location'
        , '$ionicPopup'
        , 'olympicMathService'
        , 'oralCalculationPaperServer']
})
class oralCalculationDoQuestion {
    $http;
    $stateParams;
    commonService;
    paperService;
    $ionicScrollDelegate;
    workStatisticsServices;
    $interval;
    $location;
    $ionicPopup;
    olympicMathService;
    oralCalculationPaperServer;

    inputBoxList = [];
    canvasInputDelegate;
    canvasInput = null;
    scrollView = null;
    smallQList = null;
    canvasSize = {};
    scrollPosition = 0;
    $timeout;
    eraser = eraser;
    eraserActive = eraserActive;
    scrollUp = scrollUp;
    scrollDown = scrollDown;
    tipCards = tipCards;
    clock = clock;

    showScrollAreaFlag = true;
    eraserStatus = 0;
    questionList = [];
    stopTimer = {};
    spentTime = 0;//做题用时
    doneCount = 0;//已经做的题的个数
    redoFlag = false;
    bigQList = localStore.getTempWork().qsList;
    popConEle = undefined;
    inputBoxListWithStrokes;
    inputBoxListWithoutStrokes;
    // popupInterval = null;
    @select(state => state.oral_calculation_select_paper.quesList) quesList;
    @select(state => state.wl_selected_work.paperId) paperId;
    @select(state => state.wl_selected_work.instanceId) paperInstanceId;
    @select(state => state.wl_selected_work.limitTime) limitTime;
    @select((state) => {
        let pId = state.wl_selected_work.instanceId;
        return state.oral_calculation_limittime[pId];
    }) paperTime;

    constructor() {
        this.timeRestCallback = function (countDown) {
            this.spentTime = Number(this.limitTime) * 60 - countDown;
            // console.log(this.spentTime);
        }.bind(this);
    }

    /**
     * 实时更新本地存储的限时 单位秒s
     */
    timeCountCallBack(countDown) {
        if (!this.paperTime || this.paperTime && !this.paperTime.countDownTimer) {
            this.updateOralPaperLimitTime(this.paperId, null, this.stopTimer.timer);
        }
    }


    getCountDownStartTime() {
        let countDownStart = 0;
        if (!this.paperTime) {
            countDownStart = Number(this.limitTime) * 60;
            //如果改作业还没创建计时器，这记录开始作业时间
            this.updateOralPaperLimitTime(this.paperInstanceId, new Date().getTime());
        }
        if (this.paperTime) {
            let currentDate = new Date().getTime();
            countDownStart = Number(this.limitTime) * 60 - Math.round((Number(currentDate) - Number(this.paperTime.startTime)) / 1000);
            if (countDownStart < 0) countDownStart = 0
        }
        return countDownStart;
    }

    timeEndCallBack() {
        if (this.paperTime) {
            this.submitAnswer(true);
            this.deleteOralPaperLimitTime(this.paperId);
        }
    }

    onBeforeEnterView() {
        this.isLoadingProcessingOral = true;
    }

    onAfterEnterView() {
        this.submitProcessing = false;
        this.redoFlag = Boolean(this.$stateParams.redoFlag === "true");
        this.showOralCalculationAdd();//显示口算广告
        this.limitTime = Number(this.limitTime);
        this.$timeout(() => {
            this.isLoadingProcessingOral = false;
            this.initDomInfo();
            this.initStrokeChangeListener();
            this.smallQList = this.bigQList[0].qsList;
        }, 700);
        this.startTimeFlag = this.paperTime;
    }

    onBeforeLeaveView() {
        this.popConEle && this.popConEle.close();
        if (this.stopTimer.timer) this.$interval.cancel(this.stopTimer.timer);
        // if (this.popupInterval) this.$interval.cancel(this.popupInterval);
        this.getRootScope().showOralCalculationGuideFlag = false;
    }

    showOralCalculationAdd() {
        if (this.$stateParams.redoFlag === 'false')//试卷没有提交则显示广告
            this.getRootScope().showOralCalculationGuideFlag = true;
    }

    initDomInfo() {
        this.canvasInput = this.canvasInputDelegate.get_by_handle('oral_cal_canvas_input');
        this.scrollView = this.$ionicScrollDelegate.$getByHandle('oral-question-content');
        this.pageHeight = window.innerHeight - $('.bar-header').height() - $('.bar-footer').height();
        this.canvasSize.width = window.innerWidth;
        this.canvasSize.height = window.innerHeight;
        let scrollHeight = 0;
        $('.oral-question').each(function () {
            scrollHeight += $(this).innerHeight();
        });
        this.canvasSize.scrollHeight = scrollHeight + 100;
    }

    scrollEvent(type) {
        this.showScrollAreaFlag = true;
        // $('scroll-tip .scrollTip').addClass('scrollTipShow');
        this.scrollPosition = this.scrollView.getScrollPosition().top;
        let nextInputBox = this.getNextPosition(type);

        // if (nextInputBox)
        //     this.scrollView.scrollTo(0, nextInputBox.rect.y - 70, true);
        // else
        let scrollHeight = this.pageHeight - 100;
        this.scrollView.scrollBy(0, type === 'up' ? -scrollHeight : scrollHeight, true);
    }

    getNextPosition(type) {
        let nextInputBox = null;
        if (type === 'up') {
            for (let i = 0; i < this.inputBoxList.length; i++) {
                if (this.inputBoxList[i].strokeList.length === 0 && Number(this.inputBoxList[i].rect.y) < this.scrollPosition) {
                    // elementId = this.inputBoxList[i].id;
                    nextInputBox = this.inputBoxList[i];
                    break;
                }
            }
        } else {
            for (let i = 0; i < this.inputBoxList.length; i++) {
                if (this.inputBoxList[i].strokeList.length === 0 && Number(this.inputBoxList[i].rect.y) > this.scrollPosition) {
                    // elementId = this.inputBoxList[i].id;
                    nextInputBox = this.inputBoxList[i];
                    break;
                }
            }
        }
        return nextInputBox;
    }


    getRect(boundary) {
        return {
            x: boundary.left,
            y: boundary.top,
            width: boundary.right - boundary.left,
            height: boundary.bottom - boundary.top
        };
    }

    deleteStrokeWipedByEraser(stroke) {
        let strokeRect = this.getRect(stroke.boundary);
        this.inputBoxList.forEach(inputBox => {
            let nextStrokeList = [];
            inputBox.strokeList.forEach(st => {
                let rect = this.getRect(st.boundary);
                let {intersect} = this.getRectInfo(strokeRect, rect);
                if (intersect === true) {
                    this.canvasInput.deleteStroke([st.uuid]);
                    console.log('delete....................................')
                } else {
                    nextStrokeList.push(st);
                }
            });
            inputBox.strokeList = nextStrokeList;
        });
        this.canvasInput.deleteStroke([stroke.uuid]);
        this.getDoneCount();
    }

    initStrokeChangeListener() {
        this.inputBoxList = this.getAllInputBoxPosition();
        this.canvasInput.init_canvas(this.canvasSize.width, this.canvasSize.scrollHeight, this.quesList.length);
        this.canvasInput.set_paint_start_listener(() => {
            // $('scroll-tip .scrollTip').removeClass('scrollTipShow');
            // $('scroll-tip .scrollTip').addClass('scrollTipHide');
            this.$timeout(() => {
                // $('scroll-tip .scrollTip').removeClass('scrollTipHide');
                this.showScrollAreaFlag = true;
            }, 1000);
        });
        this.canvasInput.set_paint_end_listener((stroke) => {
            this.getScope().$apply(() => {
                if (this.eraserStatus == 1) {
                    this.changeEraserStatus(0);
                    this.deleteStrokeWipedByEraser(stroke);
                    return;
                }
                if (!this.addStrokeToStrokeList(stroke)) {
                    //todo delete stroke
                    this.canvasInput.deleteStroke([stroke.uuid]);
                }
            });

        });
    }

    changeEraserStatus(status) {
        this.eraserStatus = status;
        if (status == 1) {
            this.canvasInput.setEraserPathStyle();
        } else {
            this.canvasInput.setWritePathStyle();
        }
    }

    getRectInfo(rect1, rect2) {
        let center1 = {
            y: rect1.y + rect1.height / 2,
            x: rect1.x + rect1.width / 2
        };
        let center2 = {
            y: rect2.y + rect2.height / 2,
            x: rect2.x + rect2.width / 2
        };
        let intersect = false;
        if ((rect1.width + rect2.width) / 2 >= Math.abs(center1.x - center2.x) && (rect1.height + rect2.height) / 2 >= Math.abs(center1.y - center2.y)) {
            intersect = true;
        }
        let xPoints = sortBy([rect1.x, rect1.x + rect1.width, rect2.x, rect2.x + rect2.width], item => item);
        let yPoints = sortBy([rect1.y, rect1.y + rect1.height, rect2.y, rect2.y + rect2.height], item => item);
        let xDistance = null;
        let yDistance = null;
        // if ((rect1.width + rect2.width) / 2 < Math.abs(center1.x - center2.x)) {
        xDistance = Math.abs(xPoints[1] - xPoints[2]);
        // }
        // if ((rect1.height + rect2.height) / 2 < Math.abs(center1.y - center2.y)) {
        yDistance = Math.abs(yPoints[1] - yPoints[2]);
        // }
        let intersectArea = xDistance * yDistance;
        let nearstDistance = Math.max(xDistance, yDistance);
        return {intersect, intersectArea, nearstDistance};
    }

    combineRect(rect1, rect2) {
        let xPoints = sortBy([rect1.x, rect1.x + rect1.width, rect2.x, rect2.x + rect2.width], item => item);
        let yPoints = sortBy([rect1.y, rect1.y + rect1.height, rect2.y, rect2.y + rect2.height], item => item);
        return {
            x: xPoints[0],
            y: yPoints[0],
            width: xPoints[3] - xPoints[0],
            height: yPoints[3] - yPoints[0]
        }
    }

    addStrokeToStrokeList(stroke) {
        let strokeCenterY = stroke.boundary.top + (stroke.boundary.bottom - stroke.boundary.top) / 2;
        let strokeCenterX = stroke.boundary.left + (stroke.boundary.right - stroke.boundary.left) / 2;
        let sortedInputBoxes = sortBy(this.inputBoxList, item => Math.abs(item.centerY - strokeCenterY));
        let vInputBoxes = [];
        sortedInputBoxes.forEach((inputBox, idx) => {
            if (idx === 0) vInputBoxes.push(inputBox);
            else {
                if (Math.abs(inputBox.centerY - vInputBoxes[vInputBoxes.length - 1].centerY) < 5) {
                    vInputBoxes.push(inputBox);
                }
            }
        });
        let sortedVInputBoxes = sortBy(vInputBoxes, item => Math.abs(item.centerX - strokeCenterX));
        sortedVInputBoxes[0].strokeList.push(stroke);
        this.getDoneCount();
        return true;
        // let nearstInputBox = null;
        // let threahold = 100;
        // let strokeRect = {
        //     x: stroke.boundary.left,
        //     y: stroke.boundary.top,
        //     width: stroke.boundary.right - stroke.boundary.left,
        //     height: stroke.boundary.bottom - stroke.boundary.top,
        //     centerX: stroke.boundary.left + (stroke.boundary.right - stroke.boundary.left) / 2,
        //     centerY: stroke.boundary.top + (stroke.boundary.bottom - stroke.boundary.top) / 2
        // };
        // let findNearestInputBox = () => {
        //     let nearestInputBox = null;
        //     let nearestDistance = 1000000;
        //     for (let i = 0; i < this.inputBoxList.length; i++) {
        //         let inputBox = this.inputBoxList[i];
        //         let distance = Math.sqrt(Math.pow(inputBox.centerY - strokeRect.centerY, 2) + Math.pow(inputBox.centerX - strokeRect.centerX, 2));
        //         if (distance < nearestDistance) {
        //             nearestInputBox = inputBox;
        //             nearestDistance = distance;
        //         }
        //     }
        //     return nearestInputBox;
        // };
        // let nearestInputBox = findNearestInputBox();
        // let {intersect, nearstDistance} = this.getRectInfo(nearestInputBox.combinedRect, strokeRect);
        // if (intersect === true) {
        //     nearestInputBox.strokeList.push(stroke);
        //     nearestInputBox.combinedRect = this.combineRect(nearestInputBox.combinedRect, strokeRect);
        //     this.getDoneCount();
        //     window.ibx = this.inputBoxList;
        //     return true;
        // } else {
        //     if (nearstDistance < threahold) {
        //         nearestInputBox.strokeList.push(stroke);
        //         nearestInputBox.combinedRect = this.combineRect(nearestInputBox.combinedRect, strokeRect);
        //         this.getDoneCount();
        //         window.ibx = this.inputBoxList;
        //         return true;
        //     } else {
        //         this.getDoneCount();
        //         window.ibx = this.inputBoxList;
        //         return false;
        //     }
        // }
    }

    getDoneCount() {
        let doneList = [];
        this.inputBoxList.forEach((inputBox) => {
            let scorePointQbuId = inputBox["scorePointQbuId"];
            if (doneList.indexOf(scorePointQbuId) === -1 && inputBox.strokeList.length) {
                doneList.push(scorePointQbuId);
            }
        });
        this.doneCount = doneList.length;
    }

    getAllInputBoxPosition() {
        let posList = [];
        $('.equation-input-span', $('.do_question_file')).each(function () {
            let $inputSpan = $(this);
            let $content = $(this).parents('.content');
            let id = $(this).attr("id");
            let scorePointQbuId = $(this).attr("sp-qbu-id");
            let seqNum = $(this).attr("seq-num");
            let position1 = $inputSpan.parent().position();
            let position2 = $content.position();
            let width = $inputSpan.width();
            let height = $inputSpan.height();
            let rect = {
                x: position2.left + position1.left - 50,
                y: position2.top + position1.top,
                width: width,
                height: height
            };
            let centerY = rect.y + rect.height / 2;
            let centerX = rect.x + rect.width / 2;
            let combinedRect = {
                x: position2.left + position1.left - 50,
                y: position2.top + position1.top,
                width: width,
                height: height
            };
            let posInfo = {id, scorePointQbuId, centerY, centerX, rect, combinedRect, seqNum};
            posInfo.strokeList = [];
            posList.push(posInfo);
        });
        return posList;
    }

    initFlags() {
        this.initCtrl = false;
    }

    configDataPipe() {
        this.dataPipe
            .when(() => !this.initCtrl)
            .then(() => {
                this.initCtrl = true;
            })
    }

    back(noPopups) {
        // this.$timeout(() => {
        //     if ($(".popup-showing").length) return;
        // if (this.getRootScope().showOralCalculationGuideFlag) {
        //     this.getRootScope().showOralCalculationGuideFlag = false;
        //     this.getRootScope().$digest();
        //     return;
        // }

        if (this.submitProcessing) {
            this.submitProcessing = false;
            this.getRootScope().$digest();
        }

        this.paperService.startPaperTimeCollectorFlag = false;
        if (noPopups || !this.startTimeFlag) {
            this.changeUrlFromForStore("oral_work");
            this.go('home.work_list', {fromUrl: "oral_work"});
            return;
        }
        this.popConEle = this.commonService.showConfirm(
            "提示",
            "<p style='text-align: center'>中途退出，所填答案将被清空，<br>确定退出吗？</p>",
            "确定",
            "取消");
        this.popConEle.then(res => {
            if (res) {
                this.changeUrlFromForStore("oral_work");
                this.go('home.work_list', {fromUrl: "oral_work"});
            }
        });
        // }, 400);
    }

    checkIsEmptyAndGetStrokeListForInputBox() {
        let inputBoxListWithStrokes = [];
        let inputBoxListWithoutStrokes = [];
        this.inputBoxList.forEach(inputBox => {
            if (inputBox.strokeList.length) {
                inputBoxListWithStrokes.push({
                    id: inputBox.id,
                    seqNum: inputBox.seqNum,
                    scorePointQbuId: inputBox.scorePointQbuId,
                    strokeList: inputBox.strokeList
                })
            } else {
                inputBoxListWithoutStrokes.push(inputBox);
            }
        });
        return {inputBoxListWithStrokes, inputBoxListWithoutStrokes};
    }

    submitAnswer(timeOver) {
        // this.$interval.cancel(this.popupInterval);
        let {inputBoxListWithStrokes, inputBoxListWithoutStrokes} = this.checkIsEmptyAndGetStrokeListForInputBox();
        this.inputBoxListWithStrokes = inputBoxListWithStrokes;
        this.inputBoxListWithoutStrokes = inputBoxListWithoutStrokes;
        //点击提交按钮，如果试卷空白，给出提示
        if (!timeOver && !inputBoxListWithStrokes.length) {
            this.commonService.alertDialog('空白试卷不能提交', 2000);
            return
        }
        //计时到时，空白试卷不提交
        // if (timeOver && !inputBoxListWithStrokes.length) {
        //     return
        // }
        if (inputBoxListWithoutStrokes.length && !timeOver) {
            let inputBoxToBeFocused = inputBoxListWithoutStrokes[0];
            let tipContent = `你还有${inputBoxListWithoutStrokes.length}个空没填完，要完成计算${this.redoFlag ? '' : '，结束计时'}吗？`;
            this.popConEle = this.commonService.showConfirm("温馨提示", tipContent, "完成", "再看看");

            this.popConEle.then(res => {
                if (!res) this.scrollView.scrollTo(0, inputBoxToBeFocused.rect.y - 100, true);
                else {
                    if (inputBoxListWithStrokes.length != 0) {
                        this.recognizeStrokesForInputBox(inputBoxListWithStrokes)
                            .then(results => {
                                //submit
                                // this.saveAnsToLocalStore(results);
                                this.complete(results);
                                // this.submitAnsAndPaper(() => {
                                //     this.back(true);
                                // }, false, null, this.spentTime * 1000);
                                // this.addResultToInputBox(results);
                            });

                    } else {
                        this.saveAnsToLocalStore("&nbsp;");
                        this.complete(results);
                        // this.submitAnsAndPaper(() => {
                        //     this.back(true);
                        // }, false, null, this.spentTime * 1000);
                    }


                }
            });
        } else {
            let tipContent = `要完成计算${this.redoFlag ? '' : '，结束计时'}吗？`;
            let options = ["完成", "再看看"];
            if (timeOver) {
                // this.popupInterval = this.$interval(() => {
                //     let len = $('.popup-showing').length;
                //     if (!len) {
                //         this.$interval.cancel(this.popupInterval);
                //         this.submitAnswer(true);
                //         this.popupInterval = null;
                //     }
                // }, 100);
                this.getRootScope().unRegisterBackButtonAction();
                let unRegister = this.getRootScope().registerBackButtonAction2();
                tipContent = inputBoxListWithStrokes.length != 0 ? `计算时间到，请去检查书写。` : `答题时间到，去提交吧`;
                options = [inputBoxListWithStrokes.length != 0 ? '确定' : '提交', null];
                this.popConEle && this.popConEle.close();
                this.popConEle = this.$ionicPopup.show({ // 调用$ionicPopup弹出定制弹出框
                    template: tipContent,
                    title: '温馨提示',
                    buttons: [{

                        text: "<button>" + options[0] + "</button>",
                        type: "button-positive",
                        onTap: (e) => {
                            unRegister();
                            this.getRootScope().registerBackButtonAction();
                            if (inputBoxListWithStrokes.length != 0) {
                                this.recognizeStrokesForInputBox(inputBoxListWithStrokes)
                                    .then(results => {
                                        //submit
                                        // this.saveAnsToLocalStore(results);
                                        this.complete(results);
                                        // this.submitAnsAndPaper(() => {
                                        //     this.back(true);
                                        // }, false, null, this.spentTime * 1000);
                                        // this.addResultToInputBox(results);
                                    });

                            } else {
                                this.saveAnsToLocalStore("&nbsp;");
                                // this.complete(results);

                                this.submitAnsAndPaper(() => {
                                    this.back(true);
                                }, false, null, this.limitTime * 60 * 1000);
                            }

                        }
                    },
                    ]
                });

            } else {
                this.popConEle = this.commonService.showConfirm("温馨提示", tipContent, options[0], options[1]);
                this.popConEle.then(res => {
                    if (res) {
                        this.recognizeStrokesForInputBox(inputBoxListWithStrokes)
                            .then(results => {
                                //submit
                                // this.saveAnsToLocalStore(results);
                                this.complete(results);
                                // this.submitAnsAndPaper(() => {
                                //     this.back(true);
                                // }, false, null, this.spentTime * 1000);
                                // this.addResultToInputBox(results);
                            });
                    }
                });
            }

        }
    }

    /**
     * 完成计算，跳转到检查页面
     * @param results 识别结果
     */
    complete(results) {
        let unionBorder = (border1, border2) => {
            return {
                left: Math.min(border1.left, border2.left),
                top: Math.min(border1.top, border2.top),
                right: Math.max(border1.right, border2.right),
                bottom: Math.max(border1.bottom, border2.bottom)
            }
        };
        let imageData2Base64 = (imageData) => {
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            let width = imageData.width;
            let height = imageData.height;
            canvas.width = width > 80 ? width : 80;
            canvas.height = height > 80 ? height : 80;
            ctx.putImageData(imageData, 0, 0);
            return canvas.toDataURL();
        };
        let getResult = (inputBoxId) => {
            let recognizeRes = null;
            for (let i = 0, len = results.length; i < len; i++) {
                let item = results[i];
                if (item.id === inputBoxId) {
                    recognizeRes = item.result;
                    break;
                }

            }
            return recognizeRes;
        };
        this.inputBoxListWithStrokes.forEach(inputBox => {
            let strokeList = inputBox.strokeList;
            let boundary = null;
            strokeList.forEach(stroke => {
                if (!boundary) boundary = stroke.boundary;
                boundary = unionBorder(boundary, stroke.boundary);
            });
            let canvasCtx = this.canvasInput.canvas_element.getContext("2d");
            let width = boundary.right - boundary.left;
            let height = boundary.bottom - boundary.top;
            // if (width < 50) width = 50;
            // if (height < 50) height = 50;
            let image = canvasCtx.getImageData(boundary.left, boundary.top, width, height);
            let base64Img = imageData2Base64(image);
            inputBox.base64Img = base64Img;
            inputBox.recognizeResult = getResult(inputBox.id);
        });
        let inputBoxList = this.inputBoxListWithoutStrokes.concat(this.inputBoxListWithStrokes);
        inputBoxList = sortBy(inputBoxList, item => item.seqNum);
        this.oralCalculationPaperServer.setAnswerInputBoxList(inputBoxList);
        this.go("oral_calculation_do_question_check_answer", {spentTime: this.spentTime})
    }

    saveAnsToLocalStore(results) {
        let ansInfoList = [];

        if (typeof results == "string") {
            let firstSpInfo = this.smallQList[0].inputList[0].spList;
            let firstAnsInfo = {answer: '', uuid: null};

            firstSpInfo.forEach(spInfo => {
                firstAnsInfo.answer += results + "#";
                firstAnsInfo.uuid = spInfo.scorePointQbuId;
            });

            if (firstAnsInfo.answer.length) {
                firstAnsInfo.answer = firstAnsInfo.answer.substr(0, firstAnsInfo.answer.length - 1);
                this.savePaper(this.smallQList[0],
                    false,
                    false,
                    [firstAnsInfo]);
                ansInfoList.push(firstAnsInfo);
            }
            return
        }


        this.smallQList.forEach(smallQ => {
            let ansInfo = {answer: '', uuid: null};
            smallQ.inputList[0].spList.forEach(spInfo => {
                let inputBoxUUID = spInfo.inputBoxUuid;

                results.forEach(result => {
                    if (result.id === inputBoxUUID) {
                        ansInfo.answer += result.result + "#";
                        ansInfo.uuid = spInfo.scorePointQbuId;
                    }
                });
            });
            if (ansInfo.answer.length) {
                ansInfo.answer = ansInfo.answer.substr(0, ansInfo.answer.length - 1);
                this.savePaper(smallQ,
                    false,
                    false,
                    // currentQNewAns.currentQInputListClone,
                    [ansInfo]);
                ansInfoList.push(ansInfo);
            }
            // console.log(ansStr)
        });
    }

    addResultToInputBox(results) {
        results.forEach(result => {
            $('#' + result.id).scope().$emit('oralCalculation.addContent', result.result);
        });
    }

    recognizeStrokesForInputBox(inputBoxListWithStrokes) {
        this.getRootScope().$broadcast('clear-recognize-temp-images');
        let submiting = true;
        let submitTimer = this.$timeout(() => {
            if (submiting) {
                this.submitProcessing = true;
            }
            this.$timeout.cancel(submitTimer);
        }, 1000);
        return new Promise(resolve => {
            let userManifest = new UserManifest(SYSTEM_TYPE.STUDENT);
            this.$http.post("/handWritingRecognize/oralCalculation", {
                meta: JSON.stringify({
                    inputBoxList: inputBoxListWithStrokes,
                    userName: userManifest.defaultUser,
                    paperInstanceId: this.paperInstanceId
                })
            }, {
                timeout: 10 * 1000
            }).then((response) => {
                debugger;
                submiting = false;
                this.submitProcessing = false;
                if (submitTimer) this.$timeout.cancel(submitTimer);
                resolve(JSON.parse(response.data.result).results);
                // if (res) {
                //     if (res.data.result) {
                //         me.addNewWriteToInput(res.data.result, inputId);
                //     }
                // }
            });
        });

    }

    // recognizeStrokesForInputBox(inputBoxListWithStrokes) {
    //     this.getRootScope().$broadcast('clear-recognize-temp-images');
    //     return new Promise(resolve => {
    //         let userManifest = new UserManifest(SYSTEM_TYPE.STUDENT);
    //         this.$http.post("http://192.168.0.24:3001/recognize/oral_calculation", {
    //             inputBoxList: JSON.stringify(inputBoxListWithStrokes),
    //             userName: userManifest.defaultUser,
    //             paperInstanceId: this.paperInstanceId
    //         }, {
    //             timeout: 5 * 1000
    //         }).then((response) => {
    //             resolve(response.data.results);
    //             // if (res) {
    //             //     if (res.data.result) {
    //             //         me.addNewWriteToInput(res.data.result, inputId);
    //             //     }
    //             // }
    //         });
    //     });
    //
    // }


    /**
     * 从service中获取需要的方法
     * @returns {{fetchPaper: *, submitPaper: *, parsePaperData: *, checkAssignedQuestion: *, stateGo: *}}
     */
    mapActionToThis() {
        return {
            savePaper: this.paperService.savePaper,
            submitAnsAndPaper: this.paperService.submitAnsAndPaper.bind(this.paperService),
            updateOralPaperLimitTime: this.workStatisticsServices.updateLimitTimeByOralPaperId,
            deleteOralPaperLimitTime: this.workStatisticsServices.deleteLimitTimeByOralPaperId,
            changeUrlFromForStore: this.olympicMathService.changeUrlFromForStore.bind(this.olympicMathService)
        };
    }

    startTimer() {
        this.startTimeFlag = true;
        if (this.limitTime == -1) {
            this.updateOralPaperLimitTime(this.paperInstanceId, new Date().getTime());
        }
    }

}

export default oralCalculationDoQuestion;