/**
 * Author 邓小龙 on 2015/8/10.
 * @description
 */
import  directives from './../index';

const SHOW_TAB_STATE_LIST = [
    "home.work_list",
    "home.game_list",
    // "home.diagnose",
    // "home.diagnose02",
    "home.olympic_math_home",
    "home.me",
    "home.compute",
    "home.study_index",
    "home.growing",
    "home.official_accounts",
    // "home.diagnose_pk",
    'home.oral_calculation_work_list',
    'home.improve',
    'home.live_home',
];

class TabItemController {
    constructor($scope, $timeout, TabItemService, $state) {
        this.$timeout = $timeout;
        this.TAB_TITLE = ".tab-title";//tab项内的文字
        this.IMG = {
            BOTTOM: {
                STUDY: 'tabs/tab-study_new.png',
                CLAZZ: 'tabs/tab-info.png',
                MORE: 'tabs/stu_tab_grow.png',
                ME: 'tabs/tab-me_new.png',
                IMPROVE_MARK: 'tabs/stu_tab_improve_mark.png',
                LIVE_MARK: 'tabs/stu_tab_live_mark.png',
                WEIXIN: 'officialAccounts/official_accounts_butn.png',
                WXBOX: 'officialAccounts/official_accounts_butn_static.png',
                XC_PK: 'tabs/stu_tab_xcpk.png',
                IMPROVE: 'tabs/stu_tab_improve.png',
                LIVE:'tabs/stu_tab_live.png'
            },
            TOP: {
                WORK: 'tabs/work_new.png',
                WORK_ON: 'tabs/work-on_new.png',
                GAME: 'tabs/game_new.png',
                GAME_ON: 'tabs/game-on_new.png',
                DIAGNOSE: 'tabs/diagnose_new.png',
                DIAGNOSE_ON: 'tabs/diagnose-on_new.png',
                COMPUTE: 'tabs/compute_new.png',
                COMPUTE_ON: 'tabs/compute-on_new.png'
            }
        };
        this.initListener($scope, TabItemService, $state);
    }

