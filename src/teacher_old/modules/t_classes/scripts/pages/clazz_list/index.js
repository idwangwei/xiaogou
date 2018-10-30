/**
 * Created by ZL on 2018/3/5.
 */
import {Inject, View, Directive, select} from '../../module';
import qqIcon from "./../../../../t_boot/tImages/qq.ico";
import weChatIcon from "./../../../../t_boot/tImages/wechat.ico";

@View('home.clazz_manage', {
    url: '/clazz_manage',
    styles:require('./style.less'),
    views: {
        "clazz_manage": {
            template: require('./page.html'),
        }
    },
    inject: [
        '$scope'
        , '$rootScope'
        , '$ionicPopup'
        , 'commonService'
        , 'clazzService'
        , '$state'
        , '$ngRedux'
        , '$ionicActionSheet'
        , 'finalData'
    ]
})

class ClazzListCtrl {
    clazzService;
    commonService;
    $ionicActionSheet;
    retFlag = false;
    isRefresh = false; //如果是下拉刷新就隐藏公共的转圈，默认不隐藏
    isDisabled = true; //是否可以添加学生
    tip = "点击左上方的“＋”添加班级";
    @select("clazz_list") clazzList;
    @select(state=>state.profile_user_auth.user.name) teacherName;
    initCtrl = false;

    constructor() {
        /*后退注册*/
        jQuery(".clazz-list-left-top-btn").click(()=> {
            this.addClazz();
        })
    }

    onAfterEnterView() {
        this.initClazz();  //每次进入页面都来初始化clazz_list是必要的，及时更新班级总览信息
        this.clazzService.setAddStuStatus(true);
        this.clazzService.setOpenStatus();
        setTimeout(()=> {
            this.isDisabled = false;
            this.getScope().$digest()
        }, 300)
    }

    initDisable() {
        this.isDisabled = true;//解决点一次相当于点2次得到问题
    }

    configDataPipe() {
        this.dataPipe
            .when(()=>!this.initCtrl)
            .then(()=> this.initCtrl = true)
            .then(()=> {

            })
    }

    /**
     * 初始化班级列表
     */
    initClazz() {
        this.clazzService.getClazzList().then((flag)=> {
            if (flag) {
                this.retFlag = true;
                this.isRefresh = false;
                this.getScope().$broadcast('scroll.refreshComplete');

            }
        });
    }

    //下拉刷新
    doRefresh() {
        this.isRefresh = true;
        this.initClazz();
    }

    /**
     * 编辑班级信息
     */
    edit(clazz) {
        this.clazzService.setClazzParam(clazz);
        this.initDisable();
        this.go('add_clazz');
    };


    showAns() {
        this.$ionicPopup.alert({
            title: '常见问题',
            template: `
                <p style="color: #377AE6">问：如何告诉家长安装注册并加入班级？</p>
                <p>答：可以点击班级信息下方的“点击通知学生加入”按钮，将链接发送至班级QQ群或者微信群即可。</p>
                <p>如果没有班级QQ群或微信群，请把下面的通知以其他方式告诉家长（以下文字可复制）</p>
                <div style="-webkit-user-select:auto;background-color: #dbdbdb;"> 
                    <p>各位家长：</p>
                    <p>1.请微信关注公众号“智算365”，里面有下载链接，可自主下载安装</p>
                    <p>2.安装后，点击智算365进行注册，注册时选学校老师班级，输入我的班级号</p>
                    <p>3.全体学生加入后，我将布置作业，请耐心等待查收</p>
                </div>`,

            okText: '确定'
        });
    }

    /**
     * 添加班级
     */
    addClazz() {
        // this.isDisabled = true;
        /*   if (this.getRootScope().isAdmin) {//如果是教研员最多也只能创建两个班级
         this.isDisabled = false;
         this.clazzService.setClazzParam('');
         this.getStateService().go('add_clazz');
         return;
         }
         */
        if (this.isDisabled) return;
        this.clazzService.tCanCreateClass().then((data) => {
            // this.isDisabled = false;
            if (data && data.code == 200) {
                this.clazzService.setClazzParam('');
                this.initDisable();
                this.go('add_clazz');
            }
            else if (data && data.code === 630) { //限制最多能创建的班级个数
                this.commonService.showAlert('温馨提示', `<div>${data.msg}</div>`);
            } else if (data && data.code == 631 && !this.getRootScope().isAdmin) { //没有加入教研圈
                this.commonService.showAlert('温馨提示', '<div>' + data.msg + '，先加入教研圈才能创建班级。点击“我”，进入“教研圈”，填写相关信息进行验证。</div>');
            } else {
                this.commonService.showAlert('温馨提示', `<div>${data.msg}</div>`);
            }
        });
    };

    /**
     * 切换申请通道
     * @param newStatus 1表示开启，0表示关闭
     * @param clazz 点选的班级
     */
    toggleApplyTunnel(newStatus, clazz) {
        if (newStatus == 1 && clazz.openStatus.open) { //点击开启按钮如果和之前相同就return
            /*  clazz.openStatus.open = true;
             clazz.openStatus.close = false;*/
            return;
        }
        if (newStatus == 2 && clazz.openStatus.close) { //点击关闭按钮如果和之前相同就return
            /*   clazz.openStatus.open = false;
             clazz.openStatus.close = true;*/
            return;
        }
        let openStatus = {};
        if (newStatus == 1) {
            openStatus.open = true;
            openStatus.close = false;
        } else {
            openStatus.open = false;
            openStatus.close = true;
        }

        this.clazzService.setApplication({id: clazz.id, status: newStatus}, openStatus);
    }

    /**
     * 班级详情
     */
    clazzDetail(clazz) {
        this.clazzService.getClazzInfo({id: clazz.id}).then((data)=> {
            if (data.code == 200) {
                this.clazzService.setClazzParam(clazz);
                this.initDisable();
                this.go('clazz_detail');
            } else {
                this.commonService.alertDialog('网络连接不畅，请稍后再试');
            }
        });
    };

    back() {
        return "exit";
    }

    isShowIosShare() {
        return this.commonService.judgeAppVersion();
    }

}

export default ClazzListCtrl;




