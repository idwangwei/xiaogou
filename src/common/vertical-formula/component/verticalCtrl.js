/**
 * Created by LuoWen on 16/7/29.
 */

class VerticalCtrl{

    constructor(verticalService, $scope, $compile, $injector, $timeout, $state) {
      // alert('aa')
      //   this.$compile = $compile;
      //   this.$injector = $injector;
        this.verticalService = verticalService;
        // this.$state = $state;
        // this.$timeout = $timeout;

        // this.getScope = ()=>$scope;

        // this.initData();
    }

    // initData() {
    //     console.log("")
    //     // this.initListeners();
    //     this.cursor = this.$compile('<cursor class="vf-cursor"/>')(this.getScope());
    //     //初始化的时候,不出现键盘
    //     this.needShowKeyboard = false;
    //
    //     try {
    //         this.commonService = this.$injector.get('commonService');
    //     } catch (e) {
    //         console.log('commonService not found!');
    //         this.$ngRedux = {connect: {}};
    //         this.commonService = {
    //             showAlert: (title, msg)=> {
    //                 window.alert(`title: ${title} \n msg:${msg}`);
    //             },
    //             showConfirm: (title, msg) => {
    //                 window.confirm(msg)
    //             }
    //         };
    //     }
    //     try {
    //         this.ngRedux = this.$injector.get('ngRedux');
    //     } catch (e) {
    //         console.log('ngRedux not found!');
    //     }
    // }
}

VerticalCtrl.$inject = [
    'verticalService',
    // '$scope',
    // '$compile',
    // '$injector',
    // '$timeout',
    // '$state'
];

export default VerticalCtrl;