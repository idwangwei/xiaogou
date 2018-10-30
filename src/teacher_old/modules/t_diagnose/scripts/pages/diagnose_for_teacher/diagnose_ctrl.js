/**
 * Created by 邓小龙 on 2016/11/2.
 */
import $ from 'jquery';
import _find from 'lodash.find';
import _sortby from 'lodash.sortby';
import {Inject, View, Directive, select} from '../../module';

@View('home.diagnose', {
    url: '/diagnose',
    styles: require('./diagnose.less'),
    views: {
        "diagnose": {
            template: require('./diagnose.html')
        }
    },
    inject: ['$scope'
        , '$rootScope'
        , '$log'
        , '$state'
        , '$timeout'
        , '$ionicSideMenuDelegate'
        , '$ionicSlideBoxDelegate'
        , "diagnoseService"
        , 'commonService'
        , '$ngRedux']
})

class DiagnoseCtrl {
    $scope;
    $rootScope;
    $log;
    $state;
    $timeout;
    $ionicSideMenuDelegate;
    diagnoseService;
    commonService;
    $ngRedux;
    xlyACount = 0;

    onLine = true;
    // selectedClazzInitlized=false;//班级选择初始化
    unitDataInitlized = false; //ctrl初始化后，是否已经加载过一次诊断
    screenWidth = window.innerWidth;
    showPieChartFlag = false;
    loadingText = '获取诊断信息中';

    @select(state=>state.profile_user_auth.user.name) userName;
    @select(state=>state.diagnose_clazz_with_unit) diagnose_clazz_with_unit;
    @select(state=>state.clazz_list) clazzList;
    @select(state=>state.fetch_diagnose_unit_stati_processing) isLoadingProcessing;
    @select(state=>state.diagnose_selected_unit) selectedUnit;
    @select(state=>state.diagnose_unit_has_changed) diagnoseUnitHasChanged;
    @select(state=>state.diagnose_selected_clazz) diagnose_selected_clazz;
    @select(state=>state.unit_with_diagnose_stati) unit_with_diagnose_stati;
    // @select(state=>state.diagnose_selected_textbook) textbook;
    @select((state)=> {
        return state.diagnose_selected_textbook[state.diagnose_selected_clazz.id]
    }) textbook;// @select(state=>state.app_info.onLine) onLine;
    @select(state => state.profile_user_auth.user.manager) isAdmin;

    constructor() {
    }

    configDataPipe() {
        this.dataPipe
            .when(()=> {
                return this.diagnose_selected_clazz && this.diagnose_selected_clazz.id
            })
            .then(()=> {
                //当前选择的班级第一次进入诊断，默认选择与班级对应的年级学期的第一个单元
                if (!this.selectedUnit) {
                    this.diagnoseService.getTextbookList((unitDetail)=> {
                        this.$timeout(()=> {
                            let defaultTextbook, defaultGrade, defaultUnit;
                            try {
                                let currentMonth = new Date().getMonth();
                                let currentBookName = this.commonService.convertToChinese(this.diagnose_selected_clazz.grade) + "年级";
                                defaultTextbook = _find(unitDetail, {code: this.diagnose_selected_clazz.teachingMaterial.split('-')[0]});
                                defaultGrade = _find(defaultTextbook.subTags, (book)=> {
                                    return book.text.match(currentBookName + ((currentMonth > 0 && currentMonth < 8) ? "下" : "上"))
                                });
                                defaultUnit = _find(defaultGrade.subTags, (unit)=> {
                                    return unit.seq == 0
                                });

                                if (defaultUnit) {
                                    this.diagnoseService.selectTextbook(defaultGrade);
                                    defaultUnit.retFlag = false;
                                    defaultUnit.textbookName = defaultGrade.name;
                                    this.diagnoseService.changeUnit(defaultUnit);
                                }
                            } catch (e) {
                                console.log(e)
                            }
                        }, 0);

                    });
                }
            })
            .when(()=> {
                console.warn('configDataPipe................................22222222');
                return this.diagnose_selected_clazz && this.diagnose_selected_clazz.id && this.selectedUnit && this.diagnose_selected_clazz.checkedNum
            })
            .then(()=>this.initUnitHasChanged())
            .then(()=>this.initUnit())

    }

