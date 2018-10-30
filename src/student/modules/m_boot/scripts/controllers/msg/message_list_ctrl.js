/**
 * Created by 邓小龙 on 2015/11/24.
 *
 */
import BaseCtrl from 'base_components/base_ctrl';
import _find from 'lodash.find';

class MessageListCtrl extends BaseCtrl{
    constructor(){
        super(arguments);
        this.subHeaderService.clearAll();
        this.initTimeSelect();
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    initData(){
        this.initCtrl = false;
        this.isIos=this.getRootScope().platform.IS_IPHONE||this.getRootScope().platform.IS_IPAD||this.getRootScope().platform.IS_MAC_OS;
        this.screenWidth = window.innerWidth;
        this.selectedClazzInitlized = false;
        this.defaultRankDataInitlized = false;
        this.isLoadingProcessing = true;
        // this.selectedTimeInitlized=false;//时间选择初始化


    }

    ensurePageData() {
        if (this.clazzList && this.clazzList.length != 0 && !this.selectedClazzInitlized) {
            this.selectedClazzInitlized=true;
            if(!this.checkSelectedClazz()){
                this.changeClazz();
                return;
            }
        }
        if(!this.defaultRankDataInitlized){
            this.defaultRankDataInitlized = true;
            this.clickSubheader();
        }
    }
    initTimeSelect(){
        this.termData = {nowTerm: '', terms: []};   //本学年，选择学年
        this.START_YEAR = 2015;                  //起始年份
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        if (1 <= month&&month < 9) {
            year = year - 1;
        }
        this.termData.nowTerm = (year) + '-' + (year + 1)+' 学年';
        for (var i = this.START_YEAR; i <= year; i++) {
            var temp = (i) + '-' + (i + 1)+' 学年';
            this.termData.terms.push(temp);
        }

        this.startTime = this.termData.nowTerm.substring(0, 4) + '-09-01';
        this.endTime = (parseInt(this.termData.nowTerm.substring(0, 4)) + 1) + '-08-31';
    }


    mapStateToThis(state) {
        let clazzListWithGameStar = state.clazz_with_game_star_rank_data;
        let clazzListWithFighter = state.clazz_with_fighter_rank_data;
        let trophy_selected_clazz = state.trophy_selected_clazz;
        let trophy_selected_time=state.trophy_selected_time;
        let stateKey=trophy_selected_clazz.id+"#"+trophy_selected_time.startTime+"|"+trophy_selected_time.endTime;
        let trophyRankData=state.clazz_year_with_trophy_rank[stateKey];
        let gameStarRankData = clazzListWithGameStar[state.trophy_selected_clazz.id];
        let fighterRankData = clazzListWithFighter[state.trophy_selected_clazz.id];
        return{
            clazzList: state.profile_clazz.clazzList,
            selectedClazz:state.trophy_selected_clazz,
            trophyRankData:trophyRankData,
            gameStarRankData:gameStarRankData,
            fighterRankData:fighterRankData,
            user: state.profile_user_auth.user,
            isGameStarLoading:state.fetch_game_star_rank_data_processing,
            isTrophyLoading:state.fetch_trophy_rank_data_processing,
            isFighterLoading:state.fetch_fighter_rank_data_processing,
            onLine: state.app_info.onLine
        }
    }
    mapActionToThis() {
        let his=this.homeInfoService;
        return {
            changeClazz: his.changeTrophyClazz.bind(his),
            fetchTrophyData: his.fetchTrophyRankData.bind(his),
            fetchStarData: his.fetchGameStarRankData.bind(his),
            fetchFighterData: his.fetchFighterRankData.bind(his),
            changeTrophyTime: his.changeTrophyTime.bind(his)
        }
    }
    onBeforeLeaveView() {
        this.$ionicSideMenuDelegate.toggleLeft(false);
        angular.forEach(this.$ionicSideMenuDelegate._instances,instance=>instance.close());
        //离开当前页面时，cancel由所有当前页发起的请求
        this.homeInfoService.cancelRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.homeInfoService.cancelRequestList.length = 0;//清空请求列表
    }
    /**
     * 检查是否选择了正确的班级
     * @returns {*}
     */
    checkSelectedClazz(){
        return this.selectedClazz && this.selectedClazz.id && _find(this.clazzList, {id: this.selectedClazz.id});
    }
    showMenu() {
        this.$ionicSideMenuDelegate.toggleLeft();
    }

    /**
     * 去选择班级
     */
    selectClazz(clazz) {
        this.$ionicSideMenuDelegate.toggleLeft(false);

        if(clazz.id === this.selectedClazz.id)  return; //如果选择班级和当前选中班级一致就不处理
        this.changeClazz(clazz);
        this.clickSubheader();
    }

    /**
     * 点击头部分页标签
     */
    clickSubheader(tag){
        tag = tag || this.getScope().subHeaderInfo.activeEle;

        switch (tag){
            case 'trophy_rank':
                this.getTrophyRankData();
                break;
            case 'star_rank':
                this.getStarRankData();
                break;
            case 'fighter_rank':
                this.getFighterRankData();
                break;
            default:
        }
    }

    getTrophyRankData(){
        // if(!this.selectedClazz && !this.selectedClazz.id)return;
        if(!this.selectedClazz || !this.selectedClazz.id){return;}
        if(this.$ngRedux.getState().fetch_trophy_rank_data_processing){return;}

        this.startTime = this.termData.nowTerm.substring(0, 4) + '-09-01';
        this.endTime = (parseInt(this.termData.nowTerm.substring(0, 4)) + 1) + '-08-31';
        this.changeTrophyTime(this.startTime,this.endTime);

        let param={
            startTime:this.startTime,
            endTime:this.endTime,
            clazzId:this.selectedClazz.id,
            stateKey:this.selectedClazz.id+"#"+this.startTime+"|"+this.endTime,
            scope:this.getScope()
        };
        this.fetchTrophyData(param);
        this.$ionicScrollDelegate.scrollTop(true);
    }
    getStarRankData(){
        if(!this.selectedClazz || !this.selectedClazz.id){return;}
        if(this.$ngRedux.getState().fetch_game_star_rank_data_processing){return;}
        this.fetchStarData({classId:this.selectedClazz.id});
        this.$ionicScrollDelegate.scrollTop(true);
    }
    getFighterRankData(){
        if(!this.selectedClazz || !this.selectedClazz.id){return;}
        if(this.$ngRedux.getState().fetch_fighter_rank_data_processing){return;}
        this.fetchFighterData({classId:this.selectedClazz.id});
        this.$ionicScrollDelegate.scrollTop(true);
    }
}

MessageListCtrl.$inject = [
    '$state'
    , '$scope'
    , '$rootScope'
    , '$ngRedux'
    , '$ionicSideMenuDelegate'
    , 'commonService'
    , 'homeInfoService'
    , 'subHeaderService'
    , '$ionicScrollDelegate'
];
export default MessageListCtrl;