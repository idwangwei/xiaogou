/**
 * Created by ZL on 2017/9/6.
 */
import $ from 'jquery';
import {Inject, View, Directive, select} from '../../module';

@View('auto_evaluate', {
    url: 'auto_evaluate',
    template: require('./auto_evaluate.html'),
    styles: require('./auto_evaluate.less'),
    inject:[
        '$scope',
        '$state',
        '$rootScope',
        '$ngRedux',
        '$ionicPopup',
        '$timeout',
        'commonService',
        'workListService'
    ]
})

class AutoEvaluateCtrl {
    commonService;
    $ionicPopup;
    $timeout;
    workListService;

    onOrOffFlag = false;
    canClickFlag = true;
    initOnOrOffFlag = this.onOrOffFlag;
    evaluateLevelList = [];
    evaluateTextChangeFlag = false;
    saveButnCanClickFlag = true;


    @select(state=>state.profile_user_auth.user.name) userName;
    @select(state=>state.wl_selected_clazz.id) classId;
    constructor(){
        
        
    }
    initData() {
        this.levelList = ['fullScore', 'excellentScore', 'wellScore', 'lowScore', 'correctToFullScore'];
        this.evaluateLevelList = {
            fullScore: {
                levelName: '首次满分',
                levelScore: '100',
                award: '',
                img: 'praise/best.png',
                text: '最佳作业奖',
                msg: ''
            },
            excellentScore: {
                levelName: '首次90-100分',
                levelScore: '100',
                award: '',
                img: 'praise/good.png',
                text: '优秀作业奖',
                msg: ''
            },
            wellScore: {
                levelName: '首次80-90分',
                levelScore: '100',
                award: '',
                img: 'praise/thumbsup-ico-g.png',
                text: '点赞',
                msg: ''
            },
            lowScore: {
                levelName: '首次低于80分',
                levelScore: '100',
                award: '',
                img: 'praise/encourage.png',
                text: '鼓励',
                msg: ''
            },
            correctToFullScore: {
                levelName: '改错到满分',
                levelScore: '100',
                award: '',
                img: 'praise/amazing.png',
                text: '进步奖',
                msg: ''
            }
        };
    }

    onAfterEnterView() {
        this.initData();
        this.getAllLevelEvaluate();
        //TODO 有一个接口判断是开还是关，则默认就为开或关
    }

    onBeforeEnterView() {
        this.evaluateTextChangeFlag = false;
        if (this.clickTimer) this.$timeout.cancel(this.clickTimer);
    }

    /**
     * 获取所有等级的评论及奖励
     */
    getAllLevelEvaluate() {
        this.workListService.getAutoCommentInfo(this.classId, this.analysisData.bind(this));
    }

    /**
     * 解析自动评价的数据
     */
    analysisData(data) {
        if (!data || data && data.code != 200) return;
        angular.forEach(this.levelList, (v, k)=> {
            // this.evaluateLevelList[v].msg = data.autoComment[v] || this.localSetting[v];
            this.evaluateLevelList[v].msg = data.autoComment[v] || '';
        });
        this.onOrOffFlag = data.autoComment.available;
    }


    /**
     * 开始或关闭按钮点击事件
     */
    onOrOffClickEvent() {
        if (!this.canClickFlag) return;
        this.canClickFlag = false;
        let className = 'off-on-active';
        if (this.onOrOffFlag) className = 'on-off-active';

        let state = 1;
        if (this.onOrOffFlag) state = 0;

        this.workListService.onOrOffAutoComment(this.classId, state).then((data)=> {
            if (data && data.code == 200) {
                $('.on-off').addClass(className);
                this.clickTimer = this.$timeout(()=> {
                    this.onOrOffFlag = !this.onOrOffFlag;
                    this.canClickFlag = true;
                    $('.on-off').removeClass(className);
                    if (this.onOrOffFlag) {
                        $('.on-off').css('transform', 'translate3d(40px, 0, 0)');
                        $('.on-off').css('-webkit-transform', 'translate3d(40px, 0, 0)');
                    } else {
                        $('.on-off').css('transform', 'translate3d(0, 0, 0)');
                        $('.on-off').css('-webkit-transform', 'translate3d(0, 0, 0)');
                    }
                    this.$timeout.cancel(this.clickTimer);
                }, 500)
            } else {
                this.canClickFlag = true;
            }
        });
    }

    changeEvaluateText() {
        this.evaluateTextChangeFlag = true;
        this.saveButnCanClickFlag = true;
    }


    saveSetting() {
        if(!this.evaluateTextChangeFlag){
            this.commonService.alertDialog('评语无修改，无需保存。', 1500);
            return;
        }
        if(!this.saveButnCanClickFlag) {
            return;
        }
        this.saveButnCanClickFlag = false;
        let params = {};
        angular.forEach(this.levelList, (v, k)=> {
            params[v] = this.evaluateLevelList[v].msg
        });
        params.groupId = this.classId;
        if (this.evaluateTextChangeFlag) {
            this.workListService.setAutoCommentInfo(params).then((data)=> {
                if (data && data.code == 200) {
                    // this.go('work_student_list');
                    // this.getScope().$root.$injector.get('$ionicViewSwitcher').nextDirection('back');
                    this.evaluateTextChangeFlag = false;
                    this.commonService.alertDialog('提交成功', 1000);
                } else {
                    this.commonService.alertDialog('提交失败', 1000);
                }
                this.saveButnCanClickFlag = true;
            });
        }

    }

    back() {
        if (this.evaluateTextChangeFlag) {
            this.commonService.showPopup({
                title: '提示',
                template: '<p>是否保存对：“自动评价”的修改？</p>',
                buttons: [{
                    text: '不保存',
                    type: 'button-default',
                    onTap: (e)=> {
                        // this.saveAutoCommentToLocal();
                        this.go('work_student_list');
                        this.getScope().$root.$injector.get('$ionicViewSwitcher').nextDirection('back');
                    }
                }, {
                    text: '保存',
                    type: 'button-positive',
                    onTap: (e)=> {
                        this.saveSetting();
                    }
                }]
            });
        } else {
            this.go('work_student_list');
            this.getScope().$root.$injector.get('$ionicViewSwitcher').nextDirection('back');
        }

    }

    help() {
        this.$ionicPopup.alert({
            title: '温馨提示',
            template: '<p>自动评价适用于每一套作业，无需重复设置。</p>',
            okText: '确定'
        });
    }

    /**
     * 用户未提交前保存设置到本地
     */
    saveAutoCommentToLocal() {
        let params = {};
        angular.forEach(this.levelList, (v, k)=> {
            params[v] = this.evaluateLevelList[v].msg
        });
        this.workListService.saveAutoCommentInfo(params);

    }
}

export default AutoEvaluateCtrl;