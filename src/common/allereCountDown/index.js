/**
 * Created by liangqinli on 2017/3/18.
 */
/**
 * edit by zl on 2017/9/18.
 */
angular.module("alrCountDown", [])
    .directive('alrCountDown', ['$interval', '$rootScope', function ($interval, $rootScope) {
        return {
            restrict: 'A',
            scope: {
                seconds: '@',    //秒数
                pattern: '@',  //显示的格式
                timeEndCallBack: '&',
                timeCountCallBack:'&',
                timeRestCallBack:"=",
                countDownTimer:'='
            },
            link: function (scope, element) {
                /* var future;*/
                /* future = new Date(scope.date);*/
                var future = scope.seconds || 0;
                var pattern = scope.pattern;
                var start = new Date().getTime();
                if(future <= 0) {
                    if (scope.timeEndCallBack) {
                        scope.timeEndCallBack();
                    }
                    return element.text('00 : 00');
                }
                scope.countDownTimer.timer = $interval(function () {
                    var diff = Math.floor((new Date().getTime() - start) / 1000),
                        countdown;
                    /* console.log('future', future, start, diff);*/
                    countdown = future - diff;
                    if (countdown <= 0) {
                        $interval.cancel(scope.countDownTimer.timer);
                        countdown = 0;
                        if (scope.timeEndCallBack) {
                            scope.timeEndCallBack();
                            /*$interval.cancel(stop);*/
                            return element.text('00 : 00');
                        }
                    }
                    if(scope.timeRestCallBack){
                        scope.timeRestCallBack(countdown);//实时callBack
                    }

                    return element.text(dhms(countdown, pattern));
                    /*if(pattern==='ms2'&&$root.competition&&$root.competition.paper) {
                     paperService.matchPaper.localVvailableTimeShow=dhms(countdown, pattern);
                     paperService.matchPaper.localVvailableTime=countdown;
                     }
                     /!*console.log("countdown time---->"+countdown);*!/
                     return retTimeStr;*/
                }, 1000);
                if (scope.timeCountCallBack) {
                    scope.timeCountCallBack();
                }

                /**
                 * 监听$destroy时，销毁$interval;
                 */
                scope.$on('$destroy', () => {
                    console.error("destroy");
                    /*paperService.matchPaper.localVvailableTimeShow = null;
                     paperService.matchPaper.localVvailableTime = null;*/
                    $interval.cancel(scope.countDownTimer.timer);
                });


                function dhms(t, pattern) {
                    /*
                     * d天 H小时 m分 s秒
                     * */
                    var days, hours, minutes, seconds1;
                    days = Math.floor(t / 86400);
                    t -= days * 86400;
                    hours = Math.floor(t / 3600) % 24;
                    t -= hours * 3600;
                    minutes = Math.floor(t / 60) % 60;
                    t -= minutes * 60;
                    seconds1 = t % 60;
                    function checkTime(i) { //将0-9的数字前面加上0，例1变为01
                        if (i < 10) {
                            i = "0" + i;
                        }
                        return i;
                    }

                    switch (pattern) {
                        case 'dHms':
                            return `${days}天${hours}时${minutes}分${checkTime(seconds1)}秒`;
                        case 'Hms':
                            return `${hours}时${minutes}分${seconds1}秒`;
                        case 'ms':
                            return `${minutes}分${seconds1}秒`;
                        case 'ms2':
                            return `${checkTime(minutes)} : ${checkTime(seconds1)}`;
                        default:
                            return `${days}天${hours}时${minutes}分`;
                    }
                }
            }
        };
    }]);
