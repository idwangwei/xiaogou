/**
 * Created by ww on 2016/11/8.
 */
import {Inject, Directive} from 'ngDecorator/ng-decorator';

@Directive({
    selector: 'toolTimer',
    template: require('./tool_timer.html'),
    styles: require('./style.less'),
    replace: true
})
@Inject("$scope", "$rootScope", "$state", "$interval", "$ngRedux")
class toolTimer {
    $interval;
    $ngRedux;
    countdownTime = 60;
    passTime = 0;
    intervalId;


    startCountdown(){
        this.passTime=0;
        $('.timer-bg-bottom').css({'transform':'rotate(0deg)'});
        $('.timer-bg-top').css({'transform':'rotate(0deg)','background':'#ccc'});

        this.intervalId = this.$interval(()=>{
            this.passTime++;
            $('.timer-bg-bottom').css({'transform':'rotate('+360*this.passTime/this.countdownTime+'deg)'});
            if(this.passTime == this.countdownTime/2){
                $('.timer-bg-top').css({'transform':'rotate(180deg)','background':'red'});
            }
        },1000,this.countdownTime);


        this.intervalId.then(()=>{
            this.$interval.cancel(this.intervalId);
        })
    }

    $step = 1;
    $loops = Math.round(100 / $step);
    $increment = 360 / $loops;
    $half = Math.round($loops / 2);
    $barColor = '#ec366b';
    $backColor = '#feeff4';

    clock={
        interval:null,
        init:function(){
            $('.input-btn').click(function(){
                switch($(this).data('action')){
                    case'start':
                        clock.stop();
                        clock.start($('.input-num').val());
                        break;
                    case'stop':
                        clock.stop();
                        break;
                }
            });
        },
        start:function(t){
            var pie = 0;
            var num = 0;
            var min = t?t:1;
            var sec = min*60;
            var lop = sec;
            $('.count').text(min);
            if(min>0){
                $('.count').addClass('min')
            }else{
                $('.count').addClass('sec')
            }
            clock.interval = setInterval(function(){
                sec = sec-1;
                if(min>1){
                    pie = pie+(100/(lop/min));
                }else{
                    pie = pie+(100/(lop));
                }
                if(pie>=101){ pie = 1; }
                num = (sec/60).toFixed(2).slice(0,-3);
                if(num==0){
                    $('.count').removeClass('min').addClass('sec').text(sec);
                }else{
                    $('.count').removeClass('sec').addClass('min').text(num);
                }
                //$('.clock').attr('class','clock pro-'+pie.toFixed(2).slice(0,-3));
                //console.log(pie+'__'+sec);
                $i = (pie.toFixed(2).slice(0,-3))-1;
                if($i < $half){
                    $nextdeg = (90 + ( $increment * $i ))+'deg';
                    $('.clock').css({'background-image':'linear-gradient(90deg,'+$backColor+' 50%,transparent 50%,transparent),linear-gradient('+$nextdeg+','+$barColor+' 50%,'+$backColor+' 50%,'+$backColor+')'});
                }else{
                    $nextdeg = (-90 + ( $increment * ( $i - $half ) ))+'deg';
                    $('.clock').css({'background-image':'linear-gradient('+$nextdeg+','+$barColor+' 50%,transparent 50%,transparent),linear-gradient(270deg,'+$barColor+' 50%,'+$backColor+' 50%,'+$backColor+')'});
                }
                if(sec==0){
                    clearInterval(clock.interval);
                    $('.count').text(0);
                    //$('.clock').removeAttr('class','clock pro-100');
                    $('.clock').removeAttr('style');
                }
            },1000);
        },
        stop:function(){
            clearInterval(clock.interval);
            $('.count').text(0);
            $('.clock').removeAttr('style');
        }
    }

}