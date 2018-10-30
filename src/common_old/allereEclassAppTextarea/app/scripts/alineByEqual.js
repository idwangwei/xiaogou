/**
 * Created by 邓小龙 on 2016/7/29.
 * @description  解方程以及解方程应用题的等号对齐处理
 */

import $ from 'jquery';
class AlineByEqual{

    constructor(){

    }

    isContainXY(unitArray){
        if(unitArray.filter('unit[value="x"]').length||unitArray.filter('unit[value="y"]').length||unitArray.filter('unit[unkn]').length)//题干中有xy的未知数
            return true;
        let fracUnits=unitArray.filter("unit[frac]");
        if(fracUnits.length){
            let fracHasUnkn=false;
            fracUnits.each(function (index,fracUnit) {
                let fracValue=$(fracUnit).children().eq(0).attr('value');
                if(fracValue&&(fracValue.indexOf("x")>-1||fracValue.indexOf("y")>-1)){
                    fracHasUnkn=true;
                }
            });
            if(fracHasUnkn)
                return true;
        }

    }

    /**
     * 当前试题是否为方程试题吗
     * @param inputBox 当前所在的输入区域
     */
    currentQIsEquation(inputBox){
        if(inputBox.hasClass('variable-solve-input-area'))//是解方程框
            return true;
        if(!inputBox.is('app-textarea')){ //不是应用题框
            return false;
        }
        if(!angular.element(inputBox).scope())
            return false;
        let pureWordsOfQuestion=angular.element(inputBox).scope().pureWordsOfQuestion;
        if(!pureWordsOfQuestion){//没有提干信息
            return false;
        }

        if(pureWordsOfQuestion.indexOf("方程")>-1) //题干中有“方程”
            return true;
        if(this.isContainXY(inputBox.children()))
            return true;

        return false;
    }


    /**
     * 是否需要等号对齐
     * @param isDoQuestion 是否在做题
     * @param inputBox 当前所在的输入区域
     * @param currentEle 当前添加的元素
     */
    isNeedAlineByEqual(inputBox,currentEle){

        let currentQIsEquationFlag= this.currentQIsEquation(inputBox);
        if(currentQIsEquationFlag){//如果当前试题是方程类型题，那么就看当前输入，是否需要重新计算。
            //在当前节点左边发现已有=，那么就不管这个式子是否为方程了，统一不计算位置了。
            let linePrevEqualUnit=currentEle.prevUntil('.newline',".aline-equal");
            if(linePrevEqualUnit.length)
                return false;
            //在当前节点左边发现已有=，那么就不管这个式子是否为方程了，统一不计算位置了。
            let linePrevUnits=currentEle.prevUntil('.newline');
            let lineNextUnits=currentEle.nextUntil('.newline');
            let lineStartIndex=currentEle.index()-linePrevUnits.length;
            let lineEndIndex=currentEle.index()+lineNextUnits.length+1;
            let lineUnits=inputBox.children().slice(lineStartIndex,lineEndIndex);
            //判断该unit行内是否有xy,并且有等号。
            let hasVariable= this.isContainXY(lineUnits)&&lineUnits.filter(".aline-equal").length;
            if(hasVariable){
                return true;
            }
            return false;
        }
        return false;
    }

    /**
     * 如果该行不是方程式
     * @param lineUnits 当前行的所有元素
     */
    isNotEquationremoveFirstLeft(lineUnits){
        let firstLeftUnit=lineUnits.filter("unit[first-left]");
        if(firstLeftUnit.length)
            firstLeftUnit.css("margin-left",0);
    }


    /**
     * 记录当前方程式等号的最大左侧距离
     * @param lineUnits 当前行的所有元素
     */
    recordCurrentEqualMaxLeft(lineUnits){
        let equalUnit=lineUnits.filter('.aline-equal').first();
        let firstLeftUnit=lineUnits.filter("unit[first-left]");
        if(equalUnit&&equalUnit.length){
            let equalUnitLeft=equalUnit[0].offsetLeft;
            //如果当前行第一个元素有margin-left，那么此行的“=”偏移就需要减去第一个元素的偏移。
            if(firstLeftUnit.length)
                equalUnitLeft=equalUnitLeft-parseFloat(lineUnits.filter("unit[first-left]").css('margin-left'));
            //如果当前“=”是距离左边是最大,其他之前对齐的等号需要重新按这个对齐。
            //否则这个按之前最大的对齐
            if(equalUnitLeft>this.currentMaxOffsetLeft){
                this.currentMaxOffsetLeft=equalUnitLeft;
                console.log("当前最大偏移左边距离：",this.currentMaxOffsetLeft);
            }
        }
    }

    /**
     * 记录 方程式的左侧第一个非换行或者空格的元素的索引
     * @param currentEleIndex 当前遍历元素在children数组的索引
     * @param lineUnits 当前行的所有元素
     */
    recordChangeUnitIndex(currentEleIndex,lineUnits){
        let lineLeftIndex=this.lastLineIndex;//左侧第一个非换行,非comment或者空格的元素的索引
        if(lineUnits.eq(0).is(".newline")||lineUnits.eq(0).is("unit[comment]")){
            lineLeftIndex++;
            if(lineUnits.eq(1).is('unit[space]')||lineUnits.eq(1).is('cursor')){
                lineLeftIndex++;
            }
        }
        let changeUnit={};
        changeUnit.currentEleIndex=currentEleIndex;
        changeUnit.lineLeftIndex=lineLeftIndex;
        this.changeIndexList.push(changeUnit);

    }

