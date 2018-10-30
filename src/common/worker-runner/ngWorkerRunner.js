/**
 * Created by 彭建伦 on 2016/5/31.
 * angular worker runner module
 */
import {createTaskRunner} from 'worker-runner/workerRunner';
let ngWorkerRunnerModule = angular.module('ngWorkerRunner', []);
let workerRunnerProvider = function () {
    this.taskRunner = null;
    this.createRunner = (tasks, worker_url)=> {
        this.taskRunner = createTaskRunner(tasks, worker_url);
    };
    this.$get = function () {
        return this.taskRunner;
    }
};
ngWorkerRunnerModule.provider('ngWorkerRunner', workerRunnerProvider);
