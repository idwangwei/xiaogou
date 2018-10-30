/**
 * Created by ZL on 2017/11/7.
 */
import shareImg from "../../../images/share_img_to_p.png";
import {Inject, View, Directive, select} from '../../module';

@View('task_progress', {
    url: 'task_progress/:taskType/:fromUrl',
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
    'diagnoseService',
    '$ionicScrollDelegate']
})
class taskProgressCtrl {
    commonService;
    $ionicPopup;
    $rootScope;
    $timeout;
    creditsStoreService;
    diagnoseService;
    progressType = false;
    rewardInfo = {};
    stuDoneTaskList = [];
    showArrow = false;//是否显示上划
    freshType=1;//1表示已经刷新完成，可以再次刷新 2表示在刷新中
    @select(state=>state.profile_user_auth.user.name) userName;
    @select(state=>state.select_teacher_task) taskInfo;
    constructor(){


    }
    initData() {
        if(!this.taskInfo){
            this.taskInfo = {
                deadline:"2017-12-31"
            }
        }
        if(this.getStateService().params.fromUrl){
            this.taskInfo.taskType=2
        }
/*
        if(this.taskInfo.taskType==3){
            this.taskInfo.taskType=5
        }
*/

        this.taskType = this.taskInfo.taskType;
        this.markUrl=require("../../../images/creditsStoreImg02.png");//金币小图标
        // this.taskType = 5;//TODO 删除测试数据
        if (this.taskType == 1) {
            this.progressType = 1;
            // this.taskInfo.imgUrl = 'creditsStoreImg04.png';
            this.taskInfo.doTask = '通知学生加入';
            this.taskInfo.taskDes = '创建班级';
            this.taskInfo.rules = [//2017.10.30;20
                //20 20
                '1.班级在${%d}之后创建，邀请${%d}名或以上新注册的学生加入班级。',
                '2.老师的所有班级中有1个班级满${%d}名新注册学生即视为完成任务，可获得${%d}智慧币。此任务1个账号每学年只可领取一次奖励。',
                '3.完成任务后，点击领取奖励，系统会自动将智慧币发到您的账号，使用高峰期可能有延迟，请您耐心等待。',
                '4.通过不正当手段获得智慧币的账号，智算365有权撤销智慧币。',
                '5.如对本规则有其他疑问，请联系微信公众号：智算365。'
            ];
        } else if (this.taskType == 2) {
            this.progressType = 2;
            // this.taskInfo.imgUrl = 'creditsStoreImg05.png';
            this.taskInfo.doTask = '邀请新老师';
            this.taskInfo.taskDes = '邀请新老师';
            this.taskInfo.rules = [//20,30,20
                '1.被邀请老师为首次注册智算365的老师。',
                '2.分享邀请链接给新老师，ta在邀请链接中填入的手机号和下载app后注册的手机号应该一致。',
                '3.新老师成功注册，且有1个班级满${%d}名新学生，ta将获得${%d}智慧币，您将同时获得${%d}智慧币+抽iPhone X大奖机会。',
                '4.下拉刷新可获取最新的邀请状态，可能会有延迟，请耐心等待。',
                '5.通过不正当手段获得智慧币的账号，智算365有权撤销智慧币。',
                '6.如对本规则有其他疑问，请联系微信公众号：智算365。'
            ];
        } else if (this.taskType == 3) {
            this.progressType = 1;
            // this.taskInfo.imgUrl = 'creditsStoreImg06.png';
            this.taskInfo.doTask = '布置作业';
            this.taskInfo.taskDes = '周作业布置';
            this.taskInfo.rules = [//3,20,3,3,80%
                '1.您在本周日之前，给人数≥${%d}的班级布置${%d}套或以上作业。',
                '2.在本周日之前，有${%d}套或以上作业的提交率≥${%d}，视为本周作业任务完成，即可领取${%d}智慧币。',
                '3.本任务1个账号每周只能领取1次奖励，下一周将作为新任务重新记录。',
                '4.完成任务后，点击领取奖励，系统会自动将智慧币发到您的账号，使用高峰期可能有延迟，请您耐心等待。',
                '5.通过不正当手段获得智慧币的账号，智算365有权撤销智慧币。',
                '6.如对本规则有其他疑问，请联系微信公众号：智算365。'
            ];
        } else if (this.taskType == 4) {
            this.progressType = 1;
            // this.taskInfo.imgUrl = 'creditsStoreImg07.png';
            this.taskInfo.doTask = '布置游戏';
            this.taskInfo.taskDes = '周游戏布置';
            this.taskInfo.rules = [//3,20,3,3,80%
                '1.您在本周日之前，给人数≥20的班级布置3个或以上游戏。',
                '2.在本周日之前，有3个或以上游戏的提交率≥80%，视为本周游戏任务完成，即可领取100智慧币。',
                '3.本任务1个账号每周只能领取1次奖励，下一周将作为新任务重新记录。',
                '4.完成任务后，点击领取奖励，系统会自动将智慧币发到您的账号，使用高峰期可能有延迟，请您耐心等待。',
                '5.通过不正当手段获得智慧币的账号，智算365有权撤销智慧币。',
                '6.如对本规则有其他疑问，请联系微信公众号：智算365。'
            ];
        } else if (this.taskType == 5) {
            this.progressType = 3;
            // this.taskInfo.imgUrl = 'creditsStoreImg13.png';
            this.taskInfo.doTask = '提醒学生';
            this.taskInfo.taskDes = '教学时效奖';
            this.taskInfo.rules = [
                '1.学生在单元考点个数中，掌握率≥80%，本学期内（${%d}开始）掌握3个单元，视为该生完成了学习任务。',
                '2.每5个学生完成学习任务，您可领取一次教学实效奖，可重复领！',
                '3.老师可通过发布作业、提醒学生自愿使用“诊断提分”功能等方式让学生掌握考点。',
                '4.任务进度表格需下拉刷新才能更新，可能会有延迟，请耐心等待。',
                '5.通过不正当手段获得智慧币的账号，智算365有权撤销智慧币。',
                '6.如对本规则有其他疑问，请联系微信公众号：智算365。'
            ];
        }

        /*this.taskInfo.invitList = [
            {
                phone: '18712345678',
                name: '张芃',
                joinStudentCount: 20,
                targetStudentCount: 20,
                awardId: '123'
            },
            {
                phone: '18712345671',
                name: '李鹏',
                joinStudentCount: 12,
                targetStudentCount: 12,
                awardId: '234'
            },
            {
                phone: '18712345672',
                name: '王朋',
                joinStudentCount: 15,
                targetStudentCount: 15,
                awardId: '467'
            }
        ];*/
         /* this.stuDoneTaskList = [
         {
         studentList: [{name: '王小可', doneCount: 3, awardId: '124'},
         {name: '王小可', doneCount: 3},
         {name: '王小可', doneCount: 3},
         {name: '王小可', doneCount: 3},
         {name: '王小可', doneCount: 3}
         ],
         awardId: '124',
         flag: true
         },
         {
         studentList: [{name: '王小可', doneCount: 3, awardId: '124'},
         {name: '王小可', doneCount: 3},
         {name: '王小可', doneCount: 3},
         {name: '王小可', doneCount: 3},
         {name: '王小可', doneCount: 3}
         ],
         awardId: '125',
         flag: true
         },
         {
         studentList: [{name: '王小可', doneCount: 3, awardId: '124'},
         {name: '王小可', doneCount: 3},
         {name: '王小可', doneCount: 3}
         ],
         awardId: '126',
         flag: false
         }
         ];*/
        this.stuDoneTaskList.length = 0;
        /*if(this.getStateService().params.fromUrl)
            this.fromUrl = this.getStateService().params.fromUrl;*/
    }

