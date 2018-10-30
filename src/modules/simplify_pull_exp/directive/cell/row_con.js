/**
 * Created by ww 2017/8/9.
 */

export default ()=> {
    return {
        restrict: 'E',
        replace:true,
        scope:true,
        transclude:true,
        template:`<div class="simplify-row-con" ng-transclude></div>`,
        controller: ['$scope', '$rootScope', '$compile', ($scope, $rootScope, $compile)=> {
            $scope.$compile = $compile;
        }],
        link: function ($scope, element, attrs, ctrl) {
            let $ele = $(element);
            if($scope.isDoQuestion){

                $ele.click((ev)=>{
                console.log('click row-con ...............');
                let $self = $(ev.currentTarget);
                ev.stopPropagation();
                let $simplifyEle = $self.parents('.simplify-textarea').eq(0);
                let $cursor = $simplifyEle.find('cursor');
                if($cursor.length==0){
                    $cursor = $scope.$compile($('<cursor></cursor>'))($scope);
                }

                let $lastChild = $self.children(':last-child');
                if($lastChild.is('.simplify-num-con')){
                    if($lastChild.children('.simplify-unit-con-real').length!=0){
                        let $unitCons = $lastChild.children('.simplify-unit-con').not('.simplify-unit-con-opacity');
                        $self.is('.simplify-frac-con-row-bottom')?
                            $unitCons.eq(0).append($cursor)
                            :$unitCons.eq(-1).append($cursor);
                    }else {
                        $lastChild.children('.simplify-unit-con').append($cursor);
                    }
                }else {
                    $self.append($cursor);
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
