/**
 * Created by WL on 2017/9/5.
 */
import _find from 'lodash.find';
import _values from 'lodash.values';
import {Inject, View, Directive, select} from 'ngDecorator/ng-decorator';

@Directive({
    selector: 'oralCalculationWorkList',
    template: require('./page.html'),
    styles: require('./style.less'),
    replace: true
})

@View('home.oral_calculation_work_list', {
    url: '/oral_calculation_work_list',
    views: {
        "study_index": {
            template: '<oral-calculation-work-list></oral-calculation-work-list>'
        }
    }
})

@Inject('$scope', '$state', '$rootScope', '$stateParams', '$ngRedux', 'themeConfig', 'commonService', 'workStatisticsServices'
    ,'profileService', '$ngRedux', 'pageRefreshManager', '$ionicPopup', 'paperService', '$ionicTabsDelegate'
    , '$timeout', 'finalData', '$ionicSideMenuDelegate', 'subHeaderService', 'dateUtil', 'pageRefreshManager', '$rootScope'
    , '$ionicSlideBoxDelegate', '$ionicTabsDelegate', '$ionicPopover', '$ionicScrollDelegate', 'homeInfoService'
    , '$ionicPopover', '$ionicHistory', '$ionicModal', 'olympicMathService','oralCalculationPaperServer'
)
class oralCalculationWorkList {
    themeConfig;
    $stateParams;
    workStatisticsServices;
    olympicMathService;
    profileService;
    oralCalculationPaperServer;

    commonService;
    @select(state => state.profile_user_auth.user) userInfo;
    @select(state => state.olympic_math_selected_grade) olympicMathSelectedGrade;
    @select(state => state.profile_user_auth.user.name) userName;
    @select(state => state.profile_user_auth.user.userId) userId;
    @select(state => state.profile_clazz.passClazzList) passClazzList;
    @select(state => state.profile_clazz.selfStudyClazzList) selfStudyClazzList;
    @select(state => state.wl_selected_clazz) wl_selected_clazz;
    @select(state => state.wl_pagination_info) wl_pagination_info;
    @select(state => state.wl_is_worklist_loading) wl_is_worklist_loading;
    @select(state => state.wl_selected_work) wl_selected_work;
    @select(state => state.wl_is_fetch_status_loading) wl_is_fetch_status_loading;
    @select(state => state.app_info.onLine) onLine;
    @select(state => state.work_list_route.urlFrom) stateUrlFrom;
    @select(state => state.olympic_math_selected_clazz) olympicMathSelectedClazz;
    @select(state => state.teacher_create_msg_info) teacherCreateMsgInfo;
    @select(state => state.profile_user_auth.user.vips) vips;
    @select(state => state.wl_clazz_list_with_works) clazz_work_list;

    // trophyRankData: trophyRankData,
    // olympicVip: olympicVip,
    // @select(state => state.wl_pagination_info) workList; //已发布作业列表

    constructor() {
        /*后退注册*/

    }

    mapActionToThis() {
        let ps = this.profileService;
        let his = this.homeInfoService;
        return {
            fetchWorkList: this.workStatisticsServices.fetchWorkList,
            changeClazz: this.workStatisticsServices.changeClazz,
            getPaperStatus: this.workStatisticsServices.getPaperStatus,
            changeGrade: this.olympicMathService.changeGrade.bind(this.olympicMathService),
            saveTeacherMsg:this.profileService.saveTeacherMsgInfo
        }
    }


    initFlags() {
        this.onLine = true;
        this.isIos = this.commonService.judgeSYS() === 2;
        this.screenWidth = window.innerWidth;
        this.selectedClazzInitlized = false; //ctrl初始化后，是否已经选择过一次班级
        this.workListInitlized = false; //ctrl初始化后，是否已经加载过一次作业列表
        this.loadMoreExecuteCount = 0; //从ion-infinite-scroll调用加载列表方法的次数
        this.SHOW_NAME = {P: "家长", S: '学生', T: '老师'};//在评价明细页面显示的名称
        this.moreFlag = false;//是否出现加载更多的指令
        this.moreFlagMapForEveryClazz = {};
        this.initCount = 0;
        this.workStatisticsServices.routeInfo.urlFrom = this.stateUrlFrom;
        this.initCModal = false;//是否已初始化modal
        this.initGradeFlag = false;
        this.showDiaglog = true;
        this.isVip = false;
        this.initCtrl = false;
        this.glitterFlag = false;
        this.showMsgButnFlag = false;
    }

