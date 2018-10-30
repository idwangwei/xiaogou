/**
 * Created by WL on 2017/6/23.
 */
import {Inject, View, Directive, select} from 'ngDecorator/ng-decorator';

@Directive({
    selector: 'gameMapScene',
    template: require('./page.html'),
    styles: require('./style.less'),
    replace: true
})

@View('game_map_scene', {
    url: '/game_map_scene',
    template: '<game-map-scene></game-map-scene>'
})

@Inject('$scope', '$state', '$rootScope', '$stateParams', '$ngRedux', 'themeConfig', 'gameMapInfoServer','gameGoodsPayServer')
class GameMapScene {
    themeConfig;
    gameMapInfoServer;
    gameGoodsPayServer;
    @select(state => state.game_map_scene_list) gameMapSceneList;
    @select(state => state.profile_user_auth.user.vips) vipInfo;
    @select((state) => {
        return state.profile_clazz.clazzList && state.profile_clazz.clazzList[0];
    }) normalClazz;
    @select((state) => {
        return state.profile_clazz.selfStudyClazzList && state.profile_clazz.selfStudyClazzList[0];
    }) selfStudyClazz;

    constructor() {
        /*后退注册*/

    }

    initFlags() {
        this.initCtrl = false;
    }

    configDataPipe() {
        this.dataPipe
            .when(() => !this.initCtrl)
            .then(() => {
                this.initCtrl = true;

                if(this.normalClazz || this.selfStudyClazz){
                    this.gameMapInfoServer.setShardingClazz(this.normalClazz || this.selfStudyClazz);
                    this.gameMapInfoServer.getSceneList();
                }
            })
    }


    onBeforeEnterView() {
    }

    back() {
        this.getStateService().go("home.study_index");
        this.getRootScope().$injector.get('$ionicViewSwitcher').nextDirection('back');

    }

    buy() {
        this.getStateService().go("game_goods_select",{backUrl:"game_map_scene"});
    }

    goToPlay(item) {
        let routeUrl = "game_map_level";
        let param = {
            mapId: item.id,
            theme: 'theme0' + item.backGroundPic
        };
        this.getStateService().go(routeUrl, param);
    }

    getMyImg(url) {
        return require('./../../../game_map_images/game_map_scene/' + url);
    }

    getBgImg(index, index2) {
        let url = "scene" + (index + 1) + "_" + index2 + '.png';
        return this.getMyImg(url);
    }

    getTitleImg(index) {
        let url = 'title' + (index + 1) + '.png';
        return this.getMyImg(url);
    };

    hasPayForGame(index){
        return this.gameGoodsPayServer.hasBuyTheGame(this.vipInfo,index+1);
    }
}

export default GameMapScene;