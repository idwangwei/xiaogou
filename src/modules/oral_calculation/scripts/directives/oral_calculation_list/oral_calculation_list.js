import parseQuestionList from './../../questionListParser';
import iconYes from './../../../oral_calculation_images/correct_work/icon_yes.png';
import iconCircle from './../../../oral_calculation_images/correct_work/icon_circle2.png';
import './oral_calculation_list.less';


const EXPR_TYPE = {
    COMMON: 1,
    MATHJAX: 2,
    BLANK: 3,
    LINE_BREAK: 4
};

const CORRECT_STATUS = {
    WITHOUT_CORRECT: "WITHOUT_CORRECT",//批改
    CORRECT_FIRST: "CORRECT_FIRST",//批改首次做
    CORRECT_LAST: "CORRECT_LAST",//批改改错后
    DO_QUESTION: "DO_QUESTION", //做题
};

let getType = function (expr) {
    let type = EXPR_TYPE.COMMON;
    if (expr.indexOf('frac') != -1 || expr.indexOf('div') != -1 || expr.indexOf('times') != -1) {
        type = EXPR_TYPE.MATHJAX;
    } else if (expr.indexOf('blank') != -1) {
        type = EXPR_TYPE.BLANK;
    } else if (expr === 'br') {
        type = EXPR_TYPE.LINE_BREAK;
    }
    return type;
};

let getId = function (expr) {
    let id = null;
    let inputId = null;
    let scorePointQbuId = null;
    expr.replace(/{(.+?)}/mg, (match, $0) => {
        id = $0;
    });
    if (id) {
        let splitAry = id.split("_");
        inputId = splitAry[0];
        scorePointQbuId = splitAry[1];
    }
    return {inputId, scorePointQbuId};
};

