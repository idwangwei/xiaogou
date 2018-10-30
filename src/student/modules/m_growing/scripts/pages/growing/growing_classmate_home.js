/**
 * Created by WangLu on 2017/1/6.
 */
import controllers from './../index';
import BaseController from 'base_components/base_ctrl';

class GrowingClassmateHome extends BaseController {
    constructor() {
        super(arguments);
    }

    initFlags() {
        this.retFlag = true;
    }

    initData() {
        this.classmate = {};
        this.classmate.userGender = this.$stateParams.gender;
        this.classmateHead = this.growingService.getHeadImg( this.$stateParams.headId);
        //this.classmateHead = this.classmate.userGender == 0 ? this.getRootScope().loadImg('growing/head-girl.png'):this.getRootScope().loadImg('growing/head-girl.png');
        this.selectedImpeachReason = {};
        this.retFlag = true;

    }

    back(){
        this.go('growing_classmate_list');
    }

    onAfterEnterView() {
        this.$ionicScrollDelegate.scrollTop();
        this.isShowHeadTipFlag = false;
        this.getListFlag = false;
        this.showNameCount = this.growingService.showNameCount;
        this.retFlag = true;
        this.classmateType = this.growingService.actionType.classmate;
        this.getClassmateAllRecords();
    }

    onBeforeLeaveView(){
        this.growingService.recordCancelRequestList.forEach(cancelDefer => {
            cancelDefer.resolve(true);
        });
        this.growingService.recordCancelRequestList = [];
    }

    mapStateToThis(state) {
        return {
            authId: state.profile_user_auth.user.userId,
            authName: state.profile_user_auth.user.name,
            impeachReasons:state.growing_impeach_reason.reasonList,
            impeachResidueCount:state.growing_impeach_reason.residueCount,
            recordsList:state.growing_classmate_record_list.recordList,
            //classmateHead:state.growing_classmate_record_list.headImg,
            classmate:state.growing_classmate_record_list.selectedClassmate,

        }
    }

    mapActionToThis() {
        let growingService = this.growingService;
        return {
            sendFlower: growingService.sendFlower.bind(growingService),
            cancelSendFlower: growingService.cancelSendFlower.bind(growingService),
            sendPraise: growingService.sendPraise.bind(growingService),
            cancelSendPraise: growingService.cancelSendPraise.bind(growingService),
            getImpeachReason: growingService.getImpeachReason.bind(growingService),
            impeachClassmate: growingService.impeachClassmate.bind(growingService),
            getClassmateRecord: growingService.getClassmateRecord.bind(growingService),
        }
    }


    /**
     * 获取同学的成长足迹
     */
    getClassmateAllRecords() {
        this.getListFlag = false;
        this.getListRestFlag = false;
        this.getClassmateRecord(this.authId, this.classmate.userId,this.classmate.userGender).then(data=> {
            this.retFlag = true;
            this.getListFlag = true;
            if (data.code != 200) {
                this.commonService.alertDialog('网络连接不畅，请稍后再试...');
            }else{
                this.getListRestFlag = true;
            }
        })
    }

    /**
     *  切换点赞或取消
     */
    toggleSendPraise(index) {
        let record = this.recordsList[index];
        if (!this.retFlag) return;
        this.retFlag = false;
        let prams = {
            userId: this.authId,
            displayDetailsId: record.displayDetailsId
        };
        let payload = {index:index,record:record};

        if (record.extendData.praise.flag) { //已经点过赞了，则取消点赞
            this.cancelSendPraise(prams,this.classmateType, payload).then(data=> {
                if (data.code == 200) {
                    this.retFlag = true;
                }else if(data.code == 299){  //分享的信息己经删除或者本来就没有此条ID
                    this.getClassmateAllRecords(); //重新获取同学列表
                    this.commonService.alertDialog("该条消息已经被删除，不能取消点赞！",1500);
                }else{
                    this.retFlag = true;
                    this.commonService.alertDialog('网络连接不畅，请稍后再试...');
                }
            });
        }
        else { //点赞
            this.sendPraise(prams,this.classmateType,payload).then(data=> {
                if (data.code == 200) {
                    this.retFlag = true;
                }else if(data.code == 299){  //分享的信息己经删除或者本来就没有此条ID
                    this.getClassmateAllRecords(); //重新获取同学列表
                    this.commonService.alertDialog("该条消息已经被删除，不能点赞！",1500);
                } else {
                    this.retFlag = true;
                    this.commonService.alertDialog('网络连接不畅，请稍后再试...');
                }
            });
        }
    }

