/**
 * Created by ZL on 2018/1/31.
 */
import _find from 'lodash.find';
import audioSrc from './../../../audios/task-desc-game.mp3';
import {Inject, View, Directive, select} from '../../module';
const typeXS = 'XS'; //教材版本为西师版
let START_ICON = {
    fullStar: 'math_game_full_star.png',
    halfStar: 'math_game_half_star.png',
    emptyStar: 'math_game_empty_star.png'
};
import fullStar from '../../../images/game_imgs/math_game_full_star.png'
import halfStar from '../../../images/game_imgs/math_game_half_star.png'
import emptyStar from '../../../images/game_imgs/math_game_empty_star.png'
@View('winter_camp_game', {
    url: '/winter_camp_game/:fromGame',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject: [
        '$scope'
        , '$state'
        , '$rootScope'
        , '$stateParams'
        , '$ngRedux'
        , '$ionicHistory'
        , '$ionicLoading'
        , 'winterCampService'
        , 'commonService'
        , 'winterCampInterface'
        , '$ionicPopup'
    ]
})

class winterCampGameCtrl {
    @select((state)=> {
        return state.winter_camp_selected_textbook || {};
    }) selectedTextbook;
    @select((state)=> {
        return state.winter_camp_selected_grade || {};
    }) selectedGrade;
    @select((state)=> {
        return state.select_winter_camp_course || {};
    }) selectCourse;
    /* @select((state)=> {
     return state.winter_camp_game_list || [];
     }) gameList;*/
    @select(state=>state.current_course_info.games) gameList;
    @select((state)=> {
        let classArr = state.profile_clazz.clazzList || [];
        if (classArr.length == 0) classArr = state.profile_clazz.selfStudyClazzList || [];
        let selectedClazz = classArr[0] || {};
        if (!selectedClazz.hasOwnProperty('teachingMaterial')) {
            selectedClazz.teachingMaterial = 'BS-北师版';
        }
        return selectedClazz;
    }) selectedClazz;

    @select(state=>state.profile_user_auth.user) user;

    winterCampService;
    commonService;
    winterCampInterface;
    $ionicPopup;

    audioSrc = audioSrc;
    descAudio = $('#task-desc-video-game')[0];
    starImg = START_ICON;

    fullStar = fullStar;
    halfStar = halfStar;
    emptyStar = emptyStar;
    hasPlayEd = false;
    initCtrl = false;
    fromGameFlag = !this.getStateService().params.fromGame;

    constructor() {
    }

    initData() {
        this.initCtrl = false;
        this.fromGameFlag = !this.getStateService().params.fromGame;
    }

    back() {
        this.go('home.winter_camp_home');
    }

    onBeforeLeaveView() {
        this.descAudio.pause();
    }

    onReceiveProps() {
    }

    onAfterEnterView() {
        this.initData();
        this.ensurePageData();
        this.descAudio.play();
        this.descAudio.addEventListener('ended', function () {
            $('.task-desc-video-butn .auto-mark').hide();
        }, false);
    }

    playAudio() {
        if (!this.descAudio) return;
        this.hasPlayEd = true;
        this.descAudio.pause();
        this.descAudio.play();
    }

    ensurePageData() {
        if (!this.initCtrl || this.fromGameFlag) {
            this.initCtrl = true;
            // this.winterCampService.fetchGameList(this.selectedClazz)
            if (this.fromGameFlag) {
                this.winterCampService.getWinterCampClassDetail(this.selectCourse.id, this.selectedClazz.id);
            }
            this.fromGameFlag = false;
        }
    }

    getGameIconUrl(gameGuid) {
        let name = gameGuid.match(/ab4_03|ab4_04/) ? 'ab4_other' : gameGuid.split('_')[0];
        return this.getRootScope().loadImg('game_icon/' + name + '.png');
    };

    /**
     * 进入游戏
     * @param game
     * @returns {*}
     */
    goToPlayGame(game) {
        /*if (this.selectedClazz.teachingMaterial.match(typeXS)) {
            this.commonService.showAlert(
                '温馨提示',
                '<p style="text-align: center">班级教材版本为西师版</p><p style="text-align: center">西师版游戏暂时不开放</p>');
            return
        }*/

        if (game.status == 100) {
            return this.showAlertForLevel();
        }
        this.playGamePopUp(game).then((result)=> {
            //点击取消
            if (!result) {
                return
            }

            //点击确认
            // let level = game.levels[0];
            let gameGuid = game.levelGuid.split('_')[0];
            let dirNum = this.winterCampService.getGameNum(gameGuid);
            let gameSessionID = this.winterCampService.gameAppendShardingId(this.selectedClazz.id);
            // let gameSessionID = this.commonService.gameAppendShardingId();
            let switchTo = {
                m: [game.levelGuid, game.num, gameGuid],
                cgc: {
                    cgceId: game.cgceId,
                    cgcId: game.cgcId,
                    session: gameSessionID
                },
                user: {name: this.user.name, theme: this.user.gender},
                sPlayGame: {
                    game: game,
                    Url: this.getStateService().current.name
                }
            };
            this.commonService.setLocalStorage('switchTo', switchTo);
            this.commonService.setLocalStorage('dirLocal', dirNum);
            this.commonService.setLocalStorage(this.winterCampInterface.IS_COME_FROM_GAME, 'winter_camp_game');

            if (navigator.userAgent.match(/iPad|iPhone/i)) {
                var assetPath = this.commonService.getLocalStorage('assetPath');
                if (assetPath) window.location.href = assetPath.url + "index.html";
            }
            else if (navigator.userAgent.match(/WINDOWS|MAC/i)) {
                window.location.href = '../../win/index.html?dir=' + dirNum;
            } else {
                window.location.href = 'file:///android_asset/www/index.html';
            }
        });
    }

    /**
     * 显示进入游戏确认框
     * @param game
     * @returns {*}
     */
    playGamePopUp(game) {
        // this.selectGame(game);

        return this.$ionicPopup.show({ // 调用$ionicPopup弹出定制弹出框
            template: ' <p style="text-align: center">确认进入游戏【' + game.name + '】？</p>',
            title: '信息提示',
            buttons: [
                {
                    text: "<button> 进入 </button>",
                    type: "button-positive",
                    onTap: function (e) {
                        return true;
                    }
                },
                {
                    text: "<button> 取消 </button>",
                    type: "button-positive",
                    onTap: function (e) {
                        return false;
                    }
                }
            ]
        })
    }

}