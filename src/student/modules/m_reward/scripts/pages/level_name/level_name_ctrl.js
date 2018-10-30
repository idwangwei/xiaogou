/**
 * Created by Administrator on 2017/5/2.
 */
// import BaseController from 'base_components/base_ctrl';
import bgStar from '../../../reward_images/levelName/levelNameBgStar.png';
import {Inject, View, Directive, select} from '../../module';

@View('reward_level_name', {
    url: '/reward_level_name/:backUrl',
    template: require('./level_name.html'),
    styles: require('./level_name.less'),
    inject:['$scope',
        '$state',
        '$rootScope',
        '$stateParams',
        '$ngRedux',
        '$ionicHistory',
        'rewardSystemService',
        '$ionicPopup',
        'profileService',
        '$ionicLoading']
})

class levelNameCtrl {

    @select(state=>(state.level_name_list.levelAnalyzeData)) levelData;
    @select(state=>(state.level_name_list_group.group)) currentGroup;
    @select(state=>(state.user_reward_base)) rewardBase;

    // @select(state=>(state.level_name_list.levelNameList)) levelNameList;
    bgStar = bgStar;

    constructor() {
        /*后退注册*/

    }

    getWidth(item) {
        // this.rewardBase.level = 25;//TODO
        // let preArr = item.lv.split('-');
        // if (item.status) return 100;
        let width = ((+this.rewardBase.level - (+item.startLevel)) / (+item.endLevel - (+item.startLevel)).toFixed(2)) * 100;
        if (width > 100) width = 100;
        return width;
    }

    isIos() {
        return this.getRootScope().platform.IS_IPHONE || this.getRootScope().platform.IS_IPAD || this.getRootScope().platform.IS_MAC_OS;
    }

    back() {
        if (this.getRootScope().showLevelNameAlert) {
            this.getRootScope().showLevelNameAlert = false;
            this.getRootScope().$digest();
        } else if (this.getRootScope().showLevelNameAlert) {
            this.getRootScope().showLevelNameAlert = false;
            this.getRootScope().$digest();
        } else if (this.backUrl) {
            this.go(this.backUrl);
        } else {
            this.go('home.me');
        }

    }

    loadLevelNameImg(flag, index) {
        let group = this.rewardBase.title || 1;
        let imgUrl = 'group' + group + "Level";
        imgUrl += "Name" + (index + 1) + ".png";
        return this.getRootScope().loadImg('levelName/' + imgUrl);
    }

    initData() {
    }

    onBeforeLeaveView() {
    }

    onReceiveProps() {
    }

    onAfterEnterView() {
        this.getLevelNames();
        this.initData();
    }

    /**
     * 获取称号列表
     */
    getLevelNames() {
        this.profileService.getLevelNameList(this.$ngRedux.dispatch, this.$ngRedux.getState, this.rewardBase.level);
        /*  defers.then((data)=> {
         if (data.code == 200) {
         // this.analyzeLevelData();
         }
         })*/
    }

    /**
     * 解析称号数据
     */
    /*   analyzeLevelData() {
     // this.nameList
     let myLevel = this.rewardBase.level;
     let names = [];
     let group = this.currentGroup;
     if (!group) group = 1;
     angular.forEach(this.nameList, (v, k)=> {
     if (this.nameList[k][0].group == group) names = angular.copy(this.nameList[k]);
     });
     if (names.length == 0) return;

     //解析一组数据
     this.levelData.length = 0;
     this.levelData.push(names[0]);
     this.levelData[0].startLevel = 0;
     this.levelData[0].endLevel = names[0].level;

     for (let i = 1; i < names.length; i++) {
     let temp = this.levelData[this.levelData.length - 1];
     if (temp.name != names[i].name) {
     this.levelData.push(names[i]);
     temp = this.levelData[this.levelData.length - 1];
     temp.startLevel = names[i].level;
     }
     temp.endLevel = names[i].level;
     if (myLevel >= temp.endLevel) {
     temp.status = true;
     } else {
     temp.status = false;
     }
     }
     }*/

    /**
     * 点击切换称号按钮
     */
    exchangeClick() {
        let template = "<p style='width: 100%;text-align: center;font-size: 16px'>第一次切换称号免费，以后每一次切换需要50能量</p>" +
            "<p style='width: 100%;text-align: center;font-size: 16px'>确定切换成驯宠系列？</p>";

        if (this.rewardBase.title == 1) {
            template = "<p style='width: 100%;text-align: center;font-size: 16px'>切换需要消耗50积分,</p>" +
                "<p style='width: 100%;text-align: center;font-size: 16px'>确定切换成驯宠系列？</p>";
        } else if (this.rewardBase.title == 2) {
            template = "<p style='width: 100%;text-align: center;font-size: 16px'>切换需要消耗50积分,</p>" +
                "<p style='width: 100%;text-align: center;font-size: 16px'>确定切换成魔法系列？</p>";
        }
        this.$ionicPopup.show({
            title: '温馨提示',
            template: template,
            buttons: [{
                text: '确定',
                type: 'button-positive',
                onTap: (e)=> {
                    // profileService.handleAutoLogin();
                    this.dealChange();
                }
            },
                {
                    text: '取消',
                    type: 'button-default',
                    onTap: (e)=> {
                    }
                }]
        })
    }

    dealChange() {
        let title = 1;
        if (!this.rewardBase.title || this.rewardBase.title == 1) title = 2;
        // if (!this.currentGroup || this.currentGroup == 1) title = 2;
        var changeServer = this.rewardSystemService.changeLevelNameGroup(title);
        changeServer.then((data)=> {
            if (data && data.updateOk) {
                this.currentGroup = title;
                this.toast("切换成功", 1000);
            } else {
                this.toast("切换失败", 1000);
            }
        })
    }

    configDataPipe() {
        this.backUrl = this.getStateService().params.backUrl;
    }

    /**
     * 弹出提示框
     * @param msg
     */
    toast(msg, t) {
        let time = t || 1000;
        this.$ionicLoading.show({
            template: msg,
            duration: time,
            noBackdrop: true
        });
    }

    getStatusImg(status) {
        let imgUrl = "levelStatus" + status + ".png";
        return this.getRootScope().loadImg('levelName/' + imgUrl);
    }

    clickLevelName(item, index) {
        this.currentClickedLevelName = item;
        this.currentClickedLevelName.imgIndex = index;
        this.getRootScope().showLevelNameAlert = true;
    }
}
