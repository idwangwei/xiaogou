import LocalStorageUtil from './LocalStorageUtil';
import Scheduler from './Scheduler';
/**
 * 记录做题时间的类
 */
class TimeCollector {
    constructor() {
        this.$documentBody = angular.element(document.body);
        this.paperId = null;
        this.currentItem = null;
        this.localStorageUtil = new LocalStorageUtil();
        this.schduler = new Scheduler();
        this.MAX_COUNT = 60 * 5;//用户超过MAX_COUNT时间后没有做任何操作，则停止定时器
        this.LOCAL_STORAGE_DO_PAPER_TIME_KEY = 'do_paper_time'; //localStorage中存储做题时间的KEY
        this.LOCAL_STORAGE_DO_PAPER_TIME_PAPER_KEY = 'paperInstanceID';//paperInstance ID
        this.PAPER_STATUS = {
            UN_SUBMIT: '1', //改试卷未提交,
            UN_DO:'1', //试卷未开始
            DOING:'2' //试卷进行中
        };
        this.SAVE_DO_PAPER_TIME_SCHDULE = {
            NAME: 'save_do_paper_time_schdule',
            INTERVAL_TIME: 1000
        };

        this.resetCount = function () {
            var currentItem = this.localStorageUtil.getJSONArrayItem(this.LOCAL_STORAGE_DO_PAPER_TIME_KEY, this.LOCAL_STORAGE_DO_PAPER_TIME_PAPER_KEY, this.paperId);
            if (currentItem.count) {
                currentItem.count = 0;
                this.currentItem.count = 0;
            }
            this.localStorageUtil.saveOrUpdateJSONArray(this.LOCAL_STORAGE_DO_PAPER_TIME_KEY, [this.currentItem], this.LOCAL_STORAGE_DO_PAPER_TIME_PAPER_KEY);
            this.schduler.startScheduler(this.SAVE_DO_PAPER_TIME_SCHDULE.NAME);
        }.bind(this);
    }

    /**
     * 根据试卷信息收集做题时间
     * @param paperInstanceId 试卷的批次Id
     * @param paperStatus 试卷状态
     * @param paperName 试卷名称
     */
    checkStatusForPaper(paperInstanceId, paperStatus, paperName) {
        // var paperStatus = paperInfo.history.status.key;
        if (paperStatus == this.PAPER_STATUS.UN_DO || paperStatus == this.PAPER_STATUS.DOING) {
            this.startCollectTimeForPaper(paperInstanceId, paperName);
        } else { //该试卷已提交，则检查LocalStorage中是否存有该试卷的做题时间信息，有则删除
            this.localStorageUtil.deleteJSONArrayItem(this.LOCAL_STORAGE_DO_PAPER_TIME_KEY, this.LOCAL_STORAGE_DO_PAPER_TIME_PAPER_KEY, paperInstanceId);
        }
    }

