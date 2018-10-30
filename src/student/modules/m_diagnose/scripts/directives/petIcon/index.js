/**
 * Created by ww 2017/8/9.
 */

import temp from './index.html';
import './index.less';

export default ()=> {
    return {
        restrict: 'E',
        template: temp,
        scope:{
            hasFooter:'='
        },
        controller: ['commonService', '$scope', '$state','$rootScope',(commonService, $scope, $state,$rootScope)=> {
            $scope.headerHeight = commonService.judgeSYS() == 2 ? 64 : 44;
            $scope.availHeight = window.innerHeight;

            $scope.enterPetPage = (e)=>{
                e.preventDefault();
                $state.go('pet_page',{urlFrom:$state.current.name,backWorkReportUrl:$state.params.backWorkReportUrl});
                $rootScope.$injector.get('$ionicViewSwitcher').nextDirection('forward');
            }
        }],
        link: function ($scope, element, attrs, ctrl) {
            let isTouch = !!('ontouchstart' in window);
            let eventType = {
                isTouch: isTouch,
                DRAG_START: isTouch ? 'touchstart' : 'mousedown',
                DRAG_MOVE: isTouch ? 'touchmove' : 'mousemove',
                DRAG_END: isTouch ? 'touchend' : 'mouseup'
            };
            let dragEle = element.children().eq(0);
            let prePoint = {x: 0, y: 0};
            let translate;
            let footerHeight = $scope.hasFooter ? 50:0;
            let transitionHide = ()=>{
                dragEle.css({
                    'transition':'transform 200ms',
                    '-webkit-transition':'transform 200ms'
                });
            };
            let imgRotate = (deg)=>{
                dragEle.children().css('transform',`rotateZ(${deg}deg)`);
                dragEle.children().css('-webkit-transform',`rotateZ(${deg}deg)`);
            };

            $scope.$watch('$root.petIconTranslate',(newV)=>{
                let splitResult = newV && newV.split('|');
                if(splitResult){
                    dragEle.css('transform', splitResult[0]);
                    dragEle.css('-webkit-transform', splitResult[0]);
                    dragEle.children().css('transform',splitResult[1]);
                    dragEle.children().css('-webkit-transform',splitResult[1]);
                }
            });

            $scope.dragStart = (e)=> {
                console.log('drag start==>', e);
                prePoint.x = eventType.isTouch ? +e.originalEvent.changedTouches[0].pageX : +e.pageX;
                prePoint.y = eventType.isTouch ? +e.originalEvent.changedTouches[0].pageY : +e.pageY;
                translate = (dragEle.css('transform').match(/-?\d+(\.\d+)?/g) && dragEle.css('transform').match(/-?\d+(\.\d+)?/g).splice(-2)) || [0, 0];

                dragEle.css({
                    'transition':'initial',
                    '-webkit-transition':'initial'
                });
                dragEle.children().css({
                    'transform':'initial',
                    '-webkit-transform':'initial'
                });

                dragEle.on(eventType.DRAG_MOVE, $scope.dragMove);
            };
            $scope.dragMove = (e)=> {
                e.preventDefault();
                let translateX = 0, translateY = 0;
                if (eventType.isTouch) {
                    translateX = +e.originalEvent.changedTouches[0].pageX - prePoint.x;
                    translateY = +e.originalEvent.changedTouches[0].pageY - prePoint.y;
                } else {
                    translateX = +e.pageX - prePoint.x;
                    translateY = +e.pageY - prePoint.y;
                }

                dragEle.css('transform', `translate( ${+translate[0] + translateX}px,${+translate[1] + translateY}px)`);
                dragEle.css('-webkit-transform', `translate( ${+translate[0] + translateX}px,${+translate[1] + translateY}px)`);
            };
            $scope.dragEnd = (e)=> {
                let resultTranslate = (dragEle.css('transform').match(/-?\d+(\.\d+)?/g) && dragEle.css('transform').match(/-?\d+(\.\d+)?/g).splice(-2)) || [0, 0];
                let petIconTranslate = `translate(${resultTranslate[0]}px,${resultTranslate[1]}px)|rotateZ(0deg)`;
                if (resultTranslate[0] < -e.currentTarget.offsetLeft) {
                    petIconTranslate = `translate( ${-e.currentTarget.offsetLeft - 20}px,${+resultTranslate[1]}px)|rotateZ(45deg)`;
                    resultTranslate[0] = -e.currentTarget.offsetLeft - 20;
                    transitionHide();
                    imgRotate(45);
                }
                if (resultTranslate[0] > 10) {
                    petIconTranslate = `translate(30px,${+resultTranslate[1]}px)|rotateZ(-45deg)`;
                    resultTranslate[0] = 30;
                    transitionHide();
                    imgRotate(-45);
                }
                if (resultTranslate[1] < -(+e.currentTarget.offsetTop - $scope.headerHeight)) {
                    petIconTranslate = `translate(${+resultTranslate[0]}px,${-e.currentTarget.offsetTop + $scope.headerHeight - 20}px)|rotateZ(0deg)`;
                    transitionHide();
                }
                if (resultTranslate[1] > ($scope.availHeight - e.currentTarget.offsetTop - e.currentTarget.offsetHeight - footerHeight)) {
                    petIconTranslate = `translate(${+resultTranslate[0]}px,${$scope.availHeight - e.currentTarget.offsetTop - e.currentTarget.offsetHeight - footerHeight + 20}px)|rotateZ(0deg)`;
                    transitionHide();
                }

                $scope.$root.petIconTranslate = petIconTranslate; //不需要$apply
                dragEle.css('transform', petIconTranslate.split('|')[0]);
                dragEle.css('-webkit-transform', petIconTranslate.split('|')[0]);
                dragEle.off(eventType.DRAG_MOVE);
            };

            dragEle.on('click',$scope.enterPetPage);
            dragEle.on(eventType.DRAG_START, $scope.dragStart);
            dragEle.on(eventType.DRAG_END, $scope.dragEnd);

            $scope.$on('$destroy', ()=> {
                element.off();
            });
        }
    }
}
