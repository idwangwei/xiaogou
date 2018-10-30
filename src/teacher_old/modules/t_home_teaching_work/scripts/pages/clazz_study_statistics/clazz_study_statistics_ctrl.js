/**
 * Author 邓小龙 on 2016/07/25.
 * @description 班级学情
 */
import _findIndex from 'lodash.findindex';
import {Inject, View, Directive, select} from './../../module';

@View('clazz_study_statistics', {
    url: '/clazz_study_statistics',
    cache: false,
    template: require('./clazz_study_statistics.html'),
    styles: require('./clazz_study_statistics.less'),
    inject:['$scope',
        '$state',
        '$interval',
        '$ionicPopup',
        '$ngRedux',
        '$rootScope',
        'commonService',
        'workStatisticsService',
    ]
})
export default class ClazzStudyStatisticsCtrl {
    levelFlag = true;
    sort = {
        levelDown: false,
        unSubDown: true,
        unMistakeDown: true,
        completeCorrectDown: true
    };
    selectedTime = '';  //选择的值
    selectedTimeIndex = 0;  //选择的值
    selectedType = 0;     //选择的值
    initFlag = {
        show: false
    };
    typeOptions = [{
        name: '上学期',
        value: 1
    }, {
        name: '寒假作业',
        value: 2
    }, {
        name: '下学期',
        value: 3
    }, {
        name: '暑假作业',
        value: 4
    }];
    smallScreen = false;

    @select(
        (state, self) => state.work_statis_list
    ) studyStatisData;

    constructor() {
        this.selectedClazz = this.$ngRedux.getState().wl_selected_clazz;
        this.initTime();
        this.dataInit();
        
        
    };

    initTime() {
        this.timeOptions = [];
        let START_YEAR = 2015;                  //起始年份
        let date = new Date(), year = date.getFullYear(), month = date.getMonth() + 1;
        let day = date.getDate();
        if(day<10) day="0"+day;
        let num=month+""+day-0;
        if (1 <= month && month < 9) {
            year = year - 1;
            this.selectedType = 2;
        }
        this.selectedTime = (year) + '-' + (year + 1);
        if(num>120&&num<301){
            this.selectedType=1;
        }
        if(num>=701&&num<901){
            this.selectedType=3;
        }
        for (let i = START_YEAR; i <= year; i++) {
            let temp = (i) + '-' + (i + 1) + ' 学年';
            this.timeOptions.push({
                name: temp,
                value: (i) + '-' + (i + 1)
            });
        }
    }

    /**
     * 返回作业列表展示
     */
    back() {
        this.getStateService().go('home.work_list', {category: 2, workType: 2});
    }

    /**
     * 显示名称控制
     */
    showLevel() {
        this.levelFlag = !this.levelFlag;
        if (!this.levelFlag) {
            this.sortList('unSubNum', this.sort.unSubDown);
        }
    };

    startAnswer() {
        this.$ionicPopup.alert({
            title: '常见问题',
            template: `
                <p style="color: #377AE6">问：列表中*的表示什么意思？</p>
                <p>答：表示该生总收到的作业数（即该生的这一行的数字相加），少于上面的班级总发布次数
                （全班总次数+该生当前所在分层次数）。出现这种情况可能的原因有：</p>
                    <p>1、该生是后加入班级的，只补发最近5套作业；</p>
                    <p>2、该生分层被修改过几次；</p>`,
            okText: '确定'
        });
    };

    answer() {
        this.$ionicPopup.alert({
            title: '常见问题',
            template: `
                <p style="color: #377AE6">问：如何改变排序方式？</p>
                <p>答：点击表头相应的文字</p>
                <p style="color: #377AE6">问：列表中*的表示什么意思？</p>
                <p>答：表示该生总收到的作业数（即该生的这一行的数字相加），少于上面的班级总发布次数
                （全班总次数+该生当前所在分层次数）。出现这种情况可能的原因有：</p>
                    <p>1、该生是后加入班级的，只补发最近5套作业；</p>
                    <p>2、该生分层被修改过几次；</p>`,
            okText: '确定'
        });
    };

    sortList = (sortName, isDown) => {
        this.workStatisticsService.sortClazzStudyList(this.studyStatisData,
            sortName, isDown, this.sort.levelDown);
    };
    dataInit = ()=> {
        let studyStatisParams = this.$ngRedux.getState().study_statis_params;
        let storeParams = studyStatisParams[this.selectedClazz.id], selectedTime, selectedType;

        if (storeParams) {
            selectedTime = storeParams.split('#')[0];
            selectedType = storeParams.split('#')[1];
            this.selectedTimeIndex = _findIndex(this.timeOptions, {value: selectedTime}) || 0;
            this.selectedTime = selectedTime;
            this.selectedType = selectedType ? parseInt(selectedType)-1 : 0;
        } else {
            selectedTime = this.selectedTime;
            selectedType = parseInt(this.selectedType)+1;
            this.selectedTimeIndex = _findIndex(this.timeOptions, {value: selectedTime}) || 0;
        }
        this.initFlag.show = true;
        this.$ngRedux.dispatch(this.workStatisticsService.getStudyStatisData(this.selectedClazz.id, selectedTime, selectedType));
        if (window.innerWidth <= 700) {
            this.smallScreen = true;
        }

    };

    handleTypeOnChange = (value) => {
        if (value === this.selectedType) return;
        this.$ngRedux.dispatch(this.workStatisticsService.changeStudyStatisParams(this.selectedClazz.id, this.selectedTime, value));
        this.$ngRedux.dispatch(this.workStatisticsService.getStudyStatisData(this.selectedClazz.id, this.selectedTime, value));
    };
    handleTimeTypeOnChange = (value) => {
        if (value === this.selectedTime) return;
        this.$ngRedux.dispatch(this.workStatisticsService.changeStudyStatisParams(this.selectedClazz.id, value, this.selectedType));
        this.$ngRedux.dispatch(this.workStatisticsService.getStudyStatisData(this.selectedClazz.id, value, this.selectedType));
    };
}
