/**
 * Created by ZL on 2018/2/1.
 */
import audioSrc from './../../../audios/improve-video.mp3';
import {Inject, View, Directive, select} from '../../module';
@View('home.improve', {
    url: '/improve',
    views: {
        "improve": {
            template: require('./page.html')
        }
    },
    styles: require('./style.less'),
    inject: ['$scope',
        '$state',
        '$rootScope',
        '$stateParams',
        '$window',
        '$ngRedux',
        '$ionicHistory',
        '$ionicLoading',
        'commonService',
        '$timeout',
        '$ocLazyLoad',
        '$ionicSlideBoxDelegate']
})

class improveCtrl {
    $ocLazyLoad;
    commonService;
    $timeout;
    $window;
    $ionicSlideBoxDelegate;
    selectIndex = -1;
    audioSrc = audioSrc;
    descAudio = $('#improve-video')[0];

    @select(state=>state.profile_user_auth.user.name) userName;

    constructor() {
    }

    initFlags() {
        this.initCtrl = false; //ctrl初始化后，是否已经加载过
    }

    initData() {
        this.allModule = [
            {
                moduleName: '期末冲刺月',
                type: 'final_sprint',
                imgUrl: 'import_images/stu_improve_module_01.png',
                bigImgUrl: 'import_images/stu_improve_module_01_big.png',
            }, {
                moduleName: '寒假新知堂',
                type: 'winter_camp',
                imgUrl: 'import_images/stu_improve_module_02.png',
                bigImgUrl: 'import_images/stu_improve_module_02_big.png',
            }, {
                moduleName: '学霸驯宠记',
                type: 'diagnose',
                imgUrl: 'import_images/stu_improve_module_03.png',
                bigImgUrl: 'import_images/stu_improve_module_03_big.png',
            }
        ];
    }


    isMobile() {
        return this.getRootScope().platform.isMobile() && this.getRootScope().weChatPluginInstalled;
    }

    isIos() {
        return this.getRootScope().platform.IS_IPHONE || this.getRootScope().platform.IS_IPAD || this.getRootScope().platform.IS_MAC_OS;
    }

    onBeforeLeaveView() {
        if (this.descAudio) this.descAudio.pause();
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    ensurePageData() {
    }

    onAfterEnterView() {
        this.initFlags();
        this.initData();
        if (this.descAudio) this.descAudio.play();
        /* this.$ocLazyLoad.load("m_holiday_work");
         this.$ocLazyLoad.load("m_final_sprint");
         this.$ocLazyLoad.load("m_diagnose");
         this.$ocLazyLoad.load("m_work");
         this.$ocLazyLoad.load("m_winter_camp");*/


        // this.$ocLazyLoad.load('m_home');
        // this.$ocLazyLoad.load("m_olympic_math_microlecture");

        // this.$ocLazyLoad.load("m_oral_calculation");

        // this.$ocLazyLoad.load("m_game_map");
        // this.$ocLazyLoad.load("m_math_game");
        // this.$ocLazyLoad.load("m_compute");
        // this.$ocLazyLoad.load("m_reward");

        // this.$ocLazyLoad.load("m_xly");
        // this.$ocLazyLoad.load("m_me");
        // this.$ocLazyLoad.load("m_diagnose_pk");
        // this.$ocLazyLoad.load("m_user_auth");
        // this.$ocLazyLoad.load("m_olympic_math_home");

        // this.$ocLazyLoad.load("m_pet_page");


        this.$timeout(()=> {
            this.selectModule(1);
        }, 100)

    }

    configDataPipe() {
    }

    back() {
    }

    slideChange() {
        let index = this.$ionicSlideBoxDelegate.$getByHandle('improve-module-select-box').currentIndex();
        this.changeSelectModuleIndex(index);
    }

    changeSelectModuleIndex(index) {
        if (this.selectIndex != index) {
            $('.select-options-list .option-item .option-item-img').eq(this.selectIndex).addClass('option-item-img-animation02');
            $('.select-options-list .option-item .option-item-img').eq(this.selectIndex).removeClass('option-item-img-animation01');

            $('.select-options-list .option-item .option-item-img').eq(index).addClass('option-item-img-animation01');
            $('.select-options-list .option-item .option-item-img').eq(index).removeClass('option-item-img-animation02');
            this.selectIndex = index;
        }
    }

    showPreGuide($event) {
        $event.stopPropagation();
        this.$ionicSlideBoxDelegate.$getByHandle('improve-module-select-box').previous(200);
    }

    showNextGuide($event) {
        $event.stopPropagation();
        this.$ionicSlideBoxDelegate.$getByHandle('improve-module-select-box').next(200)
    }

    selectModule(index) {
        this.changeSelectModuleIndex(index);
        this.$ionicSlideBoxDelegate.$getByHandle('improve-module-select-box').slide(index);
    }

    enterModule(index) {
        if (index == undefined) index = this.selectIndex || 0;
        if (this.allModule[index].type == 'final_sprint') {
            this.go('final_sprint_home');

        } else if (this.allModule[index].type == 'winter_camp') {
            this.go('home.winter_camp_home');

        } else if (this.allModule[index].type == 'diagnose') {
            this.go('home.diagnose02', 'forward');
        }
    }
}
