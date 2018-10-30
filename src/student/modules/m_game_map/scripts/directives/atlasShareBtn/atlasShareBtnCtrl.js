/**
 * Created by WL on 2017/6/28.
 */
import BaseController from 'base_components/base_ctrl';
import html2canvas from 'html2canvas/dist/html2canvas';

class atlasShareBtnCtrl extends BaseController {
    constructor() {
        super(arguments);
        this.initData();
        /*后退注册*/

    }

    initData() {
        this.theme = this.getScope().theme;
        this.mapId = this.getScope().mapId;
        $(".game-map-atlas-logo").hide();
        this.isIos = this.commonService.judgeSYS() === 2;
    }

    onBeforeLeaveView() {
    }

    onReceiveProps() {
    }

    onAfterEnterView() {
        $(".game-map-atlas-logo").hide();
    }

    mapStateToThis(state) {
        return {
            name: state.profile_user_auth.user.name,
        }
    }

    mapActionToThis() {
        return {
            shareAtlas: gameMapInfoServer.shareAtlas.bind(gameMapInfoServer),
        }
    }

    loadBtnImg(imgUrl) {
        return require('../../../game_map_images/game_map_atlas/' + imgUrl);
    };

    back() {
        let param = {
            theme: this.theme,
            mapId: this.mapId
        };
        this.getStateService().go("game_map_level", param);
    }


    clickShareBtn() {
        let me = this;
        $(".atlas-btn-action").hide();
        $(".game-map-atlas-logo").show();
        html2canvas(document.body).then((canvas) => {
            $(".game-map-atlas-logo").hide();
            $(".atlas-btn-action").show();
            me.gameMapInfoServer.shareAtlas(canvas.toDataURL("image/png"));
        });
    }

    isMobile() {
        return this.getRootScope().platform.isMobile() && this.getRootScope().weChatPluginInstalled ;
    }

    isShowShareBtn() {
        if (typeof Wechat == "undefined") return false; //插件不存在不显示
        if (commonService.judgeSYS() == 1) return true; //安卓系统显示
        if (commonService.judgeSYS() == 3) return false; //非移动端设备不显示

        let appNumVersion = this.commonService.getAppNumVersion();
        if (!appNumVersion)return false;

        let ver = "1.8.8";
        let verArr = ver.split(".");
        let appVerArr = appNumVersion.split(".");
        while (appVerArr.length < verArr.length) {
            appVerArr.push(0);
        }
        let isShow = true;
        for (let i = 0; i < appVerArr.length; i++) {
            if (Number(appVerArr[i]) > Number(verArr[i])) {
                break;
            } else if (Number(appVerArr[i]) < Number(verArr[i])) {
                isShow = false;
                break;
            }
        }
        return isShow;
    };
}
atlasShareBtnCtrl.$inject = ['$scope', '$ngRedux', '$rootScope', '$state', 'gameMapInfoServer', 'commonService'];

export default atlasShareBtnCtrl;