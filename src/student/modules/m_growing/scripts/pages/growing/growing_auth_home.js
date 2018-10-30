/**
 * Created by WangLu on 2017/1/6.
 */
import controllers from './../index';
import BaseController from 'base_components/base_ctrl';

class GrowingAuthHome extends BaseController {
    constructor() {
        super(arguments);
    }

    initFlags() {

    }

    initData() {
        this.photoStyleList = [];
        this.selectedPhotoList = [];
        this.photo_area_height=0;
        this.movePosition = this.isIos()? 90 :120;
    }

    back(){
        this.go('home.growing');
    }

    onAfterEnterView() {
        this.$ionicScrollDelegate.scrollTop();
        this.isShowHeadTipFlag = false;
        this.hasClassFlag = true;
        this.getListFlag = false;
        this.showSignalPhoto = false;
        this.showPhotoFlag = false;
        this.retFlag = true;
        this.showNameCount = this.growingService.showNameCount;
        this.authImg = this.growingService.getHeadImg(this.authImgId);
        //this.authImg = this.userGender == 0 ? this.getRootScope().loadImg('growing/head-girl.png') : this.getRootScope().loadImg('growing/head-boy.png');
        if(this.clazzList.length == 0){
            this.hasClassFlag = false;
            this.getListFlag = true; //获取数据的请求完成
            this.getListRestFlag = true; //获取结果成功还是失败
            this.commonService.showAlert("温馨提示", "您还没有添加班级，赶快去家长端添加班级吧！");
            return;
        }

        if (!this.selectedClazz || (this.selectedClazz && !this.selectedClazz.id)) {
            this.setSelectedClazz(this.clazzList[0]);
        }
        //this.selectedClazz = this.selectedClazz || this.clazzList[0];
        this.mySelfType = this.growingService.actionType.mySelf;
        this.getAuthAllRecords();

    }

    onBeforeLeaveView(){
        this.growingService.recordCancelRequestList.forEach(cancelDefer => {
            cancelDefer.resolve(true);
        });
        this.growingService.recordCancelRequestList = [];
    }

    mapStateToThis(state) {
        return {
            userName: state.profile_user_auth.user.name,
            userGender: state.profile_user_auth.user.gender,
            userId: state.profile_user_auth.user.userId,
            recordsList: state.growing_myself_record_list.recordList,
            authImgId: state.user_reward_base.avator,
            updateCount: state.growing_myself_record_list.totalCount,
            selectedClazz: state.growing_selected_clazz,
            clazzList: state.profile_clazz.passClazzList, //班级列表
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
            getAuthRecords: growingService.getAuthRecords.bind(growingService),
            setSelectedClazz: growingService.setSelectedClazz.bind(growingService),
            getCanPublishFlag: growingService.getCanPublishFlag.bind(growingService),
        }
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

    /**
     * 获取自己的消息列表
     */
    getAuthAllRecords() {
        this.getListFlag = false;
        this.getListRestFlag = false;
        this.getAuthRecords({userId: this.userId, classId: this.selectedClazz.id}).then(data=> {
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
            this.cancelSendPraise(prams, this.mySelfType, payload).then(data=> {
                this.retFlag = true;
                if (data.code != 200) {
                    this.commonService.alertDialog('网络连接不畅，请稍后再试...');
                }
            });
        }
        else { //点赞
            this.sendPraise(prams, this.mySelfType, payload).then(data=> {
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
            this.cancelSendFlower(prams, this.mySelfType, payload).then(data=> {
                this.retFlag = true;
                if (data.code != 200) {
                    this.commonService.alertDialog('网络连接不畅，请稍后再试...');
                }
            })
        }
        else { //送花
            this.sendFlower(prams, this.mySelfType, payload).then(data=> {
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
                        this.deleteRecord(param, index,this.mySelfType).then(data=> {
                            this.retFlag = true;
                            if (data.code == 200) {
                                this.getAuthAllRecords();
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

    toggleBigPhotos() {
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

    // resetImgHeight(index){
    //     this.photo_area_height=this.photoStyleList[index].height;
    //     console.log("reset height!:"+index);
    // }
    changeHeadTip(){
        let top = this.$ionicScrollDelegate.getScrollPosition().top; //当前页面的位置
        this.isShowHeadTipFlag = top > this.movePosition;
        this.$timeout(function () {

        }, 0);

    }
}
GrowingAuthHome.$inject = [
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
controllers.controller("growingAuthHome", GrowingAuthHome);