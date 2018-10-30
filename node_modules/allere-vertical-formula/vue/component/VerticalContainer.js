/**
 * Created by LuoWen on 2016/11/18.
 */

import Vue from 'vue'
import CONST from './../../vfconst'
import VerticalCtrl from '../ctrl/VerticalContainerCtrl'
// import eventHub from '../event/EventHub'
import * as events from '../event/EventTypes'
import deferLoad from '../tools/DeferLoad'

// import VerticalRow from './VerticalRow'
// import VerticalCell from './VerticalCell'
// import VerticalCursor from './VerticalCursor.vue'

import VerticalRowComponent from '../component/VerticalRow'
import VerticalCellComponent from '../component/VerticalCell'
// import VerticalCursorComponent from '../component/VerticalCursor'
import VerticalCorrectnessComponent from '../component/VerticalCorrectness'

let defer = {
    component: null,
    resolve: null
};
let VerticalContainerComponent = ()=> ({
    template: require('./vertical-container.html'),
    props: [],
    data: function () {
        console.log("container:");
        this.ctrl = new VerticalCtrl(this);

        return {
            // bgImg: require("../../images/gears.svg")
        };
    },
    mounted: function (el) {
        // console.log("mounted", arguments);
        let ctrl = this.ctrl;
        ctrl.eventHub.$emit(events.ADD_CLICK_4_CONTAINER, ctrl);
        // this.ctrl.addClickListener();
    },
    computed: {
        verticalContainerClass: function () {
            let ctrl = this.ctrl;
            return {
                [CONST.CSS_NAME_CONTAINER_BORDER]: ctrl.hasStyleContainerBorder, //!this.tools.isTypeBlank(),
                [CONST.CSS_NAME_EDITABLE_COLOR]: ctrl.getStyleContainerEditableColor(),//getStyleCellEditableColor.call(this),
                [CONST.CSS_NAME_VF_CONTAINER_ERR1]: ctrl.hasStyleContainerBorderErr1,
            }
        },
        verticalLoadingClass: function () {
            let root = this.ctrl.getVmRoot();
            return {
                [CONST.CSS_NAME_VF_LOADING]: root.loading
            }
        },
        VF_BLANK_MARGIN: function (comp) {
            return {[CONST.CSS_NAME_VF_CONTAINER_BLANK_MARGIN]: comp.ctrl.isTypeBlank}
        }

    },
    methods: {
        asyncLoadRow: function () {
            console.log("clicked");
            defer.resolve(defer.component);
        }
    },
    destroyed: function () {
        // console.log("beforeDestroy", this);
        this.ctrl.vam = null;
        this.ctrl.eventHub = null;
        this.ctrl.ctx = null;
        this.ctrl = null;
    },
    // VerticalRowComponent();
    // VerticalCellComponent();
    // VerticalCursorComponent();
    // VerticalCorrectnessComponent();

    components: {
        'vertical-row': VerticalRowComponent(),
        'vertical-cell': VerticalCellComponent(),
        'vertical-correctness': VerticalCorrectnessComponent(),
        // 'vertical-cursor': VerticalCursor,
        // 'vertical-cursor-none': {template: `<span/>`}
    },
    // render: h => h(VerticalCursor)
});

export default VerticalContainerComponent;
