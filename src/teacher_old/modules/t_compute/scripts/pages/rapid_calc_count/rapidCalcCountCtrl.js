/**
 * Created by liangqinli on 2016/10/29.
 */
import {Inject, View, Directive, select} from '../../module';
const typeXS = 'XS'; //西师版教材版本
const actionTypes = {
    RC_CHANGE_CLAZZ: 'RC_CHANGE_CLAZZ',
    CLEAR_RC_LIST: 'CLEAR_RC_LIST'
};

@View('home.compute', {
    url: '/compute',
    styles: require('./rapid-calc-count.less'),
    views: {
        "compute": {
            template: require('./rapid-calc-count.html'),
        }
    },
    inject: ["$scope", "$rootScope", "$state", "$timeout",
        "$ionicPopup", "$ngRedux", "$ionicTabsDelegate", "$ionicSideMenuDelegate", "$ionicScrollDelegate", "$log",
        "commonService", 'rapidCalcCountService', 'pageRefreshManager']
})
class rapidCalcCount {
    $ionicScrollDelegate;
    $ionicSideMenuDelegate;
    commonService;
    rapidCalcCountService;
    pageRefreshManager;
    $ngRedux;

    @select(
        state => state.clazz_list
    ) clazzList;
    //当前选择的班级
    @select(
        (state, self) =>
            state.rc_selected_clazz
    )  selectedClazz;
    @select(
        (state, self) => {
            if (state.rapid_calc_list.length === 0) {
                return state.rapid_calc_list;
            } else {
                if (self.grade > 6) {
                    self.grade = 5;
                }
                return state.rapid_calc_list[self.grade]
                    .sort((a, b) => b.passLevel - a.passLevel);
            }
        }
    )  countList;
    @select(
        state =>
            state.fetch_fighter_rank_data_processing
    ) isFighterLoading;
    @select(state => state.profile_user_auth.user.manager) isAdmin;
    // @select(state => state.rc_selected_clazz) clazz;
    // @select(state => state.clazz_list) clazzList;

    girlIcon = this.getRootScope().loadImg('other/girl.png');
    boyIcon = this.getRootScope().loadImg('other/boy.png');
    initCount = 0;
    screenWidth = window.innerWidth;
    retFlag = false;

    constructor() {
        //初始化当前选择班级
        this.initSeletedClazz();
        //初始化年级 0为一年级
        this.grade = this.$ngRedux.getState().rc_selected_clazz.grade - 1;
        //if(this.grade>=6) this.grade =5;  //TODO 暂时这样处理，因为只有1到6年级，但是后端给的年级有7年级
        /*后退注册*/

    }

    showLeftMenu(clazz) {
        this.$ionicSideMenuDelegate.toggleLeft();
    }

    /**
     *  获取统计列表
     */
    getRapidCalcCount() {
        if (this.$ngRedux.getState().clazz_list.length === 0 || this.$ngRedux.getState().rc_selected_clazz.id == 0)  return;
        return this.rapidCalcCountService.getRapidCalcCount().then(()=> {
            this.retFlag = true;
        });
    }

    /**
     * 初始化选择班级
     */
    initSeletedClazz() {
        var state = this.$ngRedux.getState();

        if (state.clazz_list.length === 0) return;
        //判断当前选中的班级是否存在
        if (!(state.rc_selected_clazz.id !== 0
            && state.clazz_list.find((clazz)=>clazz.id === state.rc_selected_clazz.id))) {
            this.$ngRedux.dispatch({
                type: actionTypes.RC_CHANGE_CLAZZ,
                id: state.clazz_list[0].id,
                name: state.clazz_list[0].name,
                grade: state.clazz_list[0].grade,
                bookType: state.clazz_list[0].teachingMaterial
            })
        }
    }

    /**
     * 切换班级
     */
    changeClazz(clazz) {
        this.$ngRedux.dispatch({
            type: actionTypes.RC_CHANGE_CLAZZ,
            name: clazz.name,
            id: clazz.id,
            grade: clazz.grade,
            bookType: clazz.teachingMaterial
        });
        this.$ngRedux.dispatch({type: actionTypes.CLEAR_RC_LIST});
        //切换当前选中的年级
        this.grade = this.$ngRedux.getState().rc_selected_clazz.grade - 1;
        if (this.grade >= 6) this.grade = 5;  //TODO 暂时这样处理，因为只有1到6年级，但是后端给的年级有7年级
        this.retFlag = false;
        this.getRapidCalcCount(false);
        this.$ionicSideMenuDelegate.toggleLeft();
        this.$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(false);
    }

    /**
     * 六秒更新
     */
    onUpdate() {
        this.getRapidCalcCount();
        this.initCount++;
    }

    /**
     * 初始化列表数据
     */
    onReceiveProps() {
        if (this.initCount === 0) {
            this.getRapidCalcCount();
            this.initCount++;
        }
    }

    /**
     * 下拉刷新
     */
    pullRefresh() {
        this.getRapidCalcCount().then(() => {
            this.getScope().$broadcast('scroll.refreshComplete');
        })

    }

