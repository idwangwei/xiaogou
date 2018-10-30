/**
 * Created by liangqinli on 2017/3/18.
 */
import {dhms} from '../untils'

function countdown($interval, $root) {
    return {
        restrict: 'A',
        scope: {
            seconds: '@',    //秒数
            pattern: '@',  //显示的格式
            timeEndCallBack: '&'
        },
        link: function(scope, element){
           /* var future;*/
           /* future = new Date(scope.date);*/
            var future = scope.seconds || 0;
            var pattern = scope.pattern;
            var start = new Date().getTime();
            var retTimeStr;
            var stop = $interval(function() {
                var diff = Math.floor((new Date().getTime() - start) / 1000),
                    countdown;
               /* console.log('future', future, start, diff);*/
               countdown = future - diff;
                if (countdown <= 0 ) {
                    $interval.cancel(stop);
                    countdown = 0;
                    if(scope.timeEndCallBack){
                        scope.timeEndCallBack();
                        /*$interval.cancel(stop);*/
                        return element.text('00 : 00');
                    }
                }
                return element.text(dhms(countdown, pattern));
                /*if(pattern==='ms2'&&$root.competition&&$root.competition.paper) {
                    paperService.matchPaper.localVvailableTimeShow=dhms(countdown, pattern);
                    paperService.matchPaper.localVvailableTime=countdown;
                }
                /!*console.log("countdown time---->"+countdown);*!/
                return retTimeStr;*/
            }, 1000);
            /**
             * 监听$destroy时，销毁$interval;
             */
            scope.$on('$destroy', () => {
                console.error("destroy");
                /*paperService.matchPaper.localVvailableTimeShow = null;
                paperService.matchPaper.localVvailableTime = null;*/
                $interval.cancel(stop);
            });
        }
    };
}

countdown.$inject = ['$interval', '$rootScope'];
export default countdown;