    initData() {
        let modalStyle = "top: 20%!important;right: 20%!important;bottom: 20%!important;left: 20%!important;min-height: 240px!important;width: 60%!important;height: auto;";
        this.modalStyle = this.screenWidth >= 680 ? modalStyle : '';
        this.Grades = [
            /*   {"num": 1, "name": "一年级上册"},
             {"num": 2, "name": "一年级下册"},
             {"num": 3, "name": "二年级上册"},
             {"num": 4, "name": "二年级下册"},*/
            {"num": 5, "name": "三年级上册"},
            /*{"num": 6, "name": "三年级下册"},
             {"num": 7, "name": "四年级上册"},
             {"num": 8, "name": "四年级下册"},
             {"num": 9, "name": "五年级上册"},
             {"num": 10, "name": "五年级下册"},
             {"num": 11, "name": "六年级上册"},
             {"num": 12, "name": "六年级下册"}*/
        ];
    }

    initModal() {
        // //初始化年级modal页
        // this.$ionicModal.fromTemplateUrl('gradesSelect.html', {
        //     scope: this.getScope(),
        //     animation: 'slide-in-up'
        // }).then((modal) => {
        //     this.gradesSelectModal = modal;
        // });
        // this.getScope().$on('$destroy', ()=> {
        //     this.gradesSelectModal.remove();
        // });
    }

    /**
     * 打开年级选择modal
     */
    // openGradesSelectModal(tag, type) {
    //     this.gradesSelectModal.show();
    // }

    /**
     * 关闭年级modal
     */
    // closeGradesSelectModal() { //关闭modal
    //     this.gradesSelectModal.hide();
    // }


    /**
     * 去选择年级
     */
    // olympicMathSelectGrade(grade) {
    //     // this.closeGradesSelectModal();
    //     if (grade.num === this.olympicMathSelectedGrade.num)  return; //如果选择年级和当前选中年级一致就不处理
    //     this.changeGrade(grade);
    //     this.fetchWorkList(false, this.loadCallback.bind(this), this.getSelectedClazz());
    //     this.getCurrentWorkList();
    // }



    setMyParams(){
        this.getCurrentWorkList();
        this.clazzList = [];
        angular.forEach(this.passClazzList, (item)=> {
            if (item.type != 200) this.clazzList.push(item);
        });

        this.olympicVip = null;
        angular.forEach(this.vips, (item, key)=> {
            if (item['mathematicalOlympiad']) this.olympicVip = item['mathematicalOlympiad'];
        });
        this.isVip = !!_find(_values(this.olympicVip), (v)=> {
            return v > -1
        });
    }

    getCurrentWorkList(){
        this.workList = this.clazz_work_list[this.wl_selected_clazz.id];
    }

    onReceiveProps() {

    }

    configDataPipe() {
        this.dataPipe
            .when(() => !this.initCtrl)
            .then(() => {
                this.initCtrl = true;

            })
    }

    ensurePageData() {
        if (!this.initCModal) {
            this.initCModal = true;
            this.initModal();
            //todo:默认年级，没有购买就默认他的班级所属年级
            let findGrade = _find(this.Grades, {num: 5});
            this.changeGrade(findGrade);
        }
       /* if (this.isComeFromOlympicMathTeacher()) {
            this.ensureWorkListForOlympicMathTeacher();
            return;
        }*/
        if (this.isFromSelfTrain()) {
            this.ensureWorkListForOlympicMathSelf();
            return;
        }
        this.ensureSelectedClazz();
        this.ensureWorkList();

    }

    isComeFromOlympicMath() {
        if (this.stateUrlFrom && this.stateUrlFrom.indexOf(this.finalData.URL_FROM.OLYMPIC_MATH) > -1)
            return true;
        return false;
    }

