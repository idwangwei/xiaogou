/**
 * Created by Administrator on 2017/5/2.
 */
// import BaseController from 'base_components/base_ctrl';
import {Inject, View, Directive, select} from '../../module';

@View('reward_day_task', {
    url: '/reward_day_task/:backUrl',
    template: require('./day_task.html'),
    styles: require('./day_task.less'),
    inject: [
        '$scope'
        , '$state'
        , '$rootScope'
        , '$stateParams'
        , '$ngRedux'
        , '$ionicHistory'
        , 'rewardSystemService'
        , '$ionicLoading'
    ]
})

class dayTaskCtrl {
    @select(state=>state.reward_day_task) tasks;
    getCapacity = 0;

    constructor() {
        /*后退注册*/

    }

    initData() {
    }

    loadImage(img) {
        return require('./../../../reward_images/' + img);
    }

    getWidth(item) {
        let doneNum = Number(item.finishedCount);
        let taskNum = Number(item.requiredCount);
        let width = ((doneNum / taskNum).toFixed(2)) * 100;
        if (width > 100) width = 100;
        return width;

    }

    /**
     * 领取奖励
     * @param item
     */
    getAward(item) {
        if (item.finishedCount != item.requiredCount) return;
        var awardServer = this.rewardSystemService.getTaskAward(item.taskId);
        awardServer.then((data)=> {
            if (data && data.code == 200) {
                item.status = true;
                this.getCapacity = item.credits;
                this.showRewardPrompt();
                // this.toast("领取成功", 1000);
            }
        })
    }

    back() {
        if (this.getRootScope().showRewardPrompt) {
            this.getRootScope().showRewardPrompt = false;
            this.getRootScope().$digest();
        } else if (this.backUrl) {
            this.go(this.backUrl);
        } else {
            this.go('home.me');
        }
    }

    onBeforeLeaveView() {
    }

    onReceiveProps() {
    }

    onAfterEnterView() {
        this.initData();
        let getServer = this.rewardSystemService.getDayTaskInfo();
        getServer.then((data)=> {
            if (data && data.code == 200) {
                this.analyzeData();
            }
        })
    }

    analyzeData() {
        if (this.tasks) {
            angular.forEach(this.tasks, (v, k)=> {
                if (this.tasks[k].name.match('游戏')) {
                    this.tasks[k].type = 'game';
                } else if (this.tasks[k].name.match('击败') && this.tasks[k].name.match('速算')) {
                    this.tasks[k].type = 'pk';
                } else if (this.tasks[k].name.match('速算')) {
                    this.tasks[k].type = 'susuan';
                } else if (this.tasks[k].name.match('萌宠')) {
                    this.tasks[k].type = 'diagnose';
                } else {
                    this.tasks[k].type = 'work';
                }

            });
            // this.tasks[0].finishedCount = this.tasks[0].requiredCount;

        }
    }

    /**
     * 弹出提示框
     * @param msg
     */
    toast(msg, t) {
        let time = t || 1000;
        this.$ionicLoading.show({
            template: msg,
            duration: time,
            noBackdrop: true
        });
    }

    configDataPipe() {
        this.backUrl = this.getStateService().params.backUrl;
    }

    doTest(item) {
        if (item.type == 'game') {
            this.goToGamePage()
        } else if (item.type == 'pk') {
            this.goToComputePage();
        } else if (item.type == 'susuan') {
            this.goToComputePage();
        } else if (item.type == 'diagnose') {
            this.goToDiagnosePage()
        } else {
            this.goToWorkPage();
        }
    }

    showRewardPrompt() {
        this.getRootScope().showRewardPrompt = true;
    }

    /**
     * 去作业页面
     */
    goToWorkPage() {
        this.rewardSystemService.changeUrlFromForStore('work_list');
        this.go('home.work_list', 'forward');
    }

    /**
     * 去游戏页面
     */
    goToGamePage() {
        this.go('home.game_list', 'forward');
    }

    /**
     * 去速算页面
     */
    goToComputePage() {
        this.go('home.compute', 'forward');
    }

    /**
     * 去诊断页面
     */
    goToDiagnosePage() {
        this.go('home.diagnose02', 'forward');
    }
}