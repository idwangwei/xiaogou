/**
 * Created by 彭建伦 on 2015/7/21.
 */
import {View} from "./../../module";

@View("home", {
    url: '/home',
    abstract: true,
    template: require('./home.html'),
    styles: require('./home.less'),
    inject: [
        '$scope',
        'commonService',
        '$state',
        '$http',
        '$ionicTabsDelegate',
        'ngWorkerRunner',
        '$rootScope',
        '$timeout',
        'jPushManager',
        '$log',
        'messageServices',
        'finalData',
        '$ngRedux',
        'profileService',
        'pageRefreshManager',
        '$ocLazyLoad',
        '$interval',
    ]
})
class StuHomeCtrl {
    $ocLazyLoad;
    $http;
    afterEnterViewTime = 0;
    $interval;
    constructor() {
        this.initFlags();
    }

    initFlags() {
        this.notifyUnPassedClazzListCount = 0;
        this.isIos = this.commonService.judgeSYS() === 2;
        this.msgItemLine = window.innerWidth < 768 ? 4 : 2;
    }

    showWinterWork() {
        return this.getRootScope().showWinterWorkFlag;
    }

    hideWinterAd() {
        this.getRootScope().showWinterWorkFlag = false;
    }

    hideWinterBroadcast(event) {
        if ($(event.target).hasClass('work-backdrop')) {
            this.getRootScope().showWinterBroadcast = false;
        }
    }

    hideDiagnoseAd() {
        this.getRootScope().showDiagnoseAdFlag = false;
    }

    hideOlympicMathAd() {
        this.getRootScope().showOlympicMathAdFlag = false;
    }

    setInfoScroll(event) {
        event.stopPropagation();
        event.currentTarget.flag = !event.currentTarget.flag;
        event.currentTarget.flag ? event.currentTarget.stop() : event.currentTarget.start();
    }

    onUpdate() {
        if (this.getRootScope().unPassedClazzListShown) return;
        // this.fetchClazzList((success) => {
        //     success && this.notifyUnPassedClazzList();
        // });
    }

    showTip() {
        this.commonService.showAlert('温馨提示', '即将开放，敬请期待');
        return;
    }


    /**
     * 提示没有通过老师批准的班级(取消提示未通过人数，暂时注释掉)
     */
    notifyUnPassedClazzList() {
        /* let $rootScope = this.getRootScope();
         if ($rootScope.unPassedClazzListShown)return; //已经显示过为审核通过班级的列表,则不需要再次显示
         this.clazzList = this.getState().profile_clazz.clazzList;
         if (!this.clazzList || this.clazzList.length == 0 || $rootScope.unPassedClazzListShown || !this.isLogIn)return;
         let unPassedClazzList = [];
         for (let i = 0; i < this.clazzList.length; i++) {
             let clazz = this.clazzList[i];
             if (clazz.status == 0)
                 unPassedClazzList.push(clazz);
         }
         if (unPassedClazzList.length == 0)return;

         let template = $('<div><p>老师还未批准下列班级申请</p></div>').css({'text-align': 'center'});
         unPassedClazzList.forEach(function (info) {
             var teacher_name = info.teacher, showTeacherName;
             var len = teacher_name.length;
             if (len) {
                 showTeacherName = teacher_name[0];
                 for (var i = 1; i < len; i++) {
                     showTeacherName += '*';
                 }
             }
             let item = $(`<p  style="font-size: 16px;">${info.name}<br><span>（${showTeacherName}老师）</span></p>`);
             template.append(item);
         });
         this.commonService.showAlert("温馨提示", $('<div></div>').append(template).html(), '确定');
         $rootScope.unPassedClazzListShown = true;*/
    }

    onEnterView() {
        if (this.$ionicTabsDelegate._instances.length)
            this.$ionicTabsDelegate._instances[0].showBar(true);
    };

    onBeforeEnterView() {
        //把flag放在beforeEnter，notifyUnPassedClazzList会先与initFlags,为了解决这个bug
        //老师已经通过了学生，学生登录后，还会提示一次“老师未通过学生XX班级”，退了再登，就不提示了
        //
        // this.initClazzList = false;
        this.tabInit = {
            flag: true
        }
    }

    configDataPipe() {
        this.dataPipe
            .when(() => {
                return !this.initClazzList && !this.isFetchClazzProcessing
            })
            .when(() => {
                if (!this.isLogin)
                    this.notifyUnPassedClazzListCount = 0;
                return this.isLogIn
            })
            .then(() => {
                this.initClazzList = true;
                this.fetchClazzList();
            })
            .next()
            .when(() => this.initClazzList && this.isLogIn)
            .then(() => {
                if (!this.notifyUnPassedClazzListCount) {
                    this.notifyUnPassedClazzList();
                    this.notifyUnPassedClazzListCount++;
                }
            });
    }