    /**
     * play game
     */
    tryPlayGame() {
        // if(this.selectedClazz.type.match(typeXS)){
        //     this.commonService.showAlert("温馨提示", '<p style="text-align: center">西师版的速算暂时不开放</p>', '确定');
        //     return
        // }


        if (this.selectedClazz.id === 0) {
            this.commonService.showAlert('提示', `<p style="text-align: center;margin-bottom: 0 !important;">未创建班级不能试玩</p>`);
            return;
        }
        var state = this.$ngRedux.getState();
        var user = state.profile_user_auth.user;
        this.commonService.showConfirm('温馨提示', '<p style="text-align: center">确定进入速算游戏？</p>').then((res)=> {
            if (res) {
                let dirNum = 90;//this.gameService.getGameNum(game.gameGuid);
                var gameSessionID = this.commonService.rapidCalcAppendShardingId(this.selectedClazz.id);
                let switchTo = {
                    userId: user.userId,
                    jsessionid: gameSessionID,
                    loginName: user.loginName,
                    theme: user.gender,
                    gender: user.gender,
                    classId: this.selectedClazz.id,
                    name: user.name,
                    grade: +this.grade + 1
                };

                this.commonService.setLocalStorage('switchTo', switchTo);
                this.commonService.setLocalStorage('dirLocal', dirNum);
                this.commonService.setLocalStorage('IS_COME_FROM_GAME', 'home.compute');

                if (navigator.userAgent.match(/iPad|iPhone/i)) {
                    var assetPath = this.commonService.getLocalStorage('assetPath');
                    if (assetPath) window.location.href = assetPath.url + "index.html";
                }
                else if (navigator.userAgent.match(/WINDOWS|MAC/i)) {
                    window.location.href = '../../win/index.html?dir=' + dirNum;
                } else {
                    window.location.href = 'file:///android_asset/www/index.html';
                }
            }
        });
    }

    /**
     * 计算已通过关数的百分比
     * @param passLevel
     */
    calcPassLevelPercent(passLevel, totalLevel) {
        //return (passLevel/this.totalLevel*100).toFixed(1) + '%';
        if (totalLevel == 0) return '0%';
        var num = passLevel / totalLevel * 100;
        if (num === 0) {
            return '0%';
        }
        if (num === 100) {
            return '100%';
        }
        return num.toFixed(1) + '%';
    }

    /**
     * 后退切换年级
     */
    mback() {
        if (this.grade === 0) {
            this.grade = 5;
        } else if (this.grade > 0 && this.grade < 6) {
            this.grade = this.grade - 1;
        }
        this.changeGrade();
        console.log('this.grade: ', this.grade);
    }

    /*z注册android返回*/
    back() {
        return "exit"
    }

    /**
     *  选择年级
     */
    changeGrade() {
        this.$ngRedux.dispatch({type: 'CHANGE_RC_GRADE'});
    }

    /**
     * 前进切换年级
     */
    mforward() {
        if (this.grade === 5) {
            this.grade = 0;
        } else if (this.grade >= 0 && this.grade < 5) {
            this.grade = this.grade + 1;
            // this.changeGrade();
        }
        this.changeGrade();
        console.log('this.grade： ', this.grade)
    }

    showGrade() {
        switch (this.grade) {
            case 0:
                return '一年级速算';
            case 1:
                return '二年级速算';
            case 2:
                return '三年级速算';
            case 3:
                return '四年级速算';
            case 4:
                return '五年级速算';
            case 5:
                return '六年级速算';
        }
    }

    onAfterEnterView() {
        this.getRootScope().showTopTaskFlag = true;//显示任务列表指令
    }

    onBeforeLeaveView() {
        this.getRootScope().showTopTaskFlag = false;//显示任务列表指令
    }

    /*初始化班级*/
    onBeforeEnterView() {
        //初始化当前选择班级
        this.initSeletedClazz();
        //检查当前选中的班级名字有没有改变，改变了的话更新当前选中班级的数据
        var state = this.$ngRedux.getState();
        if (state.clazz_list.length !== 0) {
            state.clazz_list.find((item) => {
                if (item.id === state.rc_selected_clazz.id) {
                    // if(item.name !== state.rc_selected_clazz.name){
                    this.$ngRedux.dispatch({
                        type: actionTypes.RC_CHANGE_CLAZZ,
                        id: item.id,
                        name: item.name,
                        grade: item.grade,
                        bookType: item.teachingMaterial
                    });
                    // }
                    return true;
                }
            });
        }
    }


    /**
     * 显示游戏星星排行榜
     */
    showComputeFighterRank() {
        this.getComputeFighterData();
        this.getRootScope().isShowComputeFighterRank = true;
    }

    /**
     * 获取游戏星星排行榜数据
     */
    getComputeFighterData() {
        if (!this.selectedClazz || !this.selectedClazz.id) {
            return;
        }
        if (this.isFighterLoading) {
            return;
        }
        this.rapidCalcCountService.fetchFighterRankData({classId: this.selectedClazz.id});
        this.$ionicScrollDelegate.scrollTop(true);
    }


}

export default rapidCalcCount