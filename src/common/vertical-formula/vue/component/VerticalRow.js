/**
 * Created by LuoWen on 2016/12/7.
 */

import Vue from 'vue'
import deferLoad from '../tools/DeferLoad'


let VerticalRowComponent = ()=>({
    template: require('./vertical-row.html'),
    props: ['vfRow'],
    data: function () {
        // console.log("row", JSON.stringify(this.vfRow));
        return {
            // vfRow4Cell: this.vfRow
        }
    }
});

export default VerticalRowComponent;
