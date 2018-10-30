/**
 * Created by PJL on 2017/9/14.
 */
import './style.less'
import scrollUpImg from './../../../images/scrollUp.png';
import scrollDownImg from './../../../images/scrollDown.png';
export default ['$ionicScrollDelegate', function ($ionicScrollDelegate) {
    return {
        restrict: "E",
        scope: {
            scrollPosition: '=',
            scrollHeight: "=",
            height: '=',
            delegateHandle: "@",
            questionCount: '='
        },
        template: require('./scrollbar.html'),
        link: function ($scope) {
            let scrollViewDelegate = $ionicScrollDelegate.$getByHandle($scope.delegateHandle);
            $scope.h = 0;
            $scope.handleBarHeight = 20;
            $scope.scrollUpImg = scrollUpImg;
            $scope.scrollDownImg = scrollDownImg;
            function refreshHandleBarHeight() {
                let height = $scope.scrollAreaHeight;
                let scrollHeight = $scope.scrollHeight;
                let handleBarHeight = 20;
                if (height && scrollHeight) {
                    handleBarHeight = height * ((height / scrollHeight)+0.1);
                }
                $scope.handleBarHeight = handleBarHeight;
                console.log("count:" + $scope.questionCount)
            }

            function scroll() {
                let targetPosition = $scope.handleBarPosition / $scope.availableScrollHeight * $scope.scrollHeight;
                console.log(targetPosition);
                scrollViewDelegate.scrollTo(0, targetPosition, true);
            }

            function checkPos() {
                if ($scope.handleBarPosition < 0) $scope.handleBarPosition = 0;
                if ($scope.handleBarHeight + $scope.handleBarPosition > $scope.scrollAreaHeight)
                    $scope.handleBarPosition = $scope.scrollAreaHeight - $scope.handleBarHeight;
            }

            $scope.$watch('scrollPosition', () => {
                refreshHandleBarHeight();
            });
            $scope.$watch('scrollHeight', () => {
                refreshHandleBarHeight();
            });
            $scope.$watch('height', () => {
                $scope.top = $('.bar-header').innerHeight();
                $scope.bottom = $('.bar-footer').innerHeight();
                $scope.up = $('.oral-scroll-up').innerHeight();
                $scope.down = $('.oral-scroll-down').innerHeight();
                console.log($scope.height, $scope.top, $scope.bottom);
                $scope.h = ($scope.height - $scope.bottom - $scope.top) * 0.6;
                $scope.top += ($scope.height - $scope.bottom - $scope.top) * 0.2;
                $scope.scrollAreaHeight = $scope.h - $scope.up - $scope.down;
                $scope.availableScrollHeight = $scope.scrollAreaHeight - $scope.handleBarHeight;
                refreshHandleBarHeight();
            });
            $scope.scrollUp = function () {
                $scope.handleBarPosition -= $scope.availableScrollHeight / $scope.questionCount * 3;
                checkPos();
                refreshHandleBarHeight();
                scroll();
            };
            $scope.scrollDown = function () {
                $scope.handleBarPosition += $scope.availableScrollHeight / $scope.questionCount * 3;
                checkPos();
                refreshHandleBarHeight();
                scroll();
            };
            let dragStartPageY = 0;
            let startPosition = 0;
            $scope.handleBarPosition = 0;

            $scope.dragStart = function (event) {
                event.stopPropagation();
                refreshHandleBarHeight();
                dragStartPageY = event.gesture.center.pageY;
                startPosition = $(event.target).position().top;
            };
            let counter = 0;
            $scope.drag = function (event) {
                event.stopPropagation();
                let movePosition = event.gesture.center.pageY - dragStartPageY;
                $scope.handleBarPosition = startPosition + movePosition;
                checkPos();
                counter++;
                if (counter == 5) {
                    scroll();
                    counter = 0;
                }
            }
        }
    }
}]