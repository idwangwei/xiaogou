/**
 * Created by Administrator on 2017/6/22.
 */

import {Inject, View, Directive, select} from 'ngDecorator/ng-decorator';
const GAME_SHARDING_SPILT = '__';
const GAME_NO_CLAZZ = '000000';
import _find from 'lodash.find';


@Directive({
    selector: 'gameMapLevel',
    template: require('./index.html'),
    styles: require('./index.less'),
    replace: true
})

@View('game_map_level', {
    url: '/game_map_level/:mapId/:theme',
    template: '<game-map-level></game-map-level>'
})

@Inject('$scope', '$state', '$rootScope', '$stateParams', '$ngRedux','gameLevelService','profileService',
    'themeConfig', '$ionicScrollDelegate', '$timeout', 'commonService','finalData','gameMapFinalData')
class GameMapLevel {
    themeConfig;
    $timeout;
    $ngRedux;
    finalData;
    commonService;
    profileService;
    gameMapFinalData;
    gameLevelService;
    $ionicScrollDelegate;
    currentTheme = this.getStateService().params.theme || 'theme01';
    mapId = this.getStateService().params.mapId;
    initCtrl = false;
    isLoadingProcessing = true;
    levelItemIdPrefix = 'id_level_num_';
    showStuMark = false; //是否显示学生当前所在关卡的图案标记
    isIos = this.commonService.judgeSYS() === 2;
    isWin = this.commonService.judgeSYS() === 3;
    promptType = ''; //显示弹窗类型
    showGameLevelPrompt = false; //是否显示弹窗
    enterGameInfo = {}; //当前点击的关卡
    currentBoxReward = {
        card:'',
        credits:0
    };
    retFlag = false;
    repeatFinish = false;
    levelTheme = {
        bgBling:this.themeConfig.bgBling,
        freePlayImg:this.themeConfig.freePlayImg,
        starImgLight: this.themeConfig.starImgLight, //游戏星星（亮）
        starImgDark: this.themeConfig.starImgDark, //游戏星星（灰）
        starImgHalf: this.themeConfig.starImgHalf, //半颗星
        backgroundColor: 'game_level_background_color_', //关卡页面背景色

        itemIconLight: this.themeConfig.itemIconLight, //关卡图标

        itemBoxClosed: this.themeConfig[this.currentTheme].itemBoxClosed, //当前游戏包宝箱图（关闭）
        itemBoxOpen: this.themeConfig[this.currentTheme].itemBoxOpen, //当前游戏包宝箱图（开启）
        topBarImg: this.themeConfig[this.currentTheme].topBarImg, //当前游戏包header bar（左中右图）
        itemBgImgArr: this.themeConfig[this.currentTheme].itemBgImgArr, //当前游戏包关卡风景图
    };


    @select((state,self)=>{
        if(!state.game_map_level_info[self.mapId]){
            return {}
        }else {
            return state.game_map_level_info[self.mapId].levelsWithoutFirst
        }
    }) levelsWithoutFirst; //除去第一关的关卡集合
    @select((state,self)=>{
        if(!state.game_map_level_info[self.mapId]){
            return {}
        }else {
            return state.game_map_level_info[self.mapId].firstLevel
        }
    }) firstLevel; //第一关关卡信息
    @select((state,self)=>{
        if(!state.game_map_level_info[self.mapId]){
            return {}
        }else {
            return state.game_map_level_info[self.mapId].currentStuLevel
        }
    }) currentStuLevel; //当前所在的关卡
    @select((state,self)=>{
        if(!state.game_map_level_info[self.mapId]){
            return {}
        }else {
            return state.game_map_level_info[self.mapId].passBox
        }
    }) passBox; //通关宝箱
    @select(state=>state.profile_user_auth.user) user; //用户信息
    @select((state)=>{
        let user = state.profile_user_auth.user||{};
        let vips = user.vips || [];
        let gameMapVip = _find(vips,'mlcg');

        return gameMapVip && gameMapVip.mlcg
    }) gameMapVipArr; //用户支付信息
    @select((state) => {
        return state.profile_clazz.clazzList && state.profile_clazz.clazzList[0];
    }) normalClazz;
    @select((state) => {
        return state.profile_clazz.selfStudyClazzList && state.profile_clazz.selfStudyClazzList[0];
    }) selfStudyClazz;

    constructor() {
        this.getScope().$on('level-repeat-finish',()=>{
            this.repeatFinish = true;
            this.handleStuMark();
        })
    }
    configDataPipe() {
        this.dataPipe
            .when(()=>!this.initCtrl)
            .then(()=> {
                this.initCtrl = true;
                this.levelTheme.backgroundColor += this.currentTheme.match(/\d$/)[0];

                //获取游戏关卡信息
                this.gameLevelService.getLevelInfo({"mainScenceId":this.mapId}).then(()=>{
                    this.$timeout(()=> {
                        this.isLoadingProcessing = false;
                    },1200);
                    this.retFlag = true;
                    this.handleStuMark();
                },()=>{
                    this.retFlag = true;
                    this.isLoadingProcessing = false;
                });
            })
    }

    back() {
        if(this.showGameLevelPrompt){
            this.showGameLevelPrompt = false;
            this.getScope().$digest();
            return;
        }
        this.go('game_map_scene', 'back');
    }

    handleStuMark(){
        if(this.repeatFinish && this.retFlag){
            this.$timeout(()=> {
                this.showStuMark = true;
            },800);
        }
    }

    onBeforeEnterView() {}

    onAfterEnterView() {}

