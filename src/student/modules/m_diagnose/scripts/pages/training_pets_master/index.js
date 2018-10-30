/**
 * Created by qiyuexi on 2018/1/13.
 */
/**
 * Created by liangqinli on 2017/1/11.
 */

import {TRAINING_PETS_MASTER_FAILED}
    from '../../../../m_boot/scripts/redux/actiontypes/actiontypes'
import qqIcon from "./../../../../m_boot/bootImages/qq.ico";
import weChatIcon from "./../../../../m_boot/bootImages/wechat.ico";
import {Inject, View, Directive, select} from '../../module';

@View('training-pets-master', {
    url: '/training-pets-master/:fromUrl',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope',
        '$rootScope',
        '$timeout',
        '$ionicHistory',
        '$ngRedux',
        'commonService',
        '$ionicPopup',
        '$state',
        'trainingPetsMasterService',
        '$ionicScrollDelegate',
        '$ionicActionSheet',
        'appInfoService',
        'finalData'
    ]
})
class TrainingPetsMaster{
    constructor() {
        this.initData()
    }
    initData(){
        this.fromUrl = this.getStateService().params.fromUrl || null;
        this.allType = '';  //选择的值
        this.type = '';     //选择的值
        this.initCount = 0 ; //初始化次数
        this.getDataCount = 0; //请求数据次数
        this.retFlag = false;  //第一次拉取数据flag
        this.person = null;
        this.pullRefreshCount = 0; //上拉刷新次数
        this.moreFlag = true;
        this.isLoadingProcessing = false;
        this.allTypeOptions = [{
            name: '全国学生',
            value: 'country'
        },{
            name: '全班学生',
            value: 'class'
        }];
        this.typeOptions = [{
            name: '总排行',
            value: 'all'
        },{
            name: '周排行',
            value: 'weekend'
        },{
            name: '日排行',
            value: 'day'
        }];
        this.girlIcon = this.getRootScope().loadImg('trainingPetsMaster/girlF.png');
        this.boyIcon = this.getRootScope().loadImg('trainingPetsMaster/boyF.png');
    }
    initDataFlag(){
        this.$ionicScrollDelegate.$getByHandle('trainingPetsScroll').scrollTop(false);
        this.pullRefreshCount = 0; //上拉刷新次数
        this.moreFlag = true;
        this.retFlag = false;
    }
    getMainInfo(params){
        params = params || {}
        var realParams = {
            allType: params.allType || this.allType,
            type: params.type || this.type,
            first: this.initCount + this.getDataCount    //第一次调用的时候first为1，表示要获取personal的数据
            /*,limit*/  //查看班级的时候无效，查询全国的才有效默认是100条
        }
        if(realParams.allType === 'country'){
            realParams.limit = params.limit || 50;
        }else{
            delete realParams.limit;
        }
        this.getDataCount++;
        return this.getInfoData(realParams).then( data => {
            this.retFlag = true;
            if(data){
                if(data.person){
                    this.person = data.person;
                }
                this.list = data.list;
                return data.list.length;
            }else{

            }
        }).catch(error => {
            this.retFlag = true;
            this.isLoadingProcessing = false;
            this.list = [];
            this.$ngRedux.dispatch({type:TRAINING_PETS_MASTER_FAILED});
        });

    }
    pullRefresh(){
        var params = {};
        this.pullRefreshCount++;
        params.limit = 100;
        this.getMainInfo(params).then((len)=> {
            if(this.pullRefreshCount > 0){
                this.moreFlag = false;
            }
            this.getScope().$broadcast('scroll.infiniteScrollComplete');
        })
    }
    handleTypeOnChange = (value) => {
        var params = {
            type: value
        }
        this.initDataFlag();
        this.getMainInfo(params);
    }
    handleAllTypeOnChange = (value) => {
        var params = {
            allType: value
        }
        this.initDataFlag();
        this.getMainInfo(params);
    }
    /**
     * 打开邀请
     */
    showInvite() {
        let shareContent = `${this.person.studentName}同学成功征服${this.person.masterNumber}个考点，小伙伴们快来一起征服吧！`;
        this.$ionicActionSheet.show({
            buttons:[
                {text: `<img class="weChat-share-img" src="${weChatIcon}">分享到微信`},
                {text: `<img class="qq-share-img" src="${qqIcon}" >分享到QQ`}
            ],
            titleText: `<div>
                    <div class="share-title mSpecialColor">炫耀一下：</div>
                        <div class="share-content">${shareContent}</div>
                    </div>`,
            cancelText: '取消',
            buttonClicked: (index)=> {
                if (index == 1) {
                    QQ.setOptions({
                        appId: '1105576253',
                        appName: 'XiaoGou',
                        appKey: 'IaDN9O8abL0FJ6gT'
                    });
                    QQ.share(shareContent,
                        '炫耀一下',
                        'http://xuexiv.com/img/icon.png',
                        this.finalData.GONG_ZHONG_HAO_QRIMG_URL,
                        ()=> {
                            this.commonService.showAlert("提示", "分享成功！");
                        }, (err)=> {
                            this.commonService.showAlert("提示", err);
                        });
                }
                if (index == 0) {//点击分享到微信
                    if (!this.getScope().$root.weChatInstalled) {
                        this.commonService.showAlert("提示", "没有安装微信！");
                        return;
                    }
                    Wechat.share({
                        scene: Wechat.Scene.SESSION ,  // 分享到朋友或群
                        message: {
                            title: "炫耀一下",
                            description: shareContent,
                            thumb: "http://xuexiv.com/img/icon.png",
                            mediaTagName: "TEST-TAG-001",
                            messageExt: "这是第三方带的测试字段",
                            messageAction: "<action>dotalist</action>",
                            media: {
                                type: Wechat.Type.WEBPAGE,
                                webpageUrl: this.finalData.GONG_ZHONG_HAO_QRIMG_URL
                            }
                        },
                    }, ()=> {
                        this.commonService.showAlert("提示", "分享成功！");
                    }, (reason)=> {
                        this.commonService.showAlert("提示", reason);
                    });
                }
                return true;
            }
        });
    }

