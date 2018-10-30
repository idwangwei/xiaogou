/**
 * Created by LuoWen on 2016/11/18.
 */

import Vue from 'vue'
import deferLoad from '../tools/DeferLoad'
import randomNumber from '../tools/RandomNumber'

let VerticalCursorComponent = ()=>({
// Vue.component('vertical-cursor', deferLoad({
    template: `<div class="cursor hardware-acceleration"
                        :class="verticalCursorClass"
                ></div>`,
    props: ["r", "c", "curCur"],
    data: function () {
        // console.log("row", JSON.stringify(this.vfRow));
        return {
            // vfRow4Cell: this.vfRow
        }
    },
    computed: {
        verticalCursorClass: function () {
            return {
                "vf-cursor-show": this.curCur,
            }
        }
    },
    beforeDestroy: function () {
        // console.log("cur before destroy")
    },
    destroyed: function () {
        // console.log("cur destroyed")
    }
// }, randomNumber(300, 400)));
// }, 600));
});

export default VerticalCursorComponent;
