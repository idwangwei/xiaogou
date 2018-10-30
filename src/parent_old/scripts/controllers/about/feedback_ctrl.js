/**
 * Created by PJL on 2016/3/07.
 */
import  $ from 'jquery';
window.$ = $;
import  controllers from './../index';
import  modalTemplate from 'partials/feedback_confirm.html';
class FeedbackCtrl {
    constructor($scope, $rootScope, $state,$ionicModal,$timeout, $log, commonService, uuid4, serverInterface) {
        "ngInject";
        this.uuid4 = uuid4;
        this.$root = $rootScope;
        this.$scope = $scope;
        this.$state = $state;
        this.$ionicModal=$ionicModal;
        this.$timeout=$timeout;
        this.modal = null;
        this.commonService = commonService;
        this.platform = $rootScope.platform;
        this.platformType = '';
        this.imageList = [];
        this.serverInterface = serverInterface;
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
        this.feedback = localStorage.feedbackSuggestion || '';

        var feedBckTipImgWidth=507;//feeadBckTip.jpg的宽度
        var feedBackConfirmMaxWidth=700;//feeadBckTip.jpg的宽度
        //var feeadBckTipImgHeight=507;//feedBackConfirm.jpg的宽度
        if(window.innerWidth>feedBckTipImgWidth){
            var changeImgBoxWidth=feedBckTipImgWidth;
            //var changeImgBoxHeight=this.changeImgBoxWidth*0.8;
            this.changeImgWidthFLag=true;
            $('.center-img-box').width(changeImgBoxWidth);
        }

        if (this.platform.IS_ANDROID || this.platform.IS_IPHONE || this.platform.IS_IPAD) {
            this.platformType = this.PLATFORM_TYPES.MOBILE;
          /*  if (!navigator.camera){
                $log.error('camera API is not supported!');
            }else {
                this.pictureSource = navigator.camera.PictureSourceType;
                this.destinationType = navigator.camera.DestinationType;
            }*/

            try {
                this.pictureSource = navigator.camera.PictureSourceType;
                this.destinationType = navigator.camera.DestinationType;
            }catch (e){
                $log.error('camera API is not supported!');
            }


        } else {
            this.platformType = this.PLATFORM_TYPES.PC;
        }

        var me = this;
        $('#' + this.CLASS_NAME.BROWSE_FILE).on('change', function (ev) {
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
            if (!allValid)
                return me.commonService.showAlert('提示', '请选择正确的文件格式！');


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
                    me.$scope.$apply(function () {
                        me.imageList.push(image);
                        me.displayImageList = me.commonService.getRowColArray(me.imageList, 2);
                    });
                    //ev.currentTarget.result;
                };
                fileReader.readAsDataURL(file);
            });
        })
        /*返回注册*/
        this.$root.viewGoBack=this.back.bind(this);
    }

    browsePhoto() {
        var me = this;
        if (this.platformType == this.PLATFORM_TYPES.MOBILE && navigator.camera) {
            navigator.camera.getPicture(function (imageData) {
                    me.$scope.$apply(function () {
                        var image = {};
                        image.id = me.uuid4.generate();
                        image.src = "data:image/jpeg;base64," + imageData;
                        image.data = imageData;
                        me.imageList.push(image);
                        me.displayImageList = me.commonService.getRowColArray(me.imageList, 2);
                    });
                }, function () {

                },
                {
                    quality: 50,
                    destinationType: this.destinationType.DATA_URL,
                    sourceType: this.pictureSource.PHOTOLIBRARY
                });
        }
    }

    deleteImg(imgId) {
        var me = this;
        var index = null;
        this.imageList.forEach(function (img, idx) {
            if (imgId == img.id)index = idx;
        });
        if (index !== null) {
            me.imageList.splice(index, index + 1);
            me.displayImageList = me.commonService.getRowColArray(me.imageList, 2);
        }
    }

    showModal() {
        this.modal = this.$ionicModal.fromTemplate(modalTemplate, {scope: this.$scope});
        this.modal.show();
        $('.feedback-confirm').height(window.innerHeight-44*2);
        if(window.innerWidth>700){
            $('#imgBoxConfirm').width(700);
        }
        this.$timeout(function(){
            $('.modal-backdrop').removeClass('active'); //hack 报错黑色背景 bug
        },200);
    }

    hideModal() {
        this.modal.hide();
    }
    confirmed (){
        localStorage.feedbackSuggestion = "";

        this.modal.hide();
        this.$state.go('home.person_index');
    }

    sendFeedback() {
        var me = this;
        if (!me.feedback || me.feedback == '') {
            me.commonService.showAlert('提示', '<p>' + me.VALIDATE_PARAM + '</p>');
            return;
        }
        this.commonService.showConfirm("提示", "<p>确定要提交吗？</p>").then(function (yes) {
            if (yes) {
                me.submitFlag = true;
                var imgs = [];
                me.imageList.forEach(function (item) {
                    imgs.push({base64: item.data, type: 'jpeg'});
                });
                me.commonService.commonPost(me.serverInterface.POST_FEEDBACK, {

                    imgs: JSON.stringify(imgs),
                    user:JSON.stringify({
                        id: me.$root.user.userId,
                        name: me.$root.user.name,
                        role: 'P'
                    }),
                    suggestion: me.feedback
                }).then(function (data) {
                    if (data.code == 200) {
                        me.showModal();
                    }
                })
            }
        });

    }

    saveSuggestionAndReturn(){
        localStorage.feedbackSuggestion = this.feedback;
    }
    back(){
        this.saveSuggestionAndReturn();
        this.$state.go("home.person_index");
    }
}
FeedbackCtrl.$inject=["$scope", "$rootScope", "$state", "$ionicModal","$timeout","$log", "commonService", "uuid4", "serverInterface"];
controllers.controller('feedbackCtrl', FeedbackCtrl);

