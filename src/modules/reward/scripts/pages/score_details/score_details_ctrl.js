/**
 * Created by Administrator on 2017/5/2.
 */
// import BaseController from 'base_components/base_ctrl';
import {Inject, View, Directive, select} from 'ngDecorator/ng-decorator';

@Directive({
    selector: 'scoreDetails',
    template: require('./score_details.html'),
    styles: require('./score_details.less'),
    replace: true
})

@View('reward_score_details', {
    url: '/reward_score_details',
    template: '<score-details></score-details>'
})

@Inject('$scope', '$state', '$rootScope', '$stateParams', '$ngRedux', '$ionicHistory', 'commonService','rewardSystemService')
class scoreDetailsCtrl {
    constructor(){
        /*后退注册*/

    }
    initData() {
        this.getScore = 12;
        this.useScore = 0;
        this.details = [
            {
                time: '2017/5/2',
                detailsList: [
                    {taskName: '每日签到', score: 3}
                ]
            },
            {
                time: '2017/5/3',
                detailsList: [
                    {taskName: '每日签到', score: 3},
                    {taskName: '每日任务', score: 5}
                ]
            }
        ]


    }

    loadImage(img) {
        return require('./../../../reward_images/' + img);
    }

    /**
     * 点击说明按钮
     */
    explainClick() {
        let template = "<p>积分有什么用？</p>" +
            "<p>&nbsp;&nbsp;可以到积分商城里去兑换积分道具</p>" +
            "<p>如何获得积分？</p>" +
            "<p>&nbsp;&nbsp;完成每日任务或者推广注册智算365可以获得积分</p>";
        this.commonService.showAlert('积分说明',template)
    }


    back() {
        this.go('home.me');
    }

    onBeforeLeaveView() {
    }

    onReceiveProps() {
    }

    onAfterEnterView() {
        this.initData();
    }

    mapStateToThis(state) {
        return {}
    }

    mapActionToThis() {
        return {}
    }
}

export default scoreDetailsCtrl;