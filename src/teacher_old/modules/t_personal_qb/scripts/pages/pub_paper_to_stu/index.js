/**
 * Created by ZL on 2018/3/22.
 */
import qqIcon from "./../../../../t_boot/tImages/qq.ico";
import weChatIcon from "./../../../../t_boot/tImages/wechat.ico";
import {Inject, View, Directive, select} from '../../module';
import * as _ from 'underscore';

@View('pub_paper_to_stu', {
    url: '/pub_paper_to_stu',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject: ['$scope'
        , '$ngRedux'
        , '$state'
        , '$log'
        , '$ionicHistory'
        , '$ionicPopup'
        , '$ionicModal'
        , 'finalData'
        , 'commonService'
        , 'workManageService'
        , '$ionicActionSheet'
        , '$rootScope'
        , 'personalQBService']
})

class pubPaperToStuCtrl {
    $ionicHistory;
    $ionicPopup;
    $ionicModal;
    finalData;
    commonService;
    workManageService;
    $ionicActionSheet;
    personalQBService;

    @select(state=>state.profile_user_auth.user.name) teacherName;
    @select(state=>state.temp_make_paper.paperName) paperName;
    @select(state=>state.wl_selected_clazz.gradeName) selectedClazzGradeName;
    @select(state=>state.temp_make_paper.paperId) bookMarkId;
    @select(state => state.profile_user_auth.user.userId) userId;

    isPubWorkSuccess = false; //发布作业成功后为True,用于决定是否显示分享按钮
    formData = {};
    clazzList = [];
    assignee = []; //发布对象
    startDateTime = {};
    pubPaperSucceedFlag = false;
    pubBtnDisabled = false;//发布按钮是否可以点击。
    isWin = this.commonService.judgeSYS() === 3;
    isIos = this.commonService.judgeSYS() === 2;
    isAndroid = this.commonService.judgeSYS() === 1;
    initCtrl = false;

    initData() {
        this.thisPaperName = this.paperName;
    }

    onAfterEnterView() {
        this.initData();
    }

    onBeforeLeaveView() {
        this.initCtrl = false;
    }

    configDataPipe() {
        this.dataPipe
            .when(()=>!this.initCtrl)
            .then(()=> this.initCtrl = true)
            .then(()=> {
                this.workManageService.getPubClazzList().then((data)=> {
                    if (!data || !data.length) {
                        return
                    }
                    //过滤发布班级列表，只需要和当前作业所选中的班级同年级。后台暂时没有提供grade，只能根据名称匹配。
                    angular.forEach(data, (item) => {
                        if (item.className.indexOf(this.selectedClazzGradeName) > -1 && item.type == 100) this.clazzList.push(item);
                    });

                });
            })
    }

    checkSetTimeAndCurrentTime(time) {
        return Number(new Date(time.year + '-' + time.mouth + '-' + time.date + ' ' + time.hour + ':' + time.minutes).getTime()) >= Number(new Date().getTime()) + 60;
    }

    minTimeSet() {
        if (this.isWin) return;
        let startTime = $scope.formData.startTime;
        if (!startTime) return;
        if (new Date(startTime).getTime() <= new Date().getTime()) {
            this.commonService.alertDialog("不符合预发布时间，已默认为“立即布置”", 2000);
        }
    }

    showDateTime() {
        let timer = new Date().getTime();
        if (this.isWin) {
            let timeStr = this.getDateTime();
            if (timeStr) timer = new Date(timeStr).getTime()
        } else {
            let startTime = this.formData.startTime;
            timer = new Date(startTime).getTime();
        }
        let showStr = '';
        if (!this.formData.startTime || this.formData.startTime && timer <= new Date().getTime()) {
            showStr = '立即布置'
        }
        return showStr;
    }