    onAfterEnterView() {
        this.initData();
        this.getTaskDetail();
    }
    doRefresh(){
        if(this.freshType==2) return;
        this.freshType=2;
        this.initData();
        this.getTaskDetail();
        this.getScope().$broadcast('scroll.refreshComplete');
    }
    onBeforeEnterView() {
    }

    getTaskDetail() {
        if (this.taskType == 1) {
            this.getCreateClassTaskDetail();//创建班级,邀请学生
        } else if (this.taskType == 2) {
            this.getInviteTeacherTaskDetail();//邀请老师
        } else if (this.taskType == 3) {
            this.getPublishWorkTaskDetail();//发布作业
        } else if (this.taskType == 4) {
            this.getPublishGameTaskDetail();//发布游戏
        } else if (this.taskType == 5) {
            this.getTeacherTeachTaskDetail();//教学时效
        }
    }

    setRuleData(str, dataArr) {
        let replaceArr = str.match(/\${\%d}/g);
        angular.forEach(replaceArr, (v, k)=> {
            if (!!dataArr[k]) {
                str = str.replace(/\${\%d}/, dataArr[k]);
            }
        });
        return str;
    }

    /**
     * 查看明细——邀请学生加入班级：
     */
    getCreateClassTaskDetail() {
        this.creditsStoreService.getCreateClassTaskProgress().then((data)=> {
            this.freshType=1;//表示刷新完成
            if (data && data.code == 200) {
                this.taskInfo.classInfo = data.result.classInfo;
                this.taskInfo.awardId = data.result.awardId;
                this.taskInfo.canAward=data.result.canAward;
                this.taskInfo.credits = data.result.awardCredits;
                this.taskInfo.studentCount = data.result.studentCount;
                this.taskInfo.stepOneDesc = ['邀请' + this.taskInfo.studentCount + '名学生'];
                angular.forEach(this.taskInfo.classInfo, (v, k)=> {
                    this.taskInfo.stepOneDesc.push(v.className + '，' + '班级号：' + v.classId + '，已加入' + v.count + '名新注册学生');
                });
                this.taskInfo.stepTwoDesc = '学生人数满' + this.taskInfo.studentCount + '人，领取' + this.taskInfo.credits + '<img class="mark-img" src="'+this.markUrl+'">';
                //'1.班级在${%d}之后创建，在班级群里邀请${%d}名或以上未加入过其他班级的新学生加入班级。',
                this.taskInfo.rules[0] = this.setRuleData(this.taskInfo.rules[0], [data.result.enableTime.split(" ")[0], this.taskInfo.studentCount]);
                //'2.老师的所有班级中有1个班级满${%d}名新学生即视为完成任务，即可获得${%d}智慧币，此任务一个账号一学年只可领取一次，智慧币可以前往智慧勾商城兑换物品。',
                this.taskInfo.rules[1] = this.setRuleData(this.taskInfo.rules[1], [this.taskInfo.studentCount, this.taskInfo.credits]);
                this.taskInfo.title='有1个班级满' + this.taskInfo.studentCount + '名新注册学生<br/>领取' + this.taskInfo.credits + '<img src="'+this.markUrl+'">';
            }
        });

    }