export default ['$compile', function ($compile) {
    return {
        restrict: "E",
        scope: {
            bigQList: "=",
            isAnswerFetched: "=",
            correctStatus: "@",
            loginName: "=",
        },
        template: require("./oral_calculation_list.html"),
        controllerAs: "ctrl",
        controller: ["$scope", function ($scope) {
            this.hadAddEvent = false;
            this.hasFrac = false;
            this.imageIdList = [];
            this.imageUrl = 'http://192.168.0.24:3001/resource_oral_calculation_distracter/recognize_temp_images/' + $scope.loginName + '/total_images/';
            this.correctStatus = $scope.correctStatus;
            this.checkHasFrac = function (questionList) { //检查是否含有分数
                let has = false;
                for (let i = 0, len = questionList.length; i < len; i++) {
                    let qs = questionList[i];
                    if (JSON.stringify(qs.expr).indexOf("frac") !== -1) {
                        has = true;
                        break;
                    }
                }
                return has;
            };
            this.getQuestionList = function () {
                if ($scope.bigQList.length) {
                    this.smallQList = $scope.bigQList[0].qsList;
                    this.questionList = parseQuestionList(this.smallQList);
                    this.hasFrac = this.checkHasFrac(this.questionList);
                    this.template = this.getTemplate();
                }
            };
            this.getTemplate = function () {
                let oralCalculationListTemplate = ``;
                let getContentTemplate = (quesInfo) => {
                    let imgTemplate = ``;
                    let contentTemplate = ``;
                    quesInfo.expr.forEach(exp => {
                        switch (getType(exp)) {
                            case EXPR_TYPE.COMMON:
                                contentTemplate += exp;
                                break;
                            case EXPR_TYPE.MATHJAX:
                                contentTemplate += `
                                 <unit style="display: inline-block"><script type="math/tex">${exp}</script></unit>`;
                                break;
                            case EXPR_TYPE.BLANK:
                                $scope.passFlag = null;
                                $scope.inputBoxAnswer = "";
                                let {inputId, scorePointQbuId} = getId(exp);
                                let answerInfo = quesInfo.smallQStuAnsMapList;
                                let getAnsForInputBox = function (inputBoxAnswerInfoList) {
                                    let answer = "";
                                    inputBoxAnswerInfoList.forEach(inputBoxAnsInfo => {
                                        if (inputBoxAnsInfo.inputBoxUuid === inputId) {
                                            answer = inputBoxAnsInfo.inputBoxStuAns || "";
                                        }
                                    });
                                    return answer;
                                };
                                if (CORRECT_STATUS.CORRECT_FIRST === $scope.correctStatus) {
                                    let firstDoWorkAns = answerInfo[0];
                                    $scope.passFlag = firstDoWorkAns.passFlag;
                                    $scope.inputBoxAnswer = getAnsForInputBox(firstDoWorkAns.inputList[0].spList);
                                }
                                if (CORRECT_STATUS.CORRECT_LAST === $scope.correctStatus) {
                                    let keys = Object.keys(answerInfo);
                                    let lastKey = keys[keys.length - 1];
                                    let lastDoWorkAns = answerInfo[lastKey];
                                    $scope.passFlag = lastDoWorkAns.passFlag;
                                    $scope.inputBoxAnswer = getAnsForInputBox(lastDoWorkAns.inputList[0].spList);
                                }
                                let correctImgTemplate = ``;
                                if ($scope.passFlag == 0) {
                                    correctImgTemplate = `<img  src="${iconCircle}" class="correct-img wrong">`;
                                }
                                if ($scope.passFlag == 2) {
                                    correctImgTemplate = `<img  src="${iconYes}" class="correct-img right">`;
                                }
                                if ($scope.inputBoxAnswer && $scope.inputBoxAnswer.indexOf('frac') !== -1) {
                                    contentTemplate += `
                                    <span style="position: relative;display: inline-block" >
                                         <span id="${inputId}" seq-num="${quesInfo.seqNum}" sp-qbu-id="${scorePointQbuId}" class="equation-input-span">
                                                <script type="math/tex">${$scope.inputBoxAnswer}</script>
                                         </span>
                                         ${correctImgTemplate}
                                    </span>`;
                                } else {
                                    contentTemplate += `
                                    <span style="position: relative;display: inline-block" >
                                         <span id="${inputId}" seq-num="${quesInfo.seqNum}" sp-qbu-id="${scorePointQbuId}" class="equation-input-span">
                                               ${$scope.inputBoxAnswer}
                                         </span>
                                         ${correctImgTemplate}
                                    </span>`;
                                }

                                // imgTemplate += this.getTotalImageTemplate(inputId, $scope.inputBoxAnswer);
                                break;
                            case EXPR_TYPE.LINE_BREAK:
                                contentTemplate += imgTemplate;
                                contentTemplate += `<div></div>`;
                                break;
                        }
                    });
                    return contentTemplate;
                };
                let getEquationTemplate = (quesInfo, index) => {
                    let contentTemplate = getContentTemplate(quesInfo);
                    return `
                         <div class="oral-calculation-equation" id="${quesInfo.id}">
                            <div class="title">${quesInfo.seqNum + 1     }、</div>
                            <div class="content">
                                    ${contentTemplate}
                            </div>
                         </div>
                    `
                };
                this.questionList.forEach((quesInfo, index) => {
                    let equationTemplate = getEquationTemplate(quesInfo, index);
                    let tempClass = '', style = '';
                    if (this.correctStatus !== CORRECT_STATUS.DO_QUESTION) {
                        tempClass = 'oral-question oral-question-correct';
                    } else {
                        tempClass = 'oral-question';
                        style = this.hasFrac ? 'padding-top:100px' : '';
                    }
                    oralCalculationListTemplate += `
                            <div class="${tempClass}" style="${style}">
                                 ${equationTemplate}
                            </div>
                            `
                });
                oralCalculationListTemplate += `<div style="width: 1px;height: 100px"></div>`;
                return oralCalculationListTemplate;
            };

            this.getTotalImageTemplate = function (inputId) {
                if (!$scope.loginName || !$scope.inputBoxAnswer || $scope.inputBoxAnswer.length == 0) {
                    return ``
                }
                this.imageIdList.push(inputId);
                let image_url = this.imageUrl + inputId + '.jpg?timestamp=' + new Date().getTime();
                let imageTemplate = `<img  src="${image_url}" class="total-image" input-id="${inputId}">`;
                return `<span style="position: relative;display: inline-block; padding-left:20px"> 
                                     ${imageTemplate}
                                </span>`;
            };

            this.addClickEventListener = function () {
                if (this.hadAddEvent) return;
                this.hadAddEvent = true;
                this.imageIdList.forEach((id) => {
                    $("[input-id=" + id + "]").click((e) => {
                        $scope.$root.$broadcast('show-recognize-stroke-image', {inputId: id})
                    })
                })
            };
        }],
        link: function ($scope, $element, $attr, $ctrl) {
            if (!$attr.isAnswerFetched) {
                $ctrl.getQuestionList();
                $element.append($ctrl.template);
                MathJax.Hub.Queue(["Reprocess", MathJax.Hub, document.body]);
                $ctrl.addClickEventListener();
            } else {
                $scope.$watch('isAnswerFetched', () => {
                    if ($scope.isAnswerFetched) {
                        $ctrl.getQuestionList();

                        $element.append($ctrl.template);
                        MathJax.Hub.Queue(["Reprocess", MathJax.Hub, document.body]);
                        $ctrl.addClickEventListener();
                    }
                })
            }
        }
    }
}]