/**
 * Created by ZL on 2018/3/14.
 */
/**
 * Created by Administrator on 2016/9/13.
 */
import {Inject, View, Directive, select} from '../../module';
@View('q_feedback', {
    url: 'q_feedback',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject: ["$scope", "$rootScope", "$timeout", '$state', "commonService", "serverInterface", "workStatisticsService","$ngRedux"]
})
class QFeedbackCtrl {
    commonService;
    serverInterface;
    workStatisticsService;

    other = '';
    QInfo = this.workStatisticsService.QInfo;
    lastStateInfo = this.workStatisticsService.workDetailState;
    selections = [
        {selected: false, val: '出题不正确!'},
        {selected: false, val: '批改不正确!'},
        {selected: false, val: '显示不正确!'},
        {selected: false, val: '排版不美观!'},
        {selected: false, val: '图片看不清楚!'},
        {selected: false, val: '题干的文字有歧义!'},
        {selected: false, val: '参考答案有争议性!'},
        {selected: false, val: '其他问题!'}
    ];

    back() {
        this.go(this.lastStateInfo.lastStateUrl, this.lastStateInfo.lastStateParams);
    }

    setMethodsForInjects(args) {
        let me = this;
        this.constructor.$inject.forEach((val, idx) => {
            if (val == '$scope') {
                me.getScope = function () {
                    return args[idx];
                }
            }
            else if (val == '$rootScope') {
                me.getRootScope = function () {
                    return args[idx];
                }
            }
            else if (val == '$state') {
                me.getStateService = function () {
                    return args[idx];
                }
            }
            else {
                me[val] = args[idx];
            }
        });
    }

    sendFeedback() {
        var res = [];
        this.selections.forEach(function (sel) {
            if (sel.selected)res.push(sel.val)
        });
        if (this.other)res.push(this.other);
        if (!res.length)return this.commonService.showAlert('提示', '<p>请填写或选择出错描述!</p>');
        var me = this;
        this.commonService.showConfirm("提示", "<p>确定要提交吗？</p>").then(function (yes) {
            if (yes) {
                me.commonService.commonPost(me.serverInterface.POST_Q_FEEDBACK, {
                    user: JSON.stringify({
                        id: me.getRootScope().user.userId,
                        name: me.getRootScope().user.name,
                        role: 'P'
                    }),
                    questionId: me.QInfo.questionId,
                    paperId: me.QInfo.paperId,
                    suggestion: res.join('||')
                }).then(function (data) {
                    if (data.code == 200) {
                        me.commonService.showAlert('提示', '<p>提交成功!</p>').then(function () {
                            me.back();
                        });
                    } else {
                        me.commonService.showAlert('提示', '<p>' + data.msg + '</p>');
                    }
                })
            }
        });
    }
}
export default QFeedbackCtrl
