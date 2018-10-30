/**
 * Created by liangqinli on 2017/3/20.
 */


export function dhms(t, pattern){
    /*
     * d天 H小时 m分 s秒
     * */
    var days, hours, minutes, seconds;
    days = Math.floor(t / 86400);
    t -= days * 86400;
    hours = Math.floor(t / 3600) % 24;
    t -= hours * 3600;
    minutes = Math.floor(t / 60) % 60;
    t -= minutes * 60;
    seconds = t % 60;
    function checkTime(i){ //将0-9的数字前面加上0，例1变为01
        if(i<10)
        {
            i = "0" + i;
        }
        return i;
    }
    switch(pattern){
        case 'dHms': return `${days}天${hours}时${minutes}分${seconds}秒`;
        case 'Hms': return `${hours}时${minutes}分${seconds}秒`;
        case 'ms': return `${minutes}分${seconds}秒`;
        case 'ms2': return `${checkTime(minutes)} : ${checkTime(seconds)}`;
        default: return `${days}天${hours}时${minutes}分`;
    }
}