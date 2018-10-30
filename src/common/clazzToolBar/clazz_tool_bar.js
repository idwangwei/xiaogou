/**
 * Created by Administrator on 2016/11/2.
 */

import './clazz_tool_bar.css';
import close_btn from './close_btn.png';
import tool_bar from './tool_bar.png';
class ClazzToolBar {
    constructor() {
        this.clazzToolBarDiv = null;
        this.offset = {};
        this.generateNodes();
    }

    generateNodes() {
        //创建浮动框
        this.clazzToolBarDiv = document.createElement('div');
        this.clazzToolBarDiv.setAttribute('class', 'clazzToolBar clazzToolBarHide');
        let barImg = document.createElement('img');
        let closeImg = document.createElement('img');
        barImg.setAttribute('src', tool_bar);
        closeImg.setAttribute('src', close_btn);
        barImg.setAttribute('class', 'clazz_bar');

        //添加进dom中
        this.clazzToolBarDiv.appendChild(barImg);
        this.clazzToolBarDiv.appendChild(closeImg);
        document.body.appendChild(this.clazzToolBarDiv);

        //点击事件绑定
        barImg.onclick = (e)=>{
            e.stopPropagation();
            let $state = angular.element('body').scope().$root.$injector.get('$state');
            let finalData = angular.element('body').scope().$root.$injector.get('finalData');
            let $rootScope = angular.element('body').scope().$root.$injector.get('$rootScope');
            if(finalData.CLAZZ_TOOLS_ROUTE != $state.current.name){
                $rootScope.enterClazzToolRoute = $state.current.name;
                $rootScope.enterClazzToolRouteParams = $state.params;
                $state.go(finalData.CLAZZ_TOOLS_ROUTE);
            }
        };
        closeImg.onclick = (e)=>{
            e.stopPropagation();
            this.hide();
        };

        //拖动
        let offset = {};
        let div = document.getElementsByClassName('clazzToolBar')[0];
        div.addEventListener('touchstart',function (event) {
            event.preventDefault();//阻止其他事件
            let left = $(this).css('left').match(/\d+/) && +$(this).css('left').match(/\d+/)[0] ;
            let top = $(this).css('top').match(/\d+/) && +$(this).css('top').match(/\d+/)[0];
            if (event.targetTouches.length == 1) {
                let touch = event.targetTouches[0];  // 把元素放在手指所在的位置
                offset = {
                    x: (left||touch.pageX) - touch.pageX,
                    y: (top||touch.pageY) - touch.pageY
                }
            }
        });
        div.addEventListener('touchmove',function (event) {
            // 如果这个元素的位置内只有一个手指的话
            if (event.targetTouches.length == 1) {
                let touch = event.targetTouches[0];  // 把元素放在手指所在的位置
                let top = touch.pageY+offset.y;
                let left = touch.pageX+offset.x;
                left = left > screen.availWidth - this.offsetWidth ? screen.availWidth - this.offsetWidth:left;
                top = top > screen.availHeight - this.offsetWidth ? screen.availHeight - this.offsetWidth:top;
                div.style.left = left < 1 ? 1:left+'px';

                div.style.top = top < 1 ? 1:top+'px';
                div.style.background = "";
            }
        })
    }

    show() {
        this.clazzToolBarDiv.setAttribute('class', 'clazzToolBar clazzToolBarShow');
    }

    hide() {
        this.clazzToolBarDiv.setAttribute('class', 'clazzToolBar clazzToolBarHide');
    }

    static getClazzToolBar() {
        if (!window.allerClazzToolBar)
            window.allerClazzToolBar = new ClazzToolBar();
        return window.allerClazzToolBar;
    }
}
export default ClazzToolBar.getClazzToolBar();
