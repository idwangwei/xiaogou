/**
 * Created by qiyuexi on 2018/1/4.
 */
/*获取中文数字*/
class NumToChinese{
    constructor(){
        this.chnNumChar=["零","一","二","三","四","五","六","七","八","九"]
        this.chnUnitSection = ["","万","亿","万亿","亿亿"]
        this.chnUnitChar = ["","十","百","千"]
        this.chnNumChar2 = {'零':0, '一':1, '二':2, '三':3, '四':4, '五':5, '六':6, '七':7, '八':8, '九':9};
        this.chnNameValue = {
            '十':{value:10, secUnit:false},
            '百':{value:100, secUnit:false},
            '千':{value:1000, secUnit:false},
            '万':{value:10000, secUnit:true},
            '亿':{value:100000000, secUnit:true}
        }
    }
    NumberToChinese(num){
        var unitPos = 0;
        var strIns = '', chnStr = '';
        var needZero = false;
        if(num === 0){
            return this.chnNumChar[0];
        }
        while(num > 0){
            var section = num % 10000;
            if(needZero){
                chnStr = this.chnNumChar[0] + chnStr;
            }
            strIns = this.SectionToChinese(section);
            strIns += (section !== 0) ? this.chnUnitSection[unitPos] : this.chnUnitSection[0];
            chnStr = strIns + chnStr;
            needZero = (section < 1000) && (section > 0);
            num = Math.floor(num / 10000);
            unitPos++;
        }
        return chnStr;
    }
    SectionToChinese(section){
        var strIns = '', chnStr = '';
        var unitPos = 0;
        var zero = true;
        while(section > 0){
            var v = section % 10;
            if(v === 0){
                if(!zero){
                    zero = true;
                    chnStr = this.chnNumChar[v] + chnStr;
                }
            }else{
                zero = false;
                strIns = this.chnNumChar[v];
                strIns += this.chnUnitChar[unitPos];
                chnStr = strIns + chnStr;
            }
            unitPos++;
            section = Math.floor(section / 10);
        }
        return chnStr;
    }
    ChineseToNumber(chnStr){
        var rtn = 0;
        var section = 0;
        var number = 0;
        var secUnit = false;
        var str = chnStr.split('');

        for(var i = 0; i < str.length; i++){
            var num = this.chnNumChar2[str[i]];
            if(typeof num !== 'undefined'){
                number = num;
                if(i === str.length - 1){
                    section += number;
                }
            }else{
                var unit = this.chnNameValue[str[i]].value;
                secUnit = this.chnNameValue[str[i]].secUnit;
                if(secUnit){
                    section = (section + number) * unit;
                    rtn += section;
                    section = 0;
                }else{
                    section += (number * unit);
                }
                number = 0;
            }
        }
        return rtn + section;
    }
}
export default new NumToChinese();