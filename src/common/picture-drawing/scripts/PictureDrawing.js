/**
 * Created by LuoWen on 2017/1/9.
 */

import {utils, CONST, EVENTS} from './PictureDrawingConfig';
import painterUtils from './PainterUtils'

export default ["$timeout", "$compile", "$injector", "$state", ($timeout, $compile, $injector, $state)=>({
    restrict: "E",
    scope:{
        bg: "=",
        ans: "="
    },
    // require: "pw-canvas",
    controller: 'PictureDrawingCtrl',
    controllerAs: 'ctrl',
    template: require("../templates/picture-drawing.html"),
    link:function ($scope, $element, $attr, ctrl) {
        console.log("pd link", $scope, $element, $attr, ctrl);
        let parentScope = $scope.$parent;
        parentScope.textContent = parentScope.textContent || {};
        parentScope.textContent.expr = parentScope.textContent.expr || "";
        
        let isWatched = false;
        parentScope.$watch("textContent.expr", function (newVal, oldVal) {
            if(isWatched) return;
            isWatched = true;//这个方法只执行一次 watch

            let isStateAllowedEdit = isStateAllowed($state);
            let answer = isRetrieveAns(newVal);
            let isAnswerRetrieving = !!answer;

            let imgBg = parseIpAddressInPicture($injector, $scope.bg);
            let imgAns = parseIpAddressInPicture($injector, $scope.ans);
            // ctrl.imgBg = imgBg;
            // ctrl.imgHeight = 200;
            //
            ctrl.selectedLineWidth = 5;
            ctrl.imageSrcBg = imgBg;
            ctrl.imageSrcAns = imgAns;
            ctrl.imgHeight = 500;
            ctrl.imgWidth = 300;
            ctrl.selectedColor = '#485247';
            ctrl.heightLoaded = false;
            ctrl.status = 2;

            let img = new Image();
            img.onload = bgImgOnLoad($scope, $element, ctrl, $timeout, answer, isAnswerRetrieving);
            img.src = imgBg;

            ctrl.coordOffset = 0;
            $scope.$watch('ctrl.coordOffset', function (newValue) {
                if(newValue) {
                    ctrl.similarity();
                }
            });

            handleInEClass($element, imgAns, ctrl, isStateAllowedEdit);
            handleInQB($element, imgAns);
            handleInQBI($element, imgAns);

            retrievePainter($scope, $element, $compile)
        });

        parentScope.$on(EVENTS.SAVE_SIMILARITY + ctrl.uuid , function (evt, ret) {
            console.log("EVENTS.SAVE_SIMILARITY", ret);
            ret.V = CONST.PARSE_VERSION_1_0; //数据版本：1.0
            parentScope.textContent = {
                expr: JSON.stringify(ret).replace(/(\[)(\d+)(,)(\d+),\d+,\d+(])/g, (a, b, c, d, e, f)=> {
                    return b + (+c).toString(36) + d + (+e).toString(36) + f;
                }).replace(/],\[/g, "|")
            };
        });

        $scope.$on("$destroy", function destroyScope($scope) {
            let curScope = $scope.currentScope;
            let ctrl = curScope.ctrl;
            let uuid = ctrl.getUUIDPatern(curScope);

            delete ctrl.pictureDrawingService.share[uuid];
        });
    }
})];

/**
 * 获取 scale 条件下，真实的Dom宽度
 * @param $element
 */
let setViewPortWidth = ($element, isRetrieveAns)=> {
    let css = {};
    let windowWidth = $(window).width();
    if (windowWidth < 375) { // iphone 5
        isRetrieveAns
            ? (css.width = "98vw", css.paddingLeft = "8px")
            : (css.width = "100vw")
    } else if (windowWidth < 768) { // iphone 6, 6s, 6splus
        isRetrieveAns
            ? css.width = "90vw"
            : css.width = "95vw"
    } else { // ipad, windows
        css.width = "60vw";
    }
    $element.parent().parent().css(css);
};

/**
 * 作业端、题库预览端  手动转化 ${ip}
 * @param $injector
 * @param ip
 * @returns {*}
 */
let parseIpAddressInPicture = ($injector, ip) => {
    if(utils.isQBI()) return ip;

    let serverInterface = $injector.get("serverInterface");
    return ip.replace(/\$\{ip}:90/, utils.isQB()
            ? serverInterface.COMMON_ADDRESS
            : serverInterface.IMG_SERVER)
};