    /***
     * 查看明细——邀请老师
     */
    getInviteTeacherTaskDetail() {
        this.showArrow=false;
        this.taskInfo.title='邀请新老师，ta的班级满20名新学生<br/>领取1000'+'<img src="'+this.markUrl+'">'+'+<span class="red-text">抽iPhone X</span>';
        this.creditsStoreService.getInviteTeacherTaskProgress().then((data)=> {
            this.freshType=1;//表示刷新完成
            if (data && data.code == 200) {
                this.taskInfo.credits = data.result.myCredits;
                this.taskInfo.invitList = data.result.details;
                this.taskInfo.studentCount = data.result.studentCount;
                this.taskInfo.myCredits = data.result.myCredits;
                this.taskInfo.canAward=false;
                this.taskInfo.recommendedCredits = data.result.recommendedCredits;
                //'3.新老师成功注册且有一个班级加入${%d}名新学生后，ta将获得${%d}智慧币，同时您将获得${%d}智慧币，智慧币可在智慧勾商城兑换物品。',
                let paramArr = [this.taskInfo.studentCount, this.taskInfo.recommendedCredits, this.taskInfo.myCredits];
                this.taskInfo.rules[2] = this.setRuleData(this.taskInfo.rules[2], paramArr);
                //控制上划显示
                this.$timeout(()=>{
                    if(jQuery(".progress-table-container").height()>300){
                        this.showArrow=true;
                    }
                },300)
            }
            // this.taskInfo.invitList = this.invitList;//TODO 删除测试数据
        })

    }