    /**
     * 处理每一行  按.newline 分隔
     * @param inputBox 当前所在的输入区域
     * @param lastLineIndex 当前换行所在的索引
     * @param isAlineEqual 是否按等号对齐
     * @param ele 当前元素
     */
    handleNewLine(inputBox,currentEleIndex,isAlineEqual,ele){

        let lineUnits=inputBox.children().slice(this.lastLineIndex,$(ele).index());//每一行的unit标签

        //判断该unit行内是否有xy,有就计算第一个其等号的最大偏移。
        let hasVariable=this.isContainXY(lineUnits);
        if(hasVariable){
            if(!isAlineEqual){
                this.recordChangeUnitIndex(currentEleIndex,lineUnits);
                this.recordCurrentEqualMaxLeft(lineUnits);
            }else{
                this.handleAlineEqual(inputBox,lineUnits,currentEleIndex);
            }

        }else{
            this.isNotEquationremoveFirstLeft(lineUnits);
        }
    }

    /**
     * 最后一行是等号，且没有换行了
     * @param inputBox 当前所在的输入区域
     * @param currentEleIndex 当前遍历元素在children数组的索引
     * @param isAlineEqual 是否需要处理等号对齐
     * @param ele 当前元素
     */
    handleLastLineEqual(inputBox,currentEleIndex,isAlineEqual,ele){
        //let lineUnits=inputBox.children().slice(this.lastLineIndex,$(ele).index()+1);//每一行的unit标签
        let lineUnits=inputBox.children().slice(this.lastLineIndex,inputBox.children().length);//每一行的unit标签

        //判断该unit行内是否有xy,有就计算第一个其等号的最大偏移。
        let hasVariable= this.isContainXY(lineUnits);
        if(hasVariable){
            let equalUnit=lineUnits.filter('.aline-equal').first();
            if($(ele).attr("id")!=equalUnit.attr("id"))//如果最后一行的方程式，当前不是第一个=就返回
                return;
            if(!isAlineEqual){
                this.recordChangeUnitIndex(currentEleIndex,lineUnits);
                this.recordCurrentEqualMaxLeft(lineUnits);
            }else{
                this.handleAlineEqual(inputBox,lineUnits,currentEleIndex);
            }

        }else{
            this.isNotEquationremoveFirstLeft(lineUnits);
        }
    }

    /**
     * 第一步： 查找等号的最大偏移左边的距离
     * @param inputBox 当前所在的输入区域
     */
    findEqualMaxLeft(inputBox){
        let me=this;
        inputBox.children().each(function (index,ele) {
            if($(ele).is(".newline")&&$(ele).prev().length){//找到换行,并且不是空行
                me.handleNewLine(inputBox,index,false,ele);
                me.lastLineIndex=$(ele).index();
                return;
            }
            if(me.lastLineIndex>0&&!$(ele).nextAll('.newline').length&&$(ele).text()==="="){//最后一行是等号，且没有换行了
                me.handleLastLineEqual(inputBox,index,false,ele);
            }
        });
    }

    /**
     *  处理方程式子的等号对齐
     * @param inputBox 当前所在的输入区域
     * @param lineUnits 当前换行所在的索引
     * @param currentEleIndex 当前元素所在的索引
     */
    handleAlineEqual(inputBox,lineUnits,currentEleIndex){

        let equalUnit=lineUnits.filter('.aline-equal').first();
        if(equalUnit&&equalUnit.length){
            let equalUnitLeft=equalUnit[0].offsetLeft;
            let marginLeft=this.currentMaxOffsetLeft-equalUnitLeft;
            this.changeIndexList.forEach(function(item){
                if(item.currentEleIndex===currentEleIndex) {
                    let firstUnit=inputBox.children().eq(item.lineLeftIndex);
                    let firstUnitLeft= parseFloat(firstUnit.css('margin-left')) ;
                    firstUnit.attr("first-left",true);
                    //这里取绝对值是为了左侧的空白满足当前的偏移所需。
                    firstUnit.css({
                        "marginLeft": Math.abs(firstUnitLeft+marginLeft),
                        "display":"inline-block"
                    });
                    console.log("最后marginLeft：",Math.abs(firstUnitLeft+marginLeft));
                }
            });
        }
    }

    /**
     * 第二步：使所有的方程式的等号对齐
     * @param inputBox 当前所在的输入区域
     */
    alineAllEqual(inputBox){
        this.lastLineIndex=null;
        let me=this;
        inputBox.children().each(function (index,ele) {
            if($(ele).is(".newline")&&$(ele).prev().length){//找到换行,并且不是空行
                me.handleNewLine(inputBox,index,true,ele);
                me.lastLineIndex=$(ele).index();
                return;
            }
            if(me.lastLineIndex>0&&!$(ele).nextAll('.newline').length&&$(ele).text()==="="){//最后一行是等号，且没有换行了
                me.handleLastLineEqual(inputBox,index,true,ele);
            }
        });
    }


    /**
     * 方程式的等号自动对齐
     * @param inputBox 当前所在的输入区域
     */
    alineEqualAuto(inputBox){
        console.log("调用方程等号对齐处理..............");
        this.changeIndexList=[];//可能要改变偏移距离的unit对象数组
        this.currentMaxOffsetLeft=-1;//当前方程式子的等号距离左边的最大距离
        this.lastLineIndex=0;//当前换行所在的索引。
        this.findEqualMaxLeft(inputBox);
        console.log("第一步过后，最大偏移左边的距离：",this.currentMaxOffsetLeft);
        if(this.currentMaxOffsetLeft===-1){//表示当前没有输入方程式子
            return;
        }
        this.alineAllEqual(inputBox);

    }
}
export default AlineByEqual;