    /**
     * 底部【学习】tab点击回调
     * 从其他底部tab切换回到学习时，路由去到上次离开【学习】时的模块首页路由
     */
    bottomTabClick() {
        let currentUrl = this.getStateService().current.name;
        debugger
        //如果当前路由就在【学习】tab,不做处理，在【成长】、【我】主页点击【学习】才做处理
        if (currentUrl === 'home.me' || currentUrl === 'home.growing' || currentUrl === 'home.official_accounts' || currentUrl === 'home.diagnose_pk'|| currentUrl === 'home.improve'|| currentUrl === 'home.live_home') {
            let studyStateLastStateUrl = this.commonService.getLocalStorage('studyStateLastStateUrl') || 'home.study_index';
            this.$ionicTabsDelegate.select(0);
            this.go(studyStateLastStateUrl, "none", {isIncreaseScore: this.getRootScope().isIncreaseScore});
        }
    }

    topTabClick(urlRoute) {
        if (urlRoute && urlRoute != this.getStateService().current) {
            this.go(urlRoute, "none");
        }
    }

    goDiagnosePage() {
        this.getRootScope().showDiagnoseGuide = false;
        // this.go('home.diagnose02', 'forward', {isIncreaseScore: true});
        this.go('home.diagnose02',{backWorkReportUrl: 'diagnose-ad-dialog',isIncreaseScore:true});
    }

    hideDiagnoseGuide() {
        this.getRootScope().showDiagnoseGuide = false;
    }

    onAfterEnterView() {
        this.afterEnterViewTime++;
        if (this.afterEnterViewTime === 1) {
            this.$ocLazyLoad.load("m_live");
            this.$ocLazyLoad.load("m_improve");
            this.$ocLazyLoad.load("m_winter_camp");
            this.$ocLazyLoad.load("m_olympic_math_microlecture");
            this.$ocLazyLoad.load("m_holiday_work");
            this.$ocLazyLoad.load("m_question_every_day");
            this.$ocLazyLoad.load("m_oral_calculation");
            this.$ocLazyLoad.load("m_final_sprint");
            this.$ocLazyLoad.load("m_game_map");
            this.$ocLazyLoad.load("m_math_game");
            this.$ocLazyLoad.load("m_compute");
            this.$ocLazyLoad.load("m_reward");
            this.$ocLazyLoad.load("m_diagnose");
            this.$ocLazyLoad.load("m_xly");
            this.$ocLazyLoad.load("m_me");
            this.$ocLazyLoad.load("m_diagnose_pk");
            this.$ocLazyLoad.load("m_user_auth");
            this.$ocLazyLoad.load("m_olympic_math_home");
            this.$ocLazyLoad.load("m_work");
            this.$ocLazyLoad.load("m_pet_page");
            // this.autoShowAd(this.loginName);
        }
    }

    mapActionToThis() {
        let ps = this.profileService;
        return {
            fetchClazzList: ps.fetchClazzList.bind(ps)
        }
    }

    mapStateToThis(state) {
        return {
            clazzList: state.profile_clazz.clazzList,
            isLogIn: state.profile_user_auth.isLogIn,
            isFetchClazzProcessing: state.profile_clazz.isFetchClazzProcessing,
            isDuringNationalDay: state.profile_show_flag.is_during_national_day,
            hasClickedNationalDayGiftPackage: state.profile_show_flag.has_clicked_national_day_gift_package_11_11,
            loginName: state.profile_user_auth.user.loginName,
        }
    }
    autoShowAd(name) {
        this.getRootScope().showWinterCampAd = false;
        let mark=name+"WinterCampAdFlag";
        if(localStorage.getItem(mark)==null) localStorage.setItem(mark,0);
        if (localStorage.getItem(mark)==0) {
            localStorage.setItem(mark,1);
            this.getRootScope().showWinterCampAd = true;
            /*this.getRootScope().autoShowWinterCampAdTime = 5;

            let timer = this.$interval(()=> {
                this.getRootScope().autoShowWinterCampAdTime--;
                if (this.getRootScope().autoShowWinterCampAdTime < 0) {
                    this.getRootScope().showWinterCampAd = false;
                    this.$interval.cancel(timer);
                }
            }, 1000)*/
        }
    }
}
