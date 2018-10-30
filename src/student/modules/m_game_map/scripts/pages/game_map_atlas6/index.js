/**
 * Created by WL on 2017/6/26.
 */

import {Inject, View, Directive, select} from '../../module';


@View('game_map_atlas6', {
    url: '/game_map_atlas6/:avatorId/:mapId/:theme',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope', '$state', '$rootScope', '$stateParams', '$ngRedux', 'themeConfig','gameMapInfoServer','commonService'
    ]
})

class GameMapAtlas6 {
    themeConfig;
    $stateParams;
    gameMapInfoServer;
    commonService;
    @select(state => state.game_map_atlas_info.atlas6) avatorList;

    lightId = this.$stateParams.avatorId || [];
    atlasId = "atlas6";
    theme = this.$stateParams.theme || 'theme06';
    mapId = this.$stateParams.mapId || null;
    isIos = this.commonService.judgeSYS() === 2;
    isWin = this.commonService.judgeSYS() === 3;

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
        let url = 'game_map_atlas6/'+imgId + '.png';
        return this.getMyImg(url);
    }
    back(){
        this.getScope().$emit('atlasShareBtnBack', {});
    }
}

export default GameMapAtlas6;