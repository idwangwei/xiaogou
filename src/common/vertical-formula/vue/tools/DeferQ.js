/**
 * Created by LuoWen on 2016/12/4.
 */

export default class DeferQ {
    constructor(queue) {
        this.queue = queue;
    }

    push(fn) {
        this.queue.push(fn)
    }

    /**
     * 使用循环, 并且触发了几个不用的分支时,
     * 如果需要在中途禁用后续操作, 就可以使用此方法。
     *
     * PS: 此方法并非异步
     *
     * @param cbNext
     * @param cbStop
     */
    eachQ(cbNext, cbStop) {
        let queue = this.queue;
        let index = -1;
        let isStop = false;

        if(!(queue instanceof Array)) {
            console.error("queue should be Array!!");
            return;
        }
        if(!(cbNext instanceof Function)) {
            console.error("queue should be Function!!");
            return;
        }

        let stop = function (data) {
            isStop = true;
            if(!(cbStop instanceof Function)) return;

            cbStop.apply(null, [data]);
        };

        let next = function(data) {
            index++;
            if(isStop) return;
            if(index >= queue.length) return;

            data = data || {};
            let ele = queue[index];
            cbNext.apply(null, [{ele, index, queue, data, next, stop}])
        };

        next();
    }
}