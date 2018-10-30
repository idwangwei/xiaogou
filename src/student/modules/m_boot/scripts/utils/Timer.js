/**
 * 计时器
 */
class Timer {
    constructor() {
        this._interval = 0;
    }

    /**
     * 开始计时
     */
    start() {
        this._start_time = new Date().getTime();
    }

    /**
     * 结束计时
     */
    stop() {
        this._end_time = new Date().getTime();
    }

    /**
     * 清楚计时
     */
    clear() {
        this._interval = 0;
    }

    /**
     * 获取计时时间
     * @returns {number} 秒
     */
    get_interval() {
        return Math.abs((this._end_time - this._start_time) / 1000);
    }
}

export default Timer