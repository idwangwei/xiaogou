/**
 * Created by 彭建伦 on 2016/3/24.
 * 用于在没有网络连接或者网络连接超时的时候
 * 在App上方显示网络连接错误的悬浮提示框
 */
import $ from 'jquery';
import template from './tpls/netConnectionTip.html'
import './css/netConnectionTip.css'
class NetConnectionTip {
    constructor() {
        this.ELE_ID = "net_connection_tip";
        this.ele = this.ensureElement();
    }

    /**
     * 获取网络错误提示的DOM元素，如果没有，则创建该元素
     */
    ensureElement() {
        //var selector = '#' + this.ELE_ID;
        //var ele = $(selector);
        //if (ele.length)
        //    return ele;
        //$('body').prepend(template);
        //this.ele = $(selector);
        //this.setupCloseListener();

    }

    /**
     * 添加关闭提示的Listener
     */
    setupCloseListener() {
        this.ele.on('clickn    ')
    }

    show() {

    }

    hide() {

    }
}
export default NetConnectionTip;
