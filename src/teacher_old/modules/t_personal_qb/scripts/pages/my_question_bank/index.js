/**
 * Created by ZL on 2018/3/19.
 */
import {Inject, View, Directive, select} from '../../module';

@View('my_question_bank', {
    url: '/my_question_bank',
    cache: false,
    template: require('./page.html'),
    styles: require('./style.less'),
    inject: ['$scope', '$state', '$ionicScrollDelegate', '$rootScope', '$ngRedux', 'personalQBService']
})

class myQuesBankCtrl {
    personalQBService;
    addQuesCount = '';
    initCtrl = false;
    @select(state=>state.profile_user_auth.user) user;

    initData() {
        this.initCtrl = false;
    }

    onAfterEnterView() {
        this.initData();
    }

    back() {
        this.go('pub_work_type');
    }

    gotoAddQues() {
        this.go('add_question');

    }

    gotoPubQues() {
        this.go('pub_to_stu_preview');
    }

    //getTeacherQbQuestionCount
    onReceiveProps() {
        this.ensurePageData();
    }

    ensurePageData() {
        if (!this.initCtrl) {
            this.initCtrl = true;
            this.personalQBService.getTeacherQbQuestionCount(this.user.userId).then((data)=> {
                if (data || data === '0' || data === 0) {
                    this.addQuesCount = data;
                } else {
                    this.addQuesCount = '**';
                }
            })
        }
    }
}

export default myQuesBankCtrl;