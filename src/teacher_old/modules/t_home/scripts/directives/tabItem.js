/**
 * Author WW on 2018/3/1.
 * @description
 */
const SHOW_TAB_STATE_LIST = [
    "home.work_list",
    "home.pub_game_list",
    "home.diagnose",
    "home.clazz_manage",
    "home.math_oly",
    "home.me",
    "home.compute",
    "home.official_accounts"
];
class TabItemController {
    constructor($scope, $timeout, TabItemService, $state) {
        this.$timeout = $timeout;
        this.TAB_TITLE = ".tab-title";//tab项内的文字
        this.IMG = {
            BOTTOM: {
                STUDY: 'tabs/tab-teach.png',
                CLAZZ: 'tabs/tab-clazz.png',
                MORE: 'tabs/tab-math-oly.png',
                ME: 'tabs/tab-me.png',
                WEIXIN:'officialAccounts/official_accounts_butn.png',
                WXBOX: 'officialAccounts/official_accounts_butn_static.png',
                CLAZZ_MARK:'tabs/tab_clazz_float_icon.png'
            },
            TOP: {
                // WORK: 'tabs/work.png',
                WORK: 'tabs/work-on.png',
                WORK_ON: 'tabs/work-on.png',
                // GAME: 'tabs/game.png',
                GAME: 'tabs/game-on.png',
                GAME_ON: 'tabs/game-on.png',
                // DIAGNOSE: 'tabs/diagnose.png',
                DIAGNOSE: 'tabs/diagnose-on.png',
                DIAGNOSE_ON: 'tabs/diagnose-on.png',
                // COMPUTE:'tabs/compute.png',
                COMPUTE:'tabs/compute-on.png',
                COMPUTE_ON:'tabs/compute-on.png',
                TIFEB:'tabs/diagnose-up.png',
                TIFEB_ON:'tabs/diagnose-up.png'
            }
        };
        this.initListener($scope, TabItemService, $state);
    }

    initListener($scope, TabItemService, $state) {
        if (SHOW_TAB_STATE_LIST.indexOf($state.current.name) == -1)
            TabItemService.hideAllTabs();
        else
            TabItemService.showAllTabs();
        $scope.$root.$on('$stateChangeSuccess', (ev, toState)=> {
            TabItemService.redrawTabPosition();
            if (SHOW_TAB_STATE_LIST.indexOf(toState.name) == -1) {
                TabItemService.hideAllTabs();
            } else {
                TabItemService.showAllTabs();
            }
        })
    }

    bindOrientationchange(element) {
        let me = this;
        $(window).on('orientationchange', function () {
            me.$timeout(function () {
                let currentTitle = element.children().filter(me.TAB_TITLE);
                let currentTitleLeft = (currentTitle[0].offsetLeft - 12);
                let currentTitleLeftOn = (currentTitle[0].offsetLeft - 20);
                let imgArray = element.children().filter("img");

                if(currentTitle.text().length === 1){
                    currentTitleLeft-=8;
                    currentTitleLeftOn-=8;
                }
                imgArray.each(function (index, ele) {
                    if($(ele).hasClass('tab-top-img-on')){
                        ele.style.left = currentTitleLeftOn+'px';
                    }else {
                        ele.style.left = currentTitleLeft+'px';
                    }
                });
            }, 80);
        });
    }

    handleTabBottom(element, $rootScope) {
        let currentTitle = element.children().filter(this.TAB_TITLE),
            currentTitleLeft = (currentTitle[0].offsetLeft - 17) + "px",
            currentTitleBoxLeft = (currentTitle[0].offsetLeft+7) + "px",
            studyImgUrl = $rootScope.loadImg(this.IMG.BOTTOM.STUDY),
            clazzImgUrl = $rootScope.loadImg(this.IMG.BOTTOM.CLAZZ),
            clazzMarkImgUrl = $rootScope.loadImg(this.IMG.BOTTOM.CLAZZ_MARK),
            moreImgUrl = $rootScope.loadImg(this.IMG.BOTTOM.MORE),
            meImgUrl = $rootScope.loadImg(this.IMG.BOTTOM.ME),
            weixinImgUrl=$rootScope.loadImg(this.IMG.BOTTOM.WEIXIN),
            wxboxImgUrl = $rootScope.loadImg(this.IMG.BOTTOM.WXBOX),
            imgEle;
        let clazzMarkImg;
        switch (currentTitle.text()) {
            case '教学':
                let studyImg = `<img class="tab-study tab-bottom-img" src="${studyImgUrl}" style="left:${currentTitleLeft}">`;
                imgEle = studyImg;
                break;
            case '班级':
                let clazzImg = `<img class="tab-clazz tab-bottom-img" src="${clazzImgUrl}"  style="left:${currentTitleLeft}">`;
                if($rootScope.user && $rootScope.user.isFirstLogin) {
                    clazzMarkImg = `<img class="tab-gzh-img" src="${clazzMarkImgUrl}"  style="left:${currentTitleBoxLeft}">`;
                }
                imgEle = clazzImg;
                break;
            case '奥数':
                let moreImg = `<img class="tab-more tab-bottom-img" src="${moreImgUrl}"  style="left:${currentTitleLeft}">`;
                imgEle = moreImg;
                break;
            case '我':
                let meImg = `<img class="tab-me tab-bottom-img" src="${meImgUrl}"  style="left:${currentTitleLeft}">`;
                imgEle = meImg;
                break;
            case '公众号':
                // let weixinImg = `<img class="tab-wx" src="${weixinImgUrl}"  style="left:${currentTitleLeft}">`;
                // weixinboxImg = `<img class="tab-gzh-img" src="${wxboxImgUrl}"  style="left:${currentTitleBoxLeft}">`;
                // imgEle = weixinImg;
                break;
        }
        if(imgEle)element.append(imgEle);
        if (clazzMarkImg) {
            element.append(clazzMarkImg);
        }
        this.bindOrientationchange(element);
    }

