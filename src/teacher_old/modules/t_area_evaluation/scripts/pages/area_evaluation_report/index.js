/**
 * Created by qiyuexi on 2018/3/26.
 */
import weChatIcon from './../../../../t_boot/tImages/wechat.ico';
import friendCircle from './../../../../t_boot/tImages/friend-circle.png';
import qqIcon from "../../../../t_boot/tImages/qq.ico";
import {Inject, View, Directive, select} from '../../module';


@View('area_evaluation_report', {
    url: 'area_evaluation_report/:paperId',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope', '$state','$ngRedux','areaEvaluationService','commonService','$ionicHistory','$rootScope','workStatisticsService','$ionicHistory','$ionicActionSheet'
    ]
})
class areaEvaluationReportCtrl {
    areaEvaluationService
    workStatisticsService
    commonService
    $ionicHistory
    $ionicActionSheet
    @select(state=>state.wl_selected_clazz) clazzInfo;
    @select(state=>state.profile_user_auth.user) userInfo;
    @select(state=>state.ae_all_report_info) allReportInfo;
    onBeforeLeaveView() {
        this.areaEvaluationService.cancelRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.areaEvaluationService.cancelRequestList.length=0;
    }
    onAfterEnterView(){
        this.initData();
    }
    constructor(){
        this.numArr=["","一","二","三","四","五","六"];
    }
    /*初始化页面*/
    initData(){
        this.paperId=this.getStateService().params.paperId;
        this.scoreRankList=this.workStatisticsService.wData.scoreDistList;
        //this.workStatisticsService.getScoreDist(this.paperId, this.paperId);//获取最新的数据，在这里可以不要
        this.info={
            a:this.userInfo.name,
            b:this.numArr[this.clazzInfo.grade],
            c:this.clazzInfo.clazz,
            d:this.clazzInfo.name,
            e:[this.clazzInfo.provinceName,this.clazzInfo.cityName,this.clazzInfo.districtName]
        }
        // this.getAllReportInfo();
    }
    back() {
        this.$ionicHistory.goBack();//返回到列表展示
    }
    getAllReportInfo(){
        this.areaEvaluationService.getAllReportInfo({
            instanceId:this.paperId,
            groupId:this.clazzInfo.id
        })
    }
    /**
     * 分享
     */
    showShare() {
        let shareTitle = `大数据监测报告`;
        let shareContent = `这是“${this.clazzInfo.name}”本次参与大数据监测的专属报告，排名情况、成绩详情、知识点掌握情况一目了然，请仔细查看！`;
        this.$ionicActionSheet.show({
            buttons: [
                {text: `<img class="weChat-share-img" src="${weChatIcon}">分享到微信`},
                {text: `<img class="friend-circle-share-img" src="${friendCircle}">分享到朋友圈`},
                {text: `<img class="qq-share-img" src="${qqIcon}">分享到QQ`}
            ],
            titleText: `<div style="text-align: center">
                    <div class="share-title">智算365测评报告：</div>
                        <div class="share-content">这是我们班本次参与大数据测评的专属报告，数据详细，分析到位，请查看！</div>
                    </div>`,
            cancelText: '取消',
            buttonClicked: (index) => {
                let url="http://www.xuexiv.com/area_report/index.html?f=1#/home?id="+this.paperId+"&clazzId="+this.clazzInfo.id+"&info="+encodeURIComponent(JSON.stringify(this.info))
                if (index == 0) {//点击分享到微信
                    if (!this.getScope().$root.weChatInstalled) {
                        this.commonService.showAlert("提示", "没有安装微信！");
                        return;
                    }
                    Wechat.share({
                        scene: Wechat.Scene.SESSION,  // 分享到朋友或群
                        message: {
                            title: shareTitle,
                            description: shareContent,
                            thumb: "http://xuexiv.com/img/icon.png",
                            mediaTagName: "TEST-TAG-001",
                            messageExt: "这是第三方带的测试字段",
                            messageAction: "<action>dotalist</action>",
                            media: {
                                type: Wechat.Type.WEBPAGE,
                                webpageUrl: url
                            }
                        },
                    }, () => {
                        this.commonService.showAlert("提示", "分享信息发送成功！");
                    }, (reason) => {
                        this.commonService.showAlert("提示", reason);
                    });
                }
                if (index == 1) {//点击分享到微信
                    if (!this.getScope().$root.weChatInstalled) {
                        this.commonService.showAlert("提示", "没有安装微信！");
                        return;
                    }
                    Wechat.share({
                        scene: Wechat.Scene.TIMELINE,  // 分享到朋友或群
                        message: {
                            title: shareTitle,
                            description: shareContent,
                            text: shareContent,
                            thumb: "http://xuexiv.com/img/icon.png",
                            mediaTagName: "TEST-TAG-001",
                            messageExt: "这是第三方带的测试字段",
                            messageAction: "<action>dotalist</action>",
                            media: {
                                type: Wechat.Type.LINK,
                                webpageUrl: url
                            }
                        },
                    }, () => {
                        this.commonService.showAlert("提示", "分享信息发送成功！");
                    }, (reason) => {
                        this.commonService.showAlert("提示", reason);
                    });
                }
                if(index==2){
                    if (!QQ) {
                        this.commonService.showAlert("提示", "没有安装qq！");
                        return;
                    }
                    QQ.setOptions({
                        appId: '1105576253',
                        appName: 'XiaoGou',
                        appKey: 'IaDN9O8abL0FJ6gT'
                    });
                    QQ.share(shareContent,
                        shareTitle,
                        'http://xuexiv.com/img/icon.png',
                        url,
                        () => {
                            this.commonService.showAlert("提示", "分享信息发送成功！");
                        }, (err) => {
                            this.commonService.showAlert("提示", err);
                        });
                }
                return true;
            }
        });
    }
    showAll(event){
        let thisEl=event.target;
        if(thisEl.offsetLeft!=0) return;
        thisEl.parentElement.className="know-text active";
        let moveL=thisEl.parentElement.offsetWidth-thisEl.offsetWidth;
        let left=0;
        let timer=setInterval(()=>{
            left--;
            thisEl.style.left=left+'px'
            if(left<moveL-20){
                thisEl.style.left=0
                thisEl.parentElement.className="know-text";
                clearInterval(timer)
            }
        },50)
    }
}

export default areaEvaluationReportCtrl
