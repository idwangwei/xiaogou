/**
 * Created by 华海川 on 2015/11/4.
 * 通关情况
 */
import $  from 'jquery';
import {Inject, View, Directive, select} from '../../module';
@View('pass_game_situation', {
    url: '/pass_game_situation',
    template: require('./pass_game_situation.html'),
    inject: ["$scope"
        , "$state"
        , "$log"
        , "commonService"
        , "$ionicActionSheet"
        , "gameStatisticsService"
        , "$interval"
        , "$timeout"
        , "$ionicPopup"
        , "$ionicScrollDelegate"
        , "$rootScope"
        , '$ngRedux']
})
class passGameSituationCtrl {
    gameStatisticsService;
    $ionicPopup;
    $interval;

    showErrorImgFlag = false;//显示错误原因大图标志
    openFlag = true;//打开img状态
    timmer = null;

    initData() {
        this.clazzOrStu = this.gameStatisticsService.clazzOrStu;
        this.className = this.gameStatisticsService.pubGame.className;
        this.stuName = this.gameStatisticsService.student.name;
        this.data = this.gameStatisticsService.errorStats;

        this.topHeight = $("#topContent").height();
        this.bottomHeigth = $("#bottomContent").height();

    }

    onAfterEnterView() {
        this.setListeningEvent();
        this.initData();
        this.getData();
    }

    getData() { //获取错误归因
        if (this.gameStatisticsService.clazzOrStu == 1) {
            this.gameStatisticsService.getErrorByClazz();
        } else {
            this.gameStatisticsService.getErrorByStu();
        }
    };

    setListeningEvent() {
        /**
         * 横竖屏切换时就重新动态计算
         */
        $(window).on("orientationchange", () => {

            var ionContentOld = $("#situationContent");//内容区域
            this.timmer = this.$interval(()=>{  //倒计时
                var ionContentNew = $("#situationContent");//内容区域
                if (ionContentOld != ionContentNew) {
                    $("#mainContent").css({height: ionContentNew.height() + "px"});
                    $("#bottomContent").css({height: ionContentNew.height() / 2 + "px"});
                    var domArray = $("div[my-backdrop]");
                    angular.forEach(domArray, (dom)=>{
                        $(dom).css({
                            'top': ionContentNew.offset().top + "px",
                            'left': '0',
                            'height': ionContentNew.height() + "px"
                        })
                    });
                    this.$ionicScrollDelegate.$getByHandle('imgScroll').scrollTop();
                    this.$interval.cancel(this.timmer);
                }
            }, 100);
        });

        /**
         * 当离开controller就取消定时器
         */
        this.getScope().$on('$destroy', ()=>{
            if (this.timmer) this.$interval.cancel(this.timmer);
        });
    }

    /**
     * 接触事件
     * @param e
     */
    onTouch(e) {
        this.oy = e.target.offsetTop;//最初到顶部的距离
        this.topHeight = $("#topContent").height();
        this.bottomHeigth = $("#bottomContent").height();
        this.totalHeight = $("#mainContent").height();
    };

    /**
     * 拖拽事件
     * @param e
     */
    onDrag(e) {
        //$log.log("=================分割线start================");
        var moveY = e.gesture.deltaY;//移动的距离
        var bottomMoveHeigth = this.bottomHeigth - moveY;//移动过后，下方的高度
        if (bottomMoveHeigth > 0 && bottomMoveHeigth < this.totalHeight) {//下方的高度只能在最大的容器中
            $("#bottomContent").css({height: bottomMoveHeigth});
            $("#topContent").css({height: (this.totalHeight - bottomMoveHeigth)});
        }
        //$log.log("=================分割线end================");
    };

    /**
     * 点击错误原因图片显示大图
     */
    showErrorImg() {
        this.showErrorImgFlag = true;//显示错误原因大图标志
        //this.bindGesture();
    };

    /**
     * 点击隐藏错误原因的大图
     */
    hideErrorImg() {
        this.showErrorImgFlag = false;//显示错误原因大图标志
        //this.offGesture();
    };

    /**
     * 打开或折叠图片区域
     */
    handleOpenImg() {
        if (this.openFlag == true) {
            var topHeight = $("#situationContent").height();
            var barHeight = $('#pullBar').height() || 50;
            $("#topContent").css({height: topHeight - barHeight});
            $("#bottomContent").css({height: barHeight});
            this.openFlag = false;
        } else {
            $("#bottomContent").css({height: '50%'});
            $("#topContent").css({height: '50%'});
            this.openFlag = true;
        }

    }

    /**
     * 返回作业列表展示
     */
    back() {
        this.go("game_statistics");
    };

    //注册返回
    doRefresh() {
        this.getData();
    };

    help() {
        this.$ionicPopup.alert({
            title: '信息提示',
            template: '<p>点击图片可全屏查看。</p>',
            okText: '确定'
        });
    }
}
export default passGameSituationCtrl;