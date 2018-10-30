/**
 * Created by ZL on 2017/10/20.
 */
import {Inject, View, Directive, select} from '../../module';

@View('pub_work_type', {
    url: '/pub_work_type',
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
        , 'commonService'
        , '$ionicHistory'
        , '$ocLazyLoad'
        , 'workChapterPaperService'
    ]
})

class PubWorkTypeCtrl {
    commonService;
    $ionicHistory;
    $ocLazyLoad;
    workChapterPaperService;
    typeList = [];
    @select(state=>state.profile_user_auth.user.name) userName;
    @select(state=>state.clazz_list) clazzList;
    @select((state)=> {
        let userConfig = state.profile_user_auth.user.config;
        if (!userConfig) return {};
        return state.profile_user_auth.user.config.oc;
    }) hasOralCalculation;
    @select((state)=> {
        let userConfig = state.profile_user_auth.user.config;
        if (!userConfig) return {};
        return state.profile_user_auth.user.config.areaTeachingResearch;
    }) hasAreaEvaluation;

    isShowPersonalQb = false;

    constructor() {

    }

    initData() {
        this.typeList = [
            {
                name: '课时作业',
                type: 1,
                desc: ['> 每课时三套难度层次习题',
                    '> 老师可对每套作业进行编辑、增删',
                    '> 适用于日常练习、同步课时训练'
                ]
            },
            {
                name: '复习巩固',
                type: 2,
                desc: [
                    '> 老师自主组卷，支持跨单元组卷',
                    '> 每套最多可组30道习题',
                    '> 适用于单元、期中、期末复习'
                ],
                newMark: false
            },
            {
                name: '错题集',
                type: 3,
                desc: ['> 作业错题集，支持跨课时组卷',
                    '> 智能匹配同类题，可组卷重练巩固',
                    '> 适用于同步纠错、课时复习'
                ]
            },
            {
                name: '寒假作业（2018）',
                type: 4,
                desc: ['> 无需老师布置，1月25日自动发布',
                    '> 智能批改，即时数据统计，省心省力',
                    '> 教研专家出题，激发兴趣'
                ],
                newMark: true
            },
            {
                name: '口算比赛',
                type: 5,
                desc: ['> 老师可跨单元组卷，发起速算比赛',
                    '> 可手写或键盘输入，即时数据统计',
                    '> 适用于每日练习，小测验等'
                ]
            },
            {
                name: '区域测评',
                type: 6,
                desc: ['> 测评负责人自主组卷，支持跨单元组卷',
                    '> 一键布置给区域内所有班级的学生',
                    '> 适用于阶段复习，统一测评'
                ],
                newMark: true
            }
            ,
            {
                name: '我的题库',
                type: 7,
                desc: ['>老师自己出题，建设专属题库',
                    '>与平台内知识点互通，可跨单元组卷',
                    '>适用于老师个性化出题'
                ]
            }
        ];
        if (this.hasOralCalculation) {
            this.typeList[0].name = "课时作业（含口算作业）";
        } else {
            this.typeList[0].name = "课时作业"
        }

    }

    clickEvent(list) {
        if (list.type == 1) {
            this.goWorkPaperBank();
        } else if (list.type == 2) {
            this.getStateService().go('pub_review_work', {urlFrom: 'pub_work_type'})
        } else if (list.type == 3) {
            this.goErrorQuestionCollection();
        } else if (list.type == 4) {
            this.getStateService().go('holiday_work_pub_review', {urlFrom: 'pub_work_type'})
        } else if (list.type == 5) {
            this.getStateService().go('oral_assemble_paper', {urlFrom: 'pub_work_type'})
        } else if (list.type == 6) {
            this.getStateService().go('area_evaluation_work')
        } else if (list.type == 7) {
            this.getStateService().go('my_question_bank', {urlFrom: 'my_question_bank'})
        }
    }


    /**
     * 同步作业
     */
    goWorkPaperBank() {
        if (!this.getRootScope().isAdmin && !this.clazzList.length) {
            let template = '<p>您还没有创建班级，点击“班级”，然后再点击“+”创建班级</p>';
            this.commonService.showAlert("温馨提示", $('<div></div>').append(template).html(), '确定');
            return;
        }
        this.getRootScope().oralCalculationGuidFlag = false;
        this.getRootScope().isShowGuideFlag = false;
        this.getStateService().go("work_paper_bank", {urlFrom: 'work_list'});
    }

    /**
     * 错题集
     */
    goErrorQuestionCollection() {
        this.getStateService().go('error_question_c', {urlFrom: "work_list"});
    }

    back() {
        if (this.$ionicHistory.backView() !== null
            && this.$ionicHistory.backView().stateName != 'work_paper_bank'
            && this.$ionicHistory.backView().stateName != 'pub_review_work'
            && this.$ionicHistory.backView().stateName != 'error_question_c'
            && this.$ionicHistory.backView().stateName != 'work_pub'
            && this.$ionicHistory.backView().stateName != 'oral_assemble_paper'
            && this.$ionicHistory.backView().stateName != 'pub_oral_assemble_paper'
            && this.$ionicHistory.backView().stateName != 'pub_paper_to_stu') {
            this.$ionicHistory.goBack()
        } else {
            this.go('home.work_list', {category: 2, workType: 2});
        }
    }

    isIos() {
        return this.getRootScope().platform.IS_IPHONE || this.getRootScope().platform.IS_IPAD || this.getRootScope().platform.IS_MAC_OS;
    }

    onBeforeLeaveView() {
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    ensurePageData() {
        /**
         * 检查班级人数是都满10|5人
         */
        this.workChapterPaperService.checkClassStudentCount(false).then((data)=> {
            if(data&&data.code==200){
                if (data.teacherDbView) {
                    this.isShowPersonalQb = false;
                } else {
                    this.isShowPersonalQb = true;
                }
            }
        }, ()=> {
            this.isShowPersonalQb = false;
        });
    }

    onAfterEnterView() {
        this.initData();
        this.$ocLazyLoad.load("t_work_publish1");
        this.$ocLazyLoad.load("t_work_publish2");
        this.$ocLazyLoad.load("t_work_publish3");
        this.$ocLazyLoad.load("t_work_publish4");
        this.$ocLazyLoad.load("t_personal_qb");
    }


    configDataPipe() {
        this.dataPipe
            .when(()=>!this.initCtrl)
            .then(()=> this.initCtrl = true)
            .then(()=> {
                this.guideFlag = this.commonService.getSimulationClazzLocalData();
            })
    }

    getHighLightEle() {
        this.currentShowEle = $(".type-item").eq(0);
    }
}

export default PubWorkTypeCtrl;