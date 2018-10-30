/**
 * Created by WangLu on 2017/1/6.
 */
import controllers from './../index';
import BaseController from 'base_components/base_ctrl';
import EXIF from 'exif-js/exif';

class GrowingPubMsg extends BaseController {
    constructor() {
        super(arguments);
        this.addChangeEvent();
    }

    initFlags() {
        this.canAddImg = true;
        this.isShowRecordLabelFlag = false;
        this.isShowRecordTypeFlag = false;
    }

    initData() {
        this.maxImgLength = 200 * 1024;
        this.CLASS_NAME = {
            BROWSE_FILE: 'uploadImg1' //选择文件input对应的ID
        };
    }

    initMyGrowingData() {
        this.hasSendMsg = false;
        this.showTypeWord = "";
        this.selectedLabel = "";
        this.selectedUpType = "";
        this.selectedStatus = ""; //选择的可见类型
        if (this.clazzList.length == 1) {
            this.selectedClazz = this.clazzList[0]; //选择的班级
        }
        this.recordExplain = ""; //文字描述
        this.formImgList = []; //发送到后端的图片列表
        this.displayImgList = []; //显示的图片列表
    }

    onAfterEnterView() {
        this.styleList = [];
        this.initMyGrowingData();
        this.getGrowingRecordType();
        this.getGrowingRecordStatus();
        this.getGrowingRecordLabel();
        this.filterIosVersion();

    }

    mapStateToThis(state) {
        let pub_msg = state.growing_get_pub_msg;
        return {
            userId: state.profile_user_auth.user.userId,
            clazzList: state.profile_clazz.passClazzList, //班级列表
            recordLabelList: pub_msg.labelList,
            recordTypeList: pub_msg.typeList,
            recordStatusList: pub_msg.statusList,
        };
    }

    mapActionToThis() {
        let growingService = this.growingService;
        return {
            getRecordType: growingService.getRecordType.bind(growingService),
            getRecordLabels: growingService.getRecordLabels.bind(growingService),
            getRecordStatus: growingService.getRecordStatus.bind(growingService),
            uploadRecord: growingService.uploadRecord.bind(growingService),
        }
    }

    onBeforeLeaveView() {
        this.clearData();
        this.displayImgList = [];
        this.formImgList = [];
        this.styleList = [];
        this.growingService.recordCancelRequestList.forEach(cancelDefer => {
            cancelDefer.resolve(true);
        });
        this.growingService.recordCancelRequestList = [];
    }

    filterIosVersion() {
        if (this.getScope().platform.IS_IPHONE || this.getScope().platform.IS_IPAD) {
            let versionFlag = this.getAppVersionFlag();
            if (versionFlag) return; //版本大于1.8.9 可以拍照
            let sysVersionStr = window.navigator.userAgent.match(/OS [\d]+_\d+[_\d+]* like Mac OS X/i)[0];
            if (!sysVersionStr) return;
            let sysVersionNum = sysVersionStr.match(/\d+/)[0];
            if (!sysVersionNum) return;
            if (sysVersionNum > 9) { //app版本低于1.8.9但是ios版本高于9的不可用拍照
                this.canAddImg = false;
            }
        }
    }

    /**
     * 获取上传类型
     */
    getGrowingRecordType() {
        this.getRecordType().then(data => {
            if (data.code != 200) {
                this.commonService.alertDialog('网络连接不畅，请稍后再试...');
            }
        })
    }

    /**
     * 获取上传标签
     */
    getGrowingRecordLabel() {
        this.getRecordLabels().then(data => {
            if (data.code != 200) {
                this.commonService.alertDialog('网络连接不畅，请稍后再试...');
            }
        });
    }

    /**
     * 获取可见类型
     */
    getGrowingRecordStatus() {
        this.getRecordStatus().then(data => {
            if (data.code != 200) {
                this.commonService.alertDialog('网络连接不畅，请稍后再试...');
                return;
            }
            this.selectStatusType(this.recordStatusList[0]);
        })
    }


    selectOneData(list, status) {
        angular.forEach(list, function (recordStatus) {
            recordStatus.selected = false;
        });
        if (status) {
            status.selected = true;
        }
    }

    /**
     * 选择可见类型
     */
    selectStatusType(status) {
        this.selectedStatus = status;
        this.selectOneData(this.recordStatusList, this.selectedStatus);
    }