    initUnit() {
        if (!this.unitDataInitlized) {
            this.unitDataInitlized = true;
            this.diagnoseService.resetUnitSelectedStatus();
            this.diagnoseService.fetchUnitDiagnose(this.selectedUnit.id, this.loadCallback.bind(this));
            return;
        }
    }

    initUnitHasChanged() {
        if (this.diagnoseUnitHasChanged) {
            this.unitDataInitlized = true;
            this.showPieChartFlag = false;
            this.diagnoseService.resetUnitSelectedStatus();
            this.diagnoseService.fetchUnitDiagnose(this.selectedUnit.id, this.loadCallback.bind(this));
            return
        }
    }

    onAfterEnterView() {
        this.getRootScope().showTopTaskFlag = true;//显示任务列表指令
        this.$ionicSlideBoxDelegate.$getByHandle('winter-holidays-box').stop();
        let timeId = this.$timeout(()=> {
            this.$ionicSlideBoxDelegate.$getByHandle('winter-holidays-box').start();
            this.$timeout.cancel(timeId);
        }, 3000);

        //this.pieChartRedraw(true);
        this.getRootScope().studyStateLastStateUrl = this.getStateService().current.name;
        this.commonService.setLocalStorage('studyStateLastStateUrl', 'home.diagnose');

        console.log('=============================================on after enter view');
        if (!this.isLoadingProcessing && this.selectedUnit) {
            this.diagnoseService.fetchUnitDiagnose(this.selectedUnit.id, this.loadCallback.bind(this));
        }
    }

    onBeforeEnterView() {
        let state = this.$ngRedux.getState();
        if (state.clazz_list && state.clazz_list.length) {
            let clazz = _find(state.clazz_list, {id: state.diagnose_selected_clazz.id});
            if (clazz) {
                this.diagnoseService.changeClazz(clazz);
            } else {
                this.diagnoseService.changeClazz(state.clazz_list[0]);
            }

        }
    }

    onBeforeLeaveView() {
        this.getRootScope().showTopTaskFlag = false;//显示任务列表指令
        this.$ionicSideMenuDelegate.toggleLeft(false);
        //离开当前页面时，cancel由所有当前页发起的请求
        this.diagnoseService.cancelDiagnoseRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.diagnoseService.cancelDiagnoseRequestList.splice(0, this.diagnoseService.cancelDiagnoseRequestList.length);//清空请求列表
        // angular.forEach(this.$ionicSideMenuDelegate._instances,instance=>instance.close());
    }

    showStuStati(stu) {
        stu.selectedClazzId = this.diagnose_selected_clazz.id;
        stu.selectedUnitId = this.selectedUnit.id;
        this.diagnoseService.unitSelectStu(stu);
        this.go('home.diagnose_student', 'forward')
    }

    /**
     * 加载完毕的回调
     */
    loadCallback(data) {
        let unitDiagnose = this.unit_with_diagnose_stati[this.diagnose_selected_clazz.id + '#' + this.selectedUnit.id];
        this.unit_diagnose = unitDiagnose;
        //this.unit_diagnose=this.unit_with_diagnose_stati[this.diagnose_selected_clazz.id+'#'+this.selectedUnit.id];

        this.stuPercentList = [];
        let len = this.unit_diagnose.tableTitleList.length;
        let totalCount = this.unit_diagnose.totalPointNum;

        this.xlyACount = 0;
        angular.forEach(this.unit_diagnose.stuList, (item) => {
            let arr = [];
            let percentArr = [];
            for (let i = 0; i < len; i++) {
                arr.push(item.master2Number[this.unit_diagnose.tableTitleList[i]['key']]);
                percentArr.push(arr[i] * 100 / totalCount + "%")
            }
            item.stuLevelList = arr;
            item.stuPercentList = percentArr;
            if (item.planA || item.planB) {
                this.xlyACount += 1;
            }

        });
    }