    isComeFromOlympicMathTeacher() {
        if (this.stateUrlFrom && this.stateUrlFrom.indexOf(this.finalData.URL_FROM.OLYMPIC_MATH_T) > -1)
            return true;
        return false;
    }

    isFromSelfTrain() {
        if (this.stateUrlFrom && this.stateUrlFrom.indexOf(this.finalData.URL_FROM.OLYMPIC_MATH_S) > -1)
            return true;
        return false;
    }

    getSelectedClazz() {
        if (this.stateUrlFrom && this.stateUrlFrom.indexOf(this.finalData.URL_FROM.OLYMPIC_MATH_T) > -1)
            return this.olympicMathSelectedClazz;
        else if (this.isFromSelfTrain())
            return {id: this.userId};
        return this.wl_selected_clazz;
    }

    onUpdate() {
        //
        // if (!this.$ngRedux.getState().wl_is_worklist_loading){
        //     console.warn('================'+'10秒刷新');
        //     this.fetchWorkList(false, this.loadCallback.bind(this), this.getSelectedClazz());
        //     this.getCurrentWorkList();
        // }
    }

    /**
     * 保证首次进入ctrl选择班级
     */
    ensureSelectedClazz() {
        //确保选择的班级信息为最新班级列表中的信息
        if (this.clazzList && this.clazzList.length != 0 && !this.selectedClazzInitlized) {
            let clazz,
                currentSelectClazz = this.wl_selected_clazz.id ? _find(this.clazzList, {id: this.wl_selected_clazz.id}) : undefined;
            if (!currentSelectClazz) {
                clazz = this.clazzList[0];
            }
            else {
                clazz = currentSelectClazz;
            }
            this.selectedClazzInitlized = true;
            this.changeClazz(clazz);
            if (clazz.id && this.moreFlagMapForEveryClazz[clazz.id] == undefined) {
                this.moreFlagMapForEveryClazz[clazz.id] = true;
                this.moreFlag = true;
            }
        }
    }

    /**
     * 保证首次进入ctrl加载作业列表
     */
    ensureWorkList() {
        //如果作业列表正在加载或者如果没有选择班级,则return，防止重复加载
        if (!this.wl_selected_clazz || !this.wl_selected_clazz.id || !this.selectedClazzInitlized)return;

        if (!this.workListInitlized) {
            this.workListInitlized = true;
            this.getRootScope().selectedClazz = this.wl_selected_clazz;
            if (!this.$ngRedux.getState().wl_is_worklist_loading) {
                console.warn('================' + '初始化获取');

                let limitQuery;
                if (this.initCtrl && this.workList && this.workList.length) {
                    limitQuery = {lastKey: "", quantity: this.workList.length};
                    console.warn('================' + 'changePaginationInfo' + limitQuery);
                }
                this.fetchWorkList(false, this.loadCallback.bind(this), this.wl_selected_clazz, limitQuery);
                this.getCurrentWorkList();
                this.initShowMsgFromTeacherFlag();
                if (!this.initCtrl) {
                    this.initCtrl = true
                }
            }

        }
    }

    /**
     * 保证首次进入ctrl加载作业列表  针对奥数来自于教师的作业
     */
    ensureWorkListForOlympicMathTeacher() {
        //如果作业列表正在加载或者如果没有选择班级,则return，防止重复加载
        if (!this.olympicMathSelectedClazz || !this.olympicMathSelectedClazz.id || this.selectedClazzInitlized)return;

        if (!this.workListInitlized) {
            this.workListInitlized = true;
            this.getRootScope().selectedClazz = this.olympicMathSelectedClazz;
            if (!this.$ngRedux.getState().wl_is_worklist_loading) {
                console.warn('================' + '奥数初始化获取');

                this.fetchWorkList(false, this.loadCallback.bind(this), this.getSelectedClazz())
                this.getCurrentWorkList();
            }
        }
    }