    /**
     * 选择班级
     * @param clazz
     */
    selectPubClazz(clazz) {
        this.selectedClazz = clazz;
        this.selectOneData(this.clazzList, this.selectedClazz);
    }

    /**
     * 选择上传类型
     * @param upType
     */
    selectType(upType, event) {
        event.stopPropagation();
        this.selectedUpType = upType;
        this.selectOneData(this.recordTypeList, this.selectedUpType);
    }

    /**
     * 选择上传标签
     * @param upType
     */
    selectLabel(label, event) {
        this.selectedLabel = label;
        this.selectOneData(this.recordLabelList, this.selectedLabel);
        this.toggleRecordType();
    }

    /**********************图片处理***************************/
    addChangeEvent() {
        if (this.getScope().platform.isMobile()) {
            if (!navigator.camera) {
                console.error('camera API is not supported!');
                return;
            }
            this.pictureSource = navigator.camera.PictureSourceType;
            this.destinationType = navigator.camera.DestinationType;
        }

        var me = this;
        $('#' + this.CLASS_NAME.BROWSE_FILE).on('change', function (ev) {
            if (me.displayImgList.length == 3) {
                me.commonService.showAlert('提示', '最多只能上传3张照片！');
                return;
            }
            var img = ev.currentTarget;
            var files = [].slice.call(this.files);
            var acceptFileTypes = ['jpg', 'jpeg', 'png']; //可接受的文件类型

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

            /*//读取文件
             files.forEach(function (file) {
             var fileReader = new FileReader(file);
             fileReader.onloadend = function (ev) {
             let src = ev.currentTarget.result;

             EXIF.getData(file, function() {
             EXIF.getAllTags(this);
             let orientation = EXIF.getTag(this, 'Orientation'); //获取图片的方向
             console.log(orientation);
             let newSrc = me.getCorrectSrc(orientation,src);

             var image = {};
             image.id = me.uuid4.generate();
             /!* image.src = ev.currentTarget.result; *!/
             image.src = newSrc;
             var info = readTypeAndBase64(image.src);
             image.type = info.type;
             image.data = info.content;
             image.file = file;

             me.getScope().$apply(function () {
             let imgLen = me.getBase64ImgLength(image.src);
             if ( imgLen> me.maxImgLength ) {
             var nData = compress(image);
             image.src=nData;
             image.data = nData.split(",")[1];
             }
             me.displayImgList.push(image);
             me.formImgList.push(image);
             //me.resetImgStyle(me.formImgList.length-1);
             });

             });
             };
             fileReader.readAsDataURL(file);
             });
             */
            //读取文件
            files.forEach(function (file) {
                var fileReader = new FileReader(file);
                fileReader.onloadend = function (ev) {
                    let src = ev.currentTarget.result;
                    EXIF.getData(file, function () {
                        EXIF.getAllTags(this);
                        var image = {};
                        image.id = me.uuid4.generate();
                        image.src = src;
                        image.width = EXIF.getTag(this, 'ImageWidth');
                        image.height = EXIF.getTag(this, 'ImageHeight');
                        var info = readTypeAndBase64(image.src);
                        image.type = info.type;
                        image.data = info.content;
                        image.file = file;

                        me.getScope().$apply(function () {
                            compress(image);
                            /* let imgLen = me.getBase64ImgLength(image.src);
                             if ( imgLen> me.maxImgLength ) {
                             compress(image);
                             return;
                             /!*  var nData = compress(image);
                             image.src = nData;
                             image.data = nData.split(",")[1];*!/
                             }
                             me.displayImgList.push(image);
                             me.formImgList.push(image);*/
                        });
                    });
                };
                fileReader.readAsDataURL(file);
            });

            /**
             * 压缩图片
             * @param srcImg
             * @returns {string|String}
             */
            function compress(srcImg) {
                let imgLen = me.getBase64ImgLength(srcImg.src);
                var img = new Image();
                img.src = srcImg.src;

                img.onload = function () {
                    srcImg.width = this.width;
                    srcImg.height = this.height;
                    if (imgLen <= me.maxImgLength) {
                        me.displayImgList.push(srcImg);
                        me.formImgList.push(srcImg);
                        me.$timeout(function () {
                        }, 0);
                        return;
                    }
                    var width = srcImg.width;
                    var height = srcImg.height;
                    var canvas = document.getElementById("myCanvas");
                    var ctx = canvas.getContext('2d');
                    canvas.width = width;
                    canvas.height = height;

                    // 铺底色
                    ctx.fillStyle = "#fff";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, width, height);

                    //进行最小压缩
                    let ndata = canvas.toDataURL("image/jpeg", 0.2);
                    canvas.width = 0;
                    canvas.height = 0;
                    srcImg.src = ndata;
                    srcImg.data = ndata.split(",")[1];
                    me.displayImgList.push(srcImg);
                    me.formImgList.push(srcImg);
                    me.$timeout(function () {
                    }, 0);
                };
            }

            /*function compress(srcImg) {
             var initSize = srcImg.src.length;
             let initImgSize = me.getBase64ImgLength(srcImg.src);
             var img = new Image();
             img.src = srcImg.src;
             let imgRatio = 1;
             if(initImgSize > 1024 * 1024 * 10){
             imgRatio = 0.3;
             }
             else if(initImgSize > 1024 * 1024 * 4){
             imgRatio = 0.5;
             }
             var width = img.width * imgRatio;
             var height = img.height * imgRatio;
             //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
             /!*    var ratio;
             if ((ratio = width * height / 4000000)>1) {
             ratio = Math.sqrt(ratio);
             width /= ratio;
             height /= ratio;
             }else {
             ratio = 1;
             }*!/

             var canvas = document.getElementById("myCanvas");
             var ctx=canvas.getContext('2d');
             canvas.width = width;
             canvas.height = height;

             // 铺底色
             ctx.fillStyle = "#fff";
             ctx.fillRect(0, 0, canvas.width, canvas.height);
             ctx.drawImage(img, 0, 0, width, height);
             /!* //如果图片像素大于100万则使用瓦片绘制
             var count;
             if ((count = width * height / 1000000) > 1) {
             count = ~~(Math.sqrt(count)+1); //计算要分成多少块瓦片

             //            计算每块瓦片的宽和高
             var nw = ~~(width / count);
             var nh = ~~(height / count);

             tCanvas.width = nw;
             tCanvas.height = nh;

             for (var i = 0; i < count; i++) {
             for (var j = 0; j < count; j++) {
             tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);

             ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
             }
             }
             } else {
             ctx.drawImage(img, 0, 0, width, height);
             }*!/

             //进行最小压缩

             let rate = me.getImgRate(initImgSize);
             let ndata = canvas.toDataURL("image/jpeg", rate);
             let newImgLen = me.getBase64ImgLength(ndata);
             while(newImgLen>me.maxImgLength){
             rate = me.getImgRate(newImgLen,rate);
             ndata = canvas.toDataURL("image/jpeg", rate);
             newImgLen = me.getBase64ImgLength(ndata);
             }
             canvas.width = 0;
             canvas.height = 0;
             return ndata;
             }*/
        })
    }

    getImgRate(imgSize, r) {
        let rate = r || 1;
        let ratio = 0.2;
        if (imgSize > 1024 * 1024 * 5) {
            ratio = 0.1;
        } else if (imgSize > 1024 * 1024 * 2) {
            ratio = 0.2;
        } else if (imgSize > 1024 * 1024) {
            ratio = 0.25;
        } else {
            ratio = 0.1;
        }
        return rate * ratio;
    }

    /**
     * 获取base64格式图片的大小
     * @param imgData
     * @returns {Number}
     */
    getBase64ImgLength(imgData) {
        //需要计算文件流大小，首先把头部的data:image/png;base64,（注意有逗号）去掉。
        let dataStr = imgData.substring(22);
        //找到等号，把等号也去掉
        var equalIndex = dataStr.indexOf('=');
        if (dataStr.indexOf('=') > 0) {
            dataStr = dataStr.substring(0, equalIndex);
        }

        //Base64要求把每三个8Bit的字节转换为四个6Bit的字节（3*8 = 4*6 = 24），
        // 然后把6Bit再添两位高位0，组成四个8Bit的字节，也就是说，转换后的字符串理论上将要比原来的长1/3。
        let strLength = parseInt(dataStr.length * 3 / 4);
        return strLength;
    }

    browsePhoto() {
        if (!this.canAddImg) {
            this.commonService.showAlert('温馨提示', '相片上传功能暂不支持 iOS 10。我们将尽快更新提供支持。');
            return;
        }
        let me = this;
        if (this.getScope().platform.isMobile() && navigator.camera) {
            navigator.camera.getPicture(
                (imageData) => {
                    this.getScope().$apply(function () {
                        var image = {};
                        image.id = me.uuid4.generate();
                        image.src = "data:image/jpeg;base64," + imageData;
                        image.data = imageData;
                        image.loadFlag = true;
                        me.displayImgList.push(image);
                        me.formImgList.push(image);
                        //me.resetImgStyle(me.formImgList.length-1);
                    });
                },
                () => {
                },
                {
                    quality: 50,
                    destinationType: this.destinationType.DATA_URL,
                    sourceType: this.pictureSource.PHOTOLIBRARY,
                    correctOrientation: true,
                }
            );
        }
    }

    imgOnLoad(event, index) {
        let me = this;
        var file = event.currentTarget;
        let image = this.displayImgList[index];
        image.loadFlag = false;
        image.file = file;
        EXIF.getData(image.file, function () {
            let orientation = EXIF.getTag(this, 'Orientation'); //获取图片的方向
            console.log(orientation);
            image.src = me.getCorrectSrc(orientation, image.src);
            me.displayImgList[index] = image;
            me.formImgList[index] = image;
        });
    }

    deleteImg(imgId) {
        var index = null;
        this.displayImgList.forEach(function (img, idx) {
            if (imgId == img.id) {
                index = idx
            }
        });
        if (index !== null) {
            this.displayImgList.splice(index, index + 1);
            this.formImgList.splice(index, index + 1);
            this.styleList.splice(index, index + 1);
        }
    }

    proDownImage(index) { // 等比压缩图片工具
        let path = this.displayImgList[index].src;
        var proMaxHeight = 150;
        var proMaxWidth = 150;
        var size = new Object();
        var image = new Image();
        image.src = path;
        if (image.width > 0 && image.height > 0) {
            var ww = proMaxWidth / image.width;
            var hh = proMaxHeight / image.height;
            var rate = (ww < hh) ? ww : hh;
            if (rate <= 1) {
                size.width = image.width * rate;
                size.height = image.height * rate;
            } else {
                size.width = image.width;
                size.height = image.height;
            }
        }
        let imgObj = document.getElementsByName("growingShowImg")[index];
        imgObj.style.width = size.width;
        imgObj.style.height = size.height;
    }

    /**
     * 重新设置图片大小
     * @param index
     * @returns {string}
     */
    resetImgSize(index) {
        let path = this.displayImgList[index].src;
        var image = new Image();
        image.src = path;
        return image.width > image.height ? "img1" : "img2";
    }

    resetImgStyle(index) {
        let path = this.displayImgList[index].src;
        var proMaxWidth = 120;
        var proMaxHeight = 120;
        var size = new Object();
        var image = new Image();
        image.src = path;
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
        let margin_top = Math.ceil((proMaxHeight - size.height) / 2);
        let margin_left = Math.ceil((proMaxWidth - size.width));
        size.top = margin_top + "px";
        size.left = margin_left + "px";
        if (!this.getScope().platform.isMobile()) {
            size.top = 0;
            size.left = 0;
        }
        this.styleList[index] = size;
    }

    isMobile() {
        return this.getScope().platform.isMobile(); //非移动端设备不显示
    }

    /******************************上传类型************************/
    toggleRecordLabel() {
        this.selectedUpType = "";
        this.selectOneData(this.recordTypeList);
        this.isShowRecordLabelFlag = !this.isShowRecordLabelFlag;
        if (!this.isShowRecordLabelFlag && !this.isShowRecordTypeFlag) {
            this.selectedLabel = "";
            this.selectOneData(this.recordLabelList, this.selectedLabel);
        }
    };

    toggleRecordType() {
        this.isShowRecordTypeFlag = !this.isShowRecordTypeFlag;
        if (!this.isShowRecordLabelFlag && !this.isShowRecordTypeFlag && !this.selectedUpType) {
            this.selectedLabel = "";
            this.selectOneData(this.recordLabelList, this.selectedLabel);
        }
    }

    goBackToSelectLabel() {
        this.toggleRecordType();
        this.toggleRecordLabel();
    }

    /**
     * 弹出选择框
     */
    selectUploadType() {
        let template = `  <div class="growing-select-type">
            <div class="growing-select-cel" ng-repeat="recordType in ctrl.recordTypeList"
                ng-class="recordType.selected ? 'growing-select-cel-selected': ''"
                ng-click="ctrl.selectType(recordType)">
            <span>{{recordType.name}}</span>
        </div>
        </div>`;

        let selectConfirm = this.$ionicPopup.show({ // 调用$ionicPopup弹出定制弹出框
            template: template,
            title: "请选择上传类型",
            scope: this.getScope(),
            buttons: [
                {
                    text: "<b>确定</b>",
                    type: "button-positive",
                    onTap: e => {
                        if (this.selectedUpType) {
                            return true;
                        }
                        return;
                    }
                },
                {
                    text: "取消",
                    type: "",
                    onTap: function (e) {
                        this.canImpeach = true;
                        return false;
                    }
                }
            ]
        });
    }

    clearData() {
        this.selectOneData(this.recordLabelList);
        this.selectOneData(this.recordTypeList);
        this.selectOneData(this.recordStatusList);
        this.selectOneData(this.clazzList);
        this.recordExplain = "";
    }

    /**
     * 提交数据
     */
    submitData() {
        if (this.hasSendMsg) return;
        this.hasSendMsg = true;
        //this.recordExplain =  $("#explainText").val(); //图片的说明
        let wordCode = encodeURI(this.recordExplain);
        let maxLen = 1000;
        if (!this.recordExplain && this.formImgList.length == 0) {
            this.hasSendMsg = false;
            this.commonService.alertDialog("发布内容不能为空！");
            return;
        }
        if (wordCode.length > maxLen) {
            this.hasSendMsg = false;
            this.commonService.alertDialog("输入文字过多，请控制在120个字以内", 1000);
            return;
        }
        if (!this.selectedLabel) {
            this.hasSendMsg = false;
            this.commonService.alertDialog("请选择类别！");
            return;
        }
        if (!this.selectedUpType) {
            this.hasSendMsg = false;
            this.commonService.alertDialog("请选择类别！");
            return;
        }
        if (!this.selectedStatus) {
            this.hasSendMsg = false;
            this.commonService.alertDialog("请选择哪些人可见！");
            return;
        }
        if (this.clazzList.length > 1 && !this.selectedClazz) { //班级个数超过1个时必须选择上传的班级
            this.hasSendMsg = false;
            this.commonService.alertDialog("请选择上传至哪个班级！");
            return;
        }

        let imgArr = [];
        this.displayImgList.forEach(function (item) {
            imgArr.push(item.src);
        });
        let msg = {
            recordStatus: this.selectedStatus.code,
            recordType: this.selectedUpType.code,
            recordLabel: this.selectedLabel.code,
            explain: encodeURI(this.recordExplain),
            img: JSON.stringify(imgArr),
            creatorId: this.userId,
            ownerId: this.userId,
            classId: this.selectedClazz.id,
        };

        this.toast("正在发布中...");
        this.uploadRecord(msg, this.selectedClazz).then(data => {
            this.hideToast();
            if (data.code == 200) {
                this.clearData();
                this.commonService.alertDialog("发布成功");
                this.go("home.growing"); //发布成功，跳转回我的主页
                return;
            }
            else if (data.code == 7500) {
                this.hasSendMsg = false;
                this.commonService.alertDialog(data.msg);
                return;
            }
            this.hasSendMsg = false;
            this.commonService.alertDialog("网络连接不畅，请稍后重试...");
        })
    }

    /**
     * 弹出提示框
     * @param msg
     */
    toast(msg) {
        let time = 1000 * 1000000;
        if (this.getRootScope().platform.IS_IPAD || this.getRootScope().platform.IS_IPHONE) {
            this.$ionicLoading.show({
                template: msg,
                noBackdrop: true
            });
            return;
        }
        if (window.parent.plugins && window.parent.plugins.toast) {
            window.parent.plugins.toast.show(msg, time, 'top');
        } else {
            this.$ionicLoading.show({
                template: msg,
                noBackdrop: true
            });
        }
    }

    /**
     * 隐藏提示框
     */
    hideToast() {
        if (this.getRootScope().platform.IS_IPAD || this.getRootScope().platform.IS_IPHONE) {
            this.$ionicLoading.hide();
            return;
        }
        if (window.parent.plugins && window.parent.plugins.toast) {
            window.plugins.toast.hide();
        } else {
            this.$ionicLoading.hide();
        }
    }

    getAppVersionFlag() {
        this.appNumVersion = this.commonService.getAppNumVersion();
        if (!this.appNumVersion)return false;

        let ver = "1.8.9";
        let verArr = ver.split(".");
        let appVerArr = this.appNumVersion.split(".");
        while (appVerArr.length < verArr.length) {
            appVerArr.push(0);
        }
        let isShow = true;
        for (let i = 0; i < appVerArr.length; i++) {
            if (Number(appVerArr[i]) > Number(verArr[i])) {
                break;
            } else if (Number(appVerArr[i]) < Number(verArr[i])) {
                isShow = false;
                break;
            }
        }
        return isShow;
    }

    isIos() {
        return this.commonService.judgeSYS() == 2;
    }

    getContentTop() {
        return this.isIos() ? 'contentStyle1' : 'contentStyle2';
    }


    /***************图片旋转**************/
    /**
     * 图片旋转后获取图片的src
     * @param orientation
     * @param src
     * @returns {*}
     */
    getCorrectSrc(orientation, src) {
        let newSrc = src;
        if (orientation == "" || orientation == 1 || orientation == undefined) {
            return newSrc;
        }
        switch (orientation) {
            case 8://逆时针90度  需要向右旋转90度
                newSrc = this.rotateImg(src, "right");
                break;
            case 3://旋转180度旋转 转两次
                newSrc = this.rotateImg(src, "right");
                newSrc = this.rotateImg(newSrc, "right");
                break;
            case 6://顺时针旋转90度，需要向左旋转
                newSrc = this.rotateImg(src, "left");
                break;
        }

        return newSrc;
    }


    /**
     * 旋转图片
     * @param img
     * @param direction 图片要旋转的方向（left|right）
     * @param canvas
     */
    rotateImg(imgSrc, direction) {
        let canvas = document.getElementById("myCanvas");
        //最小与最大旋转方向，图片旋转4次后回到原方向
        var min_step = 0;
        var max_step = 3;
        if (imgSrc == null)return;
        let img = new Image();
        img.src = imgSrc;
        //img的高度和宽度不能在img元素隐藏后获取，否则会出错
        var height = img.height;
        var width = img.width;
        var step = 2;
        if (step == null) {
            step = min_step;
        }
        if (direction == 'right') {
            step++;
            //旋转到原位置，即超过最大值
            step > max_step && (step = min_step);
        } else {
            step--;
            step < min_step && (step = max_step);
        }
        //旋转角度以弧度值为参数
        var degree = step * 90 * Math.PI / 180;
        var ctx = canvas.getContext('2d');
        switch (step) {
            case 0:
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0);
                break;
            case 1:
                canvas.width = height;
                canvas.height = width;
                ctx.rotate(degree);
                ctx.drawImage(img, 0, -height);
                break;
            case 2:
                canvas.width = width;
                canvas.height = height;
                ctx.rotate(degree);
                ctx.drawImage(img, -width, -height);
                break;
            case 3:
                canvas.width = height;
                canvas.height = width;
                ctx.rotate(degree);
                ctx.drawImage(img, -width, 0);
                break;
        }

        let ndata = canvas.toDataURL("image/jpeg", 0.8);
        canvas.width = 0;
        canvas.height = 0;
        return ndata;
    }

    rotateSelectImg(index, event) {
        let me = this;
        let image = this.displayImgList[index];
        if (!image.file) {
            image.file = event.currentTarget;
        }
        EXIF.getData(image.file, function () {
            let orientation = EXIF.getTag(this, 'Orientation'); //获取图片的方向
            console.log(orientation);
            image.src = me.rotateImg(image.src, "left");
            me.displayImgList[index] = image;
            me.formImgList[index] = image;
        });
    }

    back(){
        this.go('home.growing');
    }
}
GrowingPubMsg.$inject = [
    '$scope'
    , '$state'
    , '$rootScope'
    , '$stateParams'
    , 'commonService'
    , '$ngRedux'
    , '$ionicPopup'
    , '$ionicLoading'
    , 'growingService'
    , "uuid4"
    , "$ionicLoading"
    , "$timeout"
];
controllers.controller("growingPubMsg", GrowingPubMsg);