    /***
     * 查看明细——布置作业
     */
    getPublishWorkTaskDetail() {
        this.taskInfo.title='每周布置3套作业且提交率≥80%<br/>领100'+'<img src="'+this.markUrl+'">';
        this.creditsStoreService.getPublishWorkTaskProgress().then((data)=> {
            this.freshType=1;//表示刷新完成
            if (data && data.code == 200) {
                this.taskInfo.credits = data.result.credits;
                this.taskInfo.assignCount = data.result.assignCount;
                this.taskInfo.finishCount = data.result.finishCount;
                this.taskInfo.targetCount = data.result.targetCount;
                this.taskInfo.awardId = data.result.awardId;
                this.taskInfo.canAward=data.result.canAward;
                this.taskInfo.stepOneDesc = [
                    '给人数≥20的班级布置作业：' + this.taskInfo.assignCount + '套'
                ];
                this.taskInfo.stepMarkDesc="作业提交率≥80%："+this.taskInfo.finishCount+"套";
                this.taskInfo.stepTwoDesc = '领100'+ '<img  class="mark-img" src="'+this.markUrl+'">';
                // '1.您在本周日之前，给人数≥20的班级布置3套或以上作业。',
                //'2.在本周日之前，有3套或以上作业的提交率≥80%，视为本周作业任务完成，即可领取100智慧币。',
                let paramArr1 = [20, this.taskInfo.targetCount];
                let paramArr2 = [this.taskInfo.targetCount,'80%',100];
                this.taskInfo.rules[0] = this.setRuleData(this.taskInfo.rules[0], paramArr1);
                this.taskInfo.rules[1] = this.setRuleData(this.taskInfo.rules[1], paramArr2);
            }
        })
    }

    /***
     * 查看明细——游戏作业
     */
    getPublishGameTaskDetail() {
        this.creditsStoreService.getPublishGameTaskProgress().then((data)=> {
            this.freshType=1;//表示刷新完成
            if (data && data.code == 200) {
                this.taskInfo.credits = data.result.credits;
                this.taskInfo.assignCount = data.result.assignCount;
                this.taskInfo.finishCount = data.result.finishCount;
                this.taskInfo.targetCount = data.result.targetCount;
                this.taskInfo.awardId = data.result.awardId;
                this.taskInfo.canAward=data.result.canAward;
                this.taskInfo.stepOneDesc = [
                    '给人数≥20的班级布置游戏：' + this.taskInfo.assignCount + '个'
                ];
                this.taskInfo.stepMarkDesc="游戏提交率≥80%："+this.taskInfo.finishCount+"个"
                this.taskInfo.stepTwoDesc = '领100'+ '<img  class="mark-img" src="'+this.markUrl+'">';
                //'1.老师在本周日之前布置了${%d}个或以上游戏，游戏需要布置给超过${%d}名的学生，且学生在本周日之前${%d}个或${%d}个以上的游戏提交率达到${%d}，即可领取智慧币。',
                /*let paramArr = [this.taskInfo.targetCount, 20, this.taskInfo.targetCount, this.taskInfo.targetCount, '80%'];
                this.taskInfo.rules[0] = this.setRuleData(this.taskInfo.rules[0], paramArr);*/
                this.taskInfo.title='每周布置' + this.taskInfo.targetCount + '个游戏且提交率≥80%<br />领100'+'<img src="'+this.markUrl+'">';
            }
        })
    }