    /**
     * 保证首次进入ctrl加载作业列表  针对奥数来自于自主训练的作业
     */
    ensureWorkListForOlympicMathSelf() {
        if (!this.workListInitlized) {
            this.workListInitlized = true;
            if (!this.$ngRedux.getState().wl_is_worklist_loading) {
                console.warn('================' + '奥数自主训练初始化获取');

                this.fetchWorkList(false, this.loadCallback.bind(this), this.getSelectedClazz());
                this.getCurrentWorkList();
            }
        }
    }

    onBeforeLeaveView() {
        if(this.glitterTimer) this.$timeout.cancel(this.glitterTimer);
        this.isShowTrophyRank = false;
        this.showDiaglog = false;
        this.$ionicSideMenuDelegate.toggleLeft(false);
        //离开当前页面时，cancel由所有当前页发起的请求
        this.workStatisticsServices.cancelRequestDeferList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        // angular.forEach(this.$ionicSideMenuDelegate._instances, instance=>instance.close());
    }

    onAfterEnterView() {
        this.initFlags();
        this.setMyParams();
        this.initCount++;
        this.ensurePageData();
        this.glitterFlag = true;
        this.showDiaglog = true;
        this.workListInitlized = false;
        if(this.wl_selected_clazz.id)
            this.initShowMsgFromTeacherFlag();
        this.getRootScope().studyStateLastStateUrl = this.getStateService().current.name;

        this.commonService.setLocalStorage('studyStateLastStateUrl', 'home.work_list');
        // if (this.$ionicHistory.backView() && (this.$ionicHistory.backView().stateName === 'select_question')) {//如果改错返回就刷新一次
        //     this.selectedClazzInitlized = true;
        //     this.pullRefresh();
        // }
        if (!this.isComeFromOlympicMath()) {//不是来自奥数的时候，会涉及到班级刷新
            //如果班级列表为空 当前选择班级置为空
            if (!this.clazzList || this.clazzList.length == 0) {
                this.changeClazz();
                return;
            }
            if (!this.wl_selected_clazz || (this.wl_selected_clazz && !this.wl_selected_clazz.id)) {
                this.changeClazz();
                return;
            }
            this.clazzList.find(item => {
                if (item.id === this.wl_selected_clazz.id) {
                    this.changeClazz(item);
                    return true;
                }
            })
        } else {
            this.$ionicSideMenuDelegate.canDragContent(false);//来自班级的时候，禁止划动
        }
        this.countDownStr = "360000"
    }

    back() {
        this.go('home.study_index', 'back');
    }

    backOlympicMathHome() {
        this.go('home.olympic_math_home', 'back');
    }

    /**
     * 点击班级右滑出班级列表
     */
    showMenu() {
        // if (this.wl_selected_clazz.type === 900) return;
        this.$ionicSideMenuDelegate.toggleLeft();
    }

    goStuSituation() {
        let flag = this.isFromSelfTrain();
        if ((this.olympicMathSelectedClazz && this.olympicMathSelectedClazz.id) || flag) {
            this.go('personal-math', 'forward', {from: flag ? 'from-self' : 'from-teacher'});
            return;
        }
        this.getScope().$emit('diagnose.dialog.show', {
            'comeFrom': 'olympic-math',
            'title': '温馨提示',
            'content': '你没有加入奥数班级，暂时没有个人学情。'
        });
    }


    /**
     * 去选择班级
     */
    workListSelectClazz(clazz) {
        this.$ionicSideMenuDelegate.toggleLeft(false);
        if (clazz.id === this.wl_selected_clazz.id)  return; //如果选择班级和当前选中班级一致就不处理
        this.changeClazz(clazz);
        // this.initShowMsgFromTeacherFlag();
        if (this.moreFlagMapForEveryClazz[clazz.id] != undefined) {
            this.moreFlag = this.moreFlagMapForEveryClazz[clazz.id];

        } else {
            this.moreFlagMapForEveryClazz[clazz.id] = false;
            this.moreFlag = false;
        }

        this.selectedClazzInitlized = false; //ctrl初始化后，是否已经选择过一次班级
        this.workListInitlized = false; //ctrl初始化后，是否已经加载过一次作业列表
        this.getCurrentWorkList();
        this.getScope().$emit('fetch_competition_info_from_server');
    }

