/**
 * Created by ZL on 2018/1/30.
 */
import _find from 'lodash.find';
import _ from 'underscore';
import {Inject, View, Directive, select} from '../../module';
import qqIcon  from './../../../../m_global/sImages/qq.ico';
import weChatIcon  from './../../../../m_global/sImages/wechat.ico';
import friendCircle  from './../../../../m_global/sImages/friend-circle.png';
// import qrCode  from './../../../../m_global/sImages/qrcode/officalSiteQrcode.png';
import qrCode  from '../../../images/winter_camp_home/winter_camp_home21.png';
// import audioSrc from './../../../audios/winter_camp_bg_music.mp3';
const bookType = {
    bs: 'BS-北师版',
    xs: 'XS-西师版'
};
@View('home.winter_camp_home', {
    url: '/winter_camp_home',
    views: {
        "study_index": {
            template: require('./page.html')
        }
    },
    styles: require('./style.less'),
    inject: [
        '$scope'
        , '$state'
        , '$rootScope'
        , '$stateParams'
        , '$ngRedux'
        , '$ionicHistory'
        , '$ionicLoading'
        , '$ionicModal'
        , 'diagnoseService'
        , 'winterCampService'
        , 'commonService'
        , 'workStatisticsServices'
        , 'paperService'
        , 'oralCalculationPaperServer'
        , '$ocLazyLoad'
        , 'finalData'
        , '$ionicActionSheet'
        , 'wxPayService'
    ]
})

class winterCampHomeCtrl {
    @select((state)=> {
        return state.winter_camp_selected_textbook || {};
    }) selectedTextbook;
    @select((state)=> {
        return state.winter_camp_selected_grade || {};
    }) selectedGrade;
    @select(state => state.wl_selected_work)wl_selected_work;
    @select((state)=> {
        let classArr = state.profile_clazz.clazzList || [];
        if (classArr.length == 0) classArr = state.profile_clazz.selfStudyClazzList || [];
        let selectedClazz = classArr[0] || {};
        if (!selectedClazz.hasOwnProperty('teachingMaterial')) {
            selectedClazz.teachingMaterial = bookType.bs;
        }
        // if (selectedClazz.teachingMaterial == bookType.xs) selectedClazz.teachingMaterial = bookType.bs;
        return selectedClazz;
    }) selectedClazz;
    @select(state=>state.select_winter_camp_course) selectCourse;
    @select((state)=> {
        let courseListObj = state.winter_camp_all_courses || {};
        let allCourses = courseListObj.courseList || [];
        return allCourses;
    }) allCourses;
    @select(state=>state.current_course_info) courseInfo;
    @select(state=>state.winter_camp_share_record) shareFlag;
    @select(state=>state.profile_user_auth.user.vips) vips;
    @select((state)=> {
        let currentTextbook = state.winter_camp_selected_textbook || {};
        let currentGrade = state.winter_camp_selected_grade || {};
        let lastDateObj = state.study_course_count[currentTextbook.id + '_' + currentGrade.num] || {};
        let lastDate = lastDateObj.dayTime || '2018/1/1';
        return lastDate;
    }) lastDate;

    @select((state)=> {
        let currentTextbook = state.winter_camp_selected_textbook || {};
        let currentGrade = state.winter_camp_selected_grade || {};
        let lastDateObj = state.study_course_count[currentTextbook.id + '_' + currentGrade.num] || {};
        let todayFlag = lastDateObj.todayFlag || false;
        todayFlag = JSON.parse(todayFlag);
        let comboClassId = lastDateObj.comboClassId || "";

        return {todayFlag: todayFlag, comboClassId: comboClassId};
    }) lastObj;

    $ionicModal;
    diagnoseService;
    winterCampService;
    commonService;
    workStatisticsServices;
    paperService;
    oralCalculationPaperServer;
    $ocLazyLoad;
    finalData;
    $ionicActionSheet;
    wxPayService;
    // audioSrc = audioSrc;
    // bgAudio = $('#winter-camp-home-bg-video')[0];

