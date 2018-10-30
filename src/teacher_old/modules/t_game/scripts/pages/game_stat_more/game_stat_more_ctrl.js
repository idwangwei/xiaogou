/**
 * Created by 邓小龙 on 2015/11/16.
 * 大屏模式游戏统计
 */

import $  from 'jquery';
import {Inject, View, Directive, select} from '../../module';
@View('game_stat_more', {
    url: '/game_stat_more',
    template: require('./game_stat_more.html'),
    inject: ['$scope', '$log', '$ionicHistory', '$rootScope', 'commonService', '$ionicActionSheet',
        'gameStatisticsService', '$ionicModal', '$state', '$interval', 'finalData', '$ionicScrollDelegate', '$ngRedux']
})
class gameStatMoreCtrl {
    gameStatisticsService;
    $interval;
    $log;
    $ionicHistory;

    t = ''; //记录$interval
    showErrorImgFlag = false;//显示错误原因大图标志
    showFreshText = "开启刷新";

    initData() {
        this.pubGame = this.gameStatisticsService.pubGame;//获取发布的游戏信息
        this.data = this.gameStatisticsService.data;//统计数据


        this.gameStatisticsService.clazzOrStu = 1;
        this.clazzOrStu = this.gameStatisticsService.clazzOrStu;
        this.className = this.gameStatisticsService.pubGame.className;
        this.stuName = this.gameStatisticsService.student.name;
        this.errorStatData = this.gameStatisticsService.errorStats;


    }

    setListeningEvent() {
        /**
         * 当离开controller就取消定时器
         */
        this.getScope().$on('$destroy', ()=> {
            this.$interval.cancel(this.t);
        });
        /**
         * 横竖屏切换时就重新动态计算
         */
        $(window).on("orientationchange", ()=> {
            var ionContentOld = $("#statMoreContent");//内容区域
            var timmer = this.$interval(()=>{  //倒计时
                var ionContentNew = $("#statMoreContent");//内容区域
                if (ionContentOld != ionContentNew) {
                    $("#mainContent").css({height: ionContentNew.height() + "px"});
                    $("#bottomContent").css({height: ionContentNew.height() / 2 + "px"});
                    var domArray = $("div[my-backdrop]");
                    angular.forEach(domArray,(dom)=>{
                        $(dom).css({
                            'top': ionContentNew.offset().top + "px",
                            'left': '0',
                            'height': ionContentNew.height() + "px"
                        })
                    });
                    this.$ionicScrollDelegate.$getByHandle('imgScroll').scrollTop();
                    this.$interval.cancel(timmer);
                }
            }, 100);
        });
    }


    /**
     * 接触事件
     * @param e
     */
    onTouch() {
        this.ox = e.target.offsetLeft;//最初到左边的距离
        this.rightWidth = $("#rightContent").width();
        this.leftWidth = $("#leftContent").width();
        //this.totalWidth=this.rightWidth+this.leftWidth;
        this.totalWidth = window.innerWidth;
        this.$log.log("=================totalWidth:" + this.totalWidth);
        this.$log.log("=================innerWidth:" + window.innerWidth);
    };

    /**
     * 拖拽事件
     * @param e
     */
    onDrag() {
        //$(e.target).css({border:'border:4px solid red;'})
        //$log.log("=================分割线start================");
        var moveX = e.gesture.deltaX;//移动的距离
        var resultX = this.ox + moveX;//移动后，到左边的距离
        var leftWidth = commonService.convertToPercent((resultX) / this.totalWidth, 0);
        var rightWidth = commonService.convertToPercent((this.totalWidth - resultX) / this.totalWidth, 0);
        $("#rightContent").css({"flex": rightWidth, "-webkit-flex": rightWidth});
        $("#leftContent").css({"flex": leftWidth, "-webkit-flex": leftWidth});

        //$log.log("=================分割线end================");
    };

    /**
     * 接触事件
     * @param e
     */
    onTouchForUp() {
        this.oy = e.target.offsetTop;//最初到顶部的距离
        this.topHeight = $("#topContent").height();
        this.bottomHeigth = $("#bottomContent").height();
        this.totalHeight = $("#mainContent").height();
    };

    /**
     * 拖拽事件
     * @param e
     */
    onDragForUp() {
        //$log.log("=================分割线start================");
        var moveY = e.gesture.deltaY;//移动的距离
        var bottomMoveHeigth = this.bottomHeigth - moveY;//移动过后，下方的高度
        if (bottomMoveHeigth > 0 && bottomMoveHeigth < this.totalHeight) {//下方的高度只能在最大的容器中
            $("#bottomContent").css({height: bottomMoveHeigth});
            $("#topContent").css({height: (this.totalHeight - bottomMoveHeigth)});
        }
        //$log.log("=================分割线end================");
    }

    onAfterEnterView() {
        this.setListeningEvent();
        this.initData();
        this.gameStatisticsService.getGameStats();//获取统计
        this.getErrorStatData();

    }

    openFresh() {
        this.isFreshflag = false; //是否正在刷新,如果否就显示倒计时
        this.freshTime = 5;     //刷新的初始秒数
        this.t = this.$interval(()=> {  //倒计时
            this.freshTime--;
            if (this.freshTime < 0) {
                this.isFreshflag = true;
                this.freshTime = 6;
                this.gameStatisticsService.getGameStats();//正在刷新
                this.getErrorStatData();
            }
            if (this.freshTime == 5) {
                this.isFreshflag = false;
            }
        }, 1000);
    };

    isFresh() {  //是否开启自动刷新
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.openFresh();
            window.localStorage.refreGameMoreStats = true;
        } else {
            this.$interval.cancel(t);
            window.localStorage.refreGameMoreStats = false;
        }
    };


    errorByClazz() {  //查看全班错误统计
        this.gameStatisticsService.clazzOrStu = 1;
        this.getErrorStatData();
        this.clazzOrStu = this.gameStatisticsService.clazzOrStu;
        this.className = this.gameStatisticsService.pubGame.className;
        this.stuName = this.gameStatisticsService.student.name;
        this.errorStatData = this.gameStatisticsService.errorStats;

    };

    errorByStu(stu) {  //查看一个学生错误统计
        this.gameStatisticsService.clazzOrStu = 2;
        this.gameStatisticsService.student.id = stu.studentId;
        this.clazzOrStu = 2;
        this.className = this.gameStatisticsService.pubGame.className;
        this.stuName = stu.name;
        this.getErrorStatData();
        this.errorStatData = this.gameStatisticsService.errorStats;
    };

    getErrorStatData() { //获取错误归因
        if (this.gameStatisticsService.clazzOrStu == 1) {
            this.gameStatisticsService.getErrorByClazz();
        } else {
            this.gameStatisticsService.getErrorByStu();
        }
    };


    /**
     * 点击错误原因图片显示大图
     */
    showErrorImg() {
        this.showErrorImgFlag = true;//显示错误原因大图标志
    };

    /**
     * 点击隐藏错误原因的大图
     */
    hideErrorImg() {
        this.showErrorImgFlag = false;//显示错误原因大图标志
    }

    /**
     * 返回作业列表展示
     */
    back() {
        this.$ionicHistory.goBack(-1);//返回到列表展示
    };

    doRefresh() {
        this.gameStatisticsService.getGameStats();
        this.getErrorStatData();
    };

}

export default gameStatMoreCtrl;