    /**
     *  上拉作业列表加载更多
     */
    fetWorkListWithLoadMore() {
        if (!this.$ngRedux.getState().wl_is_worklist_loading) {
            console.warn('================' + '上拉加载');

            this.fetchWorkList(true, this.loadCallback.bind(this), this.getSelectedClazz())
            this.getCurrentWorkList();
        } else {
            this.getScope().$broadcast('scroll.infiniteScrollComplete');
        }
    }

    /**
     * 加载作业列表完毕的回调
     * @param loadMore 是否是上划刷新的情况
     * @param loadAllComplete 对应班级下的作业列表是否全部加载完毕
     */
    loadCallback(loadMore, loadAllComplete) {
        this.moreFlag = !loadAllComplete;
        this.$timeout(()=> {
            loadMore ?
                this.getScope().$broadcast('scroll.infiniteScrollComplete') :
                this.getScope().$broadcast('scroll.refreshComplete');
        }, 20);

        //回到work_list页面之前提交了试卷，随机（1/4）概率显示去诊断的提示框
        if (this.getRootScope().isAfterSubmitPaperBackToWorkList && !this.isComeFromOlympicMath()) {//奥数提交作业后，不应该开通诊断
            //用户是否开通了诊断
            let vipDiagnose = _find(this.$ngRedux.getState().profile_user_auth.user.vips, (v)=> {
                return v.hasOwnProperty('diagnose')
            });

            this.getRootScope().isAfterSubmitPaperBackToWorkList = false;
            this.getRootScope().showDiagnoseGuide = !vipDiagnose && Number(Math.random() * 4 + 1).toFixed() === '3';
            // this.getRootScope().showDiagnoseGuide = !vipDiagnose;
        }

    }

    /**
     * 显示信封具体内容
     * @param correctedStu 当前学生
     * @showType  展示区分  1为学生2为老师3家长
     */
    showPraiseDetail(work, showType, $event) {
        $event.stopPropagation();
        let $scope = this.getScope();
        let workStatisticsServices = this.workStatisticsServices;
        let $state = this.$state;
        $scope.wData = workStatisticsServices.wData;
        $scope.wData.correctedPraise = {};
        $scope.wData.correctedPraise.work = work;
        $scope.wData.correctedPraise.showType = showType;
        switch (showType) {
            case 1:
                $scope.wData.correctedPraise.showName = this.SHOW_NAME.S;
                break;
            case 2:
                $scope.wData.correctedPraise.showName = this.SHOW_NAME.T;
                break;
            case 3:
                $scope.wData.correctedPraise.showName = this.SHOW_NAME.P;
                break;
            default:
                $scope.wData.correctedPraise.showName = "";
        }
        this.go("work_praise_detail", "forward");

    }

    /**
     * 学生去评价反馈
     * @param work 当前作业
     * @param $index 当前试卷在列表中的下标
     */
    goPraise(work, $index, $event) {
        $event.stopPropagation();
        let param = {
            workId: work.paperId,
            workInstanceId: work.instanceId
        };
        work.paperIndex = $index;
        this.oralCalculationPaperServer.selectOralPaper(work);
        this.go("work_praise", 'forward', param);
    }

