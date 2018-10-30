/**
 * Created by 邓小龙 on 2016/03/28.
 * 目前几个端共用的指令可以放在这里，比如（打勾打叉）
 */

import  _ from 'underscore';
//import  $ from 'jquery';
import  icon_no from './images/icon_no.png';
import  icon_yes from './images/icon_yes.png';
import  icon_yes2 from './images/icon_yes2.png';
import  icon_circle from './images/icon_circle2.png';
import  icon_question from './images/icon_question.png';
import  icon_grading from './images/grading.png';
import {expressionSet as EXPRESSION_SET, unSupportExpressionSet as UNSUPPORT_EXPRESSION_SET} from './expressionSet';
import ExpressionParser from './expressParser';
var correctPaperDirective = angular.module('correctPaperDirective', []);
correctPaperDirective.directive('correctPaper', ["$compile", "$log", "$timeout"
    , function ($compile, $log, $timeout) {//根据IMG_SERVER配置的地址动态加载图片
        return {
            restrict: 'EA',
            scope: true,
            replace: false,
            controller: ['$scope', 'uuid4', 'finalData', function ($scope, uuid4, finalData) {
                if (!$scope.smallQ || $scope.smallQ.length == 0) {
                    $log.error("使用打勾打叉指令，没有传入小题的dom元素对象");
                    return false;
                }
                $scope.currentSpId = $scope.currentEle.attr("scorePointId");//当前得分点id
                //$scope.smallQoffset=$scope.qEle.offset();//小题的绝对定位是相对于整个body的

                //$scope.smallQ= $scope.qEle.parent();//小题区域;
                $scope.smallQ = $($scope.smallQ);
                $scope.adaptSizeValue = 20;//画圈的大小调整值
                $scope.adaptOffsetValue = 10;//画圈的Offset调整值
                $scope.min = {
                    minTop: Number.MAX_VALUE,//保证绝对定位的顶部在此之内
                    minLeft: Number.MAX_VALUE//保证绝对定位的左侧在此之内
                };
                $scope.max = { //用于存放当前批改区域
                    maxTop: 0,
                    maxLeft: 0,
                    height: 0,
                    width: 0
                };

                $scope.innerImg = {//打√或打×图片的宽，高。定义初始内部打勾打叉图片的映射的区域大小,如外部长宽160，打勾打叉图片默认为40
                    imgHeight: 40,
                    imgWidth: 40,
                    areaHeight: 160,
                    areaWidth: 160
                };

                $scope.HANDLE_TYPE = {//处理类型
                    "EXP": 1, //列式
                    "ANS": 2  //答语
                };

                $scope.TIMES = { //倍数
                    TWO: 2,
                    THREE: 3
                };

                $scope.CORRECT_CODE = {//批改码
                    CORRECT_Q_ERROR_EXP_NULL: 10007,//列式为空
                    CORRECT_Q_ERROR_ANS_NULL: 10009,//答语为空
                    STRIP_Q_PART_RIGHT: 20001,//拖式半对
                    QUESTION: 10020,//应用题问号提示
                    UNKNOWN_ERROR: 10000//应用题未知错误
                };

                $scope.errorLabelCount = 0;//错误显示label个数

                $scope.lineAreaArry = [];//定义画线批改所拥有的数组


                /**
                 * 生成批改的html字符串
                 * @param scorePointId 得分点id
                 */
                $scope.getCorrectHtmlStr = function (scorePointId) {
                    var areaImgHtml = '<img src="' + icon_circle + '" id="areaImg' + scorePointId + '" >';
                    var yesImgHtml = '<img src="' + icon_yes + '" id="yesImg' + scorePointId + '" >';
                    var yesImg2Html = '<img src="' + icon_yes2 + '" id="yesImg2' + scorePointId + '" >';
                    var errorImgHtml = '<img src="' + icon_no + '" id="errorImg' + scorePointId + '" >';
                    var questionImgHtml = '<img src="' + icon_question + '" id="questionImg' + scorePointId + '" >';
                    var gradingImgHtml = '<img src="' + icon_grading + '" id="gradingImg' + scorePointId + '" class="icon_grading">';
                    return {
                        areaImgHtml: areaImgHtml, yesImgHtml: yesImgHtml, yesImg2Html: yesImg2Html,
                        errorImgHtml: errorImgHtml, questionImgHtml: questionImgHtml, gradingImgHtml: gradingImgHtml
                    };
                };

                /**
                 * 针对某一个得分点进行打勾打叉
                 * @param spInfo 得分点对象
                 */
                $scope.spCorrectShow = function (spInfo) {
                    if (spInfo && spInfo.spList.length > 0) {
                        var scorePointId = spInfo.scorePointId;

                        var htmlStr = $scope.getCorrectHtmlStr(scorePointId);
                        switch (spInfo.correctness) {

                            case 2://是应用题型
                                $scope.correctSpecialQ(spInfo, htmlStr);
                                break;
                            case 3://是拖式题型(目前拖式类型和应用题处理一样，暂不用改)
                                $scope.correctSpecialQ(spInfo, htmlStr);
                                break;
                            case 5://是列式题型(目前拖式类型和应用题处理一样，暂不用改)
                                $scope.correctSpecialQ(spInfo, htmlStr);
                                break;
                            case 6://是解方程题型(目前拖式类型处理一样，暂不用改)
                                $scope.correctSpecialQ(spInfo, htmlStr);
                                break;
                            case -1://表示当前试题还处于批改中，需要显示批改中的图片
                                $scope.gradingQ(spInfo, htmlStr);
                                break;
                            case -2://忽略，即不进行打钩打叉，但要提示错误情况，集合类型的特殊情况
                                $scope.correctCollectionQ(spInfo, htmlStr);
                                break;
                            default ://普通题型
                                $scope.correctNormalQ(spInfo, htmlStr);
                                break;
                        }
                        $scope.currentEle.attr("correctedFlag", "true");//已打勾的标志
                    }
                };

                /**
                 * 处理正在批改中的试题情况，需要在小题内容显示批改中的图片
                 */
                $scope.gradingQ = function (spInfo, htmlStr) {
                    // var arry=$scope.smallQ.find('img[class="icon_grading"]');
                    // var smallQHeight=$scope.smallQ.height()>=0?$scope.smallQ.height():0;
                    // var smallQWidth=$scope.smallQ.width()>=0?$scope.smallQ.width():0;
                    // var imgLeft=smallQWidth/2-256/2;
                    // var imgTop=smallQHeight/2-61/2;
                    // if(arry.length==0){
                    //     $scope.smallQ.append(htmlStr.gradingImgHtml);
                    //     var findImgId = "#gradingImg" + spInfo.scorePointId;
                    //     var findImg = $scope.smallQ.find(findImgId);
                    //     findImg.css('position','absolute').css('left',imgLeft)
                    //         .css('top',imgTop).css('z-index','11000');
                    //     findImg.height(61);
                    //     findImg.width(256);
                    // }
                    var appendStr = "<p style='color:red;font-size: 17px' id='grading" + spInfo.scorePointId + "' class='icon_grading'>" +
                        "等候系统批改，请稍后回来" +
                        "</p>";
                    var array = $scope.smallQ.find('p[class="icon_grading"]');
                    if (array.length == 0) {
                        $(appendStr).insertBefore($($scope.smallQ.children()[0]));
                    }
                };

                /**
                 * 处理集合类型-21情况
                 * @param spInfo
                 * @param htmlStr
                 */
                $scope.correctCollectionQ = function (spInfo, htmlStr) {
                    if (spInfo.application) {//不为空提示错误信息
                        $scope.specialQShowErrorMsgText(spInfo.scorePointId, spInfo.application);
                    }
                };

                /**
                 * 处理特殊类型(如应用题)
                 * @param spInfo 得分点对象
                 * @param htmlStr 打勾打叉html字符串
                 */
                $scope.correctSpecialQ = function (spInfo, htmlStr) {
                    //var textAreaInfo=spInfo.spList[0];//目前是一个得分点只映射一个大的textarea
                    //var findStr="app-textarea[id='"+textAreaInfo.inputBoxUuid+"']";
                    //$scope.textArea=$scope.smallQ.find(findStr);
                    $scope.textArea = $($scope.currentEle);
                    angular.element($scope.textArea).scope().textContent.expr = spInfo.answer;//赋值答案
                    //angular.element($scope.qEle).scope().textContent.expr=spInfo.answer;//赋值答案
                    //由于批改图片的定位是相对于整个body的，所以相对于小题的区域，得减去小题的绝对定位
                    var padHeight = parseFloat($scope.textArea.height() + $scope.adaptSizeValue) - parseFloat($scope.innerImg.imgHeight);//圈图的高度减去判定图片的高度
                    var padWidth = parseFloat($scope.textArea.width() + $scope.adaptSizeValue) - parseFloat($scope.innerImg.imgWidth);//圈图的宽度减去判定图片的宽度
                    var areaOffTop = $scope.textArea.offset().top - $scope.adaptOffsetValue - $scope.smallQ.offset().top;
                    var areaOffLeft = $scope.textArea.offset().left - $scope.adaptOffsetValue - $scope.smallQ.offset().left;
                    var areaHeight = $scope.textArea.height() + $scope.adaptSizeValue;
                    var areaWidth = $scope.textArea.width() + $scope.adaptSizeValue;
                    $scope.innerImg.top = parseFloat(areaOffTop) + padHeight / 2;
                    $scope.innerImg.left = parseFloat(areaOffLeft) + padWidth / 2;
                    var areaInfo = {
                        areaOffLeft: areaOffLeft,
                        areaOffTop: areaOffTop,
                        areaHeight: areaHeight,
                        areaWidth: areaWidth
                    };
                    var retErrorCode = -1;
                    if (spInfo.correctness == 2) {//处理应用题
                        retErrorCode = $scope.parseApplictionQError(spInfo);
                    }
                    if (spInfo.correctness == 3 || spInfo.correctness == 5 || spInfo.correctness == 6) {//解方程、脱式和列式三种类型共用
                        retErrorCode = $scope.parseStripQError(spInfo);
                    }

                    if (retErrorCode <= 0) {//说明批改有问题
                        return;
                    }
                    switch (retErrorCode) {//根据返回码进行批改展示
                        case 1://全对情况
                            $scope.specialQAllRight(spInfo, htmlStr, areaInfo);
                            break;
                        case 2://表示列式无和答语无，判全错
                            $scope.specialQAllWrong(spInfo, htmlStr, areaInfo);
                            break;
                        case 3://表示列式无而答语有对有错
                            $scope.specialQExprNull(spInfo);
                            break;
                        case 4://表示答语无而列式有对有错
                            $scope.specialQAnsNull(spInfo);
                            break;
                        case 5://表示剩下1种情况，列式有对有错，答语有对有错
                            $scope.specialQExprAns(spInfo);
                            break;
                        case 101://脱式类型题全对
                            $scope.specialQAllRight(spInfo, htmlStr, areaInfo);
                            break;
                        case 102://表示脱式计算类型题，有错误
                            $scope.specialQNomalExpHandle(spInfo, spInfo.application.appQExpression);
                            break;
                        case 103://表示脱式计算类型题，全错
                            $scope.specialQAllWrong(spInfo, htmlStr, areaInfo);
                            break;
                        case 104://表示脱式计算类型题，半对
                            $scope.specialQPartRight(spInfo, htmlStr, areaInfo);
                            break;
                    }
                };

                /**
                 * 批改正常的情况（即非应用题）
                 * spInfo 得分点对象
                 * htmlStr 画圈、打勾、打叉的html字符串
                 */
                $scope.correctNormalQ = function (spInfo, htmlStr) {
                    //遍历得分点下的输入框对象
                    _.each(spInfo.spList, function (inputBoxInfo) {
                        var input = $scope.smallQ.find("#" + inputBoxInfo.inputBoxUuid);//找到输入框元素
                        if (!input || input.length == 0) {
                            $log.error("出题bug,试题内容和答案所映射的输入框不匹配!输入框id:" + inputBoxInfo.inputBoxUuid);
                            return true;
                        }
                        $scope.handleInputOffsetForCircle(input);//处理输入框的offset。
                        input.val(inputBoxInfo.inputBoxStuAns);//赋值答案
                        input.attr("disabled", true);

                    });
                    $scope.calAreaPositon();//计算区域位置
                    if (spInfo.correctness == 1) {//该得分点正确
                        $scope.smallQ.append(htmlStr.yesImgHtml);
                        var findImgId = "#yesImg" + spInfo.scorePointId;
                        if (spInfo.spList.length > 1)//说明当前得分点关联的输入框有多个，就显示区域画图框,需要放大勾勾
                            $scope.setCorrectResultCss(findImgId, null, 1.2);
                        else//不处理
                            $scope.setCorrectResultCss(findImgId);
                    } else if (spInfo.correctness == 4) {//多项选择是半对
                        $scope.smallQ.append(htmlStr.yesImg2Html);
                        var findImgId = "#yesImg2" + spInfo.scorePointId;
                        if (spInfo.spList.length > 1)//说明当前得分点关联的输入框有多个，就显示区域画图框,需要放大勾勾
                            $scope.setCorrectResultCss(findImgId, null, 1.2);
                        else//不处理
                            $scope.setCorrectResultCss(findImgId);
                    } else {//该得分点错误
                        $scope.smallQ.append(htmlStr.areaImgHtml);
                        var areaId = "#areaImg" + spInfo.scorePointId;
                        $scope.setCorrectAreaCss(areaId, $scope.areaOffLeft, $scope.areaOffTop, $scope.areaHeight, $scope.areaWidth);
                    }

                    if (spInfo.application) {//不为空提示错误信息
                        $scope.specialQShowErrorMsgText(spInfo.scorePointId, spInfo.application);
                    }
                    $scope.initPositionData();//初始化计算位置
                };

                /**
                 * 将答案字符串parse成html串，并返回<unit>标签个数
                 * @param str 答案字符串
                 * @returns {Number}
                 */
                $scope.handleAnsStr = function (str) {
                    if (!str || str == "") {
                        return 0;
                    }
                    $scope.textContent.expr = str;
                    $scope.parseExpr2Html();
                    console.log("textContent.html", $scope.textContent.html);
                    var unitArray = $scope.textContent.html.match(/<\/unit>/g);//计算</unit>的个数
                    if (null == unitArray) {
                        return 0;
                    }
                    return unitArray.length;
                };

                /**
                 * 处理多个输入框的offset--用于画圈
                 * @param input 输入框dom元素
                 */
                $scope.handleInputOffsetForCircle = function (input) {
                    var offset = input.offset();
                    if (offset.top < $scope.min.minTop) {
                        $scope.min.minTop = offset.top;
                    }
                    if (offset.left < $scope.min.minLeft) {
                        $scope.min.minLeft = offset.left;
                    }
                    if (offset.top > $scope.max.maxTop) {
                        $scope.max.maxTop = offset.top;
                        $scope.max.height = input.height();
                    }
                    if (offset.left > $scope.max.maxLeft) {
                        $scope.max.maxLeft = offset.left;
                        $scope.max.width = input.width();
                    }
                };


                /**
                 * 处理多个输入框的offset--用于画波浪线
                 * @param input 输入框dom元素
                 */
                $scope.handleInputOffsetForLine = function (input) {
                    var offset = input.offset();
                    if (offset.top != $scope.min.minTop) {//当前top不等于初始的top表明换行了。得结算之前区域。
                        var lineInfo = {
                            minLeft: $scope.min.minLeft,
                            minTop: $scope.min.minTop,
                            maxHeight: $scope.max.height,
                            maxWidth: $scope.max.width
                        };
                        $scope.lineAreaArry.push(lineInfo);//保存画线区域
                        $scope.initPositionData();//初始化位置
                        $scope.min.minTop = offset.top;//将当期的top作为下一段的开头。
                    }

                    if (offset.left < $scope.min.minLeft) {
                        $scope.min.minLeft = offset.left;
                    }
                    if (input.height() > $scope.max.height) {
                        $scope.max.height = input.height();
                    }
                    if (offset.left > $scope.max.maxLeft) {
                        $scope.max.maxLeft = offset.left;
                        $scope.max.width = input.width();
                    }
                };


                /**
                 * 初始化计算位置数据
                 */
                $scope.initPositionData = function () {
                    $scope.min = {
                        minTop: Number.MAX_VALUE,//保证绝对定位的顶部在此之内
                        minLeft: Number.MAX_VALUE//保证绝对定位的左侧在此之内
                    };
                    $scope.max = { //用于存放当前批改区域
                        maxTop: 0,
                        maxLeft: 0,
                        height: 0,
                        width: 0
                    };
                };

                /**
                 * 计算区域位置
                 */
                $scope.calAreaPositon = function () {
                    $scope.areaHeight = $scope.max.maxTop - $scope.min.minTop + $scope.max.height + $scope.adaptSizeValue;
                    $scope.areaWidth = $scope.max.maxLeft - $scope.min.minLeft + $scope.max.width + $scope.adaptSizeValue;
                    $scope.areaOffTop = $scope.min.minTop - $scope.adaptOffsetValue - $scope.smallQ.offset().top;
                    $scope.areaOffLeft = $scope.min.minLeft - $scope.adaptOffsetValue - $scope.smallQ.offset().left;
                    var padHeight = parseFloat($scope.areaHeight) - parseFloat($scope.innerImg.imgHeight);//圈图的高度减去判定图片的高度
                    var padWidth = parseFloat($scope.areaWidth) - parseFloat($scope.innerImg.imgWidth);//圈图的宽度减去判定图片的宽度
                    $scope.innerImg.top = parseFloat($scope.areaOffTop) + padHeight / 2;
                    $scope.innerImg.left = parseFloat($scope.areaOffLeft) + padWidth / 2;
                };

                /**
                 * 设置批改结果（打勾打叉）的位置等属性样式
                 * @findStr 查找html的字符串
                 */
                $scope.setCorrectResultCss = function (findStr, areaInfo, times) {
                    times = times || 1;
                    var adaptTopValue = ($scope.innerImg.imgHeight * (times - 1)) / 2;
                    var adaptLeftValue = ($scope.innerImg.imgWidth * (times - 1)) / 2;
                    var findImg = $scope.smallQ.find(findStr);
                    findImg.css('position', 'absolute').css('left', $scope.innerImg.left - adaptLeftValue)
                        .css('top', $scope.innerImg.top - adaptTopValue).css('z-index', '11000');
                    findImg.height($scope.innerImg.imgHeight * times);
                    findImg.width($scope.innerImg.imgWidth * times);
                };

                /**
                 * 设置画圈的位置等属性样式
                 * @findStr 查找html的字符串
                 */
                $scope.setCorrectAreaCss = function (findStr, areaOffLeft, areaOffTop, areaHeight, areaWidth) {
                    var areaImg = $scope.smallQ.find(findStr);
                    //由于批改图片的定位是相对于整个body的，所以相对于小题的区域，得减去小题的绝对定位
                    areaImg.css('position', 'absolute')
                        .css('left', areaOffLeft)
                        .css('top', areaOffTop).css('z-index', '10000');
                    areaImg.height(areaHeight);
                    areaImg.width(areaWidth);
                };

                /**
                 * 解析应用错误类型
                 * @param spInfo 得分点对象
                 */
                $scope.parseApplictionQError = function (spInfo) {
                    var appQExpression = spInfo.application.appQExpression;//应用题列式
                    var appQAnswer = spInfo.application.appQAnswer;//应用题答语
                    if (!appQExpression || !appQAnswer) {
                        console.log("qbu批改应用题出现错误!");
                        return -1;
                    }
                    if ((appQExpression.length == 0 && appQAnswer.length > 0) || (appQExpression.length > 0 && appQAnswer.length == 0)) {//按目前分类，理论不可能出现这种情况
                        console.log("qbu批改应用题出现错误!");
                        return -2;
                    }
                    if (appQExpression.length == 0 && appQAnswer.length == 0) {//表示全对（列式和答语）
                        return 1;
                    }
                    if ((appQExpression[0].errorCode == $scope.CORRECT_CODE.CORRECT_Q_ERROR_EXP_NULL
                        && appQAnswer[0].errorCode == $scope.CORRECT_CODE.CORRECT_Q_ERROR_ANS_NULL)||appQAnswer[0].errorCode===$scope.CORRECT_CODE.UNKNOWN_ERROR) {//表示列式无和答语无，判全错
                        return 2;
                    }
                    if (appQExpression[0].errorCode == $scope.CORRECT_CODE.CORRECT_Q_ERROR_EXP_NULL) {//表示列式无而答语有对有错
                        return 3;
                    }
                    if (appQAnswer[0].errorCode == $scope.CORRECT_CODE.CORRECT_Q_ERROR_ANS_NULL) {//表示答语无而列式有对有错
                        return 4;
                    }
                    return 5;//表示剩下1种情况，列式有有错，答语有对对有错
                };

                /**
                 * 解析拖式错误类型
                 * @param spInfo 得分点对象
                 */
                $scope.parseStripQError = function (spInfo) {
                    var appQExpression = spInfo.application.appQExpression;//列式
                    if (!appQExpression) {
                        console.log("qbu批改脱式类型题出现错误!");
                        return -101;
                    }
                    if (!spInfo.answer||(appQExpression.length&&(appQExpression[0].errorCode===$scope.CORRECT_CODE.UNKNOWN_ERROR||(appQExpression[0].errorCode&&appQExpression[0].endLoc===-1&&appQExpression[0].startLoc===0)))) {
                        return 103;//表示全错
                    }
                    if (appQExpression.length == 0) {//表示全对
                        return 101;
                    }
                    if (appQExpression[0].errorCode && appQExpression[0].errorCode == $scope.CORRECT_CODE.STRIP_Q_PART_RIGHT) {
                        return 104;//表示半对
                    }
                    return 102;//表示剩下1种情况，列式有有错
                };
                /**
                 * 应用题显示错误信息
                 * @param id 标签id
                 * @param msg 错误内容
                 */
                $scope.specialQShowErrorMsgText = function (id, msg) {
                    var errorSpan;
                    var isExistChildren = $scope.smallQ.children('.correct-paper-error');
                    errorSpan = '<div id="otherError' + id + '" style="color:darkred;margin-top:3px " >' +
                        '<span style="font-size: 14px;color:darkred">' + msg + '</span>' + '</div>';
                    // $scope.currentEle.append($(errorSpan).clone());
                    var copyErrorSpan = $(errorSpan).clone();
                    if (isExistChildren && isExistChildren.length == 0) {
                        $scope.smallQ.append(copyErrorSpan.addClass('correct-paper-error'));
                        return;
                    }
                    $scope.smallQ.append(copyErrorSpan);
                };

                /**
                 * 应用题批改 1.全对情况
                 * @param spInfo 得分点对象
                 * @param htmlStr img对象
                 * @param areaInfo 计算的区域对象
                 */
                $scope.specialQAllRight = function (spInfo, htmlStr, areaInfo) {
                    //$scope.smallQ.append(htmlStr.areaImgHtml);
                    $scope.smallQ.append(htmlStr.yesImgHtml);
                    var areaId = "#areaImg" + spInfo.scorePointId;
                    var findImgId = "#yesImg" + spInfo.scorePointId;
                    //$scope.setCorrectAreaCss(areaId, areaInfo.areaOffLeft, areaInfo.areaOffTop, areaInfo.areaHeight, areaInfo.areaWidth);
                    $scope.setCorrectResultCss(findImgId, areaInfo, $scope.TIMES.TWO);
                };


                /**
                 * 应用题批改 2.全错情况
                 * @param spInfo 得分点对象
                 * @param htmlStr img对象
                 * @param areaInfo 计算的区域对象
                 */
                $scope.specialQAllWrong = function (spInfo, htmlStr, areaInfo) {
                    $scope.smallQ.append(htmlStr.areaImgHtml);
                    //$scope.smallQ.append(htmlStr.errorImgHtml);
                    var areaId = "#areaImg" + spInfo.scorePointId;
                    //var findImgId = "#errorImg" + spInfo.scorePointId;
                    $scope.setCorrectAreaCss(areaId, areaInfo.areaOffLeft, areaInfo.areaOffTop, areaInfo.areaHeight, areaInfo.areaWidth);
                    //$scope.setCorrectResultCss(findImgId, areaInfo,$scope.TIMES.TWO);
                    $scope.specialQShowErrorMsgText(spInfo.scorePointId, spInfo.application.appQExpression[0].msg);
                    if (spInfo.application.appQAnswer) {
                        $scope.specialQShowErrorMsgText("ans" + spInfo.scorePointId, spInfo.application.appQAnswer[0].msg);
                    }

                };

                /**
                 * 应用题批改 3.列式无而答语有对有错
                 * @param spInfo 得分点对象
                 */
                $scope.specialQExprNull = function (spInfo) {
                    //列式无情况提示错误信息
                    $scope.specialQShowErrorMsgText(spInfo.scorePointId, spInfo.application.appQExpression[0].msg);
                    var ansIndex = spInfo.answer.indexOf("wordAnswer");
                    var childTextArea = $scope.textArea.children().find("span[class='appTextarea']");
                    if (ansIndex < 0) {//在answer中没有找到答语，则报错
                        $log.log("处理列式无而答语有对有错情况，而在answer答案中没有找到对应的答案");
                        return;
                    }
                    if (!childTextArea || childTextArea.length == 0) {
                        $log.log("处理列式无而答语有对有错情况，而在html中没有找到子textarea。");
                        return;
                    }
                    $scope.specialQNomalAnsHandle(spInfo, spInfo.application.appQAnswer, $scope.HANDLE_TYPE.ANS, childTextArea.children());
                };

                /**
                 * 应用题批改 4.表示答语无而列式有对有错
                 * @param spInfo 得分点对象
                 */
                $scope.specialQAnsNull = function (spInfo) {
                    //列式无情况提示错误信息
                    $scope.specialQNomalExpHandle(spInfo, spInfo.application.appQExpression);
                    $scope.specialQShowErrorMsgText(spInfo.scorePointId, spInfo.application.appQAnswer[0].msg);
                };

                /**
                 * 应用题批改 5.表示剩下1种情况，列式有对有错，答语有对有错
                 * @param spInfo 得分点对象
                 */
                $scope.specialQExprAns = function (spInfo) {
                    $scope.specialQNomalExpHandle(spInfo, spInfo.application.appQExpression);
                    $scope.specialQNomalAnsHandle(spInfo, spInfo.application.appQAnswer);
                };

                /**
                 * 应用题批改 6.半对情况
                 * @param spInfo 得分点对象
                 * @param htmlStr img对象
                 * @param areaInfo 计算的区域对象
                 */
                $scope.specialQPartRight = function (spInfo, htmlStr, areaInfo) {
                    //$scope.smallQ.append(htmlStr.areaImgHtml);
                    $scope.smallQ.append(htmlStr.yesImg2Html);
                    //var areaId = "#areaImg" + spInfo.scorePointId;
                    var findImgId = "#yesImg2" + spInfo.scorePointId;
                    //$scope.setCorrectAreaCss(areaId, areaInfo.areaOffLeft, areaInfo.areaOffTop, areaInfo.areaHeight, areaInfo.areaWidth);
                    $scope.setCorrectResultCss(findImgId, areaInfo, $scope.TIMES.TWO);
                    $scope.specialQShowErrorMsgText(spInfo.scorePointId, spInfo.application.appQExpression[0].msg);
                    //console.log(spInfo.application.appQAnswer)
                    if (spInfo.application.appQAnswer) {
                        $scope.specialQShowErrorMsgText("ans" + spInfo.scorePointId, spInfo.application.appQAnswer[0].msg);
                    }
                };

                /**
                 * 应用题正常处理打勾打叉---列式部分
                 * @param spInfo 得分点对象
                 * @param arr 批改结果集
                 */
                $scope.specialQNomalExpHandle = function (spInfo, arr) {
                    var ansIndex = spInfo.answer.indexOf("wordAnswer");
                    var expAnsStr = spInfo.answer;
                    if (ansIndex > 0) {
                        expAnsStr = spInfo.answer.substring(0, ansIndex);
                    }
                    var totalCount = $scope.handleAnsStr(expAnsStr);//整个答案unit标签元素个数
                    //遍历输入框textarea内的所有子元素
                    var unitEleArray = $scope.textArea.children();
                    _.each(arr, function (data) {
                        var preAnsStr = expAnsStr.substring(0, data.startLoc);
                        var nextAnsStr = expAnsStr.substring(data.endLoc, expAnsStr.length);
                        var startNodeCount = $scope.handleAnsStr(preAnsStr);//开始的unit标签元素个数
                        var lastNodeCount = $scope.handleAnsStr(nextAnsStr);//后半截的unit标签元素个数
                        for (var i = 0; i < unitEleArray.length; i++) {
                            if (startNodeCount <= (i + 1) && (i + 1) <= totalCount - lastNodeCount) {//表示当前是目标截取的元素之内的
                                $scope.handleInputOffsetForCircle($(unitEleArray[i]));//处理输入框的offset。
                            }
                        }
                        $scope.calAreaPositon();//计算区域位置
                        //由于得分点只有一个，但是要批改多个结果，所以得分点id不能做主键了
                        var spId = spInfo.scorePointId + data.startLoc + data.endLoc;
                        var areaImgHtml = '<img src="' + icon_circle + '" id="areaImg' + spId + '" >';
                        var errorImgHtml = '<img src="' + icon_no + '" id="errorImg' + spId + '" >';
                        var yesImgHtml = '<img src="' + icon_yes + '" id="yesImg' + spId + '" >';
                        var questionImgHtml = '<img src="' + icon_question + '" id="questionImg' + spId + '" >';
                        //var htmlStr=$scope.getCorrectHtmlStr();
                        var findImgId;
                        if (data.errorCode == 0) {//表示正确
                            $scope.smallQ.append(yesImgHtml);
                            findImgId = "#yesImg" + spId;
                            $scope.setCorrectResultCss(findImgId);
                        } else if (data.errorCode == $scope.CORRECT_CODE.QUESTION) {
                            $scope.smallQ.append(questionImgHtml);
                            findImgId = "#questionImg" + spId;
                            $scope.setCorrectResultCss(findImgId);
                            $scope.specialQShowErrorMsgText(spInfo.spId, data.msg);//显示错误信息
                        } else {//表示错误，注：答语空白10009已经在switch处理掉了
                            var areaId = "#areaImg" + spId;
                            $scope.smallQ.append(areaImgHtml);
                            $scope.setCorrectAreaCss(areaId, $scope.areaOffLeft, $scope.areaOffTop, $scope.areaHeight, $scope.areaWidth);
                            $scope.specialQShowErrorMsgText(spInfo.spId, data.msg);//显示错误信息
                        }
                        $scope.initPositionData();//初始化计算位置

                    });
                };

                /**
                 * 应用题正常处理打勾打叉---答语部分
                 * @param spInfo 得分点对象
                 * @param arr 批改结果集
                 */
                $scope.specialQNomalAnsHandle = function (spInfo, arr) {
                    //遍历输入框textarea内的所有子元素
                    var unitEleArray = $scope.textArea.children();
                    var ansIndex = spInfo.answer.indexOf("wordAnswer");
                    if (ansIndex <= 0) {
                        $log.log("处理应用题正常处理打勾打叉---答语部分：answer没有wordAnswer!");
                        return;
                    }
                    _.each(arr, function (data) {
                        var ansStr = spInfo.answer.substring(ansIndex, data.endLoc);
                        var findIdArry = ansStr.match(/@id=(.+?)@/);
                        if (!findIdArry || findIdArry.length == 0) {
                            $log.log("处理应用题正常处理打勾打叉---答语部分：正则匹配id的值出错!");
                            return;
                        }
                        var findId = findIdArry[1];//匹配到有两个，第一个为匹配到的整串id=1111,而第二则为id的值1111
                        /*var findInput = unitEleArray.find("#" + findId + ', [box-id=' + findId + ']');*/
                        var findInput = unitEleArray.find('[box-id="' + findId + '"]');
                        if (!findInput || findInput.length == 0) {
                            $log.log("处理应用题正常处理打勾打叉---答语部分：渲染完毕的html中没有找到目标答语元素!id为" + findId);
                            return;
                        }
                        $scope.handleInputOffsetForCircle($(findInput));//处理输入框的offset。
                        $scope.calAreaPositon();//计算区域位置
                        //由于得分点只有一个，但是要批改多个结果，所以得分点id不能做主键了
                        var spId = spInfo.scorePointId + data.startLoc + data.endLoc;
                        var areaImgHtml = '<img src="' + icon_circle + '" id="areaImg' + spId + '" >';//答语不用画区域。
                        // var errorImgHtml = '<img src="' + icon_no + '" id="errorImg' + spId + '" >';
                        var yesImgHtml = '<img src="' + icon_yes + '" id="yesImg' + spId + '" >';
                        //var testHtml='<unit id="1">800</unit>';
                        //unitEleArray.append(testHtml);
                        //var htmlStr=$scope.getCorrectHtmlStr();
                        var findImgId = "#errorImg" + spId;
                        if (data.errorCode == 0) {//表示正确
                            $scope.smallQ.append(yesImgHtml);
                            findImgId = "#yesImg" + spId;
                        } else {//表示错误，注：答语空白10009已经在switch处理掉了
                            var areaId = "#areaImg" + spId;
                            $scope.smallQ.append(areaImgHtml);
                            $scope.setCorrectAreaCss(areaId, $scope.areaOffLeft, $scope.areaOffTop, $scope.areaHeight, $scope.areaWidth);
                            //$scope.smallQ.append(errorImgHtml);
                            $scope.specialQShowErrorMsgText(spInfo.spId, data.msg);//显示错误信息
                        }
                        //$scope.smallQ.append(areaImgHtml);
                        //$scope.setCorrectAreaCss(areaId,$scope.areaOffLeft,$scope.areaOffTop,$scope.areaHeight,$scope.areaWidth);
                        $scope.setCorrectResultCss(findImgId);
                        $scope.initPositionData();//初始化计算位置
                        ansIndex = data.endLoc;//这个结束位置作为下一个答案的起点
                    });
                };


                //表达式列表
                $scope.EXPRESSION_SET = EXPRESSION_SET;
                //mathjax不能parse的表达式列表
                $scope.UNSUPPORT_EXPRESSION_SET = UNSUPPORT_EXPRESSION_SET;
                $scope.SPACE_CHARACTOR = "    "; //空格
                $scope.APP_TEXTAREA_CLASS_IDENTITIY = 'appTextarea';
                $scope.PULL_INPUT_AREA_CLASS_IDENTITIY = 'pull-input-area';
                $scope.textContent = {
                    html: '', //包含html标签的答案串
                    expr: '' //不包含html标签的答案串
                };
                $scope.innerDirectiveCount = 0;

                // $scope.parseExpr2Html = function () {
                //
                //     /**
                //      *
                //      * 注意：在对编辑器中的内容进行处理时，对答案串要做特殊处理。
                //      * 例如：给定内容表达式串
                //      *
                //      *         ‘1234\times\frac{1}{2}=617\answer{一共吃吃了@id=1@[\frac{1234}{2}]个苹果}’
                //      *
                //      * 需要里面的每个最小的输入单元（如\times \frac{.+?}{.+?}等）替换成html节点
                //      *
                //      * 但是需要注意的是 \answer{.+?} 括号中的内容应当被当做一个整体看待，不应被替换。
                //      *
                //      * 所以这里先把 \answer{.+?}括号中的内容提取出来，保存在一个临时变量中，等所有的内容被替换完毕后，
                //      *
                //      * 再将内容赋值回去。
                //      *
                //      *
                //      *
                //      */
                //     $scope.tempAnswerExprContent = ''; //答案串中的内容，如果没有答案串，或答案串没有内容，则改变量值为 '';
                //
                //
                //     var exprCl = $scope.textContent.expr;
                //     if (!exprCl)return;
                //     //替换答案串中的内容
                //     exprCl = exprCl.replace(new RegExp($scope.EXPRESSION_SET.WORD_ANSWER, 'mg'), function (match, $1) {
                //         $scope.tempAnswerExprContent = $1;
                //         return '\\wordAnswer{   }';
                //     });
                //     //先替换Mathjax能够识别的符号
                //     for (var key in $scope.EXPRESSION_SET) {
                //         if (key == 'SQUARE' && exprCl.indexOf('\\unit') != -1) {  //如果是应用题答案单位里有次方的将不做处理 因为单位里已经处理了
                //             continue;
                //         }
                //         exprCl = exprCl.replace(new RegExp($scope.EXPRESSION_SET[key], 'mg'), function ($1) {
                //             $scope.innerDirectiveCount++;
                //             var rtStr = null;
                //             for (var key in $scope.UNSUPPORT_EXPRESSION_SET) {
                //                 if ($1.match(new RegExp($scope.UNSUPPORT_EXPRESSION_SET[key].expr, 'mg'))) {
                //                     rtStr = '<unit ' + $scope.UNSUPPORT_EXPRESSION_SET[key].directive + ' id=' + uuid4.generate() + '  lazy-compile=true value="' + $1 + '">{{value}}</unit>';
                //                     break;
                //                 }
                //             }
                //             if (!rtStr)rtStr = '<unit mathjax-parser lazy-compile=true id=' + uuid4.generate() + ' value="' + $1 + '">{{value}}</unit>';
                //             return rtStr;
                //         });
                //     }
                //     //将剩余的部分的每个字符都用unit标签包裹起来
                //     var $wrapper = $('<div></div>').append(exprCl), replaceSet = [];
                //     angular.forEach($wrapper[0].childNodes, function (node) {
                //         if (node.nodeType != 3)return; //针对文本节点操作
                //         var txt = node.textContent, $w = $('<div></div>');
                //         angular.forEach(txt.split(''), function (charactor) {
                //             $w.append($('<unit></unit>').attr('id', uuid4.generate()).append(charactor));
                //         });
                //         replaceSet.push({node: node, replace: $w.html()});
                //     });
                //     angular.forEach(replaceSet, function (replaceItem) {
                //         $(replaceItem.node).replaceWith(replaceItem.replace);
                //     });
                //
                //     //如果有答案，则将之前替换的内容再替换到HTML串中
                //     $wrapper.find('[' + $scope.UNSUPPORT_EXPRESSION_SET.WORD_ANSWER.directive + ']').attr('value', '\\wordAnswer{' + $scope.tempAnswerExprContent + '}');
                //
                //     $scope.textContent.html = $wrapper.html();
                // };

                $scope.parseExpr2Html = function () {

                    /**
                     *
                     * 注意：在对编辑器中的内容进行处理时，对答案串要做特殊处理。
                     * 例如：给定内容表达式串
                     *
                     *         ‘1234\times\frac{1}{2}=617\answer{一共吃吃了@id=1@[\frac{1234}{2}]个苹果}’
                     *
                     * 需要里面的每个最小的输入单元（如\times \frac{.+?}{.+?}等）替换成html节点
                     *
                     * 但是需要注意的是 \answer{.+?} 括号中的内容应当被当做一个整体看待，不应被替换。
                     *
                     * 所以这里先把 \answer{.+?}括号中的内容提取出来，保存在一个临时变量中，等所有的内容被替换完毕后，
                     *
                     * 再将内容赋值回去。
                     *
                     *
                     *
                     */
                    var exprCl = $scope.textContent.expr;
                    if (!exprCl)return;
                    var parser = new ExpressionParser();
                    var parseResult = parser.parse(exprCl);
                    var $wrapper = $('<div></div>');
                    parseResult.forEach(function (item) {
                        var $unit = $('<unit></unit>'), matchExpressionSet, matchUnSupportExpressionSet;
                        for (var key in $scope.EXPRESSION_SET) {
                            if (item.match(new RegExp('^' + $scope.EXPRESSION_SET[key]))) {
                                matchExpressionSet = true;
                            }
                        }
                        for (var key in $scope.UNSUPPORT_EXPRESSION_SET) {
                            if (item.match(new RegExp('^' + $scope.UNSUPPORT_EXPRESSION_SET[key].expr))) {
                                $unit.attr($scope.UNSUPPORT_EXPRESSION_SET[key].directive, '');
                                matchUnSupportExpressionSet = true;
                            }
                        }
                        if (matchExpressionSet && !matchUnSupportExpressionSet) {
                            $unit.attr('mathjax-parser', '').attr('lazy-compile', true).attr('value', item).attr('ng-bind', 'value').attr('id', uuid4.generate());
                            $scope.innerDirectiveCount++;
                        } else if (matchExpressionSet && matchUnSupportExpressionSet) {
                            $scope.innerDirectiveCount++;
                            $unit.attr('id', uuid4.generate()).attr('lazy-compile', true).attr('value', item);
                        } else {
                            $unit.attr('id', uuid4.generate()).html(item);
                        }
                        $wrapper.append($unit);
                    });
                    $scope.textContent.html = $wrapper.html();
                };

            }],
            link: function ($scope, ele, attr) {
                $scope.correctedFlag = $scope.currentEle.attr("correctedFlag");//批改标志
                //当前小题的所有输入框对象
                if ($scope.currentQInput && $scope.currentQInput.length > 0) {
                    $scope.smallQ.css("position", "relative");
                    _.each($scope.currentQInput, function (spInfo, index) {
                        if (spInfo.scorePointId == $scope.currentSpId && !$scope.correctedFlag) {//如果匹配当前得分点
                            if (spInfo.multiQIndex) {
                                var timeOut = spInfo.multiQIndex * 1000;
                                /*  setTimeout(function(){
                                 $scope.spCorrectShow(spInfo);
                                 },timeOut);*/
                                $timeout(function () {
                                    $scope.spCorrectShow(spInfo);
                                }, timeOut);
                            } else {
                                $scope.spCorrectShow(spInfo);
                            }
                            return true;
                        }
                    });
                }
            }
        }
    }]);