    getCurrentDateTimeStr() {
        let d = new Date();
        let splitStr = '-';
        if (this.isIos) {
            splitStr = '/'
        }
        return d.getFullYear()
        + splitStr + (d.getMonth() + 1) > 9 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1)
        + splitStr + d.getDate() > 9 ? d.getDate() : '0' + d.getDate()
        + " " + d.getHours() > 9 ? d.getHours() : '0' + d.getHours()
        + ":" + d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes();
    }

    getDateTime() {
        if (!this.startDateTime || this.startDateTime && !this.startDateTime.year) return '';
        return this.startDateTime.year
            + '-' + this.startDateTime.mouth
            + '-' + this.startDateTime.date
            + " " + this.startDateTime.hour
            + ":" + this.startDateTime.minutes;
    }

    showShareMenu() {
        let teacherName = this.teacherName;
        let paperName = this.thisPaperName;
        let shareContent = `${teacherName}老师在智算365已布置了作业"${paperName}"，抓紧去完成吧！`;
        this.$ionicActionSheet.show({
            buttons: [
                {text: `<img class="weChat-share-img" src="${weChatIcon}">通知到微信`},
                {text: `<img class="qq-share-img" src="${qqIcon}">通知到QQ`}
            ],
            titleText: `<div>
                    <div class="share-title">通知内容：</div>
                        <div class="share-content">${shareContent}</div>
                    </div>`,
            cancelText: '取消',
            buttonClicked: (index)=> {
                if (index == 1) {//点击分享到QQ
                    QQ.setOptions({
                        appId: '1105576253',
                        appName: 'XiaoGou',
                        appKey: 'IaDN9O8abL0FJ6gT'
                    });
                    QQ.share(shareContent,
                        '智算365通知',
                        'http://xuexiv.com/img/icon.png',
                        this.finalData.GONG_ZHONG_HAO_QRIMG_URL,
                        () => {
                            this.commonService.showAlert("提示", "通知成功！");
                        }, (err) => {
                            this.commonService.showAlert("提示", err);
                        });
                }
                if (index == 0) {//点击分享到微信
                    if (!this.getRootScope().weChatInstalled) {
                        this.commonService.showAlert("提示", "没有安装微信！");
                        return;
                    }
                    Wechat.share({
                        scene: Wechat.Scene.SESSION,  // 分享到朋友或群
                        message: {
                            title: "智算365",
                            description: shareContent,
                            thumb: "http://xuexiv.com/img/icon.png",
                            mediaTagName: "TEST-TAG-001",
                            messageExt: "这个字段没有用",
                            messageAction: "<action>dotalist</action>",
                            media: {
                                type: Wechat.Type.WEBPAGE,
                                webpageUrl: this.finalData.GONG_ZHONG_HAO_QRIMG_URL
                            }
                        },
                    }, ()=> {
                        this.commonService.showAlert("提示", "通知成功！");
                    }, (reason)=> {
                        this.commonService.showAlert("提示", reason);
                    });
                }

                return true;
            }
        });
    }

    selectAll(clazz) { //点击全班
        if (!clazz.isClicked) {
            return;
        }
        if (!clazz.studentCount) {
            this.commonService.alertDialog("该班还没有学生.", 1500);
            clazz.isClicked = false;
            return;
        }
        for (var level in clazz.levelClick) {
            clazz.levelClick[level].isClicked = false;
        }
    };

    selectLevel(index) { //点击层次
        this.clazzList[index].isClicked = false;
    };

    handleClazzPubStatus(assigneeArray, status) {
        angular.forEach(assigneeArray, (groupInfo) => {
            for (let i = 0; i < this.clazzList.length; i++) {
                if (this.clazzList[i].id === groupInfo.groupId) {
                    if (status.CODE === this.finalData.PUB_CLAZZ_STATUS.SUCCESS.CODE) {
                        if (this.clazzList[i].isClicked) {
                            this.clazzList[i].hasPubed = true;
                            this.clazzList[i].isClicked = false;
                            this.clazzList[i].hasPubedSuccess = true;
                            this.clazzList[i].code = status.CODE;
                            this.clazzList[i].msg = status.MSG;
                        }
                        angular.forEach(this.clazzList[i].levels, (level, index) => {
                            if (this.clazzList[i].levelClick[index].isClicked) {
                                this.clazzList[i].levelClick[index].isClicked = false;
                                this.clazzList[i].levelClick[index].hasPubedSuccess = true;
                                this.clazzList[i].levelClick[index].hasPubed = true;
                                this.clazzList[i].levelClick[index].code = status.CODE;
                                this.clazzList[i].levelClick[index].msg = status.MSG;
                            }
                        })
                    } else {
                        if (this.clazzList[i].isClicked) {
                            this.clazzList[i].hasPubed = true;
                        }
                        if (!this.clazzList[i].hasPubedSuccess) {
                            this.clazzList[i].code = status.CODE;
                            this.clazzList[i].msg = status.MSG;
                        }
                        angular.forEach(this.clazzList[i].levels, (level, index) => {
                            if (this.clazzList[i].levelClick[index].isClicked) {
                                this.clazzList[i].levelClick[index].hasPubed = true;
                                this.clazzList[i].levelClick[index].code = status.CODE;
                                this.clazzList[i].levelClick[index].msg = status.MSG;
                            }
                        })
                    }
                    break;
                }
            }
        });
    };

    handlePubWork(param) {
        let groupInfo = this.assignee[this.groupIndex];
        let assigneeArray = [];
        assigneeArray.push(groupInfo);
        let postParams = angular.copy(param);
        let handleSubMit = () => {
            if (this.groupIndex === this.assignee.length - 1)
                this.pubBtnDisabled = false;
            else {
                this.groupIndex++;
                this.handlePubWork(param);
            }
        };
        postParams.assignee = JSON.stringify(assigneeArray);

        this.workManageService.pubWork(postParams).then((data) => {
            if (data.code === 200) {
                this.isPubWorkSuccess = true;
                this.pubPaperSucceedFlag = true;
                this.personalQBService.clearTempMackPaper();
                let clazzPubCode = data[assigneeArray[0].groupId];
                let status = clazzPubCode === 200 ? this.finalData.PUB_CLAZZ_STATUS.SUCCESS : this.finalData.PUB_CLAZZ_STATUS.FAIL;
                this.handleClazzPubStatus(assigneeArray, status);
            } else {
                this.handleClazzPubStatus(assigneeArray, this.finalData.PUB_CLAZZ_STATUS.FAIL);
                this.commonService.alertDialog(data.msg, 2000);
            }
            handleSubMit();
        }, (res) => {
            this.handleClazzPubStatus(assigneeArray, this.finalData.PUB_CLAZZ_STATUS.FAIL);
            handleSubMit();
        });
    };

    pubStartTime() {
        if (!this.validateForm()) {//表单校验不正确
            return;
        }
        let d = this.formData.startTime || new Date();
        let pubStartTime = '' + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + " " + d.getHours() + ":" + d.getMinutes();
        if (this.commonService.judgeSYS() === 3) {
            let st = this.getDateTime();
            if (st) {
                pubStartTime = st;
                this.handleConfirmBtnClick(pubStartTime)
            }
        } else {
            this.handleConfirmBtnClick(pubStartTime)
        }

        /* let params = {};
         params.uId = this.userId;
         // params.tagId = this.allSelectQues[this.allSelectQues.length - 1].tagId;
         params.paperName = this.paperName;
         let qIds = [];
         angular.forEach(this.periodQuestionMapItems, (v, k)=> {
         angular.forEach(this.periodQuestionMapItems[k].questions, (v1, k1) => {
         qIds.push(v1.integrateQuestionItem.id);
         });
         });
         params.qIds = JSON.stringify(qIds);
         this.oralAssemblePaperService.composePaper(params).then((data, msg) => {
         if (data) {
         // this.goToPub();
         this.handleConfirmBtnClick(pubStartTime);
         } else {
         this.commonService.showAlert('警告', msg || '组卷失败');
         }
         });*/
    };

    handleConfirmBtnClick(pubStartTime) {       //发布作业
        var param = {
            bookMarkId: this.bookMarkId,
            publishType: this.finalData.WORK_TYPE.TEACHER_PERSONAL_QB, //TODO 确认类型
            paperName: this.paperName,
            startTime: pubStartTime + ':00',
            endTime: this.formData.endTime + ':00',
        };

        param.bookMarkId = this.bookMarkId;
        param.paperName = this.paperName;

        if (!this.formData.startTime && !this.startDateTime
            || !this.formData.startTime && this.startDateTime && !this.startDateTime.year)
            delete param.startTime;
        let selectCurrentTime = param.startTime.replace(/\-/g, '/');
        if (param.startTime && new Date(selectCurrentTime).getTime() <= new Date().getTime())
            delete param.startTime;
        if (!this.formData.endTime) delete param.endTime;

        var title = '信息提示';
        var info = '是否要布置？';
        this.commonService.showConfirm(title, info).then((res)=> {
            if (res) {
                this.groupIndex = 0;
                this.pubBtnDisabled = true;
                this.handleClazzPubStatus(this.assignee, this.finalData.PUB_CLAZZ_STATUS.PROCESSING);
                this.handlePubWork(param);
            }
        });
    };

    /**
     * 校验表单
     */
    validateForm() {
        this.assignee.length = 0;
        this.clazzList.forEach((clazz)=> {
            var lev = [];
            var data = {};
            if (clazz.isClicked) {        //如果选择全班
                data.groupId = clazz.id;
                this.assignee.push(data);
            } else {                  //如果选择部分
                for (var level in clazz.levelClick) {
                    if (clazz.levelClick[level].isClicked) {
                        lev.push(level);
                    }
                }
                if (lev.length) {
                    data.groupId = clazz.id,
                        data.levels = lev.join(',');
                    this.assignee.push(data);
                }
            }
        });
        if (!this.assignee.length) {
            this.commonService.alertDialog("至少选择一个布置对象!", 1500);
            return false;
        }
        return true;
    }

    /**
     * 返回
     */
    back() {
        if (this.pubPaperSucceedFlag) this.go('pub_work_type');
        else this.go('pub_to_stu_preview');
    };

    isShowIosShare() {
        return this.commonService.judgeAppVersion();
    };

    showSelectDateTimeDiagnose() {
        if (this.commonService.judgeSYS() === 3) {
            this.getRootScope().selectDateTimeFlag = true;
        }
    }
}

export default pubPaperToStuCtrl;