    isShowInvite()  {
        if(typeof Wechat ==   "undefined") return false; //插件不存在不显示
        if(this.commonService.judgeSYS() == 1) return true; //安卓系统显示
        if(this.commonService.judgeSYS() == 3) return false; //非移动端设备不显示

        if (!this.appNumVersion){
            this.appNumVersion = this.commonService.getAppNumVersion()
        }

        if(!this.appNumVersion) return false;

        let ver = "1.8.8";
        let verArr = ver.split(".");
        let appVerArr = this.appNumVersion.split(".");
        while(appVerArr.length < verArr.length){
            appVerArr.push(0);
        }
        let isShow = true;
        for(let i = 0 ; i<appVerArr.length; i++){
            if(Number(appVerArr[i]) > Number(verArr[i])){
                break;
            }else if(Number(appVerArr[i]) < Number(verArr[i])){
                isShow = false;
                break;
            }
        }
        return isShow;
    }
    help(){
        this.$ionicPopup.alert({
            title: '信息提示',
            template: `<div>
                          <h4>高手榜更新说明:</h4>
                          <p>1.所有班级排行榜实时刷新</p>
                          <p>2.全国排行榜每日凌晨3时刷新</p>
                       </div>`,
            okText: '确定'
        });
    }
    back(){
        if(this.fromUrl){
            this.go(this.fromUrl);
        }else{
            history.back();
        }
    }

    onReceiveProps() {
        if(this.initCount == 0 ){
            this.initCount++;
            this.isLoadingProcessing = true;
            this.getMainInfo().then(() => {
                this.isLoadingProcessing = false;
            })
        }
    }

    onBeforeLeaveView() {

    }

    onAfterEnterView() {

    }

    mapStateToThis(state) {
        return {
            /*appNumVersion: state.app_info.appVersion*/
        }
    }
    mapActionToThis(){
        /*this.appInfoService.getAppNumVersion.bind(this.appInfoService),*/
        return {
            getInfoData: this.trainingPetsMasterService.getInfoData.bind(this.trainingPetsMasterService),
            getAppNumVersion: this.appInfoService.getAppNumVersion.bind(this.appInfoService)
        }
    }
}

export default TrainingPetsMaster