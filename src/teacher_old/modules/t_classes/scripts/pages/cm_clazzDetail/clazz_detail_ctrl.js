/**
 * Created by WangLu on 2016/9/30.
 */
import {Inject, View, Directive, select} from '../../module';

@View('clazz_detail', {
    url: '/clazz_detail',
    styles:require('./style.less'),
    template: require('./clazz_detail.html'),
    inject:['$scope'
        , '$ionicActionSheet'
        , '$rootScope'
        , 'commonService'
        , 'clazzService'
        , '$state'
        , '$ngRedux'
        , 'profileService']
})
class clazzDetailCtrl {
    $ionicActionSheet;
    commonService;
    profileService;
    clazzService;

    @select(state=>state.cm_select_clazz_info) clazzInfo;
    @select(state=>state.profile_user_auth.user.name) teacherName;

    textBookName = "北师版";
    back(){
        this.go("home.clazz_manage");
    }
    getClazzInfo() {
        if (this.clazzInfo.schoolName) {
            this.schoolName = this.clazzInfo.schoolName;
        }
        this.clazzName = this.clazzInfo.gradeName + this.clazzInfo.className;

        if (this.clazzInfo.status == 0) {
            this.status = "关闭";
        }
    };

    onAfterEnterView() {
        this.getTextBookName();
    }

    getTextBookName() {
        let name = this.clazzInfo.teachingMaterial || "BS-北师版";
        this.textBookName = name.split("-")[1];
    }

    updateClazz() {
        this.clazzService.setAddStuStatus(false);
        this.getStateService().go('add_clazz');
    };

    deleteClazz() {
        this.commonService.showConfirm('信息提示', '你确定要删除该班级吗？').then((res) => {
            if (res) {
                this.clazzService.deleteClazz({classId: this.clazz.id}).then(data=> {
                    if (data) {
                        this.commonService.alertDialog('删除成功');
                        this.initRootScopeClazz();
                        this.getStateService().go('clazz_manage');
                        return;
                    }
                    this.commonService.alertDialog('网络连接不畅，请稍后再试', 1200);
                })
            }
        });
    }

    initRootScopeClazz() {
        this.profileService.getTeacherClazzList().then(function (classInfo) {
            if (classInfo) {
                this.getRootScope().clazzList = classInfo.classes || [];
            }
        });
    }

    /**
     * 删除班级
     */
    deleteClazz() {
        if (Number(this.clazzInfo.studentCount) >= 5) {
            let msg = '请加微信：17780695191，联系智算365指导老师删除班级。';
            this.commonService.showAlert('提示', msg)
                .then(()=> {
                    return;
                })
        } else {
            let me = this;
            this.commonService.showPopup({
                title: '删除班级',
                template: '<p>班级信息可通过点击班级号进行修改，删除班级后不可恢复，您确定要删除该班级吗？</p>',
                buttons: [{
                    text: '确定',
                    type: 'button-positive',
                    onTap: (e)=> {
                        me.profileService.deleteSelectClazz(this.clazzInfo.id)
                            .then((data)=> {
                                if (data) {
                                    me.commonService.alertDialog('删除班级成功');
                                    me.go('home.clazz_manage');
                                } else {
                                    me.commonService.alertDialog('删除班级失败');
                                }
                            })
                    }
                }, {
                    text: '取消',
                    type: 'button-default',
                    onTap: (e)=> {
                        return;
                    }
                }]
            });


        }
    }

}

export default clazzDetailCtrl