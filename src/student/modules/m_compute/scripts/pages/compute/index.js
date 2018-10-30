/**
 * Created by qiyuexi on 2018/1/8.
 */
import {Inject, View, Directive, select} from '../../module';
// import _each from 'lodash.foreach';
import _findIndex from 'lodash.findindex';
// const typeXS = 'XS'; //教材版本为西师版
@View('home.compute', {
    url: '/compute',
    views: {
        "study_index": {
            template: require('./page.html')
        }
    },
    styles: require('./style.less'),
    inject:[
        '$scope',
        '$rootScope',
        '$timeout',
        '$ionicHistory',
        '$ngRedux',
        'commonService',
        'computeService',
        '$ionicPopup',
        '$ionicSideMenuDelegate',
        '$state',
        'computeInterface',
        '$ionicScrollDelegate',
    ]
})
class ComputeCtrl{

    RapidCalcInfo = [];
    grade = 0;
    constructor() {
       this.initData();
    }
    initData(){
        this.initCtrl = false;
        this.screenWidth = window.innerWidth;
        this.isIos = this.commonService.judgeSYS() === 2;
        this.isShowComputeFighterRank = false;

    }
    onReceiveProps() {
        this.ensurePageData()
    }

    ensurePageData(){
        if(!this.initCtrl){
            this.initCtrl = true;
            this.checkCurrentClazz();
        }
        // //验证本地保存的班级是否在最新的班级列表中
        // if(!this.initCtrl&&this.clazzList && this.clazzList.length!=0 ){
        //     if(!this.currentClazz.id || _findIndex(this.clazzList,{id:this.currentClazz.id})==-1){
        //         this.initCtrl = true;
        //         this.changeClazz(this.clazzList[0]);
        //     }
        // }
        //
        // if(!this.initCtrl&&(!this.clazzList || this.clazzList.length==0 )){
        //     this.initCtrl = true;
        //     this.changeClazz();
        // }
    }

    onBeforeLeaveView() {
        this.isShowComputeFighterRank = false;
        //离开当前页面时，cancel由所有当前页发起的请求
        this.$ionicSideMenuDelegate.toggleLeft(false);
        // _each(this.$ionicSideMenuDelegate._instances,instance=>instance.close());
    }

    onAfterEnterView() {
        this.getRootScope().studyStateLastStateUrl = this.getStateService().current.name;
        this.commonService.setLocalStorage('studyStateLastStateUrl','home.compute');
        this.checkCurrentClazz();
    }

    back(){
        if(this.isShowComputeFighterRank){
            this.isShowComputeFighterRank = false;
            this.getScope().$digest();
        }else{
            this.go('home.study_index','back');
        }
    }



    selectClazz(clazz) {
        this.$ionicSideMenuDelegate.toggleLeft();
        this.changeClazz(clazz);
        this.grade = this.currentClazz.grade - 1;
        this.getRapidCalcInfo();//获取新的速算统计信息
    }
    showMenu() {
        this.$ionicSideMenuDelegate.toggleLeft();
    }

    enterGame(){
        // let textbookType = this.currentClazz.teachingMaterial.split('-');
        // if(textbookType[0] === typeXS){
        //     let infoStrXS = `<p style="text-align: center;">&nbsp;当前班级：${this.currentClazz.name}【西师版】</p>
        //                <p style="text-align: center;">西师版的速算游戏暂未开放</p>`;
        //     this.commonService.showAlert('温馨提示',infoStrXS);
        //     return;
        // }

        // let infoStr = `<p style="text-align: center">当前班级：${this.currentClazz.name}</p>
        //                <p style="text-align: center">确定进入速算游戏？</p>`;
        // this.commonService.showConfirm('温馨提示',infoStr).then((res)=>{
        //     if(res){
        let dirNum = 90;//this.gameService.getGameNum(game.gameGuid);
        var gameSessionID = this.commonService.gameAppendShardingId();
        let grade = this.grade;
        if(grade>5||!grade) grade=0;
        grade = grade+1;
        let switchTo = {
            userId: this.user.userId,
            jsessionid: gameSessionID,
            loginName: this.user.loginName,
            theme: this.user.gender,
            gender: this.user.gender,
            classId: this.currentClazz.id,
            name: this.user.name,
            grade: grade,
            school: this.currentClazz.schoolName
        };

        this.commonService.setLocalStorage('switchTo', switchTo);
        this.commonService.setLocalStorage('dirLocal', dirNum);
        this.commonService.setLocalStorage(this.computeInterface.IS_COME_FROM_GAME, 'home.compute');

        if (navigator.userAgent.match(/iPad|iPhone/i)) {
            var assetPath = this.commonService.getLocalStorage('assetPath');
            if (assetPath) window.location.href = assetPath.url + "index.html";
        }
        else if (navigator.userAgent.match(/WINDOWS|MAC/i)) {
            window.location.href = '../../win/index.html?dir=' + dirNum;
        } else {
            window.location.href = 'file:///android_asset/www/index.html';
        }
        // }
        // });
    }