    initListener($scope, TabItemService, $state) {
        // if (SHOW_TAB_STATE_LIST.indexOf($state.current.name) == -1)
        //     TabItemService.hideAllTabs();
        // else
        //     TabItemService.showAllTabs();
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
                let imgArray = element.children().filter("img");
                imgArray.each(function (index, ele) {
                    if($(ele).hasClass("tab-gzh-img")){
                        ele.style.left = currentTitle[0].offsetLeft  + "px"
                    }else{
                        ele.style.left = (currentTitle[0].offsetLeft - 12) + "px";
                    }
                });
            }, 80);
        });
    }

    handleTabBottom(element, $rootScope) {
        let currentTitle = element.children().filter(this.TAB_TITLE),
            currentTitleLeft = (currentTitle[0].offsetLeft - 12) + "px",
            currentTitleBoxLeft = (currentTitle[0].offsetLeft) + "px",
            studyImgUrl = $rootScope.loadBootImg(this.IMG.BOTTOM.STUDY),
            clazzImgUrl = $rootScope.loadBootImg(this.IMG.BOTTOM.CLAZZ),
            moreImgUrl = $rootScope.loadBootImg(this.IMG.BOTTOM.MORE),
            meImgUrl = $rootScope.loadBootImg(this.IMG.BOTTOM.ME),
            weixinImgUrl = $rootScope.loadBootImg(this.IMG.BOTTOM.WEIXIN),
            wxboxImgUrl = $rootScope.loadBootImg(this.IMG.BOTTOM.WXBOX),
            liveMarkImgUrl = $rootScope.loadBootImg(this.IMG.BOTTOM.LIVE_MARK),
            xcPkUrl = $rootScope.loadBootImg(this.IMG.BOTTOM.XC_PK),
            improveUrl = $rootScope.loadBootImg(this.IMG.BOTTOM.IMPROVE),
            liveUrl = $rootScope.loadBootImg(this.IMG.BOTTOM.LIVE),
            imgEle;
        let weixinboxImg;
        switch (currentTitle.text()) {
            case '学习':
                let studyImg = `<img class="tab-study" src="${studyImgUrl}" style="left:${currentTitleLeft}">`;
                imgEle = studyImg;
                break;
            case '成长':
                let moreImg = `<img class="tab-clazz" src="${moreImgUrl}"  style="left:${currentTitleLeft}">`;
                imgEle = moreImg;
                break;
            case '提升':
                // let improveImg = `<img class="tab-improve" src="${improveUrl}"  style="left:${currentTitleLeft}">`;
                let improveImg = `<img class="tab-improve" src="${improveUrl}"  style="left:${currentTitleLeft}">`;
                // imgEle = improveImg;
                imgEle = improveImg;
                break;
            case '霸主':
                // currentTitle.css({'color':'yellow'});
                let xcPkImg = `<img class="tab-clazz" src="${xcPkUrl}"  style="left:${currentTitleLeft}">`;
                imgEle = xcPkImg;
                break;
            case '直播':
                // currentTitle.css({'color':'yellow'});
                let liveImg = `<img class="tab-clazz" src="${liveUrl}"  style="left:${currentTitleLeft}">`;
                imgEle = liveImg;
                weixinboxImg = `<img class="tab-gzh-img" src="${liveMarkImgUrl}"  style="left:${currentTitleBoxLeft}">`;
                break;
            case '我':
                let meImg = `<img class="tab-me" src="${meImgUrl}"  style="left:${currentTitleLeft}">`;
                imgEle = meImg;
                break;
            case '护眼':
                // let weixinImg = `<img class="tab-wx" src="${weixinImgUrl}"  style="left:${currentTitleLeft}">`;
                // weixinboxImg = `<img class="tab-gzh-img" src="${wxboxImgUrl}"  style="left:${currentTitleBoxLeft}">`;
                // imgEle = weixinImg;
                break;
        }


        if (imgEle)element.append(imgEle);
        if (weixinboxImg) {
            element.append(weixinboxImg);
        }
        this.bindOrientationchange(element);

    }

    handleTabTop(element, $rootScope) {
        let currentTitle = element.children().filter(this.TAB_TITLE),
            currentTitleLeft = (currentTitle[0].offsetLeft - 12) + "px",
            workImgUrl = $rootScope.loadBootImg(this.IMG.TOP.WORK),
            workOnImgUrl = $rootScope.loadBootImg(this.IMG.TOP.WORK_ON),
            gameImgUrl = $rootScope.loadBootImg(this.IMG.TOP.GAME),
            gameOnImgUrl = $rootScope.loadBootImg(this.IMG.TOP.GAME_ON),
            diagnoseImgUrl = $rootScope.loadBootImg(this.IMG.TOP.DIAGNOSE),
            diagnoseOnImgUrl = $rootScope.loadBootImg(this.IMG.TOP.DIAGNOSE_ON),
            computeImgUrl = $rootScope.loadBootImg(this.IMG.TOP.COMPUTE),
            computeOnImgUrl = $rootScope.loadBootImg(this.IMG.TOP.COMPUTE_ON),
            imgEle,
            imgOnEle;
        switch (currentTitle.text()) {
            case '作业':
                let studyImg = `<img class="tab-work tab-top-img" src="${workImgUrl}" style="left:${currentTitleLeft}">`;
                let studyOnImg = `<img class="tab-work-on tab-top-img-on" src="${workOnImgUrl}" style="left:${currentTitleLeft}">`;
                imgEle = studyImg;
                imgOnEle = studyOnImg;
                break;
            case '游戏':
                let gameImg = `<img class="tab-game tab-top-img" src="${gameImgUrl}"  style="left:${currentTitleLeft}">`;
                let gameOnImg = `<img class="tab-game-on tab-top-img-on" src="${gameOnImgUrl}"  style="left:${currentTitleLeft}">`;
                imgEle = gameImg;
                imgOnEle = gameOnImg;
                break;
            /* case '诊断':
             let diagnoseImg = `<img class="tab-diagnose tab-top-img" src="${diagnoseImgUrl}"  style="left:${currentTitleLeft}">`;
             let diagnoseOnImg = `<img class="tab-diagnose-on tab-top-img-on" src="${diagnoseOnImgUrl}"  style="left:${currentTitleLeft}">`;
             imgEle = diagnoseImg;
             imgOnEle = diagnoseOnImg;
             break;*/
            case '速算':
                imgEle = `<img class="tab-compute tab-top-img" src="${computeImgUrl}"  style="left:${currentTitleLeft}">`;
                imgOnEle = `<img class="tab-compute-on tab-top-img-on" src="${computeOnImgUrl}"  style="left:${currentTitleLeft}">`;
                break;
        }
        element.append(imgEle);
        element.append(imgOnEle);
        this.bindOrientationchange(element);
    }

    tabInit(element, $rootScope) {
        let me = this;
        this.$timeout(()=> {
            // if (element.parent().parent().attr("custom") === "bottom") {

            me.handleTabBottom(element, $rootScope);
            if (element.is('.tab-item-active')) {
                element.find('img').addClass('tab-bottom-on');
            }
            // return;
            // }
            // if (element.parent().parent().attr("custom") === "top") {
            //     me.handleTabTop(element, $rootScope);
            //     return;
            // }
        });
    }
}
TabItemController.$inject = ["$scope", "$timeout", "tabItemService", "$state"];

class TabItemService {

    constructor($timeout, $ionicTabsDelegate) {
        this.TAB_TITLE = ".tab-title";//tab项内的文字
        this.$timeout = $timeout;
        this.$ionicTabsDelegate = $ionicTabsDelegate;
    }