    /**
     * 切换送花（点赞）或取消
     * @param index
     */
    toggleSendFlower(index) {
        let record = this.recordsList[index];
        if (!this.retFlag) return;
        this.retFlag = false;
        let prams = {
            userId: this.authId,
            displayDetailsId: record.displayDetailsId
        };
        let payload = {index:index,record:record};
        if (record.extendData.flower.flag) { //取消送花
            this.cancelSendFlower(prams,this.classmateType, payload).then(data=> {
                if (data.code == 200) {
                    this.retFlag = true;
                }else if(data.code == 299){  //分享的信息己经删除或者本来就没有此条ID
                    this.getClassmateAllRecords(); //重新获取同学列表
                    this.commonService.alertDialog("该条消息已经被删除，不能取消送花！",1500);
                }
                else {
                    this.retFlag = true;
                    this.commonService.alertDialog('网络连接不畅，请稍后再试...');
                }
            })
        }
        else { //送花
            this.sendFlower(prams,this.classmateType, payload).then(data=> {
                if (data.code == 200) {
                    this.retFlag = true;
                }else if(data.code == 299){  //分享的信息己经删除或者本来就没有此条ID
                    this.getClassmateAllRecords(); //重新获取同学列表
                    this.commonService.alertDialog("该条消息已经被删除，不能送花！",1500);
                } else {
                    this.retFlag = true;
                    this.commonService.alertDialog('网络连接不畅，请稍后再试...');
                }
            })
        }
    }

    /**
     * 选择举报理由
     * @param selectedReason
     */
    selectImpeachReason(selectedReason) {
        angular.forEach(this.impeachReasons, function (reason) {
            reason.selected = false;
        });
        selectedReason.selected = true;
    }

    /**
     * 举报同学
     */
    impeachPerson(index) {
        if (!this.retFlag) return;
        this.retFlag = false;
        this.getImpeachReason(this.authId).then(data=> {
            if (data.code != 200) {
                this.retFlag = true;
                this.commonService.alertDialog("网络连接不畅，请稍后再试...");
                return;
            }
            if (this.impeachResidueCount == 0) {
                this.retFlag = true;
                this.commonService.alertDialog("本月举报超过5次，不能再举报。",1000);
                return;
            }
            this.showImpeachReason(index);
        });
    }

    /**
     * 显示举报选项
     */
    showImpeachReason(index) {
        let record = this.recordsList[index];
        let template = ` <div class="growing-impeachArea">
            <div style=" text-align: center; color:red;"><p>注意：举报后将导致这条消息无法查看，每月有5次举报权限，请慎用！</p></div>
            <div ng-repeat="reason in ctrl.impeachReasons" style="border-style:none !important">
                <ion-checkbox ng-click="ctrl.selectImpeachReason(reason)" ng-model="reason.selected" >{{reason.explain}}</ion-checkbox>
            </div>
        </div>`;

        var impeachConfirm = this.$ionicPopup.show({ // 调用$ionicPopup弹出定制弹出框
            template: template,
            title: "举报！！！",
            scope: this.getScope(),
            buttons: [
                {
                    text: "<b>确定</b>",
                    type: "button-positive",
                    onTap: e => {
                        var hasSelect = false;
                        angular.forEach(this.impeachReasons, reason=> {
                            if (reason.selected){
                                this.selectedImpeachReason = reason;
                                hasSelect = true;
                            }
                        });
                        if (!hasSelect) {
                            e.preventDefault();
                            this.commonService.alertDialog("请选择举报理由！");
                            return;
                        }
                        return true;
                    }
                },
                {
                    text: "取消",
                    type: "",
                    onTap: e=> {
                        this.retFlag = true;
                        return false;
                    }
                }

            ]
        });
        impeachConfirm.then(res=> {
            if (res) {
                this.impeachClassmate({
                    userId: this.authId,
                    displayDetailsId: record.displayDetailsId, //要举报哪条记录
                    impeachCode: this.selectedImpeachReason.code//举报理由
                },index,this.classmateType).then(data=> {
                    if (data.code == 200) {
                        this.retFlag = true;
                        this.commonService.alertDialog('举报成功!');
                        return;
                    }
                    if(data.code == 299 ){  //分享的信息己经删除或者本来就没有此条ID
                        this.getClassmateAllRecords(); //重新获取同学列表
                        this.commonService.alertDialog("该条消息已经被删除，不能举报！",1500);
                        return;
                    }
                    if(data.code == 399 ){   //重复的送花、点赞、举报
                        this.retFlag = true;
                        this.commonService.alertDialog("您已经举报过该条消息,不能重复举报！",1500);
                        return;
                    }
                    this.retFlag = true;
                    this.commonService.alertDialog('网络连接不畅，请稍后再试');
                })
            }
        });
    }

    /**
     * 展开或收起
     * @param index
     */
    togglePraise(index) {
        this.recordsList[index].extendData.isPraiseNameUnfold = !this.recordsList[index].extendData.isPraiseNameUnfold;
    }

    toggleFlowerName(index) {
        this.recordsList[index].extendData.isFlowerNameUnfold = !this.recordsList[index].extendData.isFlowerNameUnfold;
    }

    getMyImgClass(record) {
        return record.extendData.imgSrcArr.length == 3 ? "displayImg3" :
            (record.extendData.imgSrcArr.length == 1 ? "displayImg1" : "displayImg2");
    }

    deleteDisplayRecordList(index){
        this.recordsList.splice(index,1); //删除该条记录
    }

    isIos(){
        return this.commonService.judgeSYS() == 2;
    }

    toggleBigPhotos(){
        this.showPhotoFlag = !this.showPhotoFlag;
    }
    reSetImgStyle(path,index) { // 等比压缩图片工具
        var proMaxWidth = window.innerWidth>600 ? 600 : window.innerWidth ;
        var proMaxHeight = window.innerHeight;
        var size = new Object();
        var image = new Image();
        image.src = path;
        let me = this;
        image.onload = ()=> {
            if (image.width > 0 && image.height > 0) {
                var ww = proMaxWidth / image.width;
                var hh = proMaxHeight / image.height;
                var rate = (ww < hh) ? ww : hh;
                if (rate <= 1) {
                    size.width = Math.ceil(image.width) * rate;
                    size.height = Math.ceil(image.height) * rate;
                } else {
                    size.width = Math.ceil(image.width);
                    size.height = Math.ceil(image.height);
                }
            }
            let top = 0;
            top = Math.ceil((proMaxHeight - size.height) / 2);
            size.top = top;
            me.photoStyleList[index] = size;
            let maxHeight = 0;
            angular.forEach(me.photoStyleList, (size)=> {
                if (!size) {
                    size = {};
                }
                maxHeight = size.height > maxHeight ? size.height : maxHeight;
            });
            angular.forEach(me.photoStyleList, (size)=> {
                size.maxHeight = maxHeight;
            });

            $("#signalImg").width(size.width);
            $("#signalImg").height(size.height);
        }
    }

    clickPhoto(record,index) {
        this.photoStyleList = [];
        this.selectedPhotoList = record.extendData.imgSrcArr;
        angular.forEach(this.selectedPhotoList, (url,i)=> {
            this.reSetImgStyle(url,i);
        });

        this.currentIndex = index;
        this.toggleBigPhotos();

        // this.resetImgHeight(index);
    }

    getScreenHeight() {
        return this.$window.innerHeight;
    }

    changeHeadTip(){
        let top = this.$ionicScrollDelegate.getScrollPosition().top; //当前页面的位置
        this.isShowHeadTipFlag = top > 120;
        this.$timeout(function () {

        }, 0);

    }
}
GrowingClassmateHome.$inject = [
    '$scope'
    , '$state'
    , '$rootScope'
    , '$stateParams'
    , 'commonService'
    , '$ngRedux'
    , '$ionicPopup'
    , '$ionicLoading'
    , 'growingService'
    ,'$ionicSlideBoxDelegate'
    , '$window'
    , '$ionicScrollDelegate'
    , '$timeout'
];

controllers.controller("growingClassmateHome", GrowingClassmateHome);