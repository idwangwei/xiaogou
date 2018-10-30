/**
* 计时器对象  拥有属性:名字,时间间隔,id(window.interval的返回值),回调函数
* */
class Schedule {
    constructor(name, intervalTime, callback) {
        this.name = name; //计时器名字
        this.intervalTime = intervalTime; //计时器时间间隔
        this.interval = null; //计时器id
        this.intervalFn = callback; //计时器回调函数
    }
}

/**
 * 计时器队列 (一个计时器集合)
 */
class Scheduler {
    constructor() {
        this.schduleList = [];
    }

    /**
     * 让指定的计时器(interval)开始计时
     * @param schduleName 计时器的名字
     */
    startScheduler(schduleName) {
        this.schduleList.forEach(function (schdule) {
            if (schdule.name == schduleName) {
                if (schdule.intervalTime && schdule.intervalFn && !schdule.running)
                    schdule.interval = setInterval(schdule.intervalFn, schdule.intervalTime);
                    schdule.running=true;
            }
        });
    }

    /**
     * 让指定的计时器停止计时(clearInterval)
     * @param schduleName 计时器名字
     */
    stopScheduler(schduleName) {
        this.schduleList.forEach(function (schdule) {
            if (schdule.name == schduleName) {
                clearInterval(schdule.interval);
                schdule.running=false;
            }
        });
    }

    /**
     * 设置一个计时器并将其放入Scheduler队列中
     * @param schduleName 计时器名字
     * @param intervalTime 计时器间隔时间
     * @param callback 计时器回调函数
     */
    setSchdule(schduleName, intervalTime, callback) {
        this.removeSchdule(schduleName);
        this.schduleList.push(new Schedule(schduleName, intervalTime, callback));
    }

    /**
     * 将一个计时器从队列中移除,如果该计时器interval还在执行,先clearInterval
     * @param schduleName 计时器名字
     */
    removeSchdule(schduleName) {
        var index;
        this.schduleList.forEach(function (schdule, idx) {
            if (schdule.name == schduleName) {
                clearInterval(schdule.interval);
                index = idx;
            }
        });
        this.schduleList.splice(index, index + 1);
    }
}

export  default Scheduler;