    getPaperStatusCallBack(param, col, $index) {
        if (this.wl_selected_work.failMsg) {
            this.commonService.alertDialog(this.wl_selected_work.failMsg, 1500);
            return;
        }
        if (this.wl_selected_work.status == -1) {//表示该作业已经被老师删除
            this.commonService.showAlert('信息提示', '该作业已经被老师删除').then(function () {
                this.workList.splice($index, 1);
            });
            return;
        }
        if (this.wl_selected_work.status < 3) {//1作业还没开始做,2作业部分完成，未提交的问题可以修改
            param = {
                paperId: col.paperInfo.paperId,
                paperInstanceId: col.paperInfo.instanceId,
                redoFlag: 'false', //是否是提交后再进入select_question做题
                urlFrom: 'workList',
                // questionIndex: $index
            };
            col.paperInfo.paperIndex = $index; //将该试卷在列表中的下标一起存入selectedWork中
            this.getRootScope().selectQuestionUrlFrom = 'workList';
            this.go("select_question", "forward", param); //返回做题
            return;
        }
        if (this.wl_selected_work.status == 3) {//作业已提交但未批改
            this.commonService.alertDialog("作业正在批改中", 1500);
            return;
        }
        col.paperInfo.paperIndex = $index; //将该试卷在列表中的下标一起存入当前试卷中
        this.getRootScope().selectQuestionUrlFrom = 'detail';


        if (this.isComeFromOlympicMath())
            this.go("olympic_math_work-detail", "forward", param);
        else if (col.paperInfo.publishType == 8) {
            this.go("competition_work_detail", "forward", param);
        }
        else {
            this.go("work_detail", "forward", param);
        }
    }

    /**
     * 显示作业明细统计
     */
    showWorkDetail(col, $index) {
        if (this.wl_is_fetch_status_loading) return;

        let commonService = this.commonService;
        this.oralCalculationPaperServer.selectOralPaper(col.paperInfo);
        let param = {
            paperId: col.paperInfo.paperId,
            paperInstanceId: col.paperInfo.instanceId
        };
        this.getPaperStatus(param, null, this.getPaperStatusCallBack.bind(this), col, $index);

    };

    /**
     * 下拉刷新作业列表
     */
    pullRefresh() {
        if (!this.$ngRedux.getState().wl_is_worklist_loading) {
            console.warn('================' + '下拉刷新');

            this.fetchWorkList(false, this.loadCallback.bind(this), this.getSelectedClazz());
            this.getCurrentWorkList();
        } else {
            this.getScope().$broadcast('scroll.refreshComplete');
        }
        if (this.getRootScope().hasCompetition) {
            this.getScope().$emit("fetch_competition_info_from_server");//刷新竞赛试卷信息
        }
    }


    ifShow($index) {
        if (!this.workList || !this.workList.length) return false;

        let currentItem = this.workList[$index];
        let previousItem = this.workList[$index - 1];
        if ($index == 0) {
            return currentItem.paperInfo.publishType !== 8
        }
        if (previousItem.paperInfo.publishType === 8) return true;
        // let currentItem = this.workList[$index];
        // let previousItem = this.workList[$index - 1];
        //safari 不支持new Date('字符串')
        let currentMonth = currentItem.paperInfo.publishTimeDate.split('-')[1]
        let previousMonth = previousItem.paperInfo.publishTimeDate.split('-')[1]
        return currentMonth != previousMonth;
    }

    getMonth(listItem) {
        try {
            return Number(listItem.paperInfo.publishTimeDate.split('-')[1]);
        } catch (err) {
            console.error('作业列表分月信息解析失败', err);
        }
    }

    /**
     * 判断作业是否为寒假||暑假作业
     * @param list
     * @returns {boolean}
     */
    isPpecialWork(list) {
        return list.publishType === this.finalData.WORK_TYPE.SUMMER_WORK || list.publishType === this.finalData.WORK_TYPE.WINTER_WORK;
    }


    initTimeSelect() {
        this.termData = {nowTerm: '', terms: []};   //本学年，选择学年
        this.START_YEAR = 2015;                  //起始年份
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        if (1 <= month && month < 9) {
            year = year - 1;
        }
        this.termData.nowTerm = (year) + '-' + (year + 1) + ' 学年';
        for (var i = this.START_YEAR; i <= year; i++) {
            var temp = (i) + '-' + (i + 1) + ' 学年';
            this.termData.terms.push(temp);
        }

        this.startTime = this.termData.nowTerm.substring(0, 4) + '-09-01';
        this.endTime = (parseInt(this.termData.nowTerm.substring(0, 4)) + 1) + '-08-31';
    }


    alertInfo() {
        this.commonService.showAlert(
            '自学班能干什么？',
            `<p>自学班用于个人自学，可以玩速算（免费）和
             学霸驯宠记（需付费）。可做系统自动发布的两套体验作业。</p>
             <p>要想继续做作业，须加入数学老师开通的智算365班级，请推荐数学老师开通
             并请家长帮助加入老师的班级。</p>`
        )
    }