    handleTabTop(element, $rootScope) {
        // let currentTitle = element.children().filter(this.TAB_TITLE),
        //     currentTitleLeft = (currentTitle[0].offsetLeft - 12) + "px", //灰色图标左移px
        //     currentTitleLeftG = (currentTitle[0].offsetLeft - 20) + "px", //点亮图标左移px
        //     workImgUrl = $rootScope.loadImg(this.IMG.TOP.WORK),
        //     workOnImgUrl = $rootScope.loadImg(this.IMG.TOP.WORK_ON),
        //     gameImgUrl = $rootScope.loadImg(this.IMG.TOP.GAME),
        //     gameOnImgUrl = $rootScope.loadImg(this.IMG.TOP.GAME_ON),
        //     diagnoseImgUrl = $rootScope.loadImg(this.IMG.TOP.DIAGNOSE),
        //     diagnoseOnImgUrl = $rootScope.loadImg(this.IMG.TOP.DIAGNOSE_ON),
        //     computeImgUrl = $rootScope.loadImg(this.IMG.TOP.COMPUTE),
        //     computeOnImgUrl = $rootScope.loadImg(this.IMG.TOP.COMPUTE_ON),
        //     tifenImgUrl = $rootScope.loadImg(this.IMG.TOP.TIFEB),
        //     tifenOnImgUrl = $rootScope.loadImg(this.IMG.TOP.TIFEB_ON),
        //     imgEle,
        //     imgOnEle;
        // switch (currentTitle.text()) {
        //     case '作业':
        //         let studyImg = `<img class="tab-work tab-top-img" src="${workImgUrl}" style="left:${currentTitleLeft}">`;
        //         let studyOnImg = `<img class="tab-work-on tab-top-img-on" src="${workOnImgUrl}" style="left:${currentTitleLeftG}">`;
        //         imgEle = studyImg;
        //         imgOnEle = studyOnImg;
        //         break;
        //     case '游戏':
        //         let gameImg = `<img class="tab-game tab-top-img" src="${gameImgUrl}"  style="left:${currentTitleLeft}">`;
        //         let gameOnImg = `<img class="tab-game-on tab-top-img-on" src="${gameOnImgUrl}"  style="left:${currentTitleLeftG}">`;
        //         imgEle = gameImg;
        //         imgOnEle = gameOnImg;
        //         break;
        //     case '诊断':
        //         let diagnoseImg = `<img class="tab-diagnose tab-top-img" src="${diagnoseImgUrl}"  style="left:${currentTitleLeft}">`;
        //         let diagnoseOnImg = `<img class="tab-diagnose-on tab-top-img-on" src="${diagnoseOnImgUrl}"  style="left:${currentTitleLeftG}">`;
        //         imgEle = diagnoseImg;
        //         imgOnEle = diagnoseOnImg;
        //         break;
        //     case '提分':
        //         let tifenImg = `<img class="tab-diagnose tab-top-img" src="${tifenImgUrl}"  style="left:${currentTitleLeft}">`;
        //         let tifenOnImg = `<img class="tab-diagnose-on tab-top-img-on" src="${tifenOnImgUrl}"  style="left:${currentTitleLeftG}">`;
        //         imgEle = tifenImg;
        //         imgOnEle = tifenOnImg;
        //         break;
        //     case '速算':
        //         imgEle = `<img class="tab-compute tab-top-img" src="${computeImgUrl}"  style="left:${currentTitleLeft}">`;
        //         imgOnEle  = `<img class="tab-compute-on tab-top-img-on" src="${computeOnImgUrl}"  style="left:${currentTitleLeftG}">`;
        //         break;
        // }
        // element.append(imgEle);
        // element.append(imgOnEle);
        this.bindOrientationchange(element);
    }

    tabInit(element, $rootScope) {
        let me = this;
        this.$timeout(()=> {
            if (element.parent().parent().attr("custom") === "bottom") {
                me.handleTabBottom(element, $rootScope);
                return;
            }
            if (element.parent().parent().attr("custom") === "top") {
                me.handleTabTop(element, $rootScope);
                return;
            }
        });
    }
}
TabItemController.$inject = ["$scope", "$timeout", "tabItemService", "$state"];

export default function ($timeout, $rootScope, tabItemService) {
    return {
        restrict: 'C',
        controller: ["$scope", "$timeout", "tabItemService", "$state", TabItemController],
        link: function ($scope, element, attr, ctrl) {
            $timeout(()=>{
                ctrl.tabInit(element, $rootScope);
            });
            if($(element).children().filter('.tab-title').text() === '护眼'){
                $(element).parent().append($(element));
                element.on('click', (ev)=>$timeout(()=> {
                    if(window.cordova && window.cordova.InAppBrowser){
                        let ref = window.cordova.InAppBrowser.open('http://mp.weixin.qq.com/s/oa_-IYuZwxQUSKp38HeGcg', '_blank', 'location=yes');
                    }else {
                        window.open('http://mp.weixin.qq.com/s/oa_-IYuZwxQUSKp38HeGcg', '_blank', 'location=yes')
                    }
                }));

            }else {
                element.on('click', (ev)=>$timeout(()=> tabItemService.redrawTabPosition()));
            }
        }
    };
}
