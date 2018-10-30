/**
 * Created by ZL on 2018/3/13.
 */

import {Inject, View, Directive, select} from '../../module';

@View('teaching_group_list', {
    url: '/teaching_group_list',
    cache: false,
    template: require('./page.html'),
    styles: require('./style.less'),
    inject: ['$scope', '$state', 'teachingGroupService', '$ionicModal', '$ionicScrollDelegate', '$rootScope', '$ngRedux']
})
class TeachingGroupListCtrl {
    teachingGroupService;
    $ionicModal;
    $ionicScrollDelegate;
    retFlag = false;
    IS_SCHOOL_TYPE = 4;
    currentClickAreaType = undefined;//点击子级的areaType值
    currentSelectItem = undefined;
    isLoadingProcessing = true;

    constructor() {
        this.initModal();
    }

    initModal() {
        //初始化学校详情modal
        this.$ionicModal.fromTemplateUrl('groupDetailModal.html', {
            scope: this.getScope(),
            // animation: 'slide-in-right'
        }).then((modal) => {
            this.detailModal = modal;
        });
        this.getScope().$on('$destroy', ()=> {
            this.detailModal.remove();
        });
    }

    onAfterEnterView() {
        this.teachingGroupService.getTeachingGroupListOfAdmin(this.analysisTeachingGroupList.bind(this));
        this.serviceData = this.teachingGroupService.serviceData;
    }

    /**
     * 解析教研圈当前选择层级的总人数和活跃人数
     * @param flag
     */
    analysisTeachingGroupList(flag) {
        this.isLoadingProcessing = false;
        this.retFlag = true;

    }


    getGroupDetail(detail) {
        this.currentSelectItem = detail;

        //查看学校详情
        if (detail.areaType == this.IS_SCHOOL_TYPE) {
            this.selectSchool = detail;
            this.detailModal.show();
        }
        let param = {
            areaId: detail.id,
            areaType: detail.areaType
        };
        this.retFlag = false;
        this.isLoadingProcessing = true;
        this.teachingGroupService.getTeachingGroupListOfAdminDetail(param, (flag)=> {
            this.analysisTeachingGroupList();
            this.$ionicScrollDelegate.$getByHandle('teachGroupScroll').scrollTop(false);
            if (flag && detail.areaType != this.IS_SCHOOL_TYPE)
                this.currentClickAreaType = param.areaType;
        });
    }

    closeGroupDetailModal() {
        this.detailModal.hide();
    }

    switchOpen(e, t) {
        e.stopPropagation();
        t.isOpen = !t.isOpen;
    }

    back(mark) {
        if (this.currentClickAreaType) {
            for (let i = this.currentClickAreaType - 1; i >= 0; i--) {
                let group = this.serviceData.catchGroups[i];
                if (group) {
                    this.currentClickAreaType = i;
                    this.serviceData.TGroupsOfAdmin = group;
                    this.$ionicScrollDelegate.$getByHandle('teachGroupScroll').scrollTop(false);
                    break;
                }
            }
            if (!mark) {
                this.getScope().$digest();
            }
        }
        else {
            this.go("home.me");
        }
    }
}

export default TeachingGroupListCtrl;