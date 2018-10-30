/**
 * Created by ZL on 2017/11/6.
 */
import shareImg from "../../../images/share_img_to_p.png";
import {Inject, View, Directive, select} from '../../module';

@View('credits_store_task', {
    url: 'credits_store_task/:fromUrl',
    styles: require('./style.less'),
    template: require('./page.html'),
    inject:['$scope',
    '$state',
    '$rootScope',
    '$stateParams',
    '$ngRedux',
    '$ionicHistory',
    '$ionicLoading',
    '$ionicPopup',
    '$timeout',
    'commonService',
    'creditsStoreService',
    'diagnoseService']
})

class creditsStoreTaskCtrl {
    commonService;
    $ionicPopup;
    $timeout;
    creditsStoreService;
    diagnoseService;
    taskList = [];
    taskListTemp = [];
    loading = true;

    @select(state=>state.profile_user_auth.user.name) userName;
    @select(state=>state.teacher_credits_detail) currentCredits;
    constructor(){


    }
    initData() {
        this.taskListTemp = [
            {
                imgUrl: 'task_list/type1.png',
                butnStr: '通知学生加入',
            },
            {
                imgUrl: 'task_list/type2.png',
                butnStr: '邀请老师',
            },
            {
                imgUrl: 'task_list/type3.png',
                butnStr: '布置作业',
            },
            {
                imgUrl: 'task_list/type4.png',
                butnStr: '布置游戏',
            },
            {
                imgUrl: 'task_list/type5.png',
                butnStr: '提醒学生',
            }
        ];
        if(this.getStateService().params.fromUrl)
        this.fromUrl = this.getStateService().params.fromUrl;
    }

    onAfterEnterView() {
        this.initData();
        this.getTaskList();
    }

    getTaskList() {
        this.creditsStoreService.getAllTaskList().then((data)=> {
            if (data && data.code == 200) {
                this.dealTaskData(data.result);
                /*if(this.fromUrl=='credits_store'||this.fromUrl=='credits_exchange_goods'){
                    let mark=this.taskList.find((x)=>{
                        return x.taskType=2;
                    })
                    this.creditsStoreService.selectTask(mark);
                    this.go('task_progress',{fromUrl:this.fromUrl});
                }*/
            }
        })
    }

    dealTaskData(taskList) {
        this.taskList.length = 0;
        angular.forEach(taskList, (v, k)=> {
            this.taskList.push(taskList[k]);
            /*替换图片和10000颜色*/
            this.taskList[k].taskName=this.taskList[k].taskName.replace(/智慧币/g,"<img src='"+require("../../../images/creditsStoreImg02.png")+"'>")//智慧币替换为图片
            this.taskList[k].taskName=this.taskList[k].taskName.replace(/##可重复领##/g,"<img class='icon-repeat' src='"+require("../../../images/task_list/icon-repeat.png")+"'>");//可重复领取图标
            if (this.taskListTemp.length >= Number(v.taskType)) {
                this.taskList[k].imgUrl = this.taskListTemp[Number(v.taskType) - 1].imgUrl;
                this.taskList[k].butnStr = this.taskListTemp[Number(v.taskType) - 1].butnStr;
            }
            if (this.taskList[k].taskType == 5) {
                // this.taskList[k].subDesc = '每5个学生完成学习任务即可领取一次奖励，可多次领取 ';//不需要了
            }
        })
    }

    onBeforeEnterView() {
    }

    back() {
        if(this.$ionicHistory.backView()!==null){
            this.$ionicHistory.goBack()
        }else{
            if (this.$stateParams.fromUrl) {
                this.go(this.$stateParams.fromUrl)
            } else {
                this.go('home.work_list');
            }
        }
    }

    /**
     * 去任务进度页面
     */
    gotoTaskProgress(item) {
        if((item.taskType==3||item.taskType==4)&&!item.canDo){
            if(item.taskType==3){
                this.$ionicPopup.alert({
                    title: '提示',
                    template: '请先把班级加满20人，再来布置作业吧！'
                });
            }
            if(item.taskType==4){
                this.$ionicPopup.alert({
                    title: '提示',
                    template: '请先把班级加满20人，再来布置游戏吧！'
                });
            }
        }else{
            this.creditsStoreService.selectTask(item);
            this.go('task_progress');
        }

    }
    /**
     * 去积分列表页面
     */
    gotoCreditsList(item) {
        this.go('credits_list');
    }
    /**
     * 去商城页面
     */
    goCreditsStore(item) {
        this.go('credits_store');
    }
    /**
     * 去完成任务
     */
    gotoDoTask(item, $event) {
        if (typeof $event === 'object' && $event.stopPropagation) {
            $event.stopPropagation();
        } else if (event && event.stopPropagation) {
            event.stopPropagation();
        }
        if (item.taskType == 1) {
            this.go('home.clazz_manage');

        } else if (item.taskType == 2) {
            this.go('home.me', {inviteFlag: 'yes'});

        } else if (item.taskType == 3) {
            if(item.canDo){
                this.go('pub_work_type');
            }else{
                this.$ionicPopup.alert({
                    title: '提示',
                    template: '请先把班级加满20人，再来布置作业吧！'
                });
            }

        } else if (item.taskType == 4) {
            if(item.canDo){
                this.go('home.pub_game_list');
            }else{
                this.$ionicPopup.alert({
                    title: '提示',
                    template: '请先把班级加满20人，再来布置游戏吧！'
                });
            }
        } else if (item.taskType == 5) {
            this.sendMsgTostu();
        }
    }

    gotoCreditsRecord() {
        this.go('credits_list');
    }

    gotoCreditsStore() {
        this.go('credits_store');
    }

    /**
     * 发送提醒个学生；分享
     */
    sendMsgTostu() {
        this.diagnoseService.sendMsgTostudent()
            .then((data)=> {
                if (data) {
                    this.commonService.alertDialog('提醒已发送到学生端', 1000);
                    this.alertTimer = this.$timeout(()=> {
                        this.diagnoseService.shareImage(shareImg, this,'提醒学生和家长','各位学生和家长：');
                        this.$timeout.cancel(this.alertTimer);
                    }, 1000);
                }
            });
    }

    /**
     * 下来刷新
     */
    pullRefresh() {
        let refreshComplete = () => {
            this.$timeout(() => this.getScope().$broadcast('scroll.refreshComplete'), 10)
        };
        if (!this.loading) return;
        this.loading = false;

        this.creditsStoreService.getAllTaskList().then((data)=> {
            if (data && data.code == 200) {
                this.dealTaskData(data.result);
                refreshComplete();
                this.loading = true;
            } else {
                this.loading = true;
            }
        })
    }
}

export default creditsStoreTaskCtrl;