    /***
     * 查看明细——教学实效奖
     */
    getTeacherTeachTaskDetail() {
        this.showArrow=false;
        this.stuDoneTaskList.length = 0;
        this.taskInfo.title='教学实效奖：每5个学生完成考点任务<br />领<span class="red-text">10000</span>'+'<img src="'+this.markUrl+'">'+'（¥100），可重复领！';
        this.creditsStoreService.getTeacherTeachTaskProgress().then((data)=> {
            this.freshType=1;//表示刷新完成
            if (data && data.code == 200) {
                let unAward = data.result.unAward || [];//可领取而未领取的
                let award = data.result.award || [];//可领取并已领取的
                let unFinish = data.result.unFinish || [];//不可领取并的
                this.taskInfo.canAward=false;
                // this.stuDoneTaskList.push(unAward, award, unFinish);//push用法有误
                unAward.map(x=>{
                    x.type="unAward";
                    return x;
                })
                award.map(x=>{
                    x.type="award";
                    return x;
                })
                unFinish.map(x=>{
                    x.type="unFinish";
                    return x;
                })
                this.stuDoneTaskList=this.stuDoneTaskList.concat(unAward).concat(award).concat(unFinish)
                let paramArr = [data.result.enableTime.split(" ")[0]];
                this.taskInfo.rules[0] = this.setRuleData(this.taskInfo.rules[0], paramArr);
                //控制上划显示
                this.$timeout(()=>{
                    if(jQuery(".progress-table-container").height()>300){
                        this.showArrow=true;
                    }
                },300)
            }
        })
    }

    back() {
        // this.go('credits_store_task');//反复切换有bug
        /*if (this.fromUrl) {
            this.$ionicHistory.goBack(-2);//商城过来的返回2个视图
        } else {
            this.$ionicHistory.goBack();
        }*/
        if(this.getRootScope().getTeacherRewardFlag==true){
            this.getRootScope().getTeacherRewardFlag=false;
        }else if(this.$ionicHistory.backView()!==null){
            this.$ionicHistory.goBack()
        }else{
            if (this.$stateParams.fromUrl === 'home.me') {
                this.go('home.me')
            } else {
                this.go('home.work_list');
            }
        }
    }

    getReward(id) {
        this.rewardInfo.rewardList = ['恭喜您完成了'+this.taskInfo.taskDes+'的任务！'];
        this.rewardInfo.gotReward = this.taskInfo.credits;
        this.rewardInfo.awardId = id||this.taskInfo.awardId;
        this.getRootScope().getTeacherRewardFlag = true;
    }

    gotoDiagnose() {
        this.go('home.diagnose');
    }

    gotoDoTask() {
        // this.taskInfo.taskType = 5;//TODO 删除测试数据
        if (this.taskInfo.taskType == 1) {
            this.go('home.clazz_manage');

        } else if (this.taskInfo.taskType == 2) {
            this.go('home.me', {inviteFlag: 'yes'});

        } else if (this.taskInfo.taskType == 3) {
            this.go('pub_work_type');

        } else if (this.taskInfo.taskType == 4) {
            this.go('home.pub_game_list');
        } else if (this.taskInfo.taskType == 5) {
            // this.go('home.pub_game_list');
            this.sendMsgTostu();
        }
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
                        this.diagnoseService.shareImage(shareImg, this, '提醒学生和家长', '各位学生和家长：');
                        this.$timeout.cancel(this.alertTimer);
                    }, 1000);
                }
            });
    }
}

export default taskProgressCtrl;