    selectItem = {};
    qqIcon = qqIcon;
    weChatIcon = weChatIcon;
    friendCircle = friendCircle;
    qrCode = qrCode;
    isWin = this.commonService.judgeSYS() === 3;
    gamsScore = 0;
    initCtrl = false;
    knowledgeScore = 0;

    constructor() {
    }

    initData() {
        this.showDiaglog = true;
        this.initCtrl = false;//是否已初始化modal
        let modalStyle = "top: 20%!important;right: 20%!important;bottom: 20%!important;left: 20%!important;min-height: 240px!important;width: 60%!important;height: auto;";
        this.modalStyle = this.screenWidth >= 680 ? modalStyle : '';
        this.Grades = [
            {"num": 1, "name": "一年级上册"},
            {"num": 2, "name": "一年级下册"},
            {"num": 3, "name": "二年级上册"},
            {"num": 4, "name": "二年级下册"},
            {"num": 5, "name": "三年级上册"},
            {"num": 6, "name": "三年级下册"},
            {"num": 7, "name": "四年级上册"},
            {"num": 8, "name": "四年级下册"},
            {"num": 9, "name": "五年级上册"},
            {"num": 10, "name": "五年级下册"},
            {"num": 11, "name": "六年级上册"},
            {"num": 12, "name": "六年级下册"}
        ];
        this.classCount = 0; //第几课时
        this.selectedClazzDay = 1; //1：今天；2,：明天

        this.taskList = [
            {
                type: 'game',
                taskName: '互动课堂',
                chapterName: '1.1 搭一搭（一）',
                desc: ['互动课堂', '权威专家打造，新知识秒学会'],
                imgUrl: 'winter_camp_home/winter_camp_home04.png',
                butnUrl: 'winter_camp_home/winter_camp_home10.png',
            },
            {
                type: 'oral_calcu',
                taskName: '手写口算',
                chapterName: '1.1 搭一搭（一）',
                desc: ['手写口算', '手写口算，同步提升计算力'],
                imgUrl: 'winter_camp_home/winter_camp_home02.png',
                butnUrl: 'winter_camp_home/winter_camp_home11.png'
            },
            {
                type: 'work',
                taskName: '随堂练习',
                chapterName: '1.1 搭一搭（一）',
                desc: ['随堂练习', '随堂练习，配套教材课时'],
                imgUrl: 'winter_camp_home/winter_camp_home01.png',
                butnUrl: 'winter_camp_home/winter_camp_home12.png'
            },
            {
                type: 'diagnose',
                taskName: '提高训练',
                chapterName: '1.1 搭一搭（一）',
                desc: ['提高训练', '拓展训练，达到举一反三'],
                imgUrl: 'winter_camp_home/winter_camp_home03.png',
                butnUrl: 'winter_camp_home/winter_camp_home13.png'
            }
        ];
        this.lastVips = 0;
        this.showAllCourseFlag = false;
        this.vipInfo = _find(this.vips, (vip)=> {
            return vip.hasOwnProperty('comboClassKey');
        });
        if (this.vipInfo) {
            this.lastVips = this.vipInfo['comboClassKey'];
        }
        this.gamsScore = 0;
        this.knowledgeScore = 0;
        this.reloadAllCourse = false;
        let currentDateObj = new Date();
        this.currentDate = currentDateObj.getFullYear() + '/' + (currentDateObj.getMonth() + 1) + '/' + currentDateObj.getDate();
        this.changeMask=true //切换的模拟遮罩
    }

    setPaperInfo(paper) {
        this.winterCampService.setShardingClazz(this.selectedClazz);
        this.winterCampService.setDiagnoseSelectedClazz(this.selectedClazz);
        let workListState = [];
        workListState.push({
            canFetchDoPaper: true,
            canFetchPaper: true,
            instanceId: paper.paperInstanceId,
            paperInfo: {
                doPaper: {
                    instanceId: paper.paperInstanceId,
                    paperId: paper.paperId,
                    paperName: paper.paperName,
                    history: {
                        paperId: paper.paperId,
                        paperInstanceId: paper.paperInstanceId,
                        status: {
                            key: paper.status,
                            value: paper.status == 3 ? '已批改' : this.courseInfo.paper.status == 4 ? '已提交' : '未完成'
                        }
                    }
                },
                paperName: paper.paperName,
            }
        });
        this.setWorkList(workListState);//设置作业的state
    }