    onBeforeLeaveView(){}

    getLevelItemId(levelNum) {
        return this.levelItemIdPrefix + levelNum;
    }

    enterGame(levelInfo) {
        //不是付费用户第二关以后弹出引导付费框
        if(!this.isVip() && levelInfo.levelNum != 1){
            this.promptType = this.gameMapFinalData.gotoPay;
            this.showGameLevelPrompt = true;
            return;
        }

        if (levelInfo.canPlay) {
            this.promptType = this.gameMapFinalData.enterGame;
            this.showGameLevelPrompt = true;
            this.enterGameInfo = levelInfo;

        } else {
            this.promptType = this.gameMapFinalData.needPassPreLevel;
            this.showGameLevelPrompt = true;
        }
    }

    playGame() {
        this.hidePrompt();
        let game = this.enterGameInfo;
        let  URL = this.getStateService().current.name,
            PARAM = this.getStateService().params;

        let gameSessionID,
            sessionID = this.getRootScope().sessionID;

        let shardingIndex = sessionID.indexOf(GAME_SHARDING_SPILT);
        let shardingClazz = this.normalClazz||this.selfStudyClazz;
        let shardingClazzId =(shardingClazz && shardingClazz.id)||GAME_NO_CLAZZ;
        if (shardingIndex > -1){
            gameSessionID = sessionID.substring(0, shardingIndex) + GAME_SHARDING_SPILT + shardingClazzId ;
        }
        else{
            gameSessionID = sessionID + GAME_SHARDING_SPILT + shardingClazzId ;
        }
        let data = {
            m: [game.id, 1, game.id.split('_')[0]],
            cgc: {session: gameSessionID},
            user: {name: this.user.name, theme: this.user.gender ? 1 : 0},
            sPlayGame: {
                game: game,
                Url: URL,
                param:PARAM
            }
        };

        let dirNum = this.gameLevelService.getGameNum(game.id.split('_')[0]);
        this.commonService.setLocalStorage('switchTo', data);
        this.commonService.setLocalStorage('dirLocal', dirNum);
        this.commonService.setLocalStorage(this.finalData.IS_COME_FROM_GAME, URL);

        if (navigator.userAgent.match(/iPad|iPhone/i)) {
            var assetPath = this.commonService.getLocalStorage('assetPath');
            if (assetPath) window.location.href = assetPath.url + "index.html";
        }
        else if (navigator.userAgent.match(/WINDOWS|MAC/i)) {
            window.location.href = '../../win/index.html?dir=' + dirNum;
        }
        else {
            window.location.href = 'file:///android_asset/www/index.html';
        }
    }

    openBox(levelInfo) {
        //非第一关卡宝箱的非付费用户显示引导付费弹窗
        if(!this.isVip() && levelInfo.levelNum != 2){
            this.promptType = this.gameMapFinalData.gotoPay;
            this.showGameLevelPrompt = true;
            return;
        }

        //付费用户|第一关卡后的宝箱没有通关第一关不能开启
        if (!levelInfo.boxOpen && !levelInfo.boxCanOpen) {
            this.promptType = this.gameMapFinalData.needPassPreLevel;
            this.showGameLevelPrompt = true;
            return
        }

        //开启宝箱
        if (!levelInfo.boxOpen) {
            this.gameLevelService.openBox({"boxId": levelInfo.boxId}, levelInfo.levelNum === undefined, this.mapId)
                .then((res)=> {
                    if (res) {
                        //打开宝箱开启弹窗
                        this.currentBoxReward.card = levelInfo.boxCard;
                        this.currentBoxReward.credits = levelInfo.boxCredits;
                        this.promptType = this.gameMapFinalData.openBox;
                        this.openBoxCardImgSrc = `game_map_atlas${this.currentTheme.match(/\d$/)[0]}/${levelInfo.boxCard.replace('-', '_')}.png`;

                        this.showBoxCredits = false;
                        this.showBoxCard = false;
                        if (this.currentBoxReward.credits) {
                            this.showBoxCredits = true;
                        } else {
                            this.showBoxCard = true;
                        }
                        this.showGameLevelPrompt = true;
                        this.getRewardInfoServer();
                    } else {
                        this.commonService.alertDialog('宝箱开启失败', 2000);
                    }
                }, ()=> {
                    this.commonService.alertDialog('宝箱开启失败', 2000);
                });
        }

    }

    gotoAtlas(hasCard){
        this.hidePrompt();
        let param = this.getStateService().params;
        if(hasCard){
            param.avatorId = this.currentBoxReward.card.replace('-','_');
        }
        this.go('game_map_atlas'+this.currentTheme.match(/\d$/),param);
    }

    hidePrompt() {
        this.showGameLevelPrompt = false;
    }

    hideBoxCredits(){
        this.showBoxCredits = false;
        if(this.currentBoxReward.card){
            this.showBoxCard = true;
        }else {
            this.hidePrompt();
        }

    }
    hideBoxCard(){
        this.showBoxCard = false;
        this.hidePrompt();
    }
    gotoPay(){
        this.hidePrompt();
        this.getStateService().go('game_goods_select',{
            mapId:this.mapId,
            theme:this.currentTheme
        })
    }
    isVip(){
        return angular.isArray(this.gameMapVipArr)
            && this.gameMapVipArr.indexOf(+this.currentTheme.match(/\d$/)[0])!=-1;
    }
    mapActionToThis() {
        let ps = this.profileService;
        return {
            getRewardInfoServer: ps.getRewardInfoServer.bind(ps)
        }
    }
}

export default GameMapLevel;