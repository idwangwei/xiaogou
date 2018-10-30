/**
 * Created by WL on 2017/9/6.
 */
import './style.less';
import uuid4 from "./../../angular-uuid4";

const CORRECT_STATUS = {
    WITHOUT_CORRECT: "WITHOUT_CORRECT",//批改
    CORRECT_FIRST: "CORRECT_FIRST",//批改首次做
    CORRECT_LAST: "CORRECT_LAST",//批改改错后
};

export default ['$timeout', function ($timeout) {
    return {
        restrict: 'AE',
        scope: {
            inputId: '@'
        },
        require: ['^oralCalculationList', '^equation'],
        template: `
            <span class="equation-input-span" id="{{inputId}}">{{inputBoxAnswer}}</span>
            <img ng-style="{top:imgTop+'px'}"
                 ng-class="passFlag==0?'wrong':'correct'"
                 ng-src="{{passFlag==0?$root.loadImg('other/icon_circle2.png'):$root.loadImg('other/icon_yes.png')}}"
                 ng-if="passFlag!==null"
                 class="correct-img">
        `,
        controller: ['$scope', '$timeout', 'uuid4', '$compile', ($scope, $timeout, uuid4, $compile) => {
            $scope.uuid4 = uuid4;
            $scope.$compile = $compile;
        }],

        link: function ($scope, $elem, $attrs, ctrls) {
            let correctStatus = ctrls[0]['correctStatus'];
            let quesInfo = ctrls[1].quesInfo;
            let answerInfo = quesInfo.smallQStuAnsMapList;
            $scope.imgTop = 20;
            $timeout(() => {
                $scope.imgTop = ($elem.height() - $elem.children().eq(1).height()) / 2;
            }, 300);

            $scope.rootInput = $elem;
            $scope.rootInput.scope().$on('oralCalculation.addContent', (e, result) => {
                if (!result) return;
                $scope.rootInput.empty();
                let resultArr = dealResult(result);
                if (typeof(resultArr) == 'string') {
                    addInputElem(resultArr);
                } else {
                    resultArr.forEach((val) => {
                        if (val) {
                            addInputElem(val);
                        }
                    })
                }
            });

            let addInputElem = function (val) {
                let $unit = $("<unit></unit>");
                $unit.attr('id', $scope.uuid4.generate()).attr('value', val).append(val);
                if (val.indexOf('frac') != -1) {
                    $unit.attr('mathjax-parser', '');
                }
                $scope.rootInput.append($unit);
                $scope.$compile($unit)($scope);
            };
            let dealResult = function (result) {
                if (result) {
                    result = result
                        .replace(/＋/mg, '+')
                        .replace(/－/mg, '-')
                        .replace(/×/mg, '\\times')
                        .replace(/÷/mg, '\\div');
                    let fracArr = result.match(/\\frac{(.*?)}{(.*?)}/g);
                    if (!fracArr) {
                        return result;
                    }
                    result = result.replace(/\\frac{(.*?)}{(.*?)}/g, "#");
                    result = result.split("#");
                    let resultArr = [];
                    for (let i = 0; i < result.length; i++) {
                        resultArr.push(result[i]);
                        if (fracArr[i]) {
                            resultArr.push(fracArr[i]);
                        }
                    }
                    return resultArr;
                }
            };
            let getAnsForInputBox = function (inputBoxAnswerInfoList) {
                let answer = "";
                inputBoxAnswerInfoList.forEach(inputBoxAnsInfo => {
                    if (inputBoxAnsInfo.inputBoxUuid === $scope.inputId) {
                        answer = inputBoxAnsInfo.inputBoxStuAns;
                    }
                });
                return answer;
            };
            $scope.passFlag = null;
            $scope.inputBoxAnswer = "";
            if (CORRECT_STATUS.CORRECT_FIRST === correctStatus) {
                let firstDoWorkAns = answerInfo[0];
                $scope.passFlag = firstDoWorkAns.passFlag;
                $scope.inputBoxAnswer = getAnsForInputBox(firstDoWorkAns.inputList[0].spList);
            }
            if (CORRECT_STATUS.CORRECT_LAST === correctStatus) {
                let keys = Object.keys(answerInfo);
                let lastKey = keys[keys.length - 1];
                let lastDoWorkAns = answerInfo[lastKey];
                $scope.passFlag = lastDoWorkAns.passFlag;
                $scope.inputBoxAnswer = getAnsForInputBox(lastDoWorkAns.inputList[0].spList);
            }


        }
    };
}]