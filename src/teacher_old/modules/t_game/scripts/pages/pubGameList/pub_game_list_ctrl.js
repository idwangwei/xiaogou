/**
 * 已发布游戏管理
 */

import {Inject, View, Directive, select} from '../../module';
import _each from 'lodash.foreach';
const actionType = {
    CHANGE_CLAZZ: 'CHANGE_CLAZZ',
    CANCEL_FORCE_GL_UPDATE: 'CANCEL_FORCE_GL_UPDATE'
};

const typeXS = 'XS';//教材版本为西师;
@View('home.pub_game_list', {
    url: '/pub_game_list',
    styles: require('./style.less'),
    views: {
        "pub_game_list": {
            template: require('./pub_game_list.html'),
        }
    },
    inject: ['$scope'
        , '$log'
        , '$rootScope'
        , 'commonService'
        , '$ionicActionSheet'
        , 'gameManageService'
        , '$ionicModal'
        , '$state'
        , 'gameStatisticsService'
        , '$ionicPopup'
        , '$ionicScrollDelegate'
        , '$ngRedux'
        , 'pageRefreshManager'
        , '$timeout'
        , '$ionicSideMenuDelegate']
})
class PubGameListCtrl {
    $timeout;
    $ngRedux;

    tip = "布置游戏请点击右上方的“布置”按钮";
    // noGames = false;
    page = {seq: 0, needDataNum: 10};
    judgeCount = 0;       //判断是否已经初始化过数据
    deleteCount = 0;     //计数删除的项目条数
    forceUpdateCount = 0;  //判断是否强制更新过一次，一次ctrl实例化 只能强制更新一次
    showSetting = false;
    currentDate = new Date();
    selectDateObj = {
        year: this.currentDate.getFullYear(),
        month: this.currentDate.getMonth() + 1
    };
    retFlag = false;   //数据是否已经初始化
    //当前选择的班级
    @select(
        (state, self) =>
            state.gl_selected_clazz
    )  selectedClazz;
    //班级列表
    @select(
        (state, self) => state.clazz_list
    ) clazzList;
    //显示的游戏列表
    @select(
        state => state.game_list[state.gl_selected_clazz.id]
            ? state.game_list[state.gl_selected_clazz.id].gameList
            : null) pubGames;

    //判端列表是否能加载更多
    @select(
        state => state.game_list[state.gl_selected_clazz.id] ?
            state.game_list[state.gl_selected_clazz.id].moreFlag : false) moreFlag;

    @select((state)=>state.fetch_game_star_rank_data_processing) isGameStarLoading;
    @select(state => state.profile_user_auth.user.manager) isAdmin;

    $ionicSideMenuDelegate;
    screenWidth = window.innerWidth;


    constructor() {
        //初始化当前选择班级
        this.initSelectedClazz();
        //初始化Modal框
        // this.initSelectClazzModal();
    }

    onUpdate() {
        //6s刷新页面
        this.getPubGames(true);  //传入true，表明需要从0拉取游戏列表
        this.$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(false);
        this.judgeCount++;
    }

    onReceiveProps() {
        if (this.judgeCount == 0) {
            this.getPubGames(true);
            this.judgeCount++;
            return;
        }
        if (this.$ngRedux.getState().force_gl_update_flag && this.forceUpdateCount == 0) {
            this.getPubGames(true);  //传入true，表明需要从0拉取游戏列表
            this.forceUpdateCount++;
            this.$ngRedux.dispatch({type: actionType.CANCEL_FORCE_GL_UPDATE});
        }
    }

    /**
     * 获取游戏列表
     * clearFlag 判断getPubGames是否从0 开始拉取游戏列表
     */
    getPubGames(clearFlag) {
        let $scope = this.getScope();
        if (this.$ngRedux.getState().clazz_list.length == 0 || !(this.$ngRedux.getState().gl_selected_clazz.id)) {
            this.moreFlag = false;
            this.retFlag = true;
            return;
        }
        if (this.pubGames && this.pubGames.length > 0) {
            this.page.seq = this.pubGames.length + this.deleteCount;
        }
        if (clearFlag) this.page.seq = 0;
        this.gameManageService.getPubGames(this.page, clearFlag)
            .then((data) => {
                $scope.$broadcast('scroll.infiniteScrollComplete');
                console.log('game_list', this.pubGames);
                this.retFlag = true;
                if (!data) {
                    this.moreFlag = false;
                    //this.noGames = true;
                }
            })
    }

