/**
 * Created by ww 2017/8/9.
 */

export default ()=> {
    return {
        restrict: 'E',
        scope: true,
        replace:true,
        transclude:true,
        template:`<div class="simplify-unit-con" ng-transclude></div>`,
        link: function ($scope, element, attrs, ctrl) {
            let $ele = $(element);
            // let $elePar = $ele.parent('.simplify-num-con');
            if($scope.isDoQuestion){
                $ele.click((ev)=>{
                console.log('click unit-con ...............');
                ev.stopPropagation();

                let $tar = $(ev.target);
                let $self = $(ev.currentTarget);
                let $selfPar = $self.parent();
                let $simplifyEle = $self.parents('.simplify-textarea').eq(0);
                let $cursor = $simplifyEle.find('cursor');

                if($cursor.length==0){
                    $cursor = $scope.$compile($('<cursor></cursor>'))($scope);
                }
                //点击的数字框
                if($selfPar.is('.simplify-num-con')){
                    if($tar.is('unit'))$cursor.insertAfter($tar);
                    else $self.append($cursor);
                }


                //点击的运算符号
                if(!$selfPar.is('.simplify-num-con')){
                    //运算符号后面是unit-con(数字)，将光标加到他的首位
                    if($self.next().is('.simplify-num-con')){
                        $cursor.prependTo($self.next().children().not('.simplify-unit-con-opacity').eq(-1));
                    }
                    //光标加到unit-con后
                    else {
                        $cursor.insertAfter($self);
                    }

                }

                $scope.$apply(()=>{
                    $simplifyEle.scope().focusConEle = $self;
                    $scope.$root.$broadcast('simplifyKeyboard.show', {ele: $simplifyEle,focusEle:$self});
                    $scope.$root.$broadcast('simplifyKeyboard.showFracImg', {focusEle: $self});
                });
            });
            }

        }
    }
}
