/**
 * Created by LuoWen on 2016/11/16.
 */

import Vue from 'vue'
import Vuex from 'vuex'
// import Tools from './tools'
import VerticalContainerComponent from './component/VerticalContainer'
// import VerticalRowComponent from './component/VerticalRow'
// import VerticalCellComponent from './component/VerticalCell'
// import VerticalCursorComponent from './component/VerticalCursor'
// import VerticalCorrectnessComponent from './component/VerticalCorrectness'
// import VerticalCursor from './component/VerticalCursor'
// import VerticalRow from './component/VerticalRow'
// import VerticalCell from './component/VerticalCell'
import CONST from '../vfconst'
import EventHub from './event/EventHub'
import Debugger from '../Debugger'

// Vue.use(Vuex);

// let tools;
let makeVertical = ([$scope, $injector, $state], uuid, verticalService) => {
    // Debugger.instance();

    let vfid = getVFID(uuid);
    let vam = verticalService.getOriginVerticalAnswerMatrix(uuid);
    // let vamR = verticalService.getDupVerticalAnswerMatrix(uuid);// Read Only
    let matrixCached = verticalService.matrixCached[uuid];

    // console.log('uuid:\n%s\nvam:\n%s\n', uuid, JSON.stringify(vam));

    // let $compile = getNgServiceFromInjector($injector, "$compile");
    let $q = getNgServiceFromInjector($injector, "$q");
    let commonService = getNgServiceFromInjector($injector, "commonService");
    Vue.config.devtools = false;

    // VerticalRowComponent();
    // VerticalCellComponent();
    // VerticalCursorComponent();
    // VerticalCorrectnessComponent();

    let vm = new Vue({
        el: `#${vfid}`,
        template: require('./vertical.html'),
        data: function () {
            // this.vamR = vamR;
            // this.eventHub = EventHub.init();
            this.mathSymbolType = verticalService.initVueDeadData.mathSymbolType; // add sub div mul
            this.isTypeBlank = isMatrixTypeBlank(matrixCached);
            this.isTypeCalc = isMatrixTypeCalc(matrixCached);
            this.isTypeError1 = isMatrixTypeError1(matrixCached);
            this.isTypeError2 = isMatrixTypeError2(matrixCached);
            this.vfid = vfid;
            this.isStateAllowed = isStateAllowed($state);

            return {
                loading: true,
                hello: vfid,
                vam: vam
            }
        },
        methods: {
            getMatrixUUID: function () {
                return uuid;
            },
            getVerticalService: function () {
                return verticalService;
            },
            getNgScope: function () {
                return $scope;
            },
            /**
             * @deprecated
             */
            getNgCompile: function () {
                // return $compile;
            },
            getQ: function () {
                return $q;
            },
            getEventHub: function () {
                return EventHub;
            },
            getCommonService: function () {
                return commonService;
            },
            getMatrixCached: ()=> matrixCached,
        },
        components: {
            'vertical-container': VerticalContainerComponent(),
            // 'vertical-container': VerticalContainer,
            // 'vertical-cursor': VerticalCursor,
            // 'vertical-row': VerticalRow,
            // 'vertical-cell': VerticalCell,
        },
        beforeDestroy: function () {
            // console.log("beforeDestroy", this);
            // this.ctrl = null;
            let _self = this;

            _self.eventHub = null;
            EventHub.refreshVmList(_self);
        }
    });

    // vm.$on("hook:beforeDestroy", function () {
    //     // console.log("beforeDestroy..");
    //     let _self = this;
    //
    //     //for GC
    //     _self.$root = null;
    //     _self.eventHub = null;
    //     EventHub.refreshVmList(_self);
    // });
    //
    // vm.ngScope = $scope;
    // vm.ngCompile = $compile;

    console.log("make vertical...");
    return vm;
};

let getVFID = (uuid) => {
    return `vf-${uuid}`;
};

let getNgServiceFromInjector = ($injector, ngServiceName)=> {
    let ngService = {};

    if(ngServiceName === 'commonService') {
        try {
            ngService = $injector.get(ngServiceName);
        } catch (e) {
            console.log('commonService not found!');
            ngService = {
                showAlert: (title, msg)=> {
                    window.alert(`title: ${title} \n msg:${msg}`);
                },
                showConfirm: (title, msg) => {
                    window.confirm(msg)
                }
            };
        }
    } else {
        ngService = $injector.get(ngServiceName);
    }

    return ngService;
};

let isMatrixTypeBlank = mc=> mc.type === CONST.MATRIX_TYPE_BLANKS;
let isMatrixTypeError1 = mc=> mc.type === CONST.MATRIX_TYPE_ERROR_1;
let isMatrixTypeError2 = mc=> mc.type === CONST.MATRIX_TYPE_ERROR_2;
let isMatrixTypeCalc = mc=> mc.type === CONST.MATRIX_TYPE_CALC;

let isStateAllowed = function ($state) {
    let name = $state.current.name; 
    if(name && name.match
	&& name.match(CONST.STATE_HOME_DO_QUESTION)
        && name.match(CONST.STATE_HOME_DIAGNOSE_DO_QUESTION)
        && name.match(CONST.STATE_QUESTION_EDIT)
        && name.match(CONST.STATE_QUESTION_EXAMINE)) {
        return false;
    }
    return true;
};


module.exports = makeVertical;
