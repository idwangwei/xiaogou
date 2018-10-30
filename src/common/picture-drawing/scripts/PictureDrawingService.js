/**
 * Created by LuoWen on 2017/2/23.
 */
import initWorker from './worker/initWorker'
import * as TASK_NAME from './worker/TaskName'
import {EVENTS} from './PictureDrawingConfig'

class PictureDrawingService {
    constructor($timeout, $q, $rootScope, $window) {
        this.$timeout = $timeout;
        this.$q = $q;
        this.$rootScope = $rootScope;
        // this.similarityNum = 0;
        this.share = {};
        this.$window = $window;

        console.log("init service");

        this.pdWorker = initWorker();
        this.addOnMessage();
    }

    addOnMessage() {
        let me = this;
        this.pdWorker.onmessage = function ({data: {options: {taskId, uuid}, taskName, ret}}) {
            console.log('Response: ', taskName, ret);

            switch (taskName) {
                case TASK_NAME.CALC_IMG_SIMILARITY:
                    me.share[uuid].similarityNum = ret.similarityNum;
                    me.share[uuid].usrPointRate = ret.usrPointRate;
                    break;
                default:
                    // console.log("ret", me.$window[taskName] = ret);
            }

            me.$rootScope.$broadcast(taskName + uuid, ret);
            me.$timeout(()=>me.$rootScope.$digest());
            console.timeEnd(`[${taskId}]`);
            me.share[uuid] && (me.share[uuid].calculating = false);
        };
    }

    postMessage(taskName, options) {
        let deferred = this.$q.defer();

        let taskId = new Date().getTime();
        options = options || {};
        options.taskId = taskId;
        console.time(`[${taskId}]`);

        this.pdWorker.postMessage({
            options,
            taskName: taskName,
            args: Array.prototype.slice.call(arguments, 2)
        });

        this.$rootScope.$on(taskName + options.uuid, function (evt, data) {
            deferred.resolve({evt, data});
        });

        return deferred.promise;
    }

    /**
     *
     */
    calcImgSimilarityV2() {
        return this.postMessage.apply(this,
            [TASK_NAME.CALC_IMG_SIMILARITY]
                .concat(Array.prototype.slice.call(arguments)));
    }

    extractCoords() {
        return this.postMessage.apply(this,
            [TASK_NAME.EXTRACT_COORDS]
                .concat(Array.prototype.slice.call(arguments)));
    }
    
    getCanvasProps(ctrl, props) {
        let deferred = ctrl.$q.defer();
        let scope = ctrl.getScope();
        scope.$on(EVENTS.POST_CANVAS_PROPS + ctrl.uuid, (evt, data)=> {
            deferred.resolve({evt, data});
        });
        scope.$broadcast(EVENTS.GET_CANVAS_PROPS + ctrl.uuid, props);
        return deferred.promise;
    }
}

PictureDrawingService.$inject = ["$timeout", "$q", "$rootScope", "$window"];


export default PictureDrawingService;
