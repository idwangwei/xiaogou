/**
 * Created by liangqinli on 2016/12/6.
 * textarea 输入字数限制和显示已输入字数显示
 */

import {Inject, Directive} from 'ngDecorator/ng-decorator';

@Directive({
    template: `<div class="textAreaWrap">
                 <textarea ng-model="ctrl.inputText" maxlength="{{ctrl.totalCount + 1}}"
                     placeholder="{{ctrl.placeholder}}" style="{{ctrl.textAreaStyle}}" ng-change="ctrl.showTextCount()"
                 ></textarea>
                 <div class="wordCount">
                    {{ctrl.inputText.length || 0}}/<span>{{ctrl.totalCount}}</span>
                 </div>
                 <p ng-show="ctrl.showTip" style="font-size: 12px; color: #fff;position:absolute; bottom: -8px;background-color: rgba(51,51,51,0.7)">只能输入{{ctrl.totalCount}}个字符哦~</p>
               </div>`,
    selector: 'textAreaWithWordCount',
    styles: require('./style.less'),
    replace: true,
    restrict: 'E',
    bindToController: {
        totalCount: '@',
        inputText: '=',
        textAreaStyle: '@',
        placeholder: '@'
    },
    scope: {}
})

class textAreaWithWordCount{
    constructor(){
        try{
            var totalCount = Number(this.totalCount);
        }catch(err){
            console.error('textAreaWithWordCount指令 totalCount参数必须传入数字');
            return;
        }

        this.showTip = false;
        this.showTextCount = ()=>{
            if(this.inputText.length > totalCount){
                this.showTip = true;
                this.inputText = this.inputText.slice(0, totalCount);
            }else{
                this.showTip = false;
            }
        }
    }
}