    checkCurrentClazz(){
        //班级列表为空
        if(!this.clazzList || this.clazzList.length==0 ){
            this.changeClazz();
            return
        }

        //选择班级在班级列表中的下标
        let currentClazzIndex = _findIndex(this.clazzList, {id:this.currentClazz && this.currentClazz.id});
        //当前没有选择班级|选择班级已被删除->重置为班级列表中的第一个班级
        if(currentClazzIndex == -1){
            this.changeClazz(this.clazzList[0]);
            //初始化当前选择年级
            this.grade = this.currentClazz.grade - 1;
            if(this.grade>5){
                this.grade = 5;
            }
        }
        else{
            this.changeClazz(this.clazzList[currentClazzIndex])
        }

        // //选择了班级并且名称已更新->使用班级列表中该班级的信息重置选择班级
        // else if(this.clazzList[currentClazzIndex].name != this.currentClazz.name){
        //     this.changeClazz(this.clazzList[currentClazzIndex])
        // }
        if(this.initCtrl) this.getRapidCalcInfo();//每次进入这个页面更新速算统计信息
    }
    getRapidCalcInfo(){
        if(!this.currentClazz.id) return;
        try{
            var userId = this.user.userId,
                classId = this.currentClazz.id;
        }catch(err){
            return;
        }
        this.commonService.commonPost(this.computeInterface.STUDENT_RC_INFO, {
            userId,
            classId
        }).then((data)=>{
            if(data.code == 200 && data.result){
                this.RapidCalcInfo = data.result;
            }
        })
    }
    /**
     * 后退切换年级
     */
    mback(){
        if(this.grade === 0){
            this.grade = 5;
        }else if(this.grade >0 && this.grade <6){
            this.grade = this.grade-1;
        }
        console.log('this.grade: ', this.grade);
    }
    /**
     * 前进切换年级
     */
    mforward(){
        if(this.grade === 5){
            this.grade = 0;
        }else if(this.grade >=0 && this.grade <5){
            this.grade= this.grade + 1;
        }
        console.log('this.grade： ', this.grade)
    }
    showGrade(){
        switch(this.grade){
            case 0: return '一年级速算';
            case 1: return '二年级速算';
            case 2: return '三年级速算';
            case 3: return '四年级速算';
            case 4: return '五年级速算';
            case 5: return '六年级速算';
        }
    }
    /**
     * 计算已通过关数的百分比
     * @param passLevel
     */
    calcPassLevelPercent(passLevel, totalLevel){
        //return (passLevel/this.totalLevel*100).toFixed(1) + '%';
        if(totalLevel == 0) return '0%';
        var num = (+passLevel/+totalLevel)*100;
        if(num === 0){
            return '0%';
        }
        if(num === 100){
            return '100%';
        }
        return num.toFixed(1) + '%';
    }



    /**
     * 显示游戏星星排行榜
     */
    showComputeFighterRank(){
        this.getComputeFighterData();
        this.isShowComputeFighterRank = true;
    }
    /**
     * 获取游戏星星排行榜数据
     */
    getComputeFighterData(){
        if(!this.currentClazz || !this.currentClazz.id){return;}
        if(this.$ngRedux.getState().fetch_fighter_rank_data_processing){return;}
        this.fetchFighterData({classId:this.currentClazz.id});
        this.$ionicScrollDelegate.scrollTop(true);
    }
    /**
     * 点击排行榜外的灰色区域关闭排行榜
     * @param event
     */
    closeComputeFighterRankData(event){
        if($(event.target).hasClass('work-backdrop'))
            this.isShowComputeFighterRank = false;
    }


    mapStateToThis(state) {
        let selfStudyClazzList = state.profile_clazz.selfStudyClazzList;
        let normalClassList = state.profile_clazz.clazzList;
        let clazzList;
        let clazzListWithFighter = state.clazz_with_fighter_rank_data;
        if(!state.compute_selected_clazz) state.compute_selected_clazz={}
        let fighterRankData = clazzListWithFighter[state.compute_selected_clazz.id];

        if(selfStudyClazzList && selfStudyClazzList.length !== 0){
            clazzList = selfStudyClazzList.concat(normalClassList);
        }else{
            clazzList = normalClassList
        }

        return {
            clazzList: clazzList,
            currentClazz:state.compute_selected_clazz,
            user:state.profile_user_auth.user,
            fighterRankData:fighterRankData,
            isFighterLoading:state.fetch_fighter_rank_data_processing,

        }
    }

    mapActionToThis() {
        let his=this.computeService;
        return {
            changeClazz:his.changeComputeClazz,
            fetchFighterData: his.fetchFighterRankData.bind(his),

        }
    }
}

export default ComputeCtrl;