    handleRedraw(currentTitleLeft, ele, currentTitleBoxLeft,currentTitle) {
        if ($(ele).is("img")) {
            ele.style.left = currentTitleLeft.indexOf('-') > -1 ? '-1000px' : currentTitleLeft;
            if ($(ele).hasClass('tab-gzh-img')) {
                ele.style.left = parseInt(currentTitleBoxLeft)-10+'px'
            }
        }
    }

    handleBottomTabAnimate(aEleArray) {
        let findBottomOnEle = aEleArray.find('.tab-bottom-on');
        let findBottomOnParentEle = findBottomOnEle.parent('.tab-item-active');
        if (findBottomOnParentEle.length) return; //表示当前底部按钮已经是点击上的，就返回
        let activeImgEle = aEleArray.filter('.tab-item-active').find('img');
        if (!findBottomOnEle.length) {
            activeImgEle.addClass('tab-bottom-on');
            return;
        }
        let findBottomOnEleLeft = findBottomOnEle[0].style.left;
        let activeImgEleLeft = activeImgEle[0].style.left;
        findBottomOnEle.removeClass('tab-bottom-on');
        activeImgEle[0].style.left = findBottomOnEleLeft;
        activeImgEle.addClass('tab-bottom-on');
        $(activeImgEle).animate({left: activeImgEleLeft}, 400);

    }

    redrawTabPosition(type) {
        let me = this;
        let hasLoadAnimate = false;
        $('.tab-nav.tabs').each((index, tabNavEle)=> {
            let aEleArray = $(tabNavEle).children('a');
            aEleArray.each((index, aEle)=> {
                let currentTitle = $(aEle).children().filter(this.TAB_TITLE);
                let currentTitleTempLeft = currentTitle[0].offsetLeft;
                let currentTitleLeft = (currentTitleTempLeft - 12) + "px";
                let currentTitleBoxLeft = (currentTitleTempLeft + 10) + "px";
                $(aEle).children().each((index, ele)=>me.handleRedraw(currentTitleLeft, ele, currentTitleBoxLeft));
            });
            /* if(!aEleArray.find('.tab-top-img').length&&type==='click'&&!hasLoadAnimate){
             hasLoadAnimate=true;
             me.handleBottomTabAnimate(aEleArray);
             }*/

        });
    }


    hideAllTabs() {
        // $(".tab-nav").each((index, ele)=> $(ele).addClass("tabs-item-hide"));
        this.$ionicTabsDelegate.$getByHandle("allere-index-tabs").showBar(false);
    }

    showAllTabs() {
        //this.setImgInitHide();
        // $(".tabs-item-hide").each((index, ele)=> $(ele).removeClass("tabs-item-hide"));
        //this.setImgShow();
        this.$ionicTabsDelegate.$getByHandle("allere-index-tabs").showBar(true);
    }


}
TabItemService.$inject = ["$timeout", "$ionicTabsDelegate"];

directives.service('tabItemService', TabItemService);
directives.controller('tabItemController', TabItemController);
directives.directive('tabItem', ["$timeout", "$rootScope", "tabItemService", "$state", function ($timeout, $rootScope, tabItemService, state) {
    return {
        restrict: 'C',
        controller: "tabItemController as ctrl",
        link: function ($scope, element, attr, ctrl) {
            ctrl.tabInit(element, $rootScope);
            if ($(element).children().filter('.tab-title').text() === '护眼') {
                $(element).parent().append($(element));
            }
            element.on('click', (ev)=> {
                let tabName = $(ev.currentTarget).children().filter('.tab-title').text();
                let routeUrl = '';
                switch (tabName) {
                    case '我':
                        routeUrl = "home.me";
                        break;
                    case "成长":
                        routeUrl = "home.growing";
                        break;
                    case "护眼":
                        // routeUrl = state.current.name;
                        if (window.cordova && window.cordova.InAppBrowser) {
                            let ref = window.cordova.InAppBrowser.open('http://mp.weixin.qq.com/s/oa_-IYuZwxQUSKp38HeGcg', '_blank', 'location=yes');
                        } else {
                            window.open('http://mp.weixin.qq.com/s/oa_-IYuZwxQUSKp38HeGcg', '_blank', 'location=yes')
                        }
                        break;
                    case "提升":
                        routeUrl = "home.improve";
                        break;
                    case "霸主":
                        routeUrl = "home.diagnose_pk";
                        break;
                    case "直播":
                        routeUrl = "home.live_home";
                        break;
                    default:
                        routeUrl = JSON.parse(localStorage.getItem('studyStateLastStateUrl'));
                }

                $timeout(()=> {
                    if (routeUrl) {
                        if (routeUrl == 'home.diagnose02') {
                            state.go(routeUrl, {isIncreaseScore: $rootScope.isIncreaseScore});
                        } else {
                            state.go(routeUrl);
                        }
                        tabItemService.redrawTabPosition('click');
                    }
                })
            });

        }
    };
}]);