    /**
     * 去选择班级
     */
    diagnoseSelectClazz(clazz) {
        this.$ionicSideMenuDelegate.toggleLeft(false);
        if (clazz.id === this.diagnose_selected_clazz.id)  return; //如果选择班级和当前选中班级一致就不处理
        this.diagnoseService.changeClazz(clazz);
        let clazzSelectedUnit = this.diagnose_clazz_with_unit[clazz.id];
        if (!clazzSelectedUnit || !clazzSelectedUnit.id) {
            this.unit_diagnose = this.unit_with_diagnose_stati[this.diagnose_selected_clazz.id + '#' + clazzSelectedUnit];
            // this.selectedUnit=clazzSelectedUnit;
            this.diagnoseService.changeUnit(clazzSelectedUnit || null);
            return;
        }
        this.diagnoseService.changeUnit(clazzSelectedUnit);
        if (!this.diagnose_selected_clazz.checkedNum) {
            this.unit_diagnose.tableTitleList.splice(0, this.unit_diagnose.tableTitleList.length);
            this.unit_diagnose.stuList.splice(0, this.unit_diagnose.stuList.length);
            return;
        }
        this.diagnoseService.fetchUnitDiagnose(clazzSelectedUnit.id, this.loadCallback.bind(this));
    }

    hasNoClass() {
        let state = this.$ngRedux.getState();
        return !state.clazz_list || !state.clazz_list.length || (!this.diagnose_selected_clazz || !this.diagnose_selected_clazz.name);
    }

    sortTable(selectedItem) {
        angular.forEach(this.unit_diagnose.tableTitleList, (item)=> {
            if (item.showSortFlag && selectedItem.key === item.key)
                item.clickAgain = true;
            else
                item.clickAgain = false;
            item.showSortFlag = false;
        });
        selectedItem.showSortFlag = true;
        //selectedItem.sortUp=!selectedItem.sortUp;
        let sortList = [];
        if (selectedItem.sortUp) {
            selectedItem.sortUp = !selectedItem.sortUp;
            sortList = _sortby(this.unit_diagnose.stuList, [(item)=> {
                return item.master2Number[selectedItem.key];
            }]);
        } else {
            selectedItem.sortUp = !selectedItem.sortUp;
            sortList = _sortby(this.unit_diagnose.stuList, [(item)=> {
                return -item.master2Number[selectedItem.key];
            }]);
        }

        this.unit_diagnose.stuList.splice(0, this.unit_diagnose.stuList.length);
        angular.forEach(sortList, (item)=> {
            this.unit_diagnose.stuList.push(item);
        })


    }


    showMenu() {
        this.$ionicSideMenuDelegate.toggleLeft();
    }

    showUnit() {
        this.go('select_unit', 'forward');
    }

    showWinterAd() {
        // this.getRootScope().showDiagnoseAdFlag = true;
        this.getScope().$emit("recommend.show");
    }

    back() {
        if ($(".recommend-training-back-drop").css("display") === "block") {
            this.getScope().$emit("recommend.hide");
        } else {
            return "exit";
        }
        this.getRootScope().$digest();
    }

    showSharePage() {
        this.go('teacher_share_intro', {backUrl: "home.diagnose"});
    }

    showAdPage() {
        let index = this.$ionicSlideBoxDelegate.$getByHandle('winter-holidays-box').currentIndex();
        let len = this.$ionicSlideBoxDelegate.$getByHandle('winter-holidays-box').slidesCount();
        len = Number(len);
        if (index % len == 0) {
            this.showWinterAd()
        }
        else {
            this.showSharePage()
        }
    }
}

export default DiagnoseCtrl;