    /**
     * 开始计时
     * @param paperId
     */
    startCollectTimeForPaper(paperId, paperName) {
        this.paperId = paperId;
        var me = this;
        var item = me.localStorageUtil.getJSONArrayItem(me.LOCAL_STORAGE_DO_PAPER_TIME_KEY, me.LOCAL_STORAGE_DO_PAPER_TIME_PAPER_KEY, paperId);
        // this.localStorageUtil._storage.removeItem(this.LOCAL_STORAGE_DO_PAPER_TIME_KEY);
        this.localStorageUtil.deleteJSONArrayItem(me.LOCAL_STORAGE_DO_PAPER_TIME_KEY, this.LOCAL_STORAGE_DO_PAPER_TIME_PAPER_KEY, paperId);
        this.schduler.setSchdule(this.SAVE_DO_PAPER_TIME_SCHDULE.NAME, this.SAVE_DO_PAPER_TIME_SCHDULE.INTERVAL_TIME, function () {
            if (!item) item = me.localStorageUtil.getJSONArrayItem(me.LOCAL_STORAGE_DO_PAPER_TIME_KEY, me.LOCAL_STORAGE_DO_PAPER_TIME_PAPER_KEY, paperId);
            if (item[me.LOCAL_STORAGE_DO_PAPER_TIME_PAPER_KEY]) {
                item.count++;
                item.intervalTime += me.SAVE_DO_PAPER_TIME_SCHDULE.INTERVAL_TIME;
                //如果超过me.MAX_COUNT秒没有做任何操作，则不记录时间
                if (item.count >= me.MAX_COUNT) {
                    // item.intervalTime -= me.SAVE_DO_PAPER_TIME_SCHDULE.INTERVAL_TIME * item.count;
                    item.count = 0;
                    me.schduler.stopScheduler(me.SAVE_DO_PAPER_TIME_SCHDULE.NAME);
                }
            } else {
                item[me.LOCAL_STORAGE_DO_PAPER_TIME_PAPER_KEY] = paperId;
                item.count = 0;
                item.paperName = paperName;
                item.intervalTime = 0;
            }
            me.currentItem = item;
            // function resetCount() {
            //     var currentItem = me.localStorageUtil.getJSONArrayItem(me.LOCAL_STORAGE_DO_PAPER_TIME_KEY, me.LOCAL_STORAGE_DO_PAPER_TIME_PAPER_KEY, paperId);
            //     if (currentItem.count) {
            //         currentItem.count = 0;
            //         item.count=0;
            //     }
            //     me.localStorageUtil.saveOrUpdateJSONArray(me.LOCAL_STORAGE_DO_PAPER_TIME_KEY, [currentItem], me.LOCAL_STORAGE_DO_PAPER_TIME_PAPER_KEY);
            //     me.schduler.startScheduler(me.SAVE_DO_PAPER_TIME_SCHDULE.NAME);
            // }

            me.$documentBody.off('click', me.resetCount);
            me.$documentBody.on('click', me.resetCount);
            me.localStorageUtil.saveOrUpdateJSONArray(me.LOCAL_STORAGE_DO_PAPER_TIME_KEY, [item], me.LOCAL_STORAGE_DO_PAPER_TIME_PAPER_KEY);
        });
        this.schduler.startScheduler(this.SAVE_DO_PAPER_TIME_SCHDULE.NAME);
    }

    stopCollectTimeForPaper() {
        this.$documentBody.off('click');
        this.schduler.stopScheduler(this.SAVE_DO_PAPER_TIME_SCHDULE.NAME);
    }

    /**
     * 获取做题时间
     * @param paperId
     */
    getIntervalTime(paperId) {
        var rt;
        var item = this.localStorageUtil.getJSONArrayItem(this.LOCAL_STORAGE_DO_PAPER_TIME_KEY, this.LOCAL_STORAGE_DO_PAPER_TIME_PAPER_KEY, paperId);
        rt = item.intervalTime;
        return rt;
    }

    /**
     * 清除做题时间
     * @param paperId
     */
    clearIntervalTime(paperId) {
        var item = this.localStorageUtil.getJSONArrayItem(this.LOCAL_STORAGE_DO_PAPER_TIME_KEY, this.LOCAL_STORAGE_DO_PAPER_TIME_PAPER_KEY, paperId);
        if (item.intervalTime && typeof item.intervalTime == "number") {
            // this.localStorageUtil.saveOrUpdateJSONArray(this.LOCAL_STORAGE_DO_PAPER_TIME_KEY, [item], this.LOCAL_STORAGE_DO_PAPER_TIME_PAPER_KEY);
            this.localStorageUtil.deleteJSONArrayItem(this.LOCAL_STORAGE_DO_PAPER_TIME_KEY, this.LOCAL_STORAGE_DO_PAPER_TIME_PAPER_KEY, paperId);
        }
    }

    getAndClearIntervalTime(paperId) {
        var rt;
        var item = this.localStorageUtil.getJSONArrayItem(this.LOCAL_STORAGE_DO_PAPER_TIME_KEY, this.LOCAL_STORAGE_DO_PAPER_TIME_PAPER_KEY, paperId);
        rt = item.intervalTime;
        item.count = 0;
        item.intervalTime = 0;
        this.localStorageUtil.saveOrUpdateJSONArray(this.LOCAL_STORAGE_DO_PAPER_TIME_KEY, [item], this.LOCAL_STORAGE_DO_PAPER_TIME_PAPER_KEY);
        return rt;
    }

}

export  default TimeCollector;