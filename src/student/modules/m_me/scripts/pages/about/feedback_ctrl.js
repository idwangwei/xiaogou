/**
 * Created by PJL on 2016/3/07.
 */
/***
 * edit by zl on 2018.1.11
 * 现在没有用这个页面，暂时放在这里，需要的时候修改
 */
import  controllers from './../index';
import  modalTemplate from 'partials/feedback_confirm.html';
import {stateGo} from './../../redux/lib/redux-ui-router/index';
import BaseController from 'base_components/base_ctrl';


class FeedbackCtrl  extends  BaseController{
    constructor($scope, $rootScope, $state, $ionicModal, $timeout, $log, commonService, uuid4, serverInterface, $ngRedux) {
        super(arguments);
        this.modal = null;
        this.platformType = '';
        this.imageList = [];
        this.feedback = '';
        this.displayImageList = [];
        this.submitFlag = false;//false代表点击过提交按钮，true代表已点击过提交按钮
        this.PLATFORM_TYPES = {
            MOBILE: 'mobile',
            PC: 'pc'
        };
        this.CLASS_NAME = {
            BROWSE_FILE: 'browseFiles' //选择文件input对应的ID
        };
        this.UPLOAD_SUCCESS_TEXT = '您的反馈已经提交，感谢您对我们的支持！';
        this.VALIDATE_PARAM = '请填写您问题描述，以及您的意见或建议！';
        this.paperDataInitialized = false;
        this.feedBckTipImgWidth = 339; // feeadBckTip.jpg的宽度
        this.changeImgWidthFLag = false; //意见反馈顶部的图片正常显示还是大屏幕显示
        this.platform = $rootScope.platform;
        this.setFeedbackTipImgWidth();
        this.setPhotoSourceUrlByPlatform($log);
        //上传的图片格式验证
        var me = this;
        $('#' + this.CLASS_NAME.BROWSE_FILE).on('change', function(ev){
            var files = [].slice.call(this.files);
            var acceptFileTypes = ['jpg', 'jpeg', 'png', 'gif']; //可接受的文件类型
            //检查文件的合法性
            var allValid = true;
            files.forEach(function (file) {
                var has = false;
                acceptFileTypes.forEach(function (fileType) {
                    if (file.type.indexOf(fileType) != -1) {
                        has = true;
                    }
                });
                if (!has) {
                    allValid = false
                }
            });
            if (!allValid) {return this.commonService.showAlert('提示', '请选择正确的文件格式！')}
            //读取文件
            files.forEach(function (file) {
                var fileReader = new FileReader(file);
                fileReader.onloadend = function (ev) {
                    var image = {};
                    image.id = me.uuid4.generate();
                    image.src = ev.currentTarget.result;
                    //image.data = imageData;
                    var info = readTypeAndBase64(image.src);
                    image.type = info.type;
                    image.data = info.content;
                    me.getScope().$apply(function () {
                        me.imageList.push(image);
                        me.displayImageList = me.commonService.getRowColArray(me.imageList, 2);
                    });
                };
                fileReader.readAsDataURL(file);
            });
            function readTypeAndBase64(data) {
                var type = '', content = '';
                data.replace(/image\/(.+?);/, function (match, $1) {
                    type = $1;
                });
                data.replace(/base64,(.+)/, function (match, $1) {
                    content = $1;
                });
                return {
                    type: type,
                    content: content
                }
            }
        });
    }
    onReceiveProps(selectedState, selectedAction){
        /*state第一次改变时执行*/
        this.$log.debug('feedback_ctrl receive props ....');
        if(this.paperDataInitialized){return}
        this.paperDataInitialized = true;
        Object.assign(this, selectedState, selectedAction); //将State的数据和action的方法挂到this上
        this.feedback = localStorage.feedbackSuggestion || '';
    }