let retrievePainter = ($scope, $element, $compile)=> {
    let painterDom = $element.find("div[version]");

    painterDom.attr('pw-canvas', "");
    $compile(painterDom)($scope);
};

/**
 * 作业端处理
 * @param $element
 * @param imgAns
 * @param ctrl
 * @param isStateAllowedEdit
 */
let handleInEClass = ($element, imgAns, ctrl, isStateAllowedEdit)=> {
    if(!utils.isEClass()) return "";

    //学生端，展示答案时
    if(!isStateAllowedEdit) {
        $element.find(".fnBtns").hide();
    }
};

/**
 * 题库处理
 * @param $element
 * @param imgAns
 */
let handleInQB = ($element, imgAns) => {
    if(!utils.isQB()) return;

    blurAnsImg($element, imgAns);
    $element.find(".fnBtns").hide();
};

/**
 * 题为导入处理
 * @param $element
 * @param imgAns
 */
let handleInQBI = ($element, imgAns)=> {
    if(!utils.isQBI()) return;

    blurAnsImg($element, imgAns);
    $element.find(".fnBtns").hide();
};

let blurAnsImg = ($element, imgAns) => {
    let img = new Image();
    img.onload = function () {
        let canvas = $element.find('canvas#main')[0];
        let ctx = canvas.getContext('2d');
        // ctx.filter = `drop-shadow(1px 1px 1px red)`;
        ctx.shadowColor = "green";
        ctx.shadowBlur = 5;

        ctx.drawImage(this, 0, 0);

        $element.find('.undo, .commit').hide();
    };
    img.crossOrigin = "anonymous";
    img.src = imgAns;
};

/**
 * 背景图片加载成功，获取宽高
 * @param $scope
 * @param $element
 * @param ctrl
 * @param answer
 * @param $timeout
 * @param isAnswerRetrieving
 * @returns {Function}
 */
let bgImgOnLoad = ($scope, $element, ctrl, $timeout, answer, isAnswerRetrieving)=> {
    return function () {

        ctrl.toggleAns(); //隐藏答案
        setViewPortWidth($element, isAnswerRetrieving);

        $scope.$apply(()=> {
            try {
                ctrl.globalScale = new WebKitCSSMatrix(
                    window.getComputedStyle(ctrl.$element.parent().parent()[0])
                        .webkitTransform
                ).a;
            } catch (e) {
                console.warn('error get globalScale, default: ', 1);
                ctrl.globalScale = 1;
            }
            ctrl.heightLoaded = true;
            ctrl.imgHeight = this.height;

            // return;
            // $timeout(()=>{
            //     let bridge = handleInRetrieveAns(newVal);
            //     if(bridge) ctrl.bridge = JSON.stringify(bridge);
            // }, 10)
            // ctrl.bridge = {name:"", data:{}}

            if(answer) {
                ctrl.bridge = answer;

                //打勾
                $timeout(()=>{
                    painterUtils.createTouchEventAndDispatch($element.find('canvas#tmp')[0], 'end');
                    ctrl.adjustBgGrid();
                });
            }
        });
    }
};

let isRetrieveAns = (ans)=> {
    let answer = false;
    try {
        let parseVer = ans.match(/"V":"(\d+\.\d+)/);
        if(!parseVer) return answer;

        if(parseVer[1] === CONST.PARSE_VERSION_1_0) {
            answer = {
                name: CONST.RETRIEVE_ANS,
                    data: JSON.parse(ans
                .replace(/\|/g, "],[")
                .replace(/(\[)([0-9a-z]+)(,)([0-9a-z]+)(])/g, (a, b, c, d, e, f)=> {
                    return b + parseInt(c, 36) + d + parseInt(e, 36) + f;
                }))
            };
        }
        return answer;
    } catch (e) {
    }
    return answer;
};

/**
 * 路由是否允许编辑
 * @param $state
 * @returns {boolean}
 */
let isStateAllowed = ($state)=> {
    let name = $state.current.name;
    if(name && name.match && (
        name.match(CONST.STATE_HOME_DO_QUESTION)
        || name.match(CONST.STATE_HOME_DIAGNOSE_DO_QUESTION)
        || name.match(CONST.STATE_QUESTION_EDIT)
        || name.match(CONST.STATE_QUESTION_EXAMINE))) {
        return true;
    }
    return false;
};

