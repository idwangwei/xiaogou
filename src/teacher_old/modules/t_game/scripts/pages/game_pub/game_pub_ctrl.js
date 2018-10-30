/**
 * Created by 华海川 on 2015/9/9.
 * 游戏布置
 */
import qqIcon from "../../../../t_boot/tImages/qq.ico";
import weChatIcon from "../../../../t_boot/tImages/wechat.ico";
import {Inject, View, Directive, select} from '../../module';
@View('game_pub', {
    url: '/game_pub',
    styles: require('./game_pub.less'),
    template: require('./game_pub.html'),
    inject: ['$scope'
        , '$state'
        , '$log'
        , '$ionicHistory'
        , '$ionicPopup'
        , '$ionicModal'
        , 'finalData'
        , 'commonService'
        , 'gameManageService'
        , "gameRepoService"
        , "$ngRedux"
        , "$ionicActionSheet"
        , "$rootScope"]
})
class gamePubCtrl {
    $ionicActionSheet;
    finalData;
    commonService;
    gameManageService;
    gameRepoService;
    $ionicPopup;

    @select((state)=>state.profile_user_auth.user) teacher;
    @select((state)=>state.clazz_list) clazzLists;

    order = {"first": true, "last": false}; //玩游戏的顺序，默认优先玩
    pub = {
        desc: '' //布置描述
    };
    clzIds = [];
    game = this.gameRepoService.game;

    initData() {
        this.clazzList=[];
        this.clazzLists.forEach((clazz) => {
            this.clazzList.push({
                id: clazz.id,
                name: clazz.name
            })
        })
    }

    onAfterEnterView(){
        this.initData();
    }

    showShareMenu() {
        let teacherName = this.teacher.name;
        let shareContent = `${teacherName}老师在智算365布置了游戏"${this.game.gameName}"，抓紧去闯关吧！`;
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
                        ()=> {
                            this.commonService.showAlert("提示", "通知成功！");
                        }, (err)=> {
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
                            messageExt: "这是第三方带的测试字段",
                            messageAction: "<action>dotalist</action>",
                            media: {
                                type: Wechat.Type.WEBPAGE,
                                webpageUrl: this.finalData.GONG_ZHONG_HAO_QRIMG_URL
                            }
                        }
                    }, ()=>{
                        this.commonService.showAlert("提示", "通知成功！");
                    }, (reason)=>{
                        this.commonService.showAlert("提示", reason);
                    });
                }

                return true;
            }
        });
    }

    setOrder(type) {
        if (type == 1) {
            this.order.first = true;
            this.order.last = false;
        } else {
            this.order.last = true;
            this.order.first = false;
        }
    };

    /**
     * 处理班级的状态
     * @param clzIdsArray
     * @param status
     */
    handleClazzPubStatus(clzIdsArray, status) {
        angular.forEach(clzIdsArray, (clazzId)=> {
            for (let i = 0; i < this.clazzList.length; i++) {
                debugger;
                if (this.clazzList[i].id === clazzId) {
                    this.clazzList[i].code = status.CODE;
                    this.clazzList[i].msg = status.MSG;
                    if (status.CODE === this.finalData.PUB_CLAZZ_STATUS.SUCCESS.CODE) {
                        if (this.clazzList[i].isClicked) {
                            this.clazzList[i].hasPubed = true;
                            this.clazzList[i].isClicked = false;
                            this.clazzList[i].hasPubedSuccess = true;
                        }
                    } else {
                        if (this.clazzList[i].isClicked) {
                            this.clazzList[i].hasPubed = true;
                        }
                    }
                    break;
                }
            }
        });
    };

    handlePubGame(param) {
        let clazzId = this.clzIds[this.groupIndex];
        let clzIdsArray = [];
        let postParams = angular.copy(param);
        let handleSubMit = ()=> {
            if (this.groupIndex === this.clzIds.length - 1)
                this.pubBtnDisabled = false;
            else {
                this.groupIndex++;
                this.handlePubGame(param);
            }
        };
        clzIdsArray.push(clazzId);
        postParams.clzIds = clazzId;

        this.gameManageService.pubGame(postParams).then((data) => {
            if (data.code === 200) {
                this.handleClazzPubStatus(clzIdsArray, this.finalData.PUB_CLAZZ_STATUS.SUCCESS);
                if (this.groupIndex === this.clzIds.length - 1) {
                    this.gameManageService.forceGlUpdate();
                    var selectedClazz = this.clazzList.find(clazz => clazz.id === this.clzIds[0]);
                    this.gameManageService.changeClazz(selectedClazz.id, selectedClazz.name);
                }
            } else {
                this.handleClazzPubStatus(clzIdsArray, this.finalData.PUB_CLAZZ_STATUS.FAIL);
                this.commonService.alertDialog(data.msg, 2000);
            }
            handleSubMit();
        }, (res)=> {
            this.handleClazzPubStatus(clzIdsArray, this.finalData.PUB_CLAZZ_STATUS.FAIL);
            handleSubMit();
        });
    };

    /**
     * 布置
     */
    pubGame() {
        if (!this.validateForm()) {//表单校验不正确
            return;
        }
        var param = {
            name: this.pub.desc,
            subject: 1,
            sortStrategy: this.order.first ? 0 : 1,
            tbId: this.game.tbId
        };

        var title = '信息提示';
        var info = '是否要布置？';
        this.commonService.showConfirm(title, info).then((res)=> {
            if (res) {
                this.groupIndex = 0;
                this.pubBtnDisabled = true;
                this.handleClazzPubStatus(this.clzIds, this.finalData.PUB_CLAZZ_STATUS.PROCESSING);
                this.handlePubGame(param);
            }
        });
    };

    /**
     * 校验表单
     */
    validateForm() {
        this.clzIds.length = 0;
        this.clazzList.forEach((clazz)=> {
            if (clazz.isClicked) {
                this.clzIds.push(clazz.id);
            }
        });
        if (!this.clzIds.length) {
            this.commonService.alertDialog("请选择布置班级!", 1000);
            return false;
        }
        return true;
    }


    selectClazz(clazz) { //选择班级，判断该班级今天还可以布置吗
        if (clazz.isClicked == true) {
            this.gameManageService.isPub(clazz.id).then((data)=>{
                if (data.code == 6073) {
                    clazz.isClicked = false;
                    this.commonService.alertDialog("该班还没有学生.", 1500);
                    return;
                }
                if (data.code != 200) {
                    clazz.isClicked = false;
                    this.commonService.alertDialog(data.msg, 1500);
                    return;
                }
                if (!data.canPublish) {
                    clazz.isClicked = false;
                    var title = '信息提示';
                    var info = '今天已经在该班布置过游戏,请明天再布置.';
                    return this.commonService.showConfirm(title, info);
                }
            });
        }
    };


    /**
     * 返回
     */
    back() {
        //$ionicHistory.goBack();//返回到列表展示
        this.go('chapter_game_list');
    };

    answer() {
        this.$ionicPopup.alert({
            title: '信息提示',
            template: '<p>优先玩: 将游戏置列表顶部。</p>'
            + '<p>滞后玩:  将游戏置列表底部。</p>',
            okText: '确定'
        });
    }

    isShowIosShare() {
        return this.commonService.judgeAppVersion();
    }
}

export default gamePubCtrl;