    setWorkList(workListState) {
        this.winterCampService.setWorkList({
            clzId: this.selectedClazz.id,
            list: workListState
        })
    }

    back() {
        if (angular.element($('.diagnose-dialog-box').eq(0)).scope()
            && angular.element($('.diagnose-dialog-box').eq(0)).scope().showDiagnoseDialogFalg) {
            this.getScope().$emit('diagnose.dialog.hide');
        } else {
            this.go('home.improve');
            this.getRootScope().$injector.get('$ionicViewSwitcher').nextDirection('back');
        }
    }

    onBeforeLeaveView() {
        // if (this.bgAudio) this.bgAudio.pause();
        this.showDiaglog = false;
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    /**
     * 检查是否有班级
     */
    checkClazzId() {
        if (!this.selectedClazz.id) {
            this.commonService.showAlert('提示', '<p style="text-align: center">请先去加班级吧！</p>');
        }
        return !this.selectedClazz.id;
    }

    onAfterEnterView() {
        // if (this.bgAudio) this.bgAudio.play();
        this.initData();
        this.winterCampService.setShardingClazz(this.selectedClazz);
        if (!this.selectedGrade.num||!this.selectedGrade.selectFlag) {
            let grade = Number(this.selectedClazz.grade);
            let currentGrade = _find(this.Grades, {num: grade * 2+1});
            this.winterCampService.changeGrade(currentGrade);
        }
        this.ensurePageData();
        if (!!this.selectedClazz.id) this.selectClazzTab(this.selectedClazzDay, true);
        this.$ocLazyLoad.load("m_oral_calculation");
        this.$ocLazyLoad.load("m_diagnose_payment");
        this.reloadAllCourse = true;
    }

    ensurePageData() {
        if (!this.initCtrl) {
            this.initCtrl = true;
            this.initModal();
            this.diagnoseService.getTextbookList(this.getTextbookCallBack.bind(this));
        }
    }

    checkCurrentBookType() {
        let teachingMaterial = this.selectedClazz.teachingMaterial.match(/XS|BS|RJ|SJ/)[0];
        let currentBook = _find(this.textbooks, {code: teachingMaterial});
        if (currentBook.openFlag) {
            this.selectedClazz.teachingMaterial = bookType.bs;
        }
    }

    getTextbookCallBack(data, synTrainHiddenTagIds) {
        if (data) {
            this.textbooks = data;
            angular.forEach(this.textbooks, (v, k)=> {
                if (synTrainHiddenTagIds.indexOf(v.id) > -1) {
                    this.textbooks[k].openFlag = true;
                }
            });
            this.checkCurrentBookType();
            if (!this.selectedTextbook.id && data && data.length) {
                let teachingMaterialCode = this.selectedClazz.teachingMaterial ? this.selectedClazz.teachingMaterial.split('-')[0] : null;
                let findTextbook;
                if (teachingMaterialCode) findTextbook = _find(data, {code: teachingMaterialCode});
                let defaultTextBook = findTextbook ? findTextbook : data[0];
                this.winterCampService.changeTextBook(defaultTextBook);
            }
            if (!this.selectedClazz.id) return;
            if (!this.selectedGrade.num||!this.selectedGrade.selectFlag) {
                let grade = Number(this.selectedClazz.grade);
                let currentGrade = _find(this.Grades, {num: grade * 2 + 1});
                this.winterCampService.changeGrade(currentGrade);
            }


            this.reloadAllCourse = false;
            this.winterCampService.getWinterCampAllClass(this.selectedTextbook.code, this.selectedGrade.num)
                .then((data)=> {
                    if (data) {
                        let todayCourse = '';
                        if (this.lastDate == this.currentDate) {
                            let classCount = _.findLastIndex(this.allCourses, {id: this.selectCourse.id});
                            if (classCount < 0) classCount = _.findLastIndex(this.allCourses, {id: this.lastObj.comboClassId});
                            if (classCount >= 0) {
                                todayCourse = this.allCourses[classCount];
                                if (todayCourse) this.winterCampService.selectWinterCampCourse(todayCourse);
                            }

                        }
                        if (!todayCourse || this.lastDate != this.currentDate) {
                            let todayCourse = _find(this.allCourses, (v, k)=> {
                                return !this.allCourses[k].finish
                            });
                            if (!todayCourse) todayCourse = this.allCourses[this.allCourses.length - 1];
                            this.winterCampService.selectWinterCampCourse(todayCourse);
                        }


                        this.winterCampService.getWinterCampClassDetail(this.selectCourse.id, this.selectedClazz.id, this.selectedTextbook.id + '_' + this.selectedGrade.num).then((data)=> {
                            if (data) this.getGamsScore();
                            this.classCount = _.findLastIndex(this.allCourses, {id: this.selectCourse.id});
                        });

                    }

                    this.reloadAllCourse = true;
                });
        } else
            this.textbooks = [];
    }


    initModal() {
        //初始化教材modal页
        this.$ionicModal.fromTemplateUrl('textbookSelect.html', {
            scope: this.getScope(),
            animation: 'slide-in-up'
        })
            .then((modal) => {
                this.textbookSelectModal = modal;
            });
        //初始化年级modal页
        this.$ionicModal.fromTemplateUrl('gradesSelect.html', {
            scope: this.getScope(),
            animation: 'slide-in-up'
        })
            .then((modal) => {
                this.gradesSelectModal = modal;
            });
        this.getScope().$on('$destroy', () => {
            this.textbookSelectModal.remove();
            this.gradesSelectModal.remove();
        });
    }

    /**
     * 打开教材选择modal
     */
    openTextbookSelectModal(tag, type) {
        this.textbookSelectModal.show();
    }

    /**
     * 打开年级选择modal
     */
    openGradesSelectModal(tag, type) {
        this.gradesSelectModal.show();
    }

    /**
     * 关闭教材modal
     */
    closeTextbookSelectModal() { //关闭modal
        this.textbookSelectModal.hide();
    }

    /**
     * 关闭年级modal
     */
    closeGradesSelectModal() { //关闭modal
        this.gradesSelectModal.hide();
    }

    /**
     * 去选择教材
     */
    diagnoseSelectTextBook(textBook) {
        // if (textBook.code == 'XS') return;
        if (textBook.openFlag) return;
        this.closeTextbookSelectModal();
        if (textBook.id === this.selectedTextbook.id)  return; //如果选择教材和当前选中教材一致就不处理
        this.winterCampService.changeTextBook(textBook);
        if (!this.selectedClazz.id) return;
        this.reloadAllCourse = false;
        this.winterCampService.getWinterCampAllClass(this.selectedTextbook.code, this.selectedGrade.num)
            .then((data)=> {
                if (data) {
                    // if (this.lastDate != this.currentDate) {
                    // let todayCourse = _find(this.allCourses, (v, k)=> {
                    //     return !this.allCourses[k].finish
                    // });
                    // if (!todayCourse) todayCourse = this.allCourses[this.allCourses.length - 1];
                    // this.winterCampService.selectWinterCampCourse(todayCourse);
                    // }
                    /*else if (!this.selectCourse.id) {
                     this.winterCampService.selectWinterCampCourse(this.allCourses[0]);
                     }*/
                    this.selectClazzTab(1, true);

                    let todayCourse = '';
                    if (this.lastDate == this.currentDate) {
                        let classCount = _.findLastIndex(this.allCourses, {id: this.lastObj.comboClassId});
                        if (classCount >= 0) {
                            todayCourse = this.allCourses[classCount];
                            if (todayCourse) this.winterCampService.selectWinterCampCourse(todayCourse);
                        }
                    }
                    if (!todayCourse || this.lastDate != this.currentDate) {
                        let todayCourse = _find(this.allCourses, (v, k)=> {
                            return !this.allCourses[k].finish
                        });
                        if (!todayCourse) todayCourse = this.allCourses[this.allCourses.length - 1];
                        this.winterCampService.selectWinterCampCourse(todayCourse);
                    }

                    this.winterCampService.getWinterCampClassDetail(this.selectCourse.id, this.selectedClazz.id, this.selectedTextbook.id + '_' + this.selectedGrade.num)
                        .then((data)=> {
                            if (data) {
                                this.getGamsScore();
                                this.winterCampService.changeStudyCourseCount(this.selectedTextbook.id + '_' + this.selectedGrade.num, this.selectCourse.id == this.lastObj.comboClassId);
                            }
                            debugger
                            this.classCount = _.findLastIndex(this.allCourses, {id: this.selectCourse.id});
                        });


                }
                this.reloadAllCourse = true;
            });
    }

    /**
     * 去选择年级
     */
    diagnoseSelectGrade(grade) {
        this.closeGradesSelectModal();
        if (grade.num === this.selectedGrade.num)  return; //如果选择年级和当前选中年级一致就不处理
        this.winterCampService.changeGrade(grade);
        // this.winterCampService.getServiceData();
        if (!this.selectedClazz.id) return;
        this.reloadAllCourse = false;
        this.winterCampService.getWinterCampAllClass(this.selectedTextbook.code, this.selectedGrade.num)
            .then((data)=> {
                if (data) {
                    /*if (this.lastDate != this.currentDate) {
                     let todayCourse = _find(this.allCourses, (v, k)=> {
                     return !this.allCourses[k].finish
                     });
                     if (!todayCourse) todayCourse = this.allCourses[this.allCourses.length - 1];
                     this.winterCampService.selectWinterCampCourse(todayCourse);
                     }else{
                     let classCount = _.findLastIndex(this.allCourses, {id: this.lastObj.comboClassId});
                     let todayCourse01 = this.allCourses[classCount];
                     this.winterCampService.selectWinterCampCourse(todayCourse);
                     }*/
                    this.selectClazzTab(1, true);
                    let todayCourse = '';
                    if (this.lastDate == this.currentDate) {
                        let classCount = _.findLastIndex(this.allCourses, {id: this.lastObj.comboClassId});
                        if (classCount >= 0) {
                            todayCourse = this.allCourses[classCount];
                            if (todayCourse) this.winterCampService.selectWinterCampCourse(todayCourse);
                        }
                    }
                    if (!todayCourse || this.lastDate != this.currentDate) {
                        let todayCourse = _find(this.allCourses, (v, k)=> {
                            return !this.allCourses[k].finish
                        });
                        if (!todayCourse) todayCourse = this.allCourses[this.allCourses.length - 1];
                        this.winterCampService.selectWinterCampCourse(todayCourse);
                    }
                    /*else if (!this.selectCourse.id) {
                     this.winterCampService.selectWinterCampCourse(this.allCourses[0]);
                     }*/
                    // this.winterCampService.selectWinterCampCourse(this.allCourses[0]);
                    this.winterCampService.getWinterCampClassDetail(this.selectCourse.id, this.selectedClazz.id, this.selectedTextbook.id + '_' + this.selectedGrade.num).then((data)=> {
                        if (data) {
                            this.getGamsScore();
                            this.winterCampService.changeStudyCourseCount(this.selectedTextbook.id + '_' + this.selectedGrade.num, this.selectCourse.id == this.lastObj.comboClassId);
                        }
                        this.classCount = _.findLastIndex(this.allCourses, {id: this.selectCourse.id});

                    });

                }
                this.reloadAllCourse = true;
            });
    }

    /**
     * 切换课程
     * @param clazz
     */
    changeClazz(clazz) {
        if (this.checkClazzId()) return;
        this.winterCampService.selectWinterCampCourse(this.selectItem.clazz);
        this.winterCampService.getWinterCampClassDetail(this.selectCourse.id, this.selectedClazz.id, this.selectedTextbook.id + '_' + this.selectedGrade.num).then((data)=> {
            if (data) {
                this.getGamsScore();
                this.winterCampService.changeStudyCourseCount(this.selectedTextbook.id + '_' + this.selectedGrade.num, this.selectCourse.id == this.lastObj.comboClassId);
            }
            this.classCount = _.findLastIndex(this.allCourses, {id: this.selectCourse.id});
        });

        this.selectClazzTab(1, true);
        /*if (this.selectCourse.id != this.lastObj.comboClassId) {
         this.winterCampService.changeStudyCourseCount(this.selectedTextbook.id + '_' + this.selectedGrade.num, false);
         }*/

    }

    /**
     * 选择今日课程或昨日课程
     */
    selectClazzTab(selectClazzNum, flag) {
        if(!this.changeMask)return;
        if (this.checkClazzId()) return;
        if (this.selectedClazzDay == selectClazzNum && !flag) return;
        this.changeMask=false;
        this.selectedClazzDay = selectClazzNum;
        if (selectClazzNum == 1) {
            $('.clazz-tab .today-tab').addClass('select-tab');
            $('.clazz-tab .tomorrow-tab').removeClass('select-tab');
            $('.today-tab .today-select-clazz-count').show();
            $('.tomorrow-tab .tomorrow-select-clazz-count').hide();
        } else {
            $('.clazz-tab .today-tab').removeClass('select-tab');
            $('.clazz-tab .tomorrow-tab').addClass('select-tab');
            $('.today-tab .today-select-clazz-count').hide();
            $('.tomorrow-tab .tomorrow-select-clazz-count').show();
        }

        if (!flag) {
            let classIndex = this.classCount;
            if (selectClazzNum == 1) {
                classIndex = Number(this.classCount) - 1;
            } else {
                classIndex = Number(this.classCount) + 1;
            }
            if (!this.allCourses[classIndex]){
                this.changeMask=true
                return;
            }
            this.winterCampService.selectWinterCampCourse(this.allCourses[classIndex]);
            this.winterCampService.getWinterCampClassDetail(this.selectCourse.id, this.selectedClazz.id, this.selectedTextbook.id + '_' + this.selectedGrade.num).then((data)=> {
                if (data) {
                    this.getGamsScore(true);
                    this.winterCampService.changeStudyCourseCount(this.selectedTextbook.id + '_' + this.selectedGrade.num, this.selectCourse.id == this.lastObj.comboClassId);
                }
                this.classCount = _.findLastIndex(this.allCourses, {id: this.selectCourse.id});
                this.changeMask=true;
            });
        }else{
            this.changeMask=true;
        }
    }

    /**
     * 查看更多，显示所有的课程
     */
    showAllCourse() {
        if (this.checkClazzId()) return;
        this.showAllCourseFlag = true;
    }

    withoutVip() {
        this.getScope().$emit('diagnose.dialog.show',
            {
                'showType': 'confirm',
                'comeFrom': 'winter-camp',
                'content': '小伙伴们都在用的预习神器，',
                'contentWords': ['开学晋升学霸！', '你也来加入吧~'],
                'confirmCallBack': ()=> {
                    this.gotoVipSelectPage();
                }
            }
        );
    }

    notOpenVip(task) {
        this.getScope().$emit('diagnose.dialog.show',
            {
                'showType': 'confirm',
                'comeFrom': 'XXXXX',
                'title': '提示',
                'content': '开启本课时，将消耗1个课时的使用特权，确定使用吗？',
                'confirmCallBack': ()=> {
                    this.winterCampService.openWinterCampResource(this.selectCourse.id).then((data)=> {
                        if (data) {
                            this.doTask(task, true);
                            // this.courseInfo.open = true;
                            this.paySuccessModifyVips();
                        }
                    });
                }
            }
        );
    }


    /**
     * 去做任务
     */
    doTask(task, flag) {
        if (this.checkClazzId()) return;
        if(!this.courseInfo.open){
            if (!this.vipInfo && this.classCount != 0 || this.vipInfo && Number(this.vipInfo['comboClassKey']) <= 0 && this.classCount != 0) {
                this.withoutVip();
                return
            }
            if (!this.courseInfo.open && this.classCount != 0 && !flag) {
                this.notOpenVip(task);
                return;
            }
        }
        if (task.type == 'game') {
            this.go('winter_camp_game', {fromGame: 'true'});
        } else if (task.type == 'oral_calcu') {
            this.gotoOralCalculation();
        } else if (task.type == 'work') {
            this.gotoDoWork();
        } else if (task.type == 'diagnose') {
            if (this.courseInfo.paper.status != 4) {
                this.commonService.showAlert('提示', '先完成随堂作业，才可以做同步练习哟！');
                return;
            }
            if (this.classCount == 0 && !this.shareFlag && !this.isWin && this.courseInfo.reward.finish != this.courseInfo.reward.totalStep) {
                this.showInvite();//分享完成需要本地记录已分享；
            } else {
                this.gotoDODiagnose();
            }
        }

    }

    /**
     * 去做作业
     */
    gotoDoWork() {
        this.setPaperInfo(this.courseInfo.paper);
        let param = {
            paperId: this.courseInfo.paper.paperId,//this.currentPaperInfo[index].id,
            paperInstanceId: this.courseInfo.paper.paperInstanceId,//this.currentPaperInfo[index].originId,
            urlFrom: 'winter_camp_home'
        };
        this.selectWork({
            instanceId: param.paperInstanceId,
            paperId: param.paperId,
            paperName: this.courseInfo.paper.paperName,
            publishType: 14
        });

        if (this.courseInfo.paper.status == 3) {
            this.commonService.alertDialog('作业批改中，请稍后~');
            return;
        }
        if (this.courseInfo.paper.status < 4) {
            param.redoFlag = 'false';
            this.go("wc_select_question", param); //返回做题
            return;
        }
        this.go("wc_work_detail", param);
    }

    /**
     * 去做诊断提分
     */
    gotoDODiagnose() {
        this.go("wc_train");
    }

    /**
     * 去做手写口算
     */
    gotoOralCalculation() {
        this.setPaperInfo(this.courseInfo.oralCalculationPaper);
        let param = {
            paperId: this.courseInfo.oralCalculationPaper.paperId,//this.currentPaperInfo[index].id,
            paperInstanceId: this.courseInfo.oralCalculationPaper.paperInstanceId,//this.currentPaperInfo[index].originId,
            redoFlag: 'false', //是否是提交后再进入select_question做题
            urlFrom: 'winter_camp_home',
        };
        this.selectWork({
            instanceId: param.paperInstanceId,
            paperId: param.paperId,
            paperName: this.courseInfo.oralCalculationPaper.paperName,
            publishType: 15,
            limitTime: this.courseInfo.oralCalculationPaper.limitTime
        });
        if (this.courseInfo.oralCalculationPaper.status < 3) {//1作业还没开始做,2作业部分完成，未提交的问题可以修改
            this.getRootScope().selectQuestionUrlFrom = 'winter_camp_home';
            this.go("wc_oral_calculation_select_question", "forward", param); //返回做题
            return;
        }
        if (this.courseInfo.oralCalculationPaper.status.status == 3) {//作业已提交但未批改
            this.commonService.alertDialog("作业正在批改中", 1500);
            return;
        }
        this.getRootScope().selectQuestionUrlFrom = 'detail';
        this.go("wc_oral_calculation_work_detail", "forward", param);
    }

    gotoVipSelectPage() {
        if (this.checkClazzId()) return;
        if (!this.selectedTextbook.code || !this.selectedGrade.num) {
            this.commonService.showAlert('提示', '请先选择教材版本和年级');
            return;
        }
        this.go("winter_camp_vip_select", "forward")
    }

    /**
     * 领取奖励 TODO
     */
    getReward() {
        if (this.checkClazzId()) return;
        if (this.courseInfo.reward.finish != this.courseInfo.reward.totalStep || this.courseInfo.reward.award) return;
        this.winterCampService.getWinterCampReward(this.selectCourse.id)
            .then((data)=> {
                if (data) {
                    this.courseInfo.reward.award = true;
                    this.getRootScope().showWinterCampRewardPrompt = true;
                }
            });
    }

    mapActionToThis() {
        return {
            getPaperStatus: this.workStatisticsServices.getPaperStatus,
            selectWork: this.paperService.selectWork,
            paySuccessModifyVips: this.wxPayService.paySuccessModifyVips.bind(this.wxPayService),
        }
    }

    /**
     * 打开邀请
     */
    showInvite() {
        let shareContent = `《智算365》的假期提前学，指导我学习下学期的课程。超高效提前学，助我领先同学很多步~`;
        this.$ionicActionSheet.show({
            buttons: [
                {text: `<img class="weChat-share-img" src="${this.weChatIcon}">推荐到微信`},
                {text: `<img class="friend-circle-share-img" src="${this.friendCircle}">推荐到朋友圈`},
                {text: `<img class="qq-share-img" src="${this.qqIcon}" >推荐到QQ`}
            ],
            titleText: `<div class="winter-camp-wx-share">
                            <p class="wx-share-title">分享即可获得<em>第1课</em>的诊断结果和提高训练</p>
                        </div>
                        <div class="winter-camp-wx-share">
                            <p class="wx-share-content">《智算365》的<em>假期提前学</em>，指导我学习下学期的课程。超高效提前学，助我领先同学很多步~</p>
                        </div>
                        <img class="reward-share-btn share-qrcode" src="${this.qrCode}" width="60%">
                    `,
            cancelText: '取消',
            buttonClicked: (index) => {
                this.firstGoToDiagnose();
                if (index == 2) {
                    QQ.setOptions({
                        appId: '1105576253',
                        appName: 'XiaoGou',
                        appKey: 'IaDN9O8abL0FJ6gT'
                    });
                    QQ.share(shareContent,
                        '智算365-假期提前学',
                        'http://xuexiv.com/img/icon.png',
                        this.finalData.GONG_ZHONG_HAO_QRIMG_URL,
                        () => {
                            this.firstGoToDiagnose();
                            this.commonService.showAlert("提示", "分享成功！");
                        }, (err) => {
                            this.commonService.showAlert("提示", err);
                        });
                }
                if (index == 0) {//点击分享到微信
                    if (!this.getScope().$root.weChatInstalled) {
                        this.commonService.showAlert("提示", "没有安装微信！");
                        return;
                    }
                    Wechat.share({
                        scene: Wechat.Scene.SESSION,  // 分享到朋友或群
                        message: {
                            title: "智算365-假期提前学",
                            description: shareContent,
                            thumb: "http://xuexiv.com/img/icon.png",
                            mediaTagName: "TEST-TAG-001",
                            messageExt: "这是第三方带的测试字段",
                            messageAction: "<action>dotalist</action>",
                            media: {
                                type: Wechat.Type.WEBPAGE,
                                webpageUrl: this.finalData.GONG_ZHONG_HAO_QRIMG_URL
                            }
                        },
                    }, () => {
                        this.firstGoToDiagnose();
                        this.commonService.showAlert("提示", "分享成功！");
                    }, (reason) => {
                        this.commonService.showAlert("提示", reason);
                    });
                }
                if (index == 1) {//点击分享到微信
                    if (!this.getScope().$root.weChatInstalled) {
                        this.commonService.showAlert("提示", "没有安装微信！");
                        return;
                    }
                    Wechat.share({
                        scene: Wechat.Scene.TIMELINE,  // 分享到朋友或群
                        message: {
                            title: "智算365-假期提前学",
                            description: shareContent,
                            text: shareContent,
                            thumb: "http://xuexiv.com/img/icon.png",
                            mediaTagName: "TEST-TAG-001",
                            messageExt: "这是第三方带的测试字段",
                            messageAction: "<action>dotalist</action>",
                            media: {
                                type: Wechat.Type.LINK,
                                webpageUrl: this.finalData.GONG_ZHONG_HAO_QRIMG_URL
                            }
                        },
                    }, () => {
                        this.firstGoToDiagnose();
                        this.commonService.showAlert("提示", "分享成功！");
                    }, (reason) => {
                        this.commonService.showAlert("提示", reason);
                    });
                }

                return true;
            }
        });
    }

    firstGoToDiagnose() {
        this.winterCampService.saveShareRecord();
    }

    getGamsScore(flag) {
        this.knowledgeScore = Math.round((this.courseInfo.knowledge.knowledgeMaster / this.courseInfo.knowledge.knowledgeCount) * 100);
        this.gamsScore = 0;
        angular.forEach(this.courseInfo.games, (v, k)=> {
            this.gamsScore += Number(this.courseInfo.games[k].score);
        });
        if (!this.courseInfo.games || this.courseInfo.games && this.courseInfo.games.length == 0) {
            this.gamsScore = 0;
            return 0;
        }

        return this.gamsScore;
    }
}