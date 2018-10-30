/**
 * Created by WL on 2017/6/26.
 */

import {Inject, View, Directive, select} from 'ngDecorator/ng-decorator';

@Directive({
    selector: 'gameMapAtlas3',
    template: require('./page.html'),
    styles: require('./style.less'),
    replace: true
})

@View('game_map_atlas3', {
    url: '/game_map_atlas3/:avatorId/:mapId/:theme',
    template: '<game-map-atlas3></game-map-atlas3>'
})

@Inject('$scope', '$state', '$rootScope', '$stateParams', '$ngRedux', 'themeConfig','gameMapInfoServer','commonService')
class GameMapAtlas3 {
    themeConfig;
    $stateParams;
    gameMapInfoServer;
    commonService;
    @select(state => state.game_map_atlas_info.atlas3) avatorList;

    isWin = this.commonService.judgeSYS() === 3;
    lightId = this.$stateParams.avatorId || [];
    atlasId ="atlas3";
    theme = this.$stateParams.theme || 'theme03';
    mapId = this.$stateParams.mapId || null;
    isIos = this.commonService.judgeSYS() === 2;

    constructor() {
    }


    initFlags() {
        this.initCtrl = false;
    }

    configDataPipe() {
        this.dataPipe
            .when(() => !this.initCtrl)
            .then(() => {
                this.initCtrl = true;
            })
    }


    onBeforeEnterView() {

    }

    onAfterEnterView() {
        if(!angular.isArray(this.lightId)){
            let tempData = this.lightId ;
            this.lightId = [];
            this.lightId.push(tempData);
        };
        this.gameMapInfoServer.getAtlasList(this.atlasId,this.lightId).then(data => {
            if (data.code == 200) {
                this.gameMapInfoServer.lightAnimal(this.atlasId,this.lightId); //点亮动物的动画
                return;
            }
            this.commonService.alertDialog('网络连接不畅，请稍后再试');
        })
    }

    getMyImg(url) {
        return require('./../../../game_map_images/' + url);
    }

    getAtlasImg(imgId) {
        let url = 'game_map_atlas3/'+imgId + '.png';
        return this.getMyImg(url);
    }
    back(){
        this.getScope().$emit('atlasShareBtnBack', {});
    }
}

export default GameMapAtlas3;