import "./scrollTip.less"

export default [function () {
    return {
        restrict: "E",
        scope: {
            height: "="
        },
        template: require('./scrollTip.html'),
        link: function ($scope) {
            // let headerH = $('.bar-header').innerHeight();
            // let footerH = $('.bar-footer').innerHeight();
            // $scope.top = headerH;
            // $scope.height = window.innerHeight - headerH - footerH;
            $scope.tipHtml = ``;
            let tipHtml = `<div class="scrollTip"  ng-repeat="i in range(tipNumber)">
                                <div class="ion-arrow-up-c"></div>
                                <div class="tipContent">
                                    按这里<br/>，<br/>上下滑屏
                                </div>
                                <div class="ion-arrow-down-c"></div>
                            </div>`;
            $scope.$watch('height', function (scrollHeight) {
                if (scrollHeight) {
                    $scope.tipNumber = Math.floor(scrollHeight / 400);
                    for (let i = 0; i < $scope.tipNumber; i++) $scope.tipHtml += tipHtml;
                }
            })
        }
    }
}]