    /**
     * 下拉刷新
     * */
    pullRefresh() {
        let $scope = this.getScope();
        if (this.clazzList.length == 0) {
            this.moreFlag = false;
            //解决下拉刷新转圈不消失问题
            $scope.$broadcast('scroll.refreshComplete');
            return;
        }
        this.page.seq = 0;
        /**
         *getPubGames第二个参数为是否刷新全部数据的flag
         */
        this.gameManageService.getPubGames(this.page, true)
            .then((data) => {
                $scope.$broadcast('scroll.refreshComplete');
                console.log('game_list', this.pubGames);
                this.retFlag = true;
                if (!data) {
                    this.moreFlag = false;
                    //this.noGames = true;
                }
            })

    }

    /**
     * 删除游戏
     * @param id
     * @param index
     */
    delGame(id, index) { //index为要要删除的发布下标
        var title = '信息提示';
        var info = '<p>删除此次发布的游戏？</p><p>注: 学生端游戏会相应被删除</p>';
        this.commonService.showConfirm(title, info).then((res) => {
            if (res) {
                this.gameManageService.delGame(id).then((flag) => {
                    if (flag) this.deleteCount++;
                });
            }
        })
    };

    /**
     * 选择班级
     * @param clazz
     */
    selectClazz(clazz) {
        this.retFlag = false;
        this.page.seq = 0;
        this.judgeCount = 0;
        this.$ionicSideMenuDelegate.toggleLeft(false);
        this.$ngRedux.dispatch({
            type: actionType.CHANGE_CLAZZ,
            name: clazz.name,
            id: clazz.id,
            bookType: clazz.teachingMaterial
        });
        this.$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(false);
    };

    /**
     * 一般问题提示框 游戏没有调整顺序和解锁了 暂时注释掉
     */
    /* answer(){
     this.$ionicPopup.alert({
     title: '常见问题',
     template: `<p style="color: #377AE6">问：游戏在学生端有解锁顺序吗？</p>
     <p>1.&nbsp;有，排在本页下方的游戏，在学生端会被暂时锁住，直到学生通关了上方的游戏。</p>
     <p style="color: #377AE6">问：老师如何调整游戏的解锁顺序？</p>
     <p>1.&nbsp;点击本页右上方的“三”形按钮，游戏列表右方会出现同样的按钮。</p>
     <p>2.&nbsp;可拖动这些按钮调整游戏上下顺序，即解锁顺序。</p>
     <p>3.&nbsp;再次点击本页右上方的“三”形按钮，游戏列表中的按钮就会消失。</p>`,
     okText: '确定'
     });
     };*/

    /**
     * 移动游戏排序
     * @param game
     * @param fromIndex
     * @param toIndex
     */
    moveGame(game, fromIndex, toIndex) {
        if (fromIndex == toIndex) {
            return;
        }
        //把该项移动到数组中
        var pubGames = angular.copy(this.pubGames);
        pubGames.splice(fromIndex, 1);
        pubGames.splice(toIndex, 0, game);
        this.gameManageService.moveGame(pubGames, game, fromIndex, toIndex);
    }

    settingToggle() {
        this.showSetting = !this.showSetting;
    }

    /**
     * 去游戏关卡页面
     */

    showLevels(id, game) {
        if (game.totalStudentCount == 0) {
            this.commonService.showAlert("温馨提示", '<p style="text-align: center">该游戏无任何记录！</p>', '确定');
            return;
        }
        if (game.isNewGame) {
            this.gameManageService.changeGameReadStatus(id);
        }
        //this.gameManageService.getPubGameLevelsParam.id = id;
        //$state.go('game_level');
        this.gameManageService.getPubGameLevels(id).then((data)=> {
            if (data.code == 200) {
                let level = data.cgceDetail.games[0].levels[0];
                let pubGameId = data.cgceDetail.id;

                this.gameStatisticsService.pubGame.classId = game.clzId;
                this.gameStatisticsService.pubGame.publicId = pubGameId;
                this.gameStatisticsService.pubGame.levelGuid = level.levelGuid;
                this.gameStatisticsService.pubGame.kdName = level.kdName;
                this.gameStatisticsService.pubGame.levelNum = level.num;
                this.gameStatisticsService.pubGame.gameName = game.games[0].name;
                this.getStateService().go('game_statistics');
            } else {
                this.commonService.alertDialog(data.msg, 1500);
            }
        });
    }

    /**
     * 去游戏库
     */
    goGameLib() {

        // if(this.selectedClazz.type.match(typeXS)){
        //     this.commonService.showAlert("温馨提示", '<p style="text-align: center">西师版的游戏暂时不开放</p>', '确定');
        //     return
        // }
        let $rootScope = this.getRootScope();
        if (!$rootScope.isAdmin && this.clazzList.length == 0) {

            let template = '<p>您还没有创建班级，点击“班级”，然后再点击“+”创建班级</p>';
            this.commonService.showAlert("温馨提示", $('<div></div>').append(template).html(), '确定');
            return;
        }
        this.getStateService().go("game_lib");
    }

    /**
     * 初始Modal框
     */
    initSelectClazzModal() {
        this.$ionicModal.fromTemplateUrl('clazz-select.html', { //初始化modal页
            scope: this.getScope()
        }).then(modal => {
            //$rootScope.modal.push(modal);
            this.clazzSelectModal = modal;
        });
    }

    /**
     * 初始化选择的班级
     */
    initSelectedClazz() {
        var state = this.$ngRedux.getState();

        if (state.clazz_list.length === 0) return;
        //判断当前选中的班级是否存在
        if (!(state.gl_selected_clazz.id
            && state.clazz_list.find((clazz)=>clazz.id === state.gl_selected_clazz.id))) {

            this.$ngRedux.dispatch({
                type: actionType.CHANGE_CLAZZ,
                id: state.clazz_list[0].id,
                name: state.clazz_list[0].name,
                bookType: state.clazz_list[0].teachingMaterial
            })
        }
        //如果当前选中的班级存在 并且在班级列表中能找到则不用初始选择一个选中的班级。
        //如果当前选中的班级不存在或者选中的班级不在班级列表中则需要初始化一个值
    }

    /**/
    getGameIconUrl(gameGuid) {
        let name = gameGuid.match(/ab4_03|ab4_04/) ? 'ab4_other' : gameGuid.split('_')[1];
        return this.getRootScope().loadImg('game_icon/' + name + '.png');
    };

    /*初始化班级*/
    onBeforeEnterView() {
        //初始化当前选择班级
        var state = this.$ngRedux.getState();//= state.gl_selected_clazz.id
        if (state.clazz_list.length !== 0) {
            state.clazz_list.find((item) => {
                if (item.id === state.gl_selected_clazz.id) {
                    this.$ngRedux.dispatch({
                        type: actionType.CHANGE_CLAZZ,
                        id: item.id,
                        name: item.name,
                        bookType: item.teachingMaterial
                    });
                    return true;
                }
            });
        }
    }

    onAfterEnterView() {
        this.getRootScope().showTopTaskFlag = true;//显示任务列表指令
    }

    onBeforeLeaveView() {
        this.getRootScope().showTopTaskFlag = false;//显示任务列表指令
        angular.forEach(this.$ionicSideMenuDelegate._instances, instance=>instance.close());
        this.getRootScope().isShowGameStarRank = false;

    }

    showMenu() {
        this.$ionicSideMenuDelegate.toggleLeft();
    }


    ifShow($index) {
        if (!this.pubGames || !this.pubGames.length) return false;
        if ($index == 0) return true;
        let currentItem = this.pubGames[$index];
        let previousItem = this.pubGames[$index - 1];
        let currentMonth = currentItem.createdTime.split('-')[1];
        let previousMonth = previousItem.createdTime.split('-')[1];
        return currentMonth != previousMonth;
    }

    getMonth(listItem) {
        try {
            return Number(listItem.createdTime.split('-')[1]);
        } catch (err) {
            console.error('游戏列表分月信息解析失败', err);
        }
    }

    checkData(data) {
        try {
            if (data[0].gameGuid) return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * 显示游戏星星排行榜
     */
    showGameStarRank() {
        this.getStarRankData();
        this.getRootScope().isShowGameStarRank = true;
    }

    getStarRankData() {
        if (!this.selectedClazz || !this.selectedClazz.id) {
            return;
        }
        if (this.isGameStarLoading) {
            return;
        }
        this.gameManageService.fetchGameStarRankData({classId: this.selectedClazz.id});
        this.$ionicScrollDelegate.scrollTop(true);
    }

    /**
     * 点击排行榜外的灰色区域关闭排行榜
     * @param event
     */
    closeGameStarRankData(event) {
        if ($(event.target).hasClass('work-backdrop'))
            this.getRootScope().isShowGameStarRank = false;
    }

    back() {
        if (this.getRootScope().isShowGameStarRank == true) {
            this.getRootScope().isShowGameStarRank = false
        } else {
            return "exit";
        }
        this.getRootScope().$digest();
    }
}


export default PubGameListCtrl;

