/**
 * Created by 邓小龙 on 2017/2/17.
 */
import {Inject, View, Directive, select} from '../../module';
import userManifest from './../../../../t_boot/scripts/user_manifest';
import {UserManifest, SYSTEM_TYPE} from 'local_store/UserManifest';
var stuUserManifest = new UserManifest(SYSTEM_TYPE.STUDENT);
var pUserManifest = new UserManifest(SYSTEM_TYPE.PARENT);

@View('register', {
    url: '/register',
    cache: false,
    template: require('./register.html'),
    styles: require('./register.less'),
    inject: ['$scope'
        , '$rootScope'
        , '$log'
        , '$state'
        , '$interval'
        , '$timeout'
        , '$ionicLoading'
        , 'profileService'
        , 'teacherProfileService'
        , 'commonService'
        , 'clazzService'
        , '$ionicModal'
        , '$ionicScrollDelegate'
        , '$ionicSlideBoxDelegate'
        , 'serverInterface'
        , '$q'
        , '$http'
        , '$ionicPopup'
        , 'finalData'
        , '$ngRedux'
        , '$ionicHistory']
})
class teacherRegisterCtrl {
    $log;
    $q;
    $http;
    $ngRedux;
    $ionicLoading;
    $ionicPopup;
    $interval;
    $timeout;
    serverInterface;
    commonService;
    profileService;
    $ionicHistory;
    clazzService;
    $ionicModal;
    $ionicScrollDelegate;
    $ionicSlideBoxDelegate;
    modalType = ""; //展示modal的类型
    clazzInfo = {};//班级1
    clazzInfo2 = {};//班级2

    initCtrl = false;//初始化ctrl flag
    telVcBtnText = "点击获取";//按钮文字显示
    telVcBtn = false;//按钮不可以点击状态
    needVCode = false;//需要图形验证码(默认不需要图形验证码)
    needTelCode = false;//需要手机验证码
    submitClicked = false;

    formData = { //表单信息
        userName: '',
        password: '',
        gender: -1
    };

    @select(state=>state.profile_user_auth.isLogIn) isLogin;

    constructor() {
        this.initData();
        this.$timeout(()=> {
            this.$ionicSlideBoxDelegate.enableSlide(false); //静止左右滑动slide页面
        }, 500);
    }

    back() {
        this.go("system_login")
    }

    /**
     * 初始化
     */
    initData() {
        this.getFormDataFromLocal();
        this.getRootScope().ip = this.serverInterface.CLZ_IP;
        this.initView();
        /*this.getSessionId();*/
        this.slideBoxDelegate = this.$ionicSlideBoxDelegate.$getByHandle('register-slidebox');
        this.isIos = this.getRootScope().platform.IS_IPHONE || this.getRootScope().platform.IS_IPAD || this.getRootScope().platform.IS_MAC_OS;
    }

    initView() {
        this.initModalProvince();
        this.initModalCity();
        this.initModalDistrict();
        this.initModalSchool();
        this.initModalGrade();
        this.initModalClazz();
        this.initModalTextBook();
    }

    /*getSessionId(){
     this.$http.get(this.serverInterface.GET_SESSION_ID).success((resp)=> {
     if (resp.code == 200) {
     this.getRootScope().sessionID = resp.jsessionid;
     this.commonService.getValidateImageUrl().then((data) =>{ //初始图片验证码
     this.validateImageUrl = data;
     });
     return;
     }
     this.$log.log('getSesssionId error...');
     });
     }*/

    /**
     * 性别选择
     */
    genderSelect(event, checkStatus) {
        if (this.formData.gender == checkStatus) //如果当前已被点击，那么再次被点击，就返回
            return;
        else
            this.formData.gender = checkStatus;

        this.saveFormData();
    }

    addClazz() {
        this.addSecondClazz = true;
        let clazzInfo = angular.copy(this.clazzInfo);
        this.clazzInfo2.provinceId = clazzInfo.provinceId;
        this.clazzInfo2.provinceName = clazzInfo.provinceName;
        this.clazzInfo2.cityId = clazzInfo.cityId;
        this.clazzInfo2.cityName = clazzInfo.cityName;
        this.clazzInfo2.districtId = clazzInfo.districtId;
        this.clazzInfo2.districtName = clazzInfo.districtName;
        this.clazzInfo2.schoolId = clazzInfo.schoolId;
        this.clazzInfo2.schoolName = clazzInfo.schoolName;
        this.slideBoxDelegate.next();
    }

    deleteClazz() {
        this.addSecondClazz = false;
        this.clazzInfo2 = {};
        this.slideBoxDelegate.previous();
    }

    slideBoxChange(goFlag, registerForm) {
        let currentIndex = this.slideBoxDelegate.currentIndex();
        if (goFlag === 'up') {
            if (!this.addSecondClazz && currentIndex === 3) {
                this.slideBoxDelegate.slide(1);
            } else {
                this.slideBoxDelegate.previous();
            }
            this.$ionicScrollDelegate.scrollTop();
            return;
        }
        if (!this.addSecondClazz && currentIndex === 1) {
            this.slideBoxDelegate.slide(3);//跳转到最后一页
            this.$ionicScrollDelegate.scrollTop();
            return;
        }

        if (currentIndex === 3) {
            if (this.registerProcessing) return;
            this.registerSubmit(registerForm);
            return;
        }
        this.slideBoxDelegate.next();
        this.$ionicScrollDelegate.scrollTop();
    }

    getFormDataFromLocal() {
        let teacherInfo;
        let teacherLocalStr = localStorage.getItem('teacherRegisterInfo');
        if (teacherLocalStr) {
            teacherInfo = JSON.parse(teacherLocalStr);
            this.formData = teacherInfo.formData || {
                    userName: '',
                    password: '',
                    gender: -1
                };
            this.clazzInfo = teacherInfo.clazzInfo || {};
            this.clazzInfo2 = teacherInfo.clazzInfo2 || {};
        }
    }

    /**
     * 保存 formData 到localStorage
     */
    saveFormData() {
        let teacherInfo = {};
        var teacherLocalStr = localStorage.getItem('teacherRegisterInfo');
        if (teacherLocalStr)
            teacherInfo = JSON.parse(teacherLocalStr);
        teacherInfo.formData = this.formData;
        teacherInfo.clazzInfo = this.clazzInfo;
        teacherInfo.clazzInfo2 = this.clazzInfo2;
        localStorage.setItem('teacherRegisterInfo', JSON.stringify(teacherInfo));
    }

    checkClazzInfo(clazzInfo) {
        if (!clazzInfo.provinceId || !clazzInfo.cityId || !clazzInfo.districtId) {
            this.commonService.alertDialog('请选择完整省市县...');
            return false;
        }
        if (!clazzInfo.schoolId) {
            this.commonService.alertDialog('请填写选择学校...');
            return false;
        }
        if (!clazzInfo.grade) {
            this.commonService.alertDialog('请填写选择一个年级...');
            return false;
        }
        if (!clazzInfo.clazz) {
            this.commonService.alertDialog('请填写选择一个班级...');
            return false;
        }
        if (!clazzInfo.name) {
            this.commonService.alertDialog('请填写班级名称...');
            return;
        }
        if (!clazzInfo.clazzTextName) {
            this.commonService.alertDialog('请选择教材类型');
            return;
        }

        if (!this.checkWordInput(clazzInfo.name)) {
            this.commonService.alertDialog('班级名称格式不对...');
            return;
        }

        if (clazzInfo.name && clazzInfo.name.indexOf('年级') != -1) {
            this.commonService.showAlert('温馨提示',
                '<p>班级已含有年级信息，班级名称中不宜再有“年级”字样，每学年开学会自动提升该班级的年级</p>' +
                '<p>班级名称样列：2016级一班、花朵一班、海贝部落</p>'
            );
            return false;
        }
        return true;
    }

    checkAllInput(form) {
        if (form.$valid) {//表单数据合法，就登录
            if (this.formData.gender === -1) {
                this.commonService.alertDialog('请选择性别');
                this.slideBoxDelegate.slide(0);
                return false;
            }
            if (!this.checkWordInput(this.formData.realName)) {
                this.commonService.alertDialog('真实姓名格式不对...');
                this.slideBoxDelegate.slide(0);
                return false;
            }
            if (!this.checkClazzInfo(this.clazzInfo)) {
                this.slideBoxDelegate.slide(1);
                return false;
            }
            if (this.addSecondClazz && !this.checkClazzInfo(this.clazzInfo2)) {
                this.slideBoxDelegate.slide(2);
                return false;
            }

            /*if(!this.formData.vCode){
             this.commonService.alertDialog('请填入图形验证码');
             return false;
             }*/

            return true;
        } else {//不合法就提示相关信息
            var formParamList = ['cellphone', 'password', 'confirmPass', 'realName'];//需要验证的字段
            var errorMsg = this.commonService.showFormValidateInfo(form, formParamList);
            this.slideBoxDelegate.slide(0);
            /*不知道是什么问题，当有一次输入两次密码不一致，提示之后，formData.confirmPass与input输入框的双向绑定就没有了
             * formData.confirmPass就是undefined 即便再输入也是。所以当检车到confirmPass为true之后，手动给formData.confirmPass置为空
             * */
            if (errorMsg.numericField === 'confirmPass') this.formData.confirmPass = '';
            this.commonService.alertDialog(errorMsg.msg);
            return false;
        }
    }

    /**
     * 获取图片验证码
     */
    /* getValidateImage () {
     this.commonService.getValidateImageUrl().then((data)=> {
     this.validateImageUrl = data;
     this.imgVSuccess = false;
     });
     };*/

    /**
     * 注册（提交表单处理）
     */
    registerSubmit(registerForm) {
        if (this.checkAllInput(registerForm)) {
            if (!this.formData.telVC) {
                this.commonService.alertDialog('请填入短信验证码');
                return;
            }
            this.register();
        }
    }

    /**
     * 验证图形验证码
     */
    /*validateImageVCode(){
     if (this.formData.vCode) {
     this.commonService.validateImageVCode(this.formData.vCode).then(function (data) {
     if (data) {
     }
     });
     }
     }*/

    /**
     * 获取手机验证码
     */
    getTelVC(registerForm) {
        let error = registerForm['cellphone'].$error;
        if (error.required) {
            this.commonService.alertDialog('请先填写手机号', 1500);
            this.slideBoxDelegate.slide(0);
            return;
        }
        if (error.pattern) {
            this.commonService.alertDialog('手机号格式有误', 1500);
            this.slideBoxDelegate.slide(0);
            return;
        }
        /*if (!this.formData.vCode) {
         this.commonService.alertDialog('请先填写图形验证码', 1500);
         return;
         }*/
        if (!this.checkAllInput(registerForm))  return;
        if (this.telVcBtn) return;
        this.showTextForWait();

        this.commonService.getTelVC(this.formData.cellphone).then((data)=> {
            if (data && data.code == 200) {
                this.commonService.alertDialog("短信验证码已下发,请查收!", 1500);
                this.$log.error("tvc:" + data.telRC);
                return;
            }
            if (data && data.code == 552) {
                this.formData.telVC = data.telVC;
                this.$ionicPopup.alert({
                    title: '温馨提示',
                    template: '<p>手机验证码已收到并已自动填入，可以点击“注册”了</p>',
                    okText: '确定'
                });
            }
        });
        /*this.commonService.validateImageVCode(this.formData.vCode).then((data)=> {

         if (data.code = 200) {
         /!*this.commonService.getTelVC(this.formData.cellphone).then((data)=> {
         if (data && data.code == 200) {
         this.commonService.alertDialog("短信验证码已下发,请查收!", 1500);
         this.$log.error("tvc:" + data.telRC);
         return;
         }
         if (data && data.code == 552) {
         this.formData.telVC = data.telVC;
         this.$ionicPopup.alert({
         title: '温馨提示',
         template: '<p>手机验证码已收到并已自动填入，可以点击“注册”了</p>',
         okText: '确定'
         });
         return;
         }
         });*!/
         return;
         }
         this.commonService.alertDialog('图形验证码错误', 1500);
         this.getValidateImage();
         });*/
    }


    /**
     * 发送手机验证码后等待60秒
     */
    showTextForWait() {
        this.telVcBtn = true;
        let count = 60;
        //$scope.telVcServerVal='';
        this.interval = this.$interval(()=> {
            if (count == 0) {
                this.telVcBtnText = "点击获取";
                this.telVcBtn = false;
                this.$interval.cancel(this.interval);
            } else {
                this.telVcBtnText = count + "秒";
                count--;
            }
            this.$log.log(count + '.......');
        }, 1000);
    }

    /**
     * 把新注册的帐号存入localStory用于登录的时候给予提示
     */
    saveNewRegisterForLoginTip(loginName, clazzCount) {
        let newRegisterForLoginTipList = this.commonService.getLocalStorage('newRegisterForLoginTipList');
        if (!newRegisterForLoginTipList) newRegisterForLoginTipList = [];
        newRegisterForLoginTipList.push({loginName: loginName, clazzCount: clazzCount});
        this.commonService.setLocalStorage('newRegisterForLoginTipList', newRegisterForLoginTipList);
    }


    /**
     * 发起用户注册请求并处理返回结果
     */
    register() {
        this.registerProcessing = true;
        let params = {
            telephone: this.formData.cellphone,
            password: this.formData.password,
            deviceId: this.commonService.getDeviceId(),
            iCode: this.formData.iCode,
            telVC: this.formData.telVC,
            additional: {
                name: this.formData.realName,
                gender: this.formData.gender
            }
        };
        let clazzList = [], clazzInfo1 = {
            provinceId: this.clazzInfo.provinceId,
            cityId: this.clazzInfo.cityId,
            districtId: this.clazzInfo.districtId,
            schoolId: this.clazzInfo.schoolId,
            grade: this.clazzInfo.grade,
            class: this.clazzInfo.clazz,
            name: this.clazzInfo.name,
            book: this.clazzInfo.teachingMaterial
        };
        clazzList.push(clazzInfo1);
        if (this.addSecondClazz) {
            let clazzInfo2 = {
                provinceId: this.clazzInfo2.provinceId,
                cityId: this.clazzInfo2.cityId,
                districtId: this.clazzInfo2.districtId,
                schoolId: this.clazzInfo2.schoolId,
                grade: this.clazzInfo2.grade,
                class: this.clazzInfo2.clazz,
                name: this.clazzInfo2.name,
                book: this.clazzInfo2.teachingMaterial
            };
            clazzList.push(clazzInfo2);
        }
        params.additional.classes = clazzList;
        try {
            params.additional = JSON.stringify(params.additional)
        } catch (err) {
            console.error(err);
        }
        this.profileService.register(params).then((data)=> {
            this.registerProcessing = false;

            if (data && data.code == 200) {
                this.getRootScope().loginName = (data.teacher && data.teacher.loginName) || data.loginName;
                if (data.teacher) {
                    let newTUser = {
                        loginName: data.loginName,
                        name: data.teacher.name,
                        gender: data.teacher.gender
                    }, newPUser = {
                        loginName: data.parent.loginName,
                        name: data.parent.name,
                        gender: data.parent.gender
                    }, newSUser = {
                        loginName: data.students[0].loginName,
                        name: data.students[0].name,
                        gender: data.students[0].gender
                    };
                    userManifest.addUserToUserList(newTUser);
                    stuUserManifest.addUserToUserList(newSUser);
                    pUserManifest.addUserToUserList(newPUser);
                }
                this.formData = {};
                this.getStateService().go('register_success_new', {
                    tLoginName: data.loginName || '',
                    pLoginName: (data.parent && data.parent.loginName) || '',
                    sLoginName: ( (data.students && data.students[0]) && data.students[0].loginName) || ''
                });
                let clazzCount = this.addSecondClazz ? 2 : 1;
                this.saveNewRegisterForLoginTip(this.getRootScope().loginName, clazzCount);
                localStorage.removeItem('teacherRegisterInfo');
                return;
            }
            if (data && data.code == 551) {
                this.commonService.alertDialog("手机验证码不正确!", 1500);
            } else {
                this.commonService.alertDialog(data.msg, 1500);
            }
        }, err => this.registerProcessing = false);
    }

    /**
     * @description 初始化省modal页
     */
    initModalProvince() {
        this.$ionicModal.fromTemplateUrl('selectProvince.html', {
            scope: this.getScope(),
            animation: 'slide-in-up'
        }).then(modal=> {
            this.provinceModal = modal;
            this.getRootScope().modal.push(modal);
        });
    }


    /**
     * @description 打开省modal页
     */
    openProvinceModal() {
        this.commonService.getLocations('', 1).then((data)=> {
            if (data.code == 200) {
                this.Province = data.locations;
                this.provinceModal.show();
                return;
            }
            this.commonService.alertDialog('网络连接不畅，请稍后再试...');
        });
    };

    /**
     * 选择省
     */
    selectedProvince(province) {
        let clazzInfo = this.slideBoxDelegate.currentIndex() === 2 ? this.clazzInfo2 : this.clazzInfo;
        if (clazzInfo.provinceId == province.id) {
            this.provinceModal.hide();
            return;
        }
        clazzInfo.provinceId = province.id;
        clazzInfo.provinceName = province.name;
        clazzInfo.cityId = "";
        clazzInfo.cityName = "";
        clazzInfo.districtId = '';
        clazzInfo.districtName = "";
        clazzInfo.schoolId = "";
        clazzInfo.schoolName = '';
        this.saveFormData();
        this.provinceModal.hide();
    };

    /**
     * @description 初始化市modal页
     */
    initModalCity() {
        this.$ionicModal.fromTemplateUrl('selectCity.html', {
            scope: this.getScope(),
            animation: 'slide-in-up'
        }).then(modal=> {
            this.cityModal = modal;
            this.getRootScope().modal.push(modal);
        });
    }


    /**
     * @description 打开市modal
     */
    openCityModal() {
        let clazzInfo = this.slideBoxDelegate.currentIndex() === 2 ? this.clazzInfo2 : this.clazzInfo;
        if (!clazzInfo.provinceId) {
            this.commonService.alertDialog('请先选择省份...');
            return;
        }
        this.commonService.getLocations(clazzInfo.provinceId, 2).then(data=> {
            if (data.code == 200) {
                this.City = data.locations;
                this.cityModal.show();
                return;
            }
            this.commonService.alertDialog('网络连接不畅，请稍后再试...');
        });
    };

    /**
     * 选择市
     */
    selectedCity(city) {
        let clazzInfo = this.slideBoxDelegate.currentIndex() === 2 ? this.clazzInfo2 : this.clazzInfo;
        if (clazzInfo.cityId == city.id) {
            this.cityModal.hide();
            return;
        }
        clazzInfo.cityId = city.id;
        clazzInfo.cityName = city.name;
        clazzInfo.districtId = "";
        clazzInfo.districtName = "";
        clazzInfo.schoolId = "";
        clazzInfo.schoolName = "";
        this.saveFormData();
        this.cityModal.hide();
    };

    /**
     * @description 初始化区县modal页
     */
    initModalDistrict() {
        this.$ionicModal.fromTemplateUrl('selectDistrict.html', {
            scope: this.getScope(),
            animation: 'slide-in-up'
        }).then(modal=> {
            this.districtModal = modal;
            this.getRootScope().modal.push(modal);
        });
    }


    /**
     * @description 打开区县modal:
     */
    openCountyModal() {
        let clazzInfo = this.slideBoxDelegate.currentIndex() === 2 ? this.clazzInfo2 : this.clazzInfo;
        if (!clazzInfo.cityId) {
            this.commonService.alertDialog('请先选择市...');
            return;
        }
        this.commonService.getLocations(clazzInfo.cityId, 3).then(data=> {
            if (data.code == 200) {
                this.District = data.locations;
                this.districtModal.show();
                return;
            }
            this.commonService.alertDialog('网络连接不畅，请稍后再试...');
        });
    };

    /**
     * 选择区县
     */
    selectedDistrict(district) {
        let clazzInfo = this.slideBoxDelegate.currentIndex() === 2 ? this.clazzInfo2 : this.clazzInfo;
        if (clazzInfo.districtId == district.id) {
            this.districtModal.hide();
            return;
        }
        clazzInfo.districtId = district.id;
        clazzInfo.districtName = district.name;
        clazzInfo.schoolName = '';
        clazzInfo.schoolId = '';
        this.saveFormData();
        this.districtModal.hide();
    };

    /**
     * @description 初始化学校modal页
     */
    initModalSchool() {
        this.$ionicModal.fromTemplateUrl('selectSchool.html', {
            scope: this.getScope(),
            animation: 'slide-in-up'
        }).then(modal => {
            this.schoolModal = modal;
            this.getRootScope().modal.push(modal);
        });

    }


    /**
     * @description 打开学校modal
     */
    openSchoolModal() {
        let clazzInfo = this.slideBoxDelegate.currentIndex() === 2 ? this.clazzInfo2 : this.clazzInfo;
        if (!clazzInfo.districtId) {
            this.commonService.alertDialog('请先选择区县...');
            return;
        }
        this.commonService.getLocations(clazzInfo.districtId, 4).then(data=> {
            if (data.code == 200) {
                this.School = data.locations;
                this.schoolModal.show();             //显示学校
                this.$ionicScrollDelegate.scrollTop();
                return;
            }
            this.commonService.alertDialog('网络连接不畅，请稍后再试...');
        });
    };


    /**
     * 选择学校
     */
    selectedSchool(school) {
        let clazzInfo = this.slideBoxDelegate.currentIndex() === 2 ? this.clazzInfo2 : this.clazzInfo;
        clazzInfo.schoolId = school.id;
        clazzInfo.schoolName = school.name;
        this.saveFormData();
        this.schoolModal.hide();
    };

    hideSchoolModel(ev) {
        //如果手动输入学校名称 那么学校名称就是学校ID.......
        ev.preventDefault();
        let clazzInfo = this.slideBoxDelegate.currentIndex() === 2 ? this.clazzInfo2 : this.clazzInfo;
        clazzInfo.schoolId = clazzInfo.schoolName;
        if (clazzInfo.schoolId === '' || !this.checkWordInput(clazzInfo.schoolName) || /[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/.test(clazzInfo.schoolId)) {
            this.commonService.alertDialog('未输入正确学校名称...');
            return;
        }
        this.addOtherSchoolFlag = false;
        this.schoolModal.hide();
    }

    backFromEnterSchool() {
        this.addOtherSchoolFlag = false;
        this.schoolModal.hide();
    }

    addOtherSchool() {
        this.addOtherSchoolFlag = true;
        this.$ionicScrollDelegate.scrollTop(false);
    }

    /**
     * @description 初始化年级modal页
     */
    initModalGrade() {
        this.$ionicModal.fromTemplateUrl('selectGrade.html', {
            scope: this.getScope(),
            animation: 'slide-in-up'
        }).then(modal=> {
            this.gradeModal = modal;
            this.getRootScope().modal.push(modal);
        });
    }


    /**
     * @description 打开年级modal
     */
    openGradeModal() {
        this.clazzService.getGradeClass().then(data=> {
            if (data) {
                this.Grade = data.grade;
                this.gradeModal.show();
                return;
            }
            this.commonService.alertDialog('网络连接不畅，请稍后再试...');
        });
    }

    /**
     * 选择年级
     */
    selectedGrade(grade) {
        let clazzInfo = this.slideBoxDelegate.currentIndex() === 2 ? this.clazzInfo2 : this.clazzInfo;
        clazzInfo.grade = grade.num;
        clazzInfo.gradeName = grade.name;
        this.saveFormData();
        this.gradeModal.hide();
    };

    /**
     * @description 初始化班级modal页
     */
    initModalClazz() {
        this.$ionicModal.fromTemplateUrl('selectClazz.html', {
            scope: this.getScope(),
            animation: 'slide-in-up'
        }).then(modal=> {
            this.clazzModal = modal;
            this.getRootScope().modal.push(modal);
        });
    }


    /**
     * @description 打开班级modal
     */
    openClazzModal() {
        this.clazzService.getGradeClass().then(data=> {
            if (data) {
                this.Clazz = data.class;
                this.clazzModal.show();
                return;
            }
            this.commonService.alertDialog('网络连接不畅，请稍后再试...');
        });

    }

    /**
     * 选择班级
     */
    selectedClazz(clazz) {
        let clazzInfo = this.slideBoxDelegate.currentIndex() === 2 ? this.clazzInfo2 : this.clazzInfo;
        clazzInfo.clazz = clazz.num;
        clazzInfo.className = clazz.name;
        this.saveFormData();
        this.clazzModal.hide();
    };

    /**
     * 初始化教材选择modal页
     */
    initModalTextBook() {
        this.$ionicModal.fromTemplateUrl('selectTextBook.html', {
            scope: this.getScope(),
            animation: 'slide-in-up'
        }).then(modal=> {
            this.textBookModal = modal;
            this.getRootScope().modal.push(modal);
        });
    }

    /**
     * 选择教材  teachingMaterial : BS-北师版), RJ-人教版
     */
    openTextBookModal() {

        if (this.textBooks) {
            this.textBookModal.show();
            return;
        }
        this.clazzService.getTextBook().then(data=> {
            if (data.code == 200) {
                if (angular.isArray(data.detail)) {
                    let findexIndex = -1;
                    for (let i = 0; i < data.detail.length; i++) {
                        if (data.detail[i].code === 'AS') {//奥数
                            findexIndex = i;
                            break;
                        }
                    }
                    if (findexIndex != -1)  data.detail.splice(findexIndex, 1);

                }
                this.textBooks = data.detail;
                this.textBookModal.show();
                return;
            }
            this.commonService.alertDialog('网络连接不畅，请稍后再试...');
        });

    }

    /**
     * 选择教材
     */
    selectedTextBook(textBook) {
        let clazzInfo = this.slideBoxDelegate.currentIndex() === 2 ? this.clazzInfo2 : this.clazzInfo;
        clazzInfo.teachingMaterial = textBook.code + "-" + textBook.text;
        clazzInfo.clazzTextName = textBook.text;
        this.saveFormData();
        this.textBookModal.hide();
    }

    /**
     * 添加或修改班级
     */
    add_update_Clazz() {
        if (this.clazzInfo.provinceId == '' || this.clazzInfo.cityId == '' || this.clazzInfo.districtId == '') {
            this.commonService.alertDialog('请选择完整省市县...');
            return;
        }
        if (this.clazzInfo.schoolId == '') {
            this.commonService.alertDialog('请填写选择学校...');
            return;
        }
        if (this.clazzInfo.grade == '') {
            this.commonService.alertDialog('请填写选择一个年级...');
            return;
        }
        if (this.clazzInfo.clazz == '') {
            this.commonService.alertDialog('请填写选择一个班级...');
            return;
        }
        if (this.clazzInfo.name == '') {
            this.commonService.alertDialog('请填写班级名称...');
            return;
        }
        if (this.clazzInfo.name.indexOf('年级') != -1) {
            this.commonService.showAlert('温馨提示',
                '<p>班级已含有年级信息，班级名称中不宜再有“年级”字样，每学年开学会自动提升该班级的年级</p>' +
                '<p>班级名称样列：2016级一班、花朵一班、海贝部落</p>'
            );
            return;
        }
        if (this.clazzInfo.clazzTextName == '') {
            this.commonService.alertDialog('请选择教材类型');
            return;
        }

        this.isDisabled = true; //不能点击了
        var param = {
            provinceId: this.clazzInfo.provinceId,
            cityId: this.clazzInfo.cityId,
            districtId: this.clazzInfo.districtId,
            schoolId: this.clazzInfo.schoolId,
            grade: this.clazzInfo.grade,
            clazz: this.clazzInfo.clazz,
            type: 100,
            name: this.clazzInfo.name,
            teachingMaterial: this.clazzInfo.teachingMaterial
        };

        var nameInfo = {
            provinceName: this.clazzInfo.provinceName,
            cityName: this.clazzInfo.cityName,
            districtName: this.clazzInfo.districtName,
            schoolName: this.clazzInfo.schoolName,
            gradeName: this.clazzInfo.gradeName,
            className: this.clazzInfo.className,
        };

        if (this.clazzParam) {
            param.id = this.clazzInfo.id;
            param.createdTime = this.clazzParam.createdTime;
            param.status = this.clazzParam.status;

            this.clazzService.updateClazz(param, nameInfo).then(data=> { //如果有参数，为修改
                this.isDisabled = false;
                if (data.code == 200) {
                    this.clazzService.setClazzParam('');
                    this.commonService.alertDialog('修改成功');
                    //this.initRootScopeClazz(); //初始化rootScope上的班级
                    this.getStateService().go('home.clazz_manage');
                    return;
                }
                if (data.code == 704) {
                    this.commonService.alertDialog(data.msg, 2000);
                    return;
                }
                this.commonService.alertDialog('网络连接不畅，请稍后再试...');
            });
            return;
        }

        this.clazzService.addClazz(param, nameInfo).then(data=> {   //如果没有参数，为添加
            this.$ionicLoading.hide();
            this.isDisabled = false;
            if (data.code == 200) {
                this.alertDialog(data.class.id);//提示信息
                //this.initRootScopeClazz(); //初始化rootScope上的班级
                return;
            }
            if (data.code == 704) {
                this.commonService.alertDialog(data.msg, 2000);
                return;
            }
            this.commonService.alertDialog('网络连接不畅，请稍后再试...');
        });
    };

    checkWordInput(inputStr) {
        let regExp = /^([\u4e00-\u9fa5]|\w)+$/;
        return regExp.test(inputStr);
    }


    onAfterEnterView() {
    }

    onBeforeLeaveView() {
        if (this.interval) {
            this.$interval.cancel(this.interval);
        }
    }


}

export default teacherRegisterCtrl;