    showDeleteIcon() {
        this.showDeleteFlag = !this.showDeleteFlag;
        if (!this.showDeleteFlag) {
            angular.forEach(this.workList, (item)=> {
                item.selected = false;
            });
            this.showDeleteBarFlag = false;
        }
    }

    signWork(listItem, $event) {
        $event.stopPropagation();
        listItem.selected = !listItem.selected;
        if (listItem.selected) {
            this.showDeleteBarFlag = true;
        }
        let flag = _find(this.workList, {selected: true});
        if (!flag)  this.showDeleteBarFlag = false;
    }

    deleteCallback() {
        angular.forEach(this.workList, (item)=> {
            item.selected = false;
        });
        this.showDeleteBarFlag = false;
        this.showDeleteFlag = false;
    }

    deleteWork() {
        let callback = ()=> {
            let instanceIds = [];
            angular.forEach(this.workList, (item)=> {
                if (item.selected) instanceIds.push(item.instanceId);
            });
            if (instanceIds.length)
                this.deleteSelfTrainWork(instanceIds, this.workList, this.deleteCallback.bind(this));
        };
        this.getScope().$emit('diagnose.dialog.show', {
            'showType': 'confirm',
            'comeFrom': 'olympic-math',
            'content': '您确定要删除这些作业吗？',
            'confirmCallBack': callback
        });
    }

    showCompetitionAd() {
        this.getRootScope().showCompetitionAdFlag = true;
        this.getRootScope().isShowSeeBtnFlag = false;
    }

    showHomeDiagnoseAds() {
        this.getRootScope().showGameAdDialogFlag = false;
        this.getRootScope().showDiagnoseAdDialogFlag = true;
        this.getRootScope().firstShowDignoseAdDialog = true;

    }

    clickActivePage() {
        let index = this.$ionicSlideBoxDelegate.$getByHandle('work-list-slide-box').currentIndex();
        let len = this.$ionicSlideBoxDelegate.$getByHandle('work-list-slide-box').slidesCount();
        len = Number(len);
        if (index % len == 0) {
            this.showHomeDiagnoseAds();
        } else if (index % len == 1) {
            this.showStuTrophyRank();
        } else {
            this.showCompetitionAd();
        }
    }

    getWorkClass(listItem) {
        let className = listItem.paperInfo.showCss ? listItem.paperInfo.showCss : "";
        // className += listItem.paperInfo.status != 4 || (!this.showReportFlag(listItem))? ' my-work-item-no-btn' : ' my-work-item-has-btn';
        className +=  ''; //暑假作业样式
        return className;
    }

    getReportBtnBg(paperInfo){

        let classStr = 'work-report-btn-bg' + paperInfo.masterStatus;
        if(paperInfo.masterStatus == 4){
            classStr += paperInfo.instanceId.match(/\d/)[0]%4;
        }
        return classStr;
    }

    initShowMsgFromTeacherFlag() {
        let createTime = -1;
        //请求最新老师发的信
        this.profileService.getMsgFormTeacher(this.wl_selected_clazz.id).then((data)=> {
            if(!data || data && data.code!=200 || data && data.functions.length==0) this.showMsgButnFlag = false;
            else this.showMsgButnFlag=true;
            angular.forEach(data.functions, (v, k)=> {
                if (data.functions[k].function == "promotion") {
                    createTime = data.functions[k].version;
                }
            });
            if (createTime != -1&&createTime != this.teacherCreateMsgInfo.createTime) {//不一样则显示；然后修改本地数据
                this.showMsgFromTeacher();
                this.saveTeacherMsg(createTime);
            }
        });

    }

    showMsgFromTeacher(){
        this.glitterTimer  = this.$timeout(()=>{
            this.glitterFlag = false;
            this.$timeout.cancel(this.glitterTimer);
        },2000);

        this.getRootScope().msgDialogFlag = true;
    }


    timeEndCallBack(){

    }
}

export default oralCalculationWorkList;









