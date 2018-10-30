/**
 * Created by LuoWen on 2016/11/18.
 */

import Vue from 'vue'
import deferLoad from '../tools/DeferLoad'
import VerticalCorrectnessComputed from './computed/VerticalCorrectnessComputed'

let VerticalCorrectnessComponent = ()=> ({
// Vue.component('vertical-correctness', deferLoad({
    template: require('./vertical-correctness.html'),
    props: ['gradeInfo'],
    data: function () {
        let gradeInfo = this.gradeInfo;
        return {
            correctness: gradeInfo && gradeInfo.correctness,
            errMsg: gradeInfo && gradeInfo.msg
        }
    },
    // computed: function () {
    //     let gradeInfo = this.gradeInfo;
    //     let correctness = false;
    //     if (gradeInfo) {
    //         gradeInfo.correctness;
    //     }
    //
    //     return {
    //         VF_CORRECT: correctness,
    //         VF_WRONG: correctness,
    //     }
    // },

    computed: VerticalCorrectnessComputed

});

export default VerticalCorrectnessComponent;