    mapStateToThis(state) {
        return {
            userId:state.profile.user.userId,
            userName:state.profile.user.name,
            isSuggestionSubmitProcessing:false, //正在提交意见
            suggestionWord:null //意见
        }
    }
    mapActionToThis() {
        return {
            sendUserSuggestion:this.commonService.sendUserSuggestion,
            stateGo: stateGo
        }
    }
    /**
     * 根据设备分辨率设置反馈页面顶部图片的宽度
     */
    setFeedbackTipImgWidth() {
        if (window.innerWidth > this.feedBckTipImgWidth) {
            var changeImgBoxWidth = this.feedBckTipImgWidth;
            this.changeImgWidthFLag = true;
            $('.center-img-box').width(changeImgBoxWidth);
        }
    }
    /**
     * 根据设备设置图片上传信息
     * @param $log
     */
    setPhotoSourceUrlByPlatform($log){
        if (this.platform.IS_ANDROID || this.platform.IS_IPHONE || this.platform.IS_IPAD) {
            this.platformType = this.PLATFORM_TYPES.MOBILE;
            if (!navigator.camera)
                $log.error('camera API is not supported!');
            this.pictureSource = navigator.camera.PictureSourceType;
            this.destinationType = navigator.camera.DestinationType;
        } else {
            this.platformType = this.PLATFORM_TYPES.PC;
        }
    }
    browsePhoto() {
        if (this.platformType == this.PLATFORM_TYPES.MOBILE) {
            navigator.camera.getPicture(
                (imageData) => {
                    this.getScope().$apply(function () {
                        var image = {};
                        image.id = this.uuid4.generate();
                        image.src = "data:image/jpeg;base64," + imageData;
                        image.data = imageData;
                        this.imageList.pusthish(image);
                        this.displayImageList = this.commonService.getRowColArray(this.imageList, 2);
                    });
                },
                () => {},
                {
                    quality: 50,
                    destinationType: this.destinationType.DATA_URL,
                    sourceType: this.pictureSource.PHOTOLIBRARY
                }
            );
        }
    }

    deleteImg(imgId) {
        var index = null;
        this.imageList.forEach(function (img, idx) {if (imgId == img.id) {index = idx}});
        if (index !== null) {
            this.imageList.splice(index, index + 1);
            this.displayImageList = this.commonService.getRowColArray(this.imageList, 2);
        }
    }

    showModal() {
        this.modal = this.$ionicModal.fromTemplate(modalTemplate, {scope: this.getScope()});
        this.modal.show();
        $('.feedback-confirm').height(window.innerHeight - 44 * 2);
        if (window.innerWidth > 700) {
            $('#imgBoxConfirm').width(700);
        }
        this.$timeout(function () {
            $('.modal-backdrop').removeClass('active'); //hack 报错黑色背景 bug
        }, 200);
    }

    hideModal() {
        this.modal.hide();
    }

    confirmed() {
        localStorage.feedbackSuggestion = "";
        this.modal.hide();
        this.stateGo('home.me');
    }

    sendFeedback() {
        if (!this.feedback) {
            this.commonService.showAlert('提示', '<p>' + this.VALIDATE_PARAM + '</p>');
            return;
        }
        let me =this;
        this.commonService.showConfirm("提示", "<p>确定要提交吗？</p>").then((yes) => {
            var imgs = [];
            if (!yes) { return }
            this.submitFlag = true;
            this.imageList.forEach(function (item) {imgs.push({base64: item.data, type: 'jpeg'});});
            this.sendUserSuggestion(this.feedback, imgs, me.showModal.bind(me));
        });

    }

    saveSuggestionAndReturn() {
        localStorage.feedbackSuggestion = this.feedback;
    }

}
FeedbackCtrl.$inject = [
    "$scope",
    "$rootScope",
    "$state",
    "$ionicModal",
    "$timeout",
    "$log",
    "commonService",
    "uuid4",
    "serverInterface",
    "$ngRedux"
];
controllers.controller('feedbackCtrl', FeedbackCtrl);

