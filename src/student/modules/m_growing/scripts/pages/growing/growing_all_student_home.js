/**
 * Created by WangLu on 2017/2/15.
 */
import controllers from './../index';
import BaseController from 'base_components/base_ctrl';

class GrowingAllStudentHome extends BaseController {
    constructor() {
        super(arguments);
    }

    initFlags() {

    }

    initData() {
        this.photoStyleList = [];
        this.selectedPhotoList = [];
        this.photo_area_height=0;
        this.selectedImpeachReason = {};
        this.movePosition = this.isIos() ? 90 : 120;
    }

    onAfterEnterView() {
        this.isShowHeadTipFlag = false;
        this.hasClassFlag = true;
        this.getListFlag = false;
        this.showSignalPhoto = false;
        this.showPhotoFlag = false;
        this.retFlag = true;
        this.oneClazzType = this.growingService.actionType.onClazz;
        this.showNameCount = this.growingService.showNameCount;
        this.initPage();
    }

    onBeforeLeaveView(){
        this.growingService.classmateCancelRequestList.forEach(cancelDefer => {
            cancelDefer.resolve(true);
        });
        this.growingService.classmateCancelRequestList = [];
    }

    mapStateToThis(state) {
        return {
            userName: state.profile_user_auth.user.name,
            userGender: state.profile_user_auth.user.gender,
            userId: state.profile_user_auth.user.userId,
            recordsList: state.growing_one_clazz_record_info.recordList,
            authImg: state.growing_myself_record_list.headImg,
            updateCount: state.growing_myself_record_list.totalCount,
            selectedClazz: state.growing_one_clazz_record_info.selectedClazz,
            clazzList: state.profile_clazz.passClazzList, //班级列表
            impeachReasons:state.growing_impeach_reason.reasonList,
            impeachResidueCount:state.growing_impeach_reason.residueCount,
            hasMoreRecordFlag:state.growing_one_clazz_record_info.hasMore,
            loadMoreRecordCount : state.growing_one_clazz_record_info.seq,
        }
    }

    mapActionToThis() {
        let growingService = this.growingService;
        return {
            sendFlower: growingService.sendFlower.bind(growingService),
            cancelSendFlower: growingService.cancelSendFlower.bind(growingService),
            sendPraise: growingService.sendPraise.bind(growingService),
            cancelSendPraise: growingService.cancelSendPraise.bind(growingService),
            deleteRecord: growingService.deleteRecord.bind(growingService),
            changeDisplayClazz: growingService.changeDisplayClazz.bind(growingService),
            getCanPublishFlag: growingService.getCanPublishFlag.bind(growingService),
            getAllRecords: growingService.getAllRecords.bind(growingService),
            getImpeachReason: growingService.getImpeachReason.bind(growingService),
            impeachClassmate: growingService.impeachClassmate.bind(growingService),
        }
    }

    initPage(){
        this.$ionicScrollDelegate.scrollTop();
        if(this.clazzList.length == 0){
            this.hasClassFlag = false;
            this.getListFlag = true; //获取数据的请求完成
            this.getListRestFlag = true; //获取结果成功还是失败
            this.commonService.showAlert("温馨提示", "您还没有添加班级，赶快去家长端添加班级吧！");
            return;
        }

        if (!this.selectedClazz || (this.selectedClazz && !this.selectedClazz.id)) {
            this.changeDisplayClazz(this.clazzList[0]);
        }else{
            this.changeDisplayClazz();
        }
        //this.selectedClazz = this.selectedClazz || this.clazzList[0];

        this.getOneClazzAllRecords();
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

    loadMoreRecords(){
        if (this.loadMoreRecordCount == 1){
            this.getScope().$broadcast('scroll.infiniteScrollComplete');
        }
        if (this.loadMoreRecordCount > 1){
            this.getOneClazzAllRecords();
        }
    }

    /**
     * 获取一个班级的所有消息
     */
    getOneClazzAllRecords() {
        if(!this.retFlag) return;
        this.retFlag = false;
        this.getListFlag = false;
        this.getListRestFlag = false;
        this.getAllRecords({userId: this.userId, classId: this.selectedClazz.id}).then(data=> {
            this.getScope().$broadcast('scroll.infiniteScrollComplete');
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
            userId: this.userId,
            displayDetailsId: record.displayDetailsId
        };
        let payload = {index: index, record: record};

        if (record.extendData.praise.flag) { //已经点过赞了，则取消点赞
            this.cancelSendPraise(prams, this.oneClazzType, payload).then(data=> {
                this.retFlag = true;
                if (data.code != 200) {
                    this.commonService.alertDialog('网络连接不畅，请稍后再试...');
                }
            });
        }
        else { //点赞
            this.sendPraise(prams, this.oneClazzType, payload).then(data=> {
                this.retFlag = true;
                if (data.code != 200) {
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
            userId: this.userId,
            displayDetailsId: record.displayDetailsId
        };
        let payload = {index: index, record: record};

        if (record.extendData.flower.flag) { //取消送花
            this.cancelSendFlower(prams, this.oneClazzType, payload).then(data=> {
                this.retFlag = true;
                if (data.code != 200) {
                    this.commonService.alertDialog('网络连接不畅，请稍后再试...');
                }
            })
        }
        else { //送花
            this.sendFlower(prams, this.oneClazzType, payload).then(data=> {
                this.retFlag = true;
                if (data.code != 200) {
                    this.commonService.alertDialog('网络连接不畅，请稍后再试...');
                }
            })
        }
    }

    /**
     * 删除记录
     * @param index
     */
    deleteDisplayRecord(index) {
        if (!this.retFlag) return;
        this.retFlag = false;
        let selectConfirm = this.$ionicPopup.show({ // 调用$ionicPopup弹出定制弹出框
            template: ` <p>是否确认删除该条记录？</p> `,
            title: "提示",
            scope: this.getScope(),
            buttons: [
                {
                    text: "<b>确定</b>",
                    type: "button-positive",
                    onTap: e => {
                        let param = {
                            userId: this.userId,
                            displayDetailsId: this.recordsList[index].displayDetailsId, //要删除哪条记录
                        };
                        this.deleteRecord(param, index,this.oneClazzType).then(data=> {
                            this.retFlag = true;
                            if (data.code == 200) {
                                //this.getOneClazzAllRecords();
                                this.commonService.alertDialog('删除成功');
                            } else {
                                this.commonService.alertDialog('网络连接不畅，请稍后再试...');
                            }
                        })
                    }
                },
                {
                    text: "取消",
                    type: "",
                    onTap: e => {
                        this.retFlag = true;
                    }
                }
            ]
        });
    }

    getMyImgClass(record) {
        return record.extendData.imgSrcArr.length == 3 ? "displayImg3" :
            (record.extendData.imgSrcArr.length == 1 ? "displayImg1" : "displayImg2");
    }

    isIos() {
        return this.commonService.judgeSYS() == 2;
    }

    /**
     * 举报自己
     */
    impeachMyself() {
        this.commonService.alertDialog("不能举报自己哦！", 1000);
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
    impeachMyClassmate(index) {
        if (!this.retFlag) return;
        this.retFlag = false;
        this.getImpeachReason(this.userId).then(data=> {
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
                    userId: this.userId,
                    displayDetailsId: record.displayDetailsId, //要举报哪条记录
                    impeachCode: this.selectedImpeachReason.code//举报理由
                },index,this.oneClazzType).then(data=> {
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

    impeachPerson(record,index){
        if(record.extendData.isMySelfRecordFlag){
            this.impeachMyself();
            return;
        }
        this.impeachMyClassmate(index);
    }

    /**
     * 发布消息
     */
    gotoPubNewMsg() {
        if(!this.hasClassFlag){
            this.commonService.showAlert("温馨提示", "您还没有添加班级，赶快去家长端添加班级吧！");
            return;
        }

        if (!this.retFlag) return;
        this.retFlag = true;
        this.getCanPublishFlag().then(data=> {
            this.retFlag = true;
            if (data.code == 200) {
                this.go("growing_pub_msg");
            }
            else if (data.code == 499) { //一天之内上传太多了，禁止上传
                let template = `<div style=" text-align: center; "><p>珍惜流量，不要刷屏哦！</p><p>一天最多上传10条记录</p></div>`;
                this.commonService.showAlert("温馨提示", template);
            } else {
                this.commonService.alertDialog('网络连接不畅，请稍后再试...');
            }
        })
    }

    gotoClassList(){
        if(!this.hasClassFlag){
            this.commonService.showAlert("温馨提示", "您还没有添加班级，赶快去家长端添加班级吧！");
            return;
        }
        this.go("growing_classmate_list");
    }

    goToMySelfPage(){
        if(!this.hasClassFlag){
            this.commonService.showAlert("温馨提示", "您还没有添加班级，赶快去家长端添加班级吧！");
            return;
        }
        this.go("growing_mySelf_home");
    }

    toggleBigPhotos() {
        this.showPhotoFlag = !this.showPhotoFlag;
        //显示大图时，隐藏下方的标签
        if(this.showPhotoFlag){
            document.getElementsByName("growing")[0].style.zIndex = "6";
        }else{
            document.getElementsByName("growing")[0].style.zIndex = "3";
        }
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
                if(!size){
                    size = {};
                }
                maxHeight = size.height > maxHeight ? size.height :maxHeight;
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

        this.isShowHeadTipFlag = top > this.movePosition;
        this.$timeout(function () {
        }, 0);
    }

}
GrowingAllStudentHome.$inject = [
    '$scope'
    , '$state'
    , '$rootScope'
    , '$stateParams'
    , 'commonService'
    , '$ngRedux'
    , '$ionicPopup'
    , '$ionicLoading'
    , 'growingService'
    , '$ionicSlideBoxDelegate'
    , '$window'
    , '$ionicScrollDelegate'
    , '$timeout'
];
controllers.controller("growingAllStudentHome", GrowingAllStudentHome);