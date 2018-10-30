/**
 * @description 添加班级controller
 * Created by 华海川 on 2015/7/30.
 */

import {Inject, View, Directive, select} from '../../module';

@View('add_clazz', {
    url: '/add_clazz',
    styles: require('./style.less'),
    template: require('./add_clazz.html'),
    inject: [
        '$scope',
        '$ionicModal',
        '$state',
        'clazzService',
        '$ionicLoading',
        'commonService',
        'profileService',
        '$rootScope',
        '$ionicPopup',
        '$ionicScrollDelegate',
        '$ngRedux',
        '$ionicHistory',
        'diagnoseService']
})


class addClazzCtrl {
    clazzService;
    commonService;
    profileService;
    $ionicLoading;
    $ionicPopup;
    $ionicModal;
    $ionicScrollDelegate;
    $ionicHistory;
    diagnoseService;
    @select(state=>state.cm_select_clazz_info) storeInfo;
    @select(state=>state.cm_add_clazz_status) isUpdate;
    modalType = ""; //展示modal的类型
    isDisabled = false; //默认可以点击
    clazzParam = this.clazzService.getClazzParam();
    title = "添加班级";
    btnTitle = "添加";
    initCtrl = false;
    clazzInfo = {};
    clazzTextName = ""; //教材版本
    /*  textBooks = [
     {id:"BS",name:"北师版"},
     {id:"RJ",name:"人教版"}
     ];*/

    constructor() {
        this.initView();
    }

    onAfterEnterView() {
        this.isParam();
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

    back() {
        this.go("home.clazz_manage");
        // this.$ionicHistory.goBack();
    }

    /**
     * @description 判断有误参数，有参数为修改页
     */
    isParam() {
        if (!this.isUpdate) {
            this.clazzInfo = this.storeInfo;
            this.clazzTextName = "北师版";
            if (this.clazzInfo.teachingMaterial) {
                this.clazzTextName = this.clazzInfo.teachingMaterial.split("-")[1] || "北师版";
            }

            this.title = "修改班级";
            this.btnTitle = "修改";
        }
        else {
            this.clazzInfo = {
                provinceId: "",
                cityId: "",
                districtId: "",
                schoolId: "",
                grade: "",
                clazz: "",
                id: "",
                provinceName: "",
                cityName: "",
                districtName: "",
                schoolName: "",
                gradeName: "",
                className: "",
                name: "",
                teachingMaterial: "",
            };
            this.clazzTextName = "";
            this.title = "添加班级";
            this.btnTitle = "添加";
        }
    };


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
        if (this.clazzInfo.provinceId == province.id) {
            this.provinceModal.hide();
            return;
        }
        this.clazzInfo.provinceId = province.id;
        this.clazzInfo.provinceName = province.name;
        this.clazzInfo.cityId = "";
        this.clazzInfo.cityName = "";
        this.clazzInfo.districtId = '';
        this.clazzInfo.districtName = "";
        this.clazzInfo.schoolId = "";
        this.clazzInfo.schoolName = '';
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
        if (!this.clazzInfo.provinceId) {
            this.commonService.alertDialog('请先选择省份...');
            return;
        }
        this.commonService.getLocations(this.clazzInfo.provinceId, 2).then(data=> {
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
        if (this.clazzInfo.cityId == city.id) {
            this.cityModal.hide();
            return;
        }
        this.clazzInfo.cityId = city.id;
        this.clazzInfo.cityName = city.name;
        this.clazzInfo.districtId = "";
        this.clazzInfo.districtName = "";
        this.clazzInfo.schoolId = "";
        this.clazzInfo.schoolName = "";
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
        if (this.clazzInfo.cityId == '') {
            this.commonService.alertDialog('请先选择市...');
            return;
        }
        this.commonService.getLocations(this.clazzInfo.cityId, 3).then(data=> {
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
        if (this.clazzInfo.districtId == district.id) {
            this.districtModal.hide();
            return;
        }
        this.clazzInfo.districtId = district.id;
        this.clazzInfo.districtName = district.name;
        this.clazzInfo.schoolName = '';
        this.clazzInfo.schoolId = '';
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
        if (!this.clazzInfo.districtId) {
            this.commonService.alertDialog('请先选择区县...');
            return;
        }
        this.commonService.getLocations(this.clazzInfo.districtId, 4).then(data=> {
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
        this.clazzInfo.schoolId = school.id;
        this.clazzInfo.schoolName = school.name;
        this.schoolModal.hide();
    };

    hideSchoolModel(ev) {
        //如果手动输入学校名称 那么学校名称就是学校ID.......
        ev.preventDefault();
        this.clazzInfo.schoolId = this.clazzInfo.schoolName;
        if (this.clazzInfo.schoolId === '' || !this.checkWordInput(this.clazzInfo.schoolName) || /[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/.test(this.clazzInfo.schoolId)) {
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
        this.clazzInfo.grade = grade.num;
        this.clazzInfo.gradeName = grade.name;
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
        this.clazzInfo.clazz = clazz.num;
        this.clazzInfo.className = clazz.name;
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
        // if(!this.isUpdate){
        //     // this.commonService.alertDialog('教材版本不可修改...');
        //     this.commonService.showAlert('温馨提示','如果需要切换教材版本，请联系智算365指导老师！');
        //     return;
        // }

        if (this.textBooks) {
            this.textBookModal.show();
            return;
        }
        this.clazzService.getTextBook().then(data=> {
            if (data.code == 200) {
                angular.forEach(data.detail, function (book, index) {
                    if (book.code == "AS") {
                        data.detail.splice(index, 1);
                    }
                });
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
        this.clazzInfo.teachingMaterial = textBook.code + "-" + textBook.text;
        this.clazzTextName = textBook.text;
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
        if (!this.checkWordInput(this.clazzInfo.name)) {
            this.commonService.alertDialog('班级名称格式不对...');
            return;
        }
        if (this.clazzTextName == '') {
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
            name: this.clazzInfo.name,
            teachingMaterial: this.clazzInfo.teachingMaterial,
            type: "100",
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
                    //修改成功班级教材版本，清空诊断选择的单元信息
                    if (this.clazzParam.teachingMaterial != param.teachingMaterial)this.diagnoseService.changeUnit(null);

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

    initRootScopeClazz() {
        this.profileService.getTeacherClazzList().then(classInfo=> {
            if (classInfo) {
                this.getRootScope().clazzList = classInfo.classes || [];
            }
        });
    }

    alertDialog(classId) {
        this.$ionicPopup.alert({
            title: '创建成功',
            template: '<p>请将下列信息告知家长，帮助学生注册加入您的班级。</p>'
            + '<p style="text-align: center">班级号：<span style="font-size: 18px;color: red">' + classId + '</span><br/>' +
            '官网下载APP：<span style="font-size: 18px;color: red">www.xuexiV.com</span></p>',
            okText: '确定'
        }).then(()=> {
            this.getStateService().go('home.clazz_manage');
        });
    }

    help() {  //提示信息
        this.$ionicPopup.alert({
            title: '常见问题',
            template: '<p style="color: #377AE6">问：年级为什么不能修改了呢？</p>' +
            '<p>答：年级由智算365根据时间自动变更，如果有疑问，请联系客服。</p>',
            okText: '确定'
        });
    };

}

export default addClazzCtrl;




