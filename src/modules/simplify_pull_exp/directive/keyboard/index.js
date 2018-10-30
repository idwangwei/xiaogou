/**
 * Created by ww 2017/9/7.
 */
import './index.less';
export default ()=> {

    return {
        restrict: "EC",
        scope:true,
        template: require('./index.html'),
        controller: ['$scope','$timeout', ($scope,$timeout)=> {
            $scope.$timeout = $timeout;
            $scope.setHeight = ($keyboardEle,useWidth)=> {
                useWidth = useWidth && !this.$scope.$root.platform.IS_IPHONE && !this.$scope.$root.platform.IS_IPAD;
                let height = useWidth ? window.innerWidth * 0.462 : window.innerHeight * 0.462;
                $keyboardEle.css('height', height + 'px');
            };
        }],
        link: function ($scope, ele, attrs) {
            let $ele = $(ele);
            $scope.$simplifyTextareEle = undefined; //显示键盘的当前输入框simplify
            $scope.$on('simplifyKeyboard.show', (ev, param)=> {
                $ele.css({width: '100%'}).show();
                $scope.$simplifyTextareEle = param.ele;
                let focusEle = param.focusEle;

                $scope.showFracTop=false;
                $scope.showFracBottom=false;
                if(!focusEle)return;
                if(focusEle.is(".simplify-frac-con-row-bottom") || focusEle.parents(".simplify-frac-con-row-bottom").length != 0){//如果当前光标是处于分母
                    $scope.showFracTop=true;
                    $scope.showFracBottom=false;
                }
                if(focusEle.is(".simplify-frac-con-row-bottom") || focusEle.parents(".simplify-frac-con-row-top").length != 0){//如果当前光标是处于分母
                    $scope.showFracTop=false;
                    $scope.showFracBottom=true;
                }
            });
            $scope.$on('simplifyKeyboard.hide', (ev, ele)=> {
                if(ele)$scope.$simplifyTextareEle = ele;
                $scope.hide(ev);
            });
            $scope.hide = (ev)=>{
                ev.preventDefault();
                $ele.hide();
                $scope.$simplifyTextareEle&&$scope.$simplifyTextareEle.find('cursor').remove();
            };

            $scope.handleClickNum = (ev)=>{
                var $tar = $(ev.currentTarget);
                $tar.addClass('key-active-100');
                $tar.removeClass('greenItem');
                $scope.$timeout(function(){
                    $tar.addClass('greenItem');
                    $tar.removeClass('key-active-100');
                },200);

                let value = $tar.attr('value');

                $scope.$root.$broadcast('simplifyKeyboard.addContent', {val: value, ele: $scope.$simplifyTextareEle});
            };

            $scope.handleSimplify = (ev)=>{
                var $tar = $(ev.currentTarget);
                $tar.addClass('key-active-100');
                $tar.removeClass('item-simplify');
                $scope.$timeout(function(){
                    $tar.addClass('item-simplify');
                    $tar.removeClass('key-active-100');
                },200);
                
                //显示当前光标所在unit-con（数字）的约分框
                $scope.$root.$broadcast('simplifyKeyboard.showSimplifyBox',{ele: $scope.$simplifyTextareEle});

            };

            $scope.handleDel = (ev)=>{
                var $tar = $(ev.currentTarget);
                $tar.addClass('key-active-100');
                $tar.removeClass('greenItem');
                $scope.$timeout(function(){
                    $tar.addClass('greenItem');
                    $tar.removeClass('key-active-100');
                },200);

                $scope.$root.$broadcast('simplifyKeyboard.clearUnit',{ele: $scope.$simplifyTextareEle});

            };
            $scope.enter = (ev)=>{
                var $tar = $(ev.currentTarget);
                $tar.addClass('key-active-100');
                $tar.removeClass('greenItem');
                $scope.$timeout(function(){
                    $tar.removeClass('key-active-100');
                    $tar.addClass('greenItem');
                },200);

                $scope.$root.$broadcast('simplifyKeyboard.enter',{ele: $scope.$simplifyTextareEle});